import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, X, AlertCircle } from 'lucide-react';

export default function Limits() {
  const [statusAccounts, setStatusAccounts] = useState([
    { id: "ACC-8901", businessName: "Royal Orchid Hotel", type: "Hotel", owner: "Ramesh Kumar", phone: "+91 98765 43210", status: "Active", lastUpdated: "24 May 2026, 10:30 AM" },
    { id: "ACC-8902", businessName: "The Grand Palace", type: "Hotel", owner: "Suresh Das", phone: "+91 98765 43211", status: "Active", lastUpdated: "24 May 2026, 11:30 AM" },
    { id: "ACC-8903", businessName: "Green Leaf Restaurant", type: "Restaurant", owner: "Vikram Singh", phone: "+91 98765 43212", status: "Active", lastUpdated: "24 May 2026, 09:30 AM" },
    { id: "ACC-8904", businessName: "Café Coffee Day", type: "Cafe", owner: "Neha Mathews", phone: "+91 98765 43213", status: "Active", lastUpdated: "24 May 2026, 11:15 AM" },
    { id: "ACC-8905", businessName: "Spice Route Kitchen", type: "Restaurant", owner: "Ajay Verma", phone: "+91 98765 43214", status: "Active", lastUpdated: "24 May 2026, 09:20 AM" },
    { id: "ACC-8906", businessName: "Green Valley Suppliers", type: "Vendor", owner: "Rahul Sharma", phone: "+91 98765 43215", status: "Active", lastUpdated: "24 May 2026, 09:25 AM" }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState("Policy Violation");
  const [toasts, setToasts] = useState([]);

  // Read current suspension states from localStorage if set in other views
  useEffect(() => {
    const localAccounts = localStorage.getItem('hrchub_status_accounts');
    if (localAccounts) {
      setStatusAccounts(JSON.parse(localAccounts));
    }
  }, []);

  const saveAccounts = (updated) => {
    setStatusAccounts(updated);
    localStorage.setItem('hrchub_status_accounts', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleToggleStatus = (account) => {
    if (account.status === "Active") {
      setSuspendTarget(account);
    } else {
      const updated = statusAccounts.map((a) => (a.id === account.id ? { ...a, status: "Active", lastUpdated: new Date().toLocaleString() } : a));
      saveAccounts(updated);
      showToast(`${account.businessName} has been activated.`, "success");
    }
  };

  const confirmSuspension = () => {
    if (!suspendTarget) return;
    const updated = statusAccounts.map((a) => (a.id === suspendTarget.id ? { ...a, status: "Inactive", lastUpdated: new Date().toLocaleString() } : a));
    saveAccounts(updated);
    showToast(`${suspendTarget.businessName} suspended due to ${suspensionReason}.`, "error");
    setSuspendTarget(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white backdrop-blur-md ${
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

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        {[
          { label: "Active Merchants", count: "892", color: "bg-emerald-500" },
          { label: "Suspended Businesses", count: statusAccounts.filter(a => a.status === 'Inactive' && a.type !== 'Vendor').length + 78, color: "bg-rose-500 animate-pulse" },
          { label: "Active Supply Partners", count: "287", color: "bg-emerald-500" },
          { label: "Suspended Vendors", count: statusAccounts.filter(a => a.status === 'Inactive' && a.type === 'Vendor').length + 33, color: "bg-rose-500" }
        ].map((ind, i) => (
          <div key={i} className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{ind.label}</span>
              <div className="text-2xl font-black text-slate-800 mt-2 tracking-tight">{ind.count}</div>
            </div>
            <span className={`w-3 h-3 rounded-full ${ind.color}`} />
          </div>
        ))}
      </div>

      {/* Merchant status table panel */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 flex flex-col gap-6">
        <div className="pb-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Status & Active/Inactive Limits</h3>
            <p className="text-xs text-slate-400 mt-0.5">Control merchant and vendor status</p>
          </div>
          <button className="px-4 py-2 border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5">
            <span>Bulk Actions</span>
            <ChevronRight className="w-3.5 h-3.5 rotate-90" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="relative w-full max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by entity name, owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Status Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="pb-3 px-4">Business / Vendor Name</th>
                <th className="pb-3 px-4">Type</th>
                <th className="pb-3 px-4">Owner / Contact</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Toggle</th>
                <th className="pb-3 px-4 text-right">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {statusAccounts
                .filter(a => a.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || a.owner.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-800">{acc.businessName}</span>
                        <span className="text-[9px] font-mono text-slate-400 font-normal mt-0.5">{acc.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        acc.type === "Vendor" ? "bg-amber-50 border-amber-100 text-amber-700" : "bg-blue-50 border-blue-100 text-blue-700"
                      }`}>
                        {acc.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      <div className="flex flex-col">
                        <span>{acc.owner}</span>
                        <span className="text-[9px] font-mono text-slate-400 font-normal mt-0.5">{acc.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        acc.status === "Active" ? "bg-emerald-50 border-emerald-200/40 text-emerald-700" : "bg-rose-50 border-rose-200/40 text-rose-700"
                      }`}>
                        {acc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {/* Switch toggle */}
                      <button
                        onClick={() => handleToggleStatus(acc)}
                        className={`w-9 h-5 rounded-full transition-colors relative p-0.5 focus:outline-none ${
                          acc.status === "Active" ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform ${
                          acc.status === "Active" ? "translate-x-4" : "translate-x-0"
                        }`} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-normal font-mono text-right">{acc.lastUpdated}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suspension Confirmation Modal */}
      <AnimatePresence>
        {suspendTarget && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 text-left"
            >
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                <AlertCircle className="w-6 h-6 text-rose-600" />
                <h3 className="text-lg font-black text-slate-800">Confirm Suspension</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Are you sure you want to suspend <span className="font-extrabold text-slate-800">{suspendTarget.businessName}</span>? This will temporarily revoke access to the HRC HUB trading portals.
              </p>

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reason for Suspension</label>
                <select
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 font-semibold"
                >
                  <option value="Policy Violation">Policy Violation</option>
                  <option value="Unresolved SLA Breach">Unresolved SLA Breach</option>
                  <option value="Fraudulent Document Submissions">Fraudulent Document Submissions</option>
                  <option value="Client Payment Mismatch Escrow Dispute">Client Payment Escrow Dispute</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setSuspendTarget(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSuspension}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  Suspend Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
