import React, { useState } from 'react';
import {
  Code2,
  ChevronDown,
  ChevronUp,
  Play,
  Copy,
  CheckCircle2,
  Lock,
  ExternalLink,
  Layers
} from 'lucide-react';
import { API_DOCUMENTATION } from '../../utils/demoData';
import { useToast } from '../../context/ToastContext';

export const ApiDocsPage = () => {
  const toast = useToast();
  const [openEndpoint, setOpenEndpoint] = useState(null);
  const [executedResponses, setExecutedResponses] = useState({});

  const toggleEndpoint = (key) => {
    setOpenEndpoint(openEndpoint === key ? null : key);
  };

  const handleExecute = (key, ep) => {
    // Generate realistic JSON response based on endpoint
    let responseData = {};
    if (ep.path.includes('/patients')) {
      responseData = [
        { id: 'PAT-1001', name: 'James Wilson', age: 48, gender: 'Male', bloodGroup: 'O+', status: 'Active' },
        { id: 'PAT-1002', name: 'Eleanor Vance', age: 34, gender: 'Female', bloodGroup: 'A+', status: 'Admitted' }
      ];
    } else if (ep.path.includes('/doctors')) {
      responseData = [
        { id: 'DOC-201', name: 'Dr. Sarah Jenkins', department: 'Cardiology', room: 'Room 302', fee: 120, status: 'Available' },
        { id: 'DOC-202', name: 'Dr. Marcus Brody', department: 'Neurology', room: 'Room 410', fee: 150, status: 'In Consultation' }
      ];
    } else if (ep.path.includes('/appointments')) {
      responseData = {
        id: 'APT-3088',
        patientId: 'PAT-1001',
        doctorId: 'DOC-201',
        date: '2026-09-15',
        time: '10:00 AM',
        status: 'Scheduled',
        redisLockAcquired: true
      };
    } else if (ep.path.includes('/semantic')) {
      responseData = {
        query: 'chest tightness and elevated troponin',
        vectorDimensions: 1536,
        indexScanMs: 6.4,
        matches: [
          { recordId: 'REC-5001', cosineSimilarity: 0.94, diagnosis: 'Stage 1 Primary Hypertension & Sinus Tachycardia' },
          { recordId: 'REC-5002', cosineSimilarity: 0.72, diagnosis: 'Type 2 Diabetes Mellitus' }
        ]
      };
    } else if (ep.path.includes('/lab-tests')) {
      responseData = [
        { id: 'LAB-6001', testCode: 'LT-CBC-01', patient: 'James Wilson', status: 'Completed', priority: 'Normal' }
      ];
    } else if (ep.path.includes('/medicines')) {
      responseData = [
        { id: 'MED-7001', code: 'RX-LIS-10', name: 'Lisinopril 10mg', stockLevel: 420, minThreshold: 100, unitPrice: 12.50 }
      ];
    } else {
      responseData = [
        { invoiceNumber: 'INV-2026-00481', patient: 'James Wilson', totalAmount: 267.75, paymentStatus: 'Paid' }
      ];
    }

    setExecutedResponses((prev) => ({
      ...prev,
      [key]: {
        status: ep.method === 'POST' ? '201 Created' : '200 OK',
        timeMs: Math.floor(12 + Math.random() * 18),
        data: responseData,
        curl: `curl -X ${ep.method} "https://api.dhms-hospital.org${ep.path}" \\\n  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \\\n  -H "Content-Type: application/json"`
      }
    }));

    toast.success(`Executed ${ep.method} ${ep.path} via API Gateway`);
  };

  const getMethodBadgeStyle = (method) => {
    switch (method) {
      case 'GET': return { background: '#e0f2fe', color: '#0369a1', border: '#bae6fd' };
      case 'POST': return { background: '#dcfce7', color: '#15803d', border: '#bbf7d0' };
      case 'PUT': return { background: '#fef3c7', color: '#b45309', border: '#fde68a' };
      case 'DELETE': return { background: '#fee2e2', color: '#b91c1c', border: '#fecaca' };
      default: return { background: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">REST API Specifications (OpenAPI 3.0)</h1>
          <p className="page-subtitle">
            Interactive Swagger-compatible documentation for FastAPI, Spring Boot, and Node.js microservices.
          </p>
        </div>
        <div className="page-actions">
          <span style={{ fontSize: '0.8rem', background: '#f1f5f9', color: '#0f172a', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', fontFamily: 'monospace' }}>
            OAS 3.0.3 • v1.0.0
          </span>
        </div>
      </div>

      {/* Gateway Endpoint Overview Card */}
      <div className="card" style={{ marginBottom: '24px', background: '#0f172a', color: '#ffffff', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#38bdf8', color: '#0f172a', fontSize: '0.75rem', fontWeight: '800', padding: '2px 8px', borderRadius: '4px' }}>
                BASE URL
              </span>
              <code style={{ fontSize: '1rem', color: '#e2e8f0', fontFamily: 'monospace' }}>
                https://api.dhms-hospital.org/api/v1
              </code>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
              All endpoints require Bearer JWT authentication in the <code>Authorization</code> header, verified at the Kong Ingress proxy.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#38bdf8' }}>
            <Lock size={16} />
            <span>JWT Bearer RBAC Enforced</span>
          </div>
        </div>
      </div>

      {/* Categories Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {API_DOCUMENTATION.map((group, gIdx) => (
          <div key={gIdx} className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>
              {group.tag}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {group.endpoints.map((ep, eIdx) => {
                const key = `${gIdx}-${eIdx}`;
                const isOpen = openEndpoint === key;
                const badge = getMethodBadgeStyle(ep.method);
                const executed = executedResponses[key];

                return (
                  <div
                    key={key}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: isOpen ? '#f8fafc' : '#ffffff'
                    }}
                  >
                    {/* Header Bar */}
                    <div
                      onClick={() => toggleEndpoint(key)}
                      style={{
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        background: isOpen ? '#f1f5f9' : '#ffffff'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontWeight: '800',
                            fontSize: '0.75rem',
                            border: `1px solid ${badge.border}`,
                            background: badge.background,
                            color: badge.color,
                            minWidth: '60px',
                            textAlign: 'center'
                          }}
                        >
                          {ep.method}
                        </span>
                        <code style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>
                          {ep.path}
                        </code>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }} className="hide-mobile">
                          {ep.summary}
                        </span>
                      </div>

                      <div style={{ color: '#94a3b8' }}>
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>

                    {/* Expandable Endpoint Tester */}
                    {isOpen && (
                      <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', background: '#ffffff' }}>
                        <p style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '14px' }}>
                          <strong>Description:</strong> {ep.summary}
                        </p>

                        {ep.params && (
                          <div style={{ marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Parameters</span>
                            <pre style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                              {ep.params}
                            </pre>
                          </div>
                        )}

                        {ep.body && (
                          <div style={{ marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Request Body (application/json)</span>
                            <pre style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid #e2e8f0', marginTop: '4px', color: '#0369a1' }}>
                              {ep.body}
                            </pre>
                          </div>
                        )}

                        {/* Execute Action */}
                        <div style={{ margin: '16px 0' }}>
                          <button
                            onClick={() => handleExecute(key, ep)}
                            className="btn btn-primary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <Play size={14} /> Execute Request (Mock Gateway)
                          </button>
                        </div>

                        {/* Live Response Box */}
                        {executed && (
                          <div style={{ marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#16a34a' }}>
                                Server Response: {executed.status} ({executed.timeMs} ms)
                              </span>
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>HTTP/2 200</span>
                            </div>

                            <pre
                              style={{
                                background: '#0f172a',
                                color: '#38bdf8',
                                padding: '14px',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                overflowX: 'auto',
                                fontFamily: 'monospace'
                              }}
                            >
                              {JSON.stringify(executed.data, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
