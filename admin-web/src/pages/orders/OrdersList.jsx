import React from 'react';

export default function OrdersList() {
  return (
    <div>
      <h1 style={{ color: '#38bdf8' }}>Platform Orders</h1>
      <p style={{ color: '#94a3b8' }}>Monitor supply transactions, service contracts, escrow payments, and refunds.</p>
      <div style={{ padding: '20px', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', color: '#cbd5e1' }}>
        No orders processed yet.
      </div>
    </div>
  );
}
