'use client';

import { useState } from 'react';
import { topUpBalance } from '@/actions/products';
import { PlusCircle, Loader2 } from 'lucide-react';

export function TopUpButton() {
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    setLoading(true);
    // Mock top up by $100 for testing purposes
    await topUpBalance(100);
    setLoading(false);
  };

  return (
    <button
      onClick={handleTopUp}
      disabled={loading}
      className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-white/10"
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : <PlusCircle size={20} />}
      {loading ? 'Processing...' : 'Top Up $100 (Test)'}
    </button>
  );
}
