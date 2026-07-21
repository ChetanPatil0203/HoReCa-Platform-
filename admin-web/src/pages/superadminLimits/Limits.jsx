import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ChevronRight, X, AlertCircle, ShieldAlert, Shield, MoreVertical, Ban,
  CheckCircle, Clock, Download, FileText, Building, User, Phone, Mail,
  AlertTriangle, RefreshCw, Info, Calendar, Users, Eye, Flag
} from 'lucide-react';

const INITIAL_ACCOUNTS = [
  {
    id: "ACC-8901",
    businessName: "Royal Orchid Hotel",
    type: "Hotel",
    owner: "Ramesh Kumar",
    phone: "+91 98765 43210",
    email: "ramesh@royalorchid.com",
    city: "Mumbai",
    status: "Active",
    suspensionType: "None",
    reason: "",
    startDate: "",
    endDate: "",
    updatedBy: "System",
    lastUpdated: "24 May 2026",
    regDate: "12 Jan 2025",
    notes: "Account is in good standing.",
    violationsSummary: { complaints: 0, warnings: 0, suspensions: 0, lastViolationDate: "N/A" },
    history: [
      { status: "Account Created", time: "12 Jan 2025 10:00 AM", note: "Initial registration approved." }
    ],
    violations: [],
    documents: {
      gst: { status: "Verified", expiry: "15 Sep 2028" },
      pan: { status: "Verified", expiry: "N/A" },
      fssai: { status: "Verified", expiry: "20 Dec 2026" },
      tradeLicense: { status: "Verified", expiry: "30 Mar 2027" },
      businessReg: { status: "Verified", expiry: "N/A" }
    }
  },
  {
    id: "ACC-8902",
    businessName: "The Grand Palace",
    type: "Restaurant",
    owner: "Suresh Das",
    phone: "+91 98765 43211",
    email: "suresh@grandpalace.in",
    city: "Delhi",
    status: "Temporarily Suspended",
    suspensionType: "Temporary",
    reason: "Unresolved SLA Breach",
    startDate: "20 May 2026",
    endDate: "30 Jun 2026",
    updatedBy: "Sarah Connor",
    lastUpdated: "20 May 2026",
    regDate: "05 Mar 2024",
    notes: "Repeated customer food safety complaints pending resolution.",
    violationsSummary: { complaints: 5, warnings: 2, suspensions: 1, lastViolationDate: "19 May 2026" },
    history: [
      { status: "Account Created", time: "05 Mar 2024 09:00 AM", note: "Welcome onboarding complete." },
      { status: "Warning Issued", time: "10 Oct 2025 04:00 PM", note: "First safety caution sent by Support desk." },
      { status: "Suspended", time: "20 May 2026 11:30 AM", note: "Temporary suspension for safety review." }
    ],
    violations: [
      { date: "10 Oct 2025", violation: "Hygiene guidelines breach", actionTaken: "Written Warning", admin: "John Smith" },
      { date: "19 May 2026", violation: "SLA compliance threshold mismatch", actionTaken: "Temporary Suspension", admin: "Sarah Connor" }
    ],
    documents: {
      gst: { status: "Verified", expiry: "10 Dec 2028" },
      pan: { status: "Verified", expiry: "N/A" },
      fssai: { status: "Expiring Soon", expiry: "28 Jul 2026" },
      tradeLicense: { status: "Verified", expiry: "15 Apr 2027" },
      businessReg: { status: "Verified", expiry: "N/A" }
    }
  },
  {
    id: "ACC-8903",
    businessName: "Spice Route Café",
    type: "Café",
    owner: "Vikram Singh",
    phone: "+91 98765 43212",
    email: "vikram@spiceroute.com",
    city: "Pune",
    status: "Warning",
    suspensionType: "Warning",
    reason: "Late Delivery complaints",
    startDate: "22 May 2026",
    endDate: "",
    updatedBy: "Neha Mathews",
    lastUpdated: "22 May 2026",
    regDate: "15 Jul 2025",
    notes: "Warned about delivery dispatch speed. Under observation.",
    violationsSummary: { complaints: 2, warnings: 1, suspensions: 0, lastViolationDate: "22 May 2026" },
    history: [
      { status: "Account Created", time: "15 Jul 2025 11:00 AM", note: "Account created and active." },
      { status: "Warning Issued", time: "22 May 2026 03:00 PM", note: "Delays on dispatch warning issued." }
    ],
    violations: [
      { date: "22 May 2026", violation: "Delivery delay exceeds 45 mins limit", actionTaken: "Formal Warning Issued", admin: "Neha Mathews" }
    ],
    documents: {
      gst: { status: "Verified", expiry: "05 Nov 2029" },
      pan: { status: "Verified", expiry: "N/A" },
      fssai: { status: "Verified", expiry: "12 Oct 2027" },
      tradeLicense: { status: "Verified", expiry: "01 May 2028" },
      businessReg: { status: "Verified", expiry: "N/A" }
    }
  },
  {
    id: "ACC-8904",
    businessName: "Green Valley Suppliers",
    type: "Raw Material Vendor",
    owner: "Rahul Sharma",
    phone: "+91 98765 43215",
    email: "rahul@greenvalley.in",
    city: "Mumbai",
    status: "Reactivation Pending",
    suspensionType: "Temporary",
    reason: "Expired FSSAI License",
    startDate: "01 Jun 2026",
    endDate: "15 Jun 2026",
    updatedBy: "John Smith",
    lastUpdated: "15 Jun 2026",
    regDate: "01 Feb 2023",
    notes: "Awaiting administrator approval after renewal of compliance certificates.",
    violationsSummary: { complaints: 1, warnings: 0, suspensions: 1, lastViolationDate: "01 Jun 2026" },
    history: [
      { status: "Account Created", time: "01 Feb 2023 10:00 AM", note: "Approved supplier." },
      { status: "Suspended", time: "01 Jun 2026 12:00 PM", note: "Suspended due to license expiry." },
      { status: "Reactivation Requested", time: "15 Jun 2026 02:00 PM", note: "Merchant uploaded renewed certificate." }
    ],
    violations: [
      { date: "01 Jun 2026", violation: "Expired compliance document (FSSAI)", actionTaken: "Suspension", admin: "John Smith" }
    ],
    documents: {
      gst: { status: "Verified", expiry: "10 Feb 2029" },
      pan: { status: "Verified", expiry: "N/A" },
      fssai: { status: "Pending Verification", expiry: "14 Jun 2031" },
      tradeLicense: { status: "Verified", expiry: "28 Feb 2027" },
      businessReg: { status: "Verified", expiry: "N/A" }
    }
  },
  {
    id: "ACC-8905",
    businessName: "Elite Manpower Agency",
    type: "Manpower Agency",
    owner: "Amit Patel",
    phone: "+91 98765 43216",
    email: "amit@elitestaffing.co.in",
    city: "Bangalore",
    status: "Permanently Blocked",
    suspensionType: "Permanent",
    reason: "Fraudulent Docs",
    startDate: "10 May 2026",
    endDate: "Permanent",
    updatedBy: "Sarah Connor",
    lastUpdated: "10 May 2026",
    regDate: "20 Oct 2024",
    notes: "Submitted falsified PAN details. Permanent block applied.",
    violationsSummary: { complaints: 3, warnings: 0, suspensions: 1, lastViolationDate: "10 May 2026" },
    history: [
      { status: "Account Created", time: "20 Oct 2024 09:30 AM", note: "Onboarded manpower broker." },
      { status: "Blocked", time: "10 May 2026 04:30 PM", note: "Permanently blocked for compliance fraud." }
    ],
    violations: [
      { date: "10 May 2026", violation: "Forged GST/PAN verification details", actionTaken: "Permanent Account Block", admin: "Sarah Connor" }
    ],
    documents: {
      gst: { status: "Rejected", expiry: "Expired" },
      pan: { status: "Rejected", expiry: "Expired" },
      fssai: { status: "Not Required", expiry: "N/A" },
      tradeLicense: { status: "Rejected", expiry: "Expired" },
      businessReg: { status: "Rejected", expiry: "Expired" }
    }
  },
  {
    id: "ACC-8906",
    businessName: "Blue Ocean Marketing",
    type: "Marketing Agency",
    owner: "Neha Sen",
    phone: "+91 98765 43217",
    email: "neha@blueocean.agency",
    city: "Hyderabad",
    status: "Active",
    suspensionType: "None",
    reason: "",
    startDate: "",
    endDate: "",
    updatedBy: "System",
    lastUpdated: "18 Jun 2026",
    regDate: "10 Jan 2026",
    notes: "Ad campaign quality standards met.",
    violationsSummary: { complaints: 0, warnings: 0, suspensions: 0, lastViolationDate: "N/A" },
    history: [
      { status: "Account Created", time: "10 Jan 2026 11:00 AM", note: "Approved marketing affiliate account." }
    ],
    violations: [],
    documents: {
      gst: { status: "Verified", expiry: "09 Jan 2031" },
      pan: { status: "Verified", expiry: "N/A" },
      fssai: { status: "Not Required", expiry: "N/A" },
      tradeLicense: { status: "Verified", expiry: "09 Jan 2027" },
      businessReg: { status: "Verified", expiry: "N/A" }
    }
  },
  {
    id: "ACC-8907",
    businessName: "Apex Facility Services",
    type: "Service Provider",
    owner: "Aniket Deshmukh",
    phone: "+91 98765 43218",
    email: "aniket@apexservices.in",
    city: "Pune",
    status: "Active",
    suspensionType: "None",
    reason: "",
    startDate: "",
    endDate: "",
    updatedBy: "System",
    lastUpdated: "25 May 2026",
    regDate: "12 Nov 2024",
    notes: "Good performance rating on facility pest control services.",
    violationsSummary: { complaints: 1, warnings: 0, suspensions: 0, lastViolationDate: "N/A" },
    history: [
      { status: "Account Created", time: "12 Nov 2024 10:15 AM", note: "Onboarded service provider." }
    ],
    violations: [],
    documents: {
      gst: { status: "Verified", expiry: "12 Nov 2029" },
      pan: { status: "Verified", expiry: "N/A" },
      fssai: { status: "Not Required", expiry: "N/A" },
      tradeLicense: { status: "Verified", expiry: "11 Nov 2026" },
      businessReg: { status: "Verified", expiry: "N/A" }
    }
  }
];

