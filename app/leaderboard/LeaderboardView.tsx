import React from 'react';
import { useAppStore } from '../../services/mockStore';
import { GlassCard, Avatar } from '../../components/ui/Glass';
import { Trophy, TrendingUp } from 'lucide-react';
import { User } from '../../types';

export const LeaderboardView = () => {
  const { users } = useAppStore();

  const sortedUsers = (Object.values(users) as User[]).sort((a, b) => b.balance - a.balance);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
         <div className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400">
            <Trophy className="w-8 h-8" />
         </div>
         <div>
           <h2 className="text-2xl font-bold text-white">Global Leaderboard</h2>
           <p className="text-slate-400">Top performers by total balance</p>
         </div>
      </div>

      <div className="grid gap-4">
        {sortedUsers.map((user, index) => (
           <GlassCard key={user.id} className="flex items-center justify-between !p-4 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-center space-x-4">
                 <div className={`w-8 h-8 flex items-center justify-center font-bold rounded-full ${
                   index === 0 ? 'bg-yellow-500 text-black' : 
                   index === 1 ? 'bg-slate-300 text-black' :
                   index === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-500'
                 }`}>
                   {index + 1}
                 </div>
                 <Avatar name={user.name} src={user.avatar} />
                 <div>
                    <h3 className="text-white font-bold">{user.name}</h3>
                    <div className="flex items-center text-xs text-green-400">
                       <TrendingUp className="w-3 h-3 mr-1" />
                       <span>Top 10%</span>
                    </div>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-indigo-300 font-mono font-bold text-lg">${user.balance.toFixed(2)}</p>
                 <p className="text-xs text-slate-500">Total Assets</p>
              </div>
           </GlassCard>
        ))}
      </div>
    </div>
  );
};