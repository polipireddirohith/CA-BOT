"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, PieChart, TrendingUp, IndianRupee } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { API_URL } from '@/utils/api';

export default function BudgetOverview() {
  const [budget, setBudget] = useState<any>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/budget`)
      .then(res => res.json())
      .then(data => setBudget(data))
      .catch(err => console.error(err));
  }, []);

  if (!budget) {
    return <div className="h-full flex items-center justify-center text-white/50">Loading budget...</div>;
  }

  const data = [
    { name: 'Needs', value: budget.needs_spent, limit: budget.needs_limit, color: '#3b82f6' }, // Blue
    { name: 'Wants', value: budget.wants_spent, limit: budget.wants_limit, color: '#8b5cf6' }, // Violet
    { name: 'Savings & Goals', value: budget.savings_spent, limit: budget.savings_limit, color: '#10b981' }, // Emerald
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative overflow-hidden group"
          >
            <div 
              className="absolute top-0 right-0 w-32 h-32 opacity-20 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150 duration-700"
              style={{ backgroundColor: item.color }}
            />
            
            <h3 className="text-gray-400 text-sm font-medium mb-1">{item.name}</h3>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-2xl font-bold text-white flex items-center">
                <IndianRupee size={20} />
                {item.value.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 mb-1 flex items-center">
                / <IndianRupee size={12} className="ml-1" /> {item.limit.toLocaleString()}
              </span>
            </div>
            
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (item.value / item.limit) * 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: item.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visual Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-64 flex"
      >
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="transparent"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 flex flex-col justify-center gap-4">
          <h3 className="text-xl font-semibold text-white">Monthly Allocation</h3>
          <p className="text-sm text-gray-400">
            Based on the 50/30/20 rule, dynamically adjusted towards your goals.
          </p>
          <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-2 rounded-lg w-fit text-sm border border-emerald-400/20">
            <TrendingUp size={16} />
            <span>On track with savings</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
