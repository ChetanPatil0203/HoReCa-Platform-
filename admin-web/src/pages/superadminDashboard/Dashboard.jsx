import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Download, Calendar, Activity, AlertTriangle, ShieldCheck,
  TrendingUp, Users, Store, Package, UserPlus, FileText, Ban,
  MessageSquare, RefreshCw, ChevronRight, CheckCircle, Info,
  Wrench, Megaphone, Eye
} from 'lucide-react';

const COMMON_WALL_VENDORS = {
  "SkillPoint Manpower": {
    name: "SkillPoint Manpower",
    businessName: "SkillPoint Staffing Solutions Pvt Ltd",
    proprietor: "Amit Deshmukh",
    phone: "+91 98234 56701",
    email: "info@skillpointmanpower.com",
    category: "Manpower Agency",
    location: "Mumbai MMR",
    rating: 4.7,
    status: "Active",
    verification: "Approved",
    joinedDate: "14 Jan 2024",
    deployments: 240,
    activeStaff: "80 Waiters, 40 Cooks, 30 Helpers",
    documents: "GST, PAN, Labour License Verified"
  },
  "WorkForce Agency": {
    name: "WorkForce Agency",
    businessName: "WorkForce Recruitment Ltd",
    proprietor: "Karan Johar",
    phone: "+91 98234 56702",
    email: "contact@workforce.in",
    category: "Manpower Agency",
    location: "Pune, Maharashtra",
    rating: 4.5,
    status: "Active",
    verification: "Approved",
    joinedDate: "18 Aug 2024",
    deployments: 180,
    activeStaff: "120 Servers, 30 Cleaners",
    documents: "GST, PAN Verified"
  },
  "TalentCrew Solutions": {
    name: "TalentCrew Solutions",
    businessName: "TalentCrew Hospitality Support",
    proprietor: "Meera Nair",
    phone: "+91 98234 56703",
    email: "hr@talentcrew.co",
    category: "Manpower Agency",
    location: "Bangalore Urban",
    rating: 4.6,
    status: "Active",
    verification: "Approved",
    joinedDate: "05 Nov 2023",
    deployments: 150,
    activeStaff: "40 Baristas, 60 Banquet Staff",
    documents: "GST, PAN, EPF Registered"
  },
  "QuickHire Services": {
    name: "QuickHire Services",
    businessName: "QuickHire Manpower Services",
    proprietor: "Rajesh Gond",
    phone: "+91 91234 00002",
    email: "rajesh@quickhire.com",
    category: "Manpower Agency",
    location: "Mumbai",
    rating: 4.2,
    status: "Active",
    verification: "Under Review",
    joinedDate: "02 Jun 2026",
    deployments: 95,
    activeStaff: "30 Cooks, 40 Kitchen Staff",
    documents: "PAN, Labour License Verified"
  },
  "PeopleSync Agency": {
    name: "PeopleSync Agency",
    businessName: "PeopleSync Partners Ltd",
    proprietor: "Sneha Patil",
    phone: "+91 98234 56705",
    email: "partners@peoplesync.in",
    category: "Manpower Agency",
    location: "Mumbai MMR",
    rating: 4.4,
    status: "Active",
    verification: "Approved",
    joinedDate: "12 Mar 2025",
    deployments: 110,
    activeStaff: "50 Security Guards, 20 Valets",
    documents: "GST, PAN Verified"
  },
  "FixRight Services": {
    name: "FixRight Services",
    businessName: "FixRight Commercial Maintenance",
    proprietor: "Harish Rao",
    phone: "+91 88888 00003",
    email: "service@fixright.in",
    category: "Service Provider",
    location: "Bangalore",
    rating: 4.8,
    status: "Active",
    verification: "Approved",
    joinedDate: "15 Aug 2022",
    deployments: 310,
    activeStaff: "HVAC Techs, Electricians, Plumbers",
    documents: "FSSAI compliance, ISO 9001:2015"
  },
  "Reliable Tech Solutions": {
    name: "Reliable Tech Solutions",
    businessName: "Reliable Restaurant Technologies",
    proprietor: "Vikram Singh",
    phone: "+91 98234 56707",
    email: "tech@reliable.com",
    category: "Service Provider",
    location: "Pune",
    rating: 4.3,
    status: "Active",
    verification: "Under Review",
    joinedDate: "26 May 2026",
    deployments: 85,
    activeStaff: "POS Technicians, Kitchen Equipment Mechanics",
    documents: "GST, PAN Verified"
  },
  "ProCare Services": {
    name: "ProCare Services",
    businessName: "ProCare Commercial Cleaning",
    proprietor: "Vikash Jain",
    phone: "+91 98234 56708",
    email: "clean@procare.co.in",
    category: "Service Provider",
    location: "Mumbai MMR",
    rating: 4.5,
    status: "Active",
    verification: "Approved",
    joinedDate: "09 Feb 2024",
    deployments: 140,
    activeStaff: "45 Kitchen Deep Cleaning Specialists",
    documents: "GST, PAN Verified"
  },
  "ServiceHub India": {
    name: "ServiceHub India",
    businessName: "ServiceHub Restaurant Services Ltd",
    proprietor: "Deepak Kumar",
    phone: "+91 98234 56709",
    email: "support@servicehub.in",
    category: "Service Provider",
    location: "Delhi NCR",
    rating: 4.4,
    status: "Active",
    verification: "Approved",
    joinedDate: "22 Sep 2023",
    deployments: 200,
    activeStaff: "30 Fridge Techs, 20 Chimney Cleaners",
    documents: "GST, PAN Verified"
  },
  "QuickFix Support": {
    name: "QuickFix Support",
    businessName: "QuickFix Emergency Tech Support",
    proprietor: "Arjun Mehta",
    phone: "+91 98234 56710",
    email: "emergency@quickfix.com",
    category: "Service Provider",
    location: "Mumbai MMR",
    rating: 4.1,
    status: "Active",
    verification: "Approved",
    joinedDate: "11 Oct 2025",
    deployments: 65,
    activeStaff: "On-call Tech Support Team",
    documents: "GST, PAN Verified"
  },
  "BrandBoost Agency": {
    name: "BrandBoost Agency",
    businessName: "BrandBoost Creative Solutions",
    proprietor: "Anita Desai",
    phone: "+91 99999 00004",
    email: "hello@brandboost.com",
    category: "Marketing Agency",
    location: "Mumbai",
    rating: 4.5,
    status: "Suspended",
    verification: "Pending",
    joinedDate: "05 Jan 2026",
    deployments: 12,
    activeStaff: "Social Media Managers, Photographers",
    documents: "GST (Expired), PAN Verified"
  },
  "Creative Minds Studio": {
    name: "Creative Minds Studio",
    businessName: "Creative Minds Design & Photo Studio",
    proprietor: "Rohan Kapoor",
    phone: "+91 98234 56712",
    email: "contact@creativeminds.in",
    category: "Marketing Agency",
    location: "Delhi NCR",
    rating: 4.6,
    status: "Active",
    verification: "Approved",
    joinedDate: "30 Nov 2024",
    deployments: 95,
    activeStaff: "Food Photographers, Graphic Designers",
    documents: "GST, PAN Verified"
  },
  "Marketify Solutions": {
    name: "Marketify Solutions",
    businessName: "Marketify Ad Agency",
    proprietor: "Divya Nair",
    phone: "+91 98234 56713",
    email: "info@marketify.com",
    category: "Marketing Agency",
    location: "Delhi",
    rating: 4.0,
    status: "Active",
    verification: "Rejected",
    joinedDate: "04 Jun 2026",
    deployments: 45,
    activeStaff: "SEO Specialists, PPC Campaign Managers",
    documents: "GST, PAN Verified"
  },
  "AdEdge Marketing": {
    name: "AdEdge Marketing",
    businessName: "AdEdge Restaurant Promotions Ltd",
    proprietor: "Sanjay Singhal",
    phone: "+91 91234 00002",
    email: "ads@adedge.com",
    category: "Marketing Agency",
    location: "Delhi NCR",
    rating: 4.4,
    status: "Active",
    verification: "Approved",
    joinedDate: "22 May 2024",
    deployments: 110,
    activeStaff: "Content Creators, Influencer Coordinators",
    documents: "GST, PAN Verified"
  },
  "PromoWave Media": {
    name: "PromoWave Media",
    businessName: "PromoWave Media & PR Group",
    proprietor: "Rahul Roy",
    phone: "+91 98234 56715",
    email: "media@promowave.in",
    category: "Marketing Agency",
    location: "Mumbai MMR",
    rating: 4.2,
    status: "Active",
    verification: "Approved",
    joinedDate: "07 Apr 2025",
    deployments: 80,
    activeStaff: "PR Managers, Event Coordinators",
    documents: "GST, PAN Verified"
  }
};

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
      total: "58 Total",
      theme: {
        badge: "bg-purple-50 text-purple-700 border-purple-100",
        iconBg: "bg-purple-50 text-purple-600",
        hoverText: "group-hover/row:text-purple-600",
        btnView: "text-purple-600 bg-purple-50 hover:bg-purple-100",
        btnAll: "text-purple-600 hover:text-purple-800"
      },
      items: [
        { name: "SkillPoint Manpower", count: 18 },
        { name: "WorkForce Agency", count: 14 },
        { name: "TalentCrew Solutions", count: 11 },
        { name: "QuickHire Services", count: 8 },
        { name: "PeopleSync Agency", count: 7 }
      ]
    },
    "Service Provider": {
      label: "Service Provider Requests",
      total: "42 Total",
      theme: {
        badge: "bg-blue-50 text-blue-700 border-blue-100",
        iconBg: "bg-blue-50 text-blue-600",
        hoverText: "group-hover/row:text-blue-600",
        btnView: "text-blue-600 bg-blue-50 hover:bg-blue-100",
        btnAll: "text-blue-600 hover:text-blue-800"
      },
      items: [
        { name: "FixRight Services", count: 12 },
        { name: "Reliable Tech Solutions", count: 10 },
        { name: "ProCare Services", count: 8 },
        { name: "ServiceHub India", count: 7 },
        { name: "QuickFix Support", count: 5 }
      ]
    },
    "Marketing": {
      label: "Marketing Requests",
      total: "36 Total",
      theme: {
        badge: "bg-amber-50 text-amber-700 border-amber-100",
        iconBg: "bg-amber-50 text-amber-600",
        hoverText: "group-hover/row:text-amber-600",
        btnView: "text-amber-600 bg-amber-50 hover:bg-amber-100",
        btnAll: "text-amber-600 hover:text-amber-800"
      },
      items: [
        { name: "BrandBoost Agency", count: 11 },
        { name: "Creative Minds Studio", count: 9 },
        { name: "Marketify Solutions", count: 7 },
        { name: "AdEdge Marketing", count: 5 },
        { name: "PromoWave Media", count: 4 }
      ]
    }
  };

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Summary Metrics: 6 Cards as requested
  const metrics = [
    { label: "Total HoReCa Owners", val: "1,524", change: "+5.2% this week", color: "blue", chartData: [1200, 1250, 1300, 1380, 1400, 1524], desc: "Hotels, Restaurants, Cafés" },
    { label: "Total Vendor Partners", val: "845", change: "+12.4% this week", color: "emerald", chartData: [700, 720, 750, 800, 810, 845], desc: "Suppliers & Agencies" },
    { label: "Pending Verifications", val: "28", change: "-4% this week", color: "amber", chartData: [35, 32, 40, 30, 30, 28], desc: "Awaiting approval" },
    { label: "Active Orders / Requests", val: "3,150", change: "+18.1% this week", color: "blue", chartData: [2500, 2700, 2800, 3000, 3100, 3150], desc: "Procurements & bookings" },
    { label: "Open Complaints", val: "15", change: "-5 this week", color: "rose", chartData: [25, 22, 28, 20, 18, 15], desc: "Unresolved support tickets" },
    { label: "Suspended Accounts", val: "12", change: "+1 this week", color: "rose", chartData: [5, 8, 8, 10, 11, 12], desc: "Temporarily or permanently blocked" }
  ];

  // Activities Data
  const activities = [
    { text: "Owner Registered: The Grand Orchid Hotel", time: "2 mins ago", type: "register" },
    { text: "Vendor Approved: Metro Fresh Farm Supplies", time: "1 hour ago", type: "approve" },
    { text: "Complaint Raised: Quality issue on #ORD-291", time: "4 hours ago", type: "complaint" },
    { text: "Order Completed: #ORD-287 delivered to Juhu branch", time: "12 hours ago", type: "complete" },
    { text: "Account Suspended: Prime Meats Delhi blocked for SLA violations", time: "1 day ago", type: "suspend" }
  ];

  // Critical Alerts Data
  const alerts = [
    { title: "Pending Verifications Queue", desc: "28 requests waiting for verification", color: "amber", path: "/verification" },
    { title: "SLA Critical Complaints", desc: "3 unresolved support tickets near threshold", color: "rose", path: "/complaints" },
    { title: "Expiring compliance licenses", desc: "5 vendor GST/Trade licenses expiring in 7 days", color: "indigo", path: "/verification" },
    { title: "Suspended Accounts audit", desc: "12 flagged accounts review pending", color: "rose", path: "/limits" }
  ];

  // Platform Growth Analytics calculation
  const growthData = useMemo(() => {
    if (growthFilter === "Weekly") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        owners: [1200, 1250, 1300, 1350, 1400, 1450, 1524],
        vendors: [700, 720, 750, 770, 800, 820, 845]
      };
    } else if (growthFilter === "Yearly") {
      return {
        labels: ["2020", "2021", "2022", "2023", "2024", "2025", "2026"],
        owners: [400, 620, 850, 1100, 1300, 1450, 1524],
        vendors: [200, 350, 480, 600, 720, 800, 845]
      };
    }
    // Monthly Default
    return {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      owners: [1050, 1120, 1200, 1280, 1350, 1440, 1524],
      vendors: [620, 660, 700, 740, 780, 810, 845]
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
    const rawData = verificationToggle === "Owners"
      ? [
        { label: "Approved", pct: 85, color: "#10B981", bg: "bg-emerald-500", count: "1,295" },
        { label: "Pending", pct: 8, color: "#F59E0B", bg: "bg-amber-500", count: "122" },
        { label: "Under Review", pct: 5, color: "#3B82F6", bg: "bg-blue-500", count: "76" },
        { label: "Rejected", pct: 2, color: "#EF4444", bg: "bg-rose-500", count: "31" }
      ]
      : [
        { label: "Approved", pct: 78, color: "#10B981", bg: "bg-emerald-500", count: "659" },
        { label: "Pending", pct: 12, color: "#F59E0B", bg: "bg-amber-500", count: "101" },
        { label: "Under Review", pct: 6, color: "#3B82F6", bg: "bg-blue-500", count: "51" },
        { label: "Rejected", pct: 4, color: "#EF4444", bg: "bg-rose-500", count: "34" }
      ];

    let offset = 0;
    return rawData.map((item) => {
      const dashArray = `${(item.pct / 100) * circumference} ${circumference}`;
      const dashOffset = -offset;
      offset += (item.pct / 100) * circumference;
      return { ...item, dashArray, dashOffset };
    });
  }, [verificationToggle, circumference]);

  // Complaint share Donut Math
  const complaintCircles = useMemo(() => {
    const rawData = [
      { label: "Resolved", pct: 60, color: "#10B981", bg: "bg-emerald-500", count: "9" },
      { label: "In Progress", pct: 20, color: "#3B82F6", bg: "bg-blue-500", count: "3" },
      { label: "SLA Critical", pct: 12, color: "#EF4444", bg: "bg-rose-500", count: "2" },
      { label: "Open", pct: 8, color: "#F59E0B", bg: "bg-amber-500", count: "1" }
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
                <span className="text-base font-black">{verificationToggle === 'Owners' ? '85%' : '78%'}</span>
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
