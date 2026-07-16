import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/superadminDashboard/Dashboard';
import Verification from './pages/superadminVerification/Verification';
import Horeca from './pages/superadminHoreca/Horeca';
import Vendors from './pages/superadminVendors/Vendors';
import Complaints from './pages/superadminComplaints/Complaints';
import Team from './pages/superadminTeam/Team';

import Profile from './pages/superadminProfile/Profile';
import Limits from './pages/superadminLimits/Limits';

// Simple Route Guard for demo purposes
function ProtectedRoute({ children }) {
  const user = localStorage.getItem('hrchub_user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <AdminLayout>{children}</AdminLayout>;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Super Admin Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/verification" element={<ProtectedRoute><Verification /></ProtectedRoute>} />
        <Route path="/horeca" element={<ProtectedRoute><Horeca /></ProtectedRoute>} />
        <Route path="/vendors" element={<ProtectedRoute><Vendors /></ProtectedRoute>} />
        <Route path="/complaints" element={<ProtectedRoute><Complaints /></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
        <Route path="/limits" element={<ProtectedRoute><Limits /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Fallback routing */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
