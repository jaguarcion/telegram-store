import axios from 'axios';

export interface CanbosoProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export const getStoreClient = (apiUrl: string, apiKey: string) => {
  return axios.create({
    baseURL: apiUrl,
    params: {
      api_key: apiKey
    },
    headers: {
      'Content-Type': 'application/json',
    },
    // Adding timeout so test APIs don't block the page load
    timeout: 5000,
  });
};

export const getStoreProducts = async (apiUrl: string, apiKey: string): Promise<CanbosoProduct[]> => {
  try {
    const client = getStoreClient(apiUrl, apiKey);
    const response = await client.get('/api/telegram-buyer/products');
    return response.data?.products || response.data || [];
  } catch (error: any) {
    console.error(`Error fetching products from ${apiUrl}: ${error?.message || 'Unknown error'}`);
    return [];
  }
};

export const purchaseStoreProduct = async (apiUrl: string, apiKey: string, productId: string, quantity: number = 1) => {
  try {
    const client = getStoreClient(apiUrl, apiKey);
    const response = await client.post('/api/telegram-buyer/purchase', {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error(`Error purchasing product from ${apiUrl}:`, error);
    throw error;
  }
};
