import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ color: '#38bdf8', margin: 0, fontSize: '20px' }}>HRC Hub Admin</h2>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Super Admin Portal</span>
        </div>
        <nav style={{ flex: 1, padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <Link to="/dashboard" style={{ padding: '10px', color: '#cbd5e1', textDecoration: 'none', borderRadius: '4px' }}>Dashboard</Link>
          <Link to="/owners" style={{ padding: '10px', color: '#cbd5e1', textDecoration: 'none', borderRadius: '4px' }}>Owners</Link>
          <Link to="/vendors" style={{ padding: '10px', color: '#cbd5e1', textDecoration: 'none', borderRadius: '4px' }}>Vendors</Link>
          <Link to="/service-providers" style={{ padding: '10px', color: '#cbd5e1', textDecoration: 'none', borderRadius: '4px' }}>Service Providers</Link>
          <Link to="/manpower-agents" style={{ padding: '10px', color: '#cbd5e1', textDecoration: 'none', borderRadius: '4px' }}>Manpower Agents</Link>
          <Link to="/marketing-partners" style={{ padding: '10px', color: '#cbd5e1', textDecoration: 'none', borderRadius: '4px' }}>Marketing Partners</Link>
          <Link to="/categories" style={{ padding: '10px', color: '#cbd5e1', textDecoration: 'none', borderRadius: '4px' }}>Categories</Link>
          <Link to="/users" style={{ padding: '10px', color: '#cbd5e1', textDecoration: 'none', borderRadius: '4px' }}>Users</Link>
          <Link to="/orders" style={{ padding: '10px', color: '#cbd5e1', textDecoration: 'none', borderRadius: '4px' }}>Orders</Link>
          <Link to="/reports" style={{ padding: '10px', color: '#cbd5e1', textDecoration: 'none', borderRadius: '4px' }}>Reports</Link>
          <Link to="/settings" style={{ padding: '10px', color: '#cbd5e1', textDecoration: 'none', borderRadius: '4px' }}>Settings</Link>
        </nav>
        <div style={{ padding: '20px', borderTop: '1px solid #334155' }}>
          <button 
            onClick={() => navigate('/login')} 
            style={{ width: '100%', padding: '8px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
