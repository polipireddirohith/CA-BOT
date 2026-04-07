import { motion } from 'framer-motion';
import { Target, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { HouseAnimation, BikeAnimation, GoldAnimation } from './GoalVisualizers';

interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
}

export default function GoalCard({ goal }: { goal: Goal }) {
  const progress = Math.min(Math.round((goal.current_amount / goal.target_amount) * 100), 100);
  const isHouse = goal.name.toLowerCase().includes('house') || goal.name.toLowerCase().includes('home');
  const isBike = goal.name.toLowerCase().includes('bike') || goal.name.toLowerCase().includes('car');
  const isGold = goal.name.toLowerCase().includes('gold') || goal.name.toLowerCase().includes('saving');

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ y: -5, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)' }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 relative z-10 overflow-hidden group shadow-lg"
    >
      <div className="flex items-center gap-4">
        {/* Animated Visualizer based on goal name */}
        <div className="shrink-0">
          {isHouse && <HouseAnimation progress={progress} />}
          {isBike && <BikeAnimation progress={progress} />}
          {isGold && <GoldAnimation progress={progress} />}
          {!isHouse && !isBike && !isGold && (
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-400">
               <Target size={28} />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="text-white font-bold truncate text-sm uppercase tracking-wider">{goal.name}</h4>
              <p className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                <Calendar size={10} /> {new Date(goal.deadline).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <span className={`text-xs font-black ${progress > 20 ? 'text-green-400' : 'text-blue-400'}`}>
                {progress}%
              </span>
            </div>
          </div>

          <div className="w-full bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden border border-white/5">
             <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               transition={{ duration: 1, ease: "easeOut" }}
               className={`h-full bg-gradient-to-r ${progress > 20 ? 'from-green-400 to-emerald-600' : 'from-blue-400 to-indigo-600'}`}
             />
          </div>
          
          <div className="flex justify-between mt-2 text-[10px] items-center">
             <span className="text-gray-400 font-bold">₹{goal.current_amount.toLocaleString()}</span>
             <span className="text-gray-600">Target: ₹{goal.target_amount.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {/* Background Glow Effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none blur-3xl rounded-full ${progress > 50 ? 'bg-green-500' : 'bg-blue-500'}`} />
    </motion.div>
  );
}
