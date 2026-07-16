import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MoreVertical, Plus, Shield, UserX, UserCheck, Key, Eye, Clock, ShieldCheck, Mail } from 'lucide-react';
import { mockDb } from '../../utils/mockDb';

export default function Team() {
  const [admins, setAdmins] = useState([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("Add"); // Add, Edit
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Verification Admin",
    access: [],
    sendInvite: true
  });

  const availableModules = [
    "Verification", "Directory", "Vendors", "Orders", 
    "Requirements", "Complaints", "Categories", "Limits", "Team"
  ];

  useEffect(() => {
    setAdmins(mockDb.getAdmins());
    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const saveAdmins = (updated) => {
    setAdmins(updated);
    mockDb.saveAdmins(updated);
  };

  const showToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  // Summaries
  const totalCount = admins.length;
  const activeCount = admins.filter(a => a.status === 'Active').length;
  const disabledCount = admins.filter(a => a.status === 'Disabled').length;
  const onlineCount = admins.filter(a => a.isOnline).length;
  const pendingCount = admins.filter(a => a.status === 'Pending').length;

  const filteredAdmins = useMemo(() => {
    return admins.filter((a) => {
      const matchSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          a.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === "All" || a.role === roleFilter;
      const matchStatus = statusFilter === "All" || a.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [admins, searchQuery, roleFilter, statusFilter]);

  const handleAction = (e, admin, type) => {
    e.stopPropagation();
    setActiveMenuId(null);
    
    if (type === 'edit') {
      setModalMode("Edit");
      setEditingAdmin(admin);
      setFormData({
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        access: admin.access,
        sendInvite: false
      });
      setIsModalOpen(true);
    } else if (type === 'disable') {
      if (admin.role === 'Super Admin') {
        showToast("Error: Super Admin accounts cannot be disabled.", "error");
        return;
      }
      const updated = admins.map(a => a.id === admin.id ? { ...a, status: 'Disabled', isOnline: false } : a);
      saveAdmins(updated);
      showToast(`${admin.name}'s account disabled.`, "error");
    } else if (type === 'enable') {
      const updated = admins.map(a => a.id === admin.id ? { ...a, status: 'Active' } : a);
      saveAdmins(updated);
      showToast(`${admin.name}'s account enabled.`, "success");
    } else if (type === 'revoke') {
      const updated = admins.map(a => a.id === admin.id ? { ...a, isOnline: false } : a);
      saveAdmins(updated);
      showToast(`All active sessions revoked for ${admin.name}.`, "info");
    }
  };

  const handleOpenAddModal = () => {
    setModalMode("Add");
    setEditingAdmin(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "Verification Admin",
      access: ["Verification"],
      sendInvite: true
    });
    setIsModalOpen(true);
  };

  const handleRoleChange = (role) => {
    let defaultAccess = [];
    if (role === 'Super Admin') defaultAccess = availableModules;
    else if (role === 'Verification Admin') defaultAccess = ["Verification", "Directory", "Vendors"];
    else if (role === 'Operations Admin') defaultAccess = ["Orders", "Requirements", "Categories"];
    else if (role === 'Support Admin') defaultAccess = ["Complaints", "Directory", "Limits"];
    else if (role === 'Read-Only Auditor') defaultAccess = ["Verification", "Directory", "Vendors", "Orders", "Requirements", "Complaints"];
    
    setFormData(prev => ({ ...prev, role, access: defaultAccess }));
  };

  const toggleModuleAccess = (mod) => {
    setFormData(prev => {
      const access = prev.access.includes(mod)
        ? prev.access.filter(m => m !== mod)
        : [...prev.access, mod];
      return { ...prev, access };
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast("Name and Email are required.", "error");
      return;
    }
    
    if (modalMode === 'Add') {
      const newAdmin = {
        id: `ADM-00${admins.length + 1}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        access: formData.access,
        status: "Pending",
        isOnline: false,
        lastLogin: "Never"
      };
      saveAdmins([...admins, newAdmin]);
      showToast(`Invitation sent to ${formData.email}.`, "success");
    } else {
      const updated = admins.map(a => a.id === editingAdmin.id ? { ...a, ...formData } : a);
      saveAdmins(updated);
      showToast(`Admin ${formData.name} updated.`, "success");
    }
    
    setIsModalOpen(false);
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'Super Admin': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Verification Admin': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Operations Admin': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Support Admin': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Read-Only Auditor': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Disabled': return 'bg-rose-50 text-rose-700 border-rose-200 font-bold';
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
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
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Admin Team Management</h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Manage super admins, module access rights, and security.</p>
        </div>
        <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors shadow-sm">
          <Plus size={14} /> Add Admin
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { title: "Total Admins", val: totalCount, col: "text-slate-800", bg: "bg-white" },
          { title: "Active", val: activeCount, col: "text-emerald-700", bg: "bg-emerald-50" },
          { title: "Disabled", val: disabledCount, col: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
          { title: "Online Now", val: onlineCount, col: "text-blue-700", bg: "bg-blue-50" },
          { title: "Pending Invites", val: pendingCount, col: "text-amber-700", bg: "bg-amber-50" },
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
              placeholder="Search by name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-2 focus:outline-none text-slate-600 font-semibold">
            <option value="All">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Verification Admin">Verification Admin</option>
            <option value="Operations Admin">Operations Admin</option>
            <option value="Support Admin">Support Admin</option>
            <option value="Read-Only Auditor">Read-Only Auditor</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-slate-200 bg-slate-50/50 text-xs rounded-xl px-3 py-2 focus:outline-none text-slate-600 font-semibold">
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl overflow-hidden w-full overflow-x-auto min-h-[400px]">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-[10px] uppercase tracking-wider text-slate-500">
              <th className="p-4 font-bold">Admin Profile</th>
              <th className="p-4 font-bold">Role</th>
              <th className="p-4 font-bold">Module Access</th>
              <th className="p-4 font-bold">Last Login</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.length > 0 ? filteredAdmins.map(a => (
              <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-xs text-slate-600 uppercase">
                        {a.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {a.isOnline && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-800">{a.name}</span>
                      <span className="text-[10px] font-medium text-slate-500">{a.email}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getRoleColor(a.role)}`}>
                    {a.role}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {a.access.slice(0, 3).map(mod => (
                      <span key={mod} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                        {mod}
                      </span>
                    ))}
                    {a.access.length > 3 && (
                      <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded border border-slate-200">
                        +{a.access.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1.5">
                    <Clock size={12} className="text-slate-400" />
                    {a.lastLogin}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(a.status)}`}>
                    {a.status}
                  </span>
                </td>
                <td className="p-4 text-center relative" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === a.id ? null : a.id)}
                    className="p-1.5 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors inline-block"
                  >
                    <MoreVertical size={16} />
                  </button>

                  <AnimatePresence>
                    {activeMenuId === a.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        className="absolute right-8 top-8 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2 text-left"
                      >
                        <button onClick={(e) => handleAction(e, a, 'edit')} className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                          <ShieldCheck size={14} /> Edit Role & Access
                        </button>
                        
                        {a.isOnline && (
                          <button onClick={(e) => handleAction(e, a, 'revoke')} className="w-full text-left px-4 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-50 flex items-center gap-2">
                            <Key size={14} /> Revoke Sessions
                          </button>
                        )}
                        
                        <div className="h-px bg-slate-100 my-1 mx-2" />

                        {a.status === 'Disabled' ? (
                          <button onClick={(e) => handleAction(e, a, 'enable')} className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2">
                            <UserCheck size={14} /> Enable Account
                          </button>
                        ) : (
                          <button onClick={(e) => handleAction(e, a, 'disable')} className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                            <UserX size={14} /> Disable Account
                          </button>
                        )}
                        
                        <div className="h-px bg-slate-100 my-1 mx-2" />

                        <button className="w-full text-left px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 flex items-center gap-2">
                          <Eye size={14} /> View Activity Logs
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400 text-xs font-medium">
                  No admins match the search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Admin Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-700" />
                  <h3 className="text-lg font-black text-slate-800">{modalMode === 'Add' ? 'Add New Admin' : 'Edit Admin Access'}</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Basic Info */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Jane Doe"
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="jane@hrchub.com"
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91"
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    />
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Assign Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                    >
                      <option value="Super Admin">Super Admin</option>
                      <option value="Verification Admin">Verification Admin</option>
                      <option value="Operations Admin">Operations Admin</option>
                      <option value="Support Admin">Support Admin</option>
                      <option value="Read-Only Auditor">Read-Only Auditor</option>
                    </select>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <label className="text-[11px] font-bold text-slate-700 block mb-3">Module Permissions</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableModules.map(mod => (
                      <div key={mod} className={`flex items-center gap-2 p-2 rounded-lg border ${formData.access.includes(mod) ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
                        <input
                          type="checkbox"
                          id={`mod-${mod}`}
                          checked={formData.access.includes(mod)}
                          onChange={() => toggleModuleAccess(mod)}
                          disabled={formData.role === 'Super Admin'} // Super Admin always has full access
                          className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor={`mod-${mod}`} className={`text-[11px] font-semibold cursor-pointer ${formData.access.includes(mod) ? 'text-blue-700' : 'text-slate-600'}`}>
                          {mod}
                        </label>
                      </div>
                    ))}
                  </div>
                  {formData.role === 'Super Admin' && <p className="text-[9px] font-bold text-rose-500 mt-2">* Super Admins automatically receive global permission access.</p>}
                </div>

                {modalMode === 'Add' && (
                  <div className="border-t border-slate-100 pt-5 grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Temporary Password</label>
                      <input
                        type="text"
                        value="••••••••••••"
                        disabled
                        className="w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-xs text-slate-400 font-mono cursor-not-allowed"
                      />
                      <p className="text-[9px] font-semibold text-slate-400 mt-1">A secure temporary password will be generated upon creation.</p>
                    </div>

                    <div className="col-span-2 flex items-center gap-2 bg-indigo-50 border border-indigo-100 p-3 rounded-xl mt-2">
                      <input
                        type="checkbox"
                        id="inviteToggle"
                        checked={formData.sendInvite}
                        onChange={(e) => setFormData({...formData, sendInvite: e.target.checked})}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="inviteToggle" className="text-xs font-bold text-indigo-800 cursor-pointer flex items-center gap-2">
                        <Mail size={14} /> Send immediate email invitation to set up account
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors">
                    {modalMode === 'Edit' ? 'Save Changes' : 'Create Admin Account'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
