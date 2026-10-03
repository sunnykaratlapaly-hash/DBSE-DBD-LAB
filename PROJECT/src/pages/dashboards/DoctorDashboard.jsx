import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  FileText,
  FlaskConical,
  Pill,
  Plus,
  CheckCircle2,
  AlertCircle,
  Activity,
  HeartPulse
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';

export const DoctorDashboard = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { patients, appointments, records, addMedicalRecord, addLabTest, updateAppointmentStatus } = useData();
  const toast = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [bp, setBp] = useState('120/80');
  const [heartRate, setHeartRate] = useState('74');
  const [rxMedicine, setRxMedicine] = useState('Lisinopril 10mg');
  const [rxDosage, setRxDosage] = useState('1 tab daily');
  const [orderLab, setOrderLab] = useState(false);
  const [labTestName, setLabTestName] = useState('Comprehensive Lipid Profile');

  const doctorName = currentUser?.name || 'Dr. Sarah Jenkins';
  const doctorAppointments = appointments.filter((a) => a.doctorName.includes(doctorName.split(' ')[1] || 'Jenkins'));
  const doctorRecords = records.filter((r) => r.doctorName.includes(doctorName.split(' ')[1] || 'Jenkins'));

  const handleSaveEncounter = (e) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

    // 1. Create Medical Record (EMR)
    addMedicalRecord({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: currentUser?.id || 'DOC-201',
      doctorName: doctorName,
      department: currentUser?.department || 'Cardiology',
      diagnosis: diagnosis || 'Clinical Observation Review',
      symptoms: symptoms || 'Routine Follow-up',
      notes: notes || 'Vitals checked and stabilized.',
      vitals: {
        bp: `${bp} mmHg`,
        heartRate: `${heartRate} bpm`,
        temp: '98.6 °F',
        spo2: '98%'
      },
      prescriptions: rxMedicine ? [{ medicine: rxMedicine, dosage: rxDosage, duration: '30 days' }] : []
    });

    // 2. Order Lab if selected
    if (orderLab) {
      addLabTest({
        patientId: patient.id,
        patientName: patient.name,
        testName: labTestName,
        category: 'Diagnostics',
        orderedBy: doctorName,
        sampleDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        priority: 'Normal'
      });
      toast.info(`Laboratory order dispatched for ${labTestName}`);
    }

    toast.success(`Clinical encounter saved and vector indexed for ${patient.name}`);
    setIsModalOpen(false);

    // Reset fields
    setDiagnosis('');
    setSymptoms('');
    setNotes('');
  };

  const handleStatusChange = (aptId, newStatus) => {
    updateAppointmentStatus(aptId, newStatus);
    toast.success(`Appointment status updated to: ${newStatus}`);
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctor Clinical Portal</h1>
          <p className="page-subtitle">
            Welcome, <strong>{doctorName}</strong> • {currentUser?.department || 'Cardiology'} Specialist
          </p>
        </div>
        <div className="page-actions">
          <button onClick={() => setIsModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={15} /> Add Clinical Note & Rx
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="stat-grid">
        <StatCard
          label="Today's Appointments"
          value={doctorAppointments.length || 3}
          icon={Calendar}
          variant="primary"
          trend="Next: 10:30 AM"
          trendType="positive"
        />
        <StatCard
          label="Total Consultations"
          value="48"
          icon={User}
          variant="teal"
          trend="+8 this week"
          trendType="positive"
        />
        <StatCard
          label="Pending Lab Reviews"
          value="2"
          icon={FlaskConical}
          variant="warning"
          trend="1 High Priority"
          trendType="neutral"
        />
        <StatCard
          label="Department Room"
          value={currentUser?.room || 'Room 302'}
          icon={Activity}
          variant="purple"
          subtext="West Wing Clinic"
        />
      </div>

      {/* Consultation Queue */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Today's Patient Schedule</h3>
            <p className="card-subtitle">Real-time consultation queue synchronized with front desk</p>
          </div>
          <button onClick={() => onNavigate('appointments')} className="btn btn-secondary btn-sm">
            Full Calendar View
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Time & Room</th>
                <th>Patient Details</th>
                <th>Chief Complaint / Reason</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctorAppointments.map((apt) => (
                <tr key={apt.id}>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0284c7' }}>{apt.time}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{apt.room || 'Room 302'} • {formatDate(apt.date)}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{apt.patientName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {apt.patientId}</div>
                  </td>
                  <td style={{ maxWidth: '300px' }}>
                    <span style={{ fontSize: '0.85rem', color: '#334155' }}>{apt.reason}</span>
                  </td>
                  <td>
                    <Badge status={apt.status} text={apt.status} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      {apt.status === 'Scheduled' && (
                        <button
                          onClick={() => handleStatusChange(apt.id, 'In Consultation')}
                          className="btn btn-teal btn-sm"
                        >
                          Start Call
                        </button>
                      )}
                      {apt.status === 'In Consultation' && (
                        <button
                          onClick={() => {
                            handleStatusChange(apt.id, 'Completed');
                            setSelectedPatientId(apt.patientId);
                            setIsModalOpen(true);
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          Complete & Add Rx
                        </button>
                      )}
                      {apt.status === 'Completed' && (
                        <button
                          onClick={() => onNavigate('records')}
                          className="btn btn-secondary btn-sm"
                        >
                          View EMR
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent EMR Encounters Recorded */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Recent Clinical Encounter Records (EMR)</h3>
            <p className="card-subtitle">Encounters indexed into pgvector clinical repository</p>
          </div>
          <button onClick={() => onNavigate('records')} className="btn btn-ghost btn-sm">
            All Medical Records
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {doctorRecords.map((rec) => (
            <div
              key={rec.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '16px',
                background: '#f8fafc'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '1rem' }}>{rec.diagnosis}</span>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Patient: <strong>{rec.patientName}</strong> ({rec.patientId}) • Date: {formatDate(rec.date)}
                  </div>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>
                  {rec.recordNumber}
                </span>
              </div>

              <p style={{ fontSize: '0.84rem', color: '#475569', marginBottom: '10px', lineHeight: 1.5 }}>
                {rec.notes}
              </p>

              {rec.vitals && (
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: '#0f766e', fontWeight: '600', background: '#f0fdfa', padding: '6px 12px', borderRadius: '6px' }}>
                  <span>BP: {rec.vitals.bp}</span>
                  <span>HR: {rec.vitals.heartRate}</span>
                  <span>SpO2: {rec.vitals.spo2}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Add Encounter Note & Prescription */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Clinical Encounter Note & Prescription"
        maxWidth="640px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSaveEncounter} className="btn btn-primary">
              Save Encounter & Sync
            </button>
          </div>
        }
      >
        <form onSubmit={handleSaveEncounter}>
          <div className="form-group">
            <label className="form-label">Patient *</label>
            <select
              className="form-select"
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id}) - {p.gender}, {p.age} yrs - Blood {p.bloodGroup}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Blood Pressure (BP)</label>
              <input
                type="text"
                className="form-input"
                value={bp}
                onChange={(e) => setBp(e.target.value)}
                placeholder="120/80"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Heart Rate (BPM)</label>
              <input
                type="text"
                className="form-input"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="75"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Diagnosis *</label>
            <input
              type="text"
              className="form-input"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Stage 1 Hypertension with Tachycardia"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Patient Reported Symptoms</label>
            <input
              type="text"
              className="form-input"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. Dizziness, morning chest tightness"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Physician Assessment & Progress Notes</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detailed treatment plan, patient counselling, dietary advice..."
            />
          </div>

          {/* Prescription section */}
          <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Pill size={15} style={{ color: '#0284c7' }} /> Prescribe Medication
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                value={rxMedicine}
                onChange={(e) => setRxMedicine(e.target.value)}
                placeholder="Medicine & Strength (e.g. Lisinopril 10mg)"
              />
              <input
                type="text"
                className="form-input"
                value={rxDosage}
                onChange={(e) => setRxDosage(e.target.value)}
                placeholder="Dosage (e.g. 1 tab daily morning)"
              />
            </div>
          </div>

          {/* Order Lab Test Toggle */}
          <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#166534', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={orderLab}
                onChange={(e) => setOrderLab(e.target.checked)}
              />
              Order Laboratory Diagnostic Investigation
            </label>
            {orderLab && (
              <div style={{ marginTop: '10px' }}>
                <select
                  className="form-select"
                  value={labTestName}
                  onChange={(e) => setLabTestName(e.target.value)}
                >
                  <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                  <option value="Comprehensive Lipid Profile">Comprehensive Lipid Profile</option>
                  <option value="Cardiac Troponin I (High Sensitivity)">Cardiac Troponin I (High Sensitivity)</option>
                  <option value="Glycated Hemoglobin (HbA1c)">Glycated Hemoglobin (HbA1c)</option>
                </select>
              </div>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};
