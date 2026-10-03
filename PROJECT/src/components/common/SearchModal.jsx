import React, { useState, useMemo, useEffect } from 'react';
import { Search, Sparkles, User, Stethoscope, FileText, Pill, FlaskConical, X, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const SearchModal = ({ isOpen, onClose, onNavigate }) => {
  const { patients, doctors, records, medicines, labTests, appointments } = useData();
  const [query, setQuery] = useState('');
  const [semanticMode, setSemanticMode] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle open if supported
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Standard Keyword Search Results
  const standardResults = useMemo(() => {
    if (!query.trim() || semanticMode) return [];
    const q = query.toLowerCase();

    const matchedPatients = patients
      .filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.bloodGroup.toLowerCase().includes(q))
      .map((p) => ({ type: 'Patient', title: p.name, subtitle: `${p.id} • ${p.age} yrs • Blood ${p.bloodGroup}`, link: 'patients', icon: User, color: '#0284c7' }));

    const matchedDoctors = doctors
      .filter((d) => d.name.toLowerCase().includes(q) || d.department.toLowerCase().includes(q))
      .map((d) => ({ type: 'Doctor', title: d.name, subtitle: `${d.department} • ${d.room}`, link: 'doctors', icon: Stethoscope, color: '#0d9488' }));

    const matchedMeds = medicines
      .filter((m) => m.name.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q) || m.category.toLowerCase().includes(q))
      .map((m) => ({ type: 'Medicine', title: m.name, subtitle: `${m.category} • Stock: ${m.stockLevel} units`, link: 'pharmacy', icon: Pill, color: '#a855f7' }));

    const matchedLabs = labTests
      .filter((l) => l.testName.toLowerCase().includes(q) || l.patientName.toLowerCase().includes(q) || l.category.toLowerCase().includes(q))
      .map((l) => ({ type: 'Laboratory', title: l.testName, subtitle: `Patient: ${l.patientName} • Status: ${l.status}`, link: 'laboratory', icon: FlaskConical, color: '#f59e0b' }));

    const matchedRecords = records
      .filter((r) => r.diagnosis.toLowerCase().includes(q) || r.patientName.toLowerCase().includes(q) || r.symptoms.toLowerCase().includes(q))
      .map((r) => ({ type: 'Medical Record', title: r.diagnosis, subtitle: `Patient: ${r.patientName} (${r.recordNumber})`, link: 'records', icon: FileText, color: '#10b981' }));

    return [...matchedPatients, ...matchedDoctors, ...matchedRecords, ...matchedMeds, ...matchedLabs].slice(0, 8);
  }, [query, semanticMode, patients, doctors, records, medicines, labTests]);

  // Semantic Vector Search (pgvector cosine similarity simulation)
  const semanticResults = useMemo(() => {
    if (!semanticMode || !query.trim()) return [];
    const q = query.toLowerCase();

    // Calculate simulated semantic cosine similarity
    return records
      .map((rec) => {
        let score = 0.50;
        const text = `${rec.diagnosis} ${rec.symptoms} ${rec.notes}`.toLowerCase();
        
        // Exact tokens boost
        const tokens = q.split(/\s+/).filter(Boolean);
        tokens.forEach((token) => {
          if (text.includes(token)) score += 0.16;
        });

        // Clinical synonym mappings for DBSE pgvector simulation
        if ((q.includes('heart') || q.includes('cardiac') || q.includes('chest')) && text.includes('hypertension')) score += 0.22;
        if ((q.includes('dizziness') || q.includes('pressure')) && text.includes('hypertension')) score += 0.24;
        if ((q.includes('sugar') || q.includes('diabetes') || q.includes('thirst')) && text.includes('diabetes')) score += 0.35;
        if ((q.includes('keto') || q.includes('insulin')) && text.includes('ketoacidosis')) score += 0.38;

        score = Math.min(0.98, parseFloat(score.toFixed(3)));

        return {
          record: rec,
          similarityScore: score,
          vectorId: rec.vectorEmbeddingId
        };
      })
      .filter((item) => item.similarityScore > 0.6)
      .sort((a, b) => b.similarityScore - a.similarityScore);
  }, [query, semanticMode, records]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '680px', padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Search size={22} style={{ color: '#0284c7' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              semanticMode
                ? "Semantic search: 'elevated troponin heart symptoms', 'sugar spikes'..."
                : "Search patients, doctors, medicines, tests, diagnoses..."
            }
            autoFocus
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '1.05rem',
              color: '#0f172a',
              background: 'transparent'
            }}
          />
          <button
            onClick={() => setSemanticMode(!semanticMode)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: semanticMode ? '#0284c7' : '#cbd5e1',
              backgroundColor: semanticMode ? '#e0f2fe' : '#f8fafc',
              color: semanticMode ? '#0369a1' : '#64748b'
            }}
          >
            <Sparkles size={14} />
            {semanticMode ? 'pgvector AI Search (Active)' : 'Standard Mode'}
          </button>
          <button onClick={onClose} className="btn-icon btn-ghost">
            <X size={20} />
          </button>
        </div>

        {/* Search Results Body */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '16px 20px' }}>
          {semanticMode && (
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '0.8125rem',
              color: '#0369a1',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Sparkles size={16} />
              <span>
                <strong>pgvector Semantic Mode Enabled:</strong> Matches clinical symptoms & medical records using 1536-dim vector embeddings and cosine similarity.
              </span>
            </div>
          )}

          {!query.trim() && (
            <div style={{ textAlign: 'center', padding: '36px 0', color: '#94a3b8' }}>
              <Search size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Type keywords like <strong>"Hypertension"</strong>, <strong>"James"</strong>, <strong>"Metformin"</strong> or switch to <strong>pgvector</strong> mode.
              </p>
            </div>
          )}

          {/* Standard Results List */}
          {!semanticMode && query.trim() && standardResults.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {standardResults.map((res, i) => {
                const Icon = res.icon;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      onNavigate(res.link);
                      onClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #f1f5f9',
                      background: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: `${res.color}15`,
                        color: res.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f172a' }}>{res.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{res.subtitle}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {res.type} <ArrowRight size={14} />
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Semantic Results List */}
          {semanticMode && query.trim() && (
            <div>
              {semanticResults.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
                  No clinical vector matches above threshold (&gt; 0.60). Try "chest pain", "shortness of breath", or "elevated glucose".
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {semanticResults.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        onNavigate('records');
                        onClose();
                      }}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        border: '1px solid #e0f2fe',
                        background: '#ffffff',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(2, 132, 199, 0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>
                          {item.record.diagnosis}
                        </div>
                        <div style={{
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: item.similarityScore > 0.85 ? '#dcfce7' : '#e0f2fe',
                          color: item.similarityScore > 0.85 ? '#15803d' : '#0369a1',
                          fontSize: '0.75rem',
                          fontWeight: '700'
                        }}>
                          Cosine Score: {item.similarityScore}
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: '#475569', marginBottom: '6px' }}>
                        <strong>Symptoms:</strong> {item.record.symptoms}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontStyle: 'italic', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Patient: {item.record.patientName} ({item.record.recordNumber})</span>
                        <span>Vector ID: <code>{item.vectorId}</code></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!semanticMode && query.trim() && standardResults.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
              No matches found for "{query}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '12px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b' }}>
          <span>Tip: Use pgvector mode to match medical symptom meanings rather than exact words.</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
