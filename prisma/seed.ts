import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.store.deleteMany(); // Clear existing stores
  
  await prisma.store.createMany({
    data: [
      // Canboso API Formats
      {
        name: 'aitoolify_bot',
        apiUrl: 'https://canboso.com',
        apiKey: 'tgb_e73655aa951169fa43ecac3f07486bc7497c23c3adb5e1b7',
        apiFormat: 'CANBOSO',
      },
      {
        name: 'KHANG_MMO_bot',
        apiUrl: 'https://canboso.com',
        apiKey: 'tgb_a57acf33ba1d370b5da0ad29e9db36fac203c91832a4f185',
        apiFormat: 'CANBOSO',
      },
      {
        name: 'startboyvn_bot',
        apiUrl: 'https://canboso.com',
        apiKey: 'tgb_598f0ecca035c6e15dbaeb0b9a7c66f6d6722715cdc10f09',
        apiFormat: 'CANBOSO',
      },
      {
        name: 'CheapLuxuryAI_bot',
        apiUrl: 'https://canboso.com',
        apiKey: 'tgb_3fe52b2e43f960af903f86601c24b1f0bfcf68bbd64fceda',
        apiFormat: 'CANBOSO',
      },
      {
        name: 'shopaizonee_binance_bot',
        apiUrl: 'https://canboso.com',
        apiKey: 'tgb_9a2b6fdf7315b9d742a01a1fe8556cf7afc554cc81734123',
        apiFormat: 'CANBOSO',
      },
      {
        name: 'shop_cron191_en_bot',
        apiUrl: 'https://canboso.com',
        apiKey: 'tgb_b3d4c391ae19895913d74fad2416264385526659f5518fd3',
        apiFormat: 'CANBOSO',
      },
      {
        name: 'snart_store_bot',
        apiUrl: 'https://canboso.com',
        apiKey: 'tgb_511e73ace785431495541db30695c27b5c5f129f99573694',
        apiFormat: 'CANBOSO',
      },
      
      // New Formats
      {
        name: 'Akunding_store_bot',
        apiUrl: 'https://akunding.shop',
        apiKey: 'ak_6O1ESzvQf2Nl_t5zqXHT0ZWOL7s4rZIblU6OVaDMFa8',
        apiFormat: 'BEARER_AKUNDING',
      },
      {
        name: 'EcosystemAIShop_bot',
        apiUrl: 'http://tunvnmmo.duckdns.org',
        apiKey: '8e5d6863e62d80743599e1c0627b2c76a675f352d58e8396b113d102c4e53487',
        apiFormat: 'XAPIKEY',
      },
      {
        name: 'STOCK_lara_bot',
        apiUrl: 'https://ins2112131.onrender.com/8f71aedd3494e042bb06408f50b7f938',
        apiKey: 'sk_8b06fe31891818a49b8b78a36d360e6683a037ddcd18da92',
        apiFormat: 'BEARER_LARA',
      },
      {
        name: 'ToolsSheerid_bot',
        apiUrl: 'https://seeking-monetary-infectious-healthcare.trycloudflare.com',
        apiKey: 'tools_470e8a003639d5a296377bb372a7217948b9f77e',
        apiFormat: 'XAPIKEY_V1',
      }
    ]
  });

  // Ensure standard products exist
  const count = await prisma.standardProduct.count();
  if (count === 0) {
    await prisma.standardProduct.createMany({
      data: [
        {
          name: 'Telegram Premium',
          description: 'Official Telegram Premium subscription.',
          keywords: 'telegram premium,tg premium',
        },
        {
          name: 'Claude Pro',
          description: 'Claude Pro subscription.',
          keywords: 'claude pro,claude ai pro',
        },
        {
          name: 'Discord Nitro',
          description: 'Discord Nitro subscription.',
          keywords: 'discord nitro,nitro boost',
        },
        {
          name: 'ChatGPT Plus',
          description: 'OpenAI ChatGPT Plus',
          keywords: 'chatgpt plus,gpt plus,chatgpt 4',
        },
        {
          name: 'Netflix Premium',
          description: 'Netflix Premium Account',
          keywords: 'netflix premium,netflix 4k',
        },
        {
          name: 'Spotify Premium',
          description: 'Spotify Premium Account',
          keywords: 'spotify premium,spotify family',
        },
        {
          name: 'Canva Pro',
          description: 'Canva Pro Subscription',
          keywords: 'canva pro,canva premium',
        }
      ]
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
