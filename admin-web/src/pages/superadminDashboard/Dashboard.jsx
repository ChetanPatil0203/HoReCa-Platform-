import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Download, Calendar, Activity, AlertTriangle, ShieldCheck,
  TrendingUp, Users, Store, Package, UserPlus, FileText, Ban,
  MessageSquare, RefreshCw, ChevronRight, CheckCircle, Info,
  Wrench, Megaphone, Eye
} from 'lucide-react';
import { fetchDashboardStats } from '../../services/api.service';

const COMMON_WALL_VENDORS = {};

export default function Dashboard() {
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Analytics State
  const [growthFilter, setGrowthFilter] = useState("Monthly"); // Weekly, Monthly, Yearly
  const [verificationToggle, setVerificationToggle] = useState("Owners"); // Owners, Vendors
  const [commonWallCategory, setCommonWallCategory] = useState("Man Power"); // Man Power, Service Provider, Marketing

  const commonWallCategoryData = {
    "Man Power": {
      label: "Man Power Requests",
      total: "0 Total",
      theme: {
        badge: "bg-purple-50 text-purple-700 border-purple-100",
        iconBg: "bg-purple-50 text-purple-600",
        hoverText: "group-hover/row:text-purple-600",
        btnView: "text-purple-600 bg-purple-50 hover:bg-purple-100",
        btnAll: "text-purple-600 hover:text-purple-800"
      },
      items: []
    },
    "Service Provider": {
      label: "Service Provider Requests",
      total: "0 Total",
      theme: {
        badge: "bg-blue-50 text-blue-700 border-blue-100",
        iconBg: "bg-blue-50 text-blue-600",
        hoverText: "group-hover/row:text-blue-600",
        btnView: "text-blue-600 bg-blue-50 hover:bg-blue-100",
        btnAll: "text-blue-600 hover:text-blue-800"
      },
      items: []
    },
    "Marketing": {
      label: "Marketing Requests",
      total: "0 Total",
      theme: {
        badge: "bg-amber-50 text-amber-700 border-amber-100",
        iconBg: "bg-amber-50 text-amber-600",
        hoverText: "group-hover/row:text-amber-600",
        btnView: "text-amber-600 bg-amber-50 hover:bg-amber-100",
        btnAll: "text-amber-600 hover:text-amber-800"
      },
      items: []
    }
  };

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const [dashboardStats, setDashboardStats] = useState({
    totalHoreca: 0,
    totalVendors: 0,
    pendingVerifications: 0,
    activeOrders: 0,
    openComplaints: 0,
    suspendedAccounts: 0
  });

  React.useEffect(() => {
    const loadStats = async () => {
      const stats = await fetchDashboardStats();
      if (stats) {
        setDashboardStats(stats);
      }
    };
    loadStats();
  }, []);

  // Summary Metrics: 6 Cards as requested
  const metrics = [
    { label: "Total HoReCa Owners", val: dashboardStats.totalHoreca.toString(), change: "Live from DB", color: "blue", chartData: [0, 0, 0, 0, 0, 0], desc: "Hotels, Restaurants, Cafés" },
    { label: "Total Vendor Partners", val: dashboardStats.totalVendors.toString(), change: "Live from DB", color: "emerald", chartData: [0, 0, 0, 0, 0, 0], desc: "Suppliers & Agencies" },
    { label: "Pending Verifications", val: dashboardStats.pendingVerifications.toString(), change: "Live from DB", color: "amber", chartData: [0, 0, 0, 0, 0, 0], desc: "Awaiting approval" },
    { label: "Active Orders / Requests", val: dashboardStats.activeOrders.toString(), change: "Feature Pending", color: "blue", chartData: [0, 0, 0, 0, 0, 0], desc: "Procurements & bookings" },
    { label: "Open Complaints", val: dashboardStats.openComplaints.toString(), change: "Feature Pending", color: "rose", chartData: [0, 0, 0, 0, 0, 0], desc: "Unresolved support tickets" },
    { label: "Suspended Accounts", val: dashboardStats.suspendedAccounts.toString(), change: "Live from DB", color: "rose", chartData: [0, 0, 0, 0, 0, 0], desc: "Temporarily blocked" }
  ];

  // Activities Data
  const activities = [];

  // Critical Alerts Data
  const alerts = [];

  // Platform Growth Analytics calculation
  const growthData = useMemo(() => {
    if (growthFilter === "Weekly") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        owners: [0, 0, 0, 0, 0, 0, 0],
        vendors: [0, 0, 0, 0, 0, 0, 0]
      };
    } else if (growthFilter === "Yearly") {
      return {
        labels: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        owners: [0, 0, 0, 0, 0, 0, 0],
        vendors: [0, 0, 0, 0, 0, 0, 0]
      };
    }
    // Monthly Default
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      owners: [0, 0, 0, 0, 0, 0, 0],
      vendors: [0, 0, 0, 0, 0, 0, 0]
    };
  }, [growthFilter]);

  const maxVal = 1600;
  const minVal = 0;

  const ownersPoints = useMemo(() => {
    return growthData.owners.map((val, idx) => {
      const x = (idx / (growthData.owners.length - 1)) * 100;
      const y = 40 - ((val - minVal) / (maxVal - minVal)) * 32 - 4; // Margin offsets
      return { x, y };
    });
  }, [growthData]);

  const vendorsPoints = useMemo(() => {
    return growthData.vendors.map((val, idx) => {
      const x = (idx / (growthData.vendors.length - 1)) * 100;
      const y = 40 - ((val - minVal) / (maxVal - minVal)) * 32 - 4;
      return { x, y };
    });
  }, [growthData]);

  const ownersPath = useMemo(() => {
    if (ownersPoints.length === 0) return '';
    return `M ` + ownersPoints.map(pt => `${pt.x},${pt.y}`).join(" L ");
  }, [ownersPoints]);

  const vendorsPath = useMemo(() => {
    if (vendorsPoints.length === 0) return '';
    return `M ` + vendorsPoints.map(pt => `${pt.x},${pt.y}`).join(" L ");
  }, [vendorsPoints]);

  const ownersArea = useMemo(() => `${ownersPath} L 100,40 L 0,40 Z`, [ownersPath]);
  const vendorsArea = useMemo(() => `${vendorsPath} L 100,40 L 0,40 Z`, [vendorsPath]);

  // Donut Circle Math Parameters
  const radius = 38;
  const circumference = 2 * Math.PI * radius; // ~238.76

  // Verification share Donut Math
  const verificationCircles = useMemo(() => {
    const rawData = [
      { label: "Approved", pct: 0, color: "#10B981", bg: "bg-emerald-500", count: "0" },
      { label: "Pending", pct: 0, color: "#F59E0B", bg: "bg-amber-500", count: "0" },
      { label: "Under Review", pct: 0, color: "#3B82F6", bg: "bg-blue-500", count: "0" },
      { label: "Rejected", pct: 0, color: "#EF4444", bg: "bg-rose-500", count: "0" }
    ];

    let offset = 0;
    return rawData.map((item) => {
      const dashArray = `${(item.pct / 100) * circumference} ${circumference}`;
      const dashOffset = -offset;
      offset += (item.pct / 100) * circumference;
      return { ...item, dashArray, dashOffset };
    });
  }, [circumference]);

  // Complaint share Donut Math
  const complaintCircles = useMemo(() => {
    const rawData = [
      { label: "Resolved", pct: 0, color: "#10B981", bg: "bg-emerald-500", count: "0" },
      { label: "In Progress", pct: 0, color: "#3B82F6", bg: "bg-blue-500", count: "0" },
      { label: "SLA Critical", pct: 0, color: "#EF4444", bg: "bg-rose-500", count: "0" },
      { label: "Open", pct: 0, color: "#F59E0B", bg: "bg-amber-500", count: "0" }
    ];

    let offset = 0;
    return rawData.map((item) => {
      const dashArray = `${(item.pct / 100) * circumference} ${circumference}`;
      const dashOffset = -offset;
      offset += (item.pct / 100) * circumference;
      return { ...item, dashArray, dashOffset };
    });
  }, [circumference]);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-8">
      {/* Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white backdrop-blur-md pointer-events-auto ${toast.type === "success" ? "border-emerald-500/20 text-emerald-800" : "border-rose-500/20 text-rose-800"
                }`}
            >
              <div className="flex-1 text-xs font-semibold leading-relaxed mt-0.5">{toast.message}</div>
              <button onClick={() => setToasts((p) => p.filter((t) => t.id !== toast.id))} className="text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>


      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200/60 shadow-sm rounded-xl p-4 relative overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start gap-1">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-wider block min-h-[24px] leading-tight">{card.label}</span>
              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border shrink-0 ${card.change.startsWith('+') || card.change.startsWith('-5')
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-rose-50 text-rose-700 border-rose-100"
                }`}>
                {card.change.split(' ')[0]}
              </span>
            </div>

            <div className="mt-3">
              <div className="text-xl font-black text-slate-800 tracking-tight leading-none">{card.val}</div>
              <span className="text-[8px] text-slate-400 font-bold block mt-1 leading-normal">{card.desc}</span>
            </div>

            {/* Sparkline trend paths */}
            <div className="h-6 mt-3 overflow-visible shrink-0">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`spark-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={card.color === "emerald" ? "#10B981" : card.color === "rose" ? "#EF4444" : card.color === "amber" ? "#F59E0B" : "#3B82F6"} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={card.color === "emerald" ? "#10B981" : card.color === "rose" ? "#EF4444" : card.color === "amber" ? "#F59E0B" : "#3B82F6"} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M ${card.chartData
                    .map((v, i) => `${(i / (card.chartData.length - 1)) * 100},${30 - ((v - Math.min(...card.chartData)) / (Math.max(...card.chartData) - Math.min(...card.chartData) || 1)) * 20 - 5}`)
                    .join(" L ")}`}
                  fill="none"
                  stroke={card.color === "emerald" ? "#10B981" : card.color === "rose" ? "#EF4444" : card.color === "amber" ? "#F59E0B" : "#3B82F6"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d={`M 0,30 L ${card.chartData
                    .map((v, i) => `${(i / (card.chartData.length - 1)) * 100},${30 - ((v - Math.min(...card.chartData)) / (Math.max(...card.chartData) - Math.min(...card.chartData) || 1)) * 20 - 5}`)
                    .join(" L ")} L 100,30 Z`}
                  fill={`url(#spark-${idx})`}
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics & Operations Charts Grid (2x2 Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Platform Growth Analytics */}
        <div className="bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex flex-col h-72">
          <div className="flex justify-between items-start pb-3 mb-2 shrink-0">
            <div className="flex flex-col gap-1.5">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Platform Growth Analytics</h3>
              <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1e6ffd] inline-block" />
                  HoReCa Owners
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block" />
                  Vendor Partners
                </span>
              </div>
            </div>

            <div className="flex bg-[#f3f4f6] p-1 rounded-xl text-[10px] font-bold text-slate-650 shrink-0">
              {["Weekly", "Monthly", "Yearly"].map(f => (
                <button
                  key={f}
                  onClick={() => setGrowthFilter(f)}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer ${growthFilter === f
                    ? 'bg-[#1e6ffd] text-white shadow-xs font-extrabold'
                    : 'hover:text-slate-800 bg-transparent text-slate-500 font-semibold'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 relative mt-4 pl-10 flex flex-col min-h-[160px]">
            {/* SVG Chart Area */}
            <div className="flex-1 h-full relative overflow-visible">
              {/* Y-axis labels aligned with SVG grid lines */}
              <div className="absolute right-full mr-2 top-0 h-full w-8 text-[9px] font-extrabold text-slate-400 select-none pointer-events-none">
                <span className="absolute right-0 -translate-y-1/2 leading-none whitespace-nowrap" style={{ top: '10%' }}>1.6K</span>
                <span className="absolute right-0 -translate-y-1/2 leading-none whitespace-nowrap" style={{ top: '30%' }}>1.2K</span>
                <span className="absolute right-0 -translate-y-1/2 leading-none whitespace-nowrap" style={{ top: '50%' }}>800</span>
                <span className="absolute right-0 -translate-y-1/2 leading-none whitespace-nowrap" style={{ top: '70%' }}>400</span>
                <span className="absolute right-0 -translate-y-1/2 leading-none whitespace-nowrap" style={{ top: '90%' }}>0</span>
              </div>
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad-owners" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e6ffd" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#1e6ffd" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="grad-vendors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="4" x2="100" y2="4" stroke="rgba(226, 232, 240, 0.6)" strokeWidth="0.5" />
                <line x1="0" y1="12" x2="100" y2="12" stroke="rgba(226, 232, 240, 0.6)" strokeWidth="0.5" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(226, 232, 240, 0.6)" strokeWidth="0.5" />
                <line x1="0" y1="28" x2="100" y2="28" stroke="rgba(226, 232, 240, 0.6)" strokeWidth="0.5" />
                <line x1="0" y1="36" x2="100" y2="36" stroke="rgba(226, 232, 240, 0.6)" strokeWidth="0.5" />

                {/* Area fills */}
                <path d={ownersArea} fill="url(#grad-owners)" />
                <path d={vendorsArea} fill="url(#grad-vendors)" />

                {/* Straight Line Paths */}
                <path
                  d={ownersPath}
                  fill="none"
                  stroke="#1e6ffd"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={vendorsPath}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {ownersPoints.map((pt, idx) => (
                  <circle
                    key={`owner-pt-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="1.2"
                    fill="#1e6ffd"
                    className="transition-all hover:scale-150 cursor-pointer"
                  />
                ))}
                {vendorsPoints.map((pt, idx) => (
                  <circle
                    key={`vendor-pt-${idx}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="1.2"
                    fill="#10b981"
                    className="transition-all hover:scale-150 cursor-pointer"
                  />
                ))}
              </svg>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-[9px] text-slate-500 font-bold mt-3 px-1 shrink-0 select-none">
              {growthData.labels.map((lbl, i) => (
                <span key={i} className="text-center">{lbl}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Verification Analytics */}
        <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 flex flex-col h-72">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Verification Analytics</h3>
                <p className="text-[9px] text-slate-400 mt-0.5">Onboarding validation status share</p>
              </div>
            </div>
            <div className="flex border border-slate-200 rounded-lg overflow-hidden text-[9px] font-bold">
              {["Owners", "Vendors"].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setVerificationToggle(t)}
                  className={`cursor-pointer px-2.5 py-1 transition-colors ${verificationToggle === t ? 'bg-[#081A3A] text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-around gap-4">
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r={radius} strokeWidth="10" stroke="#f1f5f9" fill="transparent" />
                {verificationCircles.map((circle, idx) => (
                  <circle
                    key={`${verificationToggle}-${idx}`}
                    cx="50"
                    cy="50"
                    r={radius}
                    strokeWidth="10"
                    stroke={circle.color}
                    fill="transparent"
                    strokeDasharray={circle.dashArray}
                    strokeDashoffset={circle.dashOffset}
                    strokeLinecap="round"
                    className="transition-all duration-350"
                  />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800">
                <span className="text-base font-black">0%</span>
                <span className="text-[7px] font-bold text-slate-400 uppercase">Approved</span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-bold text-slate-600">
              {verificationCircles.map((circle, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${circle.bg}`} />
                    {circle.label}
                  </span>
                  <span className="text-slate-850 font-black">{circle.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Common Wall (Compact Category Requests) */}
        <div className="bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex flex-col h-72 justify-between">
          <div className="flex flex-col gap-3 min-h-0">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 shrink-0">
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Common Wall</h3>
                <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">Today's Requests by Category</p>
              </div>

              {/* Category Dropdown */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 shadow-xs px-2.5 py-1 rounded-xl">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Category:</span>
                <select
                  value={commonWallCategory}
                  onChange={(e) => setCommonWallCategory(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  <option value="Man Power">Man Power</option>
                  <option value="Service Provider">Service Provider</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>

            {(() => {
              const currentCat = commonWallCategoryData[commonWallCategory];
              return (
                <div className="flex flex-col gap-2.5 min-h-0">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shadow-xs ${currentCat.theme.iconBg}`}>
                        {commonWallCategory === 'Man Power' && <Users className="w-3.5 h-3.5" />}
                        {commonWallCategory === 'Service Provider' && <Wrench className="w-3.5 h-3.5" />}
                        {commonWallCategory === 'Marketing' && <Megaphone className="w-3.5 h-3.5" />}
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-xs tracking-tight">{currentCat.label}</h4>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${currentCat.theme.badge}`}>
                      {currentCat.total}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[9px] font-bold text-slate-400 border-b border-slate-100 pb-1 uppercase tracking-wider select-none">
                    <span>Vendor Name</span>
                    <span>Today's Requests</span>
                  </div>

                  <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[110px]" style={{ scrollbarWidth: "thin" }}>
                    {currentCat.items.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedVendor(COMMON_WALL_VENDORS[item.name])}
                        className="flex justify-between items-center text-xs font-semibold text-slate-700 hover:bg-slate-50/60 p-1 rounded-lg transition-all cursor-pointer group/row"
                      >
                        <span className={`transition-colors text-xs ${currentCat.theme.hoverText}`}>
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-md transition-colors ${currentCat.theme.btnView}`}>
                            View
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>

          <button
            onClick={() => navigate('/vendors')}
            className={`text-xs font-extrabold transition-colors text-center w-full pt-2 border-t border-slate-100 cursor-pointer ${commonWallCategoryData[commonWallCategory].theme.btnAll}`}
          >
            View All {commonWallCategory} Requests
          </button>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl p-5 flex flex-col h-72 justify-between">
          <div className="pb-3 border-b border-slate-100 mb-2 flex items-center gap-2 shrink-0">
            <Activity className="w-4 h-4 text-blue-500" />
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Recent Activity</h3>
              <p className="text-[9px] text-slate-400 mt-0.5 font-semibold">Latest actions logged across modules</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[180px]" style={{ scrollbarWidth: "thin" }}>
            {activities.map((act, i) => (
              <div key={i} className="flex items-start gap-3 text-xs font-semibold text-slate-655 hover:bg-slate-50/50 p-1.5 rounded-xl transition-all">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${act.type === 'register' ? 'bg-blue-500' :
                  act.type === 'approve' ? 'bg-emerald-500' :
                    act.type === 'complaint' ? 'bg-amber-500' :
                      act.type === 'complete' ? 'bg-indigo-500' : 'bg-rose-500'
                  }`} />
                <div className="flex-1">
                  <p className="leading-snug text-slate-750 font-bold">{act.text}</p>
                  <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Vendor Profile Details Modal */}
      <AnimatePresence>
        {selectedVendor && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVendor(null)}
              className="absolute inset-0 bg-[#090D16]/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200/80 rounded-3xl shadow-2xl w-full max-w-lg p-6 relative overflow-hidden z-10 flex flex-col gap-5 text-slate-800"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVendor(null)}
                className="absolute right-4 top-4 p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Profile Title */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm font-black text-sm shrink-0">
                  {selectedVendor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="font-extrabold text-base text-slate-800 truncate leading-snug pr-6">{selectedVendor.businessName}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{selectedVendor.category}</span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${selectedVendor.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-rose-50 text-rose-700 border-rose-100"
                  }`}>
                  STATUS: {selectedVendor.status.toUpperCase()}
                </span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${selectedVendor.verification === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                  selectedVendor.verification === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-rose-50 text-rose-700 border-rose-100"
                  }`}>
                  KYC: {selectedVendor.verification.toUpperCase()}
                </span>
              </div>

              <hr className="border-slate-100" />

              {/* Vendor Info Details */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-650">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Proprietor</span>
                  <span className="text-slate-800 font-extrabold">{selectedVendor.proprietor}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Location</span>
                  <span className="text-slate-800 font-extrabold">{selectedVendor.location}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Phone</span>
                  <span className="text-slate-800 font-extrabold">{selectedVendor.phone}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Email</span>
                  <span className="text-slate-800 font-extrabold truncate">{selectedVendor.email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Joined Date</span>
                  <span className="text-slate-800 font-extrabold">{selectedVendor.joinedDate}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Rating</span>
                  <span className="text-slate-800 font-extrabold">★ {selectedVendor.rating}</span>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Custom Details Block */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Active Deployment / Specialties</span>
                  <p className="text-slate-800 font-bold leading-relaxed">{selectedVendor.activeStaff}</p>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Compliance Documents</span>
                  <span className="text-slate-800 font-bold">{selectedVendor.documents}</span>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Footer Buttons */}
              <div className="flex justify-end gap-3 mt-1">
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Profile
                </button>
                <button
                  onClick={() => {
                    setSelectedVendor(null);
                    navigate(`/vendors?search=${selectedVendor.name}`);
                  }}
                  className="px-4 py-2 bg-[#081A3A] hover:bg-[#102A56] text-white rounded-xl text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  Manage Vendor Page
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
