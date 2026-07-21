import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X, FileText, AlertCircle, Check, Terminal, Eye, UserPlus, Clock, MessageSquare, AlertTriangle, FileBadge, CheckCircle, Navigation, MapPin, Building, Info, FileImage } from 'lucide-react';
import { mockDb } from '../../utils/mockDb';

export default function Verification() {
  const [kycSubmissions, setKycSubmissions] = useState([]);
  const [selectedKycId, setSelectedKycId] = useState('');

  const MAIN_TABS = ['HoReCa Owners', 'Vendors'];
  const OWNER_SUB_TABS = ['Hotels', 'Restaurants', 'Cafés'];
  const VENDOR_SUB_TABS = ['Raw Material', 'Man Power', 'Service Provider', 'Marketing'];
  const STATUSES = ['All', 'Pending', 'Under Review', 'Approved', 'Rejected'];

  const [mainTab, setMainTab] = useState(MAIN_TABS[0]);
  const [ownerSubTab, setOwnerSubTab] = useState(OWNER_SUB_TABS[0]);
  const [vendorSubTab, setVendorSubTab] = useState(VENDOR_SUB_TABS[0]);
  const [activeStatus, setActiveStatus] = useState(STATUSES[0]);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Confirmation Modal State
  const [confirmAction, setConfirmAction] = useState(null); // { action: 'Approve' | 'Reject' | 'Request Changes', kycId }
  const [actionReason, setActionReason] = useState('');

  // Load submissions from mockDb
  useEffect(() => {
    const list = mockDb.getKYC();
    setKycSubmissions(list);
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const activeKyc = useMemo(() => {
    return kycSubmissions.find((k) => k.id === selectedKycId);
  }, [kycSubmissions, selectedKycId]);

  const filteredSubmissions = useMemo(() => {
    return kycSubmissions.filter(k => {
      let matchTab = false;
      if (mainTab === 'HoReCa Owners') {
        if (k.entityType === 'HoReCa Owners') {
          const typeLower = k.type?.toLowerCase();
          if (ownerSubTab === 'Hotels') {
            matchTab = typeLower === 'hotel';
          } else if (ownerSubTab === 'Restaurants') {
            matchTab = typeLower === 'restaurant' || typeLower === 'restro';
          } else if (ownerSubTab === 'Cafés') {
            matchTab = typeLower === 'cafe' || typeLower === 'café';
          }
        }
      } else {
        // Vendors
        if (vendorSubTab === 'Raw Material') {
          matchTab = k.entityType === 'Raw Material Vendors';
        } else if (vendorSubTab === 'Man Power') {
          matchTab = k.entityType === 'Manpower Agencies';
        } else if (vendorSubTab === 'Service Provider') {
          matchTab = k.entityType === 'Service Providers';
        } else if (vendorSubTab === 'Marketing') {
          matchTab = k.entityType === 'Marketing Agencies';
        }
      }

      const matchStatus = activeStatus === 'All' || k.status === activeStatus;
      return matchTab && matchStatus;
    });
  }, [kycSubmissions, mainTab, ownerSubTab, vendorSubTab, activeStatus]);

  const executeAction = () => {
    if (!confirmAction) return;
    if (!actionReason.trim()) {
      showToast("Reason is required to perform this action.", "error");
      return;
    }

    const updated = kycSubmissions.map((k) => {
      if (k.id === confirmAction.kycId) {
        const newHistory = [...(k.history || []), { status: confirmAction.action, date: new Date().toLocaleDateString(), reason: actionReason }];
        return { ...k, status: confirmAction.action, notes: actionReason, history: newHistory };
      }
      return k;
    });

    setKycSubmissions(updated);
    mockDb.saveKYC(updated);
    showToast(`Profile ${confirmAction.action} successfully!`, "success");
    setConfirmAction(null);
    setActionReason('');

    window.dispatchEvent(new Event('storage'));
  };

  const handleQuickAction = (id, action) => {
    if (action === 'Assign Reviewer') {
      const updated = kycSubmissions.map(k => k.id === id ? { ...k, adminAssigned: 'Current Admin' } : k);
      setKycSubmissions(updated);
      mockDb.saveKYC(updated);
      showToast("Reviewer assigned.", "success");
    } else if (action === 'Put Under Review') {
      const updated = kycSubmissions.map(k => k.id === id ? { ...k, status: 'Under Review' } : k);
      setKycSubmissions(updated);
      mockDb.saveKYC(updated);
      showToast("Application moved to Under Review.", "info");
    }
  };

  const renderRoleSpecificDocs = (kyc) => {
    if (!kyc) return null;
    const docs = [];
    if (kyc.entityType === 'HoReCa Owners') {
      docs.push({ title: 'FSSAI License', val: kyc.fssaiNumber || 'Verified' });
      docs.push({ title: 'Business Licence', val: kyc.businessLicense || 'Verified' });
    } else if (kyc.entityType === 'Raw Material Vendors') {
      docs.push({ title: 'FSSAI License', val: kyc.fssaiNumber || 'Verified' });
      docs.push({ title: 'Warehouse Details', val: kyc.warehouseDetails || 'Uploaded' });
      docs.push({ title: 'Product Categories', val: kyc.productCategories || 'Listed' });
    } else if (kyc.entityType === 'Manpower Agencies') {
      docs.push({ title: 'Labour Licence', val: kyc.labourLicence || 'Verified' });
      docs.push({ title: 'Agency Registration', val: kyc.agencyRegistration || 'Verified' });
      docs.push({ title: 'Replacement Policy', val: kyc.replacementPolicy || 'Uploaded' });
    } else if (kyc.entityType === 'Service Providers') {
      docs.push({ title: 'Service Certifications', val: kyc.serviceCertifications || 'Verified' });
      docs.push({ title: 'Team Details', val: kyc.teamDetails || 'Verified' });
      docs.push({ title: 'Coverage Areas', val: kyc.coverageAreas || 'Verified' });
    } else if (kyc.entityType === 'Marketing Agencies') {
      docs.push({ title: 'Agency Registration', val: kyc.agencyRegistration || 'Verified' });
      docs.push({ title: 'Portfolio', val: kyc.portfolio || 'Uploaded' });
      docs.push({ title: 'Services', val: kyc.services || 'Listed' });
    }
    return docs;
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-8">
      {/* Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white backdrop-blur-md ${toast.type === "success" ? "border-emerald-500/20 text-emerald-800" :
                toast.type === "error" ? "border-rose-500/20 text-rose-800" : "border-blue-500/20 text-blue-800"
                }`}
            >
              <div className="flex-1 text-xs font-semibold leading-relaxed mt-0.5">{toast.message}</div>
              <button onClick={() => setToasts((p) => p.filter((t) => t.id !== toast.id))} className="text-slate-400 hover:text-slate-600">
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
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Verification Center</h1>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">Manage KYC, onboarding and credential validation across platform entities.</p>
          </div>
        </div>


      </div>

      {/* Tabs & Filters Control Panel */}
      <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl p-4 flex flex-col gap-4">
        {/* Top Row: Main Tabs & Sub Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">

          {/* Main Entity Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 w-fit">
            {MAIN_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setMainTab(tab);
                  if (tab === 'HoReCa Owners') {
                    setOwnerSubTab(OWNER_SUB_TABS[0]);
                  } else {
                    setVendorSubTab(VENDOR_SUB_TABS[0]);
                  }
                }}
                className={`px-4 py-2 text-xs font-black rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${mainTab === tab
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-500 hover:text-slate-800 bg-transparent"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Sub Tabs based on Main Tab */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200/60 overflow-x-auto">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 select-none">Category:</span>
            {mainTab === 'HoReCa Owners'
              ? OWNER_SUB_TABS.map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setOwnerSubTab(subTab)}
                  className={`px-3.5 py-1.5 text-[11px] font-bold rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${ownerSubTab === subTab
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                    }`}
                >
                  {subTab}
                </button>
              ))
              : VENDOR_SUB_TABS.map((subTab) => (
                <button
                  key={subTab}
                  onClick={() => setVendorSubTab(subTab)}
                  className={`px-3.5 py-1.5 text-[11px] font-bold rounded-xl transition-all duration-200 active:scale-95 cursor-pointer ${vendorSubTab === subTab
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200/60"
                    }`}
                >
                  {subTab}
                </button>
              ))}
          </div>
        </div>

        {/* Bottom Row: Status Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pr-1 select-none">Filter Status:</span>
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-3.5 py-1.5 text-[11px] font-extrabold rounded-xl transition-all duration-200 cursor-pointer border ${activeStatus === status
                ? status === 'Approved' ? "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-500/20" :
                  status === 'Pending' ? "bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/20" :
                    status === 'Under Review' ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20" :
                      status === 'Rejected' ? "bg-rose-600 border-rose-600 text-white shadow-sm shadow-rose-500/20" :
                        "bg-slate-900 border-slate-900 text-white shadow-sm"
                : "bg-slate-50 border-slate-200/80 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Verification List (Desktop List View) */}
      <div className="bg-white border border-slate-200/70 shadow-sm rounded-2xl overflow-hidden w-full overflow-x-auto min-h-[380px]">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500">
              <th className="p-4 font-extrabold">App ID</th>
              <th className="p-4 font-extrabold">Business Name</th>
              <th className="p-4 font-extrabold">Owner / City</th>
              <th className="p-4 font-extrabold">Status</th>
              <th className="p-4 font-extrabold">Assigned Reviewer</th>
              <th className="p-4 font-extrabold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4">
                    <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg inline-block shadow-2xs">
                      {sub.id}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-black text-xs shrink-0">
                        {sub.businessName.substring(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-800 group-hover:text-blue-600 transition-colors">{sub.businessName}</div>
                        <div className="text-[10px] text-slate-400 font-bold mt-0.5">{sub.entityType}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xs font-bold text-slate-700">{sub.proprietor}</div>
                    <div className="text-[10px] text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                      <MapPin size={10} className="text-slate-400" /> {sub.location}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1 rounded-full border shadow-2xs ${sub.status === "Approved" ? "bg-emerald-50 border-emerald-200/60 text-emerald-700" :
                      sub.status === "Rejected" ? "bg-rose-50 border-rose-200/60 text-rose-700" :
                        sub.status === "Under Review" ? "bg-blue-50 border-blue-200/60 text-blue-700" :
                          sub.status === "Changes Requested" ? "bg-amber-50 border-amber-200/60 text-amber-700" :
                            "bg-amber-50 border-amber-200/60 text-amber-800"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${sub.status === "Approved" ? "bg-emerald-500" :
                        sub.status === "Rejected" ? "bg-rose-500" :
                          sub.status === "Under Review" ? "bg-blue-500" : "bg-amber-500"
                        }`} />
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {sub.adminAssigned ? (
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-md border border-slate-200/60 inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {sub.adminAssigned}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedKycId(sub.id);
                          setIsViewModalOpen(true);
                        }}
                        className="px-3 py-1.5 text-xs font-extrabold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
                        title="View Application"
                      >
                        <Eye size={14} /> View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-12 text-center text-slate-400 text-xs font-medium">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldCheck size={40} className="text-slate-300 stroke-[1.5]" />
                    <span className="font-bold text-slate-600">No applications found</span>
                    <span className="text-[10px]">Try switching tabs or adjusting the status filter.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {isViewModalOpen && activeKyc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsViewModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#F8FAFC] shadow-2xl rounded-2xl w-full max-w-5xl flex flex-col relative z-10 max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                    {activeKyc.id}
                  </span>
                  <div>
                    <h2 className="font-black text-slate-800 text-lg">{activeKyc.businessName}</h2>
                    <span className="text-[10px] text-slate-500 font-semibold">{activeKyc.entityType}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${activeKyc.status === "Approved" ? "bg-emerald-50 border-emerald-200/40 text-emerald-700" :
                    activeKyc.status === "Rejected" ? "bg-rose-50 border-rose-200/40 text-rose-700" :
                      "bg-amber-50 border-amber-200/40 text-amber-700"
                    }`}>
                    {activeKyc.status}
                  </span>
                  <button onClick={() => setIsViewModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "thin" }}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Left Column: Info & Details */}
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Basic Info */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Info size={14} /> Business & Owner Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Proprietor / Contact</span>
                          <span className="text-xs font-bold text-slate-700 mt-1 block">{activeKyc.proprietor}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Submitted Date</span>
                          <span className="text-xs font-bold text-slate-700 mt-1 block">{activeKyc.dateSubmitted}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Address & City</span>
                          <span className="text-xs font-bold text-slate-700 mt-1 block flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400" /> {activeKyc.location}, India
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Common & Role Specific Documents */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FileBadge size={14} /> Documentation
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {/* Common */}
                        {[
                          { title: "PAN Card", val: activeKyc.panNumber || 'Verified' },
                          { title: "GST Certificate", val: activeKyc.gstinNumber || 'Verified' },
                          { title: "Business Reg.", val: 'Verified' }
                        ].map((doc, idx) => (
                          <div key={`c-${idx}`} className="border border-slate-100 rounded-lg p-3 bg-slate-50 flex flex-col">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">{doc.title}</span>
                            <span className="text-[11px] font-bold text-slate-700 mt-1 block truncate">{doc.val}</span>
                          </div>
                        ))}
                        {/* Role Specific */}
                        {renderRoleSpecificDocs(activeKyc).map((doc, idx) => (
                          <div key={`rs-${idx}`} className="border border-blue-100 rounded-lg p-3 bg-blue-50/30 flex flex-col">
                            <span className="text-[9px] text-blue-500 font-bold uppercase tracking-wider block">{doc.title}</span>
                            <span className="text-[11px] font-bold text-slate-700 mt-1 block truncate">{doc.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Uploaded Images */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FileImage size={14} /> Uploaded Media
                      </h4>
                      <div className="flex gap-3 overflow-x-auto">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="w-24 h-24 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-400">
                            <FileImage size={24} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Status, Notes, Checklist */}
                  <div className="flex flex-col gap-6">
                    {/* Checklist */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Verification Checklist</h4>
                      <div className="flex flex-col gap-2">
                        {['Identity Proof Verified', 'Business Address Matched', 'Tax Details Validated', 'Risk Assessment Clear'].map((item, idx) => (
                          <label key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                            <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 bg-slate-100 border-slate-300 w-3.5 h-3.5" defaultChecked={idx < 2} />
                            {item}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="bg-amber-50 p-5 rounded-xl border border-amber-200/60 shadow-sm">
                      <h4 className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <MessageSquare size={14} /> Internal Notes
                      </h4>
                      <p className="text-xs text-amber-900 font-medium whitespace-pre-wrap">
                        {activeKyc.notes || 'No internal notes added yet.'}
                      </p>
                      <button className="mt-3 text-[10px] font-bold text-amber-700 hover:text-amber-800 underline">
                        + Add / Edit Note
                      </button>
                    </div>

                    {/* Status History */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/60 shadow-sm flex-1">
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Status History</h4>
                      <div className="flex flex-col gap-4 relative">
                        <div className="absolute left-1.5 top-2 bottom-2 w-px bg-slate-200 z-0"></div>
                        {activeKyc.history && activeKyc.history.length > 0 ? (
                          activeKyc.history.map((hist, idx) => (
                            <div key={idx} className="flex items-start gap-3 relative z-10">
                              <div className="w-3 h-3 rounded-full bg-slate-200 border-2 border-white mt-1"></div>
                              <div>
                                <div className="text-[11px] font-bold text-slate-700">{hist.status}</div>
                                <div className="text-[9px] text-slate-400">{hist.date}</div>
                                {hist.reason && <div className="text-[10px] text-slate-500 mt-0.5 italic">"{hist.reason}"</div>}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-[10px] text-slate-400 italic pl-6">No history available.</div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="bg-white border-t border-slate-200 p-4 flex items-center justify-between flex-shrink-0">
                <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1.5">
                  <UserPlus size={14} /> Assigned to: <span className="text-slate-700">{activeKyc.adminAssigned || 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setConfirmAction({ action: 'Rejected', kycId: activeKyc.id })}
                    className="px-4 py-2 border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 text-xs font-bold rounded-xl transition-colors"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setConfirmAction({ action: 'Approved', kycId: activeKyc.id })}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Action Confirmation Dialog */}
      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setConfirmAction(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10"
            >
              <h3 className="text-lg font-black text-slate-800 mb-2">Confirm {confirmAction.action}</h3>
              <p className="text-xs text-slate-500 mb-4">Please provide a reason or note for this final action. This will be recorded in the history.</p>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Enter reason or internal note here..."
                className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] resize-none mb-4"
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setConfirmAction(null); setActionReason(''); }}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeAction}
                  className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-colors ${confirmAction.action === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-700' :
                    confirmAction.action === 'Rejected' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'
                    }`}
                >
                  Confirm {confirmAction.action}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
