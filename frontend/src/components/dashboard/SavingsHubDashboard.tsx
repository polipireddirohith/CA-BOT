import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Savings Hub Dashboard
 * 
 * A high-performance financial dashboard merging Framer Motion animations 
 * with a strict Tailwind CSS layout.
 * 
 * Rules Adhered to:
 * 1. No absolute/fixed positioning for content/layout.
 * 2. Normal document flow (Flexbox + Grid).
 * 3. NO overlapping elements.
 * 4. Premium Dark Theme with vibrant accents.
 */

// --- Constants & Types ---
const BUDGET_RULE = {
  needs: 50,
  wants: 30,
  savings: 20
};

// --- Animations Components (Refactored to be self-contained) ---

const HouseAnim = ({ p }: { p: number }) => {
  const step = Math.floor(p / 25);
  return (
    <div className="relative w-24 h-24 mx-auto flex items-end justify-center overflow-hidden border border-gray-800/50 rounded-lg bg-gray-900/50">
      <div className="w-full h-2 bg-amber-900/40" /> {/* Base/Ground */}
      <AnimatePresence>
        {step >= 1 && (
          <motion.div 
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
            className="absolute bottom-2 w-16 h-2 bg-yellow-800/60 rounded-sm origin-bottom" 
          />
        )}
        {step >= 2 && (
          <motion.div 
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
            className="absolute bottom-4 w-12 h-10 bg-blue-600 rounded-t-md origin-bottom flex items-center justify-center"
          >
            <div className="w-4 h-6 bg-blue-900/60 rounded-t-sm mt-4" />
          </motion.div>
        )}
        {step >= 3 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-14 w-0 h-0 border-l-[32px] border-l-transparent border-r-[32px] border-r-transparent border-b-[20px] border-b-emerald-500"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const BikeAnim = ({ p }: { p: number }) => {
  const step = Math.floor(p / 25);
  const spin = p > 30;
  return (
    <div className="relative w-24 h-24 mx-auto flex items-end justify-center border border-gray-800/50 rounded-lg bg-gray-900/50">
      <div className="flex gap-8 mb-2">
        <motion.div 
          animate={{ rotate: spin ? 360 : 0 }}
          transition={{ duration: 1, repeat: spin ? Infinity : 0, ease: "linear" }}
          className="w-6 h-6 rounded-full border-2 border-amber-500 border-t-transparent"
        />
        <motion.div 
          animate={{ rotate: spin ? 360 : 0 }}
          transition={{ duration: 1, repeat: spin ? Infinity : 0, ease: "linear" }}
          className="w-6 h-6 rounded-full border-2 border-amber-500 border-t-transparent"
        />
      </div>
      {step >= 2 && (
        <div className="absolute top-8 w-16 h-1 border-t-2 border-amber-400 rotate-[-35deg]" />
      )}
    </div>
  );
};

const GoldAnim = ({ p }: { p: number }) => {
  const total = Math.round((p / 100) * 9);
  const bars = Array.from({ length: total });
  return (
    <div className="w-24 h-24 mx-auto flex flex-wrap gap-1 content-end justify-center p-2 border border-gray-800/50 rounded-lg bg-gray-900/50">
      <AnimatePresence>
        {bars.map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="w-6 h-3 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 rounded-sm shadow-sm"
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const CarAnim = ({ p }: { p: number }) => {
  const step = Math.floor(p / 25);
  return (
    <div className="relative w-24 h-24 mx-auto flex flex-col items-center justify-end pb-2 border border-gray-800/50 rounded-lg bg-gray-900/50">
      {step >= 2 && <div className="w-12 h-6 bg-pink-500 rounded-t-lg mb-[-2px]" />}
      {step >= 1 && <div className="w-16 h-5 bg-pink-600 rounded-md" />}
      <div className="flex gap-8 mt-1">
        <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
        <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
      </div>
    </div>
  );
};

// --- Sub-components ---

const Counter = ({ to, prefix = "", suffix = "" }: { to: number, prefix?: string, suffix?: string }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = val;
    const end = to;
    const duration = 1000;
    let startTime: number | null = null;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      setVal(Math.floor(progress * (end - start) + start));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [to]);

  return <span>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>;
};

const ProgressBar = ({ pct, colorClass }: { pct: number, colorClass: string }) => (
  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(pct, 100)}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`h-full ${colorClass} rounded-full`}
    />
  </div>
);

// --- Main Dashboard Component ---

export default function SavingsHubDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [monthlyIncome, setMonthlyIncome] = useState(90000);
  const [goals, setGoals] = useState([
    { id: "house", name: "Dream House", progress: 24, saved: 480000, target: 2000000, color: "bg-blue-500", text: "text-blue-500" },
    { id: "bike", name: "Sports Bike", progress: 45, saved: 67500, target: 150000, color: "bg-amber-500", text: "text-amber-500" },
    { id: "gold", name: "Gold Investment", progress: 100, saved: 100000, target: 100000, color: "bg-emerald-500", text: "text-emerald-500" },
    { id: "car", name: "Sedan Car", progress: 17, saved: 85000, target: 500000, color: "bg-pink-500", text: "text-pink-500" },
    { id: "retirement", name: "Early Retirement", progress: 10, saved: 500000, target: 5000000, color: "bg-indigo-500", text: "text-indigo-500" },
    { id: "tour", name: "World Tour", progress: 8, saved: 40000, target: 500000, color: "bg-cyan-500", text: "text-cyan-500" },
    { id: "iphone", name: "iPhone 16 Pro", progress: 85, saved: 110000, target: 130000, color: "bg-rose-500", text: "text-rose-500" },
  ]);

  const nudgeGoal = (id: string) => {
    setGoals(prev => prev.map(g => g.id === id ? {
      ...g,
      progress: Math.min(100, g.progress + 5),
      saved: Math.min(g.target, Math.round(g.saved + g.target * 0.05))
    } : g));
  };

  const getAnim = (id: string, p: number) => {
    switch (id) {
      case 'house': return <HouseAnim p={p} />;
      case 'bike': return <BikeAnim p={p} />;
      case 'gold': return <GoldAnim p={p} />;
      case 'car': return <CarAnim p={p} />;
      case 'retirement': return <HouseAnim p={p} />; // Reusing House for foundation
      case 'tour': return <BikeAnim p={p} />; // Reusing Bike for travel/motion
      case 'iphone': return <GoldAnim p={p} />; // Reusing Gold for high value items
      default: return null;
    }
  };

  // --- Tab Content Components ---

  const PageOverview = () => (
    <div className="flex flex-col gap-10">
      <section className="flex justify-between items-center">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-black text-white tracking-tight">Financial Overview</h1>
          <p className="text-gray-500 font-medium">Your monthly highlights and active allocations.</p>
        </motion.div>
        
        {/* Editable Income Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-indigo-600/5 border border-indigo-500/20 p-4 rounded-2xl flex flex-col gap-1 min-w-[200px]"
        >
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Monthly Income</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">₹</span>
            <input 
              type="number" 
              value={monthlyIncome} 
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="bg-transparent border-none text-xl font-black text-white focus:ring-0 w-full p-0"
            />
            <span className="text-xs text-gray-500">Edit</span>
          </div>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Needs', amount: monthlyIncome * 0.5, pct: 50, color: 'bg-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
          { label: 'Wants', amount: monthlyIncome * 0.3, pct: 30, color: 'bg-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
          { label: 'Savings', amount: monthlyIncome * 0.2, pct: 20, color: 'bg-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        ].map((item, i) => (
          <motion.div 
            key={item.label} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-[#111827] rounded-3xl border border-gray-800 flex flex-col gap-4 group hover:border-indigo-500/30 transition-all cursor-default"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-gray-500">{item.label}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.bg} ${item.border}`}>{item.pct}%</span>
            </div>
            <div className="text-3xl font-black text-white">₹<Counter to={item.amount} /></div>
            <ProgressBar pct={item.pct} colorClass={item.color} />
          </motion.div>
        ))}
      </div>

      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-[#111827] p-8 rounded-[2.5rem] border border-gray-800 flex flex-col items-center gap-10"
      >
        <h3 className="self-start text-xl font-bold text-white">Budget Efficiency</h3>
        <div className="flex flex-col items-center gap-6">
          <svg className="w-56 h-56 transform -rotate-90 filter drop-shadow-2xl">
            <circle cx="112" cy="112" r="90" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-blue-500" strokeDasharray="565.48" strokeDashoffset="282.74" />
            <circle cx="112" cy="112" r="90" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-purple-500" strokeDasharray="565.48" strokeDashoffset="169.64" style={{ transformOrigin: 'center', transform: 'rotate(180deg)' }} />
            <circle cx="112" cy="112" r="90" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-emerald-500" strokeDasharray="565.48" strokeDashoffset="113.10" style={{ transformOrigin: 'center', transform: 'rotate(288deg)' }} />
          </svg>
          <div className="flex flex-col items-center text-center">
            <span className="text-4xl font-black text-white">50/30/20</span>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Optimal Health Achieved</span>
          </div>
        </div>
      </motion.section>

      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.01 }} 
        className="bg-indigo-600/10 p-8 rounded-[2.5rem] border border-indigo-500/20 flex items-center justify-between"
      >
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-indigo-500 flex items-center justify-center rounded-[1.5rem]">
            <span className="text-2xl">📈</span>
          </div>
          <div className="flex flex-col font-bold">
            <span className="text-indigo-400 text-xs uppercase tracking-widest">Investment Engine</span>
            <span className="text-2xl text-white">₹{(monthlyIncome * 2.5).toLocaleString()} Portfolio</span>
          </div>
        </div>
        <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm hover:bg-gray-100 transition-colors">View Projection</button>
      </motion.div>
    </div>
  );

  const PageBudget = () => (
    <div className="flex flex-col gap-10">
      <motion.section initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Budget Tracking</h1>
        <p className="text-gray-500 font-medium">Categorized spending vs monthly limits.</p>
      </motion.section>

      <div className="grid grid-cols-1 gap-4">
        {[
          { label: "Housing", spent: monthlyIncome * 0.15, budget: monthlyIncome * 0.2, color: "bg-blue-500" },
          { label: "Food", spent: monthlyIncome * 0.08, budget: monthlyIncome * 0.1, color: "bg-emerald-500" },
          { label: "Transport", spent: monthlyIncome * 0.05, budget: monthlyIncome * 0.04, color: "bg-red-500" },
          { label: "Shopping", spent: monthlyIncome * 0.04, budget: monthlyIncome * 0.06, color: "bg-purple-500" },
        ].map((c, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: i * 0.1 }} 
            key={c.label} 
            className="bg-[#111827] p-6 rounded-3xl border border-gray-800 hover:border-gray-700 transition-colors"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-white">{c.label}</span>
              <span className="text-sm text-gray-500 font-bold">₹{c.spent.toLocaleString()} / ₹{c.budget.toLocaleString()}</span>
            </div>
            <ProgressBar pct={(c.spent / c.budget) * 100} colorClass={c.color} />
            <div className="mt-2 text-right">
              <span className={`text-[10px] font-black uppercase ${c.spent > c.budget ? 'text-red-500' : 'text-gray-500'}`}>
                {c.spent > c.budget ? 'Over Limit!' : `${Math.round((c.spent / c.budget) * 100)}% Used`}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const [risk, setRisk] = useState('moderate');
  const PageInvestments = () => (
    <div className="flex flex-col gap-10">
      <motion.section initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">Investment Strategy</h1>
        <p className="text-gray-500 font-medium">Configure your risk profile and see future projections.</p>
      </motion.section>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#111827] p-6 rounded-3xl border border-gray-800 flex flex-col gap-6"
      >
        <span className="text-xs font-black uppercase tracking-widest text-gray-500">Risk Appetite</span>
        <div className="flex gap-4">
          {['Conservative', 'Moderate', 'Aggressive'].map(r => (
            <button
              key={r}
              onClick={() => setRisk(r.toLowerCase())}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all border ${risk === r.toLowerCase() ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-gray-900 border-gray-800 text-gray-500'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#111827] p-8 rounded-[2.5rem] border border-gray-800 text-center">
          <div className="text-4xl font-black text-indigo-400 mb-2">{risk === 'conservative' ? '8%' : risk === 'moderate' ? '12%' : '16%'}</div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Expected Returns</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-[#111827] p-8 rounded-[2.5rem] border border-gray-800 text-center">
          <div className="text-4xl font-black text-emerald-400 mb-2">10Y</div>
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Projection Era</div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-emerald-500/5 p-10 rounded-[3rem] border border-emerald-500/20 flex flex-col items-center gap-4"
      >
        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">10-Year Corpus Value</span>
        <div className="text-5xl font-black text-white">₹<Counter to={monthlyIncome * (risk === 'conservative' ? 100 : risk === 'moderate' ? 150 : 220)} /></div>
        <p className="text-gray-500 text-sm font-medium text-center max-w-xs">Based on investment of 20% of your income monthly at compounded growth.</p>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080a12] text-gray-100 font-sans selection:bg-indigo-500/30">
      <nav className="w-full grid grid-cols-3 items-center px-8 py-5 bg-[#0d0f1a] border-b border-gray-800/60 sticky top-0 z-50">
        <div className="flex items-center gap-3 justify-self-start">
          <motion.div 
            whileHover={{ rotate: 15 }}
            className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-900/20 cursor-pointer"
          >
            <span className="text-xl">💰</span>
          </motion.div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-black tracking-widest text-white">SAVINGS</span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-500">HUB</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 justify-self-center">
          {['Overview', 'Budget', 'Investments'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold transition-all relative py-1 px-2 ${activeTab === tab ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="nav-pill" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 justify-self-end">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs text-gray-500 font-medium">Hello,</span>
            <span className="text-sm font-bold text-white">Rohith 👋</span>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all font-bold text-sm shadow-xl shadow-indigo-900/20 active:scale-95">
            <span className="text-lg">+</span>
            New Transaction
          </button>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.3 }}
             >
               {activeTab === 'Overview' && <PageOverview />}
               {activeTab === 'Budget' && <PageBudget />}
               {activeTab === 'Investments' && <PageInvestments />}
             </motion.div>
           </AnimatePresence>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-between items-end"
          >
            <h2 className="text-2xl font-black text-white tracking-tight">Wealth Goals</h2>
            <span className="text-xs font-bold text-gray-500">4 Active</span>
          </motion.div>

          <div className="flex flex-col gap-4">
            {goals.map((goal, i) => (
              <motion.div 
                key={goal.id} 
                onClick={() => nudgeGoal(goal.id)}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#111827] p-6 rounded-3xl border border-gray-800 hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col gap-5 overflow-hidden group shadow-sm hover:shadow-indigo-500/5"
              >
                <div className="flex items-center gap-5">
                  <div className="flex-shrink-0">
                    {getAnim(goal.id, goal.progress)}
                  </div>
                  <div className="flex-grow flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-white text-lg">{goal.name}</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${goal.progress >= 100 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-800 text-gray-400'}`}>
                        {goal.progress >= 100 ? 'Achieved' : 'Active'}
                      </span>
                    </div>
                    <span className="text-gray-500 text-xs font-medium">₹<Counter to={goal.saved} /> saved</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-500">Progress</span>
                    <span className={goal.text}>{goal.progress}%</span>
                  </div>
                  <ProgressBar pct={goal.progress} colorClass={goal.color} />
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 bg-amber-500/5 rounded-3xl border border-amber-500/10"
          >
            <div className="flex gap-4">
              <span className="text-xl">💡</span>
              <p className="text-xs leading-relaxed text-amber-200/70 font-medium">
                Raising your <span className="text-amber-400 font-bold">SIP by 10%</span> today could reduce your house goal timeline by <span className="text-amber-400 font-bold">14 months</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <footer className="h-20" />
    </div>
  );
}
