import { motion } from 'framer-motion';
import { IndianRupee, ShieldCheck, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

interface AllocationCardProps {
  name: string;
  spent: number;
  limit: number;
  icon: any;
  color: string;
}

export default function AllocationCards({ data }: { data: any }) {
  if (!data) return <div className="h-40 bg-white/5 animate-pulse rounded-3xl" />;

  const allocations = [
    { name: 'Needs', spent: data.needs_spent, limit: data.needs_limit, icon: ShieldCheck, color: 'blue' },
    { name: 'Wants', spent: data.wants_spent, limit: data.wants_limit, icon: Zap, color: 'purple' },
    { name: 'Savings', spent: data.savings_spent, limit: data.savings_limit, icon: TrendingUp, color: 'green' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 w-full overflow-hidden">
      {allocations.map((item, i) => {
        const progress = Math.min((item.spent / item.limit) * 100, 100);
        const overspent = progress >= 95;
        const healthy = progress < 70 && item.name === 'Savings';

        return (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
                opacity: 1, 
                scale: 1,
                x: overspent ? [0, -4, 4, -4, 4, 0] : 0 
            }}
            transition={{ 
                delay: i * 0.1, 
                x: overspent ? { duration: 0.4, repeat: Infinity, repeatDelay: 2 } : { type: 'spring' } 
            }}
            className={`bg-white/5 backdrop-blur-xl border ${overspent ? 'border-red-500/30 bg-red-500/5' : 'border-white/10'} rounded-3xl p-6 relative overflow-hidden shadow-xl`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${item.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : item.color === 'green' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                <item.icon size={20} />
              </div>
              <div className="text-right">
                <span className={`text-[10px] uppercase font-black ${overspent ? 'text-red-400' : 'text-gray-500'}`}>
                    {overspent ? 'Limit Reached' : item.name}
                </span>
                <div className="flex items-center gap-1 text-white font-black text-xl">
                  <IndianRupee size={16} /> {item.spent.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={`h-full ${overspent ? 'bg-red-500' : item.color === 'blue' ? 'bg-blue-500' : item.color === 'green' ? 'bg-green-500' : 'bg-purple-500'} transition-all`}
              />
            </div>
            
            <div className="flex justify-between mt-3">
              <span className="text-[10px] text-gray-500 font-bold">L: ₹{item.limit.toLocaleString()}</span>
              {overspent && <AlertTriangle size={12} className="text-red-500 animate-pulse" />}
              {!overspent && item.name === 'Savings' && <div className="text-[10px] text-green-400 animate-pulse font-bold">💪 Growth Active</div>}
            </div>
            
            {/* Glossy Aura */}
            <div className={`absolute -bottom-8 -left-8 w-24 h-24 blur-[40px] opacity-20 pointer-events-none rounded-full ${item.color === 'blue' ? 'bg-blue-500' : item.color === 'green' ? 'bg-green-500' : 'bg-purple-500'}`} />
          </motion.div>
        );
      })}
    </div>
  );
}
