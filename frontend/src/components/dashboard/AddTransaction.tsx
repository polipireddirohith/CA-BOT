"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, PlusCircle, ArrowUpRight, ArrowDownLeft, Wallet, Tag, FileText, IndianRupee } from 'lucide-react';
import { API_URL } from '@/utils/api';

interface AddTransactionProps {
  onAdd?: (transaction: any) => void;
}

export default function AddTransaction({ onAdd }: AddTransactionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE',
    category: 'Food',
    description: ''
  });

  const categories = ["Food", "Rent", "Bills", "Shopping", "Entertainment", "Dining Out", "Investment", "Goal Contribution", "Salary"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount)
        })
      });

      if (res.ok) {
        setIsOpen(false);
        setFormData({ amount: '', type: 'EXPENSE', category: 'Food', description: '' });
        if (onAdd) onAdd(await res.json());
        // For visual feedback, we'll reload the page or trigger a refresh
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 md:right-8 bg-blue-600 text-white p-4 rounded-full shadow-2xl shadow-blue-500/40 z-40 lg:hidden"
      >
        <Plus size={24} />
      </motion.button>
      
      {/* In-page button for desktop */}
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden lg:flex items-center gap-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-xl hover:bg-blue-600/20 transition-all text-sm font-semibold"
      >
        <PlusCircle size={18} /> New Transaction
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 p-6 flex justify-between items-center border-b border-white/10">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Wallet className="text-blue-400" size={24} /> Add Transaction
                </h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-3 p-1 bg-white/5 rounded-2xl border border-white/5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                      formData.type === 'EXPENSE' ? 'bg-zinc-800 text-rose-400 ring-1 ring-rose-500/30 shadow-lg' : 'text-gray-500'
                    }`}
                  >
                    <ArrowUpRight size={18} /> Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'INCOME' })}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
                      formData.type === 'INCOME' ? 'bg-zinc-800 text-emerald-400 ring-1 ring-emerald-500/30 shadow-lg' : 'text-gray-500'
                    }`}
                  >
                    <ArrowDownLeft size={18} /> Income
                  </button>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Amount</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                    <input
                      type="number"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-bold ml-1">Description</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 text-gray-500" size={18} />
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What was this for?"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl pt-4 pl-12 pr-4 pb-4 h-24 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.amount}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? 'Adding...' : 'Confirm Transaction'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
