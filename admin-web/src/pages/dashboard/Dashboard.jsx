import React from 'react';

export default function Dashboard() {
  return (
    <div>
      <h1 style={{ color: '#38bdf8' }}>Super Admin Dashboard</h1>
      <p style={{ color: '#94a3b8' }}>Real-time overview of the HoReCa platform performance, registrations, and transactions.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '30px' }}>
        <div style={{ padding: '20px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>Total Owners</h3>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#f8fafc' }}>124</span>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>Active Vendors</h3>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#f8fafc' }}>87</span>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>Service Providers</h3>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#f8fafc' }}>45</span>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#94a3b8' }}>Total Revenue</h3>
          <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#34d399' }}>$48,250</span>
        </div>
      </div>
    </div>
  );
}
