import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ShieldCheck, Rocket, Coins, Info, IndianRupee } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { API_URL } from '@/utils/api';

export default function InvestmentPanel() {
  const [investments, setInvestments] = useState<any>(null);
  const [showProjection, setShowProjection] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/investments`)
      .then(res => res.json())
      .then(data => setInvestments(data))
      .catch(err => console.error("Error fetching investments:", err));
  }, []);

  if (!investments) return <div className="h-[400px] bg-white/5 animate-pulse rounded-3xl border border-white/10" />;

  const COLORS = ['#3b82f6', '#a855f7', '#f43f5e', '#eab308'];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl z-10 w-full min-h-[460px]"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-500/20 rounded-xl">
              <Rocket className="text-green-400" size={24} />
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">AI Investment Engine</h2>
          </div>
          <p className="text-sm text-gray-500 max-w-md">Our CA Engine suggests the best split for your ₹{investments.total_savings.toLocaleString()} savings this month.</p>
        </div>
        
        <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
          <button 
            onClick={() => setShowProjection(false)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${!showProjection ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            MONTHLY SPLIT
          </button>
          <button 
            onClick={() => setShowProjection(true)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${showProjection ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            5-YEAR WEALTH
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <AnimatePresence mode="wait">
          {!showProjection ? (
            <motion.div 
              key="allocation"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white/[0.02] p-8 rounded-[40px] border border-white/[0.03]"
            >
              <div className="h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={investments.allocations}
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="amount"
                      stroke="none"
                    >
                      {investments.allocations.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total</span>
                  <span className="text-xl font-black text-white">₹{investments.total_savings/1000}k</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {investments.allocations.map((alloc: any, i: number) => (
                  <div key={i} className="flex flex-col gap-1.5 p-3 rounded-2xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                        <span className="text-xs font-black text-white uppercase">{alloc.category}</span>
                      </div>
                      <span className="text-[10px] text-blue-400 font-black">{Math.round((alloc.amount/investments.total_savings)*100)}%</span>
                    </div>
                    <div className="text-sm font-bold text-gray-500 flex items-center gap-1">
                      <IndianRupee size={12} /> {alloc.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
               key="projection"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="h-72 w-full bg-white/[0.02] p-6 rounded-[40px] border border-white/[0.03]"
            >
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={investments.projections}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                     <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12}} />
                     <YAxis hide />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        formatter={(val: number) => `₹${val.toLocaleString()}`}
                     />
                     <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40}>
                        {investments.projections.map((entry: any, index: number) => (
                           <Cell key={`cell-${index}`} fillOpacity={0.3 + (index * 0.15)} />
                        ))}
                     </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-green-500/20 transition-all group shadow-inner">
             <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="text-blue-400" size={20} />
                <span className="text-xs font-black text-white uppercase tracking-widest">Strategies Identified</span>
             </div>
             <p className="text-sm text-gray-400 leading-relaxed italic line-clamp-3">"Based on your 25yo age profile and 'moderate' risk setting, we recommend SIPs in Index Funds to cover your house goal. Gold Bonds should provide the stability for your parents care goal."</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
             {['Mutual Funds', 'PPF', 'Crypto', 'SGB'].map(tag => (
                <span key={tag} className="px-4 py-2 bg-blue-500/5 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-500/10 cursor-pointer transition-all">
                   {tag}
                </span>
             ))}
          </div>
        </div>
      </div>
      
      {/* Dynamic Glow */}
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
    </motion.div>
  );
}
