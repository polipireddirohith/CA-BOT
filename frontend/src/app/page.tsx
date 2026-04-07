"use client";

import { useEffect, useState } from 'react';
import ChatBot from '@/components/dashboard/ChatBot';
import BudgetOverview from '@/components/dashboard/BudgetOverview';
import AnimatedGoal from '@/components/dashboard/AnimatedGoal';
import AddTransaction from '@/components/dashboard/AddTransaction';
import InvestmentDashboard from '@/components/dashboard/InvestmentDashboard';
import { PiggyBank, SavingsCelebration, SchoolGoal, ParentsCare } from '@/components/dashboard/GamifiedAnimations';
import { motion } from 'framer-motion';
import { Bell, Settings, Target, Plus, Info, Zap } from 'lucide-react';

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
    <div className="flex h-screen overflow-hidden p-4 md:p-6 gap-6 bg-zinc-950">
      
      {/* Sidebar - Small Widgets */}
      <aside className="w-20 hidden xl:flex flex-col gap-6 py-6 border-r border-white/5 pr-6 items-center">
         <PiggyBank trigger={true} />
         <div className="h-[1px] w-full bg-white/10" />
         <div className="flex flex-col gap-8 mt-10">
            <SchoolGoal step={2} />
            <ParentsCare progress={75} />
         </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-3xl">
          <div>
             <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
               Welcome back, Test User
             </h1>
             <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                <Zap size={14} className="text-amber-400" /> Professional Plan • Active
             </div>
          </div>
          <div className="flex gap-3 items-center">
             <AddTransaction />
             <div className="h-8 w-[1px] bg-white/10 mx-2" />
             <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-gray-300">
               <Bell size={20} />
             </button>
             <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-gray-300">
               <Settings size={20} />
             </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Financial Data */}
            <div className="space-y-8">
                <section>
                    <div className="flex justify-between items-end mb-4">
                        <h2 className="text-xl font-semibold text-white">Monthly Allocation</h2>
                    </div>
                    <BudgetOverview />
                </section>

                <section>
                    <InvestmentDashboard />
                </section>
            </div>

            {/* Right: Goals & Community */}
            <div className="space-y-8">
                <section>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Target className="text-blue-400" size={24} />
                            <h2 className="text-xl font-semibold text-white">Active Wealth Goals</h2>
                        </div>
                        <button className="flex items-center gap-2 text-xs bg-blue-600/20 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/20 hover:bg-blue-600/30 transition-colors font-bold">
                            <Plus size={16} /> NEW GOAL
                        </button>
                    </div>
                    <div className="space-y-4">
                        {goals.length === 0 ? (
                            <div className="text-center text-gray-500 p-12 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                No goals set yet. Let's start building!
                            </div>
                        ) : (
                            goals.map((goal, i) => (
                                <motion.div 
                                    key={goal.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <AnimatedGoal goal={goal} />
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>

                {/* Savings Milestone Notification / Celebration */}
                <SavingsCelebration />
            </div>
        </main>
      </div>

      {/* Right Area - Chatbot Desktop */}
      <div className="hidden 2xl:block w-[450px] h-full pl-4 border-l border-white/5">
        <ChatBot />
      </div>
    </div>
  );
}
