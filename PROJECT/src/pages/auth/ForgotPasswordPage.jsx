import React, { useState } from 'react';
import { Hospital, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ForgotPasswordPage = ({ onNavigate }) => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success('Password recovery OTP sent to ' + email);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.08)',
          border: '1px solid #e2e8f0',
          padding: '36px 32px'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            onClick={() => onNavigate('landing')}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              marginBottom: '12px',
              cursor: 'pointer'
            }}
          >
            <Hospital size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
            Reset Password
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Enter your email to receive a password reset authorization link
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
              Check Your Inbox
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '24px' }}>
              We have dispatched a cryptographic password reset token to <strong>{email}</strong> via the Auth Service.
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Hospital Registered Email</label>
              <div className="search-wrapper">
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.org or patient@email.com"
                  required
                />
                <Mail size={16} className="search-icon" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '11px', marginTop: '8px' }}>
              Send Reset Link <ArrowRight size={16} />
            </button>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => onNavigate('login')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8125rem',
                  color: '#64748b',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
