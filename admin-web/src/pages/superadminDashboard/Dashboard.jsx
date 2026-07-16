import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Calendar, Activity, AlertTriangle, ShieldCheck, TrendingUp, Users, Store, Package, UserPlus } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const metrics = [
    { label: "Total HoReCa Owners", val: "1,432", change: "+5.2% this week", color: "blue", chartData: [1200, 1250, 1300, 1380, 1400, 1432] },
    { label: "Total Vendor Partners", val: "845", change: "+12.4% this week", color: "teal", chartData: [700, 720, 750, 800, 810, 845] },
    { label: "Pending Verifications", val: "28", change: "-2 this week", color: "amber", chartData: [35, 32, 40, 30, 30, 28] },
    { label: "Active Orders", val: "3,150", change: "+18.1% this week", color: "emerald", chartData: [2500, 2700, 2800, 3000, 3100, 3150] },
    { label: "Open Requirements", val: "142", change: "+8% this week", color: "indigo", chartData: [100, 110, 125, 130, 135, 142] },
    { label: "Open Complaints", val: "15", change: "-5 this week", color: "rose", chartData: [25, 22, 28, 20, 18, 15] },
    { label: "Suspended Accounts", val: "12", change: "+1 this week", color: "rose", chartData: [5, 8, 8, 10, 11, 12] },
    { label: "New Registrations", val: "156", change: "+24% this week", color: "blue", chartData: [100, 110, 120, 140, 150, 156] }
  ];

  const activities = [
    { text: "New Hotel Onboarded: Hotel Blue Sapphire", time: "2m ago", type: "onboard" },
    { text: "Vendor Approved: Royal Orchid Supplies", time: "1h ago", type: "approve" },
    { text: "Complaint Received: #CH-2025-812", time: "4h ago", type: "complaint" },
    { text: "KYC Verified: Green Valley Suppliers", time: "12h ago", type: "kyc" },
    { text: "New Requirement Posted: #REQ-901", time: "1d ago", type: "req" }
  ];

  const alerts = [
    { title: "3 SLA Critical Tickets", desc: "Requires immediate action", color: "rose", path: "/complaints" },
    { title: "5 Pending Verifications", desc: "Waiting for approval", color: "amber", path: "/verification" },
    { title: "High Order Volume Detected", desc: "Monitor system latency", color: "indigo", path: "/orders" },
    { title: "Suspicious Activity Flagged", desc: "Account #9022 requires review", color: "rose", path: "/limits" }
  ];

  const verificationQueue = [
    { name: "Taj Mahal Palace", type: "HoReCa", date: "Jul 16", status: "Pending" },
    { name: "Fresh Farms Dairy", type: "Vendor", date: "Jul 15", status: "In Review" },
    { name: "Urban Spice Co.", type: "Vendor", date: "Jul 15", status: "Pending" },
  ];

  const latestRegistrations = [
    { name: "Royal Orchid", role: "Hotel", loc: "Mumbai", date: "Today" },
    { name: "Prime Meats", role: "Supplier", loc: "Delhi", date: "Today" },
    { name: "Café Coffee Day", role: "Cafe", loc: "Bangalore", date: "Yesterday" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-8">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Super Admin Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Global platform overview and health metrics</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            Last 7 Days
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-[#081A3A] hover:bg-[#102A56] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export Overview
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                card.change.startsWith('+') ? "bg-emerald-50 text-emerald-700 border-emerald-200/40" : "bg-rose-50 text-rose-700 border-rose-200/40"
              }`}>
                {card.change}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 mt-3 tracking-tight">{card.val}</div>

            {/* Mini Sparkline Chart */}
            <div className="h-10 mt-4 overflow-visible">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                <defs>
                  <linearGradient id={`grad-spark-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={card.color === "emerald" ? "#10B981" : card.color === "rose" ? "#F43F5E" : card.color === "amber" ? "#F59E0B" : card.color === "teal" ? "#14B8A6" : card.color === "indigo" ? "#6366F1" : "#3B82F6"} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={card.color === "emerald" ? "#10B981" : card.color === "rose" ? "#F43F5E" : card.color === "amber" ? "#F59E0B" : card.color === "teal" ? "#14B8A6" : card.color === "indigo" ? "#6366F1" : "#3B82F6"} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M ${card.chartData
                    .map((v, i) => `${(i / (card.chartData.length - 1)) * 100},${30 - ((v - Math.min(...card.chartData)) / (Math.max(...card.chartData) - Math.min(...card.chartData) || 1)) * 20 - 5}`)
                    .join(" L ")}`}
                  fill="none"
                  stroke={card.color === "emerald" ? "#10B981" : card.color === "rose" ? "#F43F5E" : card.color === "amber" ? "#F59E0B" : card.color === "teal" ? "#14B8A6" : card.color === "indigo" ? "#6366F1" : "#3B82F6"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d={`M 0,30 L ${card.chartData
                    .map((v, i) => `${(i / (card.chartData.length - 1)) * 100},${30 - ((v - Math.min(...card.chartData)) / (Math.max(...card.chartData) - Math.min(...card.chartData) || 1)) * 20 - 5}`)
                    .join(" L ")} L 100,30 Z`}
                  fill={`url(#grad-spark-${idx})`}
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 */}
        <div className="flex flex-col gap-6">
          {/* Recent Platform Activity */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 flex flex-col justify-between flex-1">
            <div className="pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Recent Activity</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Real-time system events</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[300px]" style={{ scrollbarWidth: "none" }}>
              {activities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    activity.type === "complaint" ? "bg-rose-500" :
                    activity.type === "approve" || activity.type === "kyc" ? "bg-emerald-500" : "bg-blue-500"
                  }`} />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-700 leading-tight">{activity.text}</p>
                    <span className="text-[9px] text-slate-400 font-bold block mt-1">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Status Overview */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5">
            <div className="pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Account Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Active Accounts</span>
                <span className="text-xs font-bold text-slate-800">2,277</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: '85%' }}></div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-semibold text-slate-600">Suspended</span>
                <span className="text-xs font-bold text-slate-800">12</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full" style={{ width: '5%' }}></div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-semibold text-slate-600">Pending Review</span>
                <span className="text-xs font-bold text-slate-800">28</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col gap-6">
          {/* Order Trend Line Area Graph */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 flex flex-col h-64">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-indigo-500" />
                <div>
                  <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Order Trend</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Platform volume tracking</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">Weekly</span>
            </div>

            <div className="flex-1 relative overflow-visible mt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad-order" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="10" x2="100" y2="10" stroke="#F1F5F9" strokeWidth="0.5" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#F1F5F9" strokeWidth="0.5" />
                <line x1="0" y1="40" x2="100" y2="40" stroke="#F1F5F9" strokeWidth="0.5" />
                <path
                  d="M 0,42 L 18,35 L 36,38 L 54,20 L 72,15 L 90,26 L 100,22"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 0,50 L 0,42 L 18,35 L 36,38 L 54,20 L 72,15 L 90,26 L 100,22 L 100,50 Z"
                  fill="url(#grad-order)"
                />
                <circle cx="72" cy="15" r="3" fill="#FBBF24" stroke="#4F46E5" strokeWidth="1.5" />
              </svg>
              <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-2 px-1">
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

          {/* Verification Queue */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 flex-1">
            <div className="pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Verification Queue</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Pending onboarding checks</p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {verificationQueue.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div>
                    <div className="text-xs font-bold text-slate-800">{item.name}</div>
                    <div className="text-[10px] text-slate-500 font-medium mt-0.5">{item.type} • {item.date}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[9px] font-bold border ${
                    item.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
              <button onClick={() => navigate('/verification')} className="mt-2 text-xs font-bold text-[#D4AF37] hover:text-[#B5952F] text-center w-full py-1.5 transition-colors">
                View All Verifications
              </button>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="flex flex-col gap-6">
          {/* Critical Alerts */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5">
            <div className="pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Critical Alerts</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Operational action items</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {alerts.map((alert, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (alert.path) navigate(alert.path);
                  }}
                  className="p-3 rounded-xl border border-slate-100 bg-[#F3F4F6] flex items-center justify-between cursor-pointer hover:border-slate-200 transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800">{alert.title}</div>
                    <div className="text-[9px] text-slate-400 font-medium mt-0.5">{alert.desc}</div>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    alert.color === "rose" ? "bg-rose-500 animate-pulse" :
                    alert.color === "amber" ? "bg-amber-400" :
                    alert.color === "emerald" ? "bg-emerald-500" : "bg-indigo-500"
                  }`} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Registration Trend (Bar chart replacement) */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 h-48 flex flex-col">
            <div className="pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-500" />
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Registration Trend</h3>
            </div>
            <div className="flex-1 flex items-end justify-between gap-2 px-2 mt-2">
               {[30, 45, 25, 60, 40, 70, 85].map((val, i) => (
                 <div key={i} className="w-full bg-teal-100 rounded-t-sm relative group">
                   <div className="absolute bottom-0 w-full bg-teal-500 rounded-t-sm transition-all duration-500" style={{ height: `${val}%` }}></div>
                   <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded transition-opacity pointer-events-none">
                     {val}
                   </div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-2 px-1">
              <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
            </div>
          </div>

          {/* Latest Registrations */}
          <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 flex-1">
            <div className="pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-500" />
              <div>
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Latest Registrations</h3>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {latestRegistrations.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-[10px]">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">{item.role} • {item.loc}</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

