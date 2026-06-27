import { Telegraf, Markup } from 'telegraf';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

async function getUser(ctx: any) {
  const telegramId = ctx.from.id;
  let user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        telegramId: BigInt(telegramId),
        username: ctx.from.username,
        balance: 1000, 
      }
    });
  }
  return user;
}

import { fetchAggregatedProducts } from './src/lib/aggregation';
import { purchaseViaAdapter } from './src/lib/api-adapters';

bot.start(async (ctx) => {
  await getUser(ctx);
  ctx.reply('Welcome to the Aggregated Telegram Store! Compare and buy products from verified bots.', 
    Markup.inlineKeyboard([
      [Markup.button.callback('🛍️ Catalog', 'catalog')],
      [Markup.button.callback('👤 Profile', 'profile')]
    ])
  );
});

bot.action('catalog', async (ctx) => {
  try {
    const grouped = await fetchAggregatedProducts();
    
    if (grouped.length === 0) {
      return ctx.reply('No products available at the moment.');
    }

    // Since it's grouped by category now, maybe we just show top offers?
    // The web UI handles category nicely, but for bot it's an array of groups.
    for (const group of grouped.slice(0, 5)) {
      await ctx.reply(
        `**${group.name}**\nBest Price: $${group.bestPrice}\nFound ${group.offers.length} offers.`,
        Markup.inlineKeyboard([
          Markup.button.callback('Compare & Buy', `group_${group.id}`)
        ])
      );
    }
  } catch (error) {
    ctx.reply('Failed to fetch catalog.');
  }
});

bot.action(/^group_(.+)$/, async (ctx) => {
  const groupId = ctx.match[1];
  try {
    const grouped = await fetchAggregatedProducts();
    const group = grouped.find((g: any) => g.id === groupId);
    
    if (!group) return ctx.reply('Product group not found.');

    const buttons = group.offers.map((o: any) => [
      Markup.button.callback(`${o.storeName} - $${o.price}`, `buy_${o.storeId}_${o.id}`)
    ]);

    ctx.reply(`Offers for **${group.name}**:`, Markup.inlineKeyboard(buttons));
  } catch (error) {
    ctx.reply('Error loading offers.');
  }
});

bot.action('profile', async (ctx) => {
  const user = await getUser(ctx);
  ctx.reply(
    `👤 **Profile**\n\nBalance: $${user.balance.toFixed(2)}`,
    Markup.inlineKeyboard([
      [Markup.button.callback('💰 Top Up $100', 'topup')],
      [Markup.button.callback('📦 My Purchases', 'purchases')]
    ])
  );
});

bot.action('topup', async (ctx) => {
  const user = await getUser(ctx);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { balance: { increment: 100 } }
    }),
    prisma.transaction.create({
      data: {
        userId: user.id,
        amount: 100,
        type: 'topup',
        status: 'completed'
      }
    })
  ]);
  ctx.reply('✅ Successfully topped up $100 for testing.');
});

bot.action(/^buy_(.+)_(.+)$/, async (ctx) => {
  const storeId = ctx.match[1];
  const productId = ctx.match[2];
  const user = await getUser(ctx);
  
  try {
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) return ctx.reply('Store not found.');

    // Fetch product again to get price
    // Since we don't have the exact product, we fetch all and find it
    const storesData = await fetchAggregatedProducts();
    let product: any = null;
    for (const group of storesData) {
      const offer = group.offers.find((o: any) => String(o.id) === productId && o.storeId === storeId);
      if (offer) {
        product = offer;
        break;
      }
    }

    if (!product) return ctx.reply('Product no longer available.');

    const productPrice = product.price;
    const productName = product.name;

    if (user.balance < productPrice) {
      return ctx.reply('❌ Insufficient balance. Please top up your wallet.');
    }

    // Call Store API
    await purchaseViaAdapter(store.apiUrl, store.apiKey, store.apiFormat, product.id, 1);

    // Deduct balance and create records
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { balance: { decrement: productPrice } },
      }),
      prisma.transaction.create({
        data: {
          userId: user.id,
          amount: productPrice,
          type: 'purchase',
          status: 'completed'
        }
      }),
      prisma.order.create({
        data: {
          userId: user.id,
          storeId: store.id,
          productId: String(product.id || product._id),
          productName: productName,
          price: productPrice,
          status: 'completed'
        }
      })
    ]);

    ctx.reply(`✅ Successfully purchased ${productName} from ${store.name}!`);
  } catch (error: any) {
    ctx.reply(`❌ Purchase failed: ${error.message || 'Unknown error'}`);
  }
});

bot.action('purchases', async (ctx) => {
  const user = await getUser(ctx);
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: { store: true },
    take: 5
  });

  if (orders.length === 0) {
    return ctx.reply('You have no recent purchases.');
  }

  const list = orders.map((o) => `- ${o.productName} ($${o.price}) from ${o.store.name}`).join('\n');
  ctx.reply(`🛍️ **Recent Purchases**:\n${list}`);
});

bot.launch().then(() => console.log('Aggregator Bot is running...'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
