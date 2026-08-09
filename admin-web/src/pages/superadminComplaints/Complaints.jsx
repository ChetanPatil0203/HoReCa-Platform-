import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, Funnel as Filter, Download, RefreshCw, Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, X, Eye, ChevronRight, UserCheck, ShieldAlert, FileText, Phone, Mail, MapPin, Copy, Check, ExternalLink, SlidersHorizontal, Send, FileQuestion, Info, Users, Lock, LockOpen as Unlock, ArrowUpRight, RotateCcw, Paperclip, Building2, Tag, CircleAlert as AlertCircle, CircleHelp as HelpCircle, SquareCheck as CheckSquare } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to fetch tickets from backend
const fetchComplaintTickets = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/support/admin/tickets`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (err) {
    return null;
  }
};

// Fallback initial support tickets dataset
const INITIAL_MOCK_TICKETS = [];

const mapTicketRecord = (t) => {
  const code = t.ticketId || (t.id ? `TKT-${t.id.substring(0, 4).toUpperCase()}` : 'TKT');
  const user = t.user || {};
  const horeca = user.horecaRegistration || {};
  const vendor = user.vendorRegistration || {};

  const ownerName = (t.userName && t.userName !== 'HRC Owner' && t.userName !== 'User')
    ? t.userName
    : (user.firstName || user.lastName)
      ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
      : (horeca.ownerName || vendor.ownerName || t.userName || 'HRC User');
    
  const business = horeca.bizName || vendor.bizName || 'N/A';
  const email = t.userEmail || user.email || horeca.email || 'N/A';
  const phone = t.userMobile || user.mobile || horeca.mobile || 'N/A';
  const city = horeca.city || vendor.city || user.city || 'N/A';
  const state = horeca.state || vendor.state || user.state || 'N/A';

  return {
    id: t.id,
    ticketCode: code,
    ticketType: t.category || 'Support Request',
    subject: t.subject || 'Support Request',
    description: t.message || t.description || '',
    category: t.category || 'General Query',
    priority: t.priority || 'Medium',
    status: t.status || 'Open',
    assignedAdmin: t.adminNotes ? 'Admin Handled' : 'Unassigned',
    assignedDept: 'Support Helpdesk',
    createdDate: t.createdAt ? new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    lastActivity: t.updatedAt ? new Date(t.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    lastActivityBy: 'Admin / User',
    slaTimer: 'Due in 12 hours',
    slaStatus: 'On Track',
    raisedBy: t.raisedBy || {
      name: ownerName,
      business: business,
      role: (t.userRole || 'owner').toUpperCase(),
      city: city,
      state: state,
      phone: phone,
      email: email,
    },
    against: t.against || {
      name: 'HRC HUB Platform',
      businessName: 'Super Admin Helpdesk',
      role: 'Platform Admin',
      city: 'N/A',
      phone: 'N/A',
      email: 'support@hrchub.com',
    },
    relatedEntity: t.relatedEntity || { type: 'Support Request', id: code, details: t.relatedTo || 'General Support' },
    messages: t.messages || [
      { sender: ownerName, type: 'user', text: t.message || t.description || 'Issue reported.', time: t.createdAt ? new Date(t.createdAt).toLocaleString() : '' },
      ...(t.adminNotes ? [{ sender: 'Super Admin Resolution Desk', type: 'admin', text: t.adminNotes, time: t.updatedAt ? new Date(t.updatedAt).toLocaleString() : '' }] : [])
    ],
    internalNotes: t.adminNotes ? [{ id: 1, note: t.adminNotes, author: 'Super Admin', time: t.updatedAt ? new Date(t.updatedAt).toLocaleString() : '' }] : [],
    attachments: [],
    history: [
      { action: `Status: ${t.status}`, date: t.createdAt ? new Date(t.createdAt).toLocaleString() : '', actor: 'System' },
    ],
  };
};

export default function Complaints() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search States
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Open' | 'Assigned' | 'Investigating' | 'Escalated' | 'Resolved' | 'Closed'
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [raisedByTypeFilter, setRaisedByTypeFilter] = useState('All');
  const [assignedAdminFilter, setAssignedAdminFilter] = useState('All');
  const [slaStatusFilter, setSlaStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // UI Drawer & Modal States
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [detailsTab, setDetailsTab] = useState('overview'); // 'overview' | 'conversation' | 'resolution'

  // Action Modals
  const [assigningTicket, setAssigningTicket] = useState(null);
  const [selectedAdminName, setSelectedAdminName] = useState('Admin Rahul');
  const [selectedDeptName, setSelectedDeptName] = useState('Support Helpdesk');
  const [assignNoteText, setAssignNoteText] = useState('');

  const [escalatingTicket, setEscalatingTicket] = useState(null);
  const [escalationReason, setEscalationReason] = useState('');
  const [escalateToRole, setEscalateToRole] = useState('Senior Operations Head');
  const [escalationNote, setEscalationNote] = useState('');

  const [resolvingTicket, setResolvingTicket] = useState(null);
  const [resolutionType, setResolutionType] = useState('Issue Fixed');
  const [resolutionSummary, setResolutionSummary] = useState('');
  const [userFacingMessage, setUserFacingMessage] = useState('');
  const [refundRequired, setRefundRequired] = useState(false);

  const [closingTicket, setClosingTicket] = useState(null);
  const [reopeningTicket, setReopeningTicket] = useState(null);
  const [reopenReason, setReopenReason] = useState('');

  // Interactive Form Inputs inside Drawer
  const [publicReplyText, setPublicReplyText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
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
    try {
      const data = await fetchComplaintTickets();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map(mapTicketRecord);
        setTickets(mapped);
      } else {
        setTickets([]);
      }
    } catch (err) {
      console.warn('API error fetching complaint tickets:', err);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Summary Metrics
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const assignedCount = tickets.filter((t) => t.status === 'Assigned').length;
  const investigatingCount = tickets.filter((t) => t.status === 'Investigating').length;
  const escalatedCount = tickets.filter((t) => t.status === 'Escalated').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;
  const unassignedCount = tickets.filter((t) => t.assignedAdmin === 'Unassigned').length;

  // Filter Logic
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Primary Tab Filter
      const matchTab = activeTab === 'All' || t.status === activeTab;

      // Secondary Filters
      const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchCategory = categoryFilter === 'All' || t.category === categoryFilter;
      const matchRaisedByType = raisedByTypeFilter === 'All' || t.raisedBy.role === raisedByTypeFilter;
      const matchAdmin = assignedAdminFilter === 'All' || (assignedAdminFilter === 'Unassigned' ? t.assignedAdmin === 'Unassigned' : t.assignedAdmin === assignedAdminFilter);
      const matchSla = slaStatusFilter === 'All' || t.slaStatus === slaStatusFilter;

      // Search Query
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        t.ticketCode.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.raisedBy.name.toLowerCase().includes(q) ||
        t.raisedBy.business.toLowerCase().includes(q) ||
        t.against.name.toLowerCase().includes(q) ||
        t.against.businessName.toLowerCase().includes(q) ||
        t.assignedAdmin.toLowerCase().includes(q) ||
        (t.raisedBy.phone && t.raisedBy.phone.toLowerCase().includes(q));

      return matchTab && matchPriority && matchCategory && matchRaisedByType && matchAdmin && matchSla && matchQuery;
    });
  }, [tickets, activeTab, priorityFilter, categoryFilter, raisedByTypeFilter, assignedAdminFilter, slaStatusFilter, searchQuery]);

  const hasActiveFilters = searchQuery !== '' || activeTab !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All' || raisedByTypeFilter !== 'All' || assignedAdminFilter !== 'All' || slaStatusFilter !== 'All' || startDate !== '' || endDate !== '';

  const resetFilters = () => {
    setActiveTab('All');
    setSearchQuery('');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setRaisedByTypeFilter('All');
    setAssignedAdminFilter('All');
    setSlaStatusFilter('All');
    setStartDate('');
    setEndDate('');
    setShowMoreFilters(false);
  };

  // Pagination Logic
  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage) || 1;
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredTickets.slice(start, start + rowsPerPage);
  }, [filteredTickets, currentPage, rowsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab, priorityFilter, categoryFilter, raisedByTypeFilter, assignedAdminFilter, slaStatusFilter, rowsPerPage]);

  // Handlers for View & Actions
  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setDetailsTab('overview');
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    showToast('Ticket Code copied to clipboard.', 'info');
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Confirm Actions
  const handleConfirmAssign = () => {
    const targetId = assigningTicket.id;
    const updated = tickets.map((t) => {
      if (t.id === targetId) {
        const newHistory = [
          {
            action: `Ticket Assigned to ${selectedAdminName} (${selectedDeptName})`,
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(t.history || []),
        ];
        return {
          ...t,
          assignedAdmin: selectedAdminName,
          assignedDept: selectedDeptName,
          status: t.status === 'Open' ? 'Assigned' : t.status,
          history: newHistory,
          lastActivity: 'Just assigned',
          lastActivityBy: 'Super Admin',
        };
      }
      return t;
    });

    setTickets(updated);
    if (selectedTicket && selectedTicket.id === targetId) {
      setSelectedTicket(updated.find((t) => t.id === targetId));
    }
    setAssigningTicket(null);
    setAssignNoteText('');
    showToast(`Ticket assigned to ${selectedAdminName} successfully.`, 'success');
  };

  const handleStartInvestigation = (ticket) => {
    const targetId = ticket.id;
    const updated = tickets.map((t) => {
      if (t.id === targetId) {
        const newHistory = [
          {
            action: 'Investigation Started',
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(t.history || []),
        ];
        return { ...t, status: 'Investigating', history: newHistory, lastActivity: 'Investigation started', lastActivityBy: 'Super Admin' };
      }
      return t;
    });

    setTickets(updated);
    if (selectedTicket && selectedTicket.id === targetId) {
      setSelectedTicket(updated.find((t) => t.id === targetId));
    }
    showToast('Investigation started.', 'info');
  };

  const handleConfirmEscalate = () => {
    if (!escalationReason) {
      showToast('Please select or provide an escalation reason.', 'error');
      return;
    }
    const targetId = escalatingTicket.id;
    const updated = tickets.map((t) => {
      if (t.id === targetId) {
        const newHistory = [
          {
            action: `Ticket Escalated to ${escalateToRole} (${escalationReason})`,
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(t.history || []),
        ];
        return {
          ...t,
          status: 'Escalated',
          priority: 'Urgent',
          history: newHistory,
          lastActivity: 'Ticket escalated',
          lastActivityBy: 'Super Admin',
        };
      }
      return t;
    });

    setTickets(updated);
    if (selectedTicket && selectedTicket.id === targetId) {
      setSelectedTicket(updated.find((t) => t.id === targetId));
    }
    setEscalatingTicket(null);
    setEscalationReason('');
    setEscalationNote('');
    showToast('Complaint escalated successfully.', 'success');
  };

  const handleConfirmResolve = async () => {
    if (!resolutionSummary.trim()) {
      showToast('Resolution summary is required.', 'error');
      return;
    }
    const targetId = resolvingTicket.id;

    try {
      await fetch(`${API_BASE_URL}/support/admin/tickets/${targetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Resolved',
          adminNotes: userFacingMessage.trim() || resolutionSummary.trim()
        })
      });
    } catch (e) {
      console.warn('Backend update error:', e);
    }

    const updated = tickets.map((t) => {
      if (t.id === targetId) {
        const newHistory = [
          {
            action: `Complaint Resolved (${resolutionType})`,
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(t.history || []),
        ];
        const newMessages = userFacingMessage.trim()
          ? [
              ...(t.messages || []),
              { sender: 'Super Admin Resolution Desk', type: 'admin', text: userFacingMessage, time: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) },
            ]
          : t.messages;

        return {
          ...t,
          status: 'Resolved',
          slaStatus: 'Met',
          slaTimer: 'Resolved Within SLA',
          history: newHistory,
          messages: newMessages,
          lastActivity: 'Resolved',
          lastActivityBy: 'Super Admin',
        };
      }
      return t;
    });

    setTickets(updated);
    if (selectedTicket && selectedTicket.id === targetId) {
      setSelectedTicket(updated.find((t) => t.id === targetId));
    }
    setResolvingTicket(null);
    setResolutionSummary('');
    setUserFacingMessage('');
    showToast('Complaint resolved successfully.', 'success');
  };

  const handleConfirmClose = () => {
    const targetId = closingTicket.id;
    const updated = tickets.map((t) => {
      if (t.id === targetId) {
        const newHistory = [
          {
            action: 'Ticket Closed',
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(t.history || []),
        ];
        return { ...t, status: 'Closed', history: newHistory, lastActivity: 'Closed', lastActivityBy: 'Super Admin' };
      }
      return t;
    });

    setTickets(updated);
    if (selectedTicket && selectedTicket.id === targetId) {
      setSelectedTicket(updated.find((t) => t.id === targetId));
    }
    setClosingTicket(null);
    showToast('Ticket closed successfully.', 'info');
  };

  const handleConfirmReopen = () => {
    if (!reopenReason.trim()) {
      showToast('Reopen reason is required.', 'error');
      return;
    }
    const targetId = reopeningTicket.id;
    const updated = tickets.map((t) => {
      if (t.id === targetId) {
        const newHistory = [
          {
            action: `Ticket Reopened (${reopenReason})`,
            date: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            actor: 'Super Admin',
          },
          ...(t.history || []),
        ];
        return { ...t, status: 'Investigating', history: newHistory, lastActivity: 'Reopened', lastActivityBy: 'Super Admin' };
      }
      return t;
    });

    setTickets(updated);
    if (selectedTicket && selectedTicket.id === targetId) {
      setSelectedTicket(updated.find((t) => t.id === targetId));
    }
    setReopeningTicket(null);
    setReopenReason('');
    showToast('Ticket reopened successfully.', 'info');
  };

  const handleSendPublicReply = async () => {
    if (!publicReplyText.trim() || !selectedTicket) return;
    const targetId = selectedTicket.id;
    const replyContent = publicReplyText.trim();
    const timeStr = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    try {
      await fetch(`${API_BASE_URL}/support/tickets/${targetId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: 'Super Admin',
          senderRole: 'admin',
          message: replyContent
        })
      });
    } catch (e) {
      console.warn('Backend send reply error:', e);
    }

    const updated = tickets.map((t) => {
      if (t.id === targetId) {
        const newMsgs = [...(t.messages || []), { sender: 'Super Admin Support Desk', type: 'admin', text: replyContent, time: timeStr }];
        return { ...t, messages: newMsgs, lastActivity: 'Admin replied', lastActivityBy: 'Super Admin' };
      }
      return t;
    });

    setTickets(updated);
    setSelectedTicket(updated.find((t) => t.id === targetId));
    setPublicReplyText('');
    showToast('Public response sent to user.', 'success');
  };

  const handleSaveInternalNote = () => {
    if (!internalNoteText.trim() || !selectedTicket) return;
    const targetId = selectedTicket.id;
    const timeStr = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const updated = tickets.map((t) => {
      if (t.id === targetId) {
        const newNotes = [...(t.internalNotes || []), { sender: 'Super Admin', text: internalNoteText, time: timeStr }];
        return { ...t, internalNotes: newNotes };
      }
      return t;
    });

    setTickets(updated);
    setSelectedTicket(updated.find((t) => t.id === targetId));
    setInternalNoteText('');
    showToast('Internal note saved.', 'info');
  };

  const handleExportCSV = () => {
    if (filteredTickets.length === 0) {
      showToast('No ticket records available to export.', 'error');
      return;
    }
    const headers = ['Ticket ID', 'Type', 'Raised By', 'Complaint Against', 'Subject', 'Category', 'Priority', 'Status', 'Assigned Admin', 'Created Date'];
    const rows = filteredTickets.map((t) => [
      t.ticketCode,
      t.ticketType,
      `"${t.raisedBy.business.replace(/"/g, '""')}"`,
      `"${t.against.businessName.replace(/"/g, '""')}"`,
      `"${t.subject.replace(/"/g, '""')}"`,
      t.category,
      t.priority,
      t.status,
      t.assignedAdmin,
      t.createdDate,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Complaints_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported Support Tickets CSV.', 'success');
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
              <MessageSquare className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-extrabold text-[#071B3A] tracking-tight">Complaints & Support</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage complaints, disputes and support tickets.</p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            onClick={() => {
              loadData();
              showToast('Refreshed support tickets.', 'info');
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/70 rounded-xl transition-colors cursor-pointer active:scale-95"
            title="Refresh Tickets"
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
        <div onClick={() => setActiveTab('Open')} className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-blue-700">{openCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Open</div>
          </div>
        </div>

        <div onClick={() => setActiveTab('Assigned')} className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-purple-700">{assignedCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Assigned</div>
          </div>
        </div>

        <div onClick={() => setActiveTab('Investigating')} className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-amber-700">{investigatingCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Investigating</div>
          </div>
        </div>

        <div onClick={() => setActiveTab('Escalated')} className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-rose-700">{escalatedCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Escalated</div>
          </div>
        </div>

        <div onClick={() => setActiveTab('Resolved')} className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-emerald-700">{resolvedCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Resolved</div>
          </div>
        </div>

        <div onClick={() => setAssignedAdminFilter('Unassigned')} className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <HelpCircle className="w-4 h-4 text-slate-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-slate-800">{unassignedCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Unassigned</div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Status Tabs & Filters */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ticket ID, subject, user, business or phone..."
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

          {/* Primary Status Tabs & Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 shrink-0">
              {['All', 'Open', 'Assigned', 'Investigating', 'Escalated', 'Resolved', 'Closed'].map((t) => {
                const isActive = activeTab === t;
                const count = t === 'All' ? tickets.length : tickets.filter((tk) => tk.status === t).length;
                return (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive ? 'bg-[#071B3A] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <span>{t}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>{count}</span>
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

        {/* Expandable More Filters Panel */}
        <AnimatePresence>
          {showMoreFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-slate-100 pt-3 mt-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Priority</label>
                  <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]">
                    <option value="All">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Category</label>
                  <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]">
                    <option value="All">All Categories</option>
                    <option value="Delivery Issue">Delivery Issue</option>
                    <option value="Manpower Issue">Manpower Issue</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Service Quality">Service Quality</option>
                    <option value="Marketing Service Issue">Marketing Issue</option>
                    <option value="Product Quality">Product Quality</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Raised By Type</label>
                  <select value={raisedByTypeFilter} onChange={(e) => setRaisedByTypeFilter(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]">
                    <option value="All">All Account Types</option>
                    <option value="HoReCa Owner">HoReCa Owner</option>
                    <option value="Raw Material Vendor">Raw Material Vendor</option>
                    <option value="Manpower Agency">Manpower Agency</option>
                    <option value="Service Provider">Service Provider</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Assigned Admin</label>
                  <select value={assignedAdminFilter} onChange={(e) => setAssignedAdminFilter(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]">
                    <option value="All">All Admins</option>
                    <option value="Admin Rahul">Admin Rahul</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Unassigned">Unassigned Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">SLA Status</label>
                  <select value={slaStatusFilter} onChange={(e) => setSlaStatusFilter(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2 focus:outline-none focus:border-[#071B3A]">
                    <option value="All">All SLA States</option>
                    <option value="On Track">On Track</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Met">Met / Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Date Range</label>
                  <div className="flex items-center gap-1">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-1/2 text-[10px] font-semibold border border-slate-200 bg-slate-50 rounded-lg p-1" />
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-1/2 text-[10px] font-semibold border border-slate-200 bg-slate-50 rounded-lg p-1" />
                  </div>
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
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto w-full">
          <table className="w-full min-w-[1100px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">Ticket</th>
                <th className="py-3.5 px-4">Raised By</th>
                <th className="py-3.5 px-4">Complaint Against</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Assigned Admin</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Activity</th>
                <th className="py-3.5 px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-20 mb-1" />
                      <div className="h-2 bg-slate-100 rounded w-16" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-28 mb-1" />
                      <div className="h-2 bg-slate-100 rounded w-20" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-28 mb-1" />
                      <div className="h-2 bg-slate-100 rounded w-16" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-40" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-slate-200 rounded w-16" />
                    </td>
                    <td className="p-4">
                      <div className="h-4 bg-slate-200 rounded w-20" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-slate-200 rounded w-20" />
                    </td>
                    <td className="p-4">
                      <div className="h-3 bg-slate-200 rounded w-20" />
                    </td>
                    <td className="p-4 text-center">
                      <div className="h-8 bg-slate-200 rounded-lg w-24 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : paginatedTickets.length > 0 ? (
                paginatedTickets.map((t) => {
                  // Priority Badge Styling
                  let prioClass = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (t.priority === 'Low') prioClass = 'bg-blue-50 text-blue-700 border-blue-200';
                  else if (t.priority === 'Medium') prioClass = 'bg-slate-100 text-slate-800 border-slate-300';
                  else if (t.priority === 'High') prioClass = 'bg-amber-50 text-amber-800 border-amber-200';
                  else if (t.priority === 'Urgent') prioClass = 'bg-rose-50 text-rose-800 border-rose-200 font-extrabold';

                  // Status Badge Styling
                  let statusClass = 'bg-blue-50 text-blue-800 border-blue-200';
                  if (t.status === 'Assigned') statusClass = 'bg-purple-50 text-purple-800 border-purple-200';
                  else if (t.status === 'Investigating') statusClass = 'bg-amber-50 text-amber-800 border-amber-200';
                  else if (t.status === 'Escalated') statusClass = 'bg-rose-50 text-rose-800 border-rose-200 font-extrabold';
                  else if (t.status === 'Resolved') statusClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  else if (t.status === 'Closed') statusClass = 'bg-slate-100 text-slate-700 border-slate-200';

                  return (
                    <tr key={t.id} onClick={() => handleOpenTicket(t)} className="hover:bg-slate-50/70 transition-colors cursor-pointer group">
                      {/* Ticket Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-extrabold text-[#071B3A] font-mono group-hover:underline">{t.ticketCode}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{t.createdDate}</span>
                        </div>
                      </td>

                      {/* Raised By Column */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-slate-900">{t.raisedBy.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {t.raisedBy.business !== 'N/A' ? `${t.raisedBy.business} · ` : ''}{t.raisedBy.role}{t.raisedBy.city !== 'N/A' ? ` · ${t.raisedBy.city}` : ''}
                        </div>
                      </td>

                      {/* Complaint Against Column */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-slate-900">{t.against.businessName}</div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">{t.against.role}</div>
                      </td>

                      {/* Subject Column */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-bold text-slate-900 line-clamp-1 max-w-[220px]" title={t.subject}>
                          {t.subject}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium line-clamp-1 max-w-[220px] mt-0.5">{t.description}</div>
                      </td>

                      {/* Category Column */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-lg border bg-slate-50 text-slate-700 border-slate-200/80">{t.category}</span>
                      </td>

                      {/* Priority Column */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${prioClass}`}>{t.priority}</span>
                      </td>

                      {/* Assigned Admin Column */}
                      <td className="py-3.5 px-4">
                        {t.assignedAdmin !== 'Unassigned' ? (
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{t.assignedAdmin}</span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAssigningTicket(t);
                            }}
                            className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200/80 cursor-pointer"
                          >
                            + Assign
                          </button>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border ${statusClass}`}>{t.status}</span>
                      </td>

                      {/* Last Activity & SLA Column */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs font-semibold text-slate-700">{t.lastActivity}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                          <span className={t.slaStatus === 'Overdue' ? 'text-rose-600 font-bold' : 'text-slate-500'}>{t.slaTimer}</span>
                        </div>
                      </td>

                      {/* Action Column */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenTicket(t);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#071B3A] bg-slate-100 hover:bg-[#071B3A] hover:text-white rounded-xl transition-all cursor-pointer min-h-[36px] active:scale-95"
                          title="View Ticket"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Ticket</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* Empty State */
                <tr>
                  <td colSpan="10" className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                        <MessageSquare className="w-7 h-7 stroke-[1.5]" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-700">No Complaints Found</h3>
                      <p className="text-xs text-slate-500 max-w-sm">No support tickets match the selected search query or active status filters.</p>
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

        {/* Mobile View (< 768px) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-6 text-center text-xs font-bold text-slate-400 animate-pulse">Loading support tickets...</div>
          ) : paginatedTickets.length > 0 ? (
            paginatedTickets.map((t) => (
              <div key={t.id} onClick={() => handleOpenTicket(t)} className="p-4 space-y-3 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-[#071B3A] bg-slate-100 px-1.5 py-0.5 rounded">{t.ticketCode}</span>
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{t.category}</span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{t.subject}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'}`}>{t.status}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Raised By</span>
                    <span className="font-bold text-slate-800">{t.raisedBy.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Against</span>
                    <span className="font-bold text-slate-800">{t.against.businessName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Priority</span>
                    <span className="font-bold text-slate-800">{t.priority}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Assigned Admin</span>
                    <span className="font-bold text-slate-800">{t.assignedAdmin}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">{t.slaTimer}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenTicket(t);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#071B3A] bg-slate-100 px-3 py-1.5 rounded-lg"
                  >
                    <span>View Ticket</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs font-bold text-slate-400">No support tickets found.</div>
          )}
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-50/80 border-t border-slate-200/80 px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-600 font-semibold">
          <div>
            Showing {filteredTickets.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets
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

      {/* Complaint Details Drawer / Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 z-[9000] flex justify-end">
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTicket(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

            {/* Slide-over Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#071B3A] text-white p-5 border-b border-slate-800 flex justify-between items-start shrink-0">
                <div className="flex gap-3.5 items-start">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-extrabold text-base text-white shrink-0">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-extrabold text-white">{selectedTicket.ticketCode}</h2>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 text-white">{selectedTicket.category}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950">{selectedTicket.priority} Priority</span>
                    </div>
                    <div className="text-xs text-slate-200 font-semibold mt-1 line-clamp-1">{selectedTicket.subject}</div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300 font-medium">
                      <span>Created: {selectedTicket.createdDate}</span>
                      <span>•</span>
                      <span className="text-amber-300 font-bold">{selectedTicket.slaTimer}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => handleCopyId(selectedTicket.id)} className="text-slate-300 hover:text-white text-[11px] flex items-center gap-1 underline cursor-pointer">
                        {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId ? 'Copied' : 'Copy Ticket ID'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <button onClick={() => setSelectedTicket(null)} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Assigned Bar */}
              <div className="bg-slate-50 px-5 py-3 border-b border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-500 font-semibold">Status:</span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md border bg-blue-50 text-blue-800 border-blue-200">{selectedTicket.status}</span>

                  <span className="text-xs text-slate-500 font-semibold ml-2">Assigned To:</span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md border bg-purple-50 text-purple-800 border-purple-200">{selectedTicket.assignedAdmin}</span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedTicket.assignedAdmin === 'Unassigned' && (
                    <button onClick={() => setAssigningTicket(selectedTicket)} className="px-3 py-1.5 text-xs font-bold text-white bg-[#071B3A] rounded-lg cursor-pointer">
                      Assign Admin
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
                  onClick={() => setDetailsTab('conversation')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    detailsTab === 'conversation' ? 'border-[#071B3A] text-[#071B3A]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  2. Conversation & Evidence ({selectedTicket.messages.length})
                </button>
                <button
                  onClick={() => setDetailsTab('resolution')}
                  className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                    detailsTab === 'resolution' ? 'border-[#071B3A] text-[#071B3A]' : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  3. Resolution & History
                </button>
              </div>

              {/* Tab Content Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* TAB 1: OVERVIEW */}
                {detailsTab === 'overview' && (
                  <div className="space-y-5">
                    {/* Compact Case Summary */}
                    <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Priority</span>
                        <span className="font-extrabold text-amber-700 block mt-0.5">{selectedTicket.priority}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Status</span>
                        <span className="font-extrabold text-blue-700 block mt-0.5">{selectedTicket.status}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Assigned Admin</span>
                        <span className="font-extrabold text-purple-700 block mt-0.5">{selectedTicket.assignedAdmin}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">SLA State</span>
                        <span className="font-extrabold text-slate-800 block mt-0.5">{selectedTicket.slaTimer}</span>
                      </div>
                    </div>

                    {/* Raised By vs Complaint Against */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Raised By */}
                      <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-2">
                        <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          Raised By (Complainant)
                        </h3>
                        <div className="text-xs space-y-1.5 pt-1">
                          <div>
                            <span className="font-extrabold text-slate-900 text-sm block">{selectedTicket.raisedBy.name}</span>
                            {selectedTicket.raisedBy.business !== 'N/A' && (
                              <span className="font-bold text-slate-700 text-xs block mt-0.5">{selectedTicket.raisedBy.business}</span>
                            )}
                            <span className="text-[11px] text-slate-500 font-medium">{selectedTicket.raisedBy.role}</span>
                          </div>
                          <div className="text-slate-700 flex items-center gap-1.5 pt-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-medium">{selectedTicket.raisedBy.phone}</span>
                          </div>
                          <div className="text-slate-700 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-medium">{selectedTicket.raisedBy.email}</span>
                          </div>
                          <div className="text-slate-700 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-medium">
                              {selectedTicket.raisedBy.city}{selectedTicket.raisedBy.state !== 'N/A' ? `, ${selectedTicket.raisedBy.state}` : ''}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Complaint Against */}
                      <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-2">
                        <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          Complaint Against (Respondent)
                        </h3>
                        <div className="text-xs space-y-1.5 pt-1">
                          <div>
                            <span className="font-bold text-slate-900 block">{selectedTicket.against.businessName}</span>
                            <span className="text-[11px] text-slate-500">{selectedTicket.against.role}</span>
                          </div>
                          <div className="text-slate-700 flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{selectedTicket.against.phone}</span>
                          </div>
                          <div className="text-slate-700 flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{selectedTicket.against.email}</span>
                          </div>
                          <div className="text-slate-700 flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{selectedTicket.against.city}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Complaint Description */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-2">
                      <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider">Complaint Description</h3>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">{selectedTicket.description}</p>

                      {selectedTicket.relatedEntity && (
                        <div className="pt-2 text-xs flex items-center gap-2">
                          <span className="font-bold text-slate-500">Related {selectedTicket.relatedEntity.type}:</span>
                          <span className="font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{selectedTicket.relatedEntity.id}</span>
                          <span className="text-slate-500 font-medium">({selectedTicket.relatedEntity.details})</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: CONVERSATION & EVIDENCE */}
                {detailsTab === 'conversation' && (
                  <div className="space-y-5">
                    {/* Message Thread */}
                    <div className="bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs flex flex-col">
                      <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 text-xs font-extrabold text-[#071B3A] uppercase tracking-wider">Public Support Conversation Thread</div>

                      <div className="p-4 space-y-3.5 max-h-[320px] overflow-y-auto bg-slate-50/40">
                        {selectedTicket.messages.map((msg, idx) => {
                          const isAdmin = msg.type === 'admin';
                          const isSystem = msg.type === 'system';

                          if (isSystem) {
                            return (
                              <div key={idx} className="flex justify-center my-1">
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200/80 px-3 py-0.5 rounded-full">{msg.text}</span>
                              </div>
                            );
                          }

                          return (
                            <div key={idx} className={`flex flex-col max-w-[85%] ${isAdmin ? 'ml-auto items-end' : 'items-start'}`}>
                              <span className="text-[10px] font-bold text-slate-500 mb-0.5">{msg.sender}</span>
                              <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed shadow-2xs ${isAdmin ? 'bg-[#071B3A] text-white rounded-tr-none' : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none'}`}>{msg.text}</div>
                              <span className="text-[9px] text-slate-400 font-semibold mt-0.5">{msg.time}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Response Input */}
                      <div className="p-3 border-t border-slate-200/80 bg-white space-y-2">
                        <textarea
                          rows={2}
                          placeholder="Type public response to user..."
                          value={publicReplyText}
                          onChange={(e) => setPublicReplyText(e.target.value)}
                          className="w-full text-xs p-2.5 border border-slate-200 bg-slate-50 rounded-xl focus:outline-none focus:border-[#071B3A]"
                        />
                        <div className="flex justify-end gap-2">
                          <button onClick={handleSendPublicReply} className="px-4 py-1.5 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] rounded-xl shadow-2xs cursor-pointer">
                            Send Response
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Evidence & Attachments */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        Evidence & Supporting Attachments ({selectedTicket.attachments.length})
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedTicket.attachments.map((att, idx) => (
                          <div key={idx} className="p-3 border border-slate-200/80 rounded-xl bg-slate-50/50 flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 truncate max-w-[150px]">{att.name}</div>
                                <div className="text-[10px] text-slate-500">
                                  {att.size} • {att.uploader}
                                </div>
                              </div>
                            </div>
                            <button onClick={() => showToast(`Downloading ${att.name}...`, 'info')} className="px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-50 border border-blue-200 rounded-lg cursor-pointer">
                              Download
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: RESOLUTION & HISTORY */}
                {detailsTab === 'resolution' && (
                  <div className="space-y-5">
                    {/* Private Internal Notes */}
                    <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4 space-y-3">
                      <h3 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                        Private Internal Admin Notes (Not visible to users)
                      </h3>

                      <div className="space-y-2">
                        {selectedTicket.internalNotes.map((note, idx) => (
                          <div key={idx} className="p-3 bg-white border border-amber-200/60 rounded-xl text-xs space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-bold text-amber-900">
                              <span>Author: {note.sender}</span>
                              <span className="text-slate-400">{note.time}</span>
                            </div>
                            <p className="text-slate-700 font-medium italic">"{note.text}"</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Add private note for admin team..."
                          value={internalNoteText}
                          onChange={(e) => setInternalNoteText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveInternalNote();
                          }}
                          className="flex-1 text-xs p-2 border border-amber-300/80 bg-white rounded-xl focus:outline-none"
                        />
                        <button onClick={handleSaveInternalNote} className="px-3.5 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl cursor-pointer">
                          Save Note
                        </button>
                      </div>
                    </div>

                    {/* Timeline Activity History */}
                    <div className="bg-white border border-slate-200/80 rounded-xl p-4 space-y-3">
                      <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider">Ticket Lifecycle History</h3>

                      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                        {selectedTicket.history.map((h, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#071B3A] ring-4 ring-white" />
                            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-0.5">
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
                  </div>
                )}
              </div>

              {/* Contextual Action Bar (Footer) */}
              <div className="bg-slate-50 border-t border-slate-200/80 p-4 flex justify-between items-center gap-3 shrink-0">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <span>Status: {selectedTicket.status}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-amber-700">{selectedTicket.slaTimer}</span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedTicket.status === 'Open' && (
                    <button onClick={() => setAssigningTicket(selectedTicket)} className="px-3.5 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] rounded-xl cursor-pointer shadow-2xs">
                      Assign Admin
                    </button>
                  )}

                  {selectedTicket.status === 'Assigned' && (
                    <button onClick={() => handleStartInvestigation(selectedTicket)} className="px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl cursor-pointer shadow-2xs">
                      Start Investigation
                    </button>
                  )}

                  {(selectedTicket.status === 'Investigating' || selectedTicket.status === 'Assigned') && (
                    <>
                      <button onClick={() => setEscalatingTicket(selectedTicket)} className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl cursor-pointer">
                        Escalate
                      </button>
                      <button onClick={() => setResolvingTicket(selectedTicket)} className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer shadow-2xs">
                        Resolve Complaint
                      </button>
                    </>
                  )}

                  {selectedTicket.status === 'Escalated' && (
                    <button onClick={() => setResolvingTicket(selectedTicket)} className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer shadow-2xs">
                      Resolve Complaint
                    </button>
                  )}

                  {selectedTicket.status === 'Resolved' && (
                    <button onClick={() => setClosingTicket(selectedTicket)} className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl cursor-pointer shadow-2xs">
                      Close Ticket
                    </button>
                  )}

                  {selectedTicket.status === 'Closed' && (
                    <button onClick={() => setReopeningTicket(selectedTicket)} className="px-3.5 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl cursor-pointer shadow-2xs">
                      Reopen Ticket
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Assign Admin */}
      <AnimatePresence>
        {assigningTicket && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAssigningTicket(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Assign Ticket</h3>
                  <p className="text-xs text-slate-500 font-medium">{assigningTicket.ticketCode} - {assigningTicket.subject}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Select Support Admin</label>
                  <select value={selectedAdminName} onChange={(e) => setSelectedAdminName(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]">
                    <option value="Admin Rahul">Admin Rahul (Support & Logistics)</option>
                    <option value="Super Admin">Super Admin (Global Control)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                  <select value={selectedDeptName} onChange={(e) => setSelectedDeptName(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]">
                    <option value="Support Helpdesk">Support Helpdesk</option>
                    <option value="Supply Chain & Logistics">Supply Chain & Logistics</option>
                    <option value="Finance & Billing">Finance & Billing</option>
                    <option value="Manpower Desk">Manpower Desk</option>
                    <option value="Technical Operations">Technical Operations</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button onClick={() => setAssigningTicket(null)} className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleConfirmAssign} className="px-4 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] rounded-xl shadow-xs transition-colors cursor-pointer">
                  Assign Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Escalate Complaint */}
      <AnimatePresence>
        {escalatingTicket && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEscalatingTicket(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Escalate Complaint</h3>
                  <p className="text-xs text-slate-500 font-medium">{escalatingTicket.ticketCode}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Escalation Reason <span className="text-rose-500">*</span>
                  </label>
                  <select value={escalationReason} onChange={(e) => setEscalationReason(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-rose-500">
                    <option value="">-- Choose Reason --</option>
                    <option value="SLA Breach Risk">SLA Breach Risk</option>
                    <option value="Vendor Non-Cooperation">Vendor Non-Cooperation</option>
                    <option value="High Payout Dispute">High Payout Dispute</option>
                    <option value="Legal or Compliance Risk">Legal or Compliance Risk</option>
                    <option value="Customer Cancellation Threat">Customer Cancellation Threat</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Escalate To</label>
                  <select value={escalateToRole} onChange={(e) => setEscalateToRole(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-rose-500">
                    <option value="Senior Operations Head">Senior Operations Head</option>
                    <option value="Compliance Officer">Compliance Officer</option>
                    <option value="Finance Director">Finance Director</option>
                    <option value="Tier 3 Super Admin">Tier 3 Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button onClick={() => setEscalatingTicket(null)} className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleConfirmEscalate} className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer">
                  Confirm Escalation
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Resolve Complaint */}
      <AnimatePresence>
        {resolvingTicket && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setResolvingTicket(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Resolve Complaint</h3>
                  <p className="text-xs text-slate-500 font-medium">{resolvingTicket.ticketCode}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Resolution Type</label>
                  <select value={resolutionType} onChange={(e) => setResolutionType(e.target.value)} className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500">
                    <option value="Issue Fixed">Issue Fixed</option>
                    <option value="Refund Provided">Refund Provided</option>
                    <option value="Replacement Dispatched">Replacement Dispatched</option>
                    <option value="Warning Issued to Vendor">Warning Issued to Vendor</option>
                    <option value="No Violation Found">No Violation Found</option>
                    <option value="Account Action Taken">Account Action Taken</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Resolution Summary <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe how the problem was investigated and resolved..."
                    value={resolutionSummary}
                    onChange={(e) => setResolutionSummary(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">User-facing Message</label>
                  <input
                    type="text"
                    placeholder="Public message sent to ticket raiser..."
                    value={userFacingMessage}
                    onChange={(e) => setUserFacingMessage(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button onClick={() => setResolvingTicket(null)} className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleConfirmResolve} className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer">
                  Resolve Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Close Ticket */}
      <AnimatePresence>
        {closingTicket && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setClosingTicket(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Close Ticket?</h3>
                  <p className="text-xs text-slate-500 font-medium">{closingTicket.ticketCode}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">This will officially close the ticket and archive the resolution logs.</p>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button onClick={() => setClosingTicket(null)} className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleConfirmClose} className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-xs transition-colors cursor-pointer">
                  Close Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Reopen Ticket */}
      <AnimatePresence>
        {reopeningTicket && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setReopeningTicket(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" />

            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Reopen Ticket</h3>
                  <p className="text-xs text-slate-500 font-medium">{reopeningTicket.ticketCode}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Reason for Reopening <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. User reported recurring issue..."
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  className="w-full text-xs border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button onClick={() => setReopeningTicket(null)} className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer">
                  Cancel
                </button>
                <button onClick={handleConfirmReopen} className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors cursor-pointer">
                  Reopen Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
