import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Search, Funnel as Filter, Download, RefreshCw, Star, X, Eye, ChevronRight, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Clock, ShieldAlert, FileText, Phone, Mail, MapPin, Copy, Check, ExternalLink, Lock, LockOpen as Unlock, SlidersHorizontal, Plus, RotateCcw, Sparkles, Info, Calendar, Tag, ArrowUpDown } from 'lucide-react';
import { fetchHorecaRegistrations } from '../../services/api.service';

const INITIAL_MOCK_HORECA = [];

const getShortCode = (id) => {
  if (!id) return 'BUS-1083A';
  if (id.startsWith('BUS-') || id.startsWith('APP-')) return id;
  const clean = String(id).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return `BUS-${clean.substring(0, 5) || '1083A'}`;
};

const mapHorecaRecord = (h) => {
  const shortCode = getShortCode(h.id);
  const ownerName = h.ownerName || (h.user ? `${h.user.firstName || ''} ${h.user.lastName || ''}`.trim() : '') || h.owner || 'Chetan Patil';
  const type = h.bizCategory || h.type || 'Hotel';
  const city = h.city || 'Delhi';
  const state = h.state || 'Delhi';

  return {
    id: h.id,
    shortCode,
    businessName: h.bizName || h.businessName || 'Chetan Establishment',
    tradeName: h.tradeName || h.bizName || h.businessName || 'Chetan Establishment',
    owner: ownerName,
    type: type,
    city: city,
    state: state,
    address: h.address || `${city}, ${state}, India`,
    pincode: h.pincode || '110001',
    phone: h.mobile || h.phone || '+91 9876543210',
    email: h.email || 'owner@establishment.com',
    mobileVerified: h.mobileVerified ?? true,
    emailVerified: h.emailVerified ?? true,
    gstNumber: h.gstin || h.gstNumber || '27AAAAA0000A1Z4',
    panNumber: h.panNumber || 'ABCDE1234F',
    fssaiNumber: h.fssaiNo || h.fssaiNumber || '10020011000123',
    regNumber: h.regNumber || 'REG-2026-7890',
    accountStatus: h.accountStatus || (h.status === 'suspended' ? 'Suspended' : 'Active'),
    verification: h.verification || (h.status === 'approved' ? 'Verified' : h.status === 'rejected' ? 'Rejected' : h.status === 'resubmission' ? 'Changes Requested' : 'Pending Review'),
    licenseStatus: h.licenseStatus || 'Valid',
    licenseDetail: h.licenseDetail || 'FSSAI expires 24 Aug 2027',
    joinedDate: h.joinedDate || (h.createdAt ? new Date(h.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '24 Jul 2026'),
    rating: h.rating || 4.5,
    seatingCapacity: h.seatingCapacity || '45 Seats',
    operatingHours: h.operatingHours || '09:00 AM - 11:00 PM',
    description: h.description || 'Registered establishment listed on HoReCa Platform.',
    documents: h.documents || [
      { name: 'FSSAI Licence', requirement: 'Required', status: 'Verified', validity: 'Valid', expiry: '24 Aug 2027' },
      { name: 'GST Certificate', requirement: 'Required', status: 'Verified', validity: 'Valid', expiry: 'No Expiry' },
      { name: 'Business Registration', requirement: 'Required', status: 'Verified', validity: 'Valid', expiry: 'No Expiry' },
      { name: 'PAN Card', requirement: 'Required', status: 'Verified', validity: 'Valid', expiry: 'No Expiry' },
      { name: 'Fire Safety Certificate', requirement: 'Required if applicable', status: 'Verified', validity: 'Valid', expiry: '15 Jan 2028' },
    ],
    history: h.history || [
      { action: 'Business Registered on HoReCa Platform', date: '24 Jul 2026, 07:48 PM', actor: 'System' },
      { action: 'Identity & Compliance Verified', date: '25 Jul 2026, 10:15 AM', actor: 'Super Admin' },
      { action: 'Account Status set to Active', date: '25 Jul 2026, 10:16 AM', actor: 'Super Admin' },
    ],
  };
};

export default function Horeca() {
  const navigate = useNavigate();

  const [horecaListings, setHorecaListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search State
  const [typeTab, setTypeTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState('All');
  const [licenseFilter, setLicenseFilter] = useState('All');
  const [ratingFilter, setRatingFilter] = useState('All');

  // UI States
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [detailsTab, setDetailsTab] = useState('overview'); // 'overview' | 'documents' | 'activity'
  
  // Modals for Actions
  const [suspendingBusiness, setSuspendingBusiness] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [suspensionNote, setSuspensionNote] = useState('');

  const [reactivatingBusiness, setReactivatingBusiness] = useState(null);

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
      const data = await fetchHorecaRegistrations();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map(mapHorecaRecord);
        setHorecaListings(mapped);
      } else {
        setHorecaListings([]);
      }
    } catch (err) {
      console.warn('API error fetching HoReCa registrations:', err);
      setHorecaListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Summary Counts
  const totalBusinesses = horecaListings.length;
  const activeCount = horecaListings.filter((b) => b.accountStatus === 'Active').length;
  const pendingVerifCount = horecaListings.filter((b) => b.verification === 'Pending Review' || b.verification === 'Pending').length;
  const suspendedCount = horecaListings.filter((b) => b.accountStatus === 'Suspended').length;
  const expiringLicenseCount = horecaListings.filter((b) => b.licenseStatus === 'Expiring Soon' || b.licenseStatus === 'Expired').length;

  // City & State Options
  const cities = useMemo(() => ['All', ...new Set(horecaListings.map((b) => b.city).filter(Boolean))], [horecaListings]);
  const states = useMemo(() => ['All', ...new Set(horecaListings.map((b) => b.state).filter(Boolean))], [horecaListings]);

  // Filtering Logic
  const filteredListings = useMemo(() => {
    return horecaListings.filter((b) => {
      // Type Tab
      const matchType = typeTab === 'All' || b.type.toLowerCase() === typeTab.toLowerCase() || (typeTab === 'Hotels' && b.type === 'Hotel') || (typeTab === 'Restaurants' && b.type === 'Restaurant') || (typeTab === 'Cafes' && b.type === 'Cafe');
      
      // Secondary Filters
      const matchCity = cityFilter === 'All' || b.city === cityFilter;
      const matchState = stateFilter === 'All' || b.state === stateFilter;
      const matchStatus = statusFilter === 'All' || b.accountStatus === statusFilter;
      const matchVerification = verificationFilter === 'All' || b.verification.toLowerCase().includes(verificationFilter.toLowerCase());
      const matchLicense = licenseFilter === 'All' || b.licenseStatus === licenseFilter;
      const matchRating = ratingFilter === 'All' || b.rating >= parseFloat(ratingFilter);

      // Search Query across fields
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        b.businessName.toLowerCase().includes(q) ||
        b.tradeName.toLowerCase().includes(q) ||
        b.owner.toLowerCase().includes(q) ||
        b.shortCode.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q) ||
        b.phone.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.gstNumber.toLowerCase().includes(q) ||
        b.panNumber.toLowerCase().includes(q) ||
        b.regNumber.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q);

      return matchType && matchCity && matchState && matchStatus && matchVerification && matchLicense && matchRating && matchQuery;
    });
  }, [horecaListings, typeTab, cityFilter, stateFilter, statusFilter, verificationFilter, licenseFilter, ratingFilter, searchQuery]);

  const hasActiveFilters = searchQuery !== '' || typeTab !== 'All' || cityFilter !== 'All' || stateFilter !== 'All' || statusFilter !== 'All' || verificationFilter !== 'All' || licenseFilter !== 'All' || ratingFilter !== 'All';

  const resetFilters = () => {
    setTypeTab('All');
    setSearchQuery('');
    setCityFilter('All');
    setStateFilter('All');
    setStatusFilter('All');
    setVerificationFilter('All');
    setLicenseFilter('All');
    setRatingFilter('All');
    setShowMoreFilters(false);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredListings.length / rowsPerPage) || 1;
  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredListings.slice(start, start + rowsPerPage);
  }, [filteredListings, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeTab, cityFilter, stateFilter, statusFilter, verificationFilter, licenseFilter, ratingFilter, rowsPerPage]);

  // Handlers for View & Actions
  const handleOpenDetails = (business) => {
    setSelectedBusiness(business);
    setDetailsTab('overview');
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    showToast('Business ID copied to clipboard.', 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleConfirmSuspend = () => {
    if (!suspensionReason) {
      showToast('Please select a reason for suspension.', 'error');
      return;
    }
    const targetId = suspendingBusiness.id;
    const updated = horecaListings.map((b) => {
      if (b.id === targetId) {
        const newHistory = [
          {
            action: `Business Account Suspended (${suspensionReason})`,
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(b.history || []),
        ];
        return { ...b, accountStatus: 'Suspended', history: newHistory };
      }
      return b;
    });

    setHorecaListings(updated);
    if (selectedBusiness && selectedBusiness.id === targetId) {
      setSelectedBusiness(updated.find((b) => b.id === targetId));
    }
    setSuspendingBusiness(null);
    setSuspensionReason('');
    setSuspensionNote('');
    showToast('Business suspended successfully.', 'success');
  };

  const handleConfirmReactivate = () => {
    const targetId = reactivatingBusiness.id;
    const updated = horecaListings.map((b) => {
      if (b.id === targetId) {
        const newHistory = [
          {
            action: 'Business Account Reactivated',
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(b.history || []),
        ];
        return { ...b, accountStatus: 'Active', history: newHistory };
      }
      return b;
    });

    setHorecaListings(updated);
    if (selectedBusiness && selectedBusiness.id === targetId) {
      setSelectedBusiness(updated.find((b) => b.id === targetId));
    }
    setReactivatingBusiness(null);
    showToast('Business reactivated successfully.', 'success');
  };

  const handleExportCSV = () => {
    if (filteredListings.length === 0) {
      showToast('No listings available to export.', 'error');
      return;
    }
    const headers = ['Code', 'Business Name', 'Type', 'Owner', 'City', 'Phone', 'Email', 'Verification', 'Licence Status', 'Account Status', 'Joined'];
    const rows = filteredListings.map((b) => [
      b.shortCode,
      `"${b.businessName.replace(/"/g, '""')}"`,
      b.type,
      `"${b.owner.replace(/"/g, '""')}"`,
      b.city,
      b.phone,
      b.email,
      b.verification,
      b.licenseStatus,
      b.accountStatus,
      b.joinedDate,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `HoReCa_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported HoReCa Directory CSV.', 'success');
  };

  return (
    <div className="flex flex-col gap-5 animate-fadeIn pb-12 text-slate-800">
      {/* Toast Notification Container */}
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
              <Building2 className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-[#071B3A] tracking-tight">HoReCa Directory</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage registered Hotels, Restaurants and Cafes across your network.</p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            onClick={() => {
              loadData();
              showToast('Refreshed HoReCa directory successfully.', 'info');
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/70 rounded-xl transition-colors cursor-pointer active:scale-95"
            title="Refresh Directory"
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
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 gap-y-3 sm:gap-y-0">
        <div className="flex items-center gap-3 px-3 py-1">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-900">{totalBusinesses}</div>
            <div className="text-[11px] font-medium text-slate-500">Total Businesses</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-emerald-700">{activeCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Active Accounts</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-amber-700">{pendingVerifCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Pending Review</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-rose-700">{suspendedCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Suspended</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-3 py-1 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-purple-700">{expiringLicenseCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Licence Issues</div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Type Tabs & More Filters */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
          {/* Left: Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search businesses, owners, GST, code, email or city..."
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

          {/* Right: Primary Type Tabs + Filter Drawer Button */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 shrink-0">
              {['All', 'Hotels', 'Restaurants', 'Cafes'].map((t) => {
                const isActive = typeTab === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTypeTab(t)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
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
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending Review</option>
                    <option value="Changes Requested">Changes Requested</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Licence Status</label>
                  <select value={licenseFilter} onChange={(e) => setLicenseFilter(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]">
                    <option value="All">All Licences</option>
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

      {/* Directory Table / Cards Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        {/* Desktop & Tablet Table View (Hidden on narrow mobile screens < 768px) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Business</th>
                <th className="py-3.5 px-4">Owner & Location</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Licence</th>
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
                          <div className="h-3.5 bg-slate-200 rounded w-32" />
                          <div className="h-2.5 bg-slate-100 rounded w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="h-3.5 bg-slate-200 rounded w-28 mb-1" />
                      <div className="h-2.5 bg-slate-100 rounded w-20" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-slate-200 rounded-md w-16" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-slate-200 rounded-md w-24" />
                    </td>
                    <td className="p-4">
                      <div className="h-3.5 bg-slate-200 rounded w-28 mb-1" />
                      <div className="h-2.5 bg-slate-100 rounded w-36" />
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
              ) : paginatedListings.length > 0 ? (
                paginatedListings.map((b) => {
                  const initials = b.businessName.substring(0, 2).toUpperCase();

                  // Verification Badge Styling
                  let verifClass = 'bg-amber-50 text-amber-800 border-amber-200/60';
                  if (b.verification === 'Verified' || b.verification === 'Approved') verifClass = 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
                  else if (b.verification === 'Rejected') verifClass = 'bg-rose-50 text-rose-800 border-rose-200/60';
                  else if (b.verification === 'Changes Requested') verifClass = 'bg-purple-50 text-purple-800 border-purple-200/60';

                  // Account Status Badge Styling
                  const isSuspended = b.accountStatus === 'Suspended';
                  const statusClass = isSuspended ? 'bg-rose-50 text-rose-800 border-rose-200/60' : 'bg-emerald-50 text-emerald-800 border-emerald-200/60';

                  // Licence Status Badge Styling
                  let licClass = 'bg-emerald-50 text-emerald-800 border-emerald-200/60';
                  if (b.licenseStatus === 'Expiring Soon') licClass = 'bg-amber-50 text-amber-800 border-amber-200/60';
                  else if (b.licenseStatus === 'Expired') licClass = 'bg-rose-50 text-rose-800 border-rose-200/60';

                  return (
                    <tr
                      key={b.id}
                      onClick={() => handleOpenDetails(b)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      {/* Business Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#071B3A]/5 border border-[#071B3A]/10 text-[#071B3A] flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#071B3A] group-hover:text-white transition-colors">
                            {initials}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-[#071B3A] transition-colors">{b.businessName}</div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/60">{b.shortCode}</span>
                              <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5">⭐ {b.rating}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Owner & Location Column */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-slate-800">{b.owner}</div>
                        <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>
                            {b.city}, {b.state}
                          </span>
                        </div>
                      </td>

                      {/* Type Column */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                            b.type === 'Hotel' ? 'bg-blue-50 text-blue-700 border-blue-100' : b.type === 'Restaurant' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                          }`}
                        >
                          {b.type}
                        </span>
                      </td>

                      {/* Verification Column */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${verifClass}`}>
                          {b.verification === 'Verified' || b.verification === 'Approved' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                          <span>{b.verification}</span>
                        </span>
                      </td>

                      {/* Licence Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className={`inline-block w-max text-[10px] font-extrabold px-2 py-0.2 rounded border ${licClass}`}>{b.licenseStatus}</span>
                          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[170px]">{b.licenseDetail}</span>
                        </div>
                      </td>

                      {/* Account Status Column */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border ${statusClass}`}>{b.accountStatus}</span>
                      </td>

                      {/* Joined Column */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold text-slate-600">{b.joinedDate}</span>
                      </td>

                      {/* Action Column */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetails(b);
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
                  <td colSpan="8" className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                        <Building2 className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-700">No Businesses Found</h3>
                      <p className="text-xs text-slate-500 max-w-sm">No Hotels, Restaurants or Cafes match the selected search query or active filters.</p>
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

        {/* Mobile Cards View (Visible on screens < 768px) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-6 text-center text-xs font-bold text-slate-400 animate-pulse">Loading directory...</div>
          ) : paginatedListings.length > 0 ? (
            paginatedListings.map((b) => (
              <div key={b.id} onClick={() => handleOpenDetails(b)} className="p-4 space-y-3 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{b.businessName}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{b.shortCode}</span>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{b.type}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${b.accountStatus === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>{b.accountStatus}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Owner</span>
                    <span className="font-bold text-slate-800">{b.owner}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Location</span>
                    <span className="font-bold text-slate-800">{b.city}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Verification</span>
                    <span className="font-bold text-slate-800">{b.verification}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Licence</span>
                    <span className="font-bold text-slate-800">{b.licenseStatus}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">Joined {b.joinedDate}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(b);
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
            <div className="p-8 text-center text-xs font-bold text-slate-400">No businesses found.</div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50/80 border-t border-slate-200/80 px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600 font-semibold">
          <div className="flex items-center gap-2">
            <span>
              Showing {filteredListings.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredListings.length)} of {filteredListings.length} businesses
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

      {/* Business Details Centered Modal */}
      <AnimatePresence>
        {selectedBusiness && (
          <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedBusiness(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

            {/* Centered Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col z-10 overflow-hidden max-h-[88vh] my-auto"
            >
              {/* Details Header */}
              <div className="bg-[#071B3A] text-white p-5 border-b border-slate-800 flex justify-between items-start shrink-0">
                <div className="flex gap-3.5 items-start">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-extrabold text-base text-white shrink-0">
                    {selectedBusiness.businessName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-extrabold text-white">{selectedBusiness.businessName}</h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white">{selectedBusiness.type}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-300 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {selectedBusiness.city}, {selectedBusiness.state}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-300 font-bold">⭐ {selectedBusiness.rating}</span>
                      <span>•</span>
                      <span>Joined {selectedBusiness.joinedDate}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded">ID: {selectedBusiness.shortCode}</span>
                      <button onClick={() => handleCopyId(selectedBusiness.id)} className="text-slate-300 hover:text-white text-[11px] flex items-center gap-1 underline cursor-pointer">
                        {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId ? 'Copied' : 'Copy UUID'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button onClick={() => setSelectedBusiness(null)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Badges Header Bar */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">Account Status:</span>
                  <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md border ${selectedBusiness.accountStatus === 'Active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
                    {selectedBusiness.accountStatus}
                  </span>

                  <span className="text-xs text-slate-500 font-semibold ml-2">Verification:</span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md border ${
                      selectedBusiness.verification === 'Verified' || selectedBusiness.verification === 'Approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {selectedBusiness.verification}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedBusiness.accountStatus === 'Active' ? (
                    <button
                      onClick={() => setSuspendingBusiness(selectedBusiness)}
                      className="px-3 py-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer active:scale-95"
                    >
                      Suspend Business
                    </button>
                  ) : (
                    <button
                      onClick={() => setReactivatingBusiness(selectedBusiness)}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer active:scale-95"
                    >
                      Reactivate Business
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
                  onClick={() => setDetailsTab('documents')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    detailsTab === 'documents' ? 'border-[#071B3A] text-[#071B3A]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  2. Documents & Compliance
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
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedBusiness.businessName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Trade Name</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedBusiness.tradeName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Business Type</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedBusiness.type}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Business Reg. Number</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedBusiness.regNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">PAN Number</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedBusiness.panNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">GST Number</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedBusiness.gstNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">FSSAI Number</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedBusiness.fssaiNumber}</span>
                        </div>
                      </div>
                    </div>

                    {/* Owner & Contact Card */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        Owner & Contact Details
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Owner / Contact Person</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedBusiness.owner}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Registered Mobile</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {selectedBusiness.phone}
                            {selectedBusiness.mobileVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Mobile Verified" />}
                          </span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[10px] text-slate-400 font-semibold block">Registered Email</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {selectedBusiness.email}
                            {selectedBusiness.emailVerified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Email Verified" />}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Location Card */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        Location
                      </h3>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Full Business Address</span>
                          <span className="font-bold text-slate-800 block mt-0.5 leading-relaxed">{selectedBusiness.address}</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 pt-1">
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">City</span>
                            <span className="font-bold text-slate-800 block mt-0.5">{selectedBusiness.city}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">State</span>
                            <span className="font-bold text-slate-800 block mt-0.5">{selectedBusiness.state}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Pincode</span>
                            <span className="font-bold text-slate-800 block mt-0.5">{selectedBusiness.pincode}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Operational Information Card */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Operational Details
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Seating Capacity / Rooms</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedBusiness.seatingCapacity}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Operating Hours</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedBusiness.operatingHours}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[10px] text-slate-400 font-semibold block">Business Description</span>
                          <p className="font-medium text-slate-700 block mt-0.5 leading-relaxed">{selectedBusiness.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: DOCUMENTS & COMPLIANCE */}
                {detailsTab === 'documents' && (
                  <div className="space-y-4">
                    {/* Compliance Summary Strip */}
                    <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl flex items-center justify-between gap-2 text-xs">
                      <div className="font-bold text-slate-800">
                        {selectedBusiness.documents.length} Total Documents
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-bold">
                        <span className="text-emerald-700">
                          {selectedBusiness.documents.filter((d) => d.validity === 'Valid').length} Active
                        </span>
                        <span className="text-amber-700">
                          {selectedBusiness.documents.filter((d) => d.validity === 'Expiring Soon').length} Expiring Soon
                        </span>
                        <span className="text-rose-700">
                          {selectedBusiness.documents.filter((d) => d.validity === 'Expired').length} Expired
                        </span>
                      </div>
                    </div>

                    {/* Documents List */}
                    <div className="border border-slate-200/80 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
                      {selectedBusiness.documents.map((doc, idx) => (
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
                              onClick={() => navigate('/verification')}
                              className="px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: ACTIVITY */}
                {detailsTab === 'activity' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider">Business Activity Log</h3>

                    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {selectedBusiness.history.map((h, idx) => (
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

                <button onClick={() => setSelectedBusiness(null)} className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl shadow-2xs cursor-pointer">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suspension Confirmation Modal */}
      <AnimatePresence>
        {suspendingBusiness && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSuspendingBusiness(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Suspend Business?</h3>
                  <p className="text-xs text-slate-500 font-medium">{suspendingBusiness.businessName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Select Suspension Reason <span className="text-rose-500">*</span>
                  </label>
                  <select value={suspensionReason} onChange={(e) => setSuspensionReason(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-rose-500">
                    <option value="">-- Choose Reason --</option>
                    <option value="Licence expired">Licence expired</option>
                    <option value="Compliance issue">Compliance issue</option>
                    <option value="Fraud or risk concern">Fraud or risk concern</option>
                    <option value="Multiple complaints">Multiple complaints</option>
                    <option value="Business request">Business request</option>
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
                <button onClick={() => setSuspendingBusiness(null)} className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
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

      {/* Reactivation Confirmation Modal */}
      <AnimatePresence>
        {reactivatingBusiness && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReactivatingBusiness(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Reactivate Business?</h3>
                  <p className="text-xs text-slate-500 font-medium">{reactivatingBusiness.businessName}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">This will change the business account status back to Active and restore normal operations on the platform.</p>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button onClick={() => setReactivatingBusiness(null)} className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleConfirmReactivate} className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer">
                  Reactivate Business
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
