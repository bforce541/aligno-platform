import React, { useState } from 'react';
import { GlassCard, PrimaryButton, OutlineButton, Input } from '../ui/Glass';
import { X } from 'lucide-react';

interface CreateGroupModalProps {
  onClose: () => void;
  onSubmit: (name: string, description: string, imageUrl: string) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    // Default image if none provided using a random seed based on name
    const finalImage = imageUrl.trim() || `https://picsum.photos/seed/${name.replace(/\s/g, '')}/400/400`;
    
    onSubmit(name, description, finalImage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg animate-fade-in-up">
        <GlassCard className="border-t border-t-indigo-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Create New Group</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><X /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Group Name</label>
              <Input 
                placeholder="e.g. Crypto Bros" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Description</label>
              <textarea 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                rows={3}
                placeholder="What is this group betting on?"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1">Cover Image URL (Optional)</label>
              <div className="flex gap-2">
                 <div className="flex-1">
                    <Input 
                        placeholder="https://..." 
                        value={imageUrl} 
                        onChange={e => setImageUrl(e.target.value)} 
                    />
                 </div>
                 {imageUrl && (
                    <div className="w-10 h-10 rounded overflow-hidden border border-slate-600 shrink-0">
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                 )}
              </div>
              <p className="text-xs text-slate-500 mt-1">Leave blank for a random image.</p>
            </div>

            <div className="pt-4 flex gap-3">
              <PrimaryButton type="submit" className="flex-1">Create Group</PrimaryButton>
              <OutlineButton type="button" onClick={onClose}>Cancel</OutlineButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};