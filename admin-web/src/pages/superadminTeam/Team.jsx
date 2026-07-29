import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserCheck, UserX, Clock, Plus, Search, X, Eye, RefreshCw, EllipsisVertical as MoreVertical, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Mail, Phone, Building2, Check, SlidersHorizontal, Shield, ShieldCheck, Lock, ChevronRight, Send, Trash2 } from 'lucide-react';
import { fetchAdminTeam } from '../../services/api.service';

const INITIAL_MOCK_ADMINS = [];

const AVAILABLE_MODULES = [
  'Dashboard',
  'Verification',
  'HoReCa Directory',
  'Vendor Network',
  'Complaints & Support',
  'Status & Limits',
  'Reports',
  'Settings',
];

const AVAILABLE_ROLES = [
  'Super Admin',
  'Verification Admin',
  'Support Admin',
  'Operations Admin',
  'Finance Admin',
  'Read-Only Auditor',
];

export default function Team() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter States
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Active' | 'Disabled' | 'Pending Invite'
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Interactive UI States
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Add Admin Modal State ("Invite New Admin")
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteRole, setInviteRole] = useState('Verification Admin');
  const [inviteModules, setInviteModules] = useState(['Verification', 'HoReCa Directory', 'Vendor Network']);
  const [inviteMessage, setInviteMessage] = useState('');

  // Edit Admin Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editRole, setEditRole] = useState('Verification Admin');
  const [editStatus, setEditStatus] = useState('Active');
  const [editModules, setEditModules] = useState([]);

  // Remove Confirmation Modal
  const [removingAdmin, setRemovingAdmin] = useState(null);

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminTeam();
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map((u, idx) => ({
          id: u.id || `ADM-00${idx + 1}`,
          name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || 'Admin User',
          email: u.email || 'admin@hrchub.com',
          phone: u.mobile || u.phone || '+91 9856320427',
          role: u.role === 'superadmin' ? 'Super Admin' : 'Verification Admin',
          department: u.department || 'Operations',
          status: u.status === 'suspended' ? 'Disabled' : u.status === 'pending' ? 'Pending Invite' : 'Active',
          isOnline: u.isOnline || false,
          lastLogin: u.lastLogin || 'Today · 08:45 AM',
          addedOn: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '24 Jul 2026',
          access: u.access || ['Dashboard', 'Verification', 'HoReCa Directory', 'Vendor Network'],
          createdBy: 'Super Admin',
          security: {
            twoFactorStatus: 'Enabled',
            passwordLastChanged: '15 Jun 2026',
            failedLoginAttempts: 0,
            lastLoginDevice: 'Chrome Browser',
            lastLoginIp: '103.22.41.12',
            activeSessions: 1,
          },
          activity: [{ action: 'Account Verified & Synchronized', module: 'System', time: 'Today' }],
        }));

        setAdmins(mapped);
      } else {
        setAdmins([]);
      }
    } catch (err) {
      console.warn('API error fetching admin team:', err);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Summary Metrics
  const totalCount = admins.length;
  const activeCount = admins.filter((a) => a.status === 'Active' || a.status === 'Online').length;
  const disabledCount = admins.filter((a) => a.status === 'Disabled').length;
  const onlineCount = admins.filter((a) => a.isOnline || a.status === 'Online').length;
  const pendingCount = admins.filter((a) => a.status === 'Pending Invite').length;

  // Filter Logic
  const filteredAdmins = useMemo(() => {
    return admins.filter((a) => {
      // Primary Tab Filter
      let matchTab = true;
      if (activeTab === 'Active') matchTab = a.status === 'Active' || a.status === 'Online';
      else if (activeTab === 'Disabled') matchTab = a.status === 'Disabled';
      else if (activeTab === 'Pending Invite') matchTab = a.status === 'Pending Invite';

      // Dropdown Filters
      const matchRole = roleFilter === 'All' || a.role === roleFilter;
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;

      // Search Query
      const q = searchQuery.trim().toLowerCase();
      const matchQuery =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q);

      return matchTab && matchRole && matchStatus && matchQuery;
    });
  }, [admins, activeTab, roleFilter, statusFilter, searchQuery]);

  const hasActiveFilters = searchQuery !== '' || activeTab !== 'All' || roleFilter !== 'All' || statusFilter !== 'All';

  const resetFilters = () => {
    setActiveTab('All');
    setSearchQuery('');
    setRoleFilter('All');
    setStatusFilter('All');
  };

  // Add Admin Submission ("Invite New Admin")
  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      showToast('Please provide Full Name and Email Address.', 'error');
      return;
    }

    const newId = `ADM-00${admins.length + 1}`;
    const timestampShort = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    const newAdminRecord = {
      id: newId,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      phone: invitePhone.trim() || '+91 9800000000',
      role: inviteRole,
      department: 'Operations',
      status: 'Pending Invite',
      isOnline: false,
      lastLogin: 'Never',
      addedOn: timestampShort,
      access: inviteModules,
      createdBy: 'Super Admin',
      security: {
        twoFactorStatus: 'Disabled',
        passwordLastChanged: 'Never',
        failedLoginAttempts: 0,
        lastLoginDevice: 'N/A',
        lastLoginIp: 'N/A',
        activeSessions: 0,
      },
      activity: [{ action: 'Invitation Link Sent to Email', module: 'Settings', time: `${timestampShort}, Just now` }],
    };

    setAdmins((prev) => [newAdminRecord, ...prev]);
    showToast(`Admin invitation sent to ${inviteEmail}.`, 'success');
    setAddModalOpen(false);

    // Reset Form
    setInviteName('');
    setInviteEmail('');
    setInvitePhone('');
    setInviteRole('Verification Admin');
    setInviteModules(['Verification', 'HoReCa Directory', 'Vendor Network']);
    setInviteMessage('');
  };

  // Edit Admin Submission
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingAdmin) return;

    const updated = admins.map((a) => {
      if (a.id === editingAdmin.id) {
        return {
          ...a,
          role: editRole,
          status: editStatus,
          isOnline: editStatus === 'Online',
          access: editModules,
        };
      }
      return a;
    });

    setAdmins(updated);
    if (selectedAdmin && selectedAdmin.id === editingAdmin.id) {
      setSelectedAdmin(updated.find((x) => x.id === editingAdmin.id));
    }
    setEditModalOpen(false);
    showToast(`Updated admin role and permissions for ${editingAdmin.name}.`, 'success');
  };

  // Toggle Disable / Reactivate Admin
  const handleToggleDisable = (adminItem) => {
    if (adminItem.role === 'Super Admin' && (adminItem.status === 'Active' || adminItem.status === 'Online')) {
      showToast('Super Admin primary account cannot be disabled.', 'error');
      return;
    }

    const isCurrentlyDisabled = adminItem.status === 'Disabled';
    const newStatus = isCurrentlyDisabled ? 'Active' : 'Disabled';

    const updated = admins.map((a) => {
      if (a.id === adminItem.id) {
        return { ...a, status: newStatus, isOnline: newStatus === 'Active' ? a.isOnline : false };
      }
      return a;
    });

    setAdmins(updated);
    if (selectedAdmin && selectedAdmin.id === adminItem.id) {
      setSelectedAdmin(updated.find((x) => x.id === adminItem.id));
    }
    showToast(`${adminItem.name} account is now ${newStatus}.`, 'info');
  };

  // Resend Invite
  const handleResendInvite = (adminItem) => {
    showToast(`Invitation email resent successfully to ${adminItem.email}.`, 'success');
  };

  // Remove Admin Confirmation
  const handleConfirmRemove = () => {
    if (!removingAdmin) return;
    if (removingAdmin.role === 'Super Admin') {
      showToast('Super Admin account cannot be removed.', 'error');
      setRemovingAdmin(null);
      return;
    }

    const updated = admins.filter((a) => a.id !== removingAdmin.id);
    setAdmins(updated);
    if (selectedAdmin && selectedAdmin.id === removingAdmin.id) {
      setSelectedAdmin(null);
    }
    showToast(`${removingAdmin.name} removed from admin team.`, 'success');
    setRemovingAdmin(null);
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

      {/* Final Page Header (Normal background, no dark hero banner) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#071B3A] text-white flex items-center justify-center font-bold shadow-xs">
              <Users className="w-4.5 h-4.5" />
            </div>
            <h1 className="text-xl font-extrabold text-[#071B3A] tracking-tight">Admin Team</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage administrator accounts, roles and module access.</p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            onClick={() => {
              loadData();
              showToast('Refreshed admin team records.', 'info');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-xl transition-all cursor-pointer active:scale-95"
            title="Refresh Admin List"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              setInviteName('');
              setInviteEmail('');
              setInvitePhone('');
              setInviteRole('Verification Admin');
              setInviteModules(['Verification', 'HoReCa Directory', 'Vendor Network']);
              setInviteMessage('');
              setAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Admin</span>
          </button>
        </div>
      </div>

      {/* Compact Horizontal Summary Strip (1 White Container, ~72-84px height) */}
      <div className="bg-white border border-[#E3E9F1] rounded-2xl shadow-xs p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 gap-y-3 sm:gap-y-0">
        <div
          onClick={() => setActiveTab('All')}
          className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors"
          title="View All Admins"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#071B3A] flex items-center justify-center font-bold shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-[#071B3A]">{totalCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Total Admins</div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('Active')}
          className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors"
          title="View Active Admins"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
            <UserCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-emerald-700">{activeCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Active</div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('Disabled')}
          className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors"
          title="View Disabled Admins"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold shrink-0">
            <UserX className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-rose-700">{disabledCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Disabled</div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('Active')}
          className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors"
          title="View Online Admins"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold shrink-0">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-blue-700">{onlineCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Online Now</div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('Pending Invite')}
          className="flex items-center gap-3 px-3 py-1 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors col-span-2 sm:col-span-1"
          title="View Pending Invites"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
            <Mail className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-amber-700">{pendingCount}</div>
            <div className="text-[11px] font-medium text-slate-500">Pending Invites</div>
          </div>
        </div>
      </div>

      {/* Toolbar: Status Tabs & Single Compact Search/Filter Row */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs flex flex-col gap-3">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
          {/* Status Tabs (Navy Active background) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none shrink-0">
            {[
              { label: 'All Admins', key: 'All', count: totalCount },
              { label: 'Active', key: 'Active', count: activeCount },
              { label: 'Disabled', key: 'Disabled', count: disabledCount },
              { label: 'Pending Invites', key: 'Pending Invite', count: pendingCount },
            ].map((t) => {
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
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

          {/* Compact Search & Dropdowns Toolbar Row */}
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search admin name, email or phone..."
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

            {/* Role Dropdown */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-white rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#071B3A] transition-colors cursor-pointer shrink-0"
            >
              <option value="All">All Roles</option>
              {AVAILABLE_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold border border-slate-200 bg-slate-50 hover:bg-white rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#071B3A] transition-colors cursor-pointer shrink-0 hidden sm:block"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Online">Online</option>
              <option value="Disabled">Disabled</option>
              <option value="Pending Invite">Pending Invite</option>
            </select>

            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs font-bold text-rose-600 hover:text-rose-700 underline px-1 shrink-0 cursor-pointer">
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Table Container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden flex flex-col">
        {/* Desktop View (7 exact columns, fits without horizontal page scrolling) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 w-[24%]">Admin</th>
                <th className="py-3.5 px-3 w-[16%]">Role</th>
                <th className="py-3.5 px-3 w-[22%]">Module Access</th>
                <th className="py-3.5 px-3 w-[14%]">Last Login</th>
                <th className="py-3.5 px-3 w-[10%]">Status</th>
                <th className="py-3.5 px-3 w-[9%]">Added On</th>
                <th className="py-3.5 px-4 w-[5%] text-center">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200" />
                        <div className="space-y-1">
                          <div className="h-3.5 bg-slate-200 rounded w-28" />
                          <div className="h-2.5 bg-slate-100 rounded w-36" />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-slate-200 rounded w-36" />
                    </td>
                    <td className="p-4">
                      <div className="h-3.5 bg-slate-200 rounded w-24" />
                    </td>
                    <td className="p-4">
                      <div className="h-5 bg-slate-200 rounded w-16" />
                    </td>
                    <td className="p-4">
                      <div className="h-3.5 bg-slate-200 rounded w-20" />
                    </td>
                    <td className="p-4 text-center">
                      <div className="h-8 bg-slate-200 rounded-lg w-20 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredAdmins.length > 0 ? (
                filteredAdmins.map((a) => {
                  const initials = a.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();

                  // Status badge styling
                  let statusClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
                  if (a.status === 'Online') statusClass = 'bg-blue-50 text-blue-800 border-blue-200';
                  else if (a.status === 'Disabled') statusClass = 'bg-rose-50 text-rose-800 border-rose-200 font-extrabold';
                  else if (a.status === 'Pending Invite') statusClass = 'bg-amber-50 text-amber-800 border-amber-200';

                  return (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedAdmin(a)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    >
                      {/* Column 1: Admin Profile */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <div className="w-9 h-9 rounded-full bg-[#071B3A] text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
                              {initials}
                            </div>
                            {a.isOnline && (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-[#071B3A] transition-colors truncate">
                              {a.name}
                            </div>
                            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{a.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Role */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${
                            a.role === 'Super Admin'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : a.role === 'Verification Admin'
                              ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                              : a.role === 'Support Admin'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {a.role}
                        </span>
                      </td>

                      {/* Column 3: Module Access */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          <span className="text-[10px] font-extrabold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                            {a.access.length} Modules
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[170px]" title={a.access.join(' · ')}>
                            {a.access.slice(0, 2).join(' · ')}
                            {a.access.length > 2 ? ` +${a.access.length - 2}` : ''}
                          </span>
                        </div>
                      </td>

                      {/* Column 4: Last Login */}
                      <td className="py-3.5 px-3">
                        <span className="text-xs font-semibold text-slate-700 block truncate">{a.lastLogin}</span>
                      </td>

                      {/* Column 5: Status */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-block text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg border ${statusClass}`}>
                          {a.status}
                        </span>
                      </td>

                      {/* Column 6: Added On */}
                      <td className="py-3.5 px-3">
                        <span className="text-xs font-semibold text-slate-600 block">{a.addedOn}</span>
                      </td>

                      {/* Column 7: Action */}
                      <td className="py-3.5 px-4 text-center relative" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedAdmin(a)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-[#071B3A] bg-slate-100 hover:bg-[#071B3A] hover:text-white rounded-xl transition-all cursor-pointer min-h-[36px]"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          {/* Contextual Dropdown Toggle */}
                          <div className="relative">
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === a.id ? null : a.id)}
                              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                              title="More Options"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuId === a.id && (
                              <div className="absolute right-0 top-8 z-50 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 text-left text-xs font-medium animate-fadeIn">
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    setEditingAdmin(a);
                                    setEditRole(a.role);
                                    setEditStatus(a.status);
                                    setEditModules(a.access);
                                    setEditModalOpen(true);
                                  }}
                                  className="w-full px-3 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-semibold cursor-pointer"
                                >
                                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Edit Role & Access</span>
                                </button>

                                {a.status === 'Pending Invite' ? (
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      handleResendInvite(a);
                                    }}
                                    className="w-full px-3 py-2 text-left text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-semibold cursor-pointer"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                    <span>Resend Invite</span>
                                  </button>
                                ) : a.status === 'Disabled' ? (
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      handleToggleDisable(a);
                                    }}
                                    className="w-full px-3 py-2 text-left text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-semibold cursor-pointer"
                                  >
                                    <UserCheck className="w-3.5 h-3.5" />
                                    <span>Reactivate Admin</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      handleToggleDisable(a);
                                    }}
                                    className="w-full px-3 py-2 text-left text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-semibold cursor-pointer"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                    <span>Disable Admin</span>
                                  </button>
                                )}

                                {a.role !== 'Super Admin' && (
                                  <button
                                    onClick={() => {
                                      setActiveMenuId(null);
                                      setRemovingAdmin(a);
                                    }}
                                    className="w-full px-3 py-2 text-left text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-semibold border-t border-slate-100 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Remove Admin</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                /* Compact Empty State */
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                        <Users className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-800">No admins added yet</h3>
                      <p className="text-xs text-slate-500">Invite an administrator to help manage the platform.</p>
                      <button
                        onClick={() => {
                          setInviteName('');
                          setInviteEmail('');
                          setInvitePhone('');
                          setAddModalOpen(true);
                        }}
                        className="mt-1 px-4 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] rounded-xl transition-colors cursor-pointer shadow-xs"
                      >
                        Add Admin
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile / Narrow View (< 768px Card View) */}
        <div className="block md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-6 text-center text-xs font-bold text-slate-400 animate-pulse">Loading admin team...</div>
          ) : filteredAdmins.length > 0 ? (
            filteredAdmins.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelectedAdmin(a)}
                className="p-4 space-y-3 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{a.name}</h3>
                    <div className="text-xs text-slate-500 font-medium mt-0.5">{a.email}</div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      a.status === 'Active' || a.status === 'Online'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {a.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Role</span>
                    <span className="font-bold text-slate-800">{a.role}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Module Access</span>
                    <span className="font-bold text-slate-800">{a.access.length} Modules</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-slate-400 block font-semibold">Last Login</span>
                    <span className="font-bold text-slate-800">{a.lastLogin}</span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                  <span className="text-[11px] text-slate-400">Added {a.addedOn}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAdmin(a);
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
            <div className="p-8 text-center text-xs font-bold text-slate-400">No admins found matching current filters.</div>
          )}
        </div>
      </div>

      {/* Admin Details Modal */}
      <AnimatePresence>
        {selectedAdmin && (
          <div className="fixed inset-0 z-[9000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAdmin(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-5 space-y-4 z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#071B3A] text-white flex items-center justify-center font-bold text-sm">
                    {selectedAdmin.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{selectedAdmin.name}</h3>
                    <span className="text-xs text-slate-500 font-medium">{selectedAdmin.email}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Details Body */}
              <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Administrative Role</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{selectedAdmin.role}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Account Status</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{selectedAdmin.status}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Mobile Number</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{selectedAdmin.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Department</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{selectedAdmin.department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Last Login Time</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{selectedAdmin.lastLogin}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block">Added On</span>
                    <span className="font-bold text-slate-800 block mt-0.5">{selectedAdmin.addedOn}</span>
                  </div>
                </div>

                {/* Assigned Modules */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Assigned Modules</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAdmin.access.map((mod) => (
                      <span key={mod} className="text-xs font-semibold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200">
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Activity History */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Recent Activity Logs</h4>
                  <div className="space-y-2">
                    {selectedAdmin.activity.map((act, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 text-xs">
                        <div className="font-bold text-slate-900">{act.action}</div>
                        <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                          <span>Module: {act.module}</span>
                          <span>{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    const target = selectedAdmin;
                    setSelectedAdmin(null);
                    setEditingAdmin(target);
                    setEditRole(target.role);
                    setEditStatus(target.status);
                    setEditModules(target.access);
                    setEditModalOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-bold text-[#071B3A] bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Edit Role & Access
                </button>

                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Admin Modal ("Invite New Admin" - NO password creation field) */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#071B3A] text-white flex items-center justify-center font-bold">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Invite New Admin</h3>
                    <p className="text-xs text-slate-500 font-medium">Send an email invitation link to setup access.</p>
                  </div>
                </div>

                <button onClick={() => setAddModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@hrchub.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number</label>
                  <input
                    type="text"
                    placeholder="+91 98563XXXXX"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Admin Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  >
                    {AVAILABLE_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Module Access Permissions <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 max-h-32 overflow-y-auto">
                    {AVAILABLE_MODULES.map((mod) => {
                      const isChecked = inviteModules.includes(mod);
                      return (
                        <label key={mod} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) setInviteModules((prev) => [...prev, mod]);
                              else setInviteModules((prev) => prev.filter((m) => m !== mod));
                            }}
                            className="rounded text-[#071B3A] focus:ring-[#071B3A]"
                          />
                          <span className="text-slate-700 text-[11px] font-semibold">{mod}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Invitation Message (Optional)</label>
                  <input
                    type="text"
                    placeholder="Welcome message for team onboarding..."
                    value={inviteMessage}
                    onChange={(e) => setInviteMessage(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] rounded-xl shadow-xs cursor-pointer"
                  >
                    Send Invitation
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Admin Modal */}
      <AnimatePresence>
        {editModalOpen && editingAdmin && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5 space-y-4 z-10"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Edit Admin Permissions</h3>
                  <p className="text-xs text-slate-500 font-medium">{editingAdmin.name} ({editingAdmin.email})</p>
                </div>
                <button onClick={() => setEditModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Administrative Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  >
                    {AVAILABLE_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Account Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  >
                    <option value="Active">Active</option>
                    <option value="Online">Online</option>
                    <option value="Disabled">Disabled</option>
                    <option value="Pending Invite">Pending Invite</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Module Access Permissions</label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 max-h-36 overflow-y-auto">
                    {AVAILABLE_MODULES.map((mod) => {
                      const isChecked = editModules.includes(mod);
                      return (
                        <label key={mod} className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) setEditModules((prev) => [...prev, mod]);
                              else setEditModules((prev) => prev.filter((m) => m !== mod));
                            }}
                            className="rounded text-[#071B3A] focus:ring-[#071B3A]"
                          />
                          <span className="text-slate-700 text-[11px] font-semibold">{mod}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] rounded-xl shadow-xs cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Remove Confirmation Modal */}
      <AnimatePresence>
        {removingAdmin && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRemovingAdmin(null)}
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
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Remove Admin Profile?</h3>
                  <p className="text-xs text-slate-500 font-medium">{removingAdmin.name} ({removingAdmin.email})</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed bg-rose-50 border border-rose-100 p-3 rounded-xl">
                This action will revoke administrative access for this user. You can re-invite them at any time.
              </p>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setRemovingAdmin(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRemove}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Remove Admin
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
