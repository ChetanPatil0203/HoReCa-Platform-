import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, FileText, AlertCircle, Check, Terminal } from 'lucide-react';
import { mockDb } from '../../utils/mockDb';

export default function Verification() {
  const [kycSubmissions, setKycSubmissions] = useState([]);
  const [selectedKycId, setSelectedKycId] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [verificationMainTab, setVerificationMainTab] = useState('HoReCa');
  const [verificationCategoryFilter, setVerificationCategoryFilter] = useState('All');
  const [showRejectDropdown, setShowRejectDropdown] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Load submissions from mockDb
  useEffect(() => {
    const list = mockDb.getKYC();
    setKycSubmissions(list);
    if (list.length > 0) {
      setSelectedKycId(list[0].id);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const activeKyc = useMemo(() => {
    return kycSubmissions.find((k) => k.id === selectedKycId) || kycSubmissions[0];
  }, [kycSubmissions, selectedKycId]);

  const handleApproveKYC = (id) => {
    const updated = kycSubmissions.map((k) => (k.id === id ? { ...k, status: "Approved" } : k));
    setKycSubmissions(updated);
    mockDb.saveKYC(updated);
    showToast(`Profile approved and deployed successfully for ${kycSubmissions.find((k) => k.id === id)?.businessName}`, "success");
    
    // dispatch storage event for layout updates
    window.dispatchEvent(new Event('storage'));
  };

  const handleRejectKYC = (id, reason) => {
    const updated = kycSubmissions.map((k) => (k.id === id ? { ...k, status: "Rejected", rejectionReason: reason } : k));
    setKycSubmissions(updated);
    mockDb.saveKYC(updated);
    setShowRejectDropdown(false);
    showToast(`Rejected Profile: ${kycSubmissions.find((k) => k.id === id)?.businessName} (${reason})`, "error");
    
    // dispatch storage event
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Toast Overlay inside verification page */}
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

      {/* Tabs Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-1 bg-[#F3F4F6] border border-slate-200/60 p-1 rounded-xl">
            {["HoReCa", "Vendor"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setVerificationMainTab(tab);
                  setVerificationCategoryFilter("All");
                }}
                className={`text-[11px] font-bold px-4 py-1.5 rounded-lg transition-all active:scale-[0.97] ${
                  verificationMainTab === tab
                    ? "bg-white text-blue-700 shadow-sm border border-slate-200/30"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab} Profile Verifications
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" />
              <span>History Logs</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Sub-Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {(verificationMainTab === "HoReCa"
              ? ["All", "Hotel", "Restaurant", "Cafe"]
              : ["All", "Raw Material", "Manpower", "Marketing", "Service Provider"]
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => setVerificationCategoryFilter(cat)}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all ${
                  verificationCategoryFilter === cat
                    ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {["All", "Pending", "Approved", "Rejected"].map((tab) => (
              <button
                key={tab}
                onClick={() => setVerificationFilter(tab)}
                className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all ${
                  verificationFilter === tab
                    ? "bg-slate-800 text-white shadow-sm"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panel Grid Split */}
      <div className="flex flex-col gap-6 items-start w-full">
        {/* Full Width Pane: Requests Queue */}
        <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-4 flex flex-col gap-3 min-h-[500px] w-full">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Verification Queue</h4>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[460px]" style={{ scrollbarWidth: "none" }}>
            {kycSubmissions
              .filter(k => {
                const isVendor = k.type === "Vendor";
                if (verificationMainTab === "HoReCa" && isVendor) return false;
                if (verificationMainTab === "Vendor" && !isVendor) return false;

                const matchCategory = verificationCategoryFilter === "All" ||
                  (verificationMainTab === "HoReCa" ? k.type === verificationCategoryFilter : k.vendorCategory === verificationCategoryFilter);
                
                const matchStatus = verificationFilter === "All" || k.status === verificationFilter;

                return matchCategory && matchStatus;
              })
              .map((sub) => {
                const isSelected = selectedKycId === sub.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => { setSelectedKycId(sub.id); setShowRejectDropdown(false); }}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all hover:border-blue-400 flex items-center gap-3 ${
                      isSelected ? "bg-blue-50/40 border-blue-400 shadow-sm" : "bg-white border-slate-100 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-extrabold text-slate-800 truncate">{sub.businessName}</h4>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                          sub.status === "Approved" ? "bg-emerald-50 border-emerald-200/40 text-emerald-700" :
                          sub.status === "Rejected" ? "bg-rose-50 border-rose-200/40 text-rose-700" :
                          "bg-amber-50 border-amber-200/40 text-amber-700"
                        }`}>
                          {sub.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-3">
                        <span>{sub.type} · {sub.location}</span>
                        <span className="font-normal font-mono">{sub.dateSubmitted.split(",")[0]}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedKycId(sub.id);
                          setShowRejectDropdown(false);
                          setIsViewModalOpen(true);
                        }}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors ${
                          isSelected ? "bg-blue-600 text-white shadow-sm" : "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100"
                        }`}
                      >
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Right Pane Details Modal */}
        <AnimatePresence>
          {isViewModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsViewModalOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white border border-slate-200/60 shadow-2xl rounded-2xl p-6 w-full max-w-4xl flex flex-col justify-between relative z-10 max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>

                {activeKyc ? (
                  <>
                    <div className="flex flex-col gap-6 mt-2">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-4 pr-8">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full self-start">
                            {activeKyc.id}
                          </span>
                          <h3 className="font-black text-slate-800 text-lg mt-1.5">{activeKyc.businessName}</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Submitted: {activeKyc.dateSubmitted}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Vetting status</span>
                          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border inline-block mt-1.5 ${
                            activeKyc.status === "Approved" ? "bg-emerald-50 border-emerald-200/40 text-emerald-700" :
                            activeKyc.status === "Rejected" ? "bg-rose-50 border-rose-200/40 text-rose-700" :
                            "bg-amber-50 border-amber-200/40 text-amber-700"
                          }`}>
                            {activeKyc.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50/50 border border-slate-200/50 rounded-xl p-3.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Proprietor Name</span>
                          <span className="text-xs font-bold text-slate-700 mt-1 block">{activeKyc.proprietor}</span>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{activeKyc.location}, India</span>
                        </div>
                        <div className="bg-slate-50/50 border border-slate-200/50 rounded-xl p-3.5">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Merchant Category</span>
                          <span className="text-xs font-bold text-slate-700 mt-1 block">{activeKyc.type} Portal</span>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5">Standard Trading License</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Verification Documents</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { title: "FSSAI License", num: activeKyc.fssaiNumber },
                            { title: "PAN Card", num: activeKyc.panNumber },
                            { title: "GST Certificate", num: activeKyc.gstinNumber }
                          ].map((doc, idx) => (
                            <div key={idx} className="border border-slate-200/60 rounded-xl p-3.5 bg-[#F3F4F6] flex flex-col justify-between items-start relative hover:border-blue-400 transition-colors">
                              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm mb-3">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <span className="text-[10px] font-extrabold text-slate-700 block">{doc.title}</span>
                                <span className="text-[8px] font-mono text-slate-400 block mt-1 break-all">{doc.num}</span>
                              </div>
                              <span className="absolute top-3.5 right-3.5 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {activeKyc.status === "Rejected" && activeKyc.rejectionReason && (
                        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-800 font-semibold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                          <span>Rejection Reason: {activeKyc.rejectionReason}</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-5 mt-6 flex items-center justify-end gap-3 relative z-30">
                      <button
                        onClick={() => showToast("Request details sent to merchant.", "info")}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl shadow-sm transition-colors"
                      >
                        Request Info
                      </button>

                      <div className="relative">
                        <button
                          onClick={() => {
                            if (activeKyc.status === "Pending") setShowRejectDropdown(!showRejectDropdown);
                          }}
                          disabled={activeKyc.status !== "Pending"}
                          className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-40"
                        >
                          Reject Profile
                        </button>
                        <AnimatePresence>
                          {showRejectDropdown && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setShowRejectDropdown(false)} />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                className="absolute right-0 bottom-full mb-2 w-60 bg-white border border-slate-200/60 rounded-xl shadow-xl z-50 p-2 text-left"
                              >
                                <span className="block px-3 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 mb-1">
                                  Select Rejection Reason
                                </span>
                                {[
                                  "Invalid FSSAI License Format",
                                  "GSTIN Verification Mismatch",
                                  "Blurry License Documentation",
                                  "Owner Verification Mismatch"
                                ].map((reason) => (
                                  <button
                                    key={reason}
                                    onClick={() => handleRejectKYC(activeKyc.id, reason)}
                                    className="w-full text-left px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-lg transition-colors"
                                  >
                                    {reason}
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>

                      <button
                        onClick={() => handleApproveKYC(activeKyc.id)}
                        disabled={activeKyc.status !== "Pending"}
                        className="px-4 py-2 bg-[#1E40AF] hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors disabled:opacity-40"
                      >
                        Approve & Deploy
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-xs py-20">
                    Select a request to inspect credentials
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
