import React from 'react';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = ({ onNavigate }) => {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '32px'
      }}
    >
      <div style={{ maxWidth: '480px' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: '#fee2e2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}
        >
          <ShieldAlert size={38} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
          404 - Page Not Found
        </h1>

        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '28px' }}>
          The requested clinical endpoint or view does not exist on the current distributed cluster node, or your authenticated role lacks access privileges.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button onClick={() => onNavigate('admin-dashboard')} className="btn btn-primary">
            <Home size={16} /> Return to Dashboard
          </button>
          <button onClick={() => onNavigate('landing')} className="btn btn-secondary">
            <ArrowLeft size={16} /> Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};
