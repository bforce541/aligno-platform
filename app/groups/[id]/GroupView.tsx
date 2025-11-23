import React, { useEffect, useRef, useState } from 'react';
import { useAppStore } from '../../../services/mockStore';
import { Group, Message, Bet } from '../../../types';
import { GlassCard, Avatar, Input, PrimaryButton } from '../../../components/ui/Glass';
import { BetCard } from '../../../components/betting/BetCard';
import { Send, Users, PlusCircle } from 'lucide-react';
import { CreateBetModal } from '../../../components/modals/CreateBetModal';

interface GroupViewProps {
  groupId: string;
}

export const GroupView: React.FC<GroupViewProps> = ({ groupId }) => {
  const { groups, messages, bets, sendMessage, createBet, placeBet, resolveBet, currentUser } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [showCreateBet, setShowCreateBet] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const group = groups.find(g => g.id === groupId);
  const groupMessages = messages.filter(m => m.groupId === groupId);
  const groupBets = bets.filter(b => b.groupId === groupId);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupMessages]);

  if (!group) return <div>Group not found</div>;

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(groupId, inputText);
    setInputText('');
  };

  const renderMessage = (msg: Message) => {
    if (msg.isSystem && msg.relatedBetId) {
      const bet = groupBets.find(b => b.id === msg.relatedBetId);
      if (bet) {
        return (
          <div key={msg.id} className="my-4 px-4">
             <div className="flex items-center space-x-2 text-indigo-400 text-xs mb-2">
                <span className="h-px flex-1 bg-indigo-500/20"></span>
                <span>NEW BET CREATED</span>
                <span className="h-px flex-1 bg-indigo-500/20"></span>
             </div>
             <BetCard bet={bet} onPlaceBet={(optId, amt) => placeBet(bet.id, optId, amt)} onResolve={(winOpt) => resolveBet(bet.id, winOpt)} />
          </div>
        );
      }
    }

    const isMe = msg.userId === currentUser.id;
    return (
      <div key={msg.id} className={`flex mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
        {!isMe && <div className="mr-2 mt-1"><Avatar name={msg.userId} size="sm" /></div>}
        <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
          <p>{msg.text}</p>
          <span className="text-[10px] opacity-50 block text-right mt-1">
            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center space-x-3">
           <img src={group.imageUrl} className="w-10 h-10 rounded-lg object-cover" />
           <div>
             <h2 className="font-bold text-white leading-tight">{group.name}</h2>
             <div className="flex items-center text-xs text-slate-400">
               <Users className="w-3 h-3 mr-1" />
               {group.memberCount} members
             </div>
           </div>
        </div>
        <PrimaryButton onClick={() => setShowCreateBet(true)} className="flex items-center space-x-2 !px-3 !py-1.5 text-sm">
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Create Bet</span>
        </PrimaryButton>
      </header>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {/* Intro */}
        <div className="text-center py-8">
           <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-3">
              <Users className="w-8 h-8 text-indigo-500" />
           </div>
           <p className="text-slate-500 text-sm">Welcome to the start of {group.name}.<br/>Bet friendly, win big.</p>
        </div>

        {groupMessages.map(renderMessage)}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-slate-900/80 backdrop-blur-md">
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <Input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="pr-12"
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-white transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>

      {showCreateBet && (
        <CreateBetModal 
          onClose={() => setShowCreateBet(false)}
          onSubmit={(title, desc, min, opts, deadline) => createBet(groupId, title, desc, min, opts, deadline)}
        />
      )}
    </div>
  );
};