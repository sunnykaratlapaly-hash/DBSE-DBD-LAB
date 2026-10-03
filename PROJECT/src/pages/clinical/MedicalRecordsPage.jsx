import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  HeartPulse,
  Pill,
  FlaskConical,
  Sparkles,
  Calendar,
  User,
  Stethoscope,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';

export const MedicalRecordsPage = ({ onNavigate }) => {
  const { records, patients, doctors, addMedicalRecord } = useData();
  const { role, currentUser } = useAuth();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add EMR Form
  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [bp, setBp] = useState('120/80 mmHg');
  const [heartRate, setHeartRate] = useState('72 bpm');
  const [spo2, setSpo2] = useState('98%');
  const [temp, setTemp] = useState('98.6 °F');
  const [rxMedicine, setRxMedicine] = useState('');
  const [rxDosage, setRxDosage] = useState('');

  const filteredRecords = records.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.patientName.toLowerCase().includes(q) ||
      r.diagnosis.toLowerCase().includes(q) ||
      r.symptoms.toLowerCase().includes(q) ||
      r.recordNumber.toLowerCase().includes(q)
    );
  });

  const handleSaveRecord = (e) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === patientId) || patients[0];

    addMedicalRecord({
      patientId: pat.id,
      patientName: pat.name,
      doctorId: currentUser?.id || 'DOC-201',
      doctorName: currentUser?.name || 'Dr. Sarah Jenkins',
      department: currentUser?.department || 'General Medicine',
      diagnosis,
      symptoms,
      notes,
      vitals: { bp, heartRate, temp, spo2 },
      prescriptions: rxMedicine ? [{ medicine: rxMedicine, dosage: rxDosage, duration: '30 days' }] : []
    });

    toast.success(`Encounter record generated and pgvector embeddings calculated for ${pat.name}`);
    setIsAddModalOpen(false);
    setDiagnosis('');
    setSymptoms('');
    setNotes('');
  };

  const isDoctorOrAdmin = role === 'Doctor' || role === 'Admin';

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Electronic Medical Records (EMR)</h1>
          <p className="page-subtitle">
            Longitudinal clinical history, diagnostic notes, objective vitals, and vector-embedded clinical tokens.
          </p>
        </div>
        <div className="page-actions">
          {isDoctorOrAdmin && (
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={15} /> Create Clinical Record
            </button>
          )}
        </div>
      </div>

      {/* Semantic Embeddings Notice Banner */}
      <div
        style={{
          background: 'linear-gradient(90deg, #f0fdfa 0%, #f0f9ff 100%)',
          border: '1px solid #ccfbf1',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} style={{ color: '#0d9488' }} />
          <div>
            <div style={{ fontWeight: '700', color: '#0f766e', fontSize: '0.875rem' }}>
              pgvector High-Dimensional Embeddings Active
            </div>
            <div style={{ fontSize: '0.78rem', color: '#134e4a' }}>
              All diagnoses and clinician symptoms are automatically vectorized into 1536-dimensional float vectors for cosine similarity search.
            </div>
          </div>
        </div>
        <button onClick={() => onNavigate('architecture')} className="btn btn-teal btn-sm">
          Vector Architecture
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search EMR by clinical diagnosis, symptoms ('dizziness', 'fever'), or patient..."
          />
          <Search size={16} className="search-icon" />
        </div>
      </div>

      {/* Records Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredRecords.map((rec) => (
          <div
            key={rec.id}
            className="card"
            style={{ padding: '20px', cursor: 'pointer', transition: 'all 0.15s' }}
            onClick={() => setSelectedRecord(rec)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>{rec.diagnosis}</h3>
                  <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                    {rec.recordNumber}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  Patient: <strong style={{ color: '#0f172a' }}>{rec.patientName}</strong> ({rec.patientId}) • Attending: {rec.doctorName} ({rec.department})
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>{formatDate(rec.date)}</span>
                <div style={{ fontSize: '0.72rem', color: '#0d9488', fontWeight: '600', marginTop: '3px' }}>
                  Vector ID: <code>{rec.vectorEmbeddingId}</code>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '10px' }}>
              <strong>Reported Symptoms:</strong> {rec.symptoms}
            </div>

            {/* Doctor Note */}
            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '14px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              {rec.notes}
            </p>

            {/* Vitals Bar */}
            {rec.vitals && (
              <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', fontSize: '0.78rem', color: '#0369a1', background: '#f0f9ff', padding: '8px 14px', borderRadius: '6px', fontWeight: '600', marginBottom: '12px' }}>
                <span>BP: <strong>{rec.vitals.bp}</strong></span>
                <span>Heart Rate: <strong>{rec.vitals.heartRate}</strong></span>
                <span>SpO2: <strong>{rec.vitals.spo2}</strong></span>
                <span>Temp: <strong>{rec.vitals.temp}</strong></span>
              </div>
            )}

            {/* Prescriptions & Lab tests attached */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Pill size={14} style={{ color: '#a855f7' }} /> {rec.prescriptions?.length || 0} Rx Prescriptions
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FlaskConical size={14} style={{ color: '#0284c7' }} /> {rec.labResults?.length || 0} Lab Attachments
                </span>
              </div>
              <button className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                View Full Chart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: View Full EMR Detail */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title={`Clinical Encounter - ${selectedRecord.recordNumber}`}
          maxWidth="640px"
          footer={
            <button onClick={() => setSelectedRecord(null)} className="btn btn-secondary">
              Close EMR
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>{selectedRecord.diagnosis}</h3>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
                Patient: <strong>{selectedRecord.patientName}</strong> ({selectedRecord.patientId}) • Date: {formatDate(selectedRecord.date)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#0284c7', marginTop: '2px' }}>
                Physician: {selectedRecord.doctorName} ({selectedRecord.department})
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Reported Symptoms & History</span>
              <p style={{ fontSize: '0.9rem', color: '#1e293b', marginTop: '4px', lineHeight: 1.5 }}>
                {selectedRecord.symptoms}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Clinical Assessment & Plan</span>
              <p style={{ fontSize: '0.9rem', color: '#1e293b', marginTop: '4px', lineHeight: 1.5, background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                {selectedRecord.notes}
              </p>
            </div>

            {/* Prescriptions */}
            {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 && (
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>Active Prescriptions</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                  {selectedRecord.prescriptions.map((rx, idx) => (
                    <div key={idx} style={{ background: '#faf5ff', border: '1px solid #f3e8ff', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '700', color: '#7e22ce' }}>{rx.medicine}</span>
                      <span style={{ fontSize: '0.8rem', color: '#6b21a8' }}>{rx.dosage} ({rx.duration})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Modal: Create Clinical Encounter Record */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Clinical EMR Encounter"
        maxWidth="620px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveRecord} className="btn btn-primary">
              Save & Compute Vector
            </button>
          </div>
        }
      >
        <form onSubmit={handleSaveRecord}>
          <div className="form-group">
            <label className="form-label">Select Patient *</label>
            <select
              className="form-select"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.id}) - Blood {p.bloodGroup}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Diagnosis *</label>
            <input
              type="text"
              className="form-input"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Acute Bronchitis with Wheezing"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Patient Symptoms *</label>
            <input
              type="text"
              className="form-input"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Productive cough, low-grade fever, chest tightness"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <div className="form-group">
              <label className="form-label">BP</label>
              <input type="text" className="form-input" value={bp} onChange={(e) => setBp(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">HR</label>
              <input type="text" className="form-input" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">SpO2</label>
              <input type="text" className="form-input" value={spo2} onChange={(e) => setSpo2(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Temp</label>
              <input type="text" className="form-input" value={temp} onChange={(e) => setTemp(e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Progress Notes & Treatment Plan</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Observations, auscultation findings, follow-up instructions..."
            />
          </div>

          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a', display: 'block', marginBottom: '8px' }}>
              Add Prescription
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                value={rxMedicine}
                onChange={(e) => setRxMedicine(e.target.value)}
                placeholder="Medicine name & dosage"
              />
              <input
                type="text"
                className="form-input"
                value={rxDosage}
                onChange={(e) => setRxDosage(e.target.value)}
                placeholder="Frequency (e.g. BID for 7 days)"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
