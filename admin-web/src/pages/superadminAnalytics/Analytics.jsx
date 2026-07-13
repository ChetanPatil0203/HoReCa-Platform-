import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Analytics() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const kpis = [
    { label: "Total Platform Revenue", val: "₹ 8,75,000", change: "+18.5% last month" },
    { label: "Fulfillment Orders", val: "6,428", change: "+15.2% last month" },
    { label: "Average Order Value", val: "₹ 1,362", change: "+2.4% last month" },
    { label: "New Merchants Onboarded", val: "112", change: "+122.3% last month" }
  ];

  const audits = [
    { title: "Audited Ledger Report", desc: "Comprehensive financial statement replication" },
    { title: "Platform Analytics Report", desc: "Aggregated listings and traffic logs matrix" },
    { title: "Transaction Audit Report", desc: "Secure escrow and settlement audits log file" },
    { title: "Compliance Report", desc: "Regulatory licensing compliance checklist" }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white text-emerald-800 border-emerald-500/20"
            >
              <div className="flex-1 text-xs font-semibold leading-relaxed mt-0.5">{toast.message}</div>
              <button onClick={() => setToasts((p) => p.filter((t) => t.id !== toast.id))} className="text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Top metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{kpi.label}</span>
            <div className="text-2xl font-black text-slate-800 mt-2.5 tracking-tight">{kpi.val}</div>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/40 inline-block mt-2">
              {kpi.change}
            </span>
          </div>
        ))}
      </div>

      {/* Dual Chart Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visualizer Card 1: Revenue Area */}
        <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 flex flex-col">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Revenue Overview</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Aggregated weekly payouts value</p>
          </div>

          <div className="h-44 relative overflow-visible mt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
              <defs>
                <linearGradient id="grad-revenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="10" x2="100" y2="10" stroke="#F1F5F9" strokeWidth="0.5" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="#F1F5F9" strokeWidth="0.5" />
              <line x1="0" y1="40" x2="100" y2="40" stroke="#F1F5F9" strokeWidth="0.5" />
              <path
                d="M 0,40 L 20,32 L 40,35 L 60,18 L 80,12 L 100,16"
                fill="none"
                stroke="#1E40AF"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M 0,50 L 0,40 L 20,32 L 40,35 L 60,18 L 80,12 L 100,16 L 100,50 Z"
                fill="url(#grad-revenue)"
              />
            </svg>
            <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-2 px-1">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4</span>
              <span>W5</span>
              <span>W6</span>
            </div>
          </div>
        </div>

        {/* Visualizer Card 2: Order Volume Bar Chart */}
        <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 flex flex-col">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Order Volume</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Total fulfillment logistics transactions count</p>
          </div>

          <div className="h-44 relative overflow-visible mt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
              <line x1="0" y1="10" x2="100" y2="10" stroke="#F1F5F9" strokeWidth="0.5" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="#F1F5F9" strokeWidth="0.5" />
              <line x1="0" y1="40" x2="100" y2="40" stroke="#F1F5F9" strokeWidth="0.5" />
              {[12, 28, 18, 35, 45, 30, 42].map((height, i) => (
                <rect
                  key={i}
                  x={10 + i * 12}
                  y={50 - height}
                  width="6"
                  height={height}
                  rx="2"
                  fill="#1E40AF"
                  opacity={0.8}
                />
              ))}
            </svg>
            <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-2 px-6">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Reports List */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6">
        <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">Audit Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audits.map((report, idx) => (
            <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-400 transition-colors">
              <div>
                <span className="text-xs font-bold text-slate-800 block">{report.title}</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{report.desc}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => showToast(`Generating XLS cache for ${report.title}...`, "success")}
                  className="px-2.5 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-bold rounded-lg shadow-sm transition-colors"
                >
                  Export Excel
                </button>
                <button
                  onClick={() => showToast(`Generating PDF report document for ${report.title}...`, "success")}
                  className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg shadow-sm transition-colors"
                >
                  Export PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
