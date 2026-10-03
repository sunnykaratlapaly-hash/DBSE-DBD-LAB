import React, { useState } from 'react';
import {
  BedDouble,
  UserPlus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Search,
  Plus,
  Activity,
  LogOut
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdmissionsPage = ({ onNavigate }) => {
  const { admissions, patients, doctors, addAdmission, updateAdmissionStatus } = useData();
  const toast = useToast();

  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);

  // New Admission Form State
  const [admitForm, setAdmitForm] = useState({
    patientId: patients[0]?.id || '',
    roomNumber: '305-A',
    ward: 'Medical Inpatient Ward',
    bedType: 'Standard Ward Bed',
    admissionDate: new Date().toISOString().split('T')[0],
    expectedDischarge: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    attendingDoctor: doctors[0]?.name || 'Dr. Sarah Jenkins',
    dailyRate: 250,
    nurseInCharge: 'Staff Nurse Jennifer M.'
  });

  const filteredAdmissions = admissions.filter((adm) => {
    if (statusFilter !== 'All' && adm.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      adm.patientName.toLowerCase().includes(q) ||
      adm.roomNumber.toLowerCase().includes(q) ||
      adm.ward.toLowerCase().includes(q) ||
      adm.admissionNumber.toLowerCase().includes(q)
    );
  });

  const activeCount = admissions.filter((a) => a.status === 'Admitted').length;
  const dischargedCount = admissions.filter((a) => a.status === 'Discharged').length;

  const handleAdmitSubmit = (e) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === admitForm.patientId) || patients[0];

    addAdmission({
      ...admitForm,
      patientName: pat.name,
      dailyRate: parseFloat(admitForm.dailyRate) || 200
    });

    toast.success(`Patient ${pat.name} admitted to ${admitForm.roomNumber} (${admitForm.ward})`);
    setIsAdmitModalOpen(false);
  };

  const handleDischarge = (admId, patientName) => {
    if (window.confirm(`Initiate clinical discharge and release bed for ${patientName}?`)) {
      updateAdmissionStatus(admId, 'Discharged');
      toast.success(`Patient ${patientName} successfully discharged. Inpatient bed released.`);
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Inpatient Admission & Bed Roster</h1>
          <p className="page-subtitle">
            Ward allocations, critical care beds, attending physician assignments, and discharge pipelines.
          </p>
        </div>
        <div className="page-actions">
          <button onClick={() => setIsAdmitModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={15} /> Admit Inpatient
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <StatCard
          label="Active Admissions"
          value={activeCount}
          icon={BedDouble}
          variant="primary"
          trend="78% Bed Occupancy"
          trendType="neutral"
        />
        <StatCard
          label="Discharged Patients"
          value={dischargedCount}
          icon={CheckCircle2}
          variant="success"
          subtext="Cleared this period"
        />
        <StatCard
          label="ICU Critical Beds"
          value="2 / 10"
          icon={Activity}
          variant="danger"
          trend="8 Beds Free"
          trendType="positive"
        />
        <StatCard
          label="Avg Length of Stay"
          value="4.2 Days"
          icon={Clock}
          variant="teal"
          subtext="Clinical benchmark"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div className="search-wrapper" style={{ flex: 1, minWidth: '280px' }}>
            <input
              type="text"
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by admission ID, patient name, room number, or ward..."
            />
            <Search size={16} className="search-icon" />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Admitted', 'Discharged'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: statusFilter === st ? '#0284c7' : '#cbd5e1',
                  backgroundColor: statusFilter === st ? '#0284c7' : '#ffffff',
                  color: statusFilter === st ? '#ffffff' : '#475569'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Admissions Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Inpatient Census & Bed Assignments</h3>
            <p className="card-subtitle">Showing {filteredAdmissions.length} admission cases</p>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Admission No</th>
                <th>Patient Details</th>
                <th>Room & Ward</th>
                <th>Bed Type</th>
                <th>Attending Doctor</th>
                <th>Admission Date</th>
                <th>Expected / Actual Discharge</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmissions.map((adm) => (
                <tr key={adm.id}>
                  <td><strong>{adm.admissionNumber}</strong></td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{adm.patientName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{adm.patientId}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0284c7' }}>{adm.roomNumber}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{adm.ward}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#334155' }}>{adm.bedType}</span>
                  </td>
                  <td>{adm.attendingDoctor}</td>
                  <td>{formatDate(adm.admissionDate)}</td>
                  <td>
                    {adm.status === 'Discharged' ? (
                      <span style={{ color: '#16a34a', fontWeight: '600' }}>{formatDate(adm.actualDischarge)}</span>
                    ) : (
                      <span>{formatDate(adm.expectedDischarge)}</span>
                    )}
                  </td>
                  <td><Badge status={adm.status} text={adm.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    {adm.status === 'Admitted' ? (
                      <button
                        onClick={() => handleDischarge(adm.id, adm.patientName)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#0f766e', borderColor: '#ccfbf1' }}
                      >
                        <LogOut size={14} /> Discharge
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Admit Patient */}
      <Modal
        isOpen={isAdmitModalOpen}
        onClose={() => setIsAdmitModalOpen(false)}
        title="Admit Patient to Inpatient Ward"
        maxWidth="580px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button onClick={() => setIsAdmitModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleAdmitSubmit} className="btn btn-primary">
              Confirm Admission
            </button>
          </div>
        }
      >
        <form onSubmit={handleAdmitSubmit}>
          <div className="form-group">
            <label className="form-label">Patient to Admit *</label>
            <select
              className="form-select"
              value={admitForm.patientId}
              onChange={(e) => setAdmitForm({ ...admitForm, patientId: e.target.value })}
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
              <label className="form-label">Ward Department *</label>
              <select
                className="form-select"
                value={admitForm.ward}
                onChange={(e) => setAdmitForm({ ...admitForm, ward: e.target.value })}
              >
                <option value="Medical Inpatient Ward">Medical Inpatient Ward</option>
                <option value="Intensive Cardiac Care Unit (ICCU)">Intensive Cardiac Care Unit (ICCU)</option>
                <option value="Surgical Recovery Ward">Surgical Recovery Ward</option>
                <option value="Pediatric Care Ward">Pediatric Care Ward</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Room / Bed Allocation *</label>
              <input
                type="text"
                className="form-input"
                value={admitForm.roomNumber}
                onChange={(e) => setAdmitForm({ ...admitForm, roomNumber: e.target.value })}
                placeholder="e.g. 305-A or ICU-02"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Bed Type</label>
              <select
                className="form-select"
                value={admitForm.bedType}
                onChange={(e) => setAdmitForm({ ...admitForm, bedType: e.target.value })}
              >
                <option value="Standard Ward Bed">Standard Ward Bed</option>
                <option value="Semi-Private Bed">Semi-Private Bed</option>
                <option value="Critical Care Monitor Bed">Critical Care Monitor Bed</option>
                <option value="Isolation Bed">Isolation Bed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Attending Doctor *</label>
              <select
                className="form-select"
                value={admitForm.attendingDoctor}
                onChange={(e) => setAdmitForm({ ...admitForm, attendingDoctor: e.target.value })}
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.name}>{d.name} ({d.department})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Admission Date *</label>
              <input
                type="date"
                className="form-input"
                value={admitForm.admissionDate}
                onChange={(e) => setAdmitForm({ ...admitForm, admissionDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expected Discharge Date</label>
              <input
                type="date"
                className="form-input"
                value={admitForm.expectedDischarge}
                onChange={(e) => setAdmitForm({ ...admitForm, expectedDischarge: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Daily Bed Rate ($)</label>
            <input
              type="number"
              className="form-input"
              value={admitForm.dailyRate}
              onChange={(e) => setAdmitForm({ ...admitForm, dailyRate: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
