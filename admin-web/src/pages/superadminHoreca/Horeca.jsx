import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Plus, Star, X } from 'lucide-react';

export default function Horeca() {
  const [horecaListings, setHorecaListings] = useState([
    { id: "HR-9901", businessName: "Royal Orchid Hotel", type: "Hotel", owner: "Ramesh Kumar", city: "Mumbai", rating: 4.8, status: "Active" },
    { id: "HR-9902", businessName: "The Grand Palace", type: "Hotel", owner: "Suresh Das", city: "Delhi", rating: 4.7, status: "Active" },
    { id: "HR-9903", businessName: "Green Valley Resort", type: "Hotel", owner: "Vikram Singh", city: "Bangalore", rating: 4.6, status: "Active" },
    { id: "HR-9904", businessName: "Spice Route Kitchen", type: "Restaurant", owner: "Ajay Verma", city: "Jaipur", rating: 4.5, status: "Active" },
    { id: "HR-9905", businessName: "Ocean View Restaurant", type: "Restaurant", owner: "Rahul Sharma", city: "Goa", rating: 4.4, status: "Active" },
    { id: "HR-9906", businessName: "Café Coffee Day", type: "Cafe", owner: "Neha Mathews", city: "Pune", rating: 4.3, status: "Active" },
    { id: "HR-9907", businessName: "Brew & Bites Cafe", type: "Cafe", owner: "Arjun Patel", city: "Ahmedabad", rating: 4.6, status: "Active" },
    { id: "HR-9908", businessName: "The Food Junction", type: "Restaurant", owner: "Karan Mehra", city: "Chandigarh", rating: 4.2, status: "Inactive" }
  ]);
  const [horecaTab, setHorecaTab] = useState("All");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [sandboxTarget, setSandboxTarget] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return (
    <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 flex flex-col gap-6 animate-fadeIn">
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

      {/* Top segment control */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">HoReCa Directory</h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage and monitor all HoReCa listings</p>
        </div>

        <div className="flex items-center gap-1 bg-[#F3F4F6] border border-slate-200/60 p-1 rounded-xl">
          {["All Listings", "Hotels", "Restaurants", "Cafes"].map((filter) => {
            const val = filter === "All Listings" ? "All" : filter.slice(0, -1);
            const isSelected = horecaTab === val;
            return (
              <button
                key={filter}
                onClick={() => setHorecaTab(val)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all active:scale-[0.97] ${
                  isSelected
                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/30"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => showToast("Exporting ledger data...", "info")}
            className="px-4 py-2 border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => showToast("Add merchant flow initiated.", "info")}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Search and filter bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, manager..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-2 focus:outline-none"
        >
          <option value="All Cities">All Cities</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Jaipur">Jaipur</option>
          <option value="Pune">Pune</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-2 focus:outline-none"
        >
          <option value="All Status">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Directory Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <th className="pb-3 px-4">Business Name</th>
              <th className="pb-3 px-4">Type</th>
              <th className="pb-3 px-4">Owner / Manager</th>
              <th className="pb-3 px-4">City</th>
              <th className="pb-3 px-4">Rating</th>
              <th className="pb-3 px-4">Status</th>
              <th className="pb-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
            {horecaListings
              .filter((b) => {
                const matchTab = horecaTab === "All" || b.type === horecaTab;
                const matchCity = cityFilter === "All Cities" || b.city === cityFilter;
                const matchStatus = statusFilter === "All Status" || b.status === statusFilter;
                const matchQuery =
                  b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  b.owner.toLowerCase().includes(searchQuery.toLowerCase());
                return matchTab && matchCity && matchStatus && matchQuery;
              })
              .map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-extrabold text-slate-800">{b.businessName}</span>
                      <span className="text-[9px] font-mono text-slate-400 font-normal mt-0.5">{b.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      b.type === "Hotel" ? "bg-blue-50 border-blue-100 text-blue-700" :
                      b.type === "Restaurant" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
                      "bg-indigo-50 border-indigo-100 text-indigo-700"
                    }`}>
                      {b.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-bold text-[9px] flex items-center justify-center">
                        {b.owner.split(" ")[0][0]}{b.owner.split(" ")[1]?.[0] || ""}
                      </div>
                      <span>{b.owner}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-semibold">{b.city}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 text-amber-500 font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{b.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      b.status === "Active" ? "bg-emerald-50 border-emerald-200/40 text-emerald-700" :
                      "bg-slate-100 border-slate-200 text-slate-400"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => {
                          setSandboxTarget(b);
                          showToast(`Simulating active sandbox for ${b.businessName}...`, "info");
                        }}
                        className="px-2.5 py-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 text-[10px] font-bold rounded-lg shadow-sm transition-colors"
                      >
                        Impersonate
                      </button>
                    </div>
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
          <button className="p-1 px-2.5 border border-slate-200 rounded-lg hover:bg-slate-50">125</button>
          <button className="p-1 px-2 border border-slate-200 rounded-lg hover:bg-slate-50">&gt;</button>
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
                  <span className="text-xs font-extrabold uppercase tracking-wider font-mono text-rose-400">Simulating Owner Session</span>
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
                    {sandboxTarget.businessName.slice(0, 1)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-base">{sandboxTarget.businessName}</h4>
                    <p className="text-xs text-slate-400 font-semibold font-mono">ID: {sandboxTarget.id} · Scope: Owner Dashboard</p>
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
