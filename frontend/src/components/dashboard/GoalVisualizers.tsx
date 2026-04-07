import { motion } from 'framer-motion';
import { Home, Bricks, Warehouse, Building2, Trees } from 'lucide-react';

interface GoalAnimationProps {
  progress: number;
}

export function HouseAnimation({ progress }: GoalAnimationProps) {
  const step = Math.min(Math.floor(progress / 25), 4);
  
  return (
    <div className="relative w-16 h-16 flex items-center justify-center bg-blue-500/10 rounded-2xl overflow-hidden border border-blue-500/20">
      <motion.div
        animate={{ 
            scale: [1, 1.05, 1],
            rotate: step === 4 ? [0, 5, -5, 0] : 0 
        }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="text-blue-400"
      >
        {step === 0 && <Trees size={32} className="opacity-40" />}
        {step === 1 && <Bricks size={32} className="opacity-60" />}
        {step === 2 && <Warehouse size={32} className="opacity-80" />}
        {step === 3 && <Building2 size={32} />}
        {step >= 4 && <Home size={32} className="text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]" />}
      </motion.div>
      
      {/* Progress Fill Watermark */}
      <motion.div 
        initial={{ height: 0 }}
        animate={{ height: `${progress}%` }}
        className="absolute bottom-0 left-0 right-0 bg-blue-500/10 z-[-1]"
      />
    </div>
  );
}

export function BikeAnimation({ progress }: GoalAnimationProps) {
  const step = Math.min(Math.floor(progress / 25), 4);
  
  return (
    <div className="relative w-16 h-16 flex items-center justify-center bg-orange-500/10 rounded-2xl overflow-hidden border border-orange-500/20">
      <motion.div
        animate={{ 
            x: step === 4 ? [0, 5, -5, 0] : 0 
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-orange-400 flex flex-col items-center"
      >
         <div className="text-2xl">
            {step === 0 && "⭕"}
            {step === 1 && "🚲"}
            {step === 2 && "🏍️"}
            {step >= 3 && "🚀"}
         </div>
         <span className="text-[8px] font-bold mt-1 uppercase opacity-60">
            {step < 4 ? "Building..." : "Ready!"}
         </span>
      </motion.div>
    </div>
  );
}

export function GoldAnimation({ progress }: GoalAnimationProps) {
  const stacks = Math.min(Math.floor(progress / 10), 10);
  
  return (
    <div className="relative w-16 h-16 flex items-end justify-center bg-yellow-500/10 rounded-2xl overflow-hidden border border-yellow-500/20 p-2">
      <div className="flex flex-col-reverse gap-0.5 w-full">
        {Array.from({ length: stacks }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="h-1.5 w-full bg-gradient-to-r from-yellow-300 to-yellow-600 rounded-sm"
          />
        ))}
      </div>
    </div>
  );
}
