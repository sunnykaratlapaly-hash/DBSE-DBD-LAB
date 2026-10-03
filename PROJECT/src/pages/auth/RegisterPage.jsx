import React, { useState } from 'react';
import { Hospital, User, Mail, Phone, Lock, Eye, EyeOff, Shield, ArrowRight, HeartPulse } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const RegisterPage = ({ onNavigate }) => {
  const { register } = useAuth();
  const { addPatient } = useData();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    address: '',
    allergies: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // 1. Create Patient Record in distributed DataContext
      const newPatient = addPatient({
        name: formData.name,
        age: parseInt(formData.age) || 30,
        gender: formData.gender,
        phone: formData.phone,
        email: formData.email,
        bloodGroup: formData.bloodGroup,
        address: formData.address || 'Springfield Central',
        allergies: formData.allergies || 'None Known',
        emergencyContact: 'Family Member - ' + formData.phone
      });

      // 2. Register user session in AuthContext
      register({
        name: formData.name,
        email: formData.email,
        role: 'Patient'
      });

      setIsLoading(false);
      toast.success(`Account created successfully! Assigned ID: ${newPatient.id}`);
      onNavigate('patient-dashboard');
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
        padding: '32px 20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 20px 30px -10px rgba(15, 23, 42, 0.08)',
          border: '1px solid #e2e8f0',
          padding: '36px 32px'
        }}
      >
        {/* Header */}
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
            New Patient Registration
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b' }}>
            Create your digital medical record on the DHMS Distributed Network
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Eleanor Vance"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                placeholder="eleanor@email.com"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input
                type="number"
                name="age"
                className="form-input"
                value={formData.age}
                onChange={handleChange}
                placeholder="32"
                min="1"
                max="120"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group *</label>
              <select
                name="bloodGroup"
                className="form-select"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Known Allergies</label>
              <input
                type="text"
                name="allergies"
                className="form-input"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g. Penicillin, Peanuts"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <input
              type="text"
              name="address"
              className="form-input"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address, City, State"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="search-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 chars"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <div className="search-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="form-input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Patient Record...' : 'Complete Patient Registration'}
            {!isLoading && <ArrowRight size={16} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8125rem', color: '#64748b' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            style={{ color: '#0284c7', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
