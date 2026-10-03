import React from 'react';
import { Shield, Stethoscope, UserCheck, FlaskConical, Pill, User, RotateCcw, Home, Code2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';

export const DemoRoleBar = ({ currentView, onNavigate }) => {
  const { role, switchRole } = useAuth();
  const { resetToDefaults } = useData();
  const toast = useToast();

  const roles = [
    { name: 'Admin', icon: Shield, dashboard: 'admin-dashboard' },
    { name: 'Doctor', icon: Stethoscope, dashboard: 'doctor-dashboard' },
    { name: 'Receptionist', icon: UserCheck, dashboard: 'receptionist-dashboard' },
    { name: 'Laboratory Staff', icon: FlaskConical, dashboard: 'lab-dashboard' },
    { name: 'Pharmacist', icon: Pill, dashboard: 'pharmacy-dashboard' },
    { name: 'Patient', icon: User, dashboard: 'patient-dashboard' }
  ];

  const handleRoleChange = (roleName, targetDashboard) => {
    switchRole(roleName);
    onNavigate(targetDashboard);
    toast.info(`Switched role to: ${roleName}`);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all demo data (patients, appointments, meds, bills) to initial state?')) {
      resetToDefaults();
      toast.success('Demo data successfully reset to initial records');
    }
  };

  return (
    <div className="demo-role-banner no-print">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontWeight: '700', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem' }}>
          <Code2 size={15} /> DBSE DEMO ROLE SWITCHER:
        </span>
        <div className="demo-role-pills">
          {roles.map((r) => {
            const Icon = r.icon;
            const isActive = role === r.name;
            return (
              <button
                key={r.name}
                onClick={() => handleRoleChange(r.name, r.dashboard)}
                className={`demo-role-btn ${isActive ? 'active' : ''}`}
                title={`Switch to ${r.name} view`}
              >
                <Icon size={12} />
                {r.name}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => onNavigate('landing')}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <Home size={13} /> Landing Page
        </button>

        <button
          onClick={handleResetData}
          style={{
            background: 'none',
            border: 'none',
            color: '#cbd5e1',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Reset database to initial records"
          onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
        >
          <RotateCcw size={13} /> Reset Demo DB
        </button>
      </div>
    </div>
  );
};
