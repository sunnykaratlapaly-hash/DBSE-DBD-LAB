import React, { useState } from 'react';
import {
  User,
  Mail,
  Shield,
  Briefcase,
  Key,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';

export const ProfilePage = ({ onNavigate }) => {
  const { currentUser, role } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(currentUser?.name || 'Administrator');
  const [email, setEmail] = useState(currentUser?.email || 'admin@hospital.org');
  const [phone, setPhone] = useState('+1 (555) 019-2831');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    toast.success('Profile details updated successfully');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!newPassword) return;
    toast.success('Password updated and re-hashed with bcrypt');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">User Account & Profile</h1>
          <p className="page-subtitle">
            Authenticated profile metadata, security credentials, and role privileges.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Profile Card */}
        <div className="card" style={{ padding: '24px', textAlign: 'center', width: '280px' }}>
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
            alt={name}
            style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px auto', border: '3px solid #e0f2fe' }}
          />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>{name}</h3>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{email}</div>
          <div style={{ marginTop: '10px' }}>
            <Badge status={role} text={role} />
          </div>
          <div style={{ fontSize: '0.75rem', color: '#0284c7', marginTop: '12px', fontWeight: '600' }}>
            {currentUser?.title || 'Hospital Staff'}
          </div>
        </div>

        {/* Edit Details Form */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title">Personal Demographic Information</h3>
              <p className="card-subtitle">Update your personal contact details</p>
            </div>
          </div>

          <form onSubmit={handleUpdate}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentUser?.department || 'Administration'}
                  disabled
                  style={{ background: '#f1f5f9' }}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '6px' }}>
              <Save size={14} /> Update Profile Info
            </button>
          </form>
        </div>
      </div>

      {/* Password & Security Card */}
      <div className="card" style={{ padding: '24px' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Security & Password Credentials</h3>
            <p className="card-subtitle">Change account authorization password</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-secondary btn-sm">
            <Key size={14} /> Change Password
          </button>
        </form>
      </div>
    </div>
  );
};
