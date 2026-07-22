import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, X, MoreVertical, Plus, Shield, UserX, UserCheck, Key,
  Eye, Clock, ShieldCheck, Mail, AlertTriangle, Trash2, Check, Lock, Unlock, RefreshCw, Users
} from 'lucide-react';
import { mockDb } from '../../utils/mockDb';

const INITIAL_ADMINS = [
  {
    id: "ADM-001",
    name: "Sarah Connor",
    email: "sarah@hrchub.com",
    phone: "+91 99999 11111",
    role: "Super Admin",
    department: "Information Technology",
    access: ["Dashboard", "Verification", "HoReCa Directory", "Vendor Network", "Complaints & Support", "Status & Limits", "Reports", "Settings"],
    status: "Active",
    isOnline: true,
    lastLogin: "Just now",
    regDate: "10 Jan 2025",
    createdBy: "System Setup",
    security: {
      twoFactorStatus: "Enabled",
      passwordLastChanged: "12 May 2026",
      failedLoginAttempts: 0,
      lastLoginDevice: "MacBook Pro / macOS",
      lastLoginIp: "103.45.201.12",
      activeSessions: 2
    },
    activity: [
      { action: "Account Suspended", module: "Status & Limits", time: "17 Jul 2026, 11:30 AM" },
      { action: "Business Verified", module: "Verification", time: "16 Jul 2026, 04:15 PM" },
      { action: "Report Exported", module: "Reports", time: "15 Jul 2026, 09:00 AM" }
    ],
    permissionsMatrix: {
      "Dashboard": ["View", "Create", "Edit", "Approve", "Delete", "Export"],
      "Verification": ["View", "Create", "Edit", "Approve", "Delete", "Export"],
      "HoReCa Directory": ["View", "Create", "Edit", "Approve", "Delete", "Export"],
      "Vendor Network": ["View", "Create", "Edit", "Approve", "Delete", "Export"],
      "Complaints & Support": ["View", "Create", "Edit", "Approve", "Delete", "Export"],
      "Status & Limits": ["View", "Create", "Edit", "Approve", "Delete", "Export"],
      "Reports": ["View", "Create", "Edit", "Approve", "Delete", "Export"],
      "Settings": ["View", "Create", "Edit", "Approve", "Delete", "Export"]
    }
  },
  {
    id: "ADM-002",
    name: "John Smith",
    email: "john@hrchub.com",
    phone: "+91 99999 22222",
    role: "Verification Admin",
    department: "Risk & Compliance",
    access: ["Verification", "HoReCa Directory", "Vendor Network"],
    status: "Active",
    isOnline: false,
    lastLogin: "17 Jul 2026, 12:45 PM",
    regDate: "12 Mar 2025",
    createdBy: "Sarah Connor",
    security: {
      twoFactorStatus: "Enabled",
      passwordLastChanged: "01 Jun 2026",
      failedLoginAttempts: 1,
      lastLoginDevice: "ThinkPad / Windows 11",
      lastLoginIp: "103.45.201.14",
      activeSessions: 1
    },
    activity: [
      { action: "Business Verified", module: "Verification", time: "17 Jul 2026, 10:20 AM" },
      { action: "Business Verified", module: "Verification", time: "16 Jul 2026, 03:30 PM" }
    ],
    permissionsMatrix: {
      "Verification": ["View", "Approve", "Edit"],
      "HoReCa Directory": ["View", "Edit"],
      "Vendor Network": ["View"]
    }
  },
  {
    id: "ADM-003",
    name: "Neha Mathews",
    email: "neha@hrchub.com",
    phone: "+91 99999 33333",
    role: "Support Admin",
    department: "Operations & Support",
    access: ["Complaints & Support", "HoReCa Directory", "Vendor Network"],
    status: "Online",
    isOnline: true,
    lastLogin: "17 Jul 2026, 02:50 PM",
    regDate: "14 Apr 2025",
    createdBy: "Sarah Connor",
    security: {
      twoFactorStatus: "Disabled",
      passwordLastChanged: "15 Apr 2025",
      failedLoginAttempts: 0,
      lastLoginDevice: "iPhone 15 / Safari",
      lastLoginIp: "122.161.42.19",
      activeSessions: 1
    },
    activity: [
      { action: "Complaint Resolved", module: "Complaints & Support", time: "17 Jul 2026, 01:10 PM" },
      { action: "Complaint Resolved", module: "Complaints & Support", time: "16 Jul 2026, 11:45 AM" }
    ],
    permissionsMatrix: {
      "Complaints & Support": ["View", "Edit", "Approve"],
      "HoReCa Directory": ["View"],
      "Vendor Network": ["View"]
    }
  },
  {
    id: "ADM-004",
    name: "Raj Patel",
    email: "raj@hrchub.com",
    phone: "+91 99999 44444",
    role: "Operations Admin",
    department: "Supply Chain",
    access: ["HoReCa Directory", "Vendor Network", "Reports"],
    status: "Disabled",
    isOnline: false,
    lastLogin: "14 May 2026, 06:10 PM",
    regDate: "05 May 2025",
    createdBy: "Sarah Connor",
    security: {
      twoFactorStatus: "Enabled",
      passwordLastChanged: "05 May 2025",
      failedLoginAttempts: 3,
      lastLoginDevice: "Dell Latitude / Ubuntu",
      lastLoginIp: "182.74.192.110",
      activeSessions: 0
    },
    activity: [
      { action: "Report Exported", module: "Reports", time: "14 May 2026, 05:30 PM" }
    ],
    permissionsMatrix: {
      "HoReCa Directory": ["View", "Edit"],
      "Vendor Network": ["View", "Edit"],
      "Reports": ["View", "Export"]
    }
  },
  {
    id: "ADM-005",
    name: "Amit Desai",
    email: "amit@hrchub.com",
    phone: "+91 99999 55555",
    role: "Read-Only Auditor",
    department: "Internal Audit",
    access: ["Verification", "HoReCa Directory", "Vendor Network", "Complaints & Support", "Status & Limits", "Reports"],
    status: "Pending Invite",
    isOnline: false,
    lastLogin: "Never",
    regDate: "17 Jul 2026",
    createdBy: "Sarah Connor",
    security: {
      twoFactorStatus: "Disabled",
      passwordLastChanged: "Never",
      failedLoginAttempts: 0,
      lastLoginDevice: "N/A",
      lastLoginIp: "N/A",
      activeSessions: 0
    },
    activity: [],
    permissionsMatrix: {
      "Verification": ["View"],
      "HoReCa Directory": ["View"],
      "Vendor Network": ["View"],
      "Complaints & Support": ["View"],
      "Status & Limits": ["View"],
      "Reports": ["View"]
    }
  },
  {
    id: "ADM-006",
    name: "Vikram Sen",
    email: "vikram@hrchub.com",
    phone: "+91 99999 66666",
    role: "Finance Admin",
    department: "Finance & Accounts",
    access: ["Reports", "Settings"],
    status: "Locked",
    isOnline: false,
    lastLogin: "10 Jul 2026, 11:15 AM",
    regDate: "01 Dec 2025",
    createdBy: "Sarah Connor",
    security: {
      twoFactorStatus: "Enabled",
      passwordLastChanged: "01 Dec 2025",
      failedLoginAttempts: 5,
      lastLoginDevice: "Lenovo / Chrome",
      lastLoginIp: "49.36.192.15",
      activeSessions: 0
    },
    activity: [
      { action: "Report Exported", module: "Reports", time: "10 Jul 2026, 10:45 AM" }
    ],
    permissionsMatrix: {
      "Reports": ["View", "Export"],
      "Settings": ["View"]
    }
  }
];

