import React, { useState } from 'react';
import { GlassCard, PrimaryButton, OutlineButton, Input } from '../ui/Glass';
import { X, Plus, Trash2 } from 'lucide-react';

interface CreateBetModalProps {
  onClose: () => void;
  onSubmit: (title: string, desc: string, amount: number, options: string[], deadline: string) => void;
}

export const CreateBetModal: React.FC<CreateBetModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [minStake, setMinStake] = useState('10');
  const [options, setOptions] = useState(['Yes', 'No']);
  const [deadline, setDeadline] = useState('');

  const addOption = () => setOptions([...options, '']);
  const updateOption = (idx: number, val: string) => {
    const newOpts = [...options];
    newOpts[idx] = val;
    setOptions(newOpts);
  };
  const removeOption = (idx: number) => {
    if(options.length > 2) setOptions(options.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !minStake || options.some(o => !o.trim())) return;
    onSubmit(title, desc, parseFloat(minStake), options, deadline || new Date(Date.now() + 86400000).toISOString());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-fade-in-up">
        <GlassCard className="border-t border-t-indigo-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Create New Bet</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Question</label>
              <Input placeholder="e.g. Will John break 90 in golf?" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Description (Optional)</label>
              <textarea 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                rows={2}
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm text-slate-400 mb-1">Min Stake ($)</label>
                  <Input type="number" min="1" value={minStake} onChange={e => setMinStake(e.target.value)} required />
               </div>
               <div>
                  <label className="block text-sm text-slate-400 mb-1">Deadline</label>
                  <Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
               </div>
            </div>

            <div>
               <label className="block text-sm text-slate-400 mb-2">Outcomes</label>
               <div className="space-y-2">
                 {options.map((opt, idx) => (
                   <div key={idx} className="flex gap-2">
                     <Input value={opt} onChange={e => updateOption(idx, e.target.value)} placeholder={`Option ${idx + 1}`} required />
                     {options.length > 2 && (
                       <button type="button" onClick={() => removeOption(idx)} className="text-red-400 hover:bg-red-500/10 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                     )}
                   </div>
                 ))}
                 <button type="button" onClick={addOption} className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 mt-2">
                   <Plus className="w-4 h-4" /> <span>Add Outcome</span>
                 </button>
               </div>
            </div>

            <div className="pt-4 flex gap-3">
              <PrimaryButton type="submit" className="flex-1">Create Bet</PrimaryButton>
              <OutlineButton type="button" onClick={onClose}>Cancel</OutlineButton>
            </div>
            
            <p className="text-xs text-center text-slate-500">Platform Fee: 3% of total pot upon resolution.</p>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};