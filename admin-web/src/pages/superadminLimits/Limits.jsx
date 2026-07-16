import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, X, AlertCircle, ShieldAlert, Shield, MoreVertical, Ban, CheckCircle, Clock } from 'lucide-react';

export default function Limits() {
  const [statusAccounts, setStatusAccounts] = useState([
    { id: "ACC-8901", businessName: "Royal Orchid Hotel", type: "Hotel", owner: "Ramesh Kumar", phone: "+91 98765 43210", city: "Mumbai", status: "Active", suspensionUntil: null, suspensionReason: null, lastUpdated: "24 May 2026", updatedBy: "System" },
    { id: "ACC-8902", businessName: "The Grand Palace", type: "Hotel", owner: "Suresh Das", phone: "+91 98765 43211", city: "Delhi", status: "Suspended", suspensionUntil: "30 Jun 2026", suspensionReason: "Unresolved SLA Breach", lastUpdated: "20 May 2026", updatedBy: "Super Admin" },
    { id: "ACC-8903", businessName: "Green Leaf Restaurant", type: "Restaurant", owner: "Vikram Singh", phone: "+91 98765 43212", city: "Pune", status: "Active", suspensionUntil: null, suspensionReason: null, lastUpdated: "24 May 2026", updatedBy: "System" },
    { id: "ACC-8904", businessName: "Café Coffee Day", type: "Cafe", owner: "Neha Mathews", phone: "+91 98765 43213", city: "Bangalore", status: "Blocked", suspensionUntil: "Permanent", suspensionReason: "Fraudulent Docs", lastUpdated: "10 May 2026", updatedBy: "Super Admin" },
    { id: "ACC-8905", businessName: "Spice Route Kitchen", type: "Restaurant", owner: "Ajay Verma", phone: "+91 98765 43214", city: "Hyderabad", status: "Active", suspensionUntil: null, suspensionReason: null, lastUpdated: "24 May 2026", updatedBy: "System" },
    { id: "ACC-8906", businessName: "Green Valley Suppliers", type: "Vendor", owner: "Rahul Sharma", phone: "+91 98765 43215", city: "Mumbai", status: "Suspended", suspensionUntil: "15 Jun 2026", suspensionReason: "Policy Violation", lastUpdated: "01 Jun 2026", updatedBy: "Neha Mathews" }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Modals
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [blockTarget, setBlockTarget] = useState(null);

  // Suspend Form State
  const [suspendForm, setSuspendForm] = useState({
    reason: "Policy Violation",
    startDate: "",
    endDate: "",
    note: "",
    notifyUser: true,
    handling: "Pause"
  });

  // Block Form State
  const [blockConfirmText, setBlockConfirmText] = useState("");

  useEffect(() => {
    const localAccounts = localStorage.getItem('hrchub_status_accounts_v2');
    if (localAccounts) {
      setStatusAccounts(JSON.parse(localAccounts));
    }
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const saveAccounts = (updated) => {
    setStatusAccounts(updated);
    localStorage.setItem('hrchub_status_accounts_v2', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const filteredAccounts = useMemo(() => {
    return statusAccounts.filter((a) => {
      const matchSearch = a.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "All" || a.status === statusFilter;
      const matchType = typeFilter === "All" || (typeFilter === "Vendor" ? a.type === "Vendor" : a.type !== "Vendor");
      
      return matchSearch && matchStatus && matchType;
    });
  }, [statusAccounts, searchQuery, statusFilter, typeFilter]);

  const activeHoreca = statusAccounts.filter(a => a.status === 'Active' && a.type !== 'Vendor').length;
  const suspendedHoreca = statusAccounts.filter(a => a.status === 'Suspended' && a.type !== 'Vendor').length;
  const activeVendors = statusAccounts.filter(a => a.status === 'Active' && a.type === 'Vendor').length;
  const suspendedVendors = statusAccounts.filter(a => a.status === 'Suspended' && a.type === 'Vendor').length;
  const blockedAccounts = statusAccounts.filter(a => a.status === 'Blocked').length;

  const handleAction = (e, acc, type) => {
    e.stopPropagation();
    setActiveMenuId(null);

    if (type === 'activate') {
      const updated = statusAccounts.map(a => 
        a.id === acc.id ? { ...a, status: "Active", suspensionUntil: null, suspensionReason: null, lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), updatedBy: "Super Admin" } : a
      );
      saveAccounts(updated);
      showToast(`${acc.businessName} has been fully activated.`, "success");
    } else if (type === 'suspend') {
      setSuspendTarget(acc);
      setSuspendForm({ reason: "Policy Violation", startDate: "", endDate: "", note: "", notifyUser: true, handling: "Pause" });
    } else if (type === 'block') {
      setBlockTarget(acc);
      setBlockConfirmText("");
    }
  };

  const executeSuspend = () => {
    if (!suspendForm.endDate) {
      showToast("Please provide an end date for the suspension.", "error");
      return;
    }
    const updated = statusAccounts.map(a => 
      a.id === suspendTarget.id ? { ...a, status: "Suspended", suspensionUntil: suspendForm.endDate, suspensionReason: suspendForm.reason, lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), updatedBy: "Super Admin" } : a
    );
    saveAccounts(updated);
    showToast(`${suspendTarget.businessName} temporarily suspended.`, "error");
    setSuspendTarget(null);
  };

  const executeBlock = () => {
    if (blockConfirmText !== blockTarget.businessName) {
      showToast("Confirmation text does not match the business name.", "error");
      return;
    }
    const updated = statusAccounts.map(a => 
      a.id === blockTarget.id ? { ...a, status: "Blocked", suspensionUntil: "Permanent", suspensionReason: "Permanent Block", lastUpdated: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), updatedBy: "Super Admin" } : a
    );
    saveAccounts(updated);
    showToast(`${blockTarget.businessName} has been PERMANENTLY BLOCKED.`, "error");
    setBlockTarget(null);
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
                toast.type === "success" ? "border-emerald-500/20 text-emerald-800" : "border-rose-500/20 text-rose-800"
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

      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5">
        <h1 className="text-xl font-black text-slate-800 tracking-tight">Status & Limits</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Manage merchant safety limits, suspensions, and permanent blocks securely.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Active HoReCa", count: activeHoreca, bg: "bg-emerald-50" },
          { label: "Suspended HoReCa", count: suspendedHoreca, bg: "bg-amber-50" },
          { label: "Active Vendors", count: activeVendors, bg: "bg-emerald-50" },
          { label: "Suspended Vendors", count: suspendedVendors, bg: "bg-amber-50" },
          { label: "Blocked Accounts", count: blockedAccounts, bg: "bg-rose-50 border-rose-200" }
        ].map((ind, i) => (
          <div key={i} className={`p-4 rounded-xl border border-slate-200/60 shadow-sm ${ind.bg}`}>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{ind.label}</span>
            <div className="text-lg font-black text-slate-800 truncate">{ind.count}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by entity name, owner, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-2 focus:outline-none text-slate-600 font-semibold">
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Blocked">Blocked</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-2 focus:outline-none text-slate-600 font-semibold">
            <option value="All">All Types</option>
            <option value="HoReCa">HoReCa (Hotels, Cafes, etc)</option>
            <option value="Vendor">Vendors & Agencies</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden w-full overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse min-w-[1100px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-500">
              <th className="p-4 font-bold">Entity & City</th>
              <th className="p-4 font-bold">Type</th>
              <th className="p-4 font-bold">Owner / Contact</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Suspension Data</th>
              <th className="p-4 font-bold">Last Updated By</th>
              <th className="p-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length > 0 ? filteredAccounts.map(acc => (
              <tr key={acc.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-black text-slate-800">{acc.businessName}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{acc.city} · {acc.id}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200`}>
                    {acc.type}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-700">{acc.owner}</span>
                    <span className="text-[10px] font-mono text-slate-400">{acc.phone}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    acc.status === "Active" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : 
                    acc.status === "Suspended" ? "bg-amber-50 border-amber-200 text-amber-700" :
                    "bg-rose-50 border-rose-200 text-rose-700"
                  }`}>
                    {acc.status}
                  </span>
                </td>
                <td className="p-4">
                  {acc.status !== "Active" ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold text-rose-600">Until: {acc.suspensionUntil}</span>
                      <span className="text-[9px] text-slate-500 font-semibold">{acc.suspensionReason}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">-</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-semibold text-slate-700">{acc.updatedBy}</span>
                    <span className="text-[10px] text-slate-400">{acc.lastUpdated}</span>
                  </div>
                </td>
                <td className="p-4 text-center relative" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === acc.id ? null : acc.id)}
                    className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors inline-block"
                  >
                    <MoreVertical size={16} />
                  </button>

                  <AnimatePresence>
                    {activeMenuId === acc.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        className="absolute right-8 top-8 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2 text-left"
                      >
                        {(acc.status === 'Suspended' || acc.status === 'Blocked') && (
                          <button onClick={(e) => handleAction(e, acc, 'activate')} className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                            <CheckCircle size={14} /> Restore / Activate
                          </button>
                        )}
                        
                        {acc.status === 'Active' && (
                          <button onClick={(e) => handleAction(e, acc, 'suspend')} className="w-full text-left px-4 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                            <Clock size={14} /> Temporarily Suspend
                          </button>
                        )}

                        <div className="h-px bg-slate-100 my-1 mx-2" />

                        {acc.status !== 'Blocked' && (
                          <button onClick={(e) => handleAction(e, acc, 'block')} className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                            <Ban size={14} /> Permanently Block
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-slate-400 text-xs font-medium">
                  No accounts match the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Temporarily Suspend Form Modal */}
      <AnimatePresence>
        {suspendTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSuspendTarget(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-amber-100 bg-amber-50 flex items-center gap-3">
                <Clock className="text-amber-600 w-5 h-5" />
                <h3 className="text-lg font-black text-amber-900">Temporarily Suspend Account</h3>
              </div>

              <div className="p-6 flex flex-col gap-5">
                <div>
                  <p className="text-xs text-slate-600 font-medium">
                    You are suspending <span className="font-extrabold text-slate-800">{suspendTarget.businessName}</span>. This will restrict their access to HRC HUB trading portals.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Primary Reason</label>
                    <select
                      value={suspendForm.reason}
                      onChange={(e) => setSuspendForm({...suspendForm, reason: e.target.value})}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                    >
                      <option value="Policy Violation">Policy Violation</option>
                      <option value="Unresolved SLA Breach">Unresolved SLA Breach</option>
                      <option value="Fraudulent Document Submissions">Fraudulent Document Submissions</option>
                      <option value="Escrow Dispute">Escrow Dispute</option>
                      <option value="Pending Verification Updates">Pending Verification Updates</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Start Date</label>
                    <input
                      type="date"
                      value={suspendForm.startDate}
                      onChange={(e) => setSuspendForm({...suspendForm, startDate: e.target.value})}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">End Date</label>
                    <input
                      type="date"
                      value={suspendForm.endDate}
                      onChange={(e) => setSuspendForm({...suspendForm, endDate: e.target.value})}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Handling for Active Orders/Jobs</label>
                    <select
                      value={suspendForm.handling}
                      onChange={(e) => setSuspendForm({...suspendForm, handling: e.target.value})}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-slate-700"
                    >
                      <option value="Pause">Pause all active orders</option>
                      <option value="Allow Completion">Allow current orders to complete</option>
                      <option value="Cancel All">Cancel all active orders</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Internal Note</label>
                    <textarea
                      value={suspendForm.note}
                      onChange={(e) => setSuspendForm({...suspendForm, note: e.target.value})}
                      placeholder="Add context for the administrative team..."
                      className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[60px] resize-none"
                    />
                  </div>

                  <div className="col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="notifyToggle"
                      checked={suspendForm.notifyUser}
                      onChange={(e) => setSuspendForm({...suspendForm, notifyUser: e.target.checked})}
                      className="rounded text-amber-600 focus:ring-amber-500"
                    />
                    <label htmlFor="notifyToggle" className="text-xs font-bold text-slate-600 cursor-pointer">
                      Send automated suspension notice to {suspendTarget.owner} ({suspendTarget.phone})
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button onClick={() => setSuspendTarget(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button onClick={executeSuspend} className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-sm transition-colors">
                    Suspend Account
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Permanently Block Form Modal (SAFETY CHECK) */}
      <AnimatePresence>
        {blockTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setBlockTarget(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-rose-100 bg-rose-50 flex items-center gap-3">
                <ShieldAlert className="text-rose-600 w-6 h-6" />
                <h3 className="text-lg font-black text-rose-900">Permanently Block Account</h3>
              </div>

              <div className="p-6 flex flex-col gap-5">
                <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-rose-800 text-xs font-bold leading-relaxed">
                  WARNING: This action is irreversible via the standard dashboard. All active orders, data, and access for this account will be immediately terminated.
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-xs text-slate-600 font-semibold">
                    To confirm the permanent block of <span className="font-black text-slate-900">"{blockTarget.businessName}"</span>, please type the business name exactly as it appears:
                  </p>
                  <input
                    type="text"
                    value={blockConfirmText}
                    onChange={(e) => setBlockConfirmText(e.target.value)}
                    placeholder={blockTarget.businessName}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold text-center mt-2"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => setBlockTarget(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                    Cancel Action
                  </button>
                  <button 
                    onClick={executeBlock} 
                    disabled={blockConfirmText !== blockTarget.businessName}
                    className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow-sm transition-colors ${blockConfirmText === blockTarget.businessName ? 'bg-rose-600 hover:bg-rose-700' : 'bg-slate-300 cursor-not-allowed'}`}
                  >
                    Confirm Block
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
