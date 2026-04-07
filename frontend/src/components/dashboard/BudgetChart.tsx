import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BudgetChartProps {
  data: any;
}

export default function BudgetChart({ data }: BudgetChartProps) {
  if (!data) return (
    <div className="h-[300px] flex items-center justify-center bg-white/5 rounded-3xl border border-white/10 animate-pulse">
        <p className="text-gray-500 text-sm">Calibrating Analytics...</p>
    </div>
  );

  const chartData = [
    { name: 'Needs', limit: data.needs_limit, spent: data.needs_spent },
    { name: 'Wants', limit: data.wants_limit, spent: data.wants_spent },
    { name: 'Savings', limit: data.savings_limit, spent: data.savings_spent },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-[380px] w-full overflow-hidden shadow-2xl relative z-10"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Spending vs Limits</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Limit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Spent</span>
          </div>
        </div>
      </div>
      
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 11 }} 
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#4b5563', fontSize: 10 }}
                tickFormatter={(val) => `₹${val/1000}k`}
            />
            <Tooltip 
              cursor={{ fill: '#ffffff05' }}
              contentStyle={{ 
                backgroundColor: '#18181b', 
                border: '1px solid #ffffff10', 
                borderRadius: '12px',
                fontSize: '12px'
              }}
            />
            <Bar dataKey="limit" fill="#3b82f640" radius={[4, 4, 0, 0]} barSize={40} />
            <Bar dataKey="spent" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
