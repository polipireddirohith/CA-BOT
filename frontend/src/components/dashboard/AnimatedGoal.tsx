"use client";

import { motion } from 'framer-motion';
import { Home, Car, Bike, CircleDollarSign, Loader2, IndianRupee } from 'lucide-react';

interface AnimatedGoalProps {
  goal: {
    name: string;
    category: string;
    target_amount: number;
    current_amount: number;
  };
}

export default function AnimatedGoal({ goal }: AnimatedGoalProps) {
  const progress = Math.min(100, Math.max(0, (goal.current_amount / goal.target_amount) * 100));

  // Determine icon and theme based on category
  let Icon = CircleDollarSign;
  let ThemeColor = "from-yellow-400 to-amber-600";
  let bgGlow = "bg-yellow-500/20";
  
  if (goal.category === 'HOUSE') {
    Icon = Home;
    ThemeColor = "from-blue-400 to-indigo-600";
    bgGlow = "bg-blue-500/20";
  } else if (goal.category === 'CAR') {
    Icon = Car;
    ThemeColor = "from-red-400 to-rose-600";
    bgGlow = "bg-red-500/20";
  } else if (goal.category === 'BIKE') {
    Icon = Bike;
    ThemeColor = "from-orange-400 to-red-500";
    bgGlow = "bg-orange-500/20";
  } else if (goal.category === 'GOLD') {
    Icon = CircleDollarSign;
    ThemeColor = "from-yellow-300 to-yellow-600";
    bgGlow = "bg-yellow-400/20";
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-5 relative overflow-hidden group">
      {/* Background Progress Fill */}
      <motion.div 
        className={`absolute left-0 top-0 bottom-0 opacity-[0.03] w-full bg-gradient-to-r ${ThemeColor} z-0`}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      {/* Icon Area */}
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative shrink-0 z-10`}>
        <div className={`absolute inset-0 rounded-2xl ${bgGlow} filter blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        <div className={`absolute inset-0 bg-gradient-to-b ${ThemeColor} opacity-20 rounded-2xl`} />
        
        {/* SVG Animation based on progress */}
        <motion.div
           initial={{ scale: 0.8, y: 10, opacity: 0 }}
           animate={{ scale: 1, y: 0, opacity: 1 }}
           className="relative z-10 text-white drop-shadow-lg"
        >
          <Icon size={32} />
        </motion.div>

        {/* Confetti or spark for completed */}
        {progress >= 100 && (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1 rounded-2xl border border-dashed border-yellow-400/50"
          />
        )}
      </div>

      {/* Info Area */}
      <div className="flex-1 z-10">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h4 className="font-semibold text-white tracking-wide">{goal.name}</h4>
            <p className="text-xs text-gray-400 mt-0.5">{progress.toFixed(1)}% Completed</p>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold text-white flex items-center justify-end">
              <IndianRupee size={12} className="mr-0.5" />
              {goal.current_amount.toLocaleString()} 
            </span>
            <span className="text-xs text-gray-500 flex items-center justify-end">
              / <IndianRupee size={10} className="ml-0.5 mr-0.5" /> {goal.target_amount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Custom Progress Bar */}
        <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
            className={`absolute top-0 left-0 bottom-0 bg-gradient-to-r ${ThemeColor} rounded-full`}
          >
            {/* Shimmer effect inside progress */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
