import React, { ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

export const GlassCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`glass-panel rounded-xl p-6 shadow-xl border border-white/5 relative overflow-hidden ${className}`}
  >
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </div>
);

export const PrimaryButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
  <button 
    className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2 px-6 rounded-lg shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const OutlineButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => (
  <button 
    className={`border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-medium py-2 px-6 rounded-lg transition-all active:scale-95 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Input: React.FC<InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    className={`w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${className}`}
    {...props}
  />
);

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'neutral' | 'accent' }> = ({ children, variant = 'neutral' }) => {
  const colors = {
    success: 'bg-green-500/10 text-green-400 border-green-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    neutral: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    accent: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${colors[variant]}`}>
      {children}
    </span>
  );
};

export const Avatar: React.FC<{ src?: string; name: string; size?: 'sm' | 'md' | 'lg' }> = ({ src, name, size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden bg-slate-700 border-2 border-slate-600 flex items-center justify-center shrink-0`}>
      {src ? <img src={src} alt={name} className="w-full h-full object-cover" /> : <span className="text-white font-bold">{name[0]}</span>}
    </div>
  );
};