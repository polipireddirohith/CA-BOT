"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, IndianRupee } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper function
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

import { API_URL } from '@/utils/api';

type Message = {
  id: string;
  role: 'bot' | 'user';
  text: string;
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'bot', text: 'Hi! I am your AI Chartered Accountant. How can I help you manage your finances today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Connect to our backend API
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text })
      });
      
      const data = await res.json();
      
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'bot', text: data.reply || "Sorry, I couldn't process that." }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'bot', text: "I'm having trouble connecting to the server. Please ensure the backend is running." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 p-4 border-b border-white/10 flex items-center gap-3">
        <div className="bg-blue-500 p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="font-semibold text-lg text-white">Personal CA Bot</h2>
          <p className="text-xs text-blue-200/70">AI Financial Advisor</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={cn("flex gap-3 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-violet-600/20 text-violet-400" : "bg-blue-600/20 text-blue-400"
            )}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={cn(
              "px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-violet-600 text-white rounded-tr-sm" 
                : "bg-white/10 text-gray-100 rounded-tl-sm border border-white/5"
            )}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <Loader2 className="animate-spin" size={16} />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/10 text-gray-100 rounded-tl-sm border border-white/5 flex gap-1 items-center">
              <span className="w-2 h-2 rounded-full bg-blue-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-blue-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-blue-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 bg-black/40 border-t border-white/10">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your budget, goals..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-white placeholder:text-gray-500 transition-all"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
