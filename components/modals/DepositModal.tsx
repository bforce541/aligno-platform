import React, { useState } from 'react';
import { GlassCard, PrimaryButton, OutlineButton, Input } from '../ui/Glass';
import { X, CreditCard, Loader2 } from 'lucide-react';

interface DepositModalProps {
  onClose: () => void;
  onDeposit: (amount: number) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({ onClose, onDeposit }) => {
  const [amount, setAmount] = useState('100');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      onDeposit(parseFloat(amount));
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md animate-fade-in-up">
        <GlassCard className="border-t border-t-emerald-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              Deposit Funds
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
               <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Select Amount</label>
               <div className="flex gap-2 mb-4">
                  {[50, 100, 250, 500].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                        amount === val.toString() 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      ${val}
                    </button>
                  ))}
               </div>
               
               <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Custom Amount</label>
               <div className="relative">
                 <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">$</span>
                 <Input 
                   type="number" 
                   min="1" 
                   className="pl-8 text-2xl font-bold text-emerald-400" 
                   value={amount}
                   onChange={e => setAmount(e.target.value)}
                 />
               </div>
            </div>

            <div className="pt-2">
              <PrimaryButton 
                type="submit" 
                className="w-full !bg-gradient-to-r !from-emerald-600 !to-teal-600 hover:!from-emerald-500 hover:!to-teal-500 flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirm Deposit'}
              </PrimaryButton>
              <p className="text-center text-xs text-slate-500 mt-3">
                Secure payment processed via MockPay™
              </p>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};