export default function Team() {
  const [admins, setAdmins] = useState([]);

  // Search and Toolbar States
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [loginFilter, setLoginFilter] = useState("All");

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Right Side Drawer State
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [drawerTab, setDrawerTab] = useState("Overview"); // Overview, Permissions, Activity, Security

  // Modals States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);

  // Form States
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formRole, setFormRole] = useState("Verification Admin");
  const [formDept, setFormDept] = useState("Operations");
  const [formAccess, setFormAccess] = useState(["Verification"]);
  const [formTempPassword, setFormTempPassword] = useState("");
  const [formSendInvite, setFormSendInvite] = useState(true);

  // Edit State
  const [editStatus, setEditStatus] = useState("Active");

  // Reset State
  const [resetTempPassword, setResetTempPassword] = useState("");
  const [resetSendEmail, setResetSendEmail] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const availableModules = [
    "Dashboard",
    "Verification",
    "HoReCa Directory",
    "Vendor Network",
    "Complaints & Support",
    "Status & Limits",
    "Reports",
    "Settings"
  ];

  const availableRoles = [
    "Super Admin",
    "Verification Admin",
    "Support Admin",
    "Operations Admin",
    "Finance Admin",
    "Read-Only Auditor"
  ];

  useEffect(() => {
    let data = mockDb.getAdmins();
    // Load local mock structure if details like department are missing from older mock list
    if (!data.length || !data[0].department) {
      data = INITIAL_ADMINS;
      mockDb.saveAdmins(INITIAL_ADMINS);
    }
    setAdmins(data);

    const handleClickOutside = () => setActiveMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const saveAdmins = (updated) => {
    setAdmins(updated);
    mockDb.saveAdmins(updated);
    // Dispatch local storage update event to keep consistent between pages
    window.dispatchEvent(new Event('storage'));
  };

  const handleStatusToggle = (id) => {
    const updated = admins.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'Active' || a.status === 'Online' ? 'Disabled' : 'Active';
        return { ...a, status: nextStatus };
      }
      return a;
    });
    saveAdmins(updated);
    const item = updated.find(a => a.id === id);
    showToast(`Admin account status is now ${item.status}!`, "info");
  };

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const handleGeneratePassword = (isReset = false) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    let pass = "HRC-";
    for (let i = 0; i < 8; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (isReset) {
      setResetTempPassword(pass);
    } else {
      setFormTempPassword(pass);
    }
  };

  // Summaries
  const totalCount = admins.length;
  const activeCount = admins.filter(a => a.status === 'Active' || a.status === 'Online').length;
  const disabledCount = admins.filter(a => a.status === 'Disabled').length;
  const onlineCount = admins.filter(a => a.isOnline || a.status === 'Online').length;
  const pendingCount = admins.filter(a => a.status === 'Pending Invite').length;

  const filteredAdmins = useMemo(() => {
    return admins.filter((a) => {
      const query = searchQuery.toLowerCase();
      const matchSearch =
        !searchQuery ||
        (a.name && a.name.toLowerCase().includes(query)) ||
        (a.email && a.email.toLowerCase().includes(query)) ||
        (a.phone && a.phone.includes(query));

      const matchRole = roleFilter === "All" || a.role === roleFilter;
      const matchStatus = statusFilter === "All" || a.status === statusFilter;

      let matchModule = true;
      if (moduleFilter !== "All") {
        matchModule = a.access.includes(moduleFilter);
      }

      let matchLogin = true;
      if (loginFilter !== "All") {
        if (loginFilter === "Today") {
          matchLogin = a.lastLogin.includes("17 Jul 2026") || a.lastLogin.includes("Just now") || a.lastLogin.includes("hours") || a.lastLogin.includes("mins");
        } else if (loginFilter === "Week") {
          matchLogin = a.lastLogin !== "Never" && !a.lastLogin.includes("May 2026") && !a.lastLogin.includes("Never");
        } else if (loginFilter === "Never") {
          matchLogin = a.lastLogin === "Never";
        }
      }

      return matchSearch && matchRole && matchStatus && matchModule && matchLogin;
    });
  }, [admins, searchQuery, roleFilter, statusFilter, moduleFilter, loginFilter]);

  const activeAdmin = useMemo(() => admins.find(a => a.id === selectedAdminId), [admins, selectedAdminId]);

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const currentAdmins = useMemo(() => {
    return filteredAdmins;
  }, [filteredAdmins]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter, moduleFilter, loginFilter]);

  const handleAction = (e, adm, type) => {
    e.stopPropagation();
    setActiveMenuId(null);

    if (type === 'view') {
      setSelectedAdminId(adm.id);
      setDrawerTab("Overview");
    } else if (type === 'edit') {
      setSelectedAdminId(adm.id);
      setFormName(adm.name);
      setFormEmail(adm.email);
      setFormPhone(adm.phone);
      setFormRole(adm.role);
      setFormDept(adm.department || "Operations");
      setFormAccess(adm.access || []);
      setEditStatus(adm.status);
      setEditModalOpen(true);
    } else if (type === 'permissions') {
      setSelectedAdminId(adm.id);
      setDrawerTab("Permissions");
    } else if (type === 'toggle-status') {
      if (adm.role === 'Super Admin' && adm.status === 'Active') {
        showToast("Error: Primary Super Admin cannot be disabled.", "error");
        return;
      }
      const newStatus = adm.status === 'Active' || adm.status === 'Online' ? 'Disabled' : 'Active';
      const updated = admins.map(a => a.id === adm.id ? { ...a, status: newStatus, isOnline: newStatus === 'Active' ? a.isOnline : false } : a);
      saveAdmins(updated);
      showToast(`${adm.name} account status updated to ${newStatus}.`, "success");
    } else if (type === 'password') {
      setSelectedAdminId(adm.id);
      handleGeneratePassword(true);
      setResetModalOpen(true);
    } else if (type === 'invite') {
      showToast(`Invitation email resent to ${adm.email} successfully.`, "success");
    } else if (type === 'remove') {
      if (adm.role === 'Super Admin') {
        showToast("Error: Primary Super Admin cannot be deleted.", "error");
        return;
      }
      setSelectedAdminId(adm.id);
      setRemoveModalOpen(true);
    }
  };

  const handleRoleChange = (role) => {
    setFormRole(role);
    // Assign modules defaults
    let def = [];
    if (role === "Super Admin") def = availableModules;
    else if (role === "Verification Admin") def = ["Verification", "HoReCa Directory", "Vendor Network"];
    else if (role === "Support Admin") def = ["Complaints & Support", "HoReCa Directory", "Vendor Network"];
    else if (role === "Operations Admin") def = ["HoReCa Directory", "Vendor Network", "Reports"];
    else if (role === "Finance Admin") def = ["Reports", "Settings"];
    else if (role === "Read-Only Auditor") def = ["Dashboard", "Verification", "HoReCa Directory", "Vendor Network", "Complaints & Support", "Status & Limits", "Reports"];
    setFormAccess(def);
  };

  const handleAddAdminSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPhone.trim()) {
      showToast("Please fill in all basic fields.", "error");
      return;
    }

    // Create new admin
    const newId = `ADM-00${admins.length + 1}`;
    const timestampShort = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newAdmin = {
      id: newId,
      name: formName,
      email: formEmail,
      phone: formPhone,
      role: formRole,
      department: formDept,
      access: formAccess,
      status: formSendInvite ? "Pending Invite" : "Active",
      isOnline: false,
      lastLogin: "Never",
      regDate: timestampShort,
      createdBy: "Super Admin",
      security: {
        twoFactorStatus: "Disabled",
        passwordLastChanged: "Never",
        failedLoginAttempts: 0,
        lastLoginDevice: "N/A",
        lastLoginIp: "N/A",
        activeSessions: 0
      },
      activity: [
        { action: "Admin profile created", module: "Settings", time: `${timestampShort}, 03:30 PM` }
      ],
      permissionsMatrix: {}
    };

    // Populate permission matrix defaults
    formAccess.forEach(mod => {
      newAdmin.permissionsMatrix[mod] = formRole === "Super Admin"
        ? ["View", "Create", "Edit", "Approve", "Delete", "Export"]
        : ["View", "Edit"];
    });

    saveAdmins([...admins, newAdmin]);
    showToast(`${formName} registered as ${formRole}.`, "success");
    setAddModalOpen(false);

    // Reset fields
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormDept("Operations");
    setFormAccess(["Verification"]);
    setFormTempPassword("");
  };

  const handleEditAdminSubmit = (e) => {
    e.preventDefault();
    if (!selectedAdminId) return;

    const updated = admins.map(a => {
      if (a.id === selectedAdminId) {
        const nextMatrix = { ...a.permissionsMatrix };
        formAccess.forEach(mod => {
          if (!nextMatrix[mod]) {
            nextMatrix[mod] = formRole === "Super Admin"
              ? ["View", "Create", "Edit", "Approve", "Delete", "Export"]
              : ["View"];
          }
        });
        return {
          ...a,
          role: formRole,
          department: formDept,
          access: formAccess,
          status: editStatus,
          isOnline: editStatus === "Online" ? true : (editStatus === "Disabled" ? false : a.isOnline),
          permissionsMatrix: nextMatrix
        };
      }
      return a;
    });

    saveAdmins(updated);
    showToast(`Access properties saved for ${formName}.`, "success");
    setEditModalOpen(false);
  };

  const handleResetPasswordSubmit = () => {
    if (!selectedAdminId) return;
    const timestampShort = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const updated = admins.map(a => {
      if (a.id === selectedAdminId) {
        const nextHistory = [
          ...a.activity,
          { action: "Password reset authorized", module: "Settings", time: `${timestampShort}, 04:00 PM` }
        ];
        return {
          ...a,
          security: {
            ...a.security,
            passwordLastChanged: timestampShort,
            failedLoginAttempts: 0
          },
          activity: nextHistory
        };
      }
      return a;
    });
    saveAdmins(updated);
    showToast(`Password successfully reset. Temporary key: ${resetTempPassword}`, "success");
    setResetModalOpen(false);
  };

  const handleRemoveAdminSubmit = () => {
    if (!selectedAdminId) return;
    const target = admins.find(a => a.id === selectedAdminId);
    const updated = admins.filter(a => a.id !== selectedAdminId);
    saveAdmins(updated);
    showToast(`${target.name} removed from admin credentials directory.`, "error");
    setRemoveModalOpen(false);
    setSelectedAdminId(null);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Super Admin': return 'bg-rose-50 text-rose-700 border-rose-200/60';
      case 'Verification Admin': return 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
      case 'Support Admin': return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'Operations Admin': return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'Finance Admin': return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'Read-Only Auditor': return 'bg-slate-100 text-slate-700 border-slate-200/60';
      default: return 'bg-slate-50 text-slate-700 border-slate-200/60';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'Online': return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'Disabled': return 'bg-rose-50 text-rose-700 border-rose-200/60 font-bold';
      case 'Pending Invite': return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'Locked': return 'bg-purple-50 text-purple-700 border-purple-200/60';
      default: return 'bg-slate-50 text-slate-700 border-slate-200/60';
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
            <Users size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Admin Team Management</h1>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">Manage super admins, module access rights, and security.</p>
          </div>
        </div>
        <button
          onClick={() => {
            setFormName("");
            setFormEmail("");
            setFormPhone("");
            setFormDept("Operations");
            setFormAccess(["Verification"]);
            setFormRole("Verification Admin");
            handleGeneratePassword(false);
            setAddModalOpen(true);
          }}
          className="relative z-10 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 border border-blue-400/30 shrink-0"
        >
          <Plus size={16} /> Add Admin
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

      {/* Filters Toolbar */}
      <div className="flex flex-col gap-4 bg-white border border-slate-200/60 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Admin Name, Email, Phone Number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Main Table */}
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
            {currentAdmins.length > 0 ? (
              currentAdmins.map(a => (
                <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-350 flex items-center justify-center font-bold text-xs text-slate-600 uppercase shadow-xs">
                          {a.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {a.isOnline && (
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                        )}
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
                    <div className="flex flex-wrap gap-1 max-w-[240px]">
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusToggle(a.id);
                        }}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          a.status === 'Active' || a.status === 'Online' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        title={a.status === 'Active' || a.status === 'Online' ? 'Admin is Active (click to Disable)' : `Admin is ${a.status} (click to Activate)`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            a.status === 'Active' || a.status === 'Online' ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                      <span className={`text-[10px] font-black ${a.status === 'Active' || a.status === 'Online' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {a.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center relative" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAdminId(a.id);
                        setDrawerTab("Overview");
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50/50 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Shield size={48} className="text-slate-300 stroke-[1.5]" />
                    <span className="text-xs font-black text-slate-500">No Admins Found</span>
                    <span className="text-[10px] text-slate-400 max-w-[220px] leading-relaxed">
                      Try adjusting your search text parameters or filters to find what you are looking for.
                    </span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>



      {/* Admin Details Modal (Centered) */}
      <AnimatePresence>
        {selectedAdminId && activeAdmin && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelectedAdminId(null)}
            />

            {/* Modal Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white border border-slate-200/80 rounded-3xl shadow-2xl flex flex-col w-full max-w-2xl h-[85vh] relative z-10 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center flex-shrink-0">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0 uppercase">
                    {activeAdmin.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 text-sm">{activeAdmin.name}</h2>
                    <span className="text-[10px] text-slate-400 font-bold">{activeAdmin.id} • Registered: {activeAdmin.regDate}</span>
                  </div>
                </div>
                <button onClick={() => setSelectedAdminId(null)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6" style={{ scrollbarWidth: "thin" }}>
                
                {/* Profile Overview */}
                <div className="space-y-4">
                  <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs space-y-3.5">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Admin Profile Info</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-0.5">Email Address</span>
                        <span className="font-bold text-slate-800">{activeAdmin.email}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-0.5">Phone Number</span>
                        <span className="font-bold text-slate-800">{activeAdmin.phone}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-0.5">Department</span>
                        <span className="font-bold text-slate-800">{activeAdmin.department || "Operations"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-0.5">Account Status</span>
                        <span className={`inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border mt-0.5 ${getStatusColor(activeAdmin.status)}`}>
                          {activeAdmin.status}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-0.5">Last Login Time</span>
                        <span className="font-bold text-slate-700">{activeAdmin.lastLogin}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-0.5">Registration Date</span>
                        <span className="font-bold text-slate-700">{activeAdmin.regDate}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-0.5">Created By Admin</span>
                        <span className="font-bold text-slate-800">{activeAdmin.createdBy || "Super Admin"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Modules summary list */}
                  <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-xs">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Assigned Modules</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {activeAdmin.access.map(mod => (
                        <span key={mod} className="text-[10px] font-bold bg-slate-50 border border-slate-150 rounded px-2.5 py-0.5 text-slate-700">
                          {mod}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Module Permissions Matrix */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Module Permissions Matrix</h4>
                  <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs bg-white">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-[9px] uppercase font-bold text-slate-400 border-b border-slate-100">
                          <th className="p-3">Module</th>
                          <th className="p-2 text-center">View</th>
                          <th className="p-2 text-center">Create</th>
                          <th className="p-2 text-center">Edit</th>
                          <th className="p-2 text-center">Approve</th>
                          <th className="p-2 text-center">Delete</th>
                          <th className="p-2 text-center">Export</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availableModules.map((mod) => {
                          const hasAccess = activeAdmin.access.includes(mod);
                          const matrix = activeAdmin.permissionsMatrix?.[mod] || [];
                          return (
                            <tr key={mod} className={`border-b border-slate-50 font-semibold text-slate-600 ${!hasAccess ? 'opacity-40 bg-slate-50/20' : ''}`}>
                              <td className="p-3 text-[11px] font-bold text-slate-800">{mod}</td>
                              {["View", "Create", "Edit", "Approve", "Delete", "Export"].map((action) => {
                                const isChecked = hasAccess && (activeAdmin.role === "Super Admin" || matrix.includes(action));
                                return (
                                  <td key={action} className="p-2 text-center">
                                    <div className="flex justify-center">
                                      {isChecked ? (
                                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                                      ) : (
                                        <span className="text-slate-300 font-normal">-</span>
                                      )}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Activity Timeline</h4>
                  <div className="relative border-l border-slate-200 ml-3 flex flex-col gap-5 pt-2 pb-2">
                    {activeAdmin.activity && activeAdmin.activity.length > 0 ? (
                      activeAdmin.activity.map((act, idx) => (
                        <div key={idx} className="relative pl-5">
                          <span className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-slate-350 ring-4 ring-white" />
                          <div className="flex flex-col text-xs font-semibold">
                            <span className="font-black text-slate-800">{act.action}</span>
                            <span className="text-[9px] font-bold text-slate-400 mt-0.5">{act.time}</span>
                            <span className="text-[9px] font-bold text-blue-600 uppercase mt-1 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded w-fit">
                              {act.module}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-400 italic bg-slate-50 border border-slate-100 rounded-xl">
                        No recent activity logs recorded.
                      </div>
                    )}
                  </div>
                </div>

                {/* Security Properties */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Security Properties</h4>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3.5">
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/60">
                      <span className="text-xs font-bold text-slate-700">Two Factor Authentication (2FA)</span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${activeAdmin.security?.twoFactorStatus === "Enabled"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : "bg-slate-100 text-slate-650 border-slate-200"
                        }`}>
                        {activeAdmin.security?.twoFactorStatus || "Disabled"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-600">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-0.5">Password Last Changed</span>
                        <span className="text-slate-800 font-bold">{activeAdmin.security?.passwordLastChanged || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-0.5">Failed Login Attempts</span>
                        <span className={`font-bold ${activeAdmin.security?.failedLoginAttempts > 2 ? 'text-rose-600 font-black' : 'text-slate-800'}`}>
                          {activeAdmin.security?.failedLoginAttempts || 0}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-0.5">Last Login Device</span>
                        <span className="text-slate-800">{activeAdmin.security?.lastLoginDevice || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold block uppercase mb-0.5">Last Login IP</span>
                        <span className="font-mono text-slate-800">{activeAdmin.security?.lastLoginIp || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-100 bg-white rounded-xl p-4 flex justify-between items-center shadow-xs">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Active Device Sessions</span>
                      <span className="text-[10px] text-slate-400 font-semibold block">{activeAdmin.security?.activeSessions || 0} session(s) active on this account</span>
                    </div>
                    {activeAdmin.security?.activeSessions > 1 && (
                      <button
                        onClick={() => {
                          const updated = admins.map(a =>
                            a.id === activeAdmin.id
                              ? { ...a, security: { ...a.security, activeSessions: 1, lastLoginDevice: "This Browser" } }
                              : a
                          );
                          saveAdmins(updated);
                          showToast("All other active sessions revoked.", "info");
                        }}
                        className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-rose-600 text-xs font-bold rounded-lg transition-colors bg-white shadow-xs"
                      >
                        Revoke Others
                      </button>
                    )}
                  </div>
                </div>

              </div>

              {/* Footer Controls */}
              <div className="bg-slate-50 border-t border-slate-100 p-4 flex gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    setFormName(activeAdmin.name);
                    setFormEmail(activeAdmin.email);
                    setFormPhone(activeAdmin.phone);
                    setFormRole(activeAdmin.role);
                    setFormDept(activeAdmin.department || "Operations");
                    setFormAccess(activeAdmin.access || []);
                    setEditStatus(activeAdmin.status);
                    setEditModalOpen(true);
                  }}
                  className="flex-1 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-650 text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => {
                    handleGeneratePassword(true);
                    setResetModalOpen(true);
                  }}
                  className="flex-1 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-blue-600 text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Reset Password
                </button>

                {(activeAdmin.status === 'Pending Invite' || activeAdmin.status === 'Disabled') && (
                  <button
                    onClick={() => {
                      showToast(`Invitation email resent to ${activeAdmin.email}`, "success");
                    }}
                    className="flex-1 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-indigo-600 text-xs font-bold rounded-xl transition-colors shadow-xs"
                  >
                    Resend Invite
                  </button>
                )}

                <button
                  onClick={() => {
                    const newStatus = activeAdmin.status === 'Disabled' ? 'Active' : 'Disabled';
                    const updated = admins.map(a => a.id === activeAdmin.id ? { ...a, status: newStatus } : a);
                    saveAdmins(updated);
                    showToast(`${activeAdmin.name} account set to ${newStatus}.`, "success");
                  }}
                  className="flex-1 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  {activeAdmin.status === 'Disabled' ? 'Enable' : 'Disable'}
                </button>
                <button
                  onClick={() => setRemoveModalOpen(true)}
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setAddModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="text-slate-800 w-5 h-5" />
                  <h3 className="text-sm font-black text-slate-800">Add New Admin Profile</h3>
                </div>
                <button onClick={() => setAddModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddAdminSubmit} className="p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-slate-650">
                  <div className="col-span-2">
                    <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Jane Connor"
                      className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="jane@hrchub.com"
                      className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+91 99999 xxxxx"
                      className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Assigned Role</label>
                    <select
                      value={formRole}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                    >
                      {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={formDept}
                      onChange={(e) => setFormDept(e.target.value)}
                      placeholder="e.g. Risk Audit"
                      className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                    />
                  </div>
                </div>

                {/* Modules checkbox */}
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Assign Access Modules</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableModules.map(mod => {
                      const isSuper = formRole === "Super Admin";
                      const isChecked = formAccess.includes(mod) || isSuper;
                      return (
                        <div key={mod} className={`flex items-center gap-2 p-2 rounded-lg border ${isChecked ? 'border-blue-200 bg-blue-50/50' : 'border-slate-100 bg-slate-50/50'}`}>
                          <input
                            type="checkbox"
                            id={`add-mod-${mod}`}
                            checked={isChecked}
                            disabled={isSuper}
                            onChange={() => {
                              const next = formAccess.includes(mod)
                                ? formAccess.filter(m => m !== mod)
                                : [...formAccess, mod];
                              setFormAccess(next);
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500 border-slate-200 cursor-pointer"
                          />
                          <label htmlFor={`add-mod-${mod}`} className={`text-[10px] font-bold cursor-pointer ${isChecked ? 'text-blue-700' : 'text-slate-500'}`}>
                            {mod}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Temp Password */}
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Temporary Password</label>
                    <button
                      type="button"
                      onClick={() => handleGeneratePassword(false)}
                      className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1"
                    >
                      <RefreshCw size={11} /> Re-Generate
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={formTempPassword}
                    onChange={(e) => setFormTempPassword(e.target.value)}
                    className="w-full border border-slate-200 bg-slate-50 font-mono text-center rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl mt-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-indigo-900">Send Invitation Checkbox</span>
                    <span className="text-[8px] text-indigo-400 font-bold uppercase">Send password setup link to email</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formSendInvite}
                    onChange={(e) => setFormSendInvite(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-200 rounded"
                  />
                </div>

                <div className="flex gap-3 justify-end pt-3 border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors w-full animate-fadeIn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors w-full shadow-sm animate-fadeIn"
                  >
                    Create Admin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Admin Modal */}
      <AnimatePresence>
        {editModalOpen && activeAdmin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="text-slate-800 w-5 h-5" />
                  <h3 className="text-sm font-black text-slate-800">Edit Admin Permissions: {activeAdmin.name}</h3>
                </div>
                <button onClick={() => setEditModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditAdminSubmit} className="p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Administrative Role</label>
                    <select
                      value={formRole}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                    >
                      {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Department</label>
                    <input
                      type="text"
                      required
                      value={formDept}
                      onChange={(e) => setFormDept(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block mb-1">Account Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-700"
                    >
                      <option value="Active">Active</option>
                      <option value="Online">Online</option>
                      <option value="Disabled">Disabled</option>
                      <option value="Pending Invite">Pending Invite</option>
                      <option value="Locked">Locked</option>
                    </select>
                  </div>
                </div>

                {/* Modules access */}
                <div>
                  <label className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block mb-2">Module Access Permissions</label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableModules.map(mod => {
                      const isSuper = formRole === "Super Admin";
                      const isChecked = formAccess.includes(mod) || isSuper;
                      return (
                        <div key={mod} className={`flex items-center gap-2 p-2 rounded-lg border ${isChecked ? 'border-blue-200 bg-blue-50/50' : 'border-slate-100 bg-slate-50/50'}`}>
                          <input
                            type="checkbox"
                            id={`edit-mod-${mod}`}
                            checked={isChecked}
                            disabled={isSuper}
                            onChange={() => {
                              const next = formAccess.includes(mod)
                                ? formAccess.filter(m => m !== mod)
                                : [...formAccess, mod];
                              setFormAccess(next);
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500 border-slate-200 cursor-pointer"
                          />
                          <label htmlFor={`edit-mod-${mod}`} className={`text-[10px] font-bold cursor-pointer ${isChecked ? 'text-blue-700' : 'text-slate-500'}`}>
                            {mod}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-3 border-t border-slate-100 mt-2">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors w-full"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors w-full shadow-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reset Password Modal */}
      <AnimatePresence>
        {resetModalOpen && activeAdmin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setResetModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 space-y-4"
            >
              <div>
                <h3 className="text-base font-black text-slate-800">Reset Admin Password</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Generate a secure login passcode token for <span className="font-bold text-slate-700">{activeAdmin.name}</span>.</p>
              </div>

              <div className="space-y-3.5 text-xs font-semibold text-slate-650">
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-center space-y-2">
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Generated Temporary Password</span>
                  <span className="text-sm font-mono font-black text-indigo-700 select-all block bg-white border border-indigo-100 py-1.5 px-3 rounded-lg shadow-xs">{resetTempPassword}</span>
                  <button
                    type="button"
                    onClick={() => handleGeneratePassword(true)}
                    className="text-[10px] text-blue-600 hover:underline inline-flex items-center gap-1 font-bold pt-1"
                  >
                    <RefreshCw size={10} /> Generate New Code
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-750">Send Email Checkbox</span>
                    <span className="text-[8px] text-slate-400 font-semibold uppercase">Email generated password immediately</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={resetSendEmail}
                    onChange={(e) => setResetSendEmail(e.target.checked)}
                    className="w-4 h-4 text-blue-650 focus:ring-blue-500 border-slate-200 rounded"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setResetModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPasswordSubmit}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors w-full shadow-sm"
                >
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Remove Admin Modal */}
      <AnimatePresence>
        {removeModalOpen && activeAdmin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setRemoveModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm relative z-10 space-y-4 border border-rose-100"
            >
              <div>
                <h3 className="text-base font-black text-rose-600 flex items-center gap-1.5"><AlertTriangle size={18} /> Remove Admin Profile</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Are you sure you want to delete <span className="font-bold text-slate-700">{activeAdmin.name}</span> from the organization?</p>
              </div>

              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 text-rose-800 text-[10px] font-bold leading-relaxed">
                CAUTION: This action is irreversible. All administrative credentials, assigned privileges, and logging connections will be immediately terminated.
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setRemoveModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors w-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveAdminSubmit}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors w-full shadow-sm"
                >
                  Delete Admin Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
