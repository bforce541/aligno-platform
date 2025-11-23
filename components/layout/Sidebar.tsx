import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Wallet, Trophy, Settings, LogOut } from 'lucide-react';

export const Sidebar = ({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (o: boolean) => void }) => {
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: Trophy, label: 'Leaderboard', path: '/leaderboard' },
    // Settings logic not implemented yet, pointing to dashboard for now or a placeholder
    // { icon: Settings, label: 'Settings', path: '/settings' }, 
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />}
      
      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 border-r border-white/10 flex flex-col z-50 transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-white">Ali</span>
            <span className="text-indigo-500">gno</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Bet friends. No excuses.</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => 
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="glass-panel p-4 rounded-xl">
            <p className="text-xs text-slate-400 mb-2">My Balance</p>
            <div className="text-xl font-bold text-white flex items-center justify-between">
              $250.00
              <Wallet className="w-4 h-4 text-emerald-400" />
            </div>
            <NavLink to="/wallet" className="text-xs text-indigo-400 mt-2 block hover:underline">Deposit funds →</NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};