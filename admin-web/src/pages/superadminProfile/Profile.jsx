import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Profile() {
  const [profileName, setProfileName] = useState("Super Admin");
  const [profileEmail, setProfileEmail] = useState("superadmin@hrchub.com");
  const [profilePhone, setProfilePhone] = useState("+91 98765 43210");
  const [profileTab, setProfileTab] = useState("info");
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const logs = [
    { act: "Admin logged in successfully from 192.168.1.10", dt: "24 May 2026, 09:00 AM" },
    { act: "Verified registration credentials for Café Coffee Day", dt: "23 May 2026, 11:20 AM" },
    { act: "Changed platform dispute index weight settings", dt: "22 May 2026, 04:15 PM" },
    { act: "Exported Platform Analytics Ledger Excel sheet", dt: "21 May 2026, 02:40 PM" }
  ];

  const team = [
    { name: "Suresh Das", email: "suresh@hrchub.com", role: "Verification Auditor" },
    { name: "Neha Mathews", email: "neha@hrchub.com", role: "Resolutions Specialist" }
  ];

  return (
    <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 max-w-4xl mx-auto flex flex-col gap-6 animate-fadeIn">
      {/* Toast Overlay */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex items-start gap-3 p-4 rounded-xl border shadow-xl bg-white text-emerald-800 border-emerald-500/20"
            >
              <div className="flex-1 text-xs font-semibold leading-relaxed mt-0.5">{toast.message}</div>
              <button onClick={() => setToasts((p) => p.filter((t) => t.id !== toast.id))} className="text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Header */}
      <div className="pb-4 border-b border-slate-100">
        <h3 className="font-bold text-slate-800 text-sm">Profile Control Desk</h3>
        <p className="text-xs text-slate-400 mt-0.5">Manage super admin profile and security</p>
      </div>

      {/* Profile inner tabs */}
      <div className="flex gap-2 border-b border-slate-100 pb-3">
        {[
          { id: "info", label: "Profile Information" },
          { id: "security", label: "Security Settings" },
          { id: "activity", label: "Activity Logs" },
          { id: "team", label: "Team Management" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setProfileTab(tab.id)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${
              profileTab === tab.id ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      {profileTab === "info" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2 items-start">
          {/* Left: Avatar edit */}
          <div className="flex flex-col items-center text-center gap-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <div className="w-24 h-24 rounded-full bg-amber-400 border border-blue-200 text-blue-900 font-extrabold text-2xl flex items-center justify-center shadow-inner relative group cursor-pointer">
              SA
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px] font-bold">
                Change Photo
              </div>
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-sm">{profileName}</h4>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-0.5">Super Admin</span>
            </div>
            <button
              onClick={() => showToast("Avatar upload feature simulation.", "info")}
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              Change Photo
            </button>
          </div>

          {/* Right: profile inputs */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Scope / Role</label>
                <input
                  type="text"
                  disabled
                  value="Super Admin Control"
                  className="w-full px-4 py-2.5 border border-slate-100 text-xs font-semibold rounded-xl text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => showToast("Admin details updated.", "success")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {profileTab === "security" && (
        <div className="flex flex-col gap-4 max-w-lg">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">New Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 text-xs font-semibold rounded-xl focus:bg-white focus:outline-none" />
          </div>
          <button onClick={() => showToast("Password updated.", "success")} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl self-start mt-2">
            Update Password
          </button>
        </div>
      )}

      {profileTab === "activity" && (
        <div className="flex flex-col gap-3">
          {logs.map((item, i) => (
            <div key={i} className="p-3 border-b border-slate-100 flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-700">{item.act}</span>
              <span className="text-slate-400 font-normal font-mono">{item.dt}</span>
            </div>
          ))}
        </div>
      )}

      {profileTab === "team" && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-400">Team Admin Accounts</span>
            <button onClick={() => showToast("Add Admin form initiated.", "info")} className="text-[10px] text-blue-600 font-bold hover:underline">+ Invite Admin</button>
          </div>
          {team.map((member, i) => (
            <div key={i} className="p-3 rounded-xl border border-slate-100 bg-[#F3F4F6] flex justify-between items-center text-xs font-semibold">
              <div>
                <div className="text-slate-800 font-bold">{member.name}</div>
                <div className="text-[9px] text-slate-400 mt-0.5">{member.email}</div>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-100 font-bold px-2.5 py-0.5 rounded-full">{member.role}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
