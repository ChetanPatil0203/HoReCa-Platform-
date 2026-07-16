import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Phone, Mail, FileText, CheckCircle, AlertTriangle, X, MoreVertical, Building, Eye, Clock, MessageSquare, Paperclip, Activity, Zap, Flag, Download } from 'lucide-react';
import { mockDb } from '../../utils/mockDb';

export default function Complaints() {
  const [tickets, setTickets] = useState([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // State
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [toasts, setToasts] = useState([]);
  
  // Prompt State
  const [promptState, setPromptState] = useState(null); // { type: 'note' | 'resolve' | 'escalate' | 'priority' | 'evidence', ticket: obj }
  const [promptText, setPromptText] = useState("");

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
  const assignedCount = tickets.filter(t => t.status === 'Assigned').length;
  const investigationCount = tickets.filter(t => t.status === 'Under Investigation').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length;
  const escalatedCount = tickets.filter(t => t.status === 'Escalated').length;

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchPriority = priorityFilter === "All" || t.priority === priorityFilter;
      const matchStatus = statusFilter === "All" || t.status === statusFilter;
      const matchCategory = categoryFilter === "All" || t.category === categoryFilter;
      const query = searchQuery.toLowerCase();
      const matchQuery =
        t.id?.toLowerCase().includes(query) ||
        t.raisedBy?.business?.toLowerCase().includes(query) ||
        t.against?.name?.toLowerCase().includes(query);
      return matchPriority && matchStatus && matchCategory && matchQuery;
    });
  }, [tickets, priorityFilter, statusFilter, categoryFilter, searchQuery]);

  const activeTicket = useMemo(() => tickets.find(t => t.id === selectedTicketId), [tickets, selectedTicketId]);

  const handleAction = (e, ticket, type) => {
    e.stopPropagation();
    setActiveMenuId(null);
    
    if (type === 'view') {
      setSelectedTicketId(ticket.id);
    } else {
      setPromptState({ type, ticket });
    }
  };

  const submitPrompt = () => {
    if (!promptText.trim() && (promptState.type === 'note' || promptState.type === 'resolve')) {
      showToast("Input is required.", "error");
      return;
    }
    
    if (promptState.type === 'resolve') {
      showToast(`Complaint ${promptState.ticket.id} resolved. Summary saved.`, "success");
    } else if (promptState.type === 'escalate') {
      showToast(`Complaint ${promptState.ticket.id} escalated successfully.`, "error");
    } else if (promptState.type === 'priority') {
      showToast(`Priority updated for ${promptState.ticket.id}`, "info");
    } else if (promptState.type === 'evidence') {
      showToast(`Requested additional evidence for ${promptState.ticket.id}`, "info");
    } else {
      showToast(`Internal note added to ${promptState.ticket.id}`, "success");
    }
    
    setPromptState(null);
    setPromptText("");
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'SLA Critical': return 'bg-rose-50 text-rose-700 border-rose-200 font-extrabold';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Low': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Assigned': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Under Investigation': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Waiting for User': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Escalated': return 'bg-rose-50 text-rose-700 border-rose-200 font-extrabold';
      case 'Resolved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
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
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white backdrop-blur-md pointer-events-auto ${
                toast.type === "success" ? "border-emerald-500/20 text-emerald-800" : 
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

      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Complaints & Support</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Manage disputes, support tickets, and track SLAs.</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm">
          <Download size={14} /> Export Logs
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { title: "Open Tickets", val: openCount, col: "text-blue-700", bg: "bg-blue-50" },
          { title: "SLA Critical", val: criticalCount, col: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
          { title: "Assigned", val: assignedCount, col: "text-purple-700", bg: "bg-purple-50" },
          { title: "Investigating", val: investigationCount, col: "text-amber-700", bg: "bg-amber-50" },
          { title: "Escalated", val: escalatedCount, col: "text-orange-700", bg: "bg-orange-50" },
          { title: "Resolved", val: resolvedCount, col: "text-emerald-700", bg: "bg-emerald-50" },
        ].map((s, i) => (
          <div key={i} className={`p-4 rounded-xl border border-slate-200/60 shadow-sm ${s.bg}`}>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">{s.title}</span>
            <div className={`text-lg font-black truncate ${s.col}`}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Complaint ID, Raised By, Against..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-2 focus:outline-none text-slate-600 font-semibold">
            <option value="All">All Priorities</option>
            <option value="SLA Critical">SLA Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-2 focus:outline-none text-slate-600 font-semibold">
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Assigned">Assigned</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Waiting for User">Waiting for User</option>
            <option value="Escalated">Escalated</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-2 focus:outline-none text-slate-600 font-semibold">
            <option value="All">All Categories</option>
            <option value="Payment Delay">Payment Delay</option>
            <option value="Wrong Item Delivered">Wrong Item Delivered</option>
            <option value="Agency No-Show">Agency No-Show</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden w-full overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse min-w-[1300px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-500">
              <th className="p-4 font-bold">Complaint ID & Date</th>
              <th className="p-4 font-bold">Priority</th>
              <th className="p-4 font-bold">Raised By</th>
              <th className="p-4 font-bold">Complaint Against</th>
              <th className="p-4 font-bold">Related Entity</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold">Assigned Admin</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.length > 0 ? filteredTickets.map(t => (
              <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-black text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded w-max">{t.id}</span>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1"><Clock size={10} /> {t.date?.split(',')[0]}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1 items-start">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(t.priority)}`}>
                      {t.priority}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">{t.slaTimer}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800">{t.raisedBy?.business || 'Unknown'}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{t.raisedBy?.name || 'Unknown'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-slate-800">{t.against?.name || 'Unknown'}</span>
                    <span className="text-[9px] text-slate-400 font-mono bg-slate-100 px-1 rounded w-max">{t.against?.type || 'Unknown'}</span>
                  </div>
                </td>
                <td className="p-4">
                  {t.relatedEntity ? (
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded">
                      {t.relatedEntity.type}: {t.relatedEntity.id}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic text-[10px]">None</span>
                  )}
                </td>
                <td className="p-4 text-xs font-bold text-slate-700">{t.category}</td>
                <td className="p-4 text-xs font-medium text-slate-600">
                  {t.assignedTo !== "Unassigned" ? <span className="font-bold text-blue-700">{t.assignedTo}</span> : <span className="italic text-slate-400">Unassigned</span>}
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(t.status)}`}>
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
                        className="absolute right-8 top-8 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2 text-left"
                      >
                        <button onClick={(e) => handleAction(e, t, 'view')} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                          <Eye size={14} /> View Details
                        </button>
                        
                        <div className="h-px bg-slate-100 my-1 mx-2" />

                        <button onClick={(e) => handleAction(e, t, 'note')} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                          <FileText size={14} /> Add Internal Note
                        </button>
                        <button onClick={(e) => handleAction(e, t, 'evidence')} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                          <Paperclip size={14} /> Request Evidence
                        </button>
                        <button onClick={(e) => handleAction(e, t, 'priority')} className="w-full text-left px-4 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                          <Activity size={14} /> Change Priority
                        </button>
                        
                        <div className="h-px bg-slate-100 my-1 mx-2" />

                        <button onClick={(e) => handleAction(e, t, 'escalate')} className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                          <Zap size={14} /> Escalate Ticket
                        </button>
                        <button onClick={(e) => handleAction(e, t, 'resolve')} className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                          <CheckCircle size={14} /> Resolve & Close
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="9" className="p-8 text-center text-slate-400 text-xs font-medium">
                  No complaints found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Action Prompt Dialog */}
      <AnimatePresence>
        {promptState && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setPromptState(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10"
            >
              <h3 className="text-lg font-black text-slate-800 text-center mb-1">
                {promptState.type === 'resolve' ? 'Resolve Complaint' : 
                 promptState.type === 'escalate' ? 'Escalate Complaint' :
                 promptState.type === 'priority' ? 'Change Priority' :
                 promptState.type === 'evidence' ? 'Request Evidence' : 'Add Note'}
              </h3>
              <p className="text-xs text-slate-500 text-center mb-6">
                Action on ticket <span className="font-bold text-slate-800">{promptState.ticket.id}</span>
              </p>
              
              <div className="mb-6">
                {(promptState.type === 'note' || promptState.type === 'resolve' || promptState.type === 'evidence') && (
                  <>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      {promptState.type === 'resolve' ? 'Resolution Summary (Required)' : 
                       promptState.type === 'evidence' ? 'Message to User' : 'Internal Note'}
                    </label>
                    <textarea
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder={promptState.type === 'resolve' ? 'Explain how this issue was resolved...' : 'Type note here...'}
                      className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
                    />
                  </>
                )}

                {(promptState.type === 'escalate') && (
                  <p className="text-xs text-rose-600 font-bold p-3 bg-rose-50 rounded-xl border border-rose-100 text-center">
                    This will alert the Super Admin tier immediately and set priority to SLA Critical.
                  </p>
                )}

                {(promptState.type === 'priority') && (
                  <select className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold">
                    <option>SLA Critical</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button onClick={() => { setPromptState(null); setPromptText(''); }} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors w-full">Cancel</button>
                <button onClick={submitPrompt} className={`px-4 py-2 text-xs font-bold text-white rounded-lg transition-colors w-full ${promptState.type === 'escalate' ? 'bg-rose-600 hover:bg-rose-700' : promptState.type === 'resolve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Comprehensive Details Modal */}
      <AnimatePresence>
        {activeTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedTicketId(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-[#F8FAFC] shadow-2xl rounded-2xl w-full max-w-6xl flex flex-col relative z-10 max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-white px-6 py-4 border-b border-slate-200 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${activeTicket.priority === 'SLA Critical' ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 text-lg flex items-center gap-2">
                      {activeTicket.id}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityColor(activeTicket.priority)} uppercase tracking-wider`}>
                        {activeTicket.priority}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(activeTicket.status)} uppercase tracking-wider`}>
                        {activeTicket.status}
                      </span>
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> Created: {activeTicket.date} | SLA Timer: <span className="text-slate-600 font-mono">{activeTicket.slaTimer}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={(e) => handleAction(e, activeTicket, 'resolve')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm">
                    Resolve
                  </button>
                  <button onClick={() => setSelectedTicketId(null)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6" style={{ scrollbarWidth: "thin" }}>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  
                  {/* Left Column: Context & Evidence */}
                  <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Related Entity */}
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                      <h4 className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Related Entity</h4>
                      <span className="text-xs font-black text-indigo-700 flex items-center gap-1">
                        <FileText size={14}/> {activeTicket.relatedEntity ? `${activeTicket.relatedEntity.type}: ${activeTicket.relatedEntity.id}` : 'None'}
                      </span>
                    </div>

                    {/* Entities involved */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
                      <div>
                        <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Building size={12}/> Raised By</h4>
                        <span className="text-xs font-bold text-slate-800 block">{activeTicket.raisedBy?.business || 'Unknown'}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{activeTicket.raisedBy?.name || 'Unknown'} - {activeTicket.raisedBy?.phone || 'No phone'}</span>
                      </div>
                      <div className="h-px bg-slate-100" />
                      <div>
                        <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1"><Flag size={12}/> Complaint Against</h4>
                        <span className="text-xs font-bold text-slate-800 block">{activeTicket.against?.name || 'Unknown'}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{activeTicket.against?.type || 'Unknown'} {activeTicket.against?.id ? `(${activeTicket.against.id})` : ''}</span>
                      </div>
                    </div>

                    {/* Evidence */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Paperclip size={14}/> Evidence & Attachments</h4>
                      {activeTicket.evidence.length > 0 ? (
                        <div className="flex flex-col gap-2">
                          {activeTicket.evidence.map((ev, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                              <span className="text-xs font-semibold text-slate-700 truncate">{ev.name}</span>
                              <span className="text-[9px] font-bold text-slate-400">{ev.size}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-xs text-slate-400 font-medium bg-slate-50 rounded-lg border border-dashed border-slate-200">
                          No evidence attached.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle Column: Chat & Description */}
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    {/* Description */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Original Complaint ({activeTicket.category})</h4>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">{activeTicket.description}</p>
                    </div>

                    {/* Messages Panel */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden min-h-[300px]">
                      <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50">
                        <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2"><MessageSquare size={14}/> Communication Thread</h4>
                      </div>
                      
                      <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-4 bg-slate-50/30" style={{ scrollbarWidth: "thin" }}>
                        {activeTicket.messages.map((msg, idx) => {
                          const isSys = msg.type === 'system';
                          const isAdmin = msg.type === 'admin';
                          
                          if (isSys) {
                            return (
                              <div key={idx} className="self-center flex flex-col items-center my-2">
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 text-center max-w-sm leading-relaxed">{msg.text}</span>
                                <span className="text-[8px] text-slate-400 font-bold mt-1">{msg.time}</span>
                              </div>
                            );
                          }
                          
                          return (
                            <div key={idx} className={`flex flex-col max-w-[80%] ${isAdmin ? "self-end items-end" : "self-start items-start"}`}>
                              <span className="text-[9px] font-bold text-slate-400 mb-1">{msg.sender}</span>
                              <div className={`p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-sm ${
                                isAdmin 
                                  ? "bg-blue-600 text-white rounded-tr-none" 
                                  : "bg-white border border-slate-200 text-slate-700 rounded-tl-none"
                              }`}>
                                {msg.text}
                              </div>
                              <span className="text-[8px] text-slate-400 font-bold mt-1">{msg.time}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="p-4 border-t border-slate-100 bg-white">
                        <div className="flex gap-2">
                          <input type="text" placeholder="Reply to user..." className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm">Send</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Internal Notes & Timeline */}
                  <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Internal Notes */}
                    <div className="bg-yellow-50/50 p-5 rounded-xl border border-yellow-200 shadow-sm flex flex-col max-h-[300px]">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider flex items-center gap-1"><FileText size={14}/> Internal Notes</h4>
                        <button className="text-xs font-bold text-yellow-700 hover:underline" onClick={(e) => handleAction(e, activeTicket, 'note')}>+ Add</button>
                      </div>
                      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3" style={{ scrollbarWidth: "thin" }}>
                        {activeTicket.internalNotes.length > 0 ? activeTicket.internalNotes.map((note, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-lg border border-yellow-100 shadow-sm">
                            <span className="text-[9px] font-black text-slate-800">{note.sender}</span>
                            <p className="text-[11px] text-slate-600 mt-1 font-medium italic">"{note.text}"</p>
                            <span className="text-[8px] font-bold text-slate-400 mt-2 block">{note.time}</span>
                          </div>
                        )) : (
                          <span className="text-xs text-yellow-600/50 font-medium text-center italic mt-4">No internal notes.</span>
                        )}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1">
                      <h4 className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-5 border-b border-slate-100 pb-2">SLA Timeline</h4>
                      <div className="relative border-l-2 border-slate-200 ml-3 flex flex-col gap-5 pt-2 pb-2">
                        {activeTicket.timeline.map((evt, idx) => (
                          <div key={idx} className="relative pl-5">
                            <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-white" />
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-slate-800">{evt.status}</span>
                              <span className="text-[9px] font-bold text-slate-400 mt-0.5">{evt.time}</span>
                              <p className="text-[10px] font-medium text-slate-600 mt-1 leading-relaxed">{evt.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
