import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  User,
  LogOut,
  Settings,
  Shield,
  Activity,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from './Badge';

export const Navbar = ({ onToggleSidebar, onOpenSearch, onNavigate }) => {
  const { currentUser, role, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotificationMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'STAT Lab Alert', time: '10m ago', text: 'hs-cTnI Cardiac Troponin exceeds threshold (0.082 ng/mL) for Liam Gallagher (ICU-04)', unread: true },
    { id: 2, title: 'New Admission Registered', time: '42m ago', text: 'Eleanor Vance assigned to Medical Ward Room 304-B', unread: true },
    { id: 3, title: 'Pharmacy Inventory Warning', time: '1h ago', text: 'Amoxicillin 500mg stock is critically low (18 capsules left)', unread: false },
    { id: 4, title: 'Redis Cache Warm-up', time: '2h ago', text: 'Distributed cache cluster achieved 94.6% hit ratio across microservices', unread: false }
  ];

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        background: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 90
      }}
    >
      {/* Left: Sidebar Toggle & Search Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          className="btn-icon btn-ghost"
          aria-label="Toggle navigation sidebar"
          style={{ color: '#475569' }}
        >
          <Menu size={20} />
        </button>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: 'var(--radius-full)',
            padding: '7px 16px',
            fontSize: '0.85rem',
            color: '#64748b',
            cursor: 'pointer',
            minWidth: '260px'
          }}
        >
          <Search size={16} style={{ color: '#94a3b8' }} />
          <span style={{ flex: 1, textAlign: 'left' }}>Global & pgvector search...</span>
          <kbd
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '0.7rem',
              color: '#475569',
              fontFamily: 'var(--font-mono)'
            }}
          >
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right: Architecture shortcuts, Role indicator, Notifications, User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Quick Engineering Shortcuts */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="no-print">
          <button
            onClick={() => onNavigate('architecture')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: '#f0fdfa',
              border: '1px solid #ccfbf1',
              color: '#0f766e',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            title="View Distributed Backend Topology"
          >
            <Layers size={14} />
            <span className="hide-mobile">Architecture</span>
          </button>

          <button
            onClick={() => onNavigate('monitoring')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              color: '#0369a1',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            title="View Prometheus & Grafana Health"
          >
            <Activity size={14} />
            <span className="hide-mobile">Monitoring</span>
          </button>
        </div>

        {/* Notifications Popover */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="btn-icon btn-ghost"
            style={{ position: 'relative', color: '#475569' }}
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ef4444'
              }}
            />
          </button>

          {showNotificationMenu && (
            <div
              style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '340px',
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-subtle)',
                zIndex: 110,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontWeight: '700', fontSize: '0.875rem', color: '#0f172a' }}>
                  Notifications (2 unread)
                </span>
                <span style={{ fontSize: '0.75rem', color: '#0284c7', cursor: 'pointer' }}>
                  Mark all read
                </span>
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: n.unread ? '#f8fafc' : '#ffffff',
                      fontSize: '0.8125rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <strong style={{ color: '#0f172a' }}>{n.title}</strong>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{n.time}</span>
                    </div>
                    <p style={{ color: '#475569', lineHeight: 1.4 }}>{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Trigger & Dropdown */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 8px',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              background: 'none',
              border: '1px solid transparent'
            }}
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ textAlign: 'left' }} className="hide-mobile">
              <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#0f172a', lineHeight: 1.2 }}>
                {currentUser?.name || 'User'}
              </div>
              <Badge status={role} text={role} dot={false} style={{ fontSize: '0.68rem', padding: '1px 6px' }} />
            </div>
            <ChevronDown size={14} style={{ color: '#94a3b8' }} />
          </button>

          {showProfileMenu && (
            <div
              style={{
                position: 'absolute',
                top: '52px',
                right: 0,
                width: '240px',
                background: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-subtle)',
                zIndex: 110,
                padding: '8px',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid #f1f5f9', marginBottom: '6px' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a' }}>{currentUser?.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{currentUser?.email}</div>
                <div style={{ fontSize: '0.72rem', color: '#0284c7', marginTop: '3px' }}>{currentUser?.title}</div>
              </div>

              <button
                onClick={() => {
                  onNavigate('profile');
                  setShowProfileMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  color: '#334155',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <User size={16} /> My Profile
              </button>

              <button
                onClick={() => {
                  onNavigate('settings');
                  setShowProfileMenu(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  color: '#334155',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Settings size={16} /> System Settings
              </button>

              <div style={{ height: '1px', background: '#f1f5f9', margin: '6px 0' }} />

              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                  onNavigate('login');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  color: '#ef4444',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fee2e2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
