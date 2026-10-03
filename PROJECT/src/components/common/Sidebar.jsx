import React from 'react';
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Calendar,
  BedDouble,
  FileText,
  FlaskConical,
  Pill,
  Receipt,
  BarChart3,
  Layers,
  Activity,
  Code,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Hospital
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ currentView, onNavigate, isCollapsed, onToggleCollapse }) => {
  const { role, logout } = useAuth();

  // Navigation Items
  const menuItems = [
    {
      group: 'MAIN DASHBOARD',
      items: [
        {
          id: `${(role || 'admin').toLowerCase().replace(' staff', '')}-dashboard`,
          label: `${role} Dashboard`,
          icon: LayoutDashboard,
          roles: ['Admin', 'Doctor', 'Receptionist', 'Laboratory Staff', 'Pharmacist', 'Patient']
        }
      ]
    },
    {
      group: 'CLINICAL OPERATIONS',
      items: [
        { id: 'patients', label: 'Patients', icon: Users, roles: ['Admin', 'Doctor', 'Receptionist', 'Laboratory Staff'] },
        { id: 'doctors', label: 'Doctors', icon: Stethoscope, roles: ['Admin', 'Doctor', 'Receptionist', 'Patient'] },
        { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['Admin', 'Doctor', 'Receptionist', 'Patient'] },
        { id: 'admissions', label: 'Admissions & Beds', icon: BedDouble, roles: ['Admin', 'Doctor', 'Receptionist', 'Patient'] },
        { id: 'records', label: 'Medical Records', icon: FileText, roles: ['Admin', 'Doctor', 'Laboratory Staff', 'Patient'] },
        { id: 'laboratory', label: 'Laboratory', icon: FlaskConical, roles: ['Admin', 'Doctor', 'Laboratory Staff', 'Patient'] },
        { id: 'pharmacy', label: 'Pharmacy & Stock', icon: Pill, roles: ['Admin', 'Doctor', 'Pharmacist', 'Patient'] },
        { id: 'billing', label: 'Billing & Invoices', icon: Receipt, roles: ['Admin', 'Receptionist', 'Pharmacist', 'Patient'] }
      ]
    },
    {
      group: 'DBSE & DISTRIBUTED SYSTEMS',
      items: [
        { id: 'architecture', label: 'System Architecture', icon: Layers, roles: ['Admin', 'Doctor', 'Receptionist', 'Laboratory Staff', 'Pharmacist', 'Patient'] },
        { id: 'monitoring', label: 'System Monitoring', icon: Activity, roles: ['Admin', 'Doctor', 'Receptionist', 'Laboratory Staff', 'Pharmacist', 'Patient'] },
        { id: 'api-docs', label: 'API Documentation', icon: Code, roles: ['Admin', 'Doctor', 'Receptionist', 'Laboratory Staff', 'Pharmacist', 'Patient'] },
        { id: 'reports', label: 'Analytics & Reports', icon: BarChart3, roles: ['Admin', 'Doctor', 'Receptionist', 'Pharmacist'] }
      ]
    },
    {
      group: 'SYSTEM & SETTINGS',
      items: [
        { id: 'profile', label: 'User Profile', icon: User, roles: ['Admin', 'Doctor', 'Receptionist', 'Laboratory Staff', 'Pharmacist', 'Patient'] },
        { id: 'settings', label: 'Settings', icon: Settings, roles: ['Admin', 'Doctor', 'Receptionist', 'Laboratory Staff', 'Pharmacist', 'Patient'] }
      ]
    }
  ];

  return (
    <aside
      className="sidebar no-print"
      style={{
        width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)',
        backgroundColor: 'var(--bg-sidebar)',
        color: '#94a3b8',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 95,
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: 'var(--topbar-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: isCollapsed ? '0' : '0 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div
          onClick={() => onNavigate('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
              flexShrink: 0
            }}
          >
            <Hospital size={22} />
          </div>

          {!isCollapsed && (
            <div>
              <div style={{ fontWeight: '800', color: '#ffffff', fontSize: '1.05rem', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                DHMS <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: '600' }}>v2.4</span>
              </div>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                Distributed Hospital System
              </div>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <button
            onClick={onToggleCollapse}
            style={{
              color: '#64748b',
              padding: '4px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
            title="Collapse sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      {/* Navigation Scrollable Body */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: isCollapsed ? '12px 6px' : '16px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {menuItems.map((group, gIdx) => {
          // Filter items allowed for current role
          const filteredItems = group.items.filter((item) =>
            item.roles.includes(role) || item.roles.includes('All')
          );

          if (!filteredItems.length) return null;

          return (
            <div key={gIdx}>
              {!isCollapsed && (
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    color: '#64748b',
                    letterSpacing: '0.08em',
                    padding: '0 10px 8px 10px'
                  }}
                >
                  {group.group}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    currentView === item.id ||
                    (item.id.endsWith('-dashboard') && currentView.endsWith('-dashboard'));

                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: isCollapsed ? '12px 0' : '10px 12px',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        borderRadius: 'var(--radius-md)',
                        color: isActive ? '#ffffff' : '#94a3b8',
                        backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                        fontWeight: isActive ? '600' : '500',
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.35)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
                          e.currentTarget.style.color = '#e2e8f0';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#94a3b8';
                        }
                      }}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon size={19} style={{ flexShrink: 0 }} />
                      {!isCollapsed && (
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Collapse button when collapsed */}
      {isCollapsed && (
        <div style={{ padding: '8px', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <button
            onClick={onToggleCollapse}
            style={{ color: '#94a3b8', cursor: 'pointer', padding: '6px' }}
            title="Expand sidebar"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Footer Role & Sign Out */}
      {!isCollapsed && (
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(15, 23, 42, 0.6)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  boxShadow: '0 0 8px #22c55e'
                }}
              />
              <span style={{ fontSize: '0.75rem', color: '#cbd5e1' }}>
                Cluster Node: <strong>US-EAST-01</strong>
              </span>
            </div>

            <button
              onClick={() => {
                logout();
                onNavigate('login');
              }}
              style={{
                color: '#ef4444',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem'
              }}
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
