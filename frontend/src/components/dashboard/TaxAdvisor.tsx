import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, CheckCircle, AlertCircle, Sparkles, Receipt, FileSearch, ArrowRight } from 'lucide-react';
import { API_URL } from '@/utils/api';

export default function TaxAdvisor() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ analysis: string[], filename: string, extracted: string } | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Sparkles className="text-purple-400" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Tax Optimizer</h3>
            <p className="text-xs text-gray-500">Scan payslips & bills for tax savings</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!results && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.02]"
          >
            <div className="p-4 bg-white/5 rounded-full mb-4">
              <Upload className="text-gray-500" size={32} />
            </div>
            <p className="text-sm text-gray-400 mb-2">Upload Payslip, Form 16, or Bills</p>
            <p className="text-[10px] text-gray-600 mb-6 uppercase tracking-widest">PDF, JPG, PNG supported</p>
            
            <label className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all cursor-pointer shadow-lg shadow-purple-900/20 active:scale-95">
              SELECT DOCUMENT
              <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.jpg,.jpeg,.png" />
            </label>
          </motion.div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-400">AI scanning document via AWS Textract...</p>
          </div>
        )}

        {results && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                <CheckCircle className="text-green-400 shrink-0" size={24} />
                <div className="text-sm">
                  <span className="text-green-400 font-bold">Analysis Complete:</span>
                  <span className="text-gray-300 ml-2">Found potential tax savings!</span>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-1">AI Suggestions</h4>
                {results.analysis.map((tip, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-4 items-start"
                  >
                    <div className="mt-1 p-1 bg-purple-500/20 rounded-md">
                      <Sparkles className="text-purple-400" size={14} />
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed italic">{tip.replace(/\*\*/g, '')}</p>
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => setResults(null)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 text-gray-400 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                SCAN ANOTHER DOCUMENT
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
