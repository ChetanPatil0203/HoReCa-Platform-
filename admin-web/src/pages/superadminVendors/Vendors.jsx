import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Plus, Star, X } from 'lucide-react';

export default function Vendors() {
  const [vendors, setVendors] = useState([
    { id: "VEND-1256", name: "Green Valley Supplies", category: "Raw Material", rating: 4.8, activeStaff: 120, ordersFulfilled: 1248, status: "Active", isTopRated: true },
    { id: "VEND-1257", name: "Royal Orchid Supplies", category: "Raw Material", rating: 4.9, activeStaff: 85, ordersFulfilled: 982, status: "Active", isTopRated: true },
    { id: "VEND-1258", name: "FreshLoop Food Services", category: "Food Supplier", rating: 4.7, activeStaff: 60, ordersFulfilled: 754, status: "Active" },
    { id: "VEND-1259", name: "QuickClean Hygiene Pvt. Ltd.", category: "Cleaning", rating: 4.6, activeStaff: 45, ordersFulfilled: 612, status: "Active" },
    { id: "VEND-1260", name: "TechnoServe Solutions", category: "IT & Support", rating: 4.5, activeStaff: 30, ordersFulfilled: 421, status: "Active" },
    { id: "VEND-1261", name: "SecureGuard Services", category: "Security", rating: 4.4, activeStaff: 25, ordersFulfilled: 398, status: "Inactive" },
    { id: "VEND-1262", name: "PackPro Solutions", category: "Packaging", rating: 4.3, activeStaff: 40, ordersFulfilled: 512, status: "Active" }
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState("All Categories");
  const [vendorStatusFilter, setVendorStatusFilter] = useState("All Status");
  const [sandboxTarget, setSandboxTarget] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const kpis = [
    { label: "Total Vendors Registered", val: "320", trend: "+15.7%", desc: "Fulfilment agencies included" },
    { label: "Active Deployments", val: "287", trend: "+9.2%", desc: "Running client contracts" },
    { label: "Top-Rated Supply Partners", val: "48", trend: "15% ratio", desc: "4.8+ rated stars catalog" }
  ];

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
              className="flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white text-blue-800 border-blue-500/20"
            >
              <div className="flex-1 text-xs font-semibold leading-relaxed mt-0.5">{toast.message}</div>
              <button onClick={() => setToasts((p) => p.filter((t) => t.id !== toast.id))} className="text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/40">
                {kpi.trend}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-800 mt-2 tracking-tight">{kpi.val}</div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">{kpi.desc}</p>
          </div>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Vendor Network</h3>
            <p className="text-xs text-slate-400 mt-0.5">Control agency networks and service catalogs</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => showToast("Exporting vendor catalog logs...", "info")}
              className="px-4 py-2 border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              onClick={() => showToast("Add vendor flow initiated.", "info")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by vendor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select
            value={vendorCategoryFilter}
            onChange={(e) => setVendorCategoryFilter(e.target.value)}
            className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="All Categories">All Categories</option>
            <option value="Raw Material">Raw Material</option>
            <option value="Food Supplier">Food Supplier</option>
            <option value="Cleaning">Cleaning</option>
            <option value="IT & Support">IT & Support</option>
            <option value="Security">Security</option>
            <option value="Packaging">Packaging</option>
          </select>
          <select
            value={vendorStatusFilter}
            onChange={(e) => setVendorStatusFilter(e.target.value)}
            className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-2 focus:outline-none"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                <th className="pb-3 px-4">Vendor Partner Name</th>
                <th className="pb-3 px-4">Category</th>
                <th className="pb-3 px-4">Rating</th>
                <th className="pb-3 px-4">Active Staff</th>
                <th className="pb-3 px-4">Orders Fulfilled</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {vendors
                .filter((v) => {
                  const matchCat = vendorCategoryFilter === "All Categories" || v.category === vendorCategoryFilter;
                  const matchStatus = vendorStatusFilter === "All Status" || v.status === vendorStatusFilter;
                  const matchQuery = v.name.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchCat && matchStatus && matchQuery;
                })
                .map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-800">{v.name}</span>
                          {v.isTopRated && (
                            <span className="text-[8px] font-bold bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.5 rounded-full uppercase">
                              Top Rated
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 font-normal mt-0.5">{v.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-semibold">{v.category}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold font-mono">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{v.rating}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">{v.activeStaff}</td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">{v.ordersFulfilled}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                        v.status === "Active" ? "bg-emerald-50 border-emerald-200/40 text-emerald-700" :
                        "bg-slate-100 border-slate-200 text-slate-400"
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSandboxTarget(v);
                          showToast(`Simulating active sandbox for ${v.name}...`, "info");
                        }}
                        className="px-2.5 py-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 text-[10px] font-bold rounded-lg shadow-sm transition-colors"
                      >
                        Impersonate
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex justify-between items-center border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 mt-2">
          <span>Show 10 per page</span>
          <div className="flex items-center gap-2">
            <button className="p-1 px-2 border border-slate-200 rounded-lg hover:bg-slate-50">&lt;</button>
            <button className="p-1 px-2.5 bg-blue-600 text-white rounded-lg">1</button>
            <button className="p-1 px-2.5 border border-slate-200 rounded-lg hover:bg-slate-50">2</button>
            <button className="p-1 px-2.5 border border-slate-200 rounded-lg hover:bg-slate-50">3</button>
            <span>...</span>
            <button className="p-1 px-2.5 border border-slate-200 rounded-lg hover:bg-slate-50">45</button>
            <button className="p-1 px-2 border border-slate-200 rounded-lg hover:bg-slate-50">&gt;</button>
          </div>
        </div>
      </div>

      {/* Sandbox Simulated Mirroring Modal */}
      <AnimatePresence>
        {sandboxTarget && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-xs font-extrabold uppercase tracking-wider font-mono text-rose-400">Simulating Vendor Session</span>
                </div>
                <button
                  onClick={() => { setSandboxTarget(null); showToast("Exited sandbox simulation.", "info"); }}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 flex flex-col gap-4 text-left">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-700 text-lg">
                    {sandboxTarget.name.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-base">{sandboxTarget.name}</h4>
                    <p className="text-xs text-slate-400 font-semibold font-mono">ID: {sandboxTarget.id} · Scope: Vendor Dashboard</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2 font-mono text-[11px] text-slate-600">
                  <div className="flex justify-between"><span>Session Origin:</span><span className="font-bold text-slate-800">HRCHUB Proxy Audit</span></div>
                  <div className="flex justify-between"><span>Simulation Host:</span><span className="font-bold text-slate-800">localhost:3000</span></div>
                  <div className="flex justify-between"><span>Target Engine:</span><span className="font-bold text-emerald-600">React Runtime Mirror</span></div>
                </div>

                <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-[11px] font-semibold text-blue-800 leading-relaxed">
                  ⚠️ Any mutations or transactional actions carried out in this session will mirror straight into production replication logs.
                </div>

                <div className="flex justify-end gap-3 mt-2">
                  <button
                    onClick={() => { setSandboxTarget(null); showToast("Exited sandbox simulation.", "info"); }}
                    className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
                  >
                    Expose Sandbox Session
                  </button>
                  <button
                    onClick={() => showToast("Launching browser console viewport...", "success")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-900/10 transition-colors"
                  >
                    Launch Proxy Mirror
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
