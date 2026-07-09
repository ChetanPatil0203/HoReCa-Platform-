import React from 'react';

export default function Login() {
  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '100px auto', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
      <h2 style={{ color: '#38bdf8', marginBottom: '20px' }}>Super Admin Sign In</h2>
      <p style={{ fontSize: '14px', color: '#94a3b8' }}>Access HoReCa Hub Administrative Controls</p>
      <form onSubmit={(e) => { e.preventDefault(); window.location.href = '/dashboard'; }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#cbd5e1' }}>Email</label>
          <input type="email" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' }} defaultValue="admin@hrchub.com" />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#cbd5e1' }}>Password</label>
          <input type="password" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' }} defaultValue="••••••••" />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
}
