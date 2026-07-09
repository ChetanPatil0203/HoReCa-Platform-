import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import OwnersList from './pages/owners/OwnersList';
import VendorsList from './pages/vendors/VendorsList';
import ServiceProvidersList from './pages/serviceProviders/ServiceProvidersList';
import ManpowerAgentsList from './pages/manpowerAgents/ManpowerAgentsList';
import MarketingPartnersList from './pages/marketingPartners/MarketingPartnersList';
import CategoriesList from './pages/categories/CategoriesList';
import UsersList from './pages/users/UsersList';
import OrdersList from './pages/orders/OrdersList';
import Reports from './pages/reports/Reports';
import Settings from './pages/settings/Settings';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Admin Dashboard Protected Routes Layout */}
        <Route 
          path="/*" 
          element={
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="owners" element={<OwnersList />} />
                <Route path="vendors" element={<VendorsList />} />
                <Route path="service-providers" element={<ServiceProvidersList />} />
                <Route path="manpower-agents" element={<ManpowerAgentsList />} />
                <Route path="marketing-partners" element={<MarketingPartnersList />} />
                <Route path="categories" element={<CategoriesList />} />
                <Route path="users" element={<UsersList />} />
                <Route path="orders" element={<OrdersList />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </AdminLayout>
          } 
        />
      </Routes>
    </Router>
  );
}
