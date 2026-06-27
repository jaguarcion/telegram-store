import { fetchAggregatedProducts } from '@/actions/products';
import { ProductTable } from '@/components/ProductTable';

export default async function Home() {
  const groupedProducts = await fetchAggregatedProducts();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 py-12">
        <h1 className="text-5xl font-extrabold tracking-tight">
          Aggregated <span className="text-primary">Telegram</span> Market
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto text-lg">
          We compare prices across dozens of verified Telegram bots so you can find the best deal.
        </p>
      </div>

      {groupedProducts.length > 0 ? (
        <ProductTable groupedProducts={groupedProducts} />
      ) : (
        <div className="text-center py-20 text-text-muted glass rounded-2xl">
          No products available at the moment.
        </div>
      )}
    </div>
  );
}
