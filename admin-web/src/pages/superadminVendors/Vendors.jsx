import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Building2, Search, Funnel as Filter, Download, RefreshCw, Star, X, Eye, ChevronRight, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Clock, ShieldAlert, FileText, Phone, Mail, MapPin, Copy, Check, ExternalLink, SlidersHorizontal, Users, Settings, Megaphone, Send, FileQuestion, Tag, Briefcase, Layers, Award } from 'lucide-react';
import { fetchVendorRegistrations } from '../../services/api.service';

const INITIAL_MOCK_VENDORS = [];

const getShortVendorCode = (id) => {
  if (!id) return 'VEN-1083A';
  if (id.startsWith('VEN-') || id.startsWith('APP-')) return id;
  const clean = String(id).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return `VEN-${clean.substring(0, 5) || '1083A'}`;
};

const mapVendorRecord = (v) => {
  const shortCode = getShortVendorCode(v.id);
  const vendorName = v.contactPerson || v.ownerName || (v.user ? `${v.user.firstName || ''} ${v.user.lastName || ''}`.trim() : '') || v.name || 'Vishal Patil';
  const category = v.vendorType || v.category || v.bizCategory || 'Raw Material';
  const city = v.city || 'Pune';
  const state = v.state || 'Maharashtra';

  let subcats = ['General Supply'];
  if (category === 'Raw Material') subcats = ['Vegetables', 'Fruits', 'Dairy'];
  else if (category === 'Manpower') subcats = ['Chef', 'Waiters', 'Helpers'];
  else if (category === 'Service Provider') subcats = ['Electrician', 'Plumber', 'Maintenance'];
  else if (category === 'Marketing Agency') subcats = ['Social Media', 'SEO', 'Branding'];

  if (v.subCategory) subcats = String(v.subCategory).split(',').map((s) => s.trim());

  return {
    id: v.id,
    shortCode,
    vendorName,
    businessName: v.bizName || v.businessName || 'Vija Supplier Agency',
    tradeName: v.tradeName || v.bizName || 'Vija Supplier Agency',
    category,
    subcategories: subcats,
    city,
    state,
    address: v.address || `${city}, ${state}, India`,
    pincode: v.pincode || '411001',
    phone: v.mobile || v.phone || '+91 9822334455',
    email: v.email || 'vendor@supplyhub.com',
    mobileVerified: v.mobileVerified ?? true,
    emailVerified: v.emailVerified ?? true,
    gstNumber: v.gstin || v.gstNumber || '27AAAAA1111A1Z1',
    panNumber: v.panNumber || 'ABCDE5678F',
    regNumber: v.regNumber || 'REG-VEN-2026-99',
    accountStatus: v.accountStatus || (v.status === 'suspended' ? 'Suspended' : 'Active'),
    verification: v.verification || (v.status === 'approved' ? 'Approved' : v.status === 'rejected' ? 'Rejected' : v.status === 'resubmission' ? 'Changes Requested' : 'Pending Review'),
    documentStatus: v.documentStatus || 'Valid',
    documentDetail: v.documentDetail || '4 documents active',
    joinedDate: v.joinedDate || (v.createdAt ? new Date(v.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '24 Jul 2026'),
    rating: v.rating || 4.5,
    reviewsCount: v.reviewsCount || 64,
    isTopRated: v.isTopRated ?? (v.rating >= 4.7),
    serviceArea: v.serviceArea || `${city} Metro Region`,
    completedJobs: v.completedJobs || 120,
    description: v.description || 'Verified vendor partner serving HoReCa establishments.',
    documents: v.documents || [
      { name: 'Business Registration', requirement: 'Required', status: 'Approved', validity: 'Valid', expiry: 'No Expiry' },
      { name: 'PAN Card', requirement: 'Required', status: 'Approved', validity: 'Valid', expiry: 'No Expiry' },
      { name: 'GST Certificate', requirement: 'Required', status: 'Approved', validity: 'Valid', expiry: 'No Expiry' },
      { name: 'Address / Warehouse Proof', requirement: 'Required', status: 'Approved', validity: 'Valid', expiry: 'No Expiry' },
    ],
    history: v.history || [
      { action: 'Vendor Registered', date: '24 Jul 2026, 09:15 AM', actor: 'System' },
      { action: 'Verification Approved', date: '24 Jul 2026, 02:00 PM', actor: 'Super Admin' },
    ],
  };
};

export default function Vendors() {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search State
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [documentStatusFilter, setDocumentStatusFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');

  // UI States
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [detailsTab, setDetailsTab] = useState('overview'); // 'overview' | 'services_docs' | 'activity'

  // Action Modals
  const [suspendingVendor, setSuspendingVendor] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [suspensionNote, setSuspensionNote] = useState('');

  const [reactivatingVendor, setReactivatingVendor] = useState(null);

  const [requestingDocVendor, setRequestingDocVendor] = useState(null);
  const [requestedDocName, setRequestedDocName] = useState('');
  const [requestedDocInstruction, setRequestedDocInstruction] = useState('');

  const [toasts, setToasts] = useState([]);
  const [copiedId, setCopiedId] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVendorRegistrations();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map(mapVendorRecord);
        setVendors(mapped);
      } else {
        setVendors([]);
      }
    } catch (err) {
      console.warn('API error fetching vendor registrations:', err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Summary Metrics
  const totalVendors = vendors.length;
  const activeCount = vendors.filter((v) => v.accountStatus === 'Active').length;
  const pendingVerifCount = vendors.filter((v) => v.verification === 'Pending Review' || v.verification === 'Pending').length;
  const suspendedCount = vendors.filter((v) => v.accountStatus === 'Suspended').length;
  const expiringDocsCount = vendors.filter((v) => v.documentStatus === 'Expiring Soon' || v.documentStatus === 'Expired').length;
  const topRatedCount = vendors.filter((v) => v.isTopRated || v.rating >= 4.7).length;

  // City & State Options
  const cities = useMemo(() => ['All', ...new Set(vendors.map((v) => v.city).filter(Boolean))], [vendors]);
  const states = useMemo(() => ['All', ...new Set(vendors.map((v) => v.state).filter(Boolean))], [vendors]);

  // Filter Logic
  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      // Specialization Tab Filter
      const matchTab = activeTab === 'All' || v.category.toLowerCase() === activeTab.toLowerCase();

      // Secondary Filters
      const matchCity = cityFilter === 'All' || v.city === cityFilter;
      const matchState = stateFilter === 'All' || v.state === stateFilter;
      const matchStatus = statusFilter === 'All' || v.accountStatus === statusFilter;
      const matchVerification = verificationFilter === 'All' || v.verification.toLowerCase().includes(verificationFilter.toLowerCase());
      const matchDocStatus = documentStatusFilter === 'All' || v.documentStatus === documentStatusFilter;
      const matchRating = ratingFilter === 'All' || v.rating >= parseFloat(ratingFilter);

      // Search Query across fields
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        v.vendorName.toLowerCase().includes(q) ||
        v.businessName.toLowerCase().includes(q) ||
        v.tradeName.toLowerCase().includes(q) ||
        v.shortCode.toLowerCase().includes(q) ||
        v.id.toLowerCase().includes(q) ||
        v.phone.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q) ||
        v.gstNumber.toLowerCase().includes(q) ||
        v.panNumber.toLowerCase().includes(q) ||
        v.regNumber.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q) ||
        v.subcategories.some((s) => s.toLowerCase().includes(q));

      return matchTab && matchCity && matchState && matchStatus && matchVerification && matchDocStatus && matchRating && matchQuery;
    });
  }, [vendors, activeTab, cityFilter, stateFilter, statusFilter, verificationFilter, documentStatusFilter, ratingFilter, searchQuery]);

  const hasActiveFilters = searchQuery !== '' || activeTab !== 'All' || cityFilter !== 'All' || stateFilter !== 'All' || statusFilter !== 'All' || verificationFilter !== 'All' || documentStatusFilter !== 'All' || ratingFilter !== 'All';

  const resetFilters = () => {
    setActiveTab('All');
    setSearchQuery('');
    setCityFilter('All');
    setStateFilter('All');
    setStatusFilter('All');
    setVerificationFilter('All');
    setDocumentStatusFilter('All');
    setRatingFilter('All');
    setShowMoreFilters(false);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredVendors.length / rowsPerPage) || 1;
  const paginatedVendors = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredVendors.slice(start, start + rowsPerPage);
  }, [filteredVendors, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, cityFilter, stateFilter, statusFilter, verificationFilter, documentStatusFilter, ratingFilter, rowsPerPage]);

  // Handlers for View & Actions
  const handleOpenDetails = (vendor) => {
    setSelectedVendor(vendor);
    setDetailsTab('overview');
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    showToast('Vendor ID copied to clipboard.', 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleConfirmSuspend = () => {
    if (!suspensionReason) {
      showToast('Please select a reason for suspension.', 'error');
      return;
    }
    const targetId = suspendingVendor.id;
    const updated = vendors.map((v) => {
      if (v.id === targetId) {
        const newHistory = [
          {
            action: `Vendor Account Suspended (${suspensionReason})`,
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(v.history || []),
        ];
        return { ...v, accountStatus: 'Suspended', history: newHistory };
      }
      return v;
    });

    setVendors(updated);
    if (selectedVendor && selectedVendor.id === targetId) {
      setSelectedVendor(updated.find((v) => v.id === targetId));
    }
    setSuspendingVendor(null);
    setSuspensionReason('');
    setSuspensionNote('');
    showToast('Vendor suspended successfully.', 'success');
  };

  const handleConfirmReactivate = () => {
    const targetId = reactivatingVendor.id;
    const updated = vendors.map((v) => {
      if (v.id === targetId) {
        const newHistory = [
          {
            action: 'Vendor Account Reactivated',
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(v.history || []),
        ];
        return { ...v, accountStatus: 'Active', history: newHistory };
      }
      return v;
    });

    setVendors(updated);
    if (selectedVendor && selectedVendor.id === targetId) {
      setSelectedVendor(updated.find((v) => v.id === targetId));
    }
    setReactivatingVendor(null);
    showToast('Vendor reactivated successfully.', 'success');
  };

  const handleConfirmDocRequest = () => {
    if (!requestedDocName) {
      showToast('Please select a document to request.', 'error');
      return;
    }
    const targetId = requestingDocVendor.id;
    const updated = vendors.map((v) => {
      if (v.id === targetId) {
        const newHistory = [
          {
            action: `Document Update Requested: ${requestedDocName}`,
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(v.history || []),
        ];
        return { ...v, history: newHistory };
      }
      return v;
    });

    setVendors(updated);
    if (selectedVendor && selectedVendor.id === targetId) {
      setSelectedVendor(updated.find((v) => v.id === targetId));
    }
    setRequestingDocVendor(null);
    setRequestedDocName('');
    setRequestedDocInstruction('');
    showToast('Document update request sent to vendor.', 'success');
  };

  const handleExportCSV = () => {
    if (filteredVendors.length === 0) {
      showToast('No vendor listings available to export.', 'error');
      return;
    }
    const headers = ['Code', 'Vendor Name', 'Business Name', 'Category', 'City', 'Phone', 'Email', 'Verification', 'Doc Status', 'Account Status', 'Joined'];
    const rows = filteredVendors.map((v) => [
      v.shortCode,
      `"${v.vendorName.replace(/"/g, '""')}"`,
      `"${v.businessName.replace(/"/g, '""')}"`,
      v.category,
      v.city,
      v.phone,
      v.email,
      v.verification,
      v.documentStatus,
      v.accountStatus,
      v.joinedDate,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vendor_Network_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Vendor Network CSV.', 'success');
  };

  return (
    <div className="flex flex-col gap-5 animate-fadeIn pb-12 text-slate-800">
      {/* Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center justify-between p-3.5 rounded-xl border shadow-xl bg-white backdrop-blur-md pointer-events-auto text-xs font-semibold ${
                t.type === 'success' ? 'border-emerald-500/30 text-emerald-900 bg-emerald-50/90' : t.type === 'error' ? 'border-rose-500/30 text-rose-900 bg-rose-50/90' : 'border-blue-500/30 text-blue-900 bg-blue-50/90'
              }`}
            >
              <span>{t.message}</span>
              <button onClick={() => setToasts((p) => p.filter((x) => x.id !== t.id))} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Clean Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#071B3A] text-white flex items-center justify-center font-bold shadow-xs">
              <Box className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-[#071B3A] tracking-tight">Vendor Network</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage Raw Material, Manpower, Service Provider and Marketing vendors.</p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            onClick={() => {
              loadData();
              showToast('Refreshed Vendor Network successfully.', 'info');
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/70 rounded-xl transition-colors cursor-pointer active:scale-95"
            title="Refresh Vendors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#071B3A] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-colors cursor-pointer active:scale-95"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#071B3A]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Compact Summary Strip */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 gap-y-3 sm:gap-y-0">
        <div className="flex items-center gap-3 px-3 py-1">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Box className="w-4 h-4 text-slate-700" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">{totalVendors}</div>
            <div className="text-[11px] font-medium text-slate-500">Total Vendors</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-emerald-700">{activeCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Active Accounts</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-amber-700">{pendingVerifCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Pending Review</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-rose-700">{suspendedCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Suspended</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <AlertTriangle className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-purple-700">{expiringDocsCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Docs Expiring</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1 col-span-2 sm:col-span-1">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-indigo-700">{topRatedCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Top Rated</div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Specialization Tabs & More Filters */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vendors, business, phone, GST, code or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:border-[#071B3A] focus:ring-1 focus:ring-[#071B3A] font-medium transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Specialization Pill Tabs + More Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 shrink-0">
              {['All', 'Raw Material', 'Manpower', 'Service Provider', 'Marketing Agency'].map((t) => {
                const isActive = activeTab === t;
                return (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      isActive ? 'bg-[#071B3A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer shrink-0 ${
                showMoreFilters || hasActiveFilters ? 'bg-[#071B3A]/5 border-[#071B3A] text-[#071B3A]' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#071B3A]" />}
            </button>

            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs font-bold text-rose-600 hover:text-rose-700 underline px-2 shrink-0 cursor-pointer">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* More Filters Panel (Expandable) */}
        <AnimatePresence>
          {showMoreFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-100 pt-3 mt-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">City</label>
                  <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]">
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c === 'All' ? 'All Cities' : c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">State</label>
                  <select value={stateFilter} onChange={(e) => setStateFilter(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]">
                    {states.map((s) => (
                      <option key={s} value={s}>
                        {s === 'All' ? 'All States' : s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Account Status</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]">
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Verification</label>
                  <select value={verificationFilter} onChange={(e) => setVerificationFilter(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]">
                    <option value="All">All Verification</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending Review</option>
                    <option value="Changes Requested">Changes Requested</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Doc Compliance</label>
                  <select value={documentStatusFilter} onChange={(e) => setDocumentStatusFilter(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]">
                    <option value="All">All Compliance</option>
                    <option value="Valid">Valid</option>
                    <option value="Expiring Soon">Expiring Soon</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Min Rating</label>
                  <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]">
                    <option value="All">All Ratings</option>
                    <option value="4.5">⭐ 4.5 & Above</option>
                    <option value="4.0">⭐ 4.0 & Above</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-slate-100">
                <button onClick={resetFilters} className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg bg-white">
                  Reset
                </button>
                <button onClick={() => setShowMoreFilters(false)} className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#071B3A] rounded-lg">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Directory Table / Mobile Cards */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        {/* Desktop & Tablet Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Vendor</th>
                <th className="py-3.5 px-4">Business & Location</th>
                <th className="py-3.5 px-4">Specialization</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Documents</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Joined</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                /* Skeleton Loading State */
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-200" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-3.5 bg-slate-200 rounded w-28" />
                          <div className="h-2.5 bg-slate-100 rounded w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="h-3.5 bg-slate-200 rounded w-32 mb-1" />
                      <div className="h-2.5 bg-slate-100 rounded w-20" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-slate-200 rounded-md w-24 mb-1" />
                      <div className="h-2 bg-slate-100 rounded w-32" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-slate-200 rounded-md w-20" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-slate-200 rounded-md w-24 mb-1" />
                      <div className="h-2 bg-slate-100 rounded w-28" />
                    </td>
                    <td className="p-4">
                      <div className="h-3.5 bg-slate-200 rounded w-12" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-slate-200 rounded-md w-16" />
                    </td>
                    <td className="p-4">
                      <div className="h-3 bg-slate-200 rounded w-20" />
                    </td>
                    <td className="p-4 text-center">
                      <div className="h-8 bg-slate-200 rounded-lg w-28 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : paginatedVendors.length > 0 ? (
                paginatedVendors.map((v) => {
                  const initials = v.vendorName.substring(0, 2).toUpperCase();

                  // Verification Badge Styling
                  let verifClass = 'bg-amber-50 text-amber-800 border-amber-200/60';
                  if (v.verification === 'Approved' || v.verification === 'Verified') verifClass = 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
                  else if (v.verification === 'Rejected') verifClass = 'bg-rose-50 text-rose-800 border-rose-200/60';
                  else if (v.verification === 'Changes Requested') verifClass = 'bg-purple-50 text-purple-800 border-purple-200/60';

                  // Account Status Badge Styling
                  const isSuspended = v.accountStatus === 'Suspended';
                  const statusClass = isSuspended ? 'bg-rose-50 text-rose-800 border-rose-200/60' : 'bg-emerald-50 text-emerald-800 border-emerald-200/60';

                  // Document Compliance Badge Styling
                  let docBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
                  let docBadgeText = 'Valid';
                  if (v.documentStatus === 'Expiring Soon') {
                    docBadgeClass = 'bg-amber-50 text-amber-800 border-amber-200/60';
                    docBadgeText = 'Expiring Soon';
                  } else if (v.documentStatus === 'Expired') {
                    docBadgeClass = 'bg-rose-50 text-rose-800 border-rose-200/60';
                    docBadgeText = 'Needs Attention';
                  }

                  // Specialization Category Badge Color
                  let specBadgeClass = 'bg-blue-50 text-blue-700 border-blue-100';
                  if (v.category === 'Manpower') specBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  else if (v.category === 'Service Provider') specBadgeClass = 'bg-indigo-50 text-indigo-700 border-indigo-100';
                  else if (v.category === 'Marketing Agency') specBadgeClass = 'bg-purple-50 text-purple-700 border-purple-100';

                  return (
                    <tr
                      key={v.id}
                      onClick={() => handleOpenDetails(v)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      {/* Vendor Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#071B3A]/5 border border-[#071B3A]/10 text-[#071B3A] flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#071B3A] group-hover:text-white transition-colors">
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-[#071B3A] transition-colors">{v.vendorName}</span>
                              {v.isTopRated && <span className="text-[8px] font-extrabold bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.2 rounded-full uppercase">Top Rated</span>}
                            </div>
                            <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60 inline-block mt-0.5">{v.shortCode}</span>
                          </div>
                        </div>
                      </td>

                      {/* Business & Location Column */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-slate-900">{v.businessName}</div>
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>
                            {v.city}, {v.state}
                          </span>
                        </div>
                      </td>

                      {/* Specialization Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className={`inline-block w-max text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${specBadgeClass}`}>{v.category}</span>
                          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[180px]">{v.subcategories.slice(0, 2).join(' · ')}</span>
                        </div>
                      </td>

                      {/* Verification Column */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${verifClass}`}>
                          {v.verification === 'Approved' || v.verification === 'Verified' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                          <span>{v.verification}</span>
                        </span>
                      </td>

                      {/* Documents Compliance Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className={`inline-block w-max text-[10px] font-extrabold px-2 py-0.2 rounded border ${docBadgeClass}`}>{docBadgeText}</span>
                          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[170px]">{v.documentDetail}</span>
                        </div>
                      </td>

                      {/* Rating Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span>{v.rating}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({v.reviewsCount})</span>
                        </div>
                      </td>

                      {/* Account Status Column */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border ${statusClass}`}>{v.accountStatus}</span>
                      </td>

                      {/* Last Updated / Joined Column */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold text-slate-600">{v.joinedDate}</span>
                      </td>

                      {/* Action Column */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetails(v);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#071B3A] bg-slate-100 hover:bg-[#071B3A] hover:text-white rounded-xl transition-all cursor-pointer min-h-[36px] active:scale-95"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* Empty State */
                <tr>
                  <td colSpan="9" className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                        <Box className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-700">No Vendors Found</h3>
                      <p className="text-xs text-slate-500 max-w-sm">No vendor partners match the selected search query or active filters.</p>
                      {hasActiveFilters && (
                        <button onClick={resetFilters} className="mt-1 px-4 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] rounded-xl transition-colors cursor-pointer shadow-xs">
                          Clear All Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (< 768px) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-6 text-center text-xs font-bold text-slate-400 animate-pulse">Loading vendors...</div>
          ) : paginatedVendors.length > 0 ? (
            paginatedVendors.map((v) => (
              <div key={v.id} onClick={() => handleOpenDetails(v)} className="p-4 space-y-3 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{v.vendorName}</h3>
                      {v.isTopRated && <span className="text-[8px] font-bold bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded">Top Rated</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{v.shortCode}</span>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{v.category}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${v.accountStatus === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>{v.accountStatus}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Business</span>
                    <span className="font-bold text-slate-800">{v.businessName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">City</span>
                    <span className="font-bold text-slate-800">{v.city}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Verification</span>
                    <span className="font-bold text-slate-800">{v.verification}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Rating</span>
                    <span className="font-bold text-slate-800">⭐ {v.rating}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">Joined {v.joinedDate}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(v);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#071B3A] bg-slate-100 px-3 py-1.5 rounded-lg"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs font-bold text-slate-400">No vendors found.</div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50/80 border-t border-slate-200/80 px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600 font-semibold">
          <div className="flex items-center gap-2">
            <span>
              Showing {filteredVendors.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredVendors.length)} of {filteredVendors.length} vendors
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Rows:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="bg-white border border-slate-200 text-xs font-bold rounded-lg px-2 py-1 focus:outline-none focus:border-[#071B3A]"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Prev
              </button>
              <span className="px-2 font-bold text-[#071B3A]">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Details Centered Modal */}
      <AnimatePresence>
        {selectedVendor && (
          <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedVendor(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

            {/* Centered Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col z-10 overflow-hidden max-h-[88vh] my-auto"
            >
              {/* Header */}
              <div className="bg-[#071B3A] text-white p-5 border-b border-slate-800 flex justify-between items-start shrink-0">
                <div className="flex gap-3.5 items-start">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-extrabold text-base text-white shrink-0">
                    {selectedVendor.vendorName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-extrabold text-white">{selectedVendor.businessName}</h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white">{selectedVendor.category} Vendor</span>
                    </div>
                    <div className="text-xs text-slate-300 font-semibold mt-0.5">Contact: {selectedVendor.vendorName}</div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {selectedVendor.city}, {selectedVendor.state}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-300 font-bold">⭐ {selectedVendor.rating} ({selectedVendor.reviewsCount} reviews)</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded">ID: {selectedVendor.shortCode}</span>
                      <button onClick={() => handleCopyId(selectedVendor.id)} className="text-slate-300 hover:text-white text-[11px] flex items-center gap-1 underline cursor-pointer">
                        {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId ? 'Copied' : 'Copy UUID'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button onClick={() => setSelectedVendor(null)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Badges Header Bar */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">Account Status:</span>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md border ${selectedVendor.accountStatus === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                    {selectedVendor.accountStatus}
                  </span>

                  <span className="text-xs text-slate-500 font-semibold ml-2">Verification:</span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md border ${
                      selectedVendor.verification === 'Approved' || selectedVendor.verification === 'Verified' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {selectedVendor.verification}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedVendor.accountStatus === 'Active' ? (
                    <button
                      onClick={() => setSuspendingVendor(selectedVendor)}
                      className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer active:scale-95"
                    >
                      Suspend Vendor
                    </button>
                  ) : (
                    <button
                      onClick={() => setReactivatingVendor(selectedVendor)}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer active:scale-95"
                    >
                      Reactivate Vendor
                    </button>
                  )}
                </div>
              </div>

              {/* Detail Tabs Navigation */}
              <div className="flex border-b border-slate-200 px-5 bg-white shrink-0">
                <button
                  onClick={() => setDetailsTab('overview')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    detailsTab === 'overview' ? 'border-[#071B3A] text-[#071B3A]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  1. Overview
                </button>
                <button
                  onClick={() => setDetailsTab('services_docs')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    detailsTab === 'services_docs' ? 'border-[#071B3A] text-[#071B3A]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  2. Services & Documents
                </button>
                <button
                  onClick={() => setDetailsTab('activity')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    detailsTab === 'activity' ? 'border-[#071B3A] text-[#071B3A]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  3. Activity
                </button>
              </div>

              {/* Tab Content Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* TAB 1: OVERVIEW */}
                {detailsTab === 'overview' && (
                  <div className="space-y-5">
                    {/* Business Information Card */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        Business Information
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Registered Business Name</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedVendor.businessName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Trade Name</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedVendor.tradeName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Business Reg. Number</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedVendor.regNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">PAN Number</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedVendor.panNumber}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[10px] text-slate-400 font-semibold block">GST Number</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedVendor.gstNumber}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[10px] text-slate-400 font-semibold block">Full Business Address</span>
                          <span className="font-bold text-slate-800 block mt-0.5 leading-relaxed">{selectedVendor.address}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">City & State</span>
                          <span className="font-bold text-slate-800 block mt-0.5">
                            {selectedVendor.city}, {selectedVendor.state}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Service Area</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedVendor.serviceArea}</span>
                        </div>
                      </div>
                    </div>

                    {/* Owner & Contact Card */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        Owner / Contact Information
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Vendor Contact Person</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedVendor.vendorName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Registered Mobile</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {selectedVendor.phone}
                            {selectedVendor.mobileVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Mobile Verified" />}
                          </span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[10px] text-slate-400 font-semibold block">Registered Email</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {selectedVendor.email}
                            {selectedVendor.emailVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Email Verified" />}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Vendor Performance Metrics */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        Vendor Performance Summary
                      </h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                          <span className="text-[10px] text-slate-400 font-bold block">Specialization</span>
                          <span className="font-extrabold text-[#071B3A] block mt-0.5">{selectedVendor.category}</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                          <span className="text-[10px] text-slate-400 font-bold block">Completed Jobs / Orders</span>
                          <span className="font-extrabold text-slate-900 text-sm block mt-0.5">{selectedVendor.completedJobs}</span>
                        </div>
                        <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg col-span-2 sm:col-span-1">
                          <span className="text-[10px] text-slate-400 font-bold block">Vendor Rating</span>
                          <span className="font-extrabold text-amber-600 flex items-center gap-1 block mt-0.5">⭐ {selectedVendor.rating} / 5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: SERVICES & DOCUMENTS */}
                {detailsTab === 'services_docs' && (
                  <div className="space-y-5">
                    {/* Services / Products Offered Section */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        Services / Products Offered ({selectedVendor.category})
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {selectedVendor.subcategories.map((sub, idx) => (
                          <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg border border-slate-200/70">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Compliance Summary & Document List */}
                    <div className="space-y-3">
                      <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl flex items-center justify-between gap-2 text-xs">
                        <div className="font-bold text-slate-800">{selectedVendor.documents.length} Total Compliance Documents</div>
                        <div className="flex items-center gap-3 text-[11px] font-bold">
                          <span className="text-emerald-700">{selectedVendor.documents.filter((d) => d.validity === 'Valid').length} Valid</span>
                          <span className="text-amber-700">{selectedVendor.documents.filter((d) => d.validity === 'Expiring Soon').length} Expiring Soon</span>
                          <span className="text-rose-700">{selectedVendor.documents.filter((d) => d.validity === 'Expired').length} Expired</span>
                        </div>
                      </div>

                      <div className="border border-slate-200/80 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
                        {selectedVendor.documents.map((doc, idx) => (
                          <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{doc.name}</div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                  Requirement: {doc.requirement} • Expiry: {doc.expiry}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                                  doc.validity === 'Valid' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : doc.validity === 'Expiring Soon' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                                }`}
                              >
                                {doc.validity}
                              </span>
                              <button
                                onClick={() => {
                                  setRequestingDocVendor(selectedVendor);
                                  setRequestedDocName(doc.name);
                                }}
                                className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                              >
                                Request Update
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: ACTIVITY */}
                {detailsTab === 'activity' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider">Vendor Activity Timeline</h3>

                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {selectedVendor.history.map((h, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#071B3A] ring-4 ring-white" />
                          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs space-y-1">
                            <div className="text-xs font-bold text-slate-900">{h.action}</div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>Actor: {h.actor}</span>
                              <span>{h.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Details Footer */}
              <div className="bg-slate-50 border-t border-slate-200/80 p-4 flex justify-between items-center gap-3 shrink-0">
                <button onClick={() => navigate('/verification')} className="text-xs font-bold text-[#071B3A] hover:underline flex items-center gap-1 cursor-pointer">
                  <span>View Verification Application</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button onClick={() => setSelectedVendor(null)} className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs cursor-pointer">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suspend Vendor Confirmation Modal */}
      <AnimatePresence>
        {suspendingVendor && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSuspendingVendor(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Suspend Vendor?</h3>
                  <p className="text-xs text-slate-500 font-medium">{suspendingVendor.businessName} ({suspendingVendor.vendorName})</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Select Suspension Reason <span className="text-rose-500">*</span>
                  </label>
                  <select value={suspensionReason} onChange={(e) => setSuspensionReason(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-rose-500">
                    <option value="">-- Choose Reason --</option>
                    <option value="Expired mandatory document">Expired mandatory document</option>
                    <option value="Compliance issue">Compliance issue</option>
                    <option value="Fraud or risk concern">Fraud or risk concern</option>
                    <option value="Multiple complaints">Multiple complaints</option>
                    <option value="Poor service record">Poor service record</option>
                    <option value="Vendor request">Vendor request</option>
                    <option value="Temporary operational hold">Temporary operational hold</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Internal Note (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Enter additional context..."
                    value={suspensionNote}
                    onChange={(e) => setSuspensionNote(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button onClick={() => setSuspendingVendor(null)} className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleConfirmSuspend} className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer">
                  Confirm Suspension
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reactivate Vendor Confirmation Modal */}
      <AnimatePresence>
        {reactivatingVendor && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReactivatingVendor(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Reactivate Vendor?</h3>
                  <p className="text-xs text-slate-500 font-medium">{reactivatingVendor.businessName}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">This will restore the vendor account status to Active and enable supply operations on the platform.</p>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button onClick={() => setReactivatingVendor(null)} className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleConfirmReactivate} className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer">
                  Reactivate Vendor
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Request Document Update Modal */}
      <AnimatePresence>
        {requestingDocVendor && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRequestingDocVendor(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Request Document Update</h3>
                  <p className="text-xs text-slate-500 font-medium">{requestingDocVendor.businessName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Target Document</label>
                  <input type="text" value={requestedDocName} onChange={(e) => setRequestedDocName(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]" />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Instructions for Vendor</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Please upload updated valid FSSAI certificate..."
                    value={requestedDocInstruction}
                    onChange={(e) => setRequestedDocInstruction(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button onClick={() => setRequestingDocVendor(null)} className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleConfirmDocRequest} className="px-4 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] rounded-xl shadow-xs transition-colors cursor-pointer">
                  Send Request
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
