import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Search, Download, RefreshCw, Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, X, Eye, ChevronRight, Phone, Mail, MapPin, Copy, Check, SlidersHorizontal, Building2, Users, SearchX, Calendar, CircleAlert as AlertCircle, Ban, RotateCcw, FileText, Tag, SquareCheck as CheckSquare } from 'lucide-react';
import { fetchHorecaRegistrations, fetchVendorRegistrations } from '../../services/api.service';

const INITIAL_MOCK_ACCOUNTS = [];

const getShortAccountCode = (id) => {
  if (!id) return 'ACC-1083A';
  if (id.startsWith('ACC-') || id.startsWith('VEN-') || id.startsWith('BUS-')) return id;
  const clean = String(id).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  return `ACC-${clean.substring(0, 5) || '1083A'}`;
};

const mapAccountRecord = (a) => {
  const shortCode = getShortAccountCode(a.id);
  const isVendor = a.vendorType || a.bizCategory === 'Vendor';
  const entityType = a.vendorType || a.bizType || a.type || (isVendor ? 'Raw Material Vendor' : 'Hotel');
  const role = isVendor ? entityType : 'HoReCa Owner';
  const status = a.status === 'suspended' ? 'Suspended' : a.status === 'blocked' ? 'Blocked' : 'Active';

  return {
    id: a.id,
    shortCode,
    businessName: a.bizName || a.businessName || 'Business Partner',
    tradeName: a.tradeName || a.bizName || 'Business Partner',
    entityType,
    role,
    ownerName: a.ownerName || a.contactPerson || (a.user ? `${a.user.firstName || ''} ${a.user.lastName || ''}`.trim() : '') || 'Chetan Patil',
    phone: a.mobile || a.phone || '+91 9856320427',
    email: a.email || 'partner@hrchub.com',
    city: a.city || 'Jalgaon',
    state: a.state || 'Maharashtra',
    address: a.address || `${a.city || 'Jalgaon'}, Maharashtra`,
    pincode: a.pincode || '425001',
    status,
    restrictionType: status === 'Suspended' ? 'Temporary Suspension' : status === 'Blocked' ? 'Permanent Block' : 'No Restriction',
    restrictionReason: status === 'Suspended' ? 'Compliance Review Pending' : status === 'Blocked' ? 'Permanent Block Applied' : 'No active restriction',
    reasonCategory: status === 'Suspended' ? 'Compliance Issue' : status === 'Blocked' ? 'Fraud / Risk' : 'None',
    duration: status === 'Suspended' ? '7 days' : status === 'Blocked' ? 'No End Date' : '—',
    startDate: status !== 'Active' ? '2026-07-24' : '—',
    endDate: status === 'Suspended' ? '2026-07-31' : status === 'Blocked' ? 'Permanent' : '—',
    updatedBy: a.updatedBy || 'Admin Rahul',
    lastUpdated: a.lastUpdated || (a.updatedAt ? new Date(a.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '24 Jul 2026'),
    createdDate: a.createdDate || (a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '15 Jan 2026'),
    gstNumber: a.gstin || a.gstNumber || '27AAAAA0000A1Z5',
    panNumber: a.panNumber || 'ABCDE1234F',
    regNumber: a.regNumber || 'REG-2026-99',
    history: a.history || [
      { action: 'Account Created', date: '15 Jan 2026, 10:00 AM', actor: 'System' },
      { action: 'Status Verified', date: '15 Jan 2026, 02:00 PM', actor: 'Admin Rahul' },
    ],
  };
};

export default function Limits() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(false);

  // Filter & Search States
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Active' | 'Suspended' | 'Blocked' | 'Temporary'
  const [searchQuery, setSearchQuery] = useState('');
  const [entityTypeFilter, setEntityTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [restrictionTypeFilter, setRestrictionTypeFilter] = useState('All');
  const [reasonCategoryFilter, setReasonCategoryFilter] = useState('All');
  const [endDateStatusFilter, setEndDateStatusFilter] = useState('All'); // 'All' | 'Ending Soon' | 'Expired' | 'No End Date'
  const [cityFilter, setCityFilter] = useState('All');
  const [updatedByFilter, setUpdatedByFilter] = useState('All');
  const [startDateRange, setStartDateRange] = useState('');
  const [endDateRange, setEndDateRange] = useState('');

  // UI Drawer & Modal States
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [detailsTab, setDetailsTab] = useState('overview'); // 'overview' | 'restriction' | 'history'

  // Action Modals
  const [suspendingAccount, setSuspendingAccount] = useState(null);
  const [suspendType, setSuspendType] = useState('Temporary Suspension');
  const [suspendReasonCategory, setSuspendReasonCategory] = useState('Compliance violation');
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendStartDate, setSuspendStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [suspendEndDate, setSuspendEndDate] = useState('');
  const [suspendApplicantMsg, setSuspendApplicantMsg] = useState('');
  const [suspendInternalNote, setSuspendInternalNote] = useState('');

  const [reactivatingAccount, setReactivatingAccount] = useState(null);
  const [reactivateResolutionNote, setReactivateResolutionNote] = useState('');
  const [reactivateApplicantMsg, setReactivateApplicantMsg] = useState('');

  const [blockingAccount, setBlockingAccount] = useState(null);
  const [blockReason, setBlockReason] = useState('');
  const [blockApplicantMsg, setBlockApplicantMsg] = useState('');
  const [blockInternalNote, setBlockInternalNote] = useState('');
  const [blockConfirmCheck, setBlockConfirmCheck] = useState(false);

  const [extendingAccount, setExtendingAccount] = useState(null);
  const [extendNewEndDate, setExtendNewEndDate] = useState('');
  const [extendReason, setExtendReason] = useState('');
  const [extendApplicantMsg, setExtendApplicantMsg] = useState('');
  const [extendInternalNote, setExtendInternalNote] = useState('');

  const [unblockingAccount, setUnblockingAccount] = useState(null);
  const [unblockReviewNote, setUnblockReviewNote] = useState('');
  const [unblockReason, setUnblockReason] = useState('');
  const [unblockConfirmCheck, setUnblockConfirmCheck] = useState(false);

  const [toasts, setToasts] = useState([]);
  const [copiedId, setCopiedId] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    setErrorState(false);
    try {
      const [horecaData, vendorData] = await Promise.all([fetchHorecaRegistrations(), fetchVendorRegistrations()]);
      const combinedApi = [...(Array.isArray(horecaData) ? horecaData : []), ...(Array.isArray(vendorData) ? vendorData : [])];

      if (combinedApi.length > 0) {
        const mapped = combinedApi.map(mapAccountRecord);
        setAccounts(mapped);
      } else {
        setAccounts([]);
      }
    } catch (err) {
      console.warn('API error fetching account registrations:', err);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Summary Metrics
  const activeHoreca = accounts.filter((a) => a.status === 'Active' && (a.role === 'HoReCa Owner' || ['Hotel', 'Restaurant', 'Café'].includes(a.entityType))).length;
  const activeVendors = accounts.filter((a) => a.status === 'Active' && a.role !== 'HoReCa Owner' && !['Hotel', 'Restaurant', 'Café'].includes(a.entityType)).length;
  const suspendedCount = accounts.filter((a) => a.status === 'Suspended').length;
  const blockedCount = accounts.filter((a) => a.status === 'Blocked').length;
  const temporaryCount = accounts.filter((a) => a.restrictionType === 'Temporary Suspension').length;

  // Options
  const cities = useMemo(() => ['All', ...new Set(accounts.map((a) => a.city).filter(Boolean))], [accounts]);
  const admins = useMemo(() => ['All', ...new Set(accounts.map((a) => a.updatedBy).filter(Boolean))], [accounts]);

  // Expiration Check Helper
  const isExpired = (endDateStr) => {
    if (!endDateStr || endDateStr === '—' || endDateStr === 'Permanent') return false;
    const end = new Date(endDateStr);
    if (isNaN(end.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return end < today;
  };

  const isEndingSoon = (endDateStr) => {
    if (!endDateStr || endDateStr === '—' || endDateStr === 'Permanent') return false;
    const end = new Date(endDateStr);
    if (isNaN(end.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  // Filter Logic
  const filteredAccounts = useMemo(() => {
    return accounts.filter((a) => {
      // Primary Tab Filter
      let matchTab = true;
      if (activeTab === 'Active') matchTab = a.status === 'Active';
      else if (activeTab === 'Suspended') matchTab = a.status === 'Suspended';
      else if (activeTab === 'Blocked') matchTab = a.status === 'Blocked';
      else if (activeTab === 'Temporary') matchTab = a.restrictionType === 'Temporary Suspension';

      // Secondary Filters
      const matchEntity =
        entityTypeFilter === 'All' ||
        a.entityType === entityTypeFilter ||
        (entityTypeFilter === 'HoReCa Owner' && a.role === 'HoReCa Owner');
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      const matchRestriction = restrictionTypeFilter === 'All' || a.restrictionType === restrictionTypeFilter;
      const matchReasonCat = reasonCategoryFilter === 'All' || a.reasonCategory === reasonCategoryFilter;
      const matchCity = cityFilter === 'All' || a.city === cityFilter;
      const matchAdmin = updatedByFilter === 'All' || a.updatedBy === updatedByFilter;

      // End Date Status Filter
      let matchEndDateStatus = true;
      if (endDateStatusFilter === 'Ending Soon') matchEndDateStatus = isEndingSoon(a.endDate);
      else if (endDateStatusFilter === 'Expired') matchEndDateStatus = isExpired(a.endDate);
      else if (endDateStatusFilter === 'No End Date') matchEndDateStatus = a.endDate === 'Permanent' || a.endDate === '—';

      // Date Range Filter
      let matchDateRange = true;
      if (startDateRange && a.startDate !== '—') {
        matchDateRange = matchDateRange && new Date(a.startDate) >= new Date(startDateRange);
      }
      if (endDateRange && a.endDate !== '—' && a.endDate !== 'Permanent') {
        matchDateRange = matchDateRange && new Date(a.endDate) <= new Date(endDateRange);
      }

      // Search Query
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        a.businessName.toLowerCase().includes(q) ||
        a.tradeName.toLowerCase().includes(q) ||
        a.shortCode.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.ownerName.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.gstNumber.toLowerCase().includes(q) ||
        a.panNumber.toLowerCase().includes(q) ||
        a.regNumber.toLowerCase().includes(q);

      return (
        matchTab &&
        matchEntity &&
        matchStatus &&
        matchRestriction &&
        matchReasonCat &&
        matchCity &&
        matchAdmin &&
        matchEndDateStatus &&
        matchDateRange &&
        matchQuery
      );
    });
  }, [
    accounts,
    activeTab,
    entityTypeFilter,
    statusFilter,
    restrictionTypeFilter,
    reasonCategoryFilter,
    endDateStatusFilter,
    cityFilter,
    updatedByFilter,
    startDateRange,
    endDateRange,
    searchQuery,
  ]);

  const hasActiveFilters =
    searchQuery !== '' ||
    activeTab !== 'All' ||
    entityTypeFilter !== 'All' ||
    statusFilter !== 'All' ||
    restrictionTypeFilter !== 'All' ||
    reasonCategoryFilter !== 'All' ||
    endDateStatusFilter !== 'All' ||
    cityFilter !== 'All' ||
    updatedByFilter !== 'All' ||
    startDateRange !== '' ||
    endDateRange !== '';

  const resetFilters = () => {
    setActiveTab('All');
    setSearchQuery('');
    setEntityTypeFilter('All');
    setStatusFilter('All');
    setRestrictionTypeFilter('All');
    setReasonCategoryFilter('All');
    setEndDateStatusFilter('All');
    setCityFilter('All');
    setUpdatedByFilter('All');
    setStartDateRange('');
    setEndDateRange('');
    setShowMoreFilters(false);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredAccounts.length / rowsPerPage) || 1;
  const paginatedAccounts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredAccounts.slice(start, start + rowsPerPage);
  }, [filteredAccounts, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    activeTab,
    entityTypeFilter,
    statusFilter,
    restrictionTypeFilter,
    reasonCategoryFilter,
    endDateStatusFilter,
    cityFilter,
    updatedByFilter,
    startDateRange,
    endDateRange,
    rowsPerPage,
  ]);

  // Handlers for View & Actions
  const handleOpenAccount = (acc) => {
    setSelectedAccount(acc);
    setDetailsTab('overview');
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    showToast('Account Code copied to clipboard.', 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Action Confirmation Handlers
  const handleConfirmSuspend = () => {
    if (!suspendReason.trim()) {
      showToast('Please enter a specific reason for suspension.', 'error');
      return;
    }
    if (!suspendApplicantMsg.trim()) {
      showToast('Applicant-facing message is required.', 'error');
      return;
    }
    if (suspendType === 'Temporary Suspension' && !suspendEndDate) {
      showToast('End date is required for temporary suspension.', 'error');
      return;
    }
    if (suspendType === 'Temporary Suspension' && suspendEndDate && new Date(suspendEndDate) <= new Date(suspendStartDate)) {
      showToast('End date must be after the start date.', 'error');
      return;
    }

    const targetId = suspendingAccount.id;
    const isTemp = suspendType === 'Temporary Suspension';
    const dateFormatted = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    let calculatedDuration = '—';
    if (isTemp && suspendStartDate && suspendEndDate) {
      const startObj = new Date(suspendStartDate);
      const endObj = new Date(suspendEndDate);
      const diffDays = Math.ceil((endObj - startObj) / (1000 * 60 * 60 * 24));
      const startFmt = startObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const endFmt = endObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
      calculatedDuration = `${startFmt} – ${endFmt} (${diffDays} days)`;
    } else if (suspendType === 'Permanent Suspension') {
      calculatedDuration = 'No End Date';
    } else {
      calculatedDuration = 'Until Issue Resolved';
    }

    const updated = accounts.map((a) => {
      if (a.id === targetId) {
        const newHistory = [
          {
            action: `Account Suspended (${suspendType}) - ${suspendReason}`,
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(a.history || []),
        ];
        return {
          ...a,
          status: 'Suspended',
          restrictionType: suspendType,
          restrictionReason: suspendReason,
          reasonCategory: suspendReasonCategory,
          duration: calculatedDuration,
          startDate: suspendStartDate,
          endDate: isTemp ? suspendEndDate : 'Permanent',
          updatedBy: 'Super Admin',
          lastUpdated: dateFormatted,
          history: newHistory,
        };
      }
      return a;
    });

    setAccounts(updated);
    if (selectedAccount && selectedAccount.id === targetId) {
      setSelectedAccount(updated.find((a) => a.id === targetId));
    }
    setSuspendingAccount(null);
    setSuspendReason('');
    setSuspendEndDate('');
    setSuspendApplicantMsg('');
    setSuspendInternalNote('');
    showToast('Account suspended successfully.', 'success');
  };

  const handleConfirmReactivate = () => {
    if (!reactivateResolutionNote.trim()) {
      showToast('Resolution note is required for reactivation.', 'error');
      return;
    }
    const targetId = reactivatingAccount.id;
    const dateFormatted = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const updated = accounts.map((a) => {
      if (a.id === targetId) {
        const newHistory = [
          {
            action: `Account Reactivated (${reactivateResolutionNote})`,
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(a.history || []),
        ];
        return {
          ...a,
          status: 'Active',
          restrictionType: 'No Restriction',
          restrictionReason: 'No active restriction',
          reasonCategory: 'None',
          duration: '—',
          startDate: '—',
          endDate: '—',
          updatedBy: 'Super Admin',
          lastUpdated: dateFormatted,
          history: newHistory,
        };
      }
      return a;
    });

    setAccounts(updated);
    if (selectedAccount && selectedAccount.id === targetId) {
      setSelectedAccount(updated.find((a) => a.id === targetId));
    }
    setReactivatingAccount(null);
    setReactivateResolutionNote('');
    setReactivateApplicantMsg('');
    showToast('Account reactivated successfully.', 'success');
  };

  const handleConfirmBlock = () => {
    if (!blockReason.trim()) {
      showToast('Please select or enter a reason for blocking.', 'error');
      return;
    }
    if (!blockConfirmCheck) {
      showToast('Please check the confirmation box.', 'error');
      return;
    }

    const targetId = blockingAccount.id;
    const dateFormatted = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const updated = accounts.map((a) => {
      if (a.id === targetId) {
        const newHistory = [
          {
            action: `Account Permanently Blocked (${blockReason})`,
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(a.history || []),
        ];
        return {
          ...a,
          status: 'Blocked',
          restrictionType: 'Permanent Block',
          restrictionReason: blockReason,
          reasonCategory: 'Fraud / Risk',
          duration: 'No End Date',
          startDate: new Date().toISOString().slice(0, 10),
          endDate: 'Permanent',
          updatedBy: 'Super Admin',
          lastUpdated: dateFormatted,
          history: newHistory,
        };
      }
      return a;
    });

    setAccounts(updated);
    if (selectedAccount && selectedAccount.id === targetId) {
      setSelectedAccount(updated.find((a) => a.id === targetId));
    }
    setBlockingAccount(null);
    setBlockReason('');
    setBlockApplicantMsg('');
    setBlockInternalNote('');
    setBlockConfirmCheck(false);
    showToast('Account blocked permanently.', 'success');
  };

  const handleConfirmExtend = () => {
    if (!extendNewEndDate) {
      showToast('Please select a new end date.', 'error');
      return;
    }
    if (extendingAccount.endDate && extendingAccount.endDate !== '—' && extendingAccount.endDate !== 'Permanent') {
      if (new Date(extendNewEndDate) <= new Date(extendingAccount.endDate)) {
        showToast('New end date must be later than the current end date.', 'error');
        return;
      }
    }
    if (!extendReason.trim()) {
      showToast('Extension reason is required.', 'error');
      return;
    }

    const targetId = extendingAccount.id;
    const dateFormatted = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const startObj = new Date(extendingAccount.startDate !== '—' ? extendingAccount.startDate : new Date());
    const newEndObj = new Date(extendNewEndDate);
    const diffDays = Math.ceil((newEndObj - startObj) / (1000 * 60 * 60 * 24));
    const startFmt = startObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const endFmt = newEndObj.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const newDuration = `${startFmt} – ${endFmt} (${diffDays} days)`;

    const updated = accounts.map((a) => {
      if (a.id === targetId) {
        const newHistory = [
          {
            action: `Suspension Extended to ${endFmt} (${extendReason})`,
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(a.history || []),
        ];
        return {
          ...a,
          duration: newDuration,
          endDate: extendNewEndDate,
          updatedBy: 'Super Admin',
          lastUpdated: dateFormatted,
          history: newHistory,
        };
      }
      return a;
    });

    setAccounts(updated);
    if (selectedAccount && selectedAccount.id === targetId) {
      setSelectedAccount(updated.find((a) => a.id === targetId));
    }
    setExtendingAccount(null);
    setExtendNewEndDate('');
    setExtendReason('');
    setExtendApplicantMsg('');
    setExtendInternalNote('');
    showToast('Temporary suspension extended successfully.', 'success');
  };

  const handleConfirmUnblock = () => {
    if (!unblockReviewNote.trim()) {
      showToast('Review note is required to unblock.', 'error');
      return;
    }
    if (!unblockConfirmCheck) {
      showToast('Please check the confirmation box.', 'error');
      return;
    }

    const targetId = unblockingAccount.id;
    const dateFormatted = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const updated = accounts.map((a) => {
      if (a.id === targetId) {
        const newHistory = [
          {
            action: `Block Removed (${unblockReviewNote})`,
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(a.history || []),
        ];
        return {
          ...a,
          status: 'Active',
          restrictionType: 'No Restriction',
          restrictionReason: 'No active restriction',
          reasonCategory: 'None',
          duration: '—',
          startDate: '—',
          endDate: '—',
          updatedBy: 'Super Admin',
          lastUpdated: dateFormatted,
          history: newHistory,
        };
      }
      return a;
    });

    setAccounts(updated);
    if (selectedAccount && selectedAccount.id === targetId) {
      setSelectedAccount(updated.find((a) => a.id === targetId));
    }
    setUnblockingAccount(null);
    setUnblockReviewNote('');
    setUnblockReason('');
    setUnblockConfirmCheck(false);
    showToast('Account block removed successfully.', 'success');
  };

  const handleExportCSV = () => {
    if (filteredAccounts.length === 0) {
      showToast('No account records available to export.', 'error');
      return;
    }
    const headers = [
      'Account Code',
      'Business Name',
      'Entity Type',
      'Owner',
      'Phone',
      'City',
      'Status',
      'Restriction Type',
      'Reason',
      'Duration',
      'Updated By',
    ];
    const rows = filteredAccounts.map((a) => [
      a.shortCode,
      `"${a.businessName.replace(/"/g, '""')}"`,
      a.entityType,
      `"${a.ownerName.replace(/"/g, '""')}"`,
      a.phone,
      a.city,
      a.status,
      a.restrictionType,
      `"${a.restrictionReason.replace(/"/g, '""')}"`,
      a.duration,
      a.updatedBy,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Account_Control_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Account Control records to CSV.', 'success');
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
                t.type === 'success'
                  ? 'border-emerald-500/30 text-emerald-900 bg-emerald-50/95'
                  : t.type === 'error'
                  ? 'border-rose-500/30 text-rose-900 bg-rose-50/95'
                  : 'border-blue-500/30 text-blue-900 bg-blue-50/95'
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

      {/* Clean Page Header (No heavy hero banner) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#071B3A] text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <h1 className="text-xl font-extrabold text-[#071B3A] tracking-tight">Account Control</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage active, suspended and restricted platform accounts.</p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            onClick={() => {
              loadData();
              showToast('Refreshed account control records.', 'info');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-xl transition-all cursor-pointer active:scale-95"
            title="Refresh Records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#071B3A] bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-[#071B3A]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Compact Summary Strip (Replaces 6 large cards with 1 white container) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 gap-y-3 sm:gap-y-0">
        <div
          onClick={() => setActiveTab('Active')}
          className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors"
          title="Filter by Active HoReCa"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-emerald-700">{activeHoreca}</div>
            <div className="text-[11px] font-medium text-slate-500">Active HoReCa</div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('Active')}
          className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors"
          title="Filter by Active Vendors"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-emerald-700">{activeVendors}</div>
            <div className="text-[11px] font-medium text-slate-500">Active Vendors</div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('Suspended')}
          className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors"
          title="Filter by Suspended Accounts"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-amber-700">{suspendedCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Suspended</div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('Blocked')}
          className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors"
          title="Filter by Blocked Accounts"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold shrink-0">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-rose-700">{blockedCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Blocked</div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('Temporary')}
          className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors col-span-2 sm:col-span-1"
          title="Filter by Temporary Restrictions"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-blue-700">{temporaryCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Temporary</div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Status Tabs & Filters */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
          {/* Primary Status Tabs Row (Dark Navy active, soft gray inactive) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none shrink-0">
            {[
              { label: 'All Accounts', key: 'All', count: accounts.length },
              { label: 'Active', key: 'Active', count: accounts.filter((a) => a.status === 'Active').length },
              { label: 'Suspended', key: 'Suspended', count: suspendedCount },
              { label: 'Blocked', key: 'Blocked', count: blockedCount },
              { label: 'Temporary Restrictions', key: 'Temporary', count: temporaryCount },
            ].map((t) => {
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#071B3A] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-200/60'
                  }`}
                >
                  <span>{t.label}</span>
                  <span
                    className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Bar & Toolbar Controls */}
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search business, owner, phone, city or account ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:border-[#071B3A] focus:ring-1 focus:ring-[#071B3A] font-medium transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Entity Type Dropdown */}
            <select
              value={entityTypeFilter}
              onChange={(e) => setEntityTypeFilter(e.target.value)}
              className="text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-white rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#071B3A] transition-colors cursor-pointer shrink-0 hidden sm:block"
            >
              <option value="All">All Entities</option>
              <option value="HoReCa Owner">HoReCa Owner</option>
              <option value="Hotel">Hotel</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Café">Café</option>
              <option value="Raw Material Vendor">Raw Material Vendor</option>
              <option value="Manpower Agency">Manpower Agency</option>
              <option value="Service Provider">Service Provider</option>
              <option value="Marketing Agency">Marketing Agency</option>
            </select>

            {/* More Filters Toggle */}
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer shrink-0 ${
                showMoreFilters || hasActiveFilters
                  ? 'bg-[#071B3A]/5 border-[#071B3A] text-[#071B3A]'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>More Filters</span>
              {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#071B3A]" />}
            </button>

            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs font-bold text-rose-600 hover:text-rose-700 underline px-1 shrink-0 cursor-pointer">
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Expandable More Filters Panel */}
        <AnimatePresence>
          {showMoreFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-slate-100 pt-3 mt-1"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Entity Type</label>
                  <select
                    value={entityTypeFilter}
                    onChange={(e) => setEntityTypeFilter(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]"
                  >
                    <option value="All">All Entities</option>
                    <option value="HoReCa Owner">HoReCa Owner</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Café">Café</option>
                    <option value="Raw Material Vendor">Raw Material Vendor</option>
                    <option value="Manpower Agency">Manpower Agency</option>
                    <option value="Service Provider">Service Provider</option>
                    <option value="Marketing Agency">Marketing Agency</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Account Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Restriction Type</label>
                  <select
                    value={restrictionTypeFilter}
                    onChange={(e) => setRestrictionTypeFilter(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]"
                  >
                    <option value="All">All Restrictions</option>
                    <option value="No Restriction">No Restriction</option>
                    <option value="Temporary Suspension">Temporary Suspension</option>
                    <option value="Permanent Block">Permanent Block</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Reason Category</label>
                  <select
                    value={reasonCategoryFilter}
                    onChange={(e) => setReasonCategoryFilter(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]"
                  >
                    <option value="All">All Categories</option>
                    <option value="Compliance Issue">Compliance Issue</option>
                    <option value="Expired Licence">Expired Licence</option>
                    <option value="Fraud / Risk">Fraud / Risk</option>
                    <option value="Multiple Complaints">Multiple Complaints</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Admin Review">Admin Review</option>
                    <option value="User Request">User Request</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">End Date Status</label>
                  <select
                    value={endDateStatusFilter}
                    onChange={(e) => setEndDateStatusFilter(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]"
                  >
                    <option value="All">All End Dates</option>
                    <option value="Ending Soon">Ending Soon (within 7 days)</option>
                    <option value="Expired">Expired (Overdue)</option>
                    <option value="No End Date">No End Date / Permanent</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">City</label>
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]"
                  >
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c === 'All' ? 'All Cities' : c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Updated By Admin</label>
                  <select
                    value={updatedByFilter}
                    onChange={(e) => setUpdatedByFilter(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]"
                  >
                    {admins.map((ad) => (
                      <option key={ad} value={ad}>
                        {ad === 'All' ? 'All Admins' : ad}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Restriction Start From</label>
                  <input
                    type="date"
                    value={startDateRange}
                    onChange={(e) => setStartDateRange(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Restriction End Until</label>
                  <input
                    type="date"
                    value={endDateRange}
                    onChange={(e) => setEndDateRange(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-slate-100">
                <button
                  onClick={resetFilters}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl bg-white cursor-pointer"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowMoreFilters(false)}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#071B3A] rounded-xl hover:bg-[#0c2854] cursor-pointer shadow-xs"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Account Control Main Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        {/* Desktop / Tablet View (Strict 9 Columns fitting without horizontal page scrolling) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-[22%]">Account</th>
                <th className="py-3.5 px-3 w-[12%]">Entity Type</th>
                <th className="py-3.5 px-3 w-[15%]">Owner / Contact</th>
                <th className="py-3.5 px-3 w-[10%]">Status</th>
                <th className="py-3.5 px-3 w-[16%]">Restriction</th>
                <th className="py-3.5 px-3 w-[11%]">Duration</th>
                <th className="py-3.5 px-3 w-[8%]">Updated By</th>
                <th className="py-3.5 px-3 w-[9%]">Last Updated</th>
                <th className="py-3.5 px-4 w-[7%] text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-200" />
                        <div className="space-y-1">
                          <div className="h-3.5 bg-slate-200 rounded w-28" />
                          <div className="h-2.5 bg-slate-100 rounded w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="p-4">
                      <div className="h-3.5 bg-slate-200 rounded w-24 mb-1" />
                      <div className="h-2.5 bg-slate-100 rounded w-20" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-slate-200 rounded w-16" />
                    </td>
                    <td className="p-4">
                      <div className="h-3.5 bg-slate-200 rounded w-28 mb-1" />
                      <div className="h-2.5 bg-slate-100 rounded w-20" />
                    </td>
                    <td className="p-4">
                      <div className="h-3.5 bg-slate-200 rounded w-20" />
                    </td>
                    <td className="p-4">
                      <div className="h-3.5 bg-slate-200 rounded w-20" />
                    </td>
                    <td className="p-4">
                      <div className="h-3 bg-slate-200 rounded w-20" />
                    </td>
                    <td className="p-4 text-center">
                      <div className="h-8 bg-slate-200 rounded-lg w-24 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : errorState ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">Unable to load account records</h3>
                      <p className="text-xs text-slate-500">Please verify network connectivity and try again.</p>
                      <button
                        onClick={loadData}
                        className="mt-1 px-4 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] rounded-xl transition-colors cursor-pointer shadow-xs"
                      >
                        Retry Loading
                      </button>
                    </div>
                  </td>
                </tr>
              ) : paginatedAccounts.length > 0 ? (
                paginatedAccounts.map((a) => {
                  const initials = a.businessName.substring(0, 2).toUpperCase();
                  const expired = a.status === 'Suspended' && isExpired(a.endDate);

                  // Status Badge Styling (No Toggles)
                  let statusClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  if (a.status === 'Suspended') statusClass = 'bg-amber-50 text-amber-800 border-amber-200';
                  else if (a.status === 'Blocked') statusClass = 'bg-rose-50 text-rose-800 border-rose-200 font-extrabold';
                  else if (a.status === 'Inactive') statusClass = 'bg-slate-100 text-slate-700 border-slate-200';

                  return (
                    <tr
                      key={a.id}
                      onClick={() => handleOpenAccount(a)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      {/* Column 1: Account (Initials Avatar, Name, Short Code, City - No raw UUID) */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#071B3A]/5 border border-[#071B3A]/10 text-[#071B3A] flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-[#071B3A] group-hover:text-white transition-colors">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-[#071B3A] transition-colors truncate">
                              {a.businessName}
                            </div>
                            <div className="text-[10px] font-mono font-medium text-slate-500 mt-0.5 truncate">
                              {a.shortCode} · {a.city}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Entity Type (One compact badge) */}
                      <td className="py-3.5 px-3">
                        <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-lg border bg-slate-100 text-slate-700 border-slate-200 whitespace-nowrap">
                          {a.entityType}
                        </span>
                      </td>

                      {/* Column 3: Owner / Contact */}
                      <td className="py-3.5 px-3">
                        <div className="text-xs font-bold text-slate-900 truncate">{a.ownerName}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">{a.phone}</div>
                      </td>

                      {/* Column 4: Status (Compact badge, no switch) */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border ${statusClass}`}>
                          {a.status}
                        </span>
                      </td>

                      {/* Column 5: Restriction */}
                      <td className="py-3.5 px-3">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">{a.restrictionType}</span>
                            {expired && (
                              <span className="text-[9px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                                Expired
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[170px]" title={a.restrictionReason}>
                            {a.restrictionReason}
                          </span>
                        </div>
                      </td>

                      {/* Column 6: Duration */}
                      <td className="py-3.5 px-3">
                        <span className="text-xs font-semibold text-slate-700 block">{a.duration}</span>
                      </td>

                      {/* Column 7: Updated By */}
                      <td className="py-3.5 px-3">
                        <span className="text-xs font-semibold text-slate-700 block">{a.updatedBy}</span>
                      </td>

                      {/* Column 8: Last Updated */}
                      <td className="py-3.5 px-3">
                        <span className="text-xs font-semibold text-slate-600 block">{a.lastUpdated}</span>
                      </td>

                      {/* Column 9: Action (View Details button, always visible) */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAccount(a);
                          }}
                          className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold text-[#071B3A] bg-slate-100 hover:bg-[#071B3A] hover:text-white rounded-xl transition-all cursor-pointer min-h-[40px] whitespace-nowrap active:scale-95 shadow-2xs"
                          title="View Account Details"
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
                /* Compact Empty State */
                <tr>
                  <td colSpan="9" className="py-14 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                        <SearchX className="w-6 h-6 stroke-[1.5]" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-700">No accounts found</h3>
                      <p className="text-xs text-slate-500 max-w-sm">No platform accounts match the selected filters or search query.</p>
                      {hasActiveFilters && (
                        <button
                          onClick={resetFilters}
                          className="mt-1 px-4 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] rounded-xl transition-colors cursor-pointer shadow-xs"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile / Narrow View (< 768px Card Layout) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-6 text-center text-xs font-bold text-slate-400 animate-pulse">Loading accounts...</div>
          ) : paginatedAccounts.length > 0 ? (
            paginatedAccounts.map((a) => (
              <div
                key={a.id}
                onClick={() => handleOpenAccount(a)}
                className="p-4 space-y-3 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{a.businessName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {a.shortCode}
                      </span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{a.entityType}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      a.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-800'
                        : a.status === 'Suspended'
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-rose-50 text-rose-800'
                    }`}
                  >
                    {a.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Owner</span>
                    <span className="font-bold text-slate-800">{a.ownerName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">City</span>
                    <span className="font-bold text-slate-800">{a.city}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Restriction</span>
                    <span className="font-bold text-slate-800">{a.restrictionType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Duration</span>
                    <span className="font-bold text-slate-800">{a.duration}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">Updated {a.lastUpdated}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAccount(a);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#071B3A] bg-slate-100 px-3 py-1.5 rounded-xl cursor-pointer min-h-[36px]"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs font-bold text-slate-400">No accounts match the selected filters.</div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50/80 border-t border-slate-200/80 px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600 font-semibold">
          <div>
            Showing {filteredAccounts.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}–
            {Math.min(currentPage * rowsPerPage, filteredAccounts.length)} of {filteredAccounts.length} accounts
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-500">Rows per page:</span>
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

      {/* Account Details Centered Modal (3 Tabs: Overview | Restriction | History) */}
      <AnimatePresence>
        {selectedAccount && (
          <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAccount(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            {/* Centered Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col z-10 overflow-hidden max-h-[88vh] my-auto"
            >
              {/* Account Details Header */}
              <div className="bg-[#071B3A] text-white p-5 border-b border-slate-800 flex justify-between items-start shrink-0">
                <div className="flex gap-3.5 items-start">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-extrabold text-base text-white shrink-0">
                    {selectedAccount.businessName.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-extrabold text-white">{selectedAccount.businessName}</h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white">
                        {selectedAccount.entityType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 font-semibold mt-0.5">Owner: {selectedAccount.ownerName}</div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {selectedAccount.city}, {selectedAccount.state}
                      </span>
                      <span>•</span>
                      <span>Joined {selectedAccount.createdDate}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded">
                        Account ID: {selectedAccount.shortCode}
                      </span>
                      <button
                        onClick={() => handleCopyId(selectedAccount.id)}
                        className="text-slate-300 hover:text-white text-[11px] flex items-center gap-1 underline cursor-pointer"
                      >
                        {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAccount(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Header Bar */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-500 font-semibold">Account Status:</span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md border ${
                      selectedAccount.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : selectedAccount.status === 'Suspended'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {selectedAccount.status}
                  </span>

                  <span className="text-xs text-slate-500 font-semibold ml-2">Restriction:</span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md border bg-slate-100 text-slate-800 border-slate-200">
                    {selectedAccount.restrictionType}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedAccount.status === 'Active' ? (
                    <button
                      onClick={() => setSuspendingAccount(selectedAccount)}
                      className="px-3 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Suspend Account
                    </button>
                  ) : selectedAccount.status === 'Suspended' ? (
                    <button
                      onClick={() => setReactivatingAccount(selectedAccount)}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Reactivate Account
                    </button>
                  ) : (
                    <button
                      onClick={() => setUnblockingAccount(selectedAccount)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Unblock Account
                    </button>
                  )}
                </div>
              </div>

              {/* 3 Detail Tabs Navigation */}
              <div className="flex border-b border-slate-200 px-5 bg-white shrink-0">
                <button
                  onClick={() => setDetailsTab('overview')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    detailsTab === 'overview' ? 'border-[#071B3A] text-[#071B3A]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  1. Account Overview
                </button>
                <button
                  onClick={() => setDetailsTab('restriction')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    detailsTab === 'restriction' ? 'border-[#071B3A] text-[#071B3A]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  2. Restriction Details
                </button>
                <button
                  onClick={() => setDetailsTab('history')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    detailsTab === 'history' ? 'border-[#071B3A] text-[#071B3A]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  3. Status History
                </button>
              </div>

              {/* Tab Content Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* TAB 1: ACCOUNT OVERVIEW */}
                {detailsTab === 'overview' && (
                  <div className="space-y-5">
                    {/* Business Information Card */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-2xs">
                      <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5" />
                        Business & Registration Information
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Registered Business Name</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.businessName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Trade Name</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.tradeName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Business Category</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.entityType}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Registration Number</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.regNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">PAN Number</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.panNumber}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">GST Number</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.gstNumber}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[10px] text-slate-400 font-semibold block">City & State</span>
                          <span className="font-bold text-slate-800 block mt-0.5 leading-relaxed">
                            {selectedAccount.address}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Owner & Contact Information */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-2xs">
                      <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        Owner & Contact Details
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Owner / Contact Person</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.ownerName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Registered Mobile</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {selectedAccount.phone}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Registered Email</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {selectedAccount.email}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Verification Status</span>
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded mt-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            Verified Account
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Account Governance Meta */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3 shadow-2xs">
                      <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Account Status Information
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Account Created Date</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.createdDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Current Account Status</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.status}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Last Admin Reviewer</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.updatedBy}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-semibold block">Last Updated Date</span>
                          <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: RESTRICTION DETAILS */}
                {detailsTab === 'restriction' && (
                  <div className="space-y-5">
                    {selectedAccount.status === 'Active' ? (
                      <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-5 text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mx-auto">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-emerald-900">No active restriction</h3>
                          <p className="text-xs text-emerald-700 font-medium mt-1">
                            This account is currently allowed to use the platform.
                          </p>
                        </div>

                        <div className="pt-2 flex justify-center gap-2">
                          <button
                            onClick={() => setSuspendingAccount(selectedAccount)}
                            className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-2xs cursor-pointer"
                          >
                            Suspend Account
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-4 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            Current Operational Restriction
                          </h3>

                          {isExpired(selectedAccount.endDate) && (
                            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700">
                              Restriction Expired · Pending Admin Review
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Restriction Type</span>
                            <span className="font-extrabold text-rose-700 block mt-0.5">{selectedAccount.restrictionType}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Reason Category</span>
                            <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.reasonCategory}</span>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-[10px] text-slate-400 font-semibold block">Detailed Reason</span>
                            <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.restrictionReason}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Duration</span>
                            <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.duration}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Applied By Admin</span>
                            <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.updatedBy}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Start Date</span>
                            <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.startDate}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">End Date</span>
                            <span className="font-bold text-slate-800 block mt-0.5">{selectedAccount.endDate}</span>
                          </div>
                        </div>

                        {/* Contextual Actions */}
                        <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                          {selectedAccount.status === 'Suspended' && (
                            <>
                              <button
                                onClick={() => setExtendingAccount(selectedAccount)}
                                className="px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl cursor-pointer"
                              >
                                Extend Suspension
                              </button>
                              <button
                                onClick={() => setReactivatingAccount(selectedAccount)}
                                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer shadow-xs"
                              >
                                Reactivate Account
                              </button>
                            </>
                          )}
                          {selectedAccount.status === 'Blocked' && (
                            <button
                              onClick={() => setUnblockingAccount(selectedAccount)}
                              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl cursor-pointer"
                            >
                              Unblock Account
                            </button>
                          )}
                          {selectedAccount.status !== 'Blocked' && (
                            <button
                              onClick={() => setBlockingAccount(selectedAccount)}
                              className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl cursor-pointer ml-auto"
                            >
                              Block Account
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: STATUS HISTORY */}
                {detailsTab === 'history' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider">Account Governance Timeline</h3>

                    <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                      {selectedAccount.history.map((h, idx) => (
                        <div key={idx} className="relative">
                          <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#071B3A] ring-4 ring-white" />
                          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-0.5 shadow-2xs">
                            <div className="font-bold text-slate-900">{h.action}</div>
                            <div className="flex justify-between text-[10px] text-slate-500 font-medium">
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

              {/* Drawer Footer */}
              <div className="bg-slate-50 border-t border-slate-200/80 p-4 flex justify-between items-center gap-3 shrink-0">
                <div className="text-xs font-semibold text-slate-600">Updated {selectedAccount.lastUpdated}</div>
                <button
                  onClick={() => setSelectedAccount(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Suspend Account Modal */}
      <AnimatePresence>
        {suspendingAccount && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSuspendingAccount(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Suspend this account?</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {suspendingAccount.businessName} ({suspendingAccount.ownerName})
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Suspension Type *</label>
                  <select
                    value={suspendType}
                    onChange={(e) => setSuspendType(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  >
                    <option value="Temporary Suspension">Temporary Suspension</option>
                    <option value="Until Issue Is Resolved">Until Issue Is Resolved</option>
                    <option value="Permanent Suspension">Permanent Suspension</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Reason Category</label>
                  <select
                    value={suspendReasonCategory}
                    onChange={(e) => setSuspendReasonCategory(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  >
                    <option value="Expired mandatory licence">Expired mandatory licence</option>
                    <option value="Compliance violation">Compliance violation</option>
                    <option value="Fraud or suspicious activity">Fraud or suspicious activity</option>
                    <option value="Multiple unresolved complaints">Multiple unresolved complaints</option>
                    <option value="Payment issue">Payment issue</option>
                    <option value="Business request">Business request</option>
                    <option value="Manual admin review">Manual admin review</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Specific Reason <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Expired FSSAI Licence notice"
                    value={suspendReason}
                    onChange={(e) => setSuspendReason(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  />
                </div>

                {suspendType === 'Temporary Suspension' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Start Date *</label>
                      <input
                        type="date"
                        value={suspendStartDate}
                        onChange={(e) => setSuspendStartDate(e.target.value)}
                        className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        End Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={suspendEndDate}
                        onChange={(e) => setSuspendEndDate(e.target.value)}
                        className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Applicant-facing Message <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Message shown to merchant on login..."
                    value={suspendApplicantMsg}
                    onChange={(e) => setSuspendApplicantMsg(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Internal Admin Note (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Internal reference notes..."
                    value={suspendInternalNote}
                    onChange={(e) => setSuspendInternalNote(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setSuspendingAccount(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSuspend}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Suspend Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reactivate Account Modal */}
      <AnimatePresence>
        {reactivatingAccount && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReactivatingAccount(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Reactivate this account?</h3>
                  <p className="text-xs text-slate-500 font-medium">{reactivatingAccount.businessName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Resolution Note <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Reason for ending restriction / documents verified..."
                    value={reactivateResolutionNote}
                    onChange={(e) => setReactivateResolutionNote(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Applicant-facing Message (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Your account has been reactivated successfully."
                    value={reactivateApplicantMsg}
                    onChange={(e) => setReactivateApplicantMsg(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setReactivatingAccount(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReactivate}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Reactivate Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Block Account Modal */}
      <AnimatePresence>
        {blockingAccount && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBlockingAccount(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Block this account?</h3>
                  <p className="text-xs text-slate-500 font-medium">{blockingAccount.businessName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Block Reason <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-rose-500"
                  >
                    <option value="">-- Select Block Reason --</option>
                    <option value="Confirmed fraud">Confirmed fraud</option>
                    <option value="Identity misuse">Identity misuse</option>
                    <option value="Repeated serious violations">Repeated serious violations</option>
                    <option value="Platform abuse">Platform abuse</option>
                    <option value="Security risk">Security risk</option>
                    <option value="Legal or compliance directive">Legal or compliance directive</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Applicant-facing Message</label>
                  <input
                    type="text"
                    placeholder="Notice displayed on merchant login..."
                    value={blockApplicantMsg}
                    onChange={(e) => setBlockApplicantMsg(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Internal Admin Note</label>
                  <textarea
                    rows={2}
                    placeholder="Internal reference details..."
                    value={blockInternalNote}
                    onChange={(e) => setBlockInternalNote(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="blockConfirm"
                    checked={blockConfirmCheck}
                    onChange={(e) => setBlockConfirmCheck(e.target.checked)}
                    className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
                  />
                  <label htmlFor="blockConfirm" className="text-xs text-slate-600 font-medium cursor-pointer">
                    I understand this action will prevent platform access and revoke trading permissions.
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setBlockingAccount(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBlock}
                  disabled={!blockConfirmCheck || !blockReason}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Block Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Extend Temporary Suspension Modal */}
      <AnimatePresence>
        {extendingAccount && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExtendingAccount(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Extend Temporary Suspension</h3>
                  <p className="text-xs text-slate-500 font-medium">{extendingAccount.businessName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    New End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={extendNewEndDate}
                    onChange={(e) => setExtendNewEndDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 font-semibold"
                  />
                  {extendingAccount.endDate && extendingAccount.endDate !== '—' && (
                    <span className="text-[10px] text-slate-400 mt-1 block">Current End Date: {extendingAccount.endDate}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Extension Reason <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Additional documentation required..."
                    value={extendReason}
                    onChange={(e) => setExtendReason(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Applicant-facing Message</label>
                  <input
                    type="text"
                    placeholder="Message displayed to merchant..."
                    value={extendApplicantMsg}
                    onChange={(e) => setExtendApplicantMsg(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Internal Note</label>
                  <textarea
                    rows={2}
                    placeholder="Internal reference..."
                    value={extendInternalNote}
                    onChange={(e) => setExtendInternalNote(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setExtendingAccount(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmExtend}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Extend Suspension
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Unblock Account Modal */}
      <AnimatePresence>
        {unblockingAccount && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setUnblockingAccount(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Unblock Account?</h3>
                  <p className="text-xs text-slate-500 font-medium">{unblockingAccount.businessName}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Review Note <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Justification or audit reference for unblocking..."
                    value={unblockReviewNote}
                    onChange={(e) => setUnblockReviewNote(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="unblockConfirm"
                    checked={unblockConfirmCheck}
                    onChange={(e) => setUnblockConfirmCheck(e.target.checked)}
                    className="mt-0.5 rounded text-[#071B3A] focus:ring-[#071B3A]"
                  />
                  <label htmlFor="unblockConfirm" className="text-xs text-slate-600 font-medium cursor-pointer">
                    I confirm this account has passed review and is approved to return to active platform operations.
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setUnblockingAccount(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmUnblock}
                  disabled={!unblockConfirmCheck || !unblockReviewNote}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Unblock Account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
