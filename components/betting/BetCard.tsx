import React, { useState } from 'react';
import { Bet, BetStatus, PLATFORM_FEE_PERCENT } from '../../types';
import { GlassCard, PrimaryButton, Badge } from '../ui/Glass';
import { Clock, Users, Coins, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppStore } from '../../services/mockStore';

interface BetCardProps {
  bet: Bet;
  onPlaceBet: (optionId: string, amount: number) => void;
  onResolve: (optionId: string) => void;
}

export const BetCard: React.FC<BetCardProps> = ({ bet, onPlaceBet, onResolve }) => {
  const { currentUser, participations } = useAppStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [stakeAmount, setStakeAmount] = useState<string>(bet.minStake.toString());
  const [isExpanded, setIsExpanded] = useState(false);

  const myParticipation = participations.find(p => p.betId === bet.id && p.userId === currentUser.id);
  const isCreator = bet.creatorId === currentUser.id;

  const handleBet = () => {
    if (selectedOption && stakeAmount) {
      onPlaceBet(selectedOption, parseFloat(stakeAmount));
    }
  };

  const getStatusColor = (s: BetStatus) => {
    switch (s) {
      case BetStatus.OPEN: return 'success';
      case BetStatus.VOTING: return 'warning';
      case BetStatus.RESOLVED: return 'neutral';
      default: return 'neutral';
    }
  };

  const poolAfterFee = bet.totalPot * (1 - PLATFORM_FEE_PERCENT);

  return (
    <GlassCard className="mb-4 group border-l-4 border-l-indigo-500">
      <div className="flex justify-between items-start mb-2">
        <div>
           <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">{bet.title}</h3>
           <p className="text-sm text-slate-400">{bet.description}</p>
        </div>
        <Badge variant={getStatusColor(bet.status)}>{bet.status}</Badge>
      </div>

      <div className="flex items-center space-x-4 text-xs text-slate-400 mt-3 mb-4">
        <div className="flex items-center space-x-1">
          <Coins className="w-3 h-3 text-amber-400" />
          <span>Pool: <span className="text-white font-mono">${bet.totalPot.toFixed(2)}</span></span>
        </div>
        <div className="flex items-center space-x-1">
           <Clock className="w-3 h-3" />
           <span>Ends {new Date(bet.deadline).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Betting Options */}
      <div className="space-y-2">
        {bet.options.map(opt => {
           const isSelected = selectedOption === opt.id;
           const isWinner = bet.status === BetStatus.RESOLVED; // Simplified: In real app, we check winning ID
           // Mocking winning ID visual for demo if resolved
           const mockWinningId = bet.options[0].id; 
           const actuallyWon = bet.status === BetStatus.RESOLVED && opt.id === mockWinningId;

           return (
            <button
              key={opt.id}
              disabled={bet.status !== BetStatus.OPEN || !!myParticipation}
              onClick={() => setSelectedOption(opt.id)}
              className={`w-full flex justify-between items-center p-3 rounded-lg border transition-all ${
                isSelected 
                  ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                  : actuallyWon 
                    ? 'bg-green-500/20 border-green-500 text-green-300'
                    : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{opt.text}</span>
              {myParticipation?.optionId === opt.id && <span className="text-xs bg-indigo-500 text-white px-2 py-0.5 rounded">My Pick</span>}
              {actuallyWon && <CheckCircle className="w-4 h-4" />}
            </button>
          );
        })}
      </div>

      {/* Action Area */}
      {bet.status === BetStatus.OPEN && !myParticipation && (
        <div className="mt-4 pt-4 border-t border-white/5 animate-fade-in">
          {!isExpanded ? (
             <PrimaryButton onClick={() => setIsExpanded(true)} className="w-full">Join Bet</PrimaryButton>
          ) : (
            <div className="flex items-center space-x-2">
               <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <input 
                    type="number" 
                    min={bet.minStake}
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2 pl-6 pr-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
               </div>
               <PrimaryButton onClick={handleBet} disabled={!selectedOption}>Confirm</PrimaryButton>
               <button onClick={() => setIsExpanded(false)} className="p-2 text-slate-400 hover:text-white">Cancel</button>
            </div>
          )}
          {isExpanded && <p className="text-xs text-slate-500 mt-2 text-center">Fee: 3% of winnings. Min stake: ${bet.minStake}</p>}
        </div>
      )}

      {/* Resolution Admin Panel */}
      {bet.status === BetStatus.OPEN && isCreator && (
         <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
            <button onClick={() => onResolve(bet.options[0].id)} className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>Simulate Resolution (Admin)</span>
            </button>
         </div>
      )}

      {myParticipation && bet.status === BetStatus.OPEN && (
         <div className="mt-4 text-center p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <p className="text-indigo-300 text-sm font-medium">You have staked ${myParticipation.amount.toFixed(2)}</p>
         </div>
      )}
    </GlassCard>
  );
};