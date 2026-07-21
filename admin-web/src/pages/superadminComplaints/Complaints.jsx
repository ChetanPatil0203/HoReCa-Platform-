import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Mail, FileText, CheckCircle, AlertTriangle, X, MoreVertical, Building, Eye, Clock, MessageSquare, Paperclip, Activity, Zap, Flag, Download, Users, RefreshCw } from 'lucide-react';
import { mockDb } from '../../utils/mockDb';

export default function Complaints() {
  const [tickets, setTickets] = useState([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [raisedByFilter, setRaisedByFilter] = useState("All");
  const [assignedAdminFilter, setAssignedAdminFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Drawer & Tab States
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [drawerTab, setDrawerTab] = useState("Overview");

  // Interaction Dialog States
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);

  // Assign Admin Form
  const [selectedAdmin, setSelectedAdmin] = useState("Sarah Connor");
  const [selectedDept, setSelectedDept] = useState("Support");
  const [assignPriority, setAssignPriority] = useState("Medium");
  const [assignNote, setAssignNote] = useState("");

  // Resolve Ticket Form
  const [resSummary, setResSummary] = useState("");
  const [resAction, setResAction] = useState("");
  const [refundRequired, setRefundRequired] = useState(false);
  const [notifyUser, setNotifyUser] = useState(true);

  // Active UI Helpers
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Chat & Note Inputs in Drawer
  const [replyText, setReplyText] = useState("");
  const [newNoteText, setNewNoteText] = useState("");

  useEffect(() => {
    setTickets(mockDb.getTickets());
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const showToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  // Summaries
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const criticalCount = tickets.filter(t => t.priority === 'SLA Critical').length;
  const assignedCount = tickets.filter(t => t.assignedTo !== 'Unassigned').length;
  const investigatingCount = tickets.filter(t => t.status === 'Investigating' || t.status === 'In Progress').length;
  const escalatedCount = tickets.filter(t => t.status === 'Escalated').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
  const unassignedCount = tickets.filter(t => t.assignedTo === 'Unassigned').length;

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchPriority = priorityFilter === "All" || t.priority === priorityFilter;
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      const matchCategory = categoryFilter === "All" || t.category === categoryFilter;

      let matchRaisedBy = true;
      if (raisedByFilter !== "All") {
        matchRaisedBy = t.raisedBy?.role === raisedByFilter;
      }

      let matchAssignedAdmin = true;
      if (assignedAdminFilter !== "All") {
        matchAssignedAdmin = t.assignedTo === assignedAdminFilter;
      }

      let matchDate = true;
      if (startDate || endDate) {
        const tDate = new Date(t.date);
        if (startDate) {
          const sDate = new Date(startDate);
          sDate.setHours(0, 0, 0, 0);
          if (tDate < sDate) matchDate = false;
        }
        if (endDate) {
          const eDate = new Date(endDate);
          eDate.setHours(23, 59, 59, 999);
          if (tDate > eDate) matchDate = false;
        }
      }

      const query = searchQuery.toLowerCase();
      const matchQuery =
        !searchQuery ||
        (t.id && t.id.toLowerCase().includes(query)) ||
        (t.raisedBy?.name && t.raisedBy.name.toLowerCase().includes(query)) ||
        (t.raisedBy?.business && t.raisedBy.business.toLowerCase().includes(query)) ||
        (t.against?.name && t.against.name.toLowerCase().includes(query)) ||
        (t.against?.businessName && t.against.businessName.toLowerCase().includes(query)) ||
        (t.subject && t.subject.toLowerCase().includes(query)) ||
        (t.raisedBy?.phone && t.raisedBy.phone.toLowerCase().includes(query)) ||
        (t.against?.phone && t.against.phone.toLowerCase().includes(query));

      return matchPriority && matchStatus && matchCategory && matchRaisedBy && matchAssignedAdmin && matchDate && matchQuery;
    });
  }, [tickets, priorityFilter, statusFilter, categoryFilter, raisedByFilter, assignedAdminFilter, startDate, endDate, searchQuery]);

  const activeTicket = useMemo(() => tickets.find(t => t.id === selectedTicketId), [tickets, selectedTicketId]);

  const handleAssignAdminSubmit = () => {
    if (!selectedTicketId) return;
    const updated = tickets.map(t => {
      if (t.id === selectedTicketId) {
        const timestamp = new Date().toLocaleString();
        const nextTimeline = [
          ...t.timeline,
          { status: "Assigned", time: timestamp, note: `Assigned to admin ${selectedAdmin}. Dept: ${selectedDept}. Note: ${assignNote}` }
        ];
        return {
          ...t,
          assignedTo: selectedAdmin,
          status: "Assigned",
          priority: assignPriority,
          timeline: nextTimeline
        };
      }
      return t;
    });
    setTickets(updated);
    mockDb.saveTickets(updated);
    setAssignModalOpen(false);
    setAssignNote("");
    showToast(`Assigned to ${selectedAdmin} successfully.`, "success");
    window.dispatchEvent(new Event('storage'));
  };

  const handleResolveTicketSubmit = () => {
    if (!selectedTicketId) return;
    if (!resSummary.trim()) {
      showToast("Resolution summary is required", "error");
      return;
    }
    const updated = tickets.map(t => {
      if (t.id === selectedTicketId) {
        const timestamp = new Date().toLocaleString();
        const nextTimeline = [
          ...t.timeline,
          { status: "Resolved", time: timestamp, note: `Resolved. Summary: ${resSummary}. Action: ${resAction}. Refund: ${refundRequired ? 'Yes' : 'No'}` }
        ];
        return {
          ...t,
          status: "Resolved",
          resolutionSummary: resSummary,
          timeline: nextTimeline
        };
      }
      return t;
    });
    setTickets(updated);
    mockDb.saveTickets(updated);
    setResolveModalOpen(false);
    setResSummary("");
    setResAction("");
    showToast("Complaint resolved successfully.", "success");
    window.dispatchEvent(new Event('storage'));
  };

  const handleCloseTicketDirect = (ticketId) => {
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        const timestamp = new Date().toLocaleString();
        const nextTimeline = [
          ...t.timeline,
          { status: "Closed", time: timestamp, note: "Ticket closed by super admin." }
        ];
        return { ...t, status: "Closed", timeline: nextTimeline };
      }
      return t;
    });
    setTickets(updated);
    mockDb.saveTickets(updated);
    showToast("Ticket closed successfully.", "info");
    window.dispatchEvent(new Event('storage'));
  };

  const handleEscalateDirect = (ticketId) => {
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        const timestamp = new Date().toLocaleString();
        const nextTimeline = [
          ...t.timeline,
          { status: "Escalated", time: timestamp, note: "Ticket escalated to Tier 3 Super Admin." }
        ];
        return { ...t, status: "Escalated", priority: "SLA Critical", timeline: nextTimeline };
      }
      return t;
    });
    setTickets(updated);
    mockDb.saveTickets(updated);
    showToast("Ticket escalated to SLA Critical.", "error");
    window.dispatchEvent(new Event('storage'));
  };

  const handleUpdateStatus = (ticketId, nextStatus) => {
    const updated = tickets.map(t => {
      if (t.id === ticketId) {
        const timestamp = new Date().toLocaleString();
        const nextTimeline = [
          ...t.timeline,
          { status: nextStatus, time: timestamp, note: `Status updated to ${nextStatus}` }
        ];
        return { ...t, status: nextStatus, timeline: nextTimeline };
      }
      return t;
    });
    setTickets(updated);
    mockDb.saveTickets(updated);
    showToast(`Status updated to ${nextStatus}`, "info");
    window.dispatchEvent(new Event('storage'));
  };

  const handleAddNote = () => {
    if (!newNoteText.trim() || !selectedTicketId) return;
    const updated = tickets.map(t => {
      if (t.id === selectedTicketId) {
        const timestamp = new Date().toLocaleString();
        const newNotes = [
          ...t.internalNotes,
          { sender: "Super Admin", text: newNoteText, time: timestamp }
        ];
        return { ...t, internalNotes: newNotes };
      }
      return t;
    });
    setTickets(updated);
    mockDb.saveTickets(updated);
    setNewNoteText("");
    showToast("Internal note saved.", "success");
    window.dispatchEvent(new Event('storage'));
  };

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedTicketId) return;
    const updated = tickets.map(t => {
      if (t.id === selectedTicketId) {
        const timestamp = new Date().toLocaleString();
        const newMsgs = [
          ...t.messages,
          { sender: "Super Admin", type: "admin", text: replyText, time: timestamp }
        ];
        return { ...t, messages: newMsgs };
      }
      return t;
    });
    setTickets(updated);
    mockDb.saveTickets(updated);
    setReplyText("");
    showToast("Reply sent to user.", "success");
    window.dispatchEvent(new Event('storage'));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'SLA Critical': return 'bg-rose-50 text-rose-700 border-rose-200/50 font-extrabold';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200/50 font-bold';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200/50 font-semibold';
      case 'Low': return 'bg-blue-50 text-blue-700 border-blue-200/50';
      default: return 'bg-slate-50 text-slate-700 border-slate-200/50';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-blue-50 text-blue-700 border-blue-200/50';
      case 'Assigned': return 'bg-purple-50 text-purple-700 border-purple-200/50';
      case 'In Progress': return 'bg-indigo-50 text-indigo-700 border-indigo-200/50';
      case 'Investigating': return 'bg-amber-50 text-amber-700 border-amber-200/50';
      case 'Waiting for User': return 'bg-orange-50 text-orange-700 border-orange-200/50';
      case 'Escalated': return 'bg-rose-50 text-rose-700 border-rose-200/50 font-black';
      case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
      case 'Closed': return 'bg-slate-100 text-slate-700 border-slate-300/50';
      default: return 'bg-slate-50 text-slate-700 border-slate-200/50';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Delivery Issue': return 'bg-blue-50/70 text-blue-700 border-blue-100';
      case 'Payment Issue': return 'bg-emerald-50/70 text-emerald-700 border-emerald-100';
      case 'Product Quality': return 'bg-amber-50/70 text-amber-700 border-amber-100';
      case 'Vendor Issue': return 'bg-rose-50/70 text-rose-700 border-rose-100';
      case 'Manpower Issue': return 'bg-purple-50/70 text-purple-700 border-purple-100';
      case 'Service Issue': return 'bg-indigo-50/70 text-indigo-700 border-indigo-100';
      case 'Marketing Issue': return 'bg-pink-50/70 text-pink-700 border-pink-100';
      case 'Account Issue': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const renderSlaTime = (t) => {
    if (t.status === 'Resolved' || t.status === 'Closed') {
      return <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200/40 px-2 py-0.5 rounded-full">🟢 Met</span>;
    }
    if (t.priority === 'SLA Critical' || t.status === 'Escalated') {
      return <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 border border-rose-200/40 px-2 py-0.5 rounded-full animate-pulse">🔴 Overdue by 20m</span>;
    }
    const timer = t.slaTimer;
    if (!timer || timer === "00:00:00") {
      return <span className="text-[10px] font-bold text-slate-400">N/A</span>;
    }
    const parts = timer.split(":");
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);

    let displayText = "";
    if (hours > 0) displayText += `${hours}h `;
    if (minutes > 0) displayText += `${minutes}m `;
    displayText += "Remaining";

    let colorClass = "text-emerald-700 bg-emerald-50 border-emerald-200/40";
    if (hours < 2) {
      colorClass = "text-orange-700 bg-orange-50 border-orange-200/40";
    }
    if (hours === 0 && minutes < 60) {
      colorClass = "text-rose-700 bg-rose-50 border-rose-200/40 font-black animate-pulse";
    }

    return (
      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${colorClass}`}>
        {displayText}
      </span>
    );
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
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white backdrop-blur-md pointer-events-auto ${toast.type === "success" ? "border-emerald-500/20 text-emerald-800" :
                  toast.type === "error" ? "border-rose-500/20 text-rose-800" : "border-blue-500/20 text-blue-800"
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
            <MessageSquare size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Complaints & Support</h1>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">Manage disputes, support tickets, and track SLAs.</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { title: "Open Tickets", val: openCount, col: "text-blue-700", bg: "bg-blue-50" },
          { title: "Assigned", val: assignedCount, col: "text-purple-700", bg: "bg-purple-50" },
          { title: "Investigating", val: investigatingCount, col: "text-amber-700", bg: "bg-amber-50" },
          { title: "Escalated", val: escalatedCount, col: "text-orange-700", bg: "bg-orange-50" },
          { title: "Resolved", val: resolvedCount, col: "text-emerald-700", bg: "bg-emerald-50" },
          { title: "Unassigned Tickets", val: unassignedCount, col: "text-slate-700", bg: "bg-slate-50" },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-xl border border-slate-200/60 shadow-sm ${s.bg}`}>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{s.title}</span>
            <div className={`text-lg font-black truncate ${s.col}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col gap-4 bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search ID, Subject, User, Business, Phone..."
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
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden w-full overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse min-w-[1300px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-500">
              <th className="p-4 font-bold">Complaint ID & Date</th>
              <th className="p-4 font-bold">Raised By</th>
              <th className="p-4 font-bold">Complaint Against</th>
              <th className="p-4 font-bold">Subject</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold">Assigned Admin</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? (
              filteredTickets.map(t => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded w-max">{t.id}</span>
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><Clock size={10} /> {t.date}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-800">{t.raisedBy?.business || 'Unknown'}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{t.raisedBy?.role} • {t.raisedBy?.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-800">{t.against?.businessName || t.against?.name}</span>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">{t.against?.role || t.against?.type}</span>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-bold text-slate-700 max-w-[200px] truncate" title={t.subject}>
                    {t.subject}
                  </td>
                  <td className="p-4 text-xs font-bold text-slate-700">
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-md border ${getCategoryColor(t.category)}`}>
                      {t.category}
                    </span>
                  </td>
                  <td className="p-4 text-xs font-semibold text-slate-700">
                    {t.assignedTo !== "Unassigned" ? (
                      <span className="font-bold text-blue-700">🔵 {t.assignedTo}</span>
                    ) : (
                      <span className="italic text-slate-400">⚫ Unassigned</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${getStatusColor(t.status)}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-4 text-center relative" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === t.id ? null : t.id)}
                      className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors inline-block"
                    >
                      <MoreVertical size={16} />
                    </button>

                    <AnimatePresence>
                      {activeMenuId === t.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 5 }}
                          className="absolute right-8 top-8 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2 text-left"
                        >
                          <button onClick={() => { setSelectedTicketId(t.id); setDrawerTab("Overview"); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                            <Eye size={14} /> View Complaint
                          </button>
                          <button onClick={() => { setSelectedTicketId(t.id); setAssignModalOpen(true); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                            <Users size={14} /> Assign Admin
                          </button>
                          <button
                            onClick={() => {
                              const nextStatus = t.status === 'Open' ? 'In Progress' : 'Open';
                              handleUpdateStatus(t.id, nextStatus);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <RefreshCw size={14} /> Update Status
                          </button>
                          <button onClick={() => { handleEscalateDirect(t.id); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                            <Zap size={14} /> Escalate
                          </button>
                          <button onClick={() => { setSelectedTicketId(t.id); setResolveModalOpen(true); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                            <CheckCircle size={14} /> Resolve
                          </button>
                          <button onClick={() => { handleCloseTicketDirect(t.id); setActiveMenuId(null); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2">
                            <X size={14} /> Close Ticket
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
                    <MessageSquare size={48} className="text-slate-300 stroke-[1.5]" />
                    <span className="text-xs font-black text-slate-500">No Complaints Found</span>
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

      {/* Right Side Drawer */}
      <AnimatePresence>
        {selectedTicketId && activeTicket && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setSelectedTicketId(null)}
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
                    <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${activeTicket.priority === 'SLA Critical' ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h2 className="font-black text-slate-800 text-sm">{activeTicket.id}</h2>
                      <span className="text-[10px] text-slate-400 font-bold">{activeTicket.category}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedTicketId(null)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
                    <X size={18} />
                  </button>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white px-4 border-b border-slate-100 flex gap-2 flex-shrink-0">
                  {["Overview", "Conversation", "Notes", "Activity"].map((tab) => (
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
                      {/* Ticket Information */}
                      <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-xs">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Ticket Information</h4>
                        <div className="grid grid-cols-2 gap-3 text-xs font-medium text-slate-600">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Complaint ID</span>
                            <span className="font-bold text-slate-800">{activeTicket.id}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Category</span>
                            <span className="font-bold text-slate-800">{activeTicket.category}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Status</span>
                            <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded border mt-0.5 ${getStatusColor(activeTicket.status)}`}>{activeTicket.status}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Raised Date</span>
                            <span className="font-bold text-slate-700">{activeTicket.date}</span>
                          </div>
                        </div>
                      </div>

                      {/* Raised By */}
                      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Raised By Details</h4>
                        <div className="grid grid-cols-2 gap-3 text-xs font-medium text-slate-600">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Business Name</span>
                            <span className="font-bold text-slate-800">{activeTicket.raisedBy?.business}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Owner / Vendor Name</span>
                            <span className="font-bold text-slate-800">{activeTicket.raisedBy?.name}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Role</span>
                            <span className="font-bold text-slate-800">{activeTicket.raisedBy?.role || "Owner"}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Phone</span>
                            <span className="font-bold text-slate-800">{activeTicket.raisedBy?.phone}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Email & City</span>
                            <span className="font-bold text-slate-700">{activeTicket.raisedBy?.email || "N/A"} • {activeTicket.raisedBy?.city || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Complaint Against */}
                      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Complaint Against Details</h4>
                        <div className="grid grid-cols-2 gap-3 text-xs font-medium text-slate-600">
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Business Name</span>
                            <span className="font-bold text-slate-800">{activeTicket.against?.businessName || activeTicket.against?.name}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Role</span>
                            <span className="font-bold text-slate-800">{activeTicket.against?.role || activeTicket.against?.type}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">Phone & Email</span>
                            <span className="font-bold text-slate-700">{activeTicket.against?.phone || "N/A"} • {activeTicket.against?.email || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Complaint Details */}
                      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs space-y-2">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Complaint Details</h4>
                        <div className="text-xs font-medium text-slate-600">
                          <span className="text-[9px] text-slate-400 font-bold block uppercase">Subject</span>
                          <span className="font-bold text-slate-800 block mb-2">{activeTicket.subject}</span>

                          <span className="text-[9px] text-slate-400 font-bold block uppercase">Description</span>
                          <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-medium leading-relaxed italic">
                            "{activeTicket.description}"
                          </p>
                        </div>
                        {activeTicket.relatedEntity && (
                          <div className="pt-1 flex gap-2 text-xs">
                            <span className="text-[9px] text-slate-400 font-bold uppercase">Related Order ID:</span>
                            <span className="font-bold text-indigo-600">{activeTicket.relatedEntity.id}</span>
                          </div>
                        )}
                      </div>

                      {/* Attachments */}
                      <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Evidence & Attachments</h4>
                        {activeTicket.evidence && activeTicket.evidence.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {activeTicket.evidence.map((file, idx) => (
                              <div key={idx} className="border border-slate-100 rounded-lg p-2.5 bg-slate-50 flex flex-col justify-between gap-2 shadow-xs">
                                <div className="flex gap-2 items-center">
                                  <div className="w-8 h-8 rounded bg-slate-200 flex items-center justify-center text-slate-500 flex-shrink-0">
                                    <FileText size={16} />
                                  </div>
                                  <div className="truncate flex-1">
                                    <span className="text-[10px] font-bold text-slate-700 block truncate">{file.name}</span>
                                    <span className="text-[8px] text-slate-400 block">{file.size}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => showToast(`Downloading ${file.name}...`, "success")}
                                  className="w-full py-1 border border-slate-200 hover:bg-slate-100 text-blue-600 font-bold text-[9px] rounded flex items-center justify-center gap-1 bg-white"
                                >
                                  <Download size={10} /> Download
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-xs text-slate-400 font-medium border border-dashed border-slate-200 rounded-lg">
                            No evidence files uploaded.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {drawerTab === "Conversation" && (
                    <div className="flex flex-col h-[400px] border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-xs">
                      {/* Thread Messages */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50" style={{ scrollbarWidth: "thin" }}>
                        {activeTicket.messages && activeTicket.messages.map((msg, idx) => {
                          const isSys = msg.type === "system";
                          const isAdmin = msg.type === "admin";
                          if (isSys) {
                            return (
                              <div key={idx} className="flex flex-col items-center my-1.5">
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 border border-slate-200 px-3 py-0.5 rounded-full text-center max-w-[280px]">
                                  {msg.text}
                                </span>
                              </div>
                            );
                          }
                          return (
                            <div key={idx} className={`flex flex-col max-w-[85%] ${isAdmin ? "self-end items-end ml-auto" : "self-start items-start"}`}>
                              <span className="text-[9px] font-bold text-slate-400 mb-0.5">{msg.sender}</span>
                              <div className={`p-2.5 rounded-2xl text-[11px] font-semibold leading-relaxed shadow-xs ${isAdmin
                                  ? "bg-blue-600 text-white rounded-tr-none"
                                  : "bg-white border border-slate-200/80 text-slate-700 rounded-tl-none"
                                }`}>
                                {msg.text}
                              </div>
                              <span className="text-[8px] text-slate-400 font-bold mt-0.5">{msg.time}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Reply Box Footer */}
                      <div className="p-3 border-t border-slate-100 bg-white">
                        <div className="flex gap-2">
                          <button onClick={() => showToast("Attaching file...", "info")} className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-400 rounded-xl transition-colors flex items-center justify-center">
                            <Paperclip size={14} />
                          </button>
                          <input
                            type="text"
                            placeholder="Type reply to user..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSendReply(); }}
                            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                          />
                          <button
                            onClick={handleSendReply}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm animate-pulse-subtle"
                          >
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {drawerTab === "Notes" && (
                    <div className="space-y-4">
                      {/* Notes Box input */}
                      <div className="bg-yellow-50 border border-yellow-200/60 p-4 rounded-xl shadow-xs space-y-3">
                        <h4 className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider">Add Internal Admin Note</h4>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add private note (visible to admins only)..."
                            value={newNoteText}
                            onChange={(e) => setNewNoteText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleAddNote(); }}
                            className="flex-1 border border-yellow-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-yellow-500 bg-white font-medium text-slate-700"
                          />
                          <button
                            onClick={handleAddNote}
                            className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-xl text-xs font-bold shadow-sm"
                          >
                            Save
                          </button>
                        </div>
                      </div>

                      {/* Notes List */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Internal Admin Notes History</h4>
                        {activeTicket.internalNotes && activeTicket.internalNotes.length > 0 ? (
                          activeTicket.internalNotes.map((note, idx) => (
                            <div key={idx} className="bg-yellow-50/30 border border-yellow-100 rounded-lg p-3 space-y-1 relative shadow-xs">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-slate-800">{note.sender}</span>
                                <span className="text-[8px] text-slate-400 font-bold">{note.time}</span>
                              </div>
                              <p className="text-xs text-slate-600 font-medium italic">
                                "{note.text}"
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 rounded-lg border border-slate-100">
                            No internal notes added yet.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {drawerTab === "Activity" && (
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Timeline Activity Logs</h4>
                      <div className="relative border-l border-slate-200 ml-3 flex flex-col gap-5 pt-2 pb-2">
                        {activeTicket.timeline && activeTicket.timeline.map((evt, idx) => (
                          <div key={idx} className="relative pl-5">
                            <span className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white" />
                            <div className="flex flex-col text-xs">
                              <span className="font-black text-slate-800">{evt.status}</span>
                              <span className="text-[9px] font-bold text-slate-400 mt-0.5">{evt.time}</span>
                              <p className="text-[10px] font-semibold text-slate-500 mt-1 leading-relaxed">{evt.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Quick Actions */}
                <div className="bg-slate-50 border-t border-slate-100 p-4 flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => setAssignModalOpen(true)}
                    className="flex-1 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Assign Admin
                  </button>
                  <button
                    onClick={() => {
                      const next = activeTicket.status === 'Open' ? 'In Progress' : 'Open';
                      handleUpdateStatus(activeTicket.id, next);
                    }}
                    className="flex-1 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => handleEscalateDirect(activeTicket.id)}
                    className="flex-1 py-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Escalate
                  </button>
                  <button
                    onClick={() => setResolveModalOpen(true)}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors animate-pulse-subtle"
                  >
                    Resolve
                  </button>
                  <button
                    onClick={() => handleCloseTicketDirect(activeTicket.id)}
                    className="flex-1 py-2 bg-slate-850 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Close Ticket
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Assign Admin Modal */}
      <AnimatePresence>
        {assignModalOpen && activeTicket && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setAssignModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 space-y-4"
            >
              <div>
                <h3 className="text-base font-black text-slate-800">Assign Ticket Admin</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Assign ticket <span className="font-bold text-slate-700">{activeTicket.id}</span> to a support engineer.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Select Admin</label>
                  <select
                    value={selectedAdmin}
                    onChange={(e) => setSelectedAdmin(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                  >
                    <option value="Sarah Connor">Sarah Connor (Super Admin)</option>
                    <option value="John Smith">John Smith (Verification Admin)</option>
                    <option value="Neha Mathews">Neha Mathews (Support Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Department</label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold text-slate-700"
                  >
                    <option value="Support">Support Helpdesk</option>
                    <option value="Finance">Finance & Billing</option>
                    <option value="Logistics">Supply Chain & Logistics</option>
                    <option value="Manpower">Manpower Agency Desk</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Internal Note</label>
                  <textarea
                    value={assignNote}
                    onChange={(e) => setAssignNote(e.target.value)}
                    placeholder="Specify special instructions for this ticket..."
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[60px] resize-none text-slate-700 font-medium"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignAdminSubmit}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors w-full shadow-sm"
                >
                  Assign Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Resolve Ticket Modal */}
      <AnimatePresence>
        {resolveModalOpen && activeTicket && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setResolveModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 space-y-4"
            >
              <div>
                <h3 className="text-base font-black text-slate-800">Resolve Complaint</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Submit resolution data for ticket <span className="font-bold text-slate-700">{activeTicket.id}</span>.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Resolution Summary (Required)</label>
                  <textarea
                    value={resSummary}
                    onChange={(e) => setResSummary(e.target.value)}
                    placeholder="Describe how the problem was resolved..."
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[60px] resize-none text-slate-700 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Actions Taken</label>
                  <input
                    type="text"
                    value={resAction}
                    onChange={(e) => setResAction(e.target.value)}
                    placeholder="e.g. Refund issued, Replacement dispatched..."
                    className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-700 font-semibold"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">Refund Required</span>
                    <span className="text-[8px] text-slate-400 font-semibold uppercase">Finance payouts trigger</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={refundRequired}
                    onChange={(e) => setRefundRequired(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-200"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-700">Notify User</span>
                    <span className="text-[8px] text-slate-400 font-semibold uppercase">Email & SMS dispatch</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyUser}
                    onChange={(e) => setNotifyUser(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setResolveModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveTicketSubmit}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors w-full shadow-sm"
                >
                  Resolve Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
