import { getUserProfile } from '@/actions/products';
import { TopUpButton } from '@/components/TopUpButton';
import { Wallet, Package, Clock } from 'lucide-react';

export default async function ProfilePage() {
  const user = await getUserProfile();

  if (!user) {
    return <div className="text-center py-20">Please log in.</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="glass p-6 rounded-3xl col-span-1 md:col-span-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 text-text-muted mb-2">
              <Wallet className="text-primary" />
              <span className="font-medium">Current Balance</span>
            </div>
            <div className="text-5xl font-black mb-6">${user.balance.toFixed(2)}</div>
          </div>
          <TopUpButton />
        </div>

        {/* Stats */}
        <div className="glass p-6 rounded-3xl col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
           <div className="bg-background/50 rounded-2xl p-6 flex flex-col justify-center items-center text-center border border-surface-border">
             <Package size={32} className="text-primary mb-2" />
             <div className="text-3xl font-bold">{user.orders.length}</div>
             <div className="text-sm text-text-muted">Total Purchases</div>
           </div>
           <div className="bg-background/50 rounded-2xl p-6 flex flex-col justify-center items-center text-center border border-surface-border">
             <Clock size={32} className="text-primary mb-2" />
             <div className="text-3xl font-bold">{user.transactions.length}</div>
             <div className="text-sm text-text-muted">Transactions</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        {/* Orders History */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="text-primary" /> Purchases
          </h2>
          <div className="glass rounded-2xl overflow-hidden">
            {user.orders.length > 0 ? (
              <div className="divide-y divide-surface-border">
                {user.orders.map((order: any) => (
                  <div key={order.id} className="p-4 flex justify-between items-center hover:bg-surface transition-colors">
                    <div>
                      <div className="font-bold">{order.productName}</div>
                      <div className="text-xs text-text-muted">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="font-mono bg-primary/10 text-primary px-3 py-1 rounded-lg">
                      ${order.price.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-text-muted">No purchases yet.</div>
            )}
          </div>
        </div>

        {/* Transactions History */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="text-primary" /> Transactions
          </h2>
          <div className="glass rounded-2xl overflow-hidden">
            {user.transactions.length > 0 ? (
              <div className="divide-y divide-surface-border">
                {user.transactions.map((tx: any) => (
                  <div key={tx.id} className="p-4 flex justify-between items-center hover:bg-surface transition-colors">
                    <div>
                      <div className="font-bold capitalize">{tx.type}</div>
                      <div className="text-xs text-text-muted">{new Date(tx.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className={`font-mono px-3 py-1 rounded-lg ${tx.type === 'topup' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {tx.type === 'topup' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-text-muted">No transactions yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
