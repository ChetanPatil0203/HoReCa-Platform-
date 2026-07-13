import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  const metrics = [
    { label: "Verified Merchant Gross", val: "₹42.8 L", change: "+18.4% this week", color: "blue", chartData: [30, 45, 38, 55, 48, 62] },
    { label: "Total Active Merchants", val: "1,248", change: "+12.4% this week", color: "teal", chartData: [40, 38, 48, 52, 45, 58] },
    { label: "Total Vendors Onboarded", val: "320", change: "+15.7% this week", color: "indigo", chartData: [20, 28, 25, 35, 30, 42] },
    { label: "Dispute Resolution Rate", val: "95.6%", change: "+0.9% this week", color: "emerald", chartData: [92, 94, 93, 95, 94, 95.6] }
  ];

  const activities = [
    { text: "New Hotel Onboarded: Hotel Blue Sapphire", time: "2m ago", type: "onboard" },
    { text: "Vendor Approved: Royal Orchid Supplies", time: "1h ago", type: "approve" },
    { text: "Complaint Received: #CH-2025-812", time: "4h ago", type: "complaint" },
    { text: "KYC Verified: Green Valley Suppliers", time: "12h ago", type: "kyc" },
    { text: "Payment Completed: ₹1.75L to Café Coffee Day", time: "1d ago", type: "payment" }
  ];

  const alerts = [
    { title: "3 SLA Critical Tickets", desc: "Requires immediate action", color: "rose", path: "/complaints" },
    { title: "5 Pending Verifications", desc: "Waiting for approval", color: "amber", path: "/verification" },
    { title: "All Systems Operational", desc: "No active incidents", color: "emerald", path: null },
    { title: "Next Payout Cycle", desc: "Settling in 2h 15m", color: "blue", path: null }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((card, idx) => (
          <div key={idx} className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 relative overflow-hidden group hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/40">
                {card.change}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 mt-3 tracking-tight">{card.val}</div>

            {/* Mini Sparkline Chart */}
            <div className="h-10 mt-4 overflow-visible">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30">
                <defs>
                  <linearGradient id={`grad-spark-${idx}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={card.color === "emerald" ? "#10B981" : "#3B82F6"} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={card.color === "emerald" ? "#10B981" : "#3B82F6"} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M ${card.chartData
                    .map((v, i) => `${(i / (card.chartData.length - 1)) * 100},${30 - ((v - Math.min(...card.chartData)) / (Math.max(...card.chartData) - Math.min(...card.chartData) || 1)) * 20 - 5}`)
                    .join(" L ")}`}
                  fill="none"
                  stroke={card.color === "emerald" ? "#10B981" : "#3B82F6"}
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

      {/* Dashboard Hub Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent System Activity */}
        <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Recent System Activity</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Real-time system events</p>
          </div>

          <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[300px]" style={{ scrollbarWidth: "none" }}>
            {activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
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

        {/* Middle: Payouts Graphic (Line Area chart) */}
        <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 flex flex-col">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Payouts</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Platform settlement tracking</p>
            </div>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">Monthly</span>
          </div>

          {/* Custom Payout Line Area Graph */}
          <div className="h-44 relative overflow-visible mt-2">
            <div className="absolute top-4 right-10 bg-slate-900 text-white text-[9px] font-bold px-2 py-1.5 rounded-lg shadow-lg pointer-events-none z-10">
              Saturday: 875 Transactions
            </div>

            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50">
              <defs>
                <linearGradient id="grad-payout" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E40AF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1E40AF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="10" x2="100" y2="10" stroke="#F1F5F9" strokeWidth="0.5" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="#F1F5F9" strokeWidth="0.5" />
              <line x1="0" y1="40" x2="100" y2="40" stroke="#F1F5F9" strokeWidth="0.5" />
              <path
                d="M 0,42 L 18,35 L 36,38 L 54,20 L 72,15 L 90,26 L 100,22"
                fill="none"
                stroke="#1E40AF"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 0,50 L 0,42 L 18,35 L 36,38 L 54,20 L 72,15 L 90,26 L 100,22 L 100,50 Z"
                fill="url(#grad-payout)"
              />
              <circle cx="72" cy="15" r="4" fill="#FBBF24" stroke="#1E40AF" strokeWidth="1.5" />
            </svg>

            <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-2 px-1">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 border-t border-slate-100 pt-4 text-center">
            <div>
              <div className="text-[11px] font-extrabold text-slate-800">12,846</div>
              <div className="text-[8px] text-slate-400 font-bold mt-0.5">Transactions</div>
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-slate-800">₹87.5 L</div>
              <div className="text-[8px] text-slate-400 font-bold mt-0.5">Gross Payout</div>
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-rose-600">68</div>
              <div className="text-[8px] text-slate-400 font-bold mt-0.5">Disputes</div>
            </div>
            <div>
              <div className="text-[11px] font-extrabold text-emerald-600">112</div>
              <div className="text-[8px] text-slate-400 font-bold mt-0.5">New Signups</div>
            </div>
          </div>
        </div>

        {/* Right: System Alerts */}
        <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-100 mb-4">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">System Alerts</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Operational action items</p>
          </div>

          <div className="flex flex-col gap-3 flex-1">
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
                <span className={`w-2.5 h-2.5 rounded-full ${
                  alert.color === "rose" ? "bg-rose-500 animate-pulse" :
                  alert.color === "amber" ? "bg-amber-400" :
                  alert.color === "emerald" ? "bg-emerald-500" : "bg-blue-500"
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
