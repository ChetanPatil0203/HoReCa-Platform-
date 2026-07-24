import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Plus, Star, X, MoreVertical, Building, Eye, ShoppingBag, ClipboardList, Activity, UserX, UserCheck, AlertTriangle, CheckCircle, MapPin, FileText, Phone, Mail, ShieldAlert } from 'lucide-react';
import { mockDb } from '../../utils/mockDb';

export default function Horeca() {
  const [horecaListings, setHorecaListings] = useState([]);
  const [horecaTab, setHorecaTab] = useState("All");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [verificationFilter, setVerificationFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [licenseFilter, setLicenseFilter] = useState("All");

  // State
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setHorecaListings(mockDb.getHoreca());

    // Close menus on click outside
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const showToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Summaries
  const totalBusinesses = horecaListings.length;
  const activeCount = horecaListings.filter(b => b.accountStatus === 'Active').length;
  const suspendedCount = horecaListings.filter(b => b.accountStatus === 'Suspended').length;
  const pendingVerifCount = horecaListings.filter(b => b.verification === 'Pending').length;
  const verifiedCount = horecaListings.filter(b => b.verification === 'Approved').length;

  const filteredListings = useMemo(() => {
    return horecaListings.filter((b) => {
      const matchTab = horecaTab === "All" || b.type === horecaTab;
      const matchCity = cityFilter === "All" || b.city === cityFilter;
      const matchStatus = statusFilter === "All" || b.accountStatus === statusFilter;
      const matchVerification = verificationFilter === "All" || b.verification === verificationFilter;
      const matchRating = ratingFilter === "All" || b.rating >= parseFloat(ratingFilter);
      const matchLicense = licenseFilter === "All" || b.licenseStatus === licenseFilter;
      const matchQuery =
        b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.gstNumber && b.gstNumber.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchTab && matchCity && matchStatus && matchVerification && matchRating && matchLicense && matchQuery;
    });
  }, [horecaListings, horecaTab, cityFilter, statusFilter, verificationFilter, ratingFilter, licenseFilter, searchQuery]);

  const activeProfile = useMemo(() => horecaListings.find(b => b.id === selectedProfileId), [horecaListings, selectedProfileId]);

  const handleApproveFromDrawer = (id) => {
    const updated = horecaListings.map(b => b.id === id ? { ...b, verification: 'Approved' } : b);
    setHorecaListings(updated);
    mockDb.saveHoreca(updated);
    showToast("Business KYC approved successfully!", "success");
    window.dispatchEvent(new Event('storage'));
  };

  const handleSuspendFromDrawer = (id) => {
    const updated = horecaListings.map(b => {
      if (b.id === id) {
        const nextStatus = b.accountStatus === 'Active' ? 'Suspended' : 'Active';
        return { ...b, accountStatus: nextStatus };
      }
      return b;
    });
    setHorecaListings(updated);
    mockDb.saveHoreca(updated);
    const item = updated.find(b => b.id === id);
    showToast(`Business account is now ${item.accountStatus}!`, "info");
    window.dispatchEvent(new Event('storage'));
  };

  const handleSuspendToggle = (id) => {
    handleSuspendFromDrawer(id);
  };

  const handleVerificationToggle = (id) => {
    const updated = horecaListings.map(b => {
      if (b.id === id) {
        const nextVerif = b.verification === 'Approved' ? 'Pending' : 'Approved';
        return { ...b, verification: nextVerif };
      }
      return b;
    });
    setHorecaListings(updated);
    mockDb.saveHoreca(updated);
    const item = updated.find(b => b.id === id);
    showToast(`KYC Verification is now ${item.verification === 'Approved' ? 'Approved' : 'Pending'}!`, "success");
    window.dispatchEvent(new Event('storage'));
  };

  const handleDeleteFromDrawer = (id) => {
    if (window.confirm("Are you sure you want to delete this business?")) {
      const updated = horecaListings.filter(b => b.id !== id);
      setHorecaListings(updated);
      mockDb.saveHoreca(updated);
      setSelectedProfileId(null);
      showToast("Business deleted successfully!", "success");
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleDelete = (id) => {
    handleDeleteFromDrawer(id);
  };

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
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white backdrop-blur-md pointer-events-auto ${toast.type === "success" ? "border-emerald-500/20 text-emerald-800" :
                toast.type === "error" ? "border-rose-500/20 text-rose-800" : "border-blue-500/20 text-blue-800"
                }`}
            >
              <div className="flex-1 text-xs font-semibold leading-relaxed mt-0.5">{toast.message}</div>
              <button onClick={() => setToasts((p) => p.filter((t) => t.id !== toast.id))} className="text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-slate-700/50 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border border-blue-400/30 shrink-0">
            <Building size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">HoReCa Directory</h1>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">Manage all Hotel, Restaurant, and Cafe listings on the platform.</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { title: "Total Businesses", val: totalBusinesses, col: "text-slate-800", bg: "bg-slate-50" },
          { title: "Active", val: activeCount, col: "text-emerald-700", bg: "bg-emerald-50" },
          { title: "Suspended", val: suspendedCount, col: "text-rose-700", bg: "bg-rose-50" },
          { title: "Pending Verification", val: pendingVerifCount, col: "text-amber-700", bg: "bg-amber-50" },
          { title: "Verified Businesses", val: verifiedCount, col: "text-blue-700", bg: "bg-blue-50" },
        ].map((s, i) => (
          <div key={i} className={`p-5 rounded-xl border border-slate-100 shadow-sm ${s.bg}`}>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.title}</span>
            <div className={`text-2xl font-black mt-2 ${s.col}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col gap-4 bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1 bg-[#F3F4F6] border border-slate-200/60 p-1 rounded-xl">
            {["All", "Hotel", "Restaurant", "Cafe"].map((tab) => (
              <button
                key={tab}
                onClick={() => setHorecaTab(tab)}
                className={`text-[11px] font-bold px-4 py-1.5 rounded-lg transition-all active:scale-[0.97] ${horecaTab === tab
                  ? "bg-white text-blue-700 shadow-sm border border-slate-200/30"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                {tab === "All" ? "All Types" : tab + "s"}
              </button>
            ))}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, owner, ID, GST..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-lg px-3 py-1.5 focus:outline-none text-slate-600 font-semibold">
            <option value="All">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Chandigarh">Chandigarh</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-lg px-3 py-1.5 focus:outline-none text-slate-600 font-semibold">
            <option value="All">All Account Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
          <select value={licenseFilter} onChange={e => setLicenseFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-lg px-3 py-1.5 focus:outline-none text-slate-600 font-semibold">
            <option value="All">All License Status</option>
            <option value="Valid">Valid</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden w-full overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-500">
              <th className="p-4 font-bold">Business</th>
              <th className="p-4 font-bold">Type</th>
              <th className="p-4 font-bold">Owner & Location</th>
              <th className="p-4 font-bold">Rating</th>
              <th className="p-4 font-bold">License Expiry</th>
              <th className="p-4 font-bold">Joined</th>
              <th className="p-4 font-bold">Verification</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredListings.length > 0 ? (
              filteredListings.map((b) => (
                <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-slate-800">{b.businessName}</span>
                      <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded w-max">{b.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-md border ${b.type === "Hotel" ? "bg-blue-50 border-blue-100 text-blue-700" :
                      b.type === "Restaurant" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                        "bg-indigo-50 border-indigo-100 text-indigo-700"
                      }`}>
                      {b.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-bold text-slate-700">{b.owner}</div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{b.city}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {b.rating}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold text-slate-600">{b.licenseExpiry}</span>
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded w-max border ${b.licenseStatus === 'Valid' ? 'bg-emerald-50 border-emerald-200/40 text-emerald-700' :
                        b.licenseStatus === 'Expiring Soon' ? 'bg-amber-50 border-amber-200/40 text-amber-700' :
                          'bg-rose-50 border-rose-200/40 text-rose-700'
                        }`}>
                        {b.licenseStatus}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[11px] font-semibold text-slate-600">{b.joinedDate}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVerificationToggle(b.id);
                        }}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${b.verification === 'Approved' ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        title={b.verification === 'Approved' ? 'KYC is Verified (click to toggle)' : 'KYC is Pending (click to toggle)'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${b.verification === 'Approved' ? 'translate-x-4' : 'translate-x-0'
                            }`}
                        />
                      </button>
                      <span className={`text-[10px] font-black ${b.verification === 'Approved' ? 'text-blue-600' : 'text-slate-400'}`}>
                        {b.verification === 'Approved' ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSuspendToggle(b.id);
                        }}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${b.accountStatus === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        title={b.accountStatus === 'Active' ? 'Account is Active (click to toggle)' : 'Account is Suspended (click to toggle)'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${b.accountStatus === 'Active' ? 'translate-x-4' : 'translate-x-0'
                            }`}
                        />
                      </button>
                      <span className={`text-[10px] font-black ${b.accountStatus === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {b.accountStatus === 'Active' ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProfileId(b.id);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all inline-flex items-center gap-1.5 text-xs font-semibold active:scale-95"
                    >
                      <Eye size={14} /> View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Building size={48} className="text-slate-300 stroke-[1.5]" />
                    <span className="text-xs font-black text-slate-500">No Businesses Found</span>
                    <span className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
                      Try adjusting your search query or filters to find what you are looking for.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Business Profile Modal (Centered) */}
      <AnimatePresence>
        {selectedProfileId && activeProfile && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedProfileId(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl md:max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden z-10"
            >
              {/* Header */}
              <div className="bg-white px-5 py-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                    <Building size={20} />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 text-sm">{activeProfile.businessName}</h2>
                    <span className="text-[10px] text-slate-400 font-bold">{activeProfile.type} • {activeProfile.id}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedProfileId(null)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5" style={{ scrollbarWidth: "thin" }}>

                {/* Profile Completion */}
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-xs">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Profile Completion</span>
                    <span className="text-[11px] font-extrabold text-blue-600">{activeProfile.profileCompletion}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${activeProfile.profileCompletion}%` }} />
                  </div>
                </div>

                {/* Business Logo & Info */}
                <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs space-y-3">
                  <div className="flex justify-center py-2">
                    <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-black text-xl">
                      {activeProfile.businessName.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Business Name</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.businessName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Business Type</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.type}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Owner Name</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.owner}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Phone</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.phone}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Email</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.email}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Address</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{activeProfile.address}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">GST Number</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.gstNumber}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">FSSAI Number</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.fssaiNumber}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Registration Date</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.joinedDate}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Verification Status</span>
                      <span className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold border ${activeProfile.verification === 'Approved' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                        }`}>
                        {activeProfile.verification === 'Approved' ? '🔵 Verified' : '🟡 Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Business Statistics */}
                <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Business Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Total Orders</span>
                      <span className="text-lg font-black text-slate-800 mt-1 block">{activeProfile.orders}</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Completed Orders</span>
                      <span className="text-lg font-black text-slate-800 mt-1 block">{activeProfile.completedOrders}</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Revenue</span>
                      <span className="text-lg font-black text-blue-600 mt-1 block">{activeProfile.revenue}</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Rating</span>
                      <span className="text-lg font-black text-amber-500 mt-1 block flex items-center gap-1">
                        {activeProfile.rating} <Star size={16} className="fill-amber-400 text-amber-400" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* License Information */}
                <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">License Information</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 border border-slate-50 rounded-lg bg-slate-50/50">
                      <span className="font-semibold text-slate-600">GST Registration</span>
                      <span className="font-bold text-slate-800">{activeProfile.gstNumber}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 border border-slate-50 rounded-lg bg-slate-50/50">
                      <span className="font-semibold text-slate-600">FSSAI Licence</span>
                      <span className="font-bold text-slate-800">{activeProfile.fssaiNumber}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 border border-slate-50 rounded-lg bg-slate-50/50">
                      <span className="font-semibold text-slate-600">Trade License Expiry</span>
                      <span className="font-bold text-slate-800">{activeProfile.licenseExpiry}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 border border-slate-50 rounded-lg bg-slate-50/50">
                      <span className="font-semibold text-slate-600">Expiry Status</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${activeProfile.licenseStatus === 'Valid' ? 'bg-emerald-50 border-emerald-200/40 text-emerald-700' :
                        activeProfile.licenseStatus === 'Expiring Soon' ? 'bg-amber-50 border-amber-200/40 text-amber-700' :
                          'bg-rose-50 border-rose-200/40 text-rose-700'
                        }`}>{activeProfile.licenseStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Documents List */}
                <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Documents</h4>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    {['GST', 'FSSAI', 'PAN', 'Trade'].map((docName) => (
                      <div key={docName} className="border border-slate-100 rounded-lg p-2 bg-slate-50 flex flex-col items-center justify-between gap-2">
                        <FileText size={20} className="text-blue-500" />
                        <span className="text-[9px] font-bold text-slate-600 block">{docName}</span>
                        <button
                          onClick={() => showToast(`Downloading ${docName} certificate...`, "success")}
                          className="text-[9px] font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
                        >
                          <Download size={10} /> Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity Timeline */}
                <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Activity</h4>
                  <div className="flex flex-col gap-3 relative pl-4">
                    <div className="absolute left-1.5 top-1 bottom-1 w-px bg-slate-200"></div>
                    {activeProfile.activityHistory.map((act, idx) => (
                      <div key={idx} className="relative flex flex-col">
                        <div className="absolute -left-[14.5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-white"></div>
                        <span className="text-xs font-semibold text-slate-700">{act.action}</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">{act.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer Quick Actions */}
              <div className="bg-slate-50 border-t border-slate-100 p-4 flex gap-2 flex-shrink-0">
                {activeProfile.verification === 'Pending' && (
                  <button
                    onClick={() => handleApproveFromDrawer(activeProfile.id)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleSuspendFromDrawer(activeProfile.id)}
                  className={`flex-1 py-2 border text-xs font-bold rounded-xl transition-colors ${activeProfile.accountStatus === 'Active'
                    ? 'border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600'
                    : 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                    }`}
                >
                  {activeProfile.accountStatus === 'Active' ? 'Suspend' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteFromDrawer(activeProfile.id)}
                  className="p-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                  title="Delete Business"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
