import React from 'react';

export default function OwnersList() {
  return (
    <div>
      <h1 style={{ color: '#38bdf8' }}>Hotel, Restaurant & Cafe Owners</h1>
      <p style={{ color: '#94a3b8' }}>Manage registered HoReCa owners, their establishments, and subscription statuses.</p>
      <div style={{ padding: '20px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', color: '#cbd5e1' }}>
        No owners registered yet.
      </div>
    </div>
  );
}
