import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom'; 
import { AppProvider, useAppStore } from './services/mockStore';
import { Sidebar } from './components/layout/Sidebar';
import { GroupView } from './app/groups/[id]/GroupView';
import { WalletView } from './app/wallet/WalletView';
import { LeaderboardView } from './app/leaderboard/LeaderboardView';
import { Menu } from 'lucide-react';
import { GlassCard } from './components/ui/Glass';
import { CreateGroupModal } from './components/modals/CreateGroupModal';

const DashboardHome = () => {
  const { groups, createGroup } = useAppStore();
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const navigate = useNavigate();

  const handleCreateGroup = async (name: string, desc: string, img: string) => {
    const newId = await createGroup(name, desc, img);
    setShowCreateGroup(false);
    navigate(`/groups/${newId}`);
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Your Groups</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
           <div 
             key={group.id} 
             onClick={() => navigate(`/groups/${group.id}`)} 
             className="block group cursor-pointer"
           >
             <GlassCard className="h-full hover:scale-[1.02] transition-transform">
                <div className="h-32 -mx-6 -mt-6 mb-4 overflow-hidden">
                   <img src={group.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold text-white mb-1">{group.name}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{group.description}</p>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                   <span className="text-xs text-slate-500">{group.memberCount} Members</span>
                   <span className="text-xs text-indigo-400 font-medium group-hover:underline">Enter Group →</span>
                </div>
             </GlassCard>
           </div>
        ))}
        
        {/* Create Group Button */}
        <button 
          onClick={() => setShowCreateGroup(true)}
          className="h-full min-h-[250px] border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-slate-800/30 transition-all"
        >
           <div className="p-4 bg-slate-800 rounded-full mb-3">
             <span className="text-2xl">+</span>
           </div>
           <span className="font-medium">Create New Group</span>
        </button>
      </div>

      {showCreateGroup && (
        <CreateGroupModal 
          onClose={() => setShowCreateGroup(false)}
          onSubmit={handleCreateGroup}
        />
      )}
    </div>
  );
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background flex text-slate-200 font-sans">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
         {/* Mobile Header */}
         <div className="md:hidden flex items-center p-4 border-b border-white/10 bg-slate-900 sticky top-0 z-20">
           <button onClick={() => setMobileOpen(true)} className="mr-4 text-slate-400"><Menu /></button>
           <h1 className="text-lg font-bold text-white">Aligno</h1>
         </div>
         <main className="flex-1 relative overflow-y-auto">
            {children}
         </main>
      </div>
    </div>
  );
};

// Route wrapper
const AppRoutes = () => {
   return (
      <Routes>
         <Route path="/" element={<DashboardHome />} />
         <Route path="/wallet" element={<WalletView />} />
         <Route path="/leaderboard" element={<LeaderboardView />} />
         <Route path="/groups/:id" element={<GroupRouteWrapper />} />
         <Route path="*" element={<Navigate to="/" />} />
      </Routes>
   );
};

// Helper to extract params
const GroupRouteWrapper = () => {
   const { id } = useParams();
   return <GroupView groupId={id || ''} />;
}

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
           <AppRoutes />
        </Layout>
      </HashRouter>
    </AppProvider>
  );
};

export default App;