export default function Limits() {
  const [statusAccounts, setStatusAccounts] = useState([]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [suspensionTypeFilter, setSuspensionTypeFilter] = useState("All");
  const [updatedByFilter, setUpdatedByFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Active UI Helpers
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Drawer & Tab States
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [drawerTab, setDrawerTab] = useState("Overview");

  // Interaction Dialog States
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);

  // Warning Form State
  const [warnReason, setWarnReason] = useState("Minor Policy Infraction");
  const [warnNote, setWarnNote] = useState("");
  const [warnNotify, setWarnNotify] = useState(true);

  // Suspend Form State
  const [suspendReason, setSuspendReason] = useState("Unresolved SLA Breach");
  const [suspendType, setSuspendType] = useState("Temporary"); // Temporary, Permanent
  const [suspendStart, setSuspendStart] = useState("");
  const [suspendEnd, setSuspendEnd] = useState("");
  const [suspendNote, setSuspendNote] = useState("");
  const [suspendNotify, setSuspendNotify] = useState(true);

  // Reactivate Form State
  const [reactivateReason, setReactivateReason] = useState("Compliance issues resolved");
  const [reactivateNote, setReactivateNote] = useState("");
  const [reactivateRestore, setReactivateRestore] = useState(true);
  const [reactivateNotify, setReactivateNotify] = useState(true);

  // Block Form State
  const [blockReason, setBlockReason] = useState("Fraudulent Document Submissions");
  const [blockPasswordConfirm, setBlockPasswordConfirm] = useState("");
  const [blockConfirmCheckbox, setBlockConfirmCheckbox] = useState(false);

  useEffect(() => {
    const localAccounts = localStorage.getItem('hrchub_status_accounts_v3');
    if (localAccounts) {
      const parsed = JSON.parse(localAccounts);
      if (parsed.length > 0 && parsed[0].history) {
        setStatusAccounts(parsed);
      } else {
        saveAccounts(INITIAL_ACCOUNTS);
      }
    } else {
      saveAccounts(INITIAL_ACCOUNTS);
    }
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const saveAccounts = (updated) => {
    setStatusAccounts(updated);
    localStorage.setItem('hrchub_status_accounts_v3', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const filteredAccounts = useMemo(() => {
    return statusAccounts.filter((a) => {
      const query = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        (a.businessName && a.businessName.toLowerCase().includes(query)) ||
        (a.owner && a.owner.toLowerCase().includes(query)) ||
        (a.id && a.id.toLowerCase().includes(query)) ||
        (a.phone && a.phone.toLowerCase().includes(query)) ||
        (a.city && a.city.toLowerCase().includes(query));

      const matchStatus = statusFilter === "All" || a.status === statusFilter;
      const matchType = typeFilter === "All" || a.type === typeFilter;

      let matchCity = true;
      if (cityFilter !== "All") {
        matchCity = a.city === cityFilter;
      }

      let matchSuspensionType = true;
      if (suspensionTypeFilter !== "All") {
        matchSuspensionType = a.suspensionType === suspensionTypeFilter;
      }

      let matchUpdatedBy = true;
      if (updatedByFilter !== "All") {
        matchUpdatedBy = a.updatedBy === updatedByFilter;
      }

      let matchDate = true;
      if (startDate || endDate) {
        const aDate = new Date(a.lastUpdated);
        if (startDate) {
          const sDate = new Date(startDate);
          sDate.setHours(0, 0, 0, 0);
          if (aDate < sDate) matchDate = false;
        }
        if (endDate) {
          const eDate = new Date(endDate);
          eDate.setHours(23, 59, 59, 999);
          if (aDate > eDate) matchDate = false;
        }
      }

      return matchSearch && matchStatus && matchType && matchCity && matchSuspensionType && matchUpdatedBy && matchDate;
    });
  }, [statusAccounts, searchQuery, statusFilter, typeFilter, cityFilter, suspensionTypeFilter, updatedByFilter, startDate, endDate]);

  const activeAccount = useMemo(() => statusAccounts.find(a => a.id === selectedAccountId), [statusAccounts, selectedAccountId]);

  const cities = useMemo(() => {
    const list = statusAccounts.map(a => a.city).filter(Boolean);
    return Array.from(new Set(list));
  }, [statusAccounts]);

  const admins = useMemo(() => {
    const list = statusAccounts.map(a => a.updatedBy).filter(Boolean);
    return Array.from(new Set(list));
  }, [statusAccounts]);

  const activeHoreca = statusAccounts.filter(a => a.status === 'Active' && ['Hotel', 'Restaurant', 'Café'].includes(a.type)).length;
  const suspendedHoreca = statusAccounts.filter(a => a.status === 'Temporarily Suspended' && ['Hotel', 'Restaurant', 'Café'].includes(a.type)).length;

  const activeVendors = statusAccounts.filter(a => a.status === 'Active' && !['Hotel', 'Restaurant', 'Café'].includes(a.type)).length;
  const suspendedVendors = statusAccounts.filter(a => a.status === 'Temporarily Suspended' && !['Hotel', 'Restaurant', 'Café'].includes(a.type)).length;

  const blockedAccounts = statusAccounts.filter(a => a.status === 'Permanently Blocked').length;
  const temporarySuspensions = statusAccounts.filter(a => a.status === 'Temporarily Suspended').length;

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const currentAccounts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAccounts.slice(start, start + itemsPerPage);
  }, [filteredAccounts, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, cityFilter, suspensionTypeFilter, updatedByFilter, startDate, endDate]);

  const handleAction = (e, acc, type) => {
    e.stopPropagation();
    setActiveMenuId(null);

    if (type === 'view') {
      setSelectedAccountId(acc.id);
      setDrawerTab("Overview");
    } else if (type === 'warning') {
      setSelectedAccountId(acc.id);
      setWarnReason("Minor Policy Infraction");
      setWarnNote("");
      setWarningModalOpen(true);
    } else if (type === 'suspend') {
      setSelectedAccountId(acc.id);
      setSuspendReason("Unresolved SLA Breach");
      setSuspendType("Temporary");
      setSuspendStart("");
      setSuspendEnd("");
      setSuspendNote("");
      setSuspendModalOpen(true);
    } else if (type === 'reactivate') {
      setSelectedAccountId(acc.id);
      setReactivateReason("Compliance issues resolved");
      setReactivateNote("");
      setReactivateModalOpen(true);
    } else if (type === 'block') {
      setSelectedAccountId(acc.id);
      setBlockReason("Fraudulent Document Submissions");
      setBlockPasswordConfirm("");
      setBlockConfirmCheckbox(false);
      setBlockModalOpen(true);
    } else if (type === 'history') {
      setSelectedAccountId(acc.id);
      setDrawerTab("History");
    }
  };

  const handleSendWarning = () => {
    if (!selectedAccountId) return;
    const updated = statusAccounts.map(a => {
      if (a.id === selectedAccountId) {
        const timestamp = new Date().toLocaleString();
        const timestampShort = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const nextHistory = [
          ...a.history,
          { status: "Warning Issued", time: timestamp, note: `Warning: ${warnReason}. Notes: ${warnNote}` }
        ];
        const nextViolations = [
          ...a.violations,
          { date: timestampShort, violation: warnReason, actionTaken: "Warning Issued", admin: "Super Admin" }
        ];
        return {
          ...a,
          status: "Warning",
          suspensionType: "Warning",
          reason: warnReason,
          notes: warnNote,
          lastUpdated: timestampShort,
          updatedBy: "Super Admin",
          history: nextHistory,
          violations: nextViolations,
          violationsSummary: {
            ...a.violationsSummary,
            warnings: (a.violationsSummary.warnings || 0) + 1,
            lastViolationDate: timestampShort
          }
        };
      }
      return a;
    });
    saveAccounts(updated);
    setWarningModalOpen(false);
    setWarnNote("");
    showToast("Warning issued successfully to merchant.", "success");
  };

  const handleConfirmSuspension = () => {
    if (!selectedAccountId) return;
    if (suspendType === "Temporary" && !suspendEnd) {
      showToast("Please provide suspension end date", "error");
      return;
    }
    const updated = statusAccounts.map(a => {
      if (a.id === selectedAccountId) {
        const timestamp = new Date().toLocaleString();
        const timestampShort = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const isTemp = suspendType === "Temporary";
        const statusLabel = isTemp ? "Temporarily Suspended" : "Permanently Blocked";
        const typeLabel = isTemp ? "Temporary" : "Permanent";

        const nextHistory = [
          ...a.history,
          { status: isTemp ? "Suspended" : "Blocked", time: timestamp, note: `Reason: ${suspendReason}. Period: ${suspendStart || 'Now'} to ${isTemp ? suspendEnd : 'Permanent'}` }
        ];
        const nextViolations = [
          ...a.violations,
          { date: timestampShort, violation: suspendReason, actionTaken: isTemp ? "Temporary Suspension" : "Permanent Block", admin: "Super Admin" }
        ];

        return {
          ...a,
          status: statusLabel,
          suspensionType: typeLabel,
          reason: suspendReason,
          startDate: suspendStart || timestampShort,
          endDate: isTemp ? suspendEnd : "Permanent",
          notes: suspendNote,
          lastUpdated: timestampShort,
          updatedBy: "Super Admin",
          history: nextHistory,
          violations: nextViolations,
          violationsSummary: {
            ...a.violationsSummary,
            suspensions: (a.violationsSummary.suspensions || 0) + 1,
            lastViolationDate: timestampShort
          }
        };
      }
      return a;
    });
    saveAccounts(updated);
    setSuspendModalOpen(false);
    setSuspendNote("");
    showToast(suspendType === "Temporary" ? "Account suspended temporarily." : "Account blocked permanently.", "error");
  };

  const handleReactivateAccountSubmit = () => {
    if (!selectedAccountId) return;
    const updated = statusAccounts.map(a => {
      if (a.id === selectedAccountId) {
        const timestamp = new Date().toLocaleString();
        const timestampShort = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const nextHistory = [
          ...a.history,
          { status: "Reactivated", time: timestamp, note: `Reason: ${reactivateReason}. Notes: ${reactivateNote}` }
        ];
        return {
          ...a,
          status: "Active",
          suspensionType: "None",
          reason: "",
          startDate: "",
          endDate: "",
          notes: reactivateNote,
          lastUpdated: timestampShort,
          updatedBy: "Super Admin",
          history: nextHistory
        };
      }
      return a;
    });
    saveAccounts(updated);
    setReactivateModalOpen(false);
    setReactivateNote("");
    showToast("Account reactivated successfully. Access restored.", "success");
  };

  const handleConfirmBlockSubmit = () => {
    if (!selectedAccountId) return;
    if (!blockConfirmCheckbox) {
      showToast("Please check the confirmation checkbox", "error");
      return;
    }
    if (blockPasswordConfirm.toLowerCase() !== "admin") {
      showToast("Incorrect admin password confirmation", "error");
      return;
    }
    const updated = statusAccounts.map(a => {
      if (a.id === selectedAccountId) {
        const timestamp = new Date().toLocaleString();
        const timestampShort = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const nextHistory = [
          ...a.history,
          { status: "Blocked", time: timestamp, note: `Permanently blocked. Reason: ${blockReason}` }
        ];
        const nextViolations = [
          ...a.violations,
          { date: timestampShort, violation: blockReason, actionTaken: "Permanent Block", admin: "Super Admin" }
        ];
        return {
          ...a,
          status: "Permanently Blocked",
          suspensionType: "Permanent",
          reason: blockReason,
          startDate: timestampShort,
          endDate: "Permanent",
          lastUpdated: timestampShort,
          updatedBy: "Super Admin",
          history: nextHistory,
          violations: nextViolations,
          violationsSummary: {
            ...a.violationsSummary,
            suspensions: (a.violationsSummary.suspensions || 0) + 1,
            lastViolationDate: timestampShort
          }
        };
      }
      return a;
    });
    saveAccounts(updated);
    setBlockModalOpen(false);
    setBlockPasswordConfirm("");
    setBlockConfirmCheckbox(false);
    showToast("Account blocked permanently.", "error");
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
      case "Warning":
        return "bg-amber-50 text-amber-700 border-amber-200/50";
      case "Temporarily Suspended":
        return "bg-orange-50 text-orange-700 border-orange-200/50";
      case "Permanently Blocked":
        return "bg-rose-50 text-rose-700 border-rose-200/50 font-black";
      case "Reactivation Pending":
        return "bg-purple-50 text-purple-700 border-purple-200/50";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200/50";
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
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white backdrop-blur-md pointer-events-auto ${toast.type === "success" ? "border-emerald-500/20 text-emerald-800" : "border-rose-500/20 text-rose-800"
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
            <ShieldAlert size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Status & Limits</h1>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">Manage merchant safety limits, suspensions, and permanent blocks securely.</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: "Active HoReCa", count: activeHoreca, bg: "bg-emerald-50 text-emerald-800 border-emerald-100" },
          { label: "Suspended HoReCa", count: suspendedHoreca, bg: "bg-amber-50 text-amber-800 border-amber-100" },
          { label: "Active Vendors", count: activeVendors, bg: "bg-emerald-50 text-emerald-800 border-emerald-100" },
          { label: "Suspended Vendors", count: suspendedVendors, bg: "bg-amber-50 text-amber-800 border-amber-100" },
          { label: "Blocked Accounts", count: blockedAccounts, bg: "bg-rose-50 text-rose-800 border-rose-200" },
          { label: "Temporary Suspensions", count: temporarySuspensions, bg: "bg-slate-50 text-slate-800 border-slate-200" },
        ].map((ind, i) => (
          <div key={i} className={`p-4 rounded-xl border border-slate-200/60 shadow-sm ${ind.bg}`}>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{ind.label}</span>
            <div className="text-lg font-black truncate">{ind.count}</div>
          </div>
        ))}
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col gap-4 bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Business Name, Owner, Phone, City, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            />
          </div>

          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
              <span>Date:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-slate-200 bg-slate-50/50 rounded-lg px-2 py-1 focus:outline-none text-[11px]"
              />
              <span>to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-slate-200 bg-slate-50/50 rounded-lg px-2 py-1 focus:outline-none text-[11px]"
              />
              {(startDate || endDate) && (
                <button
                  onClick={() => { setStartDate(""); setEndDate(""); }}
                  className="text-rose-600 hover:underline text-[10px] ml-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-1.5 focus:outline-none text-slate-600 font-semibold">
            <option value="All">Account Status: All</option>
            <option value="Active">Active</option>
            <option value="Warning">Warning</option>
            <option value="Temporarily Suspended">Temporarily Suspended</option>
            <option value="Permanently Blocked">Permanently Blocked</option>
            <option value="Reactivation Pending">Reactivation Pending</option>
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-1.5 focus:outline-none text-slate-600 font-semibold">
            <option value="All">Entity Type: All</option>
            <option value="Hotel">Hotel</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Café">Café</option>
            <option value="Raw Material Vendor">Raw Material Vendor</option>
            <option value="Manpower Agency">Manpower Agency</option>
            <option value="Service Provider">Service Provider</option>
            <option value="Marketing Agency">Marketing Agency</option>
          </select>
          <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-1.5 focus:outline-none text-slate-600 font-semibold">
            <option value="All">City: All</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={suspensionTypeFilter} onChange={e => setSuspensionTypeFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-1.5 focus:outline-none text-slate-600 font-semibold">
            <option value="All">Suspension Type: All</option>
            <option value="Temporary">Temporary</option>
            <option value="Permanent">Permanent</option>
            <option value="Warning">Warning</option>
            <option value="None">None</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden w-full overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse min-w-[1250px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-500">
              <th className="p-4 font-bold">Entity & City</th>
              <th className="p-4 font-bold">Type</th>
              <th className="p-4 font-bold">Owner / Contact</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold">Reason</th>
              <th className="p-4 font-bold">Suspension Period</th>
              <th className="p-4 font-bold">Last Updated By</th>
              <th className="p-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentAccounts.length > 0 ? (
              currentAccounts.map(acc => (
                <tr key={acc.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black text-slate-800">{acc.businessName}</span>
                      <span className="text-[10px] text-slate-500 font-medium">{acc.city} · {acc.id}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
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
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${getStatusBadgeColor(acc.status)}`}>
                      {acc.status}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-medium text-slate-600 max-w-[200px] truncate" title={acc.reason || "N/A"}>
                    {acc.reason || <span className="text-slate-300 italic">-</span>}
                  </td>
                  <td className="p-4">
                    {acc.status !== "Active" && acc.startDate ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] font-bold text-rose-600">Until: {acc.endDate || "N/A"}</span>
                        <span className="text-[9px] text-slate-400 font-semibold">Started: {acc.startDate}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-700">{acc.updatedBy}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{acc.lastUpdated}</span>
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
                          <button onClick={(e) => handleAction(e, acc, 'view')} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                            <Eye size={14} /> View Details
                          </button>
                          <button onClick={(e) => handleAction(e, acc, 'warning')} className="w-full text-left px-4 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                            <AlertTriangle size={14} /> Issue Warning
                          </button>
                          <button onClick={(e) => handleAction(e, acc, 'suspend')} className="w-full text-left px-4 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-50 flex items-center gap-2">
                            <Clock size={14} /> Suspend Account
                          </button>
                          <button onClick={(e) => handleAction(e, acc, 'reactivate')} className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                            <CheckCircle size={14} /> Reactivate Account
                          </button>
                          <button onClick={(e) => handleAction(e, acc, 'block')} className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                            <Ban size={14} /> Block Permanently
                          </button>
                          <button onClick={(e) => handleAction(e, acc, 'history')} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2">
                            <RefreshCw size={14} /> View History
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <ShieldAlert size={48} className="text-slate-300 stroke-[1.5]" />
                    <span className="text-xs font-black text-slate-500">No Records Found</span>
                    <span className="text-[10px] text-slate-400 max-w-[220px] leading-relaxed">
                      Try adjusting your search query or filters to find what you are looking for.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm">
          <span className="text-xs font-semibold text-slate-500">
            Showing Page <span className="text-slate-800 font-extrabold">{currentPage}</span> of <span className="text-slate-800 font-extrabold">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className={`px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold transition-colors ${currentPage === 1
                ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                : "bg-white hover:bg-slate-50 text-slate-600"
                }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-bold border transition-colors ${currentPage === idx + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
                  }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className={`px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold transition-colors ${currentPage === totalPages
                ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                : "bg-white hover:bg-slate-50 text-slate-600"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Right Side Drawer */}
      <AnimatePresence>
        {selectedAccountId && activeAccount && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setSelectedAccountId(null)}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-screen max-w-md md:max-w-lg bg-white border-l border-slate-200/80 shadow-2xl flex flex-col h-full"
              >
                {/* Header */}
                <div className="bg-white px-5 py-4 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                  <div className="flex gap-3 items-center">
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${activeAccount.status === 'Permanently Blocked' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <h2 className="font-black text-slate-800 text-sm">{activeAccount.businessName}</h2>
                      <span className="text-[10px] text-slate-400 font-bold">{activeAccount.id} • Registered: {activeAccount.regDate}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedAccountId(null)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                    <X size={18} />
                  </button>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white px-4 border-b border-slate-100 flex gap-2 flex-shrink-0">
                  {["Overview", "History", "Violations", "Documents"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setDrawerTab(tab)}
                      className={`text-xs font-bold py-3 px-2 border-b-2 transition-all relative ${drawerTab === tab
                        ? "border-blue-600 text-blue-600"
                        : "border-transparent text-slate-400 hover:text-slate-600"
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5" style={{ scrollbarWidth: "thin" }}>
                  {drawerTab === "Overview" && (
                    <div className="space-y-4">
                      {/* Entity Information */}
                      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Entity Information</h4>
                        <div className="flex gap-3 items-center pb-2 border-b border-slate-50">
                          <div className="w-12 h-12 bg-blue-600 text-white font-black rounded-xl flex items-center justify-center text-sm shadow-sm flex-shrink-0">
                            {activeAccount.businessName.split(' ').map(n => n[0]).join('').slice(0, 3)}
                          </div>
                          <div>
                            <span className="text-sm font-black text-slate-800 block">{activeAccount.businessName}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{activeAccount.type}</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs font-medium text-slate-600">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Owner Name</span>
                            <span className="font-bold text-slate-800">{activeAccount.owner}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Phone Number</span>
                            <span className="font-bold text-slate-800">{activeAccount.phone}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Email Address</span>
                            <span className="font-bold text-slate-800">{activeAccount.email}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">City Location</span>
                            <span className="font-bold text-slate-800">{activeAccount.city}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Account ID</span>
                            <span className="font-mono font-bold text-indigo-600">{activeAccount.id}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Registration Date</span>
                            <span className="font-bold text-slate-700">{activeAccount.regDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Current Status */}
                      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Current Status Properties</h4>
                        <div className="grid grid-cols-2 gap-3 text-xs font-medium text-slate-600">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Account Status</span>
                            <span className={`inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border mt-0.5 ${getStatusBadgeColor(activeAccount.status)}`}>{activeAccount.status}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Suspension Type</span>
                            <span className="font-bold text-slate-800 block mt-0.5">{activeAccount.suspensionType || "None"}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Reason</span>
                            <span className="font-semibold text-slate-750 block bg-slate-50 p-2 border border-slate-100 rounded-lg italic">
                              "{activeAccount.reason || "No current restriction"}"
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Start Date</span>
                            <span className="font-bold text-slate-700">{activeAccount.startDate || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">End Date</span>
                            <span className="font-bold text-slate-700">{activeAccount.endDate || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Last Updated By</span>
                            <span className="font-bold text-slate-800">{activeAccount.updatedBy}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Internal Notes</span>
                            <p className="text-slate-500 font-medium leading-relaxed">{activeAccount.notes || "None recorded."}</p>
                          </div>
                        </div>
                      </div>

                      {/* Violations Summary */}
                      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">Violations & Safety Summary</h4>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="p-2 border border-slate-100 rounded-lg bg-slate-50/50">
                            <span className="text-[8px] text-slate-400 font-bold uppercase block">Complaints</span>
                            <span className="text-sm font-black text-slate-700">{activeAccount.violationsSummary?.complaints || 0}</span>
                          </div>
                          <div className="p-2 border border-slate-100 rounded-lg bg-slate-50/50">
                            <span className="text-[8px] text-slate-400 font-bold uppercase block">Warnings</span>
                            <span className="text-sm font-black text-slate-700">{activeAccount.violationsSummary?.warnings || 0}</span>
                          </div>
                          <div className="p-2 border border-slate-100 rounded-lg bg-slate-50/50">
                            <span className="text-[8px] text-slate-400 font-bold uppercase block">Suspensions</span>
                            <span className="text-sm font-black text-slate-700">{activeAccount.violationsSummary?.suspensions || 0}</span>
                          </div>
                          <div className="p-2 border border-slate-100 rounded-lg bg-slate-50/50">
                            <span className="text-[8px] text-slate-400 font-bold uppercase block">Last Event</span>
                            <span className="text-[9px] font-black text-slate-600 block mt-1 truncate" title={activeAccount.violationsSummary?.lastViolationDate}>{activeAccount.violationsSummary?.lastViolationDate || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {drawerTab === "History" && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Account Lifetime Timeline</h4>
                      <div className="relative border-l border-slate-200 ml-3 flex flex-col gap-5 pt-2 pb-2">
                        {activeAccount.history && activeAccount.history.map((evt, idx) => (
                          <div key={idx} className="relative pl-5">
                            <span className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white" />
                            <div className="flex flex-col text-xs font-semibold">
                              <span className="font-black text-slate-800">{evt.status}</span>
                              <span className="text-[9px] font-bold text-slate-400 mt-0.5">{evt.time}</span>
                              <p className="text-[10px] font-medium text-slate-500 mt-1 leading-relaxed">{evt.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {drawerTab === "Violations" && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Violations History</h4>
                      {activeAccount.violations && activeAccount.violations.length > 0 ? (
                        <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-xs">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-[9px] uppercase font-bold text-slate-400 border-b border-slate-100">
                                <th className="p-3">Date</th>
                                <th className="p-3">Violation</th>
                                <th className="p-3">Action</th>
                                <th className="p-3">Admin</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activeAccount.violations.map((v, i) => (
                                <tr key={i} className="border-b border-slate-50 text-slate-600 font-semibold">
                                  <td className="p-3 text-[10px]">{v.date}</td>
                                  <td className="p-3">{v.violation}</td>
                                  <td className="p-3 text-rose-600 font-bold">{v.actionTaken}</td>
                                  <td className="p-3 font-bold text-slate-800">{v.admin}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 rounded-lg border border-slate-100">
                          No previous violations registered on file.
                        </div>
                      )}
                    </div>
                  )}

                  {drawerTab === "Documents" && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Compliance Documents</h4>
                      <div className="space-y-3">
                        {[
                          { key: "gst", label: "GST Certificate" },
                          { key: "pan", label: "PAN Card" },
                          { key: "fssai", label: "FSSAI License" },
                          { key: "tradeLicense", label: "Trade License" },
                          { key: "businessReg", label: "Business Registration Certificate" }
                        ].map((doc) => {
                          const docInfo = activeAccount.documents?.[doc.key] || { status: "Not Required", expiry: "N/A" };
                          return (
                            <div key={doc.key} className="border border-slate-100 bg-slate-50/50 rounded-xl p-3.5 flex justify-between items-center shadow-xs">
                              <div className="flex gap-3 items-center">
                                <div className="w-9 h-9 rounded bg-slate-200/60 flex items-center justify-center text-slate-500 flex-shrink-0">
                                  <FileText size={18} />
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-slate-800 block">{doc.label}</span>
                                  <span className="text-[10px] text-slate-400 font-semibold block">Expiry: {docInfo.expiry}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full ${docInfo.status === "Verified" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                  docInfo.status === "Expiring Soon" ? "bg-amber-50 text-amber-700 border-amber-100" :
                                    docInfo.status === "Pending Verification" ? "bg-purple-50 text-purple-700 border-purple-100 animate-pulse" :
                                      docInfo.status === "Rejected" ? "bg-rose-50 text-rose-700 border-rose-100" :
                                        "bg-slate-100 text-slate-600 border-slate-200"
                                  }`}>
                                  {docInfo.status}
                                </span>
                                {docInfo.status !== "Not Required" && docInfo.status !== "Not Provided" && (
                                  <button
                                    onClick={() => showToast(`Downloading ${doc.label}...`, "success")}
                                    className="p-1.5 border border-slate-200 hover:bg-slate-100 text-blue-600 rounded bg-white"
                                    title="Download Document"
                                  >
                                    <Download size={12} />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Quick Actions */}
                <div className="bg-slate-50 border-t border-slate-100 p-4 flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setWarningModalOpen(true)}
                    className="flex-1 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Warning
                  </button>
                  <button
                    onClick={() => setSuspendModalOpen(true)}
                    className="flex-1 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Suspend
                  </button>
                  <button
                    onClick={() => setBlockModalOpen(true)}
                    className="flex-1 py-2 border border-rose-250 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Block
                  </button>
                  <button
                    onClick={() => setReactivateModalOpen(true)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Reactivate
                  </button>
                  <button
                    onClick={() => setDrawerTab("History")}
                    className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    History
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Warning Modal Dialogue */}
      <AnimatePresence>
        {warningModalOpen && activeAccount && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setWarningModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 space-y-4"
            >
              <div>
                <h3 className="text-base font-black text-slate-800">Issue Warning</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Issue caution warning record on merchant account <span className="font-bold text-slate-700">{activeAccount.id}</span>.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Warning Reason</label>
                  <select
                    value={warnReason}
                    onChange={(e) => setWarnReason(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-slate-700"
                  >
                    <option value="Minor Policy Infraction">Minor Policy Infraction</option>
                    <option value="Frequent Escrow Dispute delays">Frequent Escrow Dispute delays</option>
                    <option value="Slight Hygiene Guidelines breach">Slight Hygiene Guidelines breach</option>
                    <option value="Incorrect weight listed on raw supplies">Incorrect weight listed on raw supplies</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Internal Note</label>
                  <textarea
                    value={warnNote}
                    onChange={(e) => setWarnNote(e.target.value)}
                    placeholder="Provide description text details about violation event..."
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-[70px] resize-none text-slate-700 font-medium"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Notify User</span>
                    <span className="text-[8px] text-slate-400 font-semibold uppercase">Email & In-App Notification alert</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={warnNotify}
                    onChange={(e) => setWarnNotify(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setWarningModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendWarning}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors w-full shadow-sm"
                >
                  Send Warning
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suspend Modal Dialogue */}
      <AnimatePresence>
        {suspendModalOpen && activeAccount && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSuspendModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 space-y-4"
            >
              <div>
                <h3 className="text-base font-black text-slate-800">Suspend Account</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Restrict client onboarding or platform capabilities for <span className="font-bold text-slate-700">{activeAccount.id}</span>.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Suspend Reason</label>
                  <select
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-slate-700"
                  >
                    <option value="Unresolved SLA Breach">Unresolved SLA Breach</option>
                    <option value="Policy Violation">Policy Violation</option>
                    <option value="Expired compliance licenses">Expired compliance licenses</option>
                    <option value="Escrow Dispute mediation delay">Escrow Dispute mediation delay</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Suspension Type</label>
                  <select
                    value={suspendType}
                    onChange={(e) => setSuspendType(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold text-slate-700"
                  >
                    <option value="Temporary">Temporary</option>
                    <option value="Permanent">Permanent</option>
                  </select>
                </div>

                {suspendType === "Temporary" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Start Date</label>
                      <input
                        type="date"
                        value={suspendStart}
                        onChange={(e) => setSuspendStart(e.target.value)}
                        className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-600 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">End Date</label>
                      <input
                        type="date"
                        value={suspendEnd}
                        onChange={(e) => setSuspendEnd(e.target.value)}
                        className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-600 font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Internal Note</label>
                  <textarea
                    value={suspendNote}
                    onChange={(e) => setSuspendNote(e.target.value)}
                    placeholder="Specify internal case tracker codes..."
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-[60px] resize-none text-slate-700 font-medium"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Notify User</span>
                    <span className="text-[8px] text-slate-400 font-semibold uppercase">Trigger email alert</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={suspendNotify}
                    onChange={(e) => setSuspendNotify(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setSuspendModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSuspension}
                  className="px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors w-full shadow-sm"
                >
                  Confirm Suspension
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reactivate Modal Dialogue */}
      <AnimatePresence>
        {reactivateModalOpen && activeAccount && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setReactivateModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 space-y-4"
            >
              <div>
                <h3 className="text-base font-black text-slate-800">Reactivate Account</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Restore normal trade privileges for client <span className="font-bold text-slate-700">{activeAccount.id}</span>.</p>
              </div>

              <div className="space-y-3 font-semibold text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Reactivation Reason</label>
                  <input
                    type="text"
                    value={reactivateReason}
                    onChange={(e) => setReactivateReason(e.target.value)}
                    placeholder="Explain why client is reactivated..."
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Internal Note</label>
                  <textarea
                    value={reactivateNote}
                    onChange={(e) => setReactivateNote(e.target.value)}
                    placeholder="Enter support ticket details..."
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[60px] resize-none text-slate-700 font-medium"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Restore Access</span>
                    <span className="text-[8px] text-slate-400 font-semibold uppercase">Re-enable API & Client portals</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={reactivateRestore}
                    onChange={(e) => setReactivateRestore(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-200"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Notify User</span>
                    <span className="text-[8px] text-slate-400 font-semibold uppercase">Send confirmation message</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={reactivateNotify}
                    onChange={(e) => setReactivateNotify(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setReactivateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReactivateAccountSubmit}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors w-full shadow-sm"
                >
                  Reactivate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Block Modal Dialogue */}
      <AnimatePresence>
        {blockModalOpen && activeAccount && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setBlockModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 space-y-4 border border-rose-100"
            >
              <div>
                <h3 className="text-base font-black text-rose-600 flex items-center gap-1.5"><ShieldAlert size={18} /> Block Account</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">PERMANENTLY ban merchant ID <span className="font-bold text-slate-700">{activeAccount.id}</span>.</p>
              </div>

              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-800 text-[10px] font-bold leading-relaxed">
                CAUTION: This action is irreversible. It blocks all trading, escrow payouts, and user log-ins immediately.
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Block Reason</label>
                  <select
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 font-semibold text-slate-700"
                  >
                    <option value="Fraudulent Document Submissions">Fraudulent Document Submissions</option>
                    <option value="Severe and multiple SLA Breaches">Severe and multiple SLA Breaches</option>
                    <option value="Illegal Activities on platform">Illegal Activities on platform</option>
                    <option value="Repeated warnings ignored">Repeated warnings ignored</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Confirm Admin Password</label>
                  <input
                    type="password"
                    value={blockPasswordConfirm}
                    onChange={(e) => setBlockPasswordConfirm(e.target.value)}
                    placeholder="Type 'admin' to authorize..."
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-700 font-semibold"
                  />
                </div>

                <div className="flex items-start gap-2.5 p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <input
                    type="checkbox"
                    id="blockConfirmCheck"
                    checked={blockConfirmCheckbox}
                    onChange={(e) => setBlockConfirmCheckbox(e.target.checked)}
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500 border-slate-200"
                  />
                  <label htmlFor="blockConfirmCheck" className="text-[10px] text-slate-500 font-semibold leading-relaxed cursor-pointer select-none">
                    I confirm that I have verified the evidence and want to permanently block this merchant's access.
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setBlockModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBlockSubmit}
                  disabled={!blockConfirmCheckbox || blockPasswordConfirm.toLowerCase() !== "admin"}
                  className={`px-4 py-2 text-xs font-bold text-white rounded-xl transition-colors w-full shadow-sm ${blockConfirmCheckbox && blockPasswordConfirm.toLowerCase() === "admin"
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed border-transparent"
                    }`}
                >
                  Block Permanently
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
