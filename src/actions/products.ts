'use server';

import { getProductsViaAdapter, purchaseViaAdapter } from '@/lib/api-adapters';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Mock get user id
const getUserId = async () => {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        username: 'testuser',
        balance: 1000,
      }
    });
  }
  return user.id;
};

import { fetchAggregatedProducts as fetchAggregatedProductsLogic } from '@/lib/aggregation';

export async function fetchAggregatedProducts() {
  return await fetchAggregatedProductsLogic();
}

export async function buyProduct(storeId: string, productId: string, price: number, productName: string) {
  try {
    const userId = await getUserId();
    
    // Check balance
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.balance < price) {
      return { success: false, error: 'Insufficient balance.' };
    }

    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return { success: false, error: 'Store not found.' };
    }

    // Call Store API
    const result = await purchaseViaAdapter(store.apiUrl, store.apiKey, store.apiFormat, productId, 1);

    // Deduct balance and create records
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { balance: { decrement: price } },
      }),
      prisma.transaction.create({
        data: {
          userId,
          amount: price,
          type: 'purchase',
          status: 'completed'
        }
      }),
      prisma.order.create({
        data: {
          userId,
          storeId: store.id,
          productId,
          productName,
          price,
          status: 'completed'
        }
      })
    ]);

    revalidatePath('/profile');
    
    return { success: true, data: result };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || 'Purchase failed' };
  }
}

export async function getUserProfile() {
  const userId = await getUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: { orderBy: { createdAt: 'desc' }, include: { store: true } },
      transactions: { orderBy: { createdAt: 'desc' } }
    }
  });
  return user;
}

export async function topUpBalance(amount: number) {
  const userId = await getUserId();
  
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: amount } }
    }),
    prisma.transaction.create({
      data: {
        userId,
        amount,
        type: 'topup',
        status: 'completed'
      }
    })
  ]);

  revalidatePath('/profile');
  return { success: true };
}
