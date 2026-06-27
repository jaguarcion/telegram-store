'use client';

import { useState } from 'react';
import { ShoppingCart, Store, X } from 'lucide-react';

export function ProductCard({ group }: { group: any }) {
  const [showOffers, setShowOffers] = useState(false);

  const handleBuy = (offer: any) => {
    window.open(`https://t.me/${offer.storeName}`, '_blank');
  };

  return (
    <>
      <div className="glass rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group-card">
        <div>
          <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
            {group.name}
          </h3>
          <p className="text-text-muted text-sm mb-4 line-clamp-3">
            {group.description || 'Premium digital product available across multiple verified bots.'}
          </p>
          <div className="text-xs text-text-muted mb-4 font-medium">
            Found {group.offers.length} offer{group.offers.length !== 1 ? 's' : ''}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-surface-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-text-muted">Best Price</span>
              <span className="text-2xl font-black text-green-400">${group.bestPrice?.toFixed(2) || '0.00'}</span>
            </div>
            <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
              In Stock
            </span>
          </div>
          
          <button
            onClick={() => setShowOffers(true)}
            className="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Store size={20} />
            Compare Prices
          </button>
        </div>
      </div>

      {showOffers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-background border border-surface-border p-6 rounded-3xl max-w-md w-full shadow-2xl relative">
            <button 
              onClick={() => { setShowOffers(false); }}
              className="absolute top-4 right-4 p-2 bg-surface hover:bg-surface-border rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold mb-2">{group.name}</h2>
            <p className="text-text-muted text-sm mb-6">Select a store to purchase from.</p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {group.offers.map((offer: any, idx: number) => (
                <div key={offer.id + idx} className={`p-4 rounded-2xl border ${idx === 0 ? 'border-green-500/50 bg-green-500/5' : 'border-surface-border bg-surface'} flex justify-between items-center`}>
                  <div>
                    <div className="font-bold flex items-center gap-2">
                      <Store size={14} className="text-text-muted" /> {offer.storeName}
                      {idx === 0 && <span className="text-[10px] uppercase font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded">Best</span>}
                    </div>
                    <div className="text-xs text-text-muted mt-1">{offer.name}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="font-black">${offer.price.toFixed(2)}</div>
                    <button
                      onClick={() => handleBuy(offer)}
                      className="p-2 bg-primary hover:bg-primary-hover rounded-xl transition-colors"
                    >
                      <ShoppingCart size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>


          </div>
        </div>
      )}
    </>
  );
}
