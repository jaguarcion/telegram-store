import axios from 'axios';

export interface StandardizedProduct {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const getProductsViaAdapter = async (apiUrl: string, apiKey: string, format: string): Promise<StandardizedProduct[]> => {
  try {
    switch (format) {
      case 'CANBOSO': {
        const res = await axios.get(`${apiUrl}/api/telegram-buyer/products`, {
          params: { api_key: apiKey },
          timeout: 5000
        });
        const items = res.data?.products || res.data || [];
        return items.map((p: any) => ({
          id: String(p.id || p._id || Math.random()),
          name: String(p.name || p.product_name || 'Unknown Product'),
          price: Number(p.price || p.walletPricing || p.usdPricing || 0),
          description: String(p.description || p.description_raw || ''),
        }));
      }
      
      case 'XAPIKEY_V1': {
        // ToolsSheerid format
        const res = await axios.get(`${apiUrl}/api/v1/products`, {
          headers: { 'X-Api-Key': apiKey },
          timeout: 5000
        });
        const items = res.data?.products || res.data || [];
        return items.map((p: any) => ({
          id: String(p.product_id || p.id || Math.random()),
          name: String(p.name || 'Unknown'),
          price: Number(p.price || 0),
          description: String(p.description || ''),
        }));
      }

      case 'XAPIKEY': {
        // EcosystemAIShop format
        const res = await axios.get(`${apiUrl}/api/products`, {
          headers: { 'X-API-Key': apiKey },
          timeout: 5000
        });
        const items = res.data?.products || res.data || [];
        return items.map((p: any) => ({
          id: String(p.id || p.product_id || Math.random()),
          name: String(p.name || 'Unknown'),
          price: Number(p.price || 0),
          description: String(p.description || ''),
        }));
      }

      case 'BEARER_LARA': {
        // STOCK_lara format
        const res = await axios.get(`${apiUrl}/products`, {
          headers: { 'Authorization': `Bearer ${apiKey}` },
          timeout: 5000
        });
        const items = res.data?.products || res.data || [];
        return items.map((p: any) => ({
          id: String(p.id || Math.random()),
          name: String(p.name_en || p.name_ar || p.name || 'Unknown'),
          price: Number(p.price || 0),
          description: String(p.desc_en || p.desc_ar || ''),
        }));
      }

      case 'BEARER_AKUNDING': {
        // Akunding format
        const res = await axios.get(`${apiUrl}/api/v1/products`, {
          headers: { 'Authorization': `Bearer ${apiKey}` },
          timeout: 5000
        });
        const items = Array.isArray(res.data) ? res.data : (res.data?.products || []);
        return items.map((p: any) => ({
          id: String(p.id || Math.random()),
          name: String(p.name || 'Unknown'),
          price: Number(p.base_price || p.price || 0),
          description: String(p.description || ''),
        }));
      }

      default:
        console.warn(`Unknown API format: ${format}`);
        return [];
    }
  } catch (error: any) {
    console.error(`Error fetching products from ${apiUrl} (${format}): ${error?.message || 'Unknown error'}`);
    return [];
  }
};

export const purchaseViaAdapter = async (apiUrl: string, apiKey: string, format: string, productId: string, quantity: number = 1): Promise<any> => {
  switch (format) {
    case 'CANBOSO':
      return await axios.post(`${apiUrl}/api/telegram-buyer/purchase`, { productId, quantity }, { params: { api_key: apiKey } });
    case 'XAPIKEY_V1':
      return await axios.post(`${apiUrl}/api/v1/buy`, { product_id: productId, quantity }, { headers: { 'X-Api-Key': apiKey } });
    case 'XAPIKEY':
      return await axios.post(`${apiUrl}/api/buy`, { product_id: productId, quantity }, { headers: { 'X-API-Key': apiKey } });
    case 'BEARER_LARA':
      return await axios.post(`${apiUrl}/buy`, { product_id: productId, quantity }, { headers: { 'Authorization': `Bearer ${apiKey}` } });
    case 'BEARER_AKUNDING':
      return await axios.post(`${apiUrl}/api/v1/orders`, { product_id: productId, quantity }, { headers: { 'Authorization': `Bearer ${apiKey}` } });
    default:
      throw new Error(`Unsupported API format for purchase: ${format}`);
  }
};
