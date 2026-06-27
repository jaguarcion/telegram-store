'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Loader2, Store, ChevronRight, Search } from 'lucide-react';

export function ProductTable({ groupedProducts }: { groupedProducts: any[] }) {
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleGroup = (groupId: string) => {
    setSelectedGroup(selectedGroup === groupId ? null : groupId);
  };

  const categoriesMap: Record<string, any[]> = {};
  groupedProducts.forEach(group => {
    const cat = group.category || 'Other Services';
    if (!categoriesMap[cat]) categoriesMap[cat] = [];
    categoriesMap[cat].push(group);
  });

  const categories = Object.keys(categoriesMap).sort();

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  const handleBuy = (offer: any) => {
    window.open(`https://t.me/${offer.storeName}`, '_blank');
  };

  let currentGroups = activeCategory ? categoriesMap[activeCategory] || [] : [];
  
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    currentGroups = groupedProducts.filter(group => 
      group.name.toLowerCase().includes(query) || 
      (group.description && group.description.toLowerCase().includes(query)) ||
      group.offers.some((o: any) => o.name.toLowerCase().includes(query) || o.storeName.toLowerCase().includes(query))
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
        <input 
          type="text" 
          placeholder="Search for any product, service, or store..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-surface/50 backdrop-blur-md border border-surface-border rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all shadow-lg"
        />
      </div>

      {/* Category Navigation Tabs */}
      {!searchQuery && (
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setSelectedGroup(null); }}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${
                activeCategory === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-surface hover:bg-surface/80 text-text-muted hover:text-text border border-surface-border'
              }`}
            >
              {cat} <span className="ml-1 opacity-60 text-xs">({categoriesMap[cat].length})</span>
            </button>
          ))}
        </div>
      )}

      {/* Search Results Header */}
      {searchQuery && (
        <div className="text-sm text-text-muted font-medium px-2">
          Found {currentGroups.length} result{currentGroups.length !== 1 ? 's' : ''} for "{searchQuery}"
        </div>
      )}

      {/* Table Area */}
      <div className="glass rounded-xl overflow-hidden border border-surface-border/50 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface/50 border-b border-surface-border text-text-muted text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold w-7/12">Product Name</th>
                <th className="px-4 py-3 font-semibold text-center w-2/12">Offers</th>
                <th className="px-4 py-3 font-semibold text-right w-2/12">Best Price</th>
                <th className="px-4 py-3 font-semibold text-center w-1/12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50">
              {currentGroups.map((group: any) => (
                <React.Fragment key={group.id}>
                  <tr 
                    onClick={() => toggleGroup(group.id)}
                    className={`hover:bg-surface/40 transition-colors cursor-pointer group ${selectedGroup === group.id ? 'bg-surface/30' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-bold text-base text-text group-hover:text-primary transition-colors">{group.name}</div>
                      <div className="text-xs text-text-muted max-w-md truncate" title={group.description}>
                        {group.description || 'Premium digital product'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 text-[10px] uppercase font-bold bg-primary/10 text-primary rounded-md">
                        {group.offers.length} offer{group.offers.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="text-lg font-black text-green-400">
                        ${group.bestPrice?.toFixed(2) || '0.00'}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        className={`p-1.5 rounded-md transition-colors ${selectedGroup === group.id ? 'bg-primary text-white' : 'bg-surface text-text-muted group-hover:bg-primary/20 group-hover:text-primary'}`}
                      >
                        <ChevronRight size={18} className={`transform transition-transform ${selectedGroup === group.id ? 'rotate-90' : ''}`} />
                      </button>
                    </td>
                  </tr>
                  
                  {selectedGroup === group.id && (
                    <tr className="bg-black/20">
                      <td colSpan={4} className="p-0">
                        <div className="px-4 py-4 border-l-2 border-primary">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                            {group.offers.map((offer: any, idx: number) => (
                              <div key={offer.id + idx} className={`p-2.5 rounded-lg border flex flex-col justify-between ${idx === 0 ? 'border-green-500/30 bg-green-500/5' : 'border-surface-border bg-surface'}`}>
                                <div className="flex justify-between items-start mb-1.5">
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-[11px] uppercase tracking-wide flex items-center gap-1 text-text-muted truncate">
                                      <Store size={12} className="text-primary flex-shrink-0" /> 
                                      <span className="truncate">{offer.storeName}</span>
                                    </div>
                                    <div className="text-sm font-semibold text-text mt-0.5 line-clamp-1" title={offer.name}>{offer.name}</div>
                                  </div>
                                  {idx === 0 && <span className="text-[9px] uppercase font-black bg-green-500 text-black px-1.5 py-0.5 rounded ml-2 flex-shrink-0">Best</span>}
                                </div>
                                
                                <div className="flex items-end justify-between mt-2 pt-2 border-t border-surface-border/50">
                                  <div className="font-black text-base text-green-400">${offer.price.toFixed(2)}</div>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleBuy(offer); }}
                                    className="px-2.5 py-1.5 bg-primary hover:bg-primary-hover rounded-md transition-colors text-white text-xs font-bold flex items-center gap-1.5"
                                  >
                                    <ShoppingCart size={12} />
                                    Buy
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>


                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
