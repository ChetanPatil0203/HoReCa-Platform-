import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, ShieldAlert, Monitor, Smartphone, Globe, LogOut, CheckCircle, Bell, Clock, History, Camera } from 'lucide-react';

export default function Profile() {
  const [profileName, setProfileName] = useState("Super Admin");
  const [profileEmail, setProfileEmail] = useState("superadmin@hrchub.com");
  const [profilePhone, setProfilePhone] = useState("+91 98765 43210");
  const [profileTab, setProfileTab] = useState("info");
  
  // Security State
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");

  // Sessions State
  const [activeSessions, setActiveSessions] = useState([
    { id: "S1", device: "MacBook Pro 16\"", browser: "Chrome 114", location: "Mumbai, India", ip: "192.168.1.10", lastActive: "Just now", current: true },
    { id: "S2", device: "iPhone 14 Pro", browser: "Safari 16", location: "Mumbai, India", ip: "192.168.1.15", lastActive: "2 hours ago", current: false },
    { id: "S3", device: "Windows Desktop", browser: "Edge 112", location: "Delhi, India", ip: "10.0.0.42", lastActive: "3 days ago", current: false },
  ]);

  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const activityLogs = [
    { act: "Permanently blocked account 'Café Coffee Day'", dt: "15 Jul 2026, 04:30 PM", type: "status" },
    { act: "Resolved SLA Critical complaint #CMP-9821", dt: "15 Jul 2026, 02:15 PM", type: "complaint" },
    { act: "Started impersonation session for 'Royal Orchid Hotel'", dt: "14 Jul 2026, 11:20 AM", type: "impersonation" },
    { act: "Added new category 'Executive Chef' (Manpower)", dt: "14 Jul 2026, 09:45 AM", type: "category" },
    { act: "Approved Verification for 'Green Valley Suppliers'", dt: "13 Jul 2026, 03:10 PM", type: "verification" },
    { act: "Temporarily suspended account 'The Grand Palace'", dt: "13 Jul 2026, 01:20 PM", type: "status" },
  ];

  const handleRevokeSession = (id) => {
    setActiveSessions(prev => prev.filter(s => s.id !== id));
    showToast("Session revoked successfully.", "success");
  };

  const handleRevokeAllOther = () => {
    setActiveSessions(prev => prev.filter(s => s.current));
    showToast("All other active sessions revoked.", "info");
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
                toast.type === "info" ? "border-blue-500/20 text-blue-800" :
                "border-rose-500/20 text-rose-800"
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

      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl p-5">
        <h1 className="text-xl font-black text-slate-800 tracking-tight">Profile & Security</h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">Manage your personal details, credentials, and active sessions.</p>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          {[
            { id: "info", label: "Profile Information", icon: <CheckCircle size={16} /> },
            { id: "security", label: "Security Settings", icon: <ShieldCheck size={16} /> },
            { id: "sessions", label: "Active Sessions", icon: <Globe size={16} /> },
            { id: "activity", label: "Activity History", icon: <History size={16} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setProfileTab(tab.id)}
              className={`flex items-center gap-3 text-sm font-bold px-4 py-3 rounded-xl transition-all ${
                profileTab === tab.id ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-200/60"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 min-h-[500px]">
          
          {profileTab === "info" && (
            <div className="flex flex-col gap-8 animate-fadeIn">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 min-w-[200px]">
                  <div className="w-24 h-24 rounded-full bg-slate-800 text-white font-black text-2xl flex items-center justify-center shadow-lg relative group cursor-pointer overflow-hidden">
                    SA
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-6 h-6 text-white mb-1" />
                      <span className="text-[9px] font-bold text-white uppercase tracking-wider">Change</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <h4 className="font-black text-slate-800 text-sm">{profileName}</h4>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block mt-0.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Super Admin</span>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Phone</label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role & Permissions</label>
                    <input
                      type="text"
                      disabled
                      value="Super Admin (Global Access)"
                      className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 text-xs font-semibold rounded-xl text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-5 border-t border-slate-100">
                <button
                  onClick={() => showToast("Profile information updated successfully.", "success")}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {profileTab === "security" && (
            <div className="flex flex-col gap-8 animate-fadeIn max-w-2xl">
              
              {/* Password Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2">Change Password</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="hidden sm:block"></div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <button onClick={() => showToast("Password updated.", "success")} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl self-start mt-2 transition-colors">
                  Update Password
                </button>
              </div>

              {/* 2FA Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2">Two-Factor Authentication (2FA)</h3>
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">2FA is Not Configured</div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">Secure your account with an authenticator app.</div>
                    </div>
                  </div>
                  <button onClick={() => showToast("2FA setup initiated.", "info")} className="px-4 py-2 border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 text-xs font-bold rounded-xl transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>

              {/* Prefs Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2">Security Preferences</h3>
                
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Bell className="text-slate-400 w-5 h-5" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Login Alerts</div>
                      <div className="text-[10px] text-slate-500 font-medium">Receive an email when a new device logs in.</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setLoginAlerts(!loginAlerts)}
                    className={`w-10 h-6 rounded-full transition-colors relative p-0.5 focus:outline-none ${loginAlerts ? "bg-emerald-500" : "bg-slate-300"}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${loginAlerts ? "translate-x-4" : "translate-x-0"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="text-slate-400 w-5 h-5" />
                    <div>
                      <div className="text-xs font-bold text-slate-800">Session Timeout</div>
                      <div className="text-[10px] text-slate-500 font-medium">Auto logout after inactivity.</div>
                    </div>
                  </div>
                  <select 
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="border border-slate-300 bg-white rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="240">4 Hours</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {profileTab === "sessions" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-xl">
                  Review the devices currently logged into your account. If you see any unfamiliar activity, revoke the session immediately and change your password.
                </p>
                <button 
                  onClick={handleRevokeAllOther}
                  className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors shrink-0"
                >
                  Revoke All Other Sessions
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {activeSessions.map((session) => (
                  <div key={session.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border ${session.current ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 p-2 rounded-full ${session.current ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                        {session.device.includes("iPhone") || session.device.includes("Mobile") ? <Smartphone size={18} /> : <Monitor size={18} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-800">{session.device}</span>
                          {session.current && <span className="text-[9px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">Current Session</span>}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium mt-1 flex flex-wrap gap-x-3 gap-y-1">
                          <span className="font-semibold text-slate-700">{session.browser}</span>
                          <span className="flex items-center gap-1"><Globe size={10} /> {session.location}</span>
                          <span className="font-mono">{session.ip}</span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">Last Active: {session.lastActive}</div>
                      </div>
                    </div>
                    
                    {!session.current && (
                      <button 
                        onClick={() => handleRevokeSession(session.id)}
                        className="mt-4 sm:mt-0 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 transition-colors self-start sm:self-auto"
                      >
                        <LogOut size={14} /> Revoke
                      </button>
                    )}
                  </div>
                ))}

                {activeSessions.length === 1 && (
                  <div className="p-6 text-center text-slate-400 text-xs font-medium bg-slate-50 border border-slate-100 rounded-xl mt-4">
                    No other active sessions found.
                  </div>
                )}
              </div>
            </div>
          )}

          {profileTab === "activity" && (
            <div className="flex flex-col gap-6 animate-fadeIn">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm">Your Important Actions</h3>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xl leading-relaxed">
                  This log contains a curated list of high-level administrative actions performed by your account. For full system audit logs, visit the Analytics module.
                </p>
              </div>

              <div className="relative border-l-2 border-slate-100 ml-3 pl-6 flex flex-col gap-6">
                {activityLogs.map((log, i) => (
                  <div key={i} className="relative">
                    <span className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      log.type === 'status' ? 'bg-rose-500' :
                      log.type === 'complaint' ? 'bg-amber-500' :
                      log.type === 'impersonation' ? 'bg-purple-500' :
                      log.type === 'category' ? 'bg-indigo-500' :
                      'bg-emerald-500'
                    }`} />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-800">{log.act}</span>
                      <span className="text-[10px] text-slate-400 font-mono font-medium">{log.dt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
