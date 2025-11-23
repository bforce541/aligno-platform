import React, { useState } from 'react';
import { useAppStore } from '../../services/mockStore';
import { GlassCard, PrimaryButton } from '../../components/ui/Glass';
import { ArrowUpRight, ArrowDownLeft, DollarSign, Activity } from 'lucide-react';
import { DepositModal } from '../../components/modals/DepositModal';
import { Transaction } from '../../types';

export const WalletView = () => {
  const { currentUser, transactions, addFunds } = useAppStore();
  const [showDeposit, setShowDeposit] = useState(false);

  const myTransactions = transactions.filter(t => t.userId === currentUser.id);
  const totalWinnings = myTransactions.filter(t => t.type === 'PAYOUT').reduce((sum, t) => sum + t.amount, 0);
  const totalStaked = Math.abs(myTransactions.filter(t => t.type === 'STAKE').reduce((sum, t) => sum + t.amount, 0));

  const handleDeposit = (amount: number) => {
    addFunds(amount);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">Wallet & History</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <div className="md:col-span-2">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl"></div>
            
            <div className="relative z-10">
              <p className="text-indigo-100 text-sm font-medium mb-1">Total Balance</p>
              <h1 className="text-5xl font-bold text-white mb-6">${currentUser.balance.toFixed(2)}</h1>
              
              <div className="flex gap-4">
                <PrimaryButton onClick={() => setShowDeposit(true)} className="!bg-white !text-indigo-600 hover:!bg-indigo-50 shadow-none">
                  <span className="flex items-center"><ArrowUpRight className="w-4 h-4 mr-2" /> Add Funds</span>
                </PrimaryButton>
                <button className="px-6 py-2 rounded-lg bg-indigo-800/50 text-indigo-100 hover:bg-indigo-800 border border-indigo-400/30 transition-colors">
                  <span className="flex items-center"><ArrowDownLeft className="w-4 h-4 mr-2" /> Withdraw</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-rows-2 gap-4">
          <GlassCard className="flex flex-col justify-center">
             <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><DollarSign className="w-5 h-5" /></div>
                <span className="text-slate-400 text-sm">Total Winnings</span>
             </div>
             <p className="text-2xl font-bold text-white">+${totalWinnings.toFixed(2)}</p>
          </GlassCard>
          <GlassCard className="flex flex-col justify-center">
             <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400"><Activity className="w-5 h-5" /></div>
                <span className="text-slate-400 text-sm">Volume Bet</span>
             </div>
             <p className="text-2xl font-bold text-white">${totalStaked.toFixed(2)}</p>
          </GlassCard>
        </div>
      </div>

      {/* Transaction History */}
      <h3 className="text-lg font-bold text-white mt-8 mb-4">Recent Transactions</h3>
      <div className="bg-slate-900/50 border border-white/5 rounded-xl overflow-hidden">
         {myTransactions.length === 0 ? (
           <div className="p-8 text-center text-slate-500">No transactions yet.</div>
         ) : (
           myTransactions.map(tx => (
             <div key={tx.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                <div className="flex items-center space-x-4">
                   <div className={`p-2 rounded-full ${tx.amount > 0 ? 'bg-green-500/10 text-green-400' : 'bg-slate-700/50 text-slate-400'}`}>
                      {tx.amount > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                   </div>
                   <div>
                      <p className="text-white font-medium text-sm">{tx.description}</p>
                      <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleDateString()}</p>
                   </div>
                </div>
                <span className={`font-mono font-medium ${tx.amount > 0 ? 'text-green-400' : 'text-slate-300'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)}
                </span>
             </div>
           ))
         )}
      </div>

      {showDeposit && (
        <DepositModal 
          onClose={() => setShowDeposit(false)}
          onDeposit={handleDeposit}
        />
      )}
    </div>
  );
};