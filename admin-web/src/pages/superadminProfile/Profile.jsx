import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShieldCheck, ShieldAlert, Monitor, Smartphone, Globe,
  LogOut, CheckCircle, Clock, History, Camera, Key, Lock,
  Unlock, Eye, EyeOff, AlertTriangle, Settings, Laptop, MapPin,
  Shield, Check, Info, FileText
} from 'lucide-react';

export default function Profile() {
  const [profileTab, setProfileTab] = useState("info");
  const [toasts, setToasts] = useState([]);

  // Profile Information States
  const [profileName, setProfileName] = useState("Sarah Connor");
  const [profileEmail, setProfileEmail] = useState("sarah@hrchub.com");
  const [profilePhone, setProfilePhone] = useState("+91 99999 11111");
  const [employeeId, setEmployeeId] = useState("EMP-98210");
  const [department, setDepartment] = useState("Information Technology");
  const [designation, setDesignation] = useState("Lead Systems Security Admin");
  const [joiningDate, setJoiningDate] = useState("2025-01-10");
  const [bio, setBio] = useState("Super Admin operator managing HRC HUB directory catalog, safety policies, support desk routing, and escrow verification operations.");
  const [photo, setPhoto] = useState(null);

  // Security States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  // Mock Active Sessions
  const [activeSessions, setActiveSessions] = useState([
    { id: "S1", device: "MacBook Pro 16\"", browser: "Chrome 126", location: "Mumbai, India", loginTime: "17 Jul 2026, 03:00 PM", status: "Active", current: true },
    { id: "S2", device: "iPhone 15 Pro", browser: "Safari 17", location: "Pune, India", loginTime: "17 Jul 2026, 12:45 PM", status: "Active", current: false },
    { id: "S3", device: "ThinkPad T14", browser: "Firefox 125", location: "New Delhi, India", loginTime: "14 Jul 2026, 09:10 AM", status: "Inactive", current: false },
  ]);

  // Mock Activity Logs
  const [activityHistory, setActivityHistory] = useState([
    { id: 1, action: "Login Successful", time: "17 Jul 2026, 03:00 PM" },
    { id: 2, action: "Profile Updated", time: "17 Jul 2026, 02:30 PM" },
    { id: 3, action: "Password Changed", time: "12 May 2026, 11:15 AM" },
    { id: 4, action: "Email Updated", time: "10 Jan 2026, 09:30 AM" },
    { id: 5, action: "Role Updated", time: "05 Jan 2026, 02:15 PM" }
  ]);

  // Mock Security Alerts
  const [alerts] = useState([
    { id: 1, label: "Password Updated", desc: "Password credentials changed.", time: "12 May 2026, 11:15 AM" },
    { id: 2, label: "Last Login Successful", desc: "Access from verified IP.", time: "17 Jul 2026, 03:00 PM" },
    { id: 3, label: "New Device Login", desc: "Access on Safari/Mobile.", time: "17 Jul 2026, 12:45 PM" }
  ]);

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleRevokeSession = (id) => {
    setActiveSessions(prev => prev.filter(s => s.id !== id));
    showToast("Session logged out successfully.", "success");
  };

  const handleLogoutAllOther = () => {
    setActiveSessions(prev => prev.filter(s => s.current));
    showToast("Logged out of all other devices.", "info");
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target.result);
        showToast("Profile photo loaded successfully.", "success");
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Password strength logic
  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, label: "None", color: "bg-slate-200" };
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    if (score === 1) return { score: 25, label: "Weak", color: "bg-rose-500 w-1/4" };
    if (score === 2) return { score: 50, label: "Fair", color: "bg-amber-500 w-2/4" };
    if (score === 3) return { score: 75, label: "Good", color: "bg-blue-500 w-3/4" };
    return { score: 100, label: "Strong", color: "bg-emerald-500 w-full" };
  }, [newPassword]);

  // Security score
  const securityScore = useMemo(() => {
    let score = 70;
    if (passwordStrength.label === "Strong" || passwordStrength.label === "Good") score += 10;
    if (activeSessions.length <= 2) score += 10;
    return score;
  }, [passwordStrength, activeSessions]);

  // Profile completion
  const profileCompletion = useMemo(() => {
    let score = 60; // Name, email, phone
    if (employeeId && department && designation && joiningDate) score += 20;
    if (bio) score += 10;
    if (photo) score += 10;
    return score;
  }, [employeeId, department, designation, joiningDate, bio, photo]);

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
                  toast.type === "info" ? "border-blue-500/20 text-blue-800" : "border-rose-500/20 text-rose-800"
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
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-slate-700/50 relative overflow-hidden flex items-center gap-4">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 border border-blue-400/30 shrink-0 relative z-10">
          <ShieldCheck size={26} />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-black tracking-tight text-white">Profile & Security</h1>
          <p className="text-xs text-slate-300 mt-0.5 font-medium">Manage your personal credentials, workspace options, active device sessions, and login logs.</p>
        </div>
      </div>

      {/* Grid Layout containing: Left Menu, Central Section, and Right Summary Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Menu Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-2 bg-white border border-slate-200/60 p-4 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-2">Settings Sections</span>
          {[
            { id: "info", label: "Profile Information", icon: <CheckCircle size={15} /> },
            { id: "security", label: "Security Settings", icon: <Key size={15} /> },
            { id: "sessions", label: "Active Sessions", icon: <Globe size={15} /> },
            { id: "activity", label: "Activity History", icon: <History size={15} /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setProfileTab(tab.id)}
              className={`flex items-center gap-3 text-xs font-bold px-3 py-2.5 rounded-xl transition-all border text-left ${profileTab === tab.id
                  ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 font-black"
                  : "bg-white hover:bg-slate-50 text-slate-600 border-transparent hover:border-slate-100"
                }`}
            >
              <span className={profileTab === tab.id ? "text-white" : "text-slate-450"}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Central Content Panel */}
        <div className="lg:col-span-6 bg-white border border-slate-200/60 shadow-sm rounded-2xl p-6 min-h-[550px] flex flex-col">

          {profileTab === "info" && (
            <div className="flex flex-col gap-6 animate-fadeIn flex-1">
              <div>
                <h3 className="text-sm font-black text-slate-800 pb-2 border-b border-slate-100">Profile Information</h3>
                <p className="text-[10px] text-slate-455 mt-1 font-semibold">Update your administrator details, photos, and professional metadata.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <div className="relative group cursor-pointer overflow-hidden rounded-xl w-20 h-20 bg-slate-800 flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-sm">
                  {photo ? (
                    <img src={photo} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    profileName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  )}
                  <label htmlFor="photoUpload" className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-5 h-5 text-white" />
                    <span className="text-[8px] text-white uppercase font-bold mt-1">Upload</span>
                  </label>
                  <input
                    type="file"
                    id="photoUpload"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="text-xs font-black text-slate-800">{profileName}</h4>
                  <span className="inline-block text-[9px] font-extrabold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">Super Admin</span>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Employee profile linked with secure encryption.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-655">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Role & Permissions</label>
                  <input
                    type="text"
                    disabled
                    value="Super Admin (Global System Auditor)"
                    className="w-full px-3 py-2 border border-slate-105 bg-slate-50 text-slate-400 rounded-xl cursor-not-allowed font-bold"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Bio / About Profile</label>
                  <textarea
                    rows="3"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about your admin roles..."
                    className="w-full px-3 py-2 border border-slate-200 bg-slate-50/50 focus:bg-white rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    const timeline = [
                      { id: Date.now(), action: "Profile Updated", time: "Just now" },
                      ...activityHistory
                    ];
                    setActivityHistory(timeline);
                    showToast("Profile details updated successfully.", "success");
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {profileTab === "security" && (
            <div className="flex flex-col gap-6 animate-fadeIn flex-1">
              <div>
                <h3 className="text-sm font-black text-slate-800 pb-2 border-b border-slate-100">Security Settings</h3>
                <p className="text-[10px] text-slate-455 mt-1 font-semibold">Change your password credentials regularly to protect your super admin dashboard.</p>
              </div>

              <div className="space-y-4 flex-1">
                <div className="relative">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    >
                      {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  {/* Strength Meter */}
                  {newPassword && (
                    <div className="mt-2.5 space-y-1.5">
                      <div className="flex justify-between text-[9px] font-extrabold uppercase">
                        <span className="text-slate-450">Password Strength:</span>
                        <span className="text-slate-750">{passwordStrength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-350 ${passwordStrength.color}`} />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Confirm New Password</label>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    if (!currentPassword || !newPassword || !confirmPassword) {
                      showToast("Please fill in all password fields.", "error");
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      showToast("Confirm password does not match.", "error");
                      return;
                    }
                    const timeline = [
                      { id: Date.now(), action: "Password Changed", time: "Just now" },
                      ...activityHistory
                    ];
                    setActivityHistory(timeline);
                    showToast("Password updated successfully.", "success");
                    setCurrentPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}

          {profileTab === "sessions" && (
            <div className="flex flex-col gap-6 animate-fadeIn flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-black text-slate-800">Active Device Sessions</h3>
                  <p className="text-[10px] text-slate-455 mt-0.5 font-semibold">Revoke active sessions for devices linked to your admin profile.</p>
                </div>
                <button
                  onClick={handleLogoutAllOther}
                  className="px-3.5 py-1.5 border border-rose-200 text-rose-650 hover:bg-rose-50 text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs"
                >
                  Logout All Devices
                </button>
              </div>

              {/* Sessions Table */}
              <div className="border border-slate-200/60 rounded-xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[9px] uppercase font-bold text-slate-400 border-b border-slate-100">
                      <th className="p-3">Device</th>
                      <th className="p-3">Browser</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Login Time</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeSessions.map((s) => (
                      <tr key={s.id} className="border-b border-slate-50 font-semibold text-slate-600">
                        <td className="p-3 font-bold text-slate-800 flex items-center gap-1.5">
                          {s.device.includes("MacBook") || s.device.includes("ThinkPad") ? <Laptop size={14} /> : <Smartphone size={14} />}
                          {s.device}
                        </td>
                        <td className="p-3">{s.browser}</td>
                        <td className="p-3 text-slate-550 flex items-center gap-1 mt-0.5"><MapPin size={10} /> {s.location}</td>
                        <td className="p-3 text-[10px] font-medium text-slate-450">{s.loginTime}</td>
                        <td className="p-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${s.current ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-100 text-slate-650 border-slate-200'}`}>
                            {s.current ? "Current" : "Active"}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {!s.current ? (
                            <button
                              onClick={() => handleRevokeSession(s.id)}
                              className="text-xs text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded transition-colors font-bold"
                            >
                              Logout Session
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-455 font-bold">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {profileTab === "activity" && (
            <div className="flex flex-col gap-6 animate-fadeIn flex-1">
              <div>
                <h3 className="text-sm font-black text-slate-800 pb-2 border-b border-slate-100">Activity History</h3>
                <p className="text-[10px] text-slate-450 mt-1 font-semibold">Audit trail of critical configurations modified by your administrator credentials.</p>
              </div>

              <div className="relative border-l border-slate-200 ml-3 flex flex-col gap-5 pt-2 pb-2">
                {activityHistory.map((act) => (
                  <div key={act.id} className="relative pl-5">
                    <span className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-slate-350 ring-4 ring-white" />
                    <div className="flex flex-col text-xs font-semibold">
                      <span className="font-black text-slate-800">{act.action}</span>
                      <span className="text-[9px] font-bold text-slate-400 mt-0.5">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Side summary cards panel */}
        <div className="lg:col-span-3 flex flex-col gap-4">

          {/* Security Score Panel */}
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Security Score</h4>
            <div className="flex flex-col items-center justify-center py-2 relative">
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" strokeWidth="8" stroke="#f1f5f9" fill="transparent" />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    strokeWidth="8"
                    stroke={securityScore >= 80 ? "#10b981" : securityScore >= 60 ? "#f59e0b" : "#ef4444"}
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={(2 * Math.PI * 48) * (1 - securityScore / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-slate-850">{securityScore}%</span>
                  <span className="text-[8px] font-bold text-slate-450 uppercase tracking-wider">Score</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Strong Password
                </span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 font-extrabold uppercase">Verified</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Verified Email
                </span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 font-extrabold uppercase">Verified</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Verified Phone
                </span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 font-extrabold uppercase">Verified</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> Active Sessions
                </span>
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 font-extrabold uppercase">Healthy</span>
              </div>
            </div>
          </div>

          {/* Profile Completion Panel */}
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Profile Completion</h4>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Progress</span>
                <span>{profileCompletion}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${profileCompletion}%` }} />
              </div>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span className="text-slate-800">Basic Information</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span className="text-slate-800">Contact Details</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span className="text-slate-800">Security Settings</span>
              </div>
              <div className="flex items-center gap-2">
                {profileCompletion >= 90 ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                ) : (
                  <div className="w-3.5 h-3.5 border-2 border-slate-200 rounded-full flex-shrink-0" />
                )}
                <span className={profileCompletion >= 90 ? "text-slate-800" : "text-slate-400"}>Profile Completed</span>
              </div>
            </div>
          </div>

          {/* Security Alerts Panel */}
          <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Security Alerts</h4>

            <div className="space-y-3">
              {alerts.map((alrt) => (
                <div key={alrt.id} className="flex gap-2.5 items-start">
                  <div className="p-1 rounded mt-0.5 bg-blue-50 text-blue-600">
                    <ShieldAlert size={14} />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 block leading-tight">{alrt.label}</span>
                    <span className="text-[9px] text-slate-400 font-semibold block uppercase mt-0.5">{alrt.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
