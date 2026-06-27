import prisma from './prisma';
import { getProductsViaAdapter } from './api-adapters';

export async function fetchAggregatedProducts() {
  const stores = await prisma.store.findMany({ where: { isActive: true } });
  const standards = await prisma.standardProduct.findMany();
  
  const allOffers: any[] = [];

  // Fetch all stores concurrently
  const fetchPromises = stores.map(store => 
    getProductsViaAdapter(store.apiUrl, store.apiKey, store.apiFormat).then(products => ({ store, products }))
  );

  const results = await Promise.allSettled(fetchPromises);

  results.forEach(result => {
    if (result.status === 'fulfilled' && result.value.products.length > 0) {
      const { store, products } = result.value;
      
      products.forEach((p: any) => {
        let matchedStandard = null;
        
        const rawName = p.name.toLowerCase().replace(/[^a-z0-9]/g, '');

        for (const std of standards) {
          const keywords = std.keywords.split(',').map((k: string) => k.trim().toLowerCase().replace(/[^a-z0-9]/g, ''));
          if (keywords.some((k: string) => k.length > 3 && rawName.includes(k))) {
            matchedStandard = std;
            break;
          }
        }

        allOffers.push({
          ...p,
          storeId: store.id,
          storeName: store.name,
          standardId: matchedStandard?.id || null,
          standardName: matchedStandard?.name || p.name,
          standardDescription: matchedStandard?.description || p.description,
        });
      });
    }
  });

  // Group the offers by standardName
  const grouped: Record<string, any> = {};
  for (const offer of allOffers) {
    const key = offer.standardId || offer.name; // Group by standard ID or exact name
    if (!grouped[key]) {
      // Determine category
      const CATEGORY_MAP = [
        { name: 'AI & Neural Networks', keywords: ['chatgpt', 'claude', 'midjourney', 'openai', 'elevenlabs', 'copilot', 'gemini', 'runway', 'capcut', 'meshy', 'pika', 'suno'] },
        { name: 'Social Media & Boost', keywords: ['tiktok', 'instagram', 'facebook', 'twitter', 'youtube', 'x.com', 'stars', 'likes', 'followers', 'views', 'telegram'] },
        { name: 'Streaming & Music', keywords: ['netflix', 'spotify', 'crunchyroll', 'disney', 'hbo', 'prime'] },
        { name: 'VPN & Proxies', keywords: ['vpn', 'proxy', 'ip', 'nordvpn', 'expressvpn', 'surfshark', 'outline', 'wireguard', 'vless', 'shadowsocks'] },
        { name: 'Work & Education', keywords: ['canva', 'adobe', 'office', 'coursera', 'duolingo', 'linkedin', 'github'] },
        { name: 'Gaming & Keys', keywords: ['steam', 'xbox', 'playstation', 'gamepass', 'pubg', 'valorant', 'riot', 'v-bucks', 'robux', 'discord'] },
      ];
      
      let category = 'Other Services';
      const rawNameForCat = offer.standardName.toLowerCase();
      for (const cat of CATEGORY_MAP) {
        if (cat.keywords.some(k => rawNameForCat.includes(k))) {
          category = cat.name;
          break;
        }
      }

      grouped[key] = {
        id: key,
        name: offer.standardName,
        description: offer.standardDescription,
        category: category,
        offers: [],
      };
    }
    grouped[key].offers.push(offer);
  }

  // Sort offers by price within each group
  const result = Object.values(grouped).map((group: any) => {
    group.offers.sort((a: any, b: any) => a.price - b.price);
    group.bestPrice = group.offers[0].price;
    return group;
  });

  return result;
}
