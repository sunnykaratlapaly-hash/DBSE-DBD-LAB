import React, { useState } from 'react';
import { Hospital, Lock, Mail, Eye, EyeOff, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { INITIAL_USERS } from '../../utils/demoData';

export const LoginPage = ({ onNavigate }) => {
  const { login } = useAuth();
  const toast = useToast();

  const [selectedRole, setSelectedRole] = useState('Admin');
  const [email, setEmail] = useState('admin@hospital.org');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // When clicking a demo role preset, update the credentials automatically
  const handleRoleSelect = (roleName) => {
    setSelectedRole(roleName);
    const demoUser = INITIAL_USERS.find((u) => u.role === roleName);
    if (demoUser) {
      setEmail(demoUser.email);
      setPassword('password123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const user = login(email, password, selectedRole);
      setIsLoading(false);
      toast.success(`Welcome back, ${user.name}! Authenticated as ${user.role}.`);

      // Redirect to the role-specific dashboard
      const target = `${user.role.toLowerCase().replace(' staff', '')}-dashboard`;
      onNavigate(target);
    }, 600);
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
          maxWidth: '480px',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.05)',
          border: '1px solid #e2e8f0',
          padding: '36px 32px'
        }}
      >
        {/* Hospital Branding */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
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
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
              marginBottom: '12px',
              cursor: 'pointer'
            }}
          >
            <Hospital size={28} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
            Sign In to DHMS
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Distributed Hospital Management System • Select your role below
          </p>
        </div>

        {/* Demo Role Selector Pills */}
        <div style={{ marginBottom: '22px' }}>
          <label className="form-label" style={{ marginBottom: '8px' }}>
            Select Access Role:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {['Admin', 'Doctor', 'Receptionist', 'Laboratory Staff', 'Pharmacist', 'Patient'].map((r) => {
              const isSelected = selectedRole === r;
              return (
                <button
                  type="button"
                  key={r}
                  onClick={() => handleRoleSelect(r)}
                  style={{
                    padding: '7px 4px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: isSelected ? '#0284c7' : '#e2e8f0',
                    backgroundColor: isSelected ? '#e0f2fe' : '#ffffff',
                    color: isSelected ? '#0369a1' : '#475569',
                    fontSize: '0.72rem',
                    fontWeight: isSelected ? '700' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="search-wrapper">
              <input
                type="email"
                className="form-input"
                style={{ paddingLeft: '38px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@hospital.org"
                required
              />
              <Mail size={16} className="search-icon" />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                style={{ fontSize: '0.75rem', color: '#0284c7', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Forgot password?
              </button>
            </div>
            <div className="search-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                style={{ paddingLeft: '38px', paddingRight: '38px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <Lock size={16} className="search-icon" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Security & JWT Notice */}
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.75rem',
              color: '#64748b'
            }}
          >
            <Shield size={16} style={{ color: '#0284c7', flexShrink: 0 }} />
            <span>
              Secure JWT authentication with role authorization & SHA-256 session token.
            </span>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : `Sign In as ${selectedRole}`}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Register prompt */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.8125rem', color: '#64748b' }}>
          Are you a new patient?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            style={{ color: '#0284c7', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Register an Account
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            style={{ fontSize: '0.78rem', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ← Back to Hospital Home
          </button>
        </div>
      </div>
    </div>
  );
};
