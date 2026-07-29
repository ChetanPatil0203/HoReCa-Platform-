import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, ShieldCheck, ShieldAlert, KeyRound, Lock, Globe, MonitorCheck, Clock, History, Camera, Eye, EyeOff, X, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, LogOut, Laptop, Smartphone, MapPin, Check, Building2, User, Shield, Phone, Mail } from 'lucide-react';

export default function Profile() {
  const [profileTab, setProfileTab] = useState('profile'); // 'profile' | 'security' | 'sessions' | 'activity'
  const [toasts, setToasts] = useState([]);

  // Profile Information State
  const [fullName, setFullName] = useState('Admin User');
  const [email] = useState('admin@hrchub.com');
  const [phone, setPhone] = useState('+91 9856320427');
  const [employeeId] = useState('ADM-0012');
  const [department, setDepartment] = useState('Platform Operations');
  const [designation, setDesignation] = useState('Super Admin');
  const [joiningDate] = useState('24 Jul 2026');
  const [bio, setBio] = useState('Senior System Administrator responsible for global platform governance and operational compliance.');
  const [photo, setPhoto] = useState(null);

  // Edit Profile Modal State
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(fullName);
  const [editPhone, setEditPhone] = useState(phone);
  const [editDepartment, setEditDepartment] = useState(department);
  const [editDesignation, setEditDesignation] = useState(designation);
  const [editBio, setEditBio] = useState(bio);

  // Security States
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordLastChanged, setPasswordLastChanged] = useState('30 days ago');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(true);

  // 2FA Setup/Manage Modal State
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);

  // Active Sessions State
  const [activeSessions, setActiveSessions] = useState([
    {
      id: 'S1',
      device: 'Windows PC',
      browser: 'Chrome 126.0',
      location: 'Jalgaon, India',
      ip: '103.xxx.xxx.24',
      lastActive: 'Active now',
      current: true,
    },
    {
      id: 'S2',
      device: 'MacBook Pro',
      browser: 'Safari 17.4',
      location: 'Mumbai, India',
      ip: '49.xxx.xxx.88',
      lastActive: '2 hours ago',
      current: false,
    },
    {
      id: 'S3',
      device: 'iPhone 15 Pro',
      browser: 'HRC Admin App',
      location: 'Pune, India',
      ip: '115.xxx.xxx.12',
      lastActive: 'Yesterday at 04:20 PM',
      current: false,
    },
  ]);

  // Session Confirmation Modals
  const [revokingSession, setRevokingSession] = useState(null);
  const [revokeAllOpen, setRevokeAllOpen] = useState(false);

  // Security Alert State (Shows inside Security tab only when active)
  const [securityAlert, setSecurityAlert] = useState({
    active: false, // Set to true if a new sign-in alert is triggered
    title: 'New sign-in detected',
    details: 'Chrome on Windows · Mumbai, India',
    time: '24 Jul 2026 · 08:30 PM',
  });

  // Activity Filter State
  const [activityCategory, setActivityCategory] = useState('All'); // 'All' | 'Profile' | 'Security' | 'Sessions' | 'Access Changes'
  const [activityHistory, setActivityHistory] = useState([
    { id: 1, event: 'Profile Details Updated', category: 'Profile', actor: 'Admin User', date: '28 Jul 2026 · 10:30 AM', location: 'Jalgaon, India' },
    { id: 2, event: 'Two-Factor Authentication Enabled', category: 'Security', actor: 'Admin User', date: '20 Jul 2026 · 02:15 PM', location: 'Jalgaon, India' },
    { id: 3, event: 'Password Changed Successfully', category: 'Security', actor: 'Admin User', date: '28 Jun 2026 · 11:00 AM', location: 'Jalgaon, India' },
    { id: 4, event: 'New Login Detected from MacBook Pro', category: 'Sessions', actor: 'Admin User', date: '25 Jun 2026 · 09:45 AM', location: 'Mumbai, India' },
    { id: 5, event: 'Session Revoked (iPhone 14)', category: 'Sessions', actor: 'Admin User', date: '10 May 2026 · 03:00 PM', location: 'Jalgaon, India' },
  ]);

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  // Profile Edit Submission
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Full Name is required.', 'error');
      return;
    }
    if (editPhone && !/^\+?[0-9\s-]{10,15}$/.test(editPhone)) {
      showToast('Please enter a valid contact number.', 'error');
      return;
    }

    setFullName(editName.trim());
    setPhone(editPhone.trim());
    setDepartment(editDepartment.trim());
    setDesignation(editDesignation.trim());
    setBio(editBio.trim());

    // Record Activity
    setActivityHistory((prev) => [
      { id: Date.now(), event: 'Profile Updated', category: 'Profile', actor: editName.trim(), date: 'Just now', location: 'Current Session' },
      ...prev,
    ]);

    setEditProfileOpen(false);
    showToast('Profile updated successfully.', 'success');
  };

  // Photo Upload Handler
  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhoto(event.target.result);
        showToast('Profile photo updated.', 'success');
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Password Strength Logic
  const passwordStrength = useMemo(() => {
    if (!newPassword) return { score: 0, label: 'None', color: 'bg-slate-200' };
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (/[A-Z]/.test(newPassword)) score += 1;
    if (/[0-9]/.test(newPassword)) score += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) score += 1;

    if (score === 1) return { score: 25, label: 'Weak', color: 'bg-rose-500 w-1/4' };
    if (score === 2) return { score: 50, label: 'Fair', color: 'bg-amber-500 w-2/4' };
    if (score === 3) return { score: 75, label: 'Good', color: 'bg-blue-500 w-3/4' };
    return { score: 100, label: 'Strong', color: 'bg-emerald-500 w-full' };
  }, [newPassword]);

  // Password Change Submission
  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all password fields.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirm password do not match.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      showToast('New password must be at least 8 characters long.', 'error');
      return;
    }

    setPasswordLastChanged('Just now');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordModalOpen(false);

    setActivityHistory((prev) => [
      { id: Date.now(), event: 'Password Changed', category: 'Security', actor: fullName, date: 'Just now', location: 'Current Session' },
      ...prev,
    ]);

    showToast('Password updated successfully.', 'success');
  };

  // Session Revoke Single
  const handleConfirmRevokeSingle = () => {
    if (!revokingSession) return;
    const target = revokingSession;

    setActiveSessions((prev) => prev.filter((s) => s.id !== target.id));
    setActivityHistory((prev) => [
      { id: Date.now(), event: `Session Revoked (${target.device})`, category: 'Sessions', actor: fullName, date: 'Just now', location: target.location },
      ...prev,
    ]);

    setRevokingSession(null);
    showToast(`Signed out session from ${target.device}.`, 'success');
  };

  // Session Revoke All Other
  const handleConfirmRevokeAllOther = () => {
    setActiveSessions((prev) => prev.filter((s) => s.current));
    setActivityHistory((prev) => [
      { id: Date.now(), event: 'Signed Out All Other Device Sessions', category: 'Sessions', actor: fullName, date: 'Just now', location: 'Current Session' },
      ...prev,
    ]);

    setRevokeAllOpen(false);
    showToast('Signed out of all other active sessions.', 'success');
  };

  // Filtered Activity List
  const filteredActivity = useMemo(() => {
    if (activityCategory === 'All') return activityHistory;
    return activityHistory.filter((a) => a.category === activityCategory);
  }, [activityHistory, activityCategory]);

  return (
    <div className="flex flex-col gap-5 animate-fadeIn pb-12 text-slate-800 max-w-[1280px] mx-auto w-full">
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

      {/* Compact Normal Page Header (No dark hero banner card) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-[#E3E9F1] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#071B3A] text-white flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <h1 className="text-xl font-extrabold text-[#071B3A] tracking-tight">Profile & Security</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">Manage your administrator profile, password and active sessions.</p>
        </div>

        <button
          onClick={() => {
            setEditName(fullName);
            setEditPhone(phone);
            setEditDepartment(department);
            setEditDesignation(designation);
            setEditBio(bio);
            setEditProfileOpen(true);
          }}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] rounded-xl shadow-xs transition-all cursor-pointer min-h-[42px] active:scale-95 self-end sm:self-auto"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Top Compact Profile Summary Card */}
      <div className="bg-white border border-[#E3E9F1] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-[#071B3A] text-white flex items-center justify-center font-extrabold text-xl shadow-xs overflow-hidden border-2 border-white">
              {photo ? (
                <img src={photo} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              )}
            </div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-extrabold text-[#071B3A]">{fullName}</h2>
              <span className="text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-md">
                {designation}
              </span>
              <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                Active
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">{email}</div>
            <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Last login: Today · 10:42 AM</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setEditName(fullName);
            setEditPhone(phone);
            setEditDepartment(department);
            setEditDesignation(designation);
            setEditBio(bio);
            setEditProfileOpen(true);
          }}
          className="px-3.5 py-1.5 text-xs font-bold text-[#071B3A] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer self-end sm:self-center"
        >
          Edit Details
        </button>
      </div>

      {/* Mandatory Four Status Tabs */}
      <div className="bg-white border border-[#E3E9F1] rounded-2xl p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {[
          { label: 'Profile', key: 'profile', icon: User },
          { label: 'Security', key: 'security', icon: KeyRound },
          { label: 'Active Sessions', key: 'sessions', icon: Globe, count: activeSessions.length },
          { label: 'Activity', key: 'activity', icon: History },
        ].map((t) => {
          const isActive = profileTab === t.key;
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setProfileTab(t.key)}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-[#071B3A] text-white shadow-xs'
                  : 'bg-slate-100/70 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-200/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{t.label}</span>
              {t.count !== undefined && (
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {t.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Section */}
      <div className="space-y-5">
        {/* TAB 1: PROFILE (Read-only by default) */}
        {profileTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
            {/* Personal Information */}
            <div className="bg-white border border-[#E3E9F1] rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-[#071B3A]" />
                  Personal Information
                </h3>
                <button
                  onClick={() => {
                    setEditName(fullName);
                    setEditPhone(phone);
                    setEditDepartment(department);
                    setEditDesignation(designation);
                    setEditBio(bio);
                    setEditProfileOpen(true);
                  }}
                  className="text-xs font-bold text-[#071B3A] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Full Name</span>
                  <span className="font-extrabold text-slate-800 block mt-0.5">{fullName}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Email Address</span>
                  <span className="font-extrabold text-slate-800 block mt-0.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {email}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Contact Number</span>
                  {phone ? (
                    <span className="font-extrabold text-slate-800 block mt-0.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {phone}
                    </span>
                  ) : (
                    <span className="font-semibold text-slate-400 italic block mt-0.5">Not added</span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Bio / About</span>
                  {bio ? (
                    <p className="font-medium text-slate-700 block mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      {bio}
                    </p>
                  ) : (
                    <span className="font-semibold text-slate-400 italic block mt-0.5">Not added</span>
                  )}
                </div>
              </div>
            </div>

            {/* Organisation Information */}
            <div className="bg-white border border-[#E3E9F1] rounded-2xl p-5 space-y-4 shadow-xs">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#071B3A]" />
                  Organisation Information
                </h3>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Employee ID</span>
                  <span className="font-extrabold text-slate-800 font-mono block mt-0.5">{employeeId}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Department</span>
                  <span className="font-extrabold text-slate-800 block mt-0.5">{department}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Designation</span>
                  <span className="font-extrabold text-slate-800 block mt-0.5">{designation}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Joining Date</span>
                  <span className="font-extrabold text-slate-800 block mt-0.5">{joiningDate}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Role</span>
                  <span className="font-extrabold text-slate-800 block mt-0.5">
                    Super Admin <span className="text-[10px] text-slate-400 font-normal">(Read-only)</span>
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Module Access</span>
                  <span className="font-extrabold text-slate-800 block mt-0.5">
                    All Modules <span className="text-[10px] text-slate-400 font-normal">(Full Governance Privileges)</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SECURITY */}
        {profileTab === 'security' && (
          <div className="space-y-4 animate-fadeIn max-w-3xl">
            {/* Compact Security Overview Status Banner */}
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-emerald-900">Account security is strong</h3>
                <p className="text-xs text-emerald-700 font-medium mt-0.5">
                  Your password and verified contact details are protecting your account.
                </p>
              </div>
            </div>

            {/* Security Alert Banner (Displayed only when active) */}
            {securityAlert.active && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900">{securityAlert.title}</h4>
                    <p className="text-[11px] text-amber-700 font-medium">
                      {securityAlert.details} · {securityAlert.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setSecurityAlert((prev) => ({ ...prev, active: false }));
                      showToast('Security alert acknowledged.', 'info');
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-amber-800 bg-white border border-amber-300 rounded-xl cursor-pointer"
                  >
                    This Was Me
                  </button>
                  <button
                    onClick={() => {
                      setSecurityAlert((prev) => ({ ...prev, active: false }));
                      setPasswordModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl cursor-pointer shadow-xs"
                  >
                    Secure Account
                  </button>
                </div>
              </div>
            )}

            {/* Essential Security Control Rows */}
            <div className="bg-white border border-[#E3E9F1] rounded-2xl divide-y divide-slate-100 shadow-xs">
              {/* Row 1: Password */}
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#071B3A] flex items-center justify-center shrink-0">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Password</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Last changed {passwordLastChanged}</p>
                  </div>
                </div>

                <button
                  onClick={() => setPasswordModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-bold text-[#071B3A] bg-slate-100 hover:bg-[#071B3A] hover:text-white rounded-xl transition-all cursor-pointer min-h-[36px]"
                >
                  Change Password
                </button>
              </div>

              {/* Row 2: Two-Factor Authentication */}
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">Two-Factor Authentication</h4>
                      <span className={`text-[10px] font-extrabold px-2 py-0.2 rounded border ${twoFactorEnabled ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {twoFactorEnabled ? 'Enabled' : 'Not Enabled'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Add an extra verification step when signing in.</p>
                  </div>
                </div>

                <button
                  onClick={() => setTwoFactorModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer min-h-[36px]"
                >
                  {twoFactorEnabled ? 'Manage 2FA' : 'Set Up 2FA'}
                </button>
              </div>

              {/* Row 3: Email Verification */}
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Email Verification</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{email}</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Verified
                </span>
              </div>

              {/* Row 4: Mobile Verification */}
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Mobile Verification</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{phone || 'Mobile number not added'}</p>
                  </div>
                </div>

                {phone ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setEditName(fullName);
                      setEditPhone(phone);
                      setEditDepartment(department);
                      setEditDesignation(designation);
                      setEditBio(bio);
                      setEditProfileOpen(true);
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-[#071B3A] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer min-h-[36px]"
                  >
                    Add Mobile
                  </button>
                )}
              </div>

              {/* Row 5: Login Alerts */}
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Login Alerts</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Receive email notifications for new or unusual sign-ins.</p>
                  </div>
                </div>

                {/* Preference Toggle Switch */}
                <button
                  onClick={() => {
                    setLoginAlertsEnabled(!loginAlertsEnabled);
                    showToast(`Login alerts ${!loginAlertsEnabled ? 'enabled' : 'disabled'}.`, 'info');
                  }}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    loginAlertsEnabled ? 'bg-[#071B3A]' : 'bg-slate-200'
                  }`}
                  title="Toggle Login Alerts Preference"
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      loginAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACTIVE SESSIONS */}
        {profileTab === 'sessions' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-2xl border border-[#E3E9F1] shadow-xs">
              <div>
                <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider">Active Device Sessions</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Manage and revoke active login sessions across your devices.</p>
              </div>

              {activeSessions.length > 1 && (
                <button
                  onClick={() => setRevokeAllOpen(true)}
                  className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer shrink-0"
                >
                  Sign Out All Other Sessions
                </button>
              )}
            </div>

            {/* Session List Container */}
            <div className="bg-white border border-[#E3E9F1] rounded-2xl divide-y divide-slate-100 shadow-xs overflow-hidden">
              {activeSessions.length > 0 ? (
                activeSessions.map((s) => (
                  <div key={s.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#071B3A] flex items-center justify-center shrink-0">
                        {s.device.includes('Mac') || s.device.includes('PC') ? <Laptop className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-slate-900">{s.device}</h4>
                          {s.current && (
                            <span className="text-[10px] font-extrabold px-2 py-0.2 rounded bg-blue-50 border border-blue-200 text-blue-800">
                              Current Session
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {s.browser} · {s.location}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          IP: {s.ip} · Last active: {s.lastActive}
                        </div>
                      </div>
                    </div>

                    <div className="self-end sm:self-center">
                      {s.current ? (
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 inline-block">
                          Current Device
                        </span>
                      ) : (
                        <button
                          onClick={() => setRevokingSession(s)}
                          className="px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                        >
                          Sign Out
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                /* Compact Empty State for Sessions */
                <div className="p-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <MonitorCheck className="w-8 h-8 text-slate-400 stroke-[1.5]" />
                    <h3 className="text-sm font-bold text-slate-800">No other active sessions</h3>
                    <p className="text-xs text-slate-500">Your account is signed in only on this device.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ACTIVITY HISTORY */}
        {profileTab === 'activity' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Filter Pills */}
            <div className="bg-white border border-[#E3E9F1] rounded-2xl p-3 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
              <span className="text-xs font-bold text-slate-400 uppercase px-2 shrink-0">Category:</span>
              {['All', 'Profile', 'Security', 'Sessions', 'Access Changes'].map((cat) => {
                const isActive = activityCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActivityCategory(cat)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                      isActive ? 'bg-[#071B3A] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 border border-slate-200/60'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Timeline */}
            <div className="bg-white border border-[#E3E9F1] rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-extrabold text-[#071B3A] uppercase tracking-wider mb-4">Account Governance Timeline</h3>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {filteredActivity.length > 0 ? (
                  filteredActivity.map((a) => (
                    <div key={a.id} className="relative">
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-[#071B3A] ring-4 ring-white" />
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-0.5">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-slate-900">{a.event}</span>
                          <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {a.category}
                          </span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-500 font-medium pt-1">
                          <span>Actor: {a.actor} · {a.location}</span>
                          <span>{a.date}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs font-semibold text-slate-400">No activity logs recorded for this category.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editProfileOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditProfileOpen(false)}
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
                    <Pencil className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Edit Profile</h3>
                </div>

                <button onClick={() => setEditProfileOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3">
                {/* Photo Upload Row */}
                <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  <div className="w-14 h-14 rounded-xl bg-[#071B3A] text-white flex items-center justify-center font-extrabold text-base overflow-hidden shrink-0">
                    {photo ? <img src={photo} alt="Avatar" className="w-full h-full object-cover" /> : editName.substring(0, 2).toUpperCase()}
                  </div>

                  <div>
                    <label htmlFor="modalPhotoUpload" className="px-3 py-1.5 text-xs font-bold text-[#071B3A] bg-white border border-slate-300 rounded-xl cursor-pointer inline-block hover:bg-slate-100">
                      Upload Photo
                    </label>
                    <input type="file" id="modalPhotoUpload" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    <span className="text-[10px] text-slate-400 block mt-1">PNG or JPG max 2MB</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98563XXXXX"
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Designation</label>
                  <input
                    type="text"
                    value={editDesignation}
                    onChange={(e) => setEditDesignation(e.target.value)}
                    className="w-full text-xs font-semibold border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Bio / About (Max 250 chars)</label>
                  <textarea
                    rows={3}
                    maxLength={250}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A] resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditProfileOpen(false)}
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

      {/* Change Password Modal */}
      <AnimatePresence>
        {passwordModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPasswordModalOpen(false)}
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
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Change Password</h3>
                </div>

                <button onClick={() => setPasswordModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSavePassword} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Current Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs font-mono border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 pr-10 focus:outline-none focus:border-[#071B3A]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(!showPasswords)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    New Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs font-mono border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  />

                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-400 uppercase">Password Strength:</span>
                        <span className="text-slate-700">{passwordStrength.label}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-300 ${passwordStrength.color}`} />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Confirm New Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs font-mono border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 focus:outline-none focus:border-[#071B3A]"
                  />
                </div>

                <div className="text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="font-bold text-slate-700 block">Password Requirements:</span>
                  <div>• Minimum 8 characters long</div>
                  <div>• At least 1 uppercase & 1 lowercase letter</div>
                  <div>• At least 1 number & 1 special character</div>
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setPasswordModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] rounded-xl shadow-xs cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Two-Factor Authentication Management Modal */}
      <AnimatePresence>
        {twoFactorModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTwoFactorModalOpen(false)}
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
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Two-Factor Authentication</h3>
                </div>

                <button onClick={() => setTwoFactorModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                  <span className="font-bold text-blue-900 block">Current Status: {twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                  <p className="text-[11px] text-blue-700">
                    Two-factor authentication adds an additional security layer using your verified email or authenticator app.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <span className="font-bold text-slate-800">Email OTP Verification</span>
                    <input
                      type="radio"
                      name="2faType"
                      checked={twoFactorEnabled}
                      onChange={() => setTwoFactorEnabled(true)}
                      className="text-[#071B3A] focus:ring-[#071B3A]"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setTwoFactorModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setTwoFactorModalOpen(false);
                    showToast('Two-Factor Authentication settings saved.', 'success');
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#071B3A] hover:bg-[#0c2854] rounded-xl shadow-xs cursor-pointer"
                >
                  Save Preference
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Revoke Single Session Modal */}
      <AnimatePresence>
        {revokingSession && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRevokingSession(null)}
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
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Sign out this session?</h3>
                  <p className="text-xs text-slate-500 font-medium">{revokingSession.device} · {revokingSession.location}</p>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div><span className="font-bold">Browser:</span> {revokingSession.browser}</div>
                <div><span className="font-bold">IP Address:</span> {revokingSession.ip}</div>
                <div><span className="font-bold">Last Active:</span> {revokingSession.lastActive}</div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setRevokingSession(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRevokeSingle}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Sign Out Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Revoke All Other Sessions Modal */}
      <AnimatePresence>
        {revokeAllOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRevokeAllOpen(false)}
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
                  <LogOut className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Sign out all other sessions?</h3>
                  <p className="text-xs text-slate-500 font-medium">You will remain signed in on this device.</p>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setRevokeAllOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmRevokeAllOther}
                  className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Sign Out Other Sessions
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
