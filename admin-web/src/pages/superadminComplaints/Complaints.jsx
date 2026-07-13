import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Send, X, AlertCircle } from 'lucide-react';
import { mockDb } from '../../utils/mockDb';

export default function Complaints() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState('');
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState('All');
  const [chatInput, setChatInput] = useState('');
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Load tickets from mockDb
  useEffect(() => {
    const list = mockDb.getTickets();
    setTickets(list);
    if (list.length > 0) {
      setSelectedTicketId(list[0].id);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const activeTicket = useMemo(() => {
    return tickets.find((t) => t.id === selectedTicketId) || tickets[0];
  }, [tickets, selectedTicketId]);

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const updated = tickets.map((t) => {
      if (t.id === selectedTicketId) {
        return {
          ...t,
          comments: [
            ...t.comments,
            {
              sender: "Super Admin",
              text: chatInput,
              time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            }
          ]
        };
      }
      return t;
    });

    setTickets(updated);
    mockDb.saveTickets(updated);
    setChatInput("");
    showToast("Internal note added.", "success");
  };

  const handleSuspendMerchant = (businessName) => {
    // Simulate suspending merchant
    showToast(`${businessName} access has been suspended due to unresolved SLA breach.`, "error");
    
    // Auto mark ticket status as resolved or suspend in localStorage if needed
    const updated = tickets.map(t => {
      if (t.id === selectedTicketId) {
        return { ...t, status: "In Progress" };
      }
      return t;
    });
    setTickets(updated);
    mockDb.saveTickets(updated);
    
    // dispatch storage event for layout updates
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* Toast Overlay */}
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

      {/* Top Stats Banner */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <div className="flex gap-2">
          {["All", "SLA Critical", "Medium", "Low"].map((pri) => (
            <button
              key={pri}
              onClick={() => setTicketPriorityFilter(pri)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                ticketPriorityFilter === pri ? "bg-rose-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {pri} ({pri === "All" ? tickets.length : tickets.filter((t) => t.priority === pri).length})
            </button>
          ))}
        </div>
        <button
          onClick={() => showToast("Exporting ticket resolutions logs...", "info")}
          className="px-4 py-2 border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>

      {/* Split Layout */}
      <div className="flex flex-col gap-6 items-start w-full">
        {/* Full Width Panel: Ticket Queue */}
        <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-4 flex flex-col gap-3 min-h-[500px] w-full">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">Active Tickets</h4>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[460px]" style={{ scrollbarWidth: "none" }}>
            {tickets
              .filter((t) => ticketPriorityFilter === "All" || t.priority === ticketPriorityFilter)
              .map((t) => {
                const isSelected = selectedTicketId === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => { setSelectedTicketId(t.id); setIsComplaintModalOpen(true); }}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all hover:border-rose-400 flex items-center gap-3 ${
                      isSelected ? "bg-rose-50/20 border-rose-400 shadow-sm" : "bg-white border-slate-100 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[9px] font-mono font-bold text-slate-400">{t.id}</span>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border ${
                          t.priority === "SLA Critical" ? "bg-rose-50 border-rose-200/40 text-rose-700" :
                          t.priority === "Medium" ? "bg-amber-50 border-amber-200/40 text-amber-700" :
                          "bg-blue-50 border-blue-200/40 text-blue-700"
                        }`}>
                          {t.priority}
                        </span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-800 mt-2 truncate">{t.raisedBy}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1 truncate">{t.issueType}</p>
                      <div className="flex justify-between text-[9px] text-slate-400 mt-2.5">
                        <span>{t.assignedTo}</span>
                        <span className="font-bold">{t.status}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicketId(t.id);
                          setIsComplaintModalOpen(true);
                        }}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-colors ${
                          isSelected ? "bg-rose-600 text-white shadow-sm" : "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100"
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

        {/* Right Panel: Chat Box Modal */}
        <AnimatePresence>
          {isComplaintModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsComplaintModalOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white border border-slate-200/60 shadow-2xl rounded-2xl p-6 w-full max-w-4xl flex flex-col justify-between relative z-10 max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setIsComplaintModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>

                {activeTicket ? (
                  <>
                    <div className="flex flex-col gap-5 mt-2">
                      <div className="flex justify-between items-start border-b border-slate-100 pb-4 pr-8">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-mono font-bold bg-slate-100 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full self-start">
                            {activeTicket.id}
                          </span>
                          <h3 className="font-black text-slate-800 text-base mt-1.5">{activeTicket.issueType}</h3>
                          <p className="text-[10px] text-slate-400 font-semibold">Raised by: {activeTicket.raisedBy} · {activeTicket.date}</p>
                        </div>
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border ${
                          activeTicket.priority === "SLA Critical" ? "bg-rose-50 border-rose-200/40 text-rose-700" :
                          activeTicket.priority === "Medium" ? "bg-amber-50 border-amber-200/40 text-amber-700" :
                          "bg-blue-50 border-blue-200/40 text-blue-700"
                        }`}>
                          {activeTicket.priority}
                        </span>
                      </div>

                      <div className="bg-[#F3F4F6] border border-slate-200/60 rounded-xl p-4">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Issue Details</span>
                        <p className="text-xs text-slate-700 leading-relaxed font-semibold mt-1">
                          {activeTicket.description}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto bg-slate-50/50 p-4 border border-slate-100 rounded-xl" style={{ scrollbarWidth: "thin" }}>
                        {activeTicket.comments.map((comment, i) => {
                          const isSelf = comment.sender === "Super Admin";
                          const isSystem = comment.sender === "System";
                          return (
                            <div
                              key={i}
                              className={`flex flex-col max-w-[85%] ${
                                isSelf ? "self-end items-end" : isSystem ? "self-center items-center w-full max-w-none text-center" : "self-start items-start"
                              }`}
                            >
                              {isSystem ? (
                                <span className="text-[9px] text-slate-400 font-bold bg-slate-100 border border-slate-200 px-3 py-1 rounded-full my-1">
                                  {comment.text}
                                </span>
                              ) : (
                                <>
                                  <span className="text-[9px] font-bold text-slate-400 mb-0.5">{comment.sender} · {comment.time}</span>
                                  <div className={`px-3.5 py-2.5 rounded-2xl text-xs font-semibold leading-relaxed ${
                                    isSelf ? "bg-[#1E40AF] text-white rounded-tr-none shadow-sm" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm"
                                  }`}>
                                    {comment.text}
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-5 flex flex-col gap-3">
                      <form onSubmit={handleSendComment} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type internal response note..."
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          className="flex-1 px-4 py-2.5 border border-slate-200 bg-[#F3F4F6] focus:bg-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/10 flex items-center justify-center"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                        <span>Note visible only to internal staff replica</span>
                        <button
                          type="button"
                          onClick={() => handleSuspendMerchant(activeTicket.raisedBy)}
                          className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-bold rounded-lg shadow-sm transition-colors"
                        >
                          Suspend Merchant Access
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-xs py-20">
                    Select a ticket from the queue
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
