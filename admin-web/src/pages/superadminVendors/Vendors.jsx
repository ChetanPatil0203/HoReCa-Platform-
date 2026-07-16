import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Plus, Star, X, MoreVertical, Building, Eye, AlertTriangle, UserCheck, ShieldAlert, CheckCircle, Activity, MapPin, FileText, Phone, Mail, Box, Users, Settings, Megaphone } from 'lucide-react';
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

  // State
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Impersonation
  const [impersonateTarget, setImpersonateTarget] = useState(null);
  const [impersonateReason, setImpersonateReason] = useState("");
  const [activeImpersonation, setActiveImpersonation] = useState(null);

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

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchTab = activeTab === "All" || v.category === activeTab;
      const matchCity = cityFilter === "All" || v.city === cityFilter;
      const matchStatus = statusFilter === "All" || v.accountStatus === statusFilter;
      const matchVerification = verificationFilter === "All" || v.verification === verificationFilter;
      const matchRating = ratingFilter === "All" || (ratingFilter === "4.5+" && v.rating >= 4.5) || (ratingFilter === "<4.5" && v.rating < 4.5);
      const matchQuery =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTab && matchCity && matchStatus && matchVerification && matchRating && matchQuery;
    });
  }, [vendors, activeTab, cityFilter, statusFilter, verificationFilter, ratingFilter, searchQuery]);

  const activeProfile = useMemo(() => vendors.find(v => v.id === selectedProfileId), [vendors, selectedProfileId]);

  const handleImpersonateStart = (e, v) => {
    e.stopPropagation();
    setActiveMenuId(null);
    setImpersonateTarget(v);
  };

  const confirmImpersonation = () => {
    if (!impersonateReason.trim()) {
      showToast("Reason is required.", "error");
      return;
    }
    setActiveImpersonation(impersonateTarget);
    setImpersonateTarget(null);
    setImpersonateReason("");
    showToast(`Started impersonating ${impersonateTarget.name}`, "success");
  };

  const endImpersonation = () => {
    showToast(`Ended impersonation for ${activeImpersonation.name}`, "info");
    setActiveImpersonation(null);
  };

  const renderTableHeader = () => {
    if (activeTab === "Raw Material") {
      return (
        <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-500">
          <th className="p-4 font-bold">Vendor</th>
          <th className="p-4 font-bold">Product Count</th>
          <th className="p-4 font-bold">Total Orders</th>
          <th className="p-4 font-bold">On-Time Delivery</th>
          <th className="p-4 font-bold">Rating</th>
          <th className="p-4 font-bold">Status</th>
          <th className="p-4 font-bold text-center">Actions</th>
        </tr>
      );
    }
    if (activeTab === "Manpower") {
      return (
        <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-500">
          <th className="p-4 font-bold">Agency</th>
          <th className="p-4 font-bold">Candidate Count</th>
          <th className="p-4 font-bold">Active Deployments</th>
          <th className="p-4 font-bold">Placement Rate</th>
          <th className="p-4 font-bold">Replacement Rate</th>
          <th className="p-4 font-bold">Rating</th>
          <th className="p-4 font-bold text-center">Actions</th>
        </tr>
      );
    }
    if (activeTab === "Service Provider") {
      return (
        <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-500">
          <th className="p-4 font-bold">Provider</th>
          <th className="p-4 font-bold">Service Count</th>
          <th className="p-4 font-bold">Team Size</th>
          <th className="p-4 font-bold">Active Jobs</th>
          <th className="p-4 font-bold">Completion Rate</th>
          <th className="p-4 font-bold">Rework Rate</th>
          <th className="p-4 font-bold text-center">Actions</th>
        </tr>
      );
    }
    if (activeTab === "Marketing Agency") {
      return (
        <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-500">
          <th className="p-4 font-bold">Agency</th>
          <th className="p-4 font-bold">Service Type</th>
          <th className="p-4 font-bold">Active Campaigns</th>
          <th className="p-4 font-bold">Completed Campaigns</th>
          <th className="p-4 font-bold">Team Size</th>
          <th className="p-4 font-bold">Rating</th>
          <th className="p-4 font-bold text-center">Actions</th>
        </tr>
      );
    }
    return (
      <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-500">
        <th className="p-4 font-bold">Vendor Name</th>
        <th className="p-4 font-bold">Category</th>
        <th className="p-4 font-bold">City</th>
        <th className="p-4 font-bold">Rating</th>
        <th className="p-4 font-bold">Verification</th>
        <th className="p-4 font-bold">Status</th>
        <th className="p-4 font-bold text-center">Actions</th>
      </tr>
    );
  };

  const renderTableRow = (v) => {
    const actionCell = (
      <td className="p-4 text-center relative" onClick={e => e.stopPropagation()}>
        <button 
          onClick={() => setActiveMenuId(activeMenuId === v.id ? null : v.id)}
          className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors inline-block"
        >
          <MoreVertical size={16} />
        </button>

        <AnimatePresence>
          {activeMenuId === v.id && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              className="absolute right-8 top-8 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2 text-left"
            >
              <button onClick={() => { setSelectedProfileId(v.id); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                <Eye size={14} /> View Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                <Activity size={14} /> View Operations
              </button>
              <button className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                <AlertTriangle size={14} /> View Complaints
              </button>
              
              <div className="h-px bg-slate-100 my-1 mx-2" />
              
              <button onClick={(e) => handleImpersonateStart(e, v)} className="w-full text-left px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 flex items-center gap-2">
                <UserCheck size={14} /> Impersonate
              </button>
              
              <div className="h-px bg-slate-100 my-1 mx-2" />

              <button className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                <ShieldAlert size={14} /> Suspend Account
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </td>
    );

    const commonNameCell = (
      <td className="p-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-800">{v.name}</span>
            {v.isTopRated && <span className="text-[8px] font-bold bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.5 rounded-full uppercase">Top Rated</span>}
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded w-max">{v.id}</span>
        </div>
      </td>
    );

    const ratingCell = (
      <td className="p-4">
        <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
          <Star className="w-3 h-3 fill-amber-400" /> {v.rating}
        </div>
      </td>
    );

    const statusCell = (
      <td className="p-4">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          v.accountStatus === "Active" ? "text-emerald-600" : "text-rose-600"
        }`}>
          • {v.accountStatus}
        </span>
      </td>
    );

    if (activeTab === "Raw Material") {
      return (
        <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
          {commonNameCell}
          <td className="p-4 text-xs font-semibold text-slate-700">{v.productCount} Items</td>
          <td className="p-4 text-xs font-semibold text-slate-700">{v.totalOrders}</td>
          <td className="p-4 text-xs font-semibold text-emerald-600">{v.onTimeDelivery}</td>
          {ratingCell}
          {statusCell}
          {actionCell}
        </tr>
      );
    }
    if (activeTab === "Manpower") {
      return (
        <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
          {commonNameCell}
          <td className="p-4 text-xs font-semibold text-slate-700">{v.candidateCount} Pool</td>
          <td className="p-4 text-xs font-semibold text-slate-700">{v.activeDeployments} Active</td>
          <td className="p-4 text-xs font-semibold text-emerald-600">{v.placementRate}</td>
          <td className="p-4 text-xs font-semibold text-rose-500">{v.replacementRate}</td>
          {ratingCell}
          {actionCell}
        </tr>
      );
    }
    if (activeTab === "Service Provider") {
      return (
        <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
          {commonNameCell}
          <td className="p-4 text-xs font-semibold text-slate-700">{v.serviceCount} Services</td>
          <td className="p-4 text-xs font-semibold text-slate-700">{v.teamSize} Members</td>
          <td className="p-4 text-xs font-semibold text-slate-700">{v.activeJobs} Jobs</td>
          <td className="p-4 text-xs font-semibold text-emerald-600">{v.completionRate}</td>
          <td className="p-4 text-xs font-semibold text-rose-500">{v.reworkRate}</td>
          {actionCell}
        </tr>
      );
    }
    if (activeTab === "Marketing Agency") {
      return (
        <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
          {commonNameCell}
          <td className="p-4 text-xs font-semibold text-slate-700">{v.serviceType}</td>
          <td className="p-4 text-xs font-semibold text-slate-700">{v.activeCampaigns} Active</td>
          <td className="p-4 text-xs font-semibold text-slate-700">{v.completedCampaigns} Done</td>
          <td className="p-4 text-xs font-semibold text-slate-700">{v.teamSize} Size</td>
          {ratingCell}
          {actionCell}
        </tr>
      );
    }

    return (
      <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
        {commonNameCell}
        <td className="p-4">
          <span className={`text-[9px] font-bold px-2 py-1 rounded-md border ${
            v.category === "Raw Material" ? "bg-blue-50 border-blue-100 text-blue-700" :
            v.category === "Manpower" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
            v.category === "Service Provider" ? "bg-indigo-50 border-indigo-100 text-indigo-700" :
            "bg-purple-50 border-purple-100 text-purple-700"
          }`}>
            {v.category}
          </span>
        </td>
        <td className="p-4 text-xs font-bold text-slate-700">{v.city}</td>
        {ratingCell}
        <td className="p-4">
          <span className={`text-[10px] font-extrabold px-2 py-0.5 flex items-center gap-1 w-max rounded-full border ${
            v.verification === "Approved" ? "bg-emerald-50 border-emerald-200/40 text-emerald-700" :
            "bg-amber-50 border-amber-200/40 text-amber-700"
          }`}>
            {v.verification === "Approved" ? <CheckCircle size={10}/> : <AlertTriangle size={10}/>}
            {v.verification}
          </span>
        </td>
        {statusCell}
        {actionCell}
      </tr>
    );
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
                <h4 className="font-bold text-sm">Impersonation Active: {activeImpersonation.name}</h4>
                <p className="text-[10px] text-rose-200 uppercase tracking-wider font-semibold">Any actions taken will be logged as {activeImpersonation.name}.</p>
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
        <h1 className="text-xl font-black text-slate-800 tracking-tight">Vendor Network</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Manage supply chains, manpower agencies, service providers and marketing agencies.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: "Total Vendors", val: totalVendors, col: "text-slate-800", bg: "bg-slate-50" },
          { title: "Active", val: activeCount, col: "text-emerald-700", bg: "bg-emerald-50" },
          { title: "Suspended", val: suspendedCount, col: "text-rose-700", bg: "bg-rose-50" },
          { title: "Pending Verif.", val: pendingVerifCount, col: "text-amber-700", bg: "bg-amber-50" },
          { title: "Top Rated", val: topRatedCount, col: "text-indigo-700", bg: "bg-indigo-50" },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-xl border border-slate-100 shadow-sm ${s.bg}`}>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{s.title}</span>
            <div className={`text-xl font-black mt-1 ${s.col}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-1 bg-[#F3F4F6] border border-slate-200/60 p-1 rounded-xl">
            {["All", "Raw Material", "Manpower", "Service Provider", "Marketing Agency"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all active:scale-[0.97] ${
                  activeTab === tab
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
                placeholder="Search vendor name, ID..."
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
          <select value={ratingFilter} onChange={e => setRatingFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-lg px-3 py-1.5 focus:outline-none text-slate-600 font-semibold">
            <option value="All">All Ratings</option>
            <option value="4.5+">4.5 & Above</option>
            <option value="<4.5">Below 4.5</option>
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
            {renderTableHeader()}
          </thead>
          <tbody>
            {filteredVendors.length > 0 ? (
              filteredVendors.map((v) => renderTableRow(v))
            ) : (
              <tr>
                <td colSpan="8" className="p-8 text-center text-slate-400 text-xs font-medium">
                  No vendors found matching filters.
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
              <h3 className="text-lg font-black text-slate-800 text-center mb-1">Impersonate Vendor</h3>
              <p className="text-xs text-slate-500 text-center mb-6">
                You are about to securely mirror the dashboard of <span className="font-bold text-slate-800">{impersonateTarget.name}</span>.
              </p>
              
              <div className="mb-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Reason for Impersonation</label>
                <textarea
                  value={impersonateReason}
                  onChange={(e) => setImpersonateReason(e.target.value)}
                  placeholder="e.g., Investigating compliance issue..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] resize-none"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 mb-6">
                <AlertTriangle size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-amber-800 font-medium">
                  All actions taken during this session will be logged under your super-admin account on behalf of this vendor.
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

      {/* Vendor Profile Modal */}
      <AnimatePresence>
        {activeProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedProfileId(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#F8FAFC] shadow-2xl rounded-2xl w-full max-w-4xl flex flex-col relative z-10 max-h-[90vh] overflow-hidden"
            >
              {/* Profile Header */}
              <div className="bg-white px-6 py-5 border-b border-slate-200 flex justify-between items-start flex-shrink-0">
                <div className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                    {activeProfile.category === 'Raw Material' ? <Box size={24} /> :
                     activeProfile.category === 'Manpower' ? <Users size={24} /> :
                     activeProfile.category === 'Service Provider' ? <Settings size={24} /> : <Megaphone size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-black text-slate-800 text-xl">{activeProfile.name}</h2>
                      {activeProfile.isTopRated && <span className="text-[9px] font-bold bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full uppercase">Top Rated</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{activeProfile.id}</span>
                      <span className="text-[10px] text-slate-400 font-bold">• {activeProfile.category} in {activeProfile.city}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedProfileId(null)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                  <X size={20} />
                </button>
              </div>

              {/* Profile Body */}
              <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "thin" }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Basic Info */}
                  <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Vendor Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Joined Date</span>
                        <span className="text-xs font-bold text-slate-700">{activeProfile.joinedDate}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">City</span>
                        <span className="text-xs font-bold text-slate-700">{activeProfile.city}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Verification</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${
                          activeProfile.verification === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>{activeProfile.verification}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Status</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${
                          activeProfile.accountStatus === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>{activeProfile.accountStatus}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Rating</span>
                        <span className="text-xs font-bold text-amber-600 flex items-center gap-1"><Star size={12} className="fill-amber-500" /> {activeProfile.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Operations Meta */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-xl border border-slate-700 shadow-md text-white">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">Operations Meta</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {activeProfile.category === 'Raw Material' && (
                        <>
                          <div><span className="text-2xl font-black block">{activeProfile.productCount}</span><span className="text-[9px] text-slate-300 font-bold uppercase">Products</span></div>
                          <div><span className="text-2xl font-black block">{activeProfile.totalOrders}</span><span className="text-[9px] text-slate-300 font-bold uppercase">Total Orders</span></div>
                          <div><span className="text-2xl font-black block text-emerald-400">{activeProfile.onTimeDelivery}</span><span className="text-[9px] text-slate-300 font-bold uppercase">On-Time</span></div>
                        </>
                      )}
                      {activeProfile.category === 'Manpower' && (
                        <>
                          <div><span className="text-2xl font-black block">{activeProfile.candidateCount}</span><span className="text-[9px] text-slate-300 font-bold uppercase">Pool Size</span></div>
                          <div><span className="text-2xl font-black block">{activeProfile.activeDeployments}</span><span className="text-[9px] text-slate-300 font-bold uppercase">Deployed</span></div>
                          <div><span className="text-2xl font-black block text-emerald-400">{activeProfile.placementRate}</span><span className="text-[9px] text-slate-300 font-bold uppercase">Placement</span></div>
                        </>
                      )}
                      {activeProfile.category === 'Service Provider' && (
                        <>
                          <div><span className="text-2xl font-black block">{activeProfile.serviceCount}</span><span className="text-[9px] text-slate-300 font-bold uppercase">Services</span></div>
                          <div><span className="text-2xl font-black block">{activeProfile.activeJobs}</span><span className="text-[9px] text-slate-300 font-bold uppercase">Active Jobs</span></div>
                          <div><span className="text-2xl font-black block text-emerald-400">{activeProfile.completionRate}</span><span className="text-[9px] text-slate-300 font-bold uppercase">Completion</span></div>
                        </>
                      )}
                      {activeProfile.category === 'Marketing Agency' && (
                        <>
                          <div><span className="text-lg font-black block leading-tight">{activeProfile.serviceType}</span><span className="text-[9px] text-slate-300 font-bold uppercase mt-1 block">Expertise</span></div>
                          <div><span className="text-2xl font-black block">{activeProfile.activeCampaigns}</span><span className="text-[9px] text-slate-300 font-bold uppercase">Active</span></div>
                          <div><span className="text-2xl font-black block text-emerald-400">{activeProfile.completedCampaigns}</span><span className="text-[9px] text-slate-300 font-bold uppercase">Completed</span></div>
                        </>
                      )}
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
