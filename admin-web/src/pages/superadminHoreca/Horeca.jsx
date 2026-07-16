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

  // State
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Impersonation
  const [impersonateTarget, setImpersonateTarget] = useState(null);
  const [impersonateReason, setImpersonateReason] = useState("");
  const [activeImpersonation, setActiveImpersonation] = useState(null);

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

  const filteredListings = useMemo(() => {
    return horecaListings.filter((b) => {
      const matchTab = horecaTab === "All" || b.type === horecaTab;
      const matchCity = cityFilter === "All" || b.city === cityFilter;
      const matchStatus = statusFilter === "All" || b.accountStatus === statusFilter;
      const matchVerification = verificationFilter === "All" || b.verification === verificationFilter;
      const matchQuery =
        b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchCity && matchStatus && matchVerification && matchQuery;
    });
  }, [horecaListings, horecaTab, cityFilter, statusFilter, verificationFilter, searchQuery]);

  const activeProfile = useMemo(() => horecaListings.find(b => b.id === selectedProfileId), [horecaListings, selectedProfileId]);

  const handleImpersonateStart = (e, b) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setImpersonateTarget(b);
  };

  const confirmImpersonation = () => {
    if (!impersonateReason.trim()) {
      showToast("Reason is required.", "error");
      return;
    }
    setActiveImpersonation(impersonateTarget);
    setImpersonateTarget(null);
    setImpersonateReason("");
    showToast(`Started impersonating ${impersonateTarget.businessName}`, "success");
  };

  const endImpersonation = () => {
    showToast(`Ended impersonation for ${activeImpersonation.businessName}`, "info");
    setActiveImpersonation(null);
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
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white backdrop-blur-md pointer-events-auto ${
                toast.type === "success" ? "border-emerald-500/20 text-emerald-800" : 
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

      {/* Global Impersonation Warning Banner */}
      <AnimatePresence>
        {activeImpersonation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-rose-600 text-white p-4 rounded-xl shadow-lg flex items-center justify-between sticky top-4 z-40 border border-rose-500"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-400 animate-pulse" />
              <ShieldAlert size={20} className="text-rose-200" />
              <div>
                <h4 className="font-bold text-sm">Impersonation Active: {activeImpersonation.businessName}</h4>
                <p className="text-[10px] text-rose-200 uppercase tracking-wider font-semibold">Any actions taken will be logged as {activeImpersonation.owner}.</p>
              </div>
            </div>
            <button
              onClick={endImpersonation}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-lg transition-colors"
            >
              End Impersonation
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5">
        <h1 className="text-xl font-black text-slate-800 tracking-tight">HoReCa Directory</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Manage all Hotel, Restaurant, and Cafe listings on the platform.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Businesses", val: totalBusinesses, col: "text-slate-800", bg: "bg-slate-50" },
          { title: "Active", val: activeCount, col: "text-emerald-700", bg: "bg-emerald-50" },
          { title: "Suspended", val: suspendedCount, col: "text-rose-700", bg: "bg-rose-50" },
          { title: "Pending Verification", val: pendingVerifCount, col: "text-amber-700", bg: "bg-amber-50" },
        ].map((s, i) => (
          <div key={i} className={`p-5 rounded-xl border border-slate-100 shadow-sm ${s.bg}`}>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.title}</span>
            <div className={`text-2xl font-black mt-2 ${s.col}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-1 bg-[#F3F4F6] border border-slate-200/60 p-1 rounded-xl">
            {["All", "Hotel", "Restaurant", "Cafe"].map((tab) => (
              <button
                key={tab}
                onClick={() => setHorecaTab(tab)}
                className={`text-[11px] font-bold px-4 py-1.5 rounded-lg transition-all active:scale-[0.97] ${
                  horecaTab === tab
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
                placeholder="Search name, owner, ID..."
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
          <select value={verificationFilter} onChange={e => setVerificationFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-lg px-3 py-1.5 focus:outline-none text-slate-600 font-semibold">
            <option value="All">All Verification</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
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
              <th className="p-4 font-bold">Metrics</th>
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
                    <span className={`text-[9px] font-bold px-2 py-1 rounded-md border ${
                      b.type === "Hotel" ? "bg-blue-50 border-blue-100 text-blue-700" :
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
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
                        <Star className="w-3 h-3 fill-amber-400" /> {b.rating}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold">{b.orders} Orders</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[11px] font-semibold text-slate-600">{b.joinedDate}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 flex items-center gap-1 w-max rounded-full border ${
                      b.verification === "Approved" ? "bg-emerald-50 border-emerald-200/40 text-emerald-700" :
                      "bg-amber-50 border-amber-200/40 text-amber-700"
                    }`}>
                      {b.verification === "Approved" ? <CheckCircle size={10}/> : <AlertTriangle size={10}/>}
                      {b.verification}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.accountStatus === "Active" ? "text-emerald-600" : "text-rose-600"
                    }`}>
                      • {b.accountStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === b.id ? null : b.id);
                      }}
                      className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                    >
                      <MoreVertical size={16} />
                    </button>

                    <AnimatePresence>
                      {activeMenuId === b.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 5 }}
                          className="absolute right-8 top-8 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2 text-left"
                        >
                          <button onClick={() => { setSelectedProfileId(b.id); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                            <Building size={14} /> View Profile
                          </button>
                          <button className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                            <ShoppingBag size={14} /> View Orders
                          </button>
                          <button className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                            <ClipboardList size={14} /> View Requirements
                          </button>
                          <button className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                            <Activity size={14} /> View Activity
                          </button>
                          
                          <div className="h-px bg-slate-100 my-1 mx-2" />
                          
                          <button onClick={(e) => handleImpersonateStart(e, b)} className="w-full text-left px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2">
                            <UserCheck size={14} /> Impersonate
                          </button>
                          
                          <div className="h-px bg-slate-100 my-1 mx-2" />

                          <button className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                            <UserX size={14} /> Suspend Account
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-8 text-center text-slate-400 text-xs font-medium">
                  No businesses found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Impersonate Dialog */}
      <AnimatePresence>
        {impersonateTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setImpersonateTarget(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10"
            >
              <div className="flex justify-center mb-4 text-indigo-500">
                <UserCheck size={40} />
              </div>
              <h3 className="text-lg font-black text-slate-800 text-center mb-1">Impersonate User</h3>
              <p className="text-xs text-slate-500 text-center mb-6">
                You are about to securely mirror <span className="font-bold text-slate-800">{impersonateTarget.owner}</span> from {impersonateTarget.businessName}.
              </p>
              
              <div className="mb-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Reason for Impersonation</label>
                <textarea
                  value={impersonateReason}
                  onChange={(e) => setImpersonateReason(e.target.value)}
                  placeholder="e.g., Investigating ticket #T-889..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] resize-none"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 mb-6">
                <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-amber-800 font-medium">
                  All actions taken during this session will be logged under your super-admin account on behalf of this user.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => { setImpersonateTarget(null); setImpersonateReason(''); }}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors w-full"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmImpersonation}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors w-full"
                >
                  Start Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Business Profile Modal */}
      <AnimatePresence>
        {activeProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedProfileId(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#F8FAFC] shadow-2xl rounded-2xl w-full max-w-5xl flex flex-col relative z-10 max-h-[90vh] overflow-hidden"
            >
              {/* Profile Header */}
              <div className="bg-white px-6 py-5 border-b border-slate-200 flex justify-between items-start flex-shrink-0">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                    <Building size={24} />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 text-xl">{activeProfile.businessName}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{activeProfile.id}</span>
                      <span className="text-[10px] text-slate-400 font-bold">• {activeProfile.type} in {activeProfile.city}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedProfileId(null)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                  <X size={20} />
                </button>
              </div>

              {/* Profile Body */}
              <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "thin" }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Col */}
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Key Details */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <UserCheck size={14} /> Owner Details & Access
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Owner Name</span>
                          <span className="text-xs font-bold text-slate-700">{activeProfile.owner}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Contact Phone</span>
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1"><Phone size={12}/> +91 98XXXXXX21</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Email Address</span>
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1"><Mail size={12}/> owner@domain.com</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Joined</span>
                          <span className="text-xs font-bold text-slate-700">{activeProfile.joinedDate}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Account Status</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${
                            activeProfile.accountStatus === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}>{activeProfile.accountStatus}</span>
                        </div>
                      </div>
                    </div>

                    {/* Locations & Meta */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <MapPin size={14} /> Business Footprint
                      </h4>
                      <div className="flex flex-col gap-3">
                        <div className="p-3 border border-slate-100 rounded-lg bg-slate-50 flex items-center gap-3">
                          <MapPin className="text-blue-500" size={16} />
                          <div>
                            <span className="text-[11px] font-bold text-slate-700 block">Registered Locations</span>
                            <span className="text-[10px] text-slate-500 font-medium">{activeProfile.locations}</span>
                          </div>
                        </div>
                        <div className="p-3 border border-slate-100 rounded-lg bg-slate-50 flex items-center gap-3">
                          <FileText className="text-indigo-500" size={16} />
                          <div>
                            <span className="text-[11px] font-bold text-slate-700 block">Document Status</span>
                            <span className="text-[10px] text-slate-500 font-medium">{activeProfile.documents}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Col */}
                  <div className="flex flex-col gap-6">
                    {/* Quick Stats */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-xl border border-slate-700 shadow-md text-white">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Platform Usage</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-2xl font-black">{activeProfile.orders}</span>
                          <span className="text-[9px] text-slate-300 font-bold uppercase block mt-1">Total Orders</span>
                        </div>
                        <div>
                          <span className="text-2xl font-black flex items-center gap-1">{activeProfile.rating} <Star size={16} className="fill-amber-400 text-amber-400" /></span>
                          <span className="text-[9px] text-slate-300 font-bold uppercase block mt-1">Avg Rating</span>
                        </div>
                        <div className="col-span-2 bg-white/10 p-2.5 rounded-lg border border-white/10 mt-2">
                          <span className="text-[11px] font-bold block">{activeProfile.requirements}</span>
                          <span className="text-[11px] font-bold block mt-1 text-rose-300">{activeProfile.complaints}</span>
                        </div>
                      </div>
                    </div>

                    {/* Activity Log */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex-1">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Activity size={14} /> Recent Activity
                      </h4>
                      <div className="flex flex-col gap-3 relative">
                        <div className="absolute left-1.5 top-2 bottom-2 w-px bg-slate-200 z-0"></div>
                        {activeProfile.activityHistory.map((act, idx) => (
                          <div key={idx} className="flex items-start gap-3 relative z-10">
                            <div className="w-3 h-3 rounded-full bg-slate-200 border-2 border-white mt-1"></div>
                            <div>
                              <div className="text-[11px] font-bold text-slate-700">{act.action}</div>
                              <div className="text-[9px] text-slate-400 mt-0.5">{act.date}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
