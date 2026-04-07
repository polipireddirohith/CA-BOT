"use client";

import { motion } from 'framer-motion';

// 🎒 1. “School Fees Goal” – Kid Journey Animation
const stages = ["🎒", "📚", "🧑🎓", "🎓"];

export function SchoolGoal({ step }: { step: number }) {
  const currentStep = Math.min(step, stages.length - 1);
  return (
    <div className="text-center p-4">
      <motion.div
        key={currentStep}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="text-6xl mb-2"
      >
        {stages[currentStep]}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-gray-400 text-xs italic"
      >
        Investing in your child’s future 📖✨
      </motion.p>
    </div>
  );
}

// 👨👩👧 2. “Parents Savings” – Care & Love Animation
export function ParentsCare({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 relative h-32">
      <div className="flex items-center gap-3 text-5xl">
        <span>👴</span>
        <motion.span
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5
          }}
          className="text-red-500"
        >
          ❤️
        </motion.span>
        <span>👵</span>
      </div>

      <motion.div
        className="mt-4 text-xs text-blue-300 font-medium bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 10 ? 1 : 0.5 }}
      >
        Saving for loved ones 💛
      </motion.div>
    </div>
  );
}

// 🍔 3. Funny “Overspending on Food” Animation
export function FoodOverspend({ amount }: { amount: number }) {
  return (
    <div className="flex flex-col items-center p-2">
        <motion.div
            animate={{
                scale: amount > 80 ? [1, 1.3, 1.1] : 1,
                rotate: amount > 80 ? [0, 5, -5, 0] : 0
            }}
            transition={{ duration: 0.5, repeat: amount > 90 ? Infinity : 0 }}
            className="text-5xl"
        >
            🍔
        </motion.div>
        {amount > 90 && <p className="text-[10px] text-rose-400 mt-1 font-bold animate-pulse">STOP EATING OUT! 😅</p>}
    </div>
  );
}

// 👕 4. Shopping Addiction (Fun Tease)
export function ShoppingFun({ count }: { count: number }) {
  const displayCount = Math.min(count, 5);
  return (
    <div className="flex flex-col items-center">
        <div className="flex gap-1 text-3xl">
        {[...Array(displayCount)].map((_, i) => (
            <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            >
            👕
            </motion.div>
        ))}
        </div>
        {count > 3 && <p className="text-[10px] text-amber-400 mt-1 italic">Another shirt? Really? 😅</p>}
    </div>
  );
}

// 🎉 5. “You Saved Money!” Celebration
export function SavingsCelebration() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="text-center p-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl border border-emerald-500/20"
    >
      <div className="text-3xl mb-2">🎉</div>
      <h4 className="text-white font-bold text-sm">Pro Saver Badge!</h4>
      <p className="text-emerald-400 text-xs mt-1">You saved like a pro this week! 🪙🪙🪙</p>
    </motion.div>
  );
}

// 🐷 6. Piggy Bank Animation
export function PiggyBank({ trigger }: { trigger: boolean }) {
  return (
    <div className="flex flex-col items-center">
        <motion.div
            animate={trigger ? { y: [0, -15, 0], scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.4 }}
            className="text-5xl cursor-pointer"
        >
            🐷
        </motion.div>
        <p className="text-[10px] text-pink-400 font-bold mt-1 uppercase tracking-tighter">Savings Hub</p>
    </div>
  );
}
