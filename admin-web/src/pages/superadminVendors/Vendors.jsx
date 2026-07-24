import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Plus, Star, X, MoreVertical, Building, Eye, AlertTriangle, UserCheck, ShieldAlert, CheckCircle, Activity, MapPin, FileText, Phone, Mail, Box, Users, Settings, Megaphone, UserX } from 'lucide-react';
import { mockDb } from '../../utils/mockDb';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [verificationFilter, setVerificationFilter] = useState("All");
  const [documentStatusFilter, setDocumentStatusFilter] = useState("All");

  // State
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setVendors(mockDb.getVendors());

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
  const totalVendors = vendors.length;
  const activeCount = vendors.filter(v => v.accountStatus === 'Active').length;
  const suspendedCount = vendors.filter(v => v.accountStatus === 'Suspended').length;
  const pendingVerifCount = vendors.filter(v => v.verification === 'Pending').length;
  const topRatedCount = vendors.filter(v => v.isTopRated).length;
  const expiringDocsCount = vendors.filter(v => v.documentStatus === 'Expiring Soon').length;

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchTab = activeTab === "All" || v.category === activeTab;
      const matchCity = cityFilter === "All" || v.city === cityFilter;
      const matchStatus = statusFilter === "All" || v.accountStatus === statusFilter;
      const matchVerification = verificationFilter === "All" || v.verification === verificationFilter;

      let matchRating = true;
      if (ratingFilter !== "All") {
        if (ratingFilter === "4.5+") {
          matchRating = v.rating >= 4.5;
        } else if (ratingFilter === "<4.5") {
          matchRating = v.rating < 4.5;
        }
      }

      const matchDocStatus = documentStatusFilter === "All" || v.documentStatus === documentStatusFilter;

      const matchQuery =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.businessName && v.businessName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (v.phone && v.phone.toLowerCase().includes(searchQuery.toLowerCase())) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase());

      return matchTab && matchCity && matchStatus && matchVerification && matchRating && matchDocStatus && matchQuery;
    });
  }, [vendors, activeTab, cityFilter, statusFilter, verificationFilter, ratingFilter, documentStatusFilter, searchQuery]);

  const activeProfile = useMemo(() => vendors.find(v => v.id === selectedProfileId), [vendors, selectedProfileId]);

  const handleApprove = (id) => {
    const updated = vendors.map(v => v.id === id ? { ...v, verification: 'Approved' } : v);
    setVendors(updated);
    mockDb.saveVendors(updated);
    showToast("Vendor KYC approved successfully!", "success");
    window.dispatchEvent(new Event('storage'));
  };

  const handleReject = (id) => {
    const updated = vendors.map(v => v.id === id ? { ...v, verification: 'Rejected' } : v);
    setVendors(updated);
    mockDb.saveVendors(updated);
    showToast("Vendor KYC rejected successfully!", "error");
    window.dispatchEvent(new Event('storage'));
  };

  const handleApproveRejectToggle = (id) => {
    const current = vendors.find(v => v.id === id);
    if (current.verification === 'Approved') {
      handleReject(id);
    } else {
      handleApprove(id);
    }
  };

  const handleSuspendToggle = (id) => {
    const updated = vendors.map(v => {
      if (v.id === id) {
        const next = v.accountStatus === 'Active' ? 'Suspended' : 'Active';
        return { ...v, accountStatus: next };
      }
      return v;
    });
    setVendors(updated);
    mockDb.saveVendors(updated);
    const current = updated.find(v => v.id === id);
    showToast(`Vendor account is now ${current.accountStatus}!`, "info");
    window.dispatchEvent(new Event('storage'));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      const updated = vendors.filter(v => v.id !== id);
      setVendors(updated);
      mockDb.saveVendors(updated);
      showToast("Vendor deleted successfully!", "success");
      window.dispatchEvent(new Event('storage'));
    }
  };

  const handleApproveFromDrawer = (id) => {
    handleApprove(id);
  };

  const handleRejectFromDrawer = (id) => {
    handleReject(id);
  };

  const handleSuspendFromDrawer = (id) => {
    handleSuspendToggle(id);
  };

  const handleDeleteFromDrawer = (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      const updated = vendors.filter(v => v.id !== id);
      setVendors(updated);
      mockDb.saveVendors(updated);
      setSelectedProfileId(null);
      showToast("Vendor deleted successfully!", "success");
      window.dispatchEvent(new Event('storage'));
    }
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
      </div>

      {/* Hero Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-slate-700/50 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border border-blue-400/30 shrink-0">
            <Box size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Vendor Network</h1>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">Manage supply chains, manpower agencies, service providers and marketing agencies.</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { title: "Total Vendors", val: totalVendors, col: "text-slate-800", bg: "bg-slate-50" },
          { title: "Active", val: activeCount, col: "text-emerald-700", bg: "bg-emerald-50" },
          { title: "Suspended", val: suspendedCount, col: "text-rose-700", bg: "bg-rose-50" },
          { title: "Pending Verif.", val: pendingVerifCount, col: "text-amber-700", bg: "bg-amber-50" },
          { title: "Top Rated", val: topRatedCount, col: "text-indigo-700", bg: "bg-indigo-50" },
          { title: "Expiring Docs", val: expiringDocsCount, col: "text-amber-700", bg: "bg-amber-50" },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-xl border border-slate-100 shadow-sm ${s.bg}`}>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.title}</span>
            <div className={`text-xl font-black mt-1 ${s.col}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col gap-4 bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-1 bg-[#F3F4F6] border border-slate-200/60 p-1 rounded-xl">
            {["All", "Raw Material", "Manpower", "Service Provider", "Marketing Agency"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all active:scale-[0.97] ${activeTab === tab
                  ? "bg-white text-blue-700 shadow-sm border border-slate-200/30"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, ID, business, phone..."
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
            <option value="Pune">Pune</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-lg px-3 py-1.5 focus:outline-none text-slate-600 font-semibold">
            <option value="All">All Account Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Blocked">Blocked</option>
          </select>
          <select value={documentStatusFilter} onChange={e => setDocumentStatusFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-lg px-3 py-1.5 focus:outline-none text-slate-600 font-semibold">
            <option value="All">All Document Status</option>
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
              <th className="p-4 font-bold">Vendor Name</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold">Business Name</th>
              <th className="p-4 font-bold">City</th>
              <th className="p-4 font-bold">Rating</th>
              <th className="p-4 font-bold">Verification</th>
              <th className="p-4 font-bold">Document Status</th>
              <th className="p-4 font-bold">Account Status</th>
              <th className="p-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.length > 0 ? (
              filteredVendors.map((v) => (
                <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-800">{v.name}</span>
                        {v.isTopRated && <span className="text-[8px] font-bold bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.5 rounded-full uppercase">Top Rated</span>}
                      </div>
                      <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded w-max">{v.id}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-semibold text-slate-700">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-md border ${v.category === "Raw Material" ? "bg-blue-50 border-blue-100 text-blue-700" :
                      v.category === "Manpower" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                        v.category === "Service Provider" ? "bg-indigo-50 border-indigo-100 text-indigo-700" :
                          "bg-purple-50 border-purple-100 text-purple-700"
                      }`}>
                      {v.category}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-bold text-slate-700">{v.businessName}</td>
                  <td className="p-4 text-xs font-semibold text-slate-600">{v.city}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {v.rating}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveRejectToggle(v.id);
                        }}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${v.verification === 'Approved' ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        title={v.verification === 'Approved' ? 'KYC is Approved (click to reject)' : 'KYC is Pending/Rejected (click to approve)'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${v.verification === 'Approved' ? 'translate-x-4' : 'translate-x-0'
                            }`}
                        />
                      </button>
                      <span className={`text-[10px] font-black ${v.verification === 'Approved' ? 'text-blue-600' : 'text-slate-400'}`}>
                        {v.verification === 'Approved' ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${v.documentStatus === 'Valid' ? 'bg-emerald-50 border-emerald-200/30 text-emerald-700' :
                      v.documentStatus === 'Expiring Soon' ? 'bg-amber-50 border-amber-200/30 text-amber-700' :
                        'bg-rose-50 border-rose-200/30 text-rose-700'
                      }`}>
                      {v.documentStatus === 'Valid' ? '🟢 Valid' :
                        v.documentStatus === 'Expiring Soon' ? '🟡 Expiring Soon' :
                          '🔴 Expired'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSuspendToggle(v.id);
                        }}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${v.accountStatus === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                        title={v.accountStatus === 'Active' ? 'Account is Active (click to toggle)' : 'Account is Suspended (click to toggle)'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${v.accountStatus === 'Active' ? 'translate-x-4' : 'translate-x-0'
                            }`}
                        />
                      </button>
                      <span className={`text-[10px] font-black ${v.accountStatus === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {v.accountStatus === 'Active' ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProfileId(v.id);
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
                <td colSpan="9" className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Building size={48} className="text-slate-300 stroke-[1.5]" />
                    <span className="text-xs font-black text-slate-500">No Vendors Found</span>
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

      {/* Vendor Profile Modal (Centered) */}
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
                    {activeProfile.category === 'Raw Material' ? <Box size={20} /> :
                      activeProfile.category === 'Manpower' ? <Users size={20} /> :
                        activeProfile.category === 'Service Provider' ? <Settings size={20} /> : <Megaphone size={20} />}
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 text-sm">{activeProfile.name}</h2>
                    <span className="text-[10px] text-slate-400 font-bold">{activeProfile.category} • {activeProfile.id}</span>
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
                    <span className="text-[11px] font-extrabold text-blue-600">{activeProfile.profileCompletion}% Complete</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${activeProfile.profileCompletion}%` }} />
                  </div>
                </div>

                {/* Vendor Identity Details */}
                <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs space-y-3">
                  <div className="flex justify-center py-2">
                    <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-black text-xl">
                      {activeProfile.name.substring(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Vendor Name</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Business Name</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.businessName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Vendor Category</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.category}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Owner Name</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.ownerName}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Phone</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.phone}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Email</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.email}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">City</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.city}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Service Area</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.serviceArea}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Registration Date</span>
                      <span className="font-bold text-slate-700 block mt-0.5">{activeProfile.joinedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Statistics */}
                <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Performance Parameters</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Rating</span>
                      <span className="text-lg font-black text-amber-500 mt-1 block flex items-center gap-1">
                        {activeProfile.rating} <Star size={16} className="fill-amber-400 text-amber-400" />
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Total Orders / Jobs</span>
                      <span className="text-lg font-black text-slate-800 mt-1 block">
                        {activeProfile.category === 'Raw Material' ? activeProfile.totalOrders :
                          activeProfile.category === 'Manpower' ? activeProfile.candidateCount :
                            activeProfile.category === 'Service Provider' ? activeProfile.completedServices :
                              activeProfile.completedCampaigns}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Completed</span>
                      <span className="text-lg font-black text-slate-800 mt-1 block">
                        {activeProfile.completedOrders || activeProfile.completedServices || activeProfile.completedCampaigns || 0}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Success Rate</span>
                      <span className="text-lg font-black text-emerald-600 mt-1 block">{activeProfile.successRate || "100%"}</span>
                    </div>
                  </div>
                </div>

                {/* Documents Checklist */}
                <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Compliance Documents</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {activeProfile.documents && activeProfile.documents.map((doc) => (
                      <div key={doc.name} className="border border-slate-100 rounded-lg p-3 bg-slate-50 flex flex-col justify-between gap-1.5">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-slate-600">{doc.name}</span>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded border ${doc.status === 'Valid' ? 'bg-emerald-50 border-emerald-200/40 text-emerald-700' :
                            doc.status === 'Expiring Soon' ? 'bg-amber-50 border-amber-200/40 text-amber-700' :
                              'bg-rose-50 border-rose-200/40 text-rose-700'
                            }`}>{doc.status}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[8px] text-slate-400 font-medium">Expiry: {doc.expiryDate}</span>
                          <button
                            onClick={() => showToast(`Downloading ${doc.name} compliance document...`, "success")}
                            className="p-1 rounded bg-white hover:bg-slate-100 text-blue-600 border border-slate-200/50"
                            title="Download Doc"
                          >
                            <Download size={10} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Specific Details */}
                <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Category-Specific Information</h4>
                  <div className="text-xs space-y-2">
                    {activeProfile.category === 'Raw Material' && (
                      <>
                        <div className="flex justify-between p-2 bg-slate-50/50 border border-slate-50 rounded-lg">
                          <span className="font-semibold text-slate-600">Product Categories</span>
                          <span className="font-bold text-slate-800">{activeProfile.productCategories}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50/50 border border-slate-50 rounded-lg">
                          <span className="font-semibold text-slate-600">Delivery Area</span>
                          <span className="font-bold text-slate-800">{activeProfile.deliveryArea}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50/50 border border-slate-50 rounded-lg">
                          <span className="font-semibold text-slate-600">Stock Availability</span>
                          <span className="font-bold text-emerald-600">{activeProfile.stockAvailability}</span>
                        </div>
                      </>
                    )}
                    {activeProfile.category === 'Manpower' && (
                      <>
                        <div className="flex justify-between p-2 bg-slate-50/50 border border-slate-50 rounded-lg">
                          <span className="font-semibold text-slate-600">Available Staff</span>
                          <span className="font-bold text-slate-800">{activeProfile.availableStaff}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50/50 border border-slate-50 rounded-lg">
                          <span className="font-semibold text-slate-600">Staff Roles</span>
                          <span className="font-bold text-slate-800">{activeProfile.staffRoles}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50/50 border border-slate-50 rounded-lg">
                          <span className="font-semibold text-slate-600">Placement Count</span>
                          <span className="font-bold text-slate-800">{activeProfile.placementCount} Placement(s)</span>
                        </div>
                      </>
                    )}
                    {activeProfile.category === 'Service Provider' && (
                      <>
                        <div className="flex justify-between p-2 bg-slate-50/50 border border-slate-50 rounded-lg">
                          <span className="font-semibold text-slate-600">Service Categories</span>
                          <span className="font-bold text-slate-800">{activeProfile.serviceCategories}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50/50 border border-slate-50 rounded-lg">
                          <span className="font-semibold text-slate-600">Completed Services</span>
                          <span className="font-bold text-slate-800">{activeProfile.completedServices} Services</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50/50 border border-slate-50 rounded-lg">
                          <span className="font-semibold text-slate-600">Service Areas</span>
                          <span className="font-bold text-slate-800">{activeProfile.serviceAreas}</span>
                        </div>
                      </>
                    )}
                    {activeProfile.category === 'Marketing Agency' && (
                      <>
                        <div className="flex justify-between p-2 bg-slate-50/50 border border-slate-50 rounded-lg">
                          <span className="font-semibold text-slate-600">Active Campaigns</span>
                          <span className="font-bold text-slate-800">{activeProfile.activeCampaigns} Active</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50/50 border border-slate-50 rounded-lg">
                          <span className="font-semibold text-slate-600">Completed Campaigns</span>
                          <span className="font-bold text-slate-800">{activeProfile.completedCampaigns} Campaigns</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50/50 border border-slate-50 rounded-lg">
                          <span className="font-semibold text-slate-600">Portfolio Count</span>
                          <span className="font-bold text-slate-800">{activeProfile.portfolioCount} Projects</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

              </div>

              {/* Footer Quick Actions */}
              <div className="bg-slate-50 border-t border-slate-100 p-4 flex gap-2 flex-shrink-0">
                {activeProfile.verification !== 'Approved' ? (
                  <button
                    onClick={() => handleApproveFromDrawer(activeProfile.id)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => handleRejectFromDrawer(activeProfile.id)}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    Reject KYC
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
                  title="Delete Vendor"
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
