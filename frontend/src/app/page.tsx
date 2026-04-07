"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Settings, Target, Plus, Info, Zap, 
  LayoutDashboard, PieChart, Wallet, UserCircle 
} from 'lucide-react';

import ChatBot from '@/components/dashboard/ChatBot';
import AllocationCards from '@/components/dashboard/AllocationCards';
import GoalCard from '@/components/dashboard/GoalCard';
import BudgetChart from '@/components/dashboard/BudgetChart';
import InvestmentPanel from '@/components/dashboard/InvestmentPanel';
import AddTransaction from '@/components/dashboard/AddTransaction';
import TaxAdvisor from '@/components/dashboard/TaxAdvisor';
import { API_URL } from '@/utils/api';

export default function Dashboard() {
  const [goals, setGoals] = useState<any[]>([]);
  const [budget, setBudget] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/goals`)
      .then(res => res.json())
      .then(data => setGoals(data))
      .catch(err => console.error("Error fetching goals:", err));
      
    fetch(`${API_URL}/api/budget`)
      .then(res => res.json())
      .then(data => setBudget(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-white overflow-hidden p-4 md:p-6 gap-6 font-sans">
      
      {/* 🚀 Ultra-Clean Minimal Sidebar */}
      <aside className="w-20 hidden xl:flex flex-col items-center py-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] shrink-0 gap-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-900/40">
              <Zap className="text-white" size={24} />
          </div>
          <div className="flex-1 flex flex-col gap-6">
              {[LayoutDashboard, PieChart, Target, Wallet, UserCircle].map((Icon, i) => (
                  <button key={i} className={`p-4 rounded-2xl transition-all ${i === 0 ? 'bg-white/10 text-white shadow-xl' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
                      <Icon size={22} />
                  </button>
              ))}
          </div>
          <div className="p-4 bg-white/5 rounded-2xl text-gray-500 hover:text-white transition-colors cursor-pointer border border-white/5">
              <Settings size={22} />
          </div>
      </aside>

      {/* 📊 Main Content - 12 Column Grid System */}
      <div className="flex-1 h-full overflow-y-auto scrollbar-hide space-y-8 pr-2 pb-12 relative z-0">
        
        {/* 🗺 ROW 1: Welcome & Allocation (8 cols) + Top Goal (4 cols) */}
        <div className="grid grid-cols-12 gap-6 items-start">
            {/* Header + Allocation Cards */}
            <div className="col-span-12 xl:col-span-8 flex flex-col gap-8">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[40px] gap-4 shadow-xl">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                            <Zap size={14} className="animate-pulse" /> Live Economy Access
                        </div>
                        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 tracking-tighter">
                            Hi, Test User
                        </h1>
                    </div>
                    <div className="flex gap-3 items-center shrink-0">
                        <AddTransaction />
                        <div className="h-10 w-[1px] bg-white/10 mx-2 hidden sm:block" />
                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-gray-300">
                            <Bell size={20} />
                        </button>
                    </div>
                </header>

                <section className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest">Monthly Allocation Strategy</h2>
                        <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded-full">50/30/20 Optimised</span>
                    </div>
                    <AllocationCards data={budget} />
                </section>
            </div>

            {/* Featured Goal (Right Top) */}
            <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
                <section className="space-y-4 h-full flex flex-col">
                    <div className="flex justify-between items-center px-2">
                        <div className="flex items-center gap-2">
                            <Target className="text-blue-400" size={16} />
                            <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest leading-none">Primary Target</h2>
                        </div>
                        <button className="text-[10px] font-black text-blue-400 hover:text-white transition-colors uppercase tracking-widest">Manage All</button>
                    </div>
                    <div className="flex-1">
                        {goals.length > 0 ? (
                           <GoalCard goal={goals[0]} />
                        ) : (
                           <div className="h-full min-h-[160px] bg-white/5 rounded-3xl border border-dashed border-white/10 flex items-center justify-center p-8 text-center text-gray-600 text-xs">
                               No active wealth milestones found.
                           </div>
                        )}
                    </div>
                    <TaxAdvisor />
                </section>
            </div>
        </div>

        {/* 🗺 ROW 2: High Performance Chart (8 cols) + Goals List (4 cols) */}
        <div className="grid grid-cols-12 gap-6 items-start">
             <div className="col-span-12 xl:col-span-8">
                 <BudgetChart data={budget} />
             </div>

             <div className="col-span-12 xl:col-span-4">
                 <div className="space-y-6 bg-white/[0.03] backdrop-blur-3xl border border-white/5 p-6 rounded-[40px] shadow-2xl">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Goal Pipeline</h2>
                        <button className="p-1.5 bg-blue-600 rounded-lg text-white shadow-lg hover:rotate-90 transition-all">
                            <Plus size={14} />
                        </button>
                    </div>
                    <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2 scrollbar-none">
                        {goals.slice(1).length === 0 ? (
                             <div className="py-12 text-center text-[10px] text-gray-600 uppercase tracking-widest border border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
                                 Vault Empty
                             </div>
                        ) : (
                            goals.slice(1).map((goal) => (
                                <GoalCard key={goal.id} goal={goal} />
                            ))
                        )}
                    </div>
                 </div>
             </div>
        </div>

        {/* 🗺 ROW 3: Full-Width Intelligence Panel */}
        <div className="w-full relative z-10 pb-8">
           <InvestmentPanel />
        </div>

      </div>

      {/* 🤖 Sidebar AI Area (On larger desktops) */}
      <div className="hidden 2xl:block w-[400px] h-full shrink-0 border-l border-white/10 pl-6 rounded-[40px] relative z-20">
        <ChatBot />
      </div>

    </div>
  );
}
