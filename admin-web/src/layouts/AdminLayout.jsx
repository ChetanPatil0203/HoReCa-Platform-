import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Network,
  Inbox,
  BarChart3,
  ToggleRight,
  UserCheck,
  Search,
  Bell,
  X,
  LogOut,
  ChevronRight,
  Menu,
  ShieldAlert,
  ShoppingCart,
  ClipboardCheck,
  Tags,
  Users,
  Shield
} from 'lucide-react';
import HrcHubLogo from '../assets/HoReCa_Logo.png';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [profileName, setProfileName] = useState('Super Admin');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-get counts from localStorage
  const [pendingVerificationCount, setPendingVerificationCount] = useState(0);
  const [activeTicketsCount, setActiveTicketsCount] = useState(0);

  useEffect(() => {
    // Read count values
    const kyc = JSON.parse(localStorage.getItem('hrchub_kyc') || '[]');
    setPendingVerificationCount(kyc.filter(k => k.status === 'Pending').length);

    const tickets = JSON.parse(localStorage.getItem('hrchub_tickets') || '[]');
    setActiveTicketsCount(tickets.filter(t => t.status !== 'Resolved').length);
  }, [location]);

  const showToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('hrchub_user');
    navigate('/login');
  };

  const renderSidebar = () => {
    const menuItems = [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/verification', label: 'Verification', icon: ShieldCheck, count: pendingVerificationCount },
      { path: '/horeca', label: 'HoReCa Directory', icon: Building2 },
      { path: '/vendors', label: 'Vendor Network', icon: Network },
      { path: '/complaints', label: 'Complaints & Support', icon: Inbox, count: activeTicketsCount },
      { path: '/limits', label: 'Status & Limits', icon: ToggleRight },
      { path: '/team', label: 'Admin Team', icon: Users },
      { path: '/profile', label: 'Profile & Security', icon: Shield }
    ];

    return (
      <aside className="h-full flex flex-col justify-between select-none relative shadow-xl overflow-hidden w-[280px]"
        style={{
          background: "#081A3A",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
          padding: "24px",
          boxShadow: "10px 0 30px rgba(0,0,0,0.25)",
          zIndex: 20
        }}>
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          {/* Brand Logo header */}
          <div className="flex items-center gap-3.5 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <img src={HrcHubLogo} alt="HRC HUB" className="w-[50px] h-[50px] object-cover rounded-lg" />
            <div className="flex flex-col flex-1">
              <span className="text-white text-[18px] tracking-[0.05em] font-medium leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span style={{ color: "#D4AF37" }}>HRC</span> HUB
              </span>
              <span className="text-[#D4AF37] text-[9.5px] tracking-[0.15em] font-semibold mt-1.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                ADMIN OPERATIONS
              </span>
              <div className="flex items-center gap-1.5 mt-2 w-full">
                <div className="h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37] flex-1" />
                <span className="text-[#D4AF37] text-[7px]" style={{ transform: "rotate(45deg)", display: "inline-block" }}>◆</span>
                <div className="h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37] flex-1" />
              </div>
            </div>
          </div>

          {/* Admin Corporate Card: Luxury Glass Card */}
          <div className="flex items-center gap-3 p-3.5 rounded-[18px] relative overflow-hidden"
            style={{
              background: "rgba(16, 42, 86, 0.45)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid #D4AF37",
              boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)"
            }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#081A3A] shadow-md" style={{ background: "#FDFBF7" }}>
              SA
            </div>
            <div className="min-w-0 flex-1 flex flex-col justify-center">
              <span className="text-[#D4AF37] text-[15px] italic leading-none" style={{ fontFamily: "'Pinyon Script', cursive" }}>The</span>
              <span className="text-white text-[13px] font-semibold truncate leading-tight -mt-0.5" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {profileName}
              </span>
              <span className="text-[#B8C6E3] text-[9px] tracking-wide font-normal truncate mt-0.5">
                Global Operations Control
              </span>
            </div>
            <span className="px-1.5 py-0.5 rounded-[6px] text-[8px] tracking-[0.08em] font-bold text-[#D4AF37] border border-[#D4AF37] bg-[#081A3A] flex-shrink-0">
              ADMIN
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5 py-2 overflow-y-auto flex-1 min-h-0" style={{ scrollbarWidth: "none" }}>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname.startsWith(item.path) || (item.path === '/dashboard' && location.pathname === '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center gap-4 px-4 py-2.5 rounded-[16px] transition-all duration-300 relative group"
                  style={{
                    background: isActive ? "rgba(16, 42, 86, 0.6)" : "transparent",
                    color: isActive ? "#FFFFFF" : "#B8C6E3",
                    borderLeft: isActive ? "3px solid #D4AF37" : "3px solid transparent",
                    boxShadow: isActive ? "0 4px 20px rgba(0, 0, 0, 0.15), inset 0 0 12px rgba(212, 175, 55, 0.1)" : "none",
                  }}
                >
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] rounded-r bg-[#D4AF37] transition-all duration-300 scale-y-0 group-hover:scale-y-100"
                    style={{
                      display: isActive ? "none" : "block",
                      boxShadow: "0 0 8px #D4AF37",
                    }}
                  />
                  <IconComponent size={24}
                    style={{
                      color: isActive ? "#D4AF37" : "#B8C6E3",
                      strokeWidth: 1.5,
                      filter: isActive ? "drop-shadow(0 0 4px rgba(212, 175, 55, 0.5))" : "none",
                      transition: "all 300ms ease"
                    }}
                    className="group-hover:text-[#D4AF37] group-hover:scale-105"
                  />
                  <span className="text-[13px] tracking-wide font-medium flex-1 text-left truncate transition-colors duration-300 group-hover:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {item.label}
                  </span>
                  {item.count ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full z-10"
                      style={{
                        background: isActive ? "#D4AF37" : "rgba(255,255,255,0.12)",
                        color: isActive ? "#081A3A" : "#BFDBFE",
                      }}>
                      {item.count}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-1.5 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-[16px] transition-all duration-300 group" style={{ color: "#B8C6E3" }}>
            <LogOut size={24} style={{ color: "#B8C6E3", strokeWidth: 1.5 }} className="group-hover:text-[#EF4444] transition-colors" />
            <span className="text-[13px] tracking-wide font-medium flex-1 text-left truncate group-hover:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Sign Out Session
            </span>
          </button>
        </div>
      </aside>
    );
  };

  return (
    <div className="size-full flex flex-col lg:flex-row h-screen bg-[#F3F4F6] text-slate-800 font-sans antialiased overflow-hidden tracking-tight">
      
      {/* ─── TOAST NOTIFICATIONS POPUP overlay ─── */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 25, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.9 }}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white backdrop-blur-md ${
                toast.type === "success"
                  ? "border-emerald-500/20 text-emerald-800"
                  : toast.type === "error"
                    ? "border-rose-500/20 text-rose-800"
                    : "border-blue-500/20 text-blue-800"
              }`}
            >
              <div className="flex-1 text-xs font-semibold leading-relaxed mt-0.5">{toast.message}</div>
              <button onClick={() => setToasts((p) => p.filter((t) => t.id !== toast.id))} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ─── MOBILE BAR ─── */}
      <div className="lg:hidden flex items-center justify-between px-4 h-16 flex-shrink-0 relative z-30 bg-[#081A3A] text-white">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 rounded-xl transition-colors w-9 h-9 flex items-center justify-center text-blue-100 hover:bg-white/10">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <span className="font-extrabold text-[1.05rem] tracking-tight block text-white leading-none">
            HRC<span className="text-[#D4AF37]">HUB</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => showToast("Database synchronization matches master replica.", "info")} className="p-2 rounded-xl relative text-blue-100 hover:bg-white/10">
            <Bell size={18} />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          </button>
          <div className="relative">
            <button onClick={() => setProfileDropdown(!profileDropdown)} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-md bg-white text-blue-800">
              SA
            </button>
            {profileDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProfileDropdown(false)} />
                <div className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden z-50 bg-white border border-slate-200 shadow-xl" style={{ width: 180 }}>
                  <Link to="/profile" onClick={() => setProfileDropdown(false)} className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold text-slate-700 hover:bg-slate-50 transition-colors text-left decoration-none">
                    <UserCheck size={14} className="text-slate-400" />
                    Profile Settings
                  </Link>
                  <button onClick={() => { handleLogout(); setProfileDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold text-red-500 hover:bg-red-50 transition-colors text-left">
                    <LogOut size={14} className="text-red-400" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar wrapper */}
      <div className="hidden lg:flex h-full">
        {renderSidebar()}
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="absolute inset-0 z-40 lg:hidden flex">
          <div className="animate-slideLeft h-full">
            {renderSidebar()}
          </div>
          <div className="flex-1 bg-[#090D16]/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* ─── MAIN WORKSPACE ─── */}
      <main className="flex-1 flex flex-col overflow-hidden h-full">
        {/* Top Header */}
        <header className="hidden lg:flex h-16 bg-white border-b border-slate-200/60 px-6 items-center justify-between flex-shrink-0 z-10">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search platform entities, metrics, logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200/60 bg-[#F3F4F6] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/80 focus:bg-white transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">

            {/* Notification Bell */}
            <button onClick={() => showToast("Database synchronization matches master replica.", "info")} className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all border border-slate-200/60 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 border border-white" />
            </button>

            {/* User Details */}
            <div className="relative">
              <div onClick={() => setProfileDropdown(!profileDropdown)} className="flex items-center gap-3 border-l border-slate-200 pl-4 cursor-pointer hover:opacity-85 transition-opacity">
                <div className="flex flex-col text-right">
                  <span className="text-[11px] font-bold text-slate-800">{profileName}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Super Control</span>
                </div>
                <div className="w-8.5 h-8.5 rounded-full bg-blue-50 border border-blue-200/50 flex items-center justify-center font-extrabold text-[11px] text-blue-700 shadow-sm">
                  SA
                </div>
              </div>
              {profileDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 rounded-2xl overflow-hidden z-50 bg-white border border-slate-200 shadow-xl" style={{ width: 180 }}>
                    <Link to="/profile" onClick={() => setProfileDropdown(false)} className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold text-slate-700 hover:bg-slate-50 transition-colors text-left decoration-none">
                      <UserCheck size={14} className="text-slate-400" />
                      Profile Settings
                    </Link>
                    <button onClick={() => { handleLogout(); setProfileDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold text-red-500 hover:bg-red-50 transition-colors text-left">
                      <LogOut size={14} className="text-red-400" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* View Canvas Wrapper */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F3F4F6]" style={{ scrollbarWidth: "thin" }}>
          <div className="w-full max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
