import React from 'react';

export default function UsersList() {
  return (
    <div>
      <h1 style={{ color: '#38bdf8' }}>Platform Users</h1>
      <p style={{ color: '#94a3b8' }}>View and manage user credentials, security logging, and access tokens.</p>
      <div style={{ padding: '20px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', color: '#cbd5e1' }}>
        No users found.
      </div>
    </div>
  );
}
