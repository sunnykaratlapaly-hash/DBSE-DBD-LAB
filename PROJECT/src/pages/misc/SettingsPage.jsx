import React, { useState } from 'react';
import {
  Settings,
  Database,
  Shield,
  Bell,
  Save,
  CheckCircle2,
  Server,
  Zap,
  Globe
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const SettingsPage = () => {
  const toast = useToast();

  const [hospitalName, setHospitalName] = useState('DHMS Memorial Healthcare Network');
  const [tagline, setTagline] = useState('Distributed Clinical Systems & Research Hospital');
  const [pgUri, setPgUri] = useState('postgresql://dhms_admin:secret@pg-cluster-01.internal:5432/hospital_db');
  const [mongoUri, setMongoUri] = useState('mongodb+srv://dhms_telemetry:secret@mongo-cluster.internal/diagnostics');
  const [redisHost, setRedisHost] = useState('redis-cluster.internal:6379');
  const [vectorDim, setVectorDim] = useState('1536 (OpenAI text-embedding-3-small)');
  const [jwtExpiryHours, setJwtExpiryHours] = useState('24');
  const [enableAuditLogs, setEnableAuditLogs] = useState(true);

  const handleSave = (e) => {
    e.preventDefault();
    toast.success('Distributed system configurations saved and pushed to cluster nodes.');
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">System Settings & Infrastructure Config</h1>
          <p className="page-subtitle">
            Configure cluster database endpoints, distributed caching, security tokens, and hospital metadata.
          </p>
        </div>
        <div className="page-actions">
          <button onClick={handleSave} className="btn btn-primary btn-sm">
            <Save size={15} /> Save Cluster Settings
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Hospital Metadata */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Globe size={18} style={{ color: '#0284c7' }} /> Hospital Organization Settings
              </h3>
              <p className="card-subtitle">Displayed across landing pages, print invoices, and patient portals</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Hospital Name</label>
              <input
                type="text"
                className="form-input"
                value={hospitalName}
                onChange={(e) => setHospitalName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Hospital Tagline / Motto</label>
              <input
                type="text"
                className="form-input"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Distributed Database Endpoints */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Database size={18} style={{ color: '#0d9488' }} /> Distributed Database Topology Endpoints
              </h3>
              <p className="card-subtitle">Connection strings for primary relational, document, and cache clusters</p>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">PostgreSQL 16 Primary Connection URI</label>
            <input
              type="text"
              className="form-input"
              value={pgUri}
              onChange={(e) => setPgUri(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">MongoDB 7.0 Sharded Cluster URI</label>
            <input
              type="text"
              className="form-input"
              value={mongoUri}
              onChange={(e) => setMongoUri(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Redis Cache Cluster Host & Port</label>
              <input
                type="text"
                className="form-input"
                value={redisHost}
                onChange={(e) => setRedisHost(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">pgvector Embedding Dimensions</label>
              <input
                type="text"
                className="form-input"
                value={vectorDim}
                onChange={(e) => setVectorDim(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Security & Authentication Policies */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Shield size={18} style={{ color: '#8b5cf6' }} /> Security & JWT Token Policies
              </h3>
              <p className="card-subtitle">Session expiration and HIPAA audit compliance logging</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">JWT Token Expiration Window (Hours)</label>
              <input
                type="number"
                className="form-input"
                value={jwtExpiryHours}
                onChange={(e) => setJwtExpiryHours(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '24px' }}>
              <input
                type="checkbox"
                id="auditLog"
                checked={enableAuditLogs}
                onChange={(e) => setEnableAuditLogs(e.target.checked)}
              />
              <label htmlFor="auditLog" style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', cursor: 'pointer' }}>
                Enable Immutable Audit Logging in MongoDB (HIPAA Compliance)
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
