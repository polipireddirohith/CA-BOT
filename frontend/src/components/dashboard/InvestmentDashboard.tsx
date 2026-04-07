"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, ShieldCheck, Rocket, Coins, Info, IndianRupee } from 'lucide-react';
import { API_URL } from '@/utils/api';

export default function InvestmentDashboard() {
  const [investments, setInvestments] = useState<any>(null);
  const [showProjection, setShowProjection] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/investments`)
      .then(res => res.json())
      .then(data => setInvestments(data))
      .catch(err => console.error("Error fetching investments:", err));
  }, []);

  if (!investments) return <div className="h-40 flex items-center justify-center text-white/30">Analyzing risk profile... 🤖</div>;

  const chartData = investments.allocations.map((a: any) => ({
    name: a.category,
    value: a.amount,
    color: a.category.includes('Safe') ? '#10b981' : a.category.includes('Moderate') ? '#3b82f6' : a.category.includes('High') ? '#f43f5e' : '#f59e0b'
  }));

  // Simple growth projection for 5 years assuming 10% avg return
  const projectionData = [1, 2, 3, 4, 5].map(year => ({
    year: `Year ${year}`,
    balance: Math.round(investments.total_savings * 12 * ((Math.pow(1.10, year) - 1) / 0.10))
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
        <div>
          <h3 className="text-white font-bold text-lg">💡 Investment Engine</h3>
          <p className="text-gray-400 text-xs mt-1">Allocation for monthly savings: ₹{investments.total_savings.toLocaleString()}</p>
        </div>
        <button 
          onClick={() => setShowProjection(!showProjection)}
          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-blue-500/20"
        >
          {showProjection ? "Show Allocation" : "View Projection 📈"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {!showProjection ? (
          <motion.div 
            key="allocation"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Pie Chart */}
            <div className="h-64 bg-white/5 rounded-3xl p-4 border border-white/5 shadow-inner">
               <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie data={chartData} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                      {chartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', fontSize: '12px' }} />
                  </RePieChart>
               </ResponsiveContainer>
            </div>

            {/* List Detail */}
            <div className="space-y-3">
              {investments.allocations.map((alloc: any, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  key={alloc.category} 
                  className="bg-white/5 p-3 rounded-2xl border border-white/5 group hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-1">
                     <div className="flex items-center gap-2">
                        {alloc.category.includes('Safe') ? <ShieldCheck size={18} className="text-emerald-400" /> : 
                         alloc.category.includes('Moderate') ? <TrendingUp size={18} className="text-blue-400" /> :
                         alloc.category.includes('High') ? <Rocket size={18} className="text-rose-400" /> : 
                         <Coins size={18} className="text-amber-400" />}
                        <h4 className="text-white text-sm font-semibold">{alloc.category}</h4>
                     </div>
                     <span className="text-white font-bold text-sm flex items-center">
                        <IndianRupee size={12} /> {alloc.amount.toLocaleString()}
                     </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-2">{alloc.instruments.join(' • ')}</p>
                  <p className="text-[10px] text-blue-300 italic opacity-0 group-hover:opacity-100 transition-opacity">“{alloc.reason}”</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="projection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/5 p-6 rounded-3xl border border-white/5"
          >
            <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
               5-Year Wealth Projection <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">Based on strategy 🚀</span>
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectionData}>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                   <XAxis dataKey="year" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                   <YAxis hide />
                   <Tooltip 
                     cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                     contentStyle={{ backgroundColor: '#18181b', border: 'none', borderRadius: '12px', color: '#fff' }} 
                   />
                   <Bar dataKey="balance" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-gray-500 mt-4 italic text-center">
               Projection assumes re-investing dividends/returns and steady monthly contributions.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-2 bg-black/20 p-2 rounded-lg italic">
         <Info size={12} /> {investments.disclaimer}
      </div>
    </div>
  );
}
