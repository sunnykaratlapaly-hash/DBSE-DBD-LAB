import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Heart,
  Eye,
  CheckCircle2,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';

export const PatientsPage = ({ onNavigate }) => {
  const { patients, addPatient, updatePatient, deletePatient } = useData();
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: '',
    bloodGroup: 'O+',
    address: '',
    allergies: '',
    chronicConditions: '',
    emergencyContact: ''
  });

  const filteredPatients = patients.filter((p) => {
    if (bloodFilter !== 'All' && p.bloodGroup !== bloodFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.email && p.email.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      email: '',
      bloodGroup: 'O+',
      address: '',
      allergies: '',
      chronicConditions: '',
      emergencyContact: ''
    });
    setIsAddModalOpen(true);
  };

  const handleSavePatient = (e) => {
    e.preventDefault();
    if (editingPatient) {
      updatePatient(editingPatient.id, {
        ...formData,
        age: parseInt(formData.age) || 30
      });
      toast.success(`Updated details for patient ${formData.name}`);
      setEditingPatient(null);
    } else {
      const created = addPatient({
        ...formData,
        age: parseInt(formData.age) || 30
      });
      toast.success(`Registered new patient ${created.name} (${created.id})`);
    }
    setIsAddModalOpen(false);
  };

  const handleEdit = (p) => {
    setEditingPatient(p);
    setFormData({
      name: p.name,
      age: p.age,
      gender: p.gender,
      phone: p.phone,
      email: p.email || '',
      bloodGroup: p.bloodGroup,
      address: p.address || '',
      allergies: p.allergies || '',
      chronicConditions: p.chronicConditions || '',
      emergencyContact: p.emergencyContact || ''
    });
    setIsAddModalOpen(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete patient ${name}?`)) {
      deletePatient(id);
      toast.info(`Removed patient record ${id}`);
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Patient Master Directory</h1>
          <p className="page-subtitle">
            Relational electronic patient registry stored in PostgreSQL with indexed health profiles.
          </p>
        </div>
        <div className="page-actions">
          <button onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            <UserPlus size={15} /> Register New Patient
          </button>
        </div>
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
              placeholder="Search by patient ID, full name, phone number, email..."
            />
            <Search size={16} className="search-icon" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: '500' }}>Blood Group:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px' }}
              value={bloodFilter}
              onChange={(e) => setBloodFilter(e.target.value)}
            >
              <option value="All">All Blood Groups</option>
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
      </div>

      {/* Patient Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Registered Patients Record</h3>
            <p className="card-subtitle">Showing {filteredPatients.length} active patient records</p>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Full Name</th>
                <th>Demographics</th>
                <th>Blood Group</th>
                <th>Phone & Address</th>
                <th>Allergies & Conditions</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td><strong>{patient.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{patient.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Reg: {formatDate(patient.registrationDate)}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.85rem' }}>{patient.gender}, {patient.age} yrs</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '700', color: '#0284c7', background: '#e0f2fe', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem' }}>
                      {patient.bloodGroup}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.8125rem', color: '#334155' }}>{patient.phone}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {patient.address}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: '500' }}>
                      Allergies: {patient.allergies || 'None'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#475569' }}>
                      {patient.chronicConditions || 'None'}
                    </div>
                  </td>
                  <td><Badge status={patient.status} text={patient.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '4px' }}>
                      <button
                        onClick={() => setViewingPatient(patient)}
                        className="btn-icon btn-ghost"
                        title="View Complete Profile"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(patient)}
                        className="btn-icon btn-ghost"
                        title="Edit Patient"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(patient.id, patient.name)}
                        className="btn-icon btn-ghost"
                        style={{ color: '#ef4444' }}
                        title="Delete Patient"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add or Edit Patient */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingPatient(null); }}
        title={editingPatient ? 'Edit Patient Demographic Data' : 'Register New Hospital Patient'}
        maxWidth="620px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button onClick={() => { setIsAddModalOpen(false); setEditingPatient(null); }} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleSavePatient} className="btn btn-primary">
              {editingPatient ? 'Save Changes' : 'Register Patient'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSavePatient}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input
                type="number"
                className="form-input"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-select"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Emergency Contact</label>
              <input
                type="text"
                className="form-input"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="Name - Phone"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <input
              type="text"
              className="form-input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Known Allergies</label>
              <input
                type="text"
                className="form-input"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="Penicillin, Sulfa, etc."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Chronic Conditions</label>
              <input
                type="text"
                className="form-input"
                value={formData.chronicConditions}
                onChange={(e) => setFormData({ ...formData, chronicConditions: e.target.value })}
                placeholder="Hypertension, Asthma..."
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Modal: View Patient Profile Details */}
      {viewingPatient && (
        <Modal
          isOpen={!!viewingPatient}
          onClose={() => setViewingPatient(null)}
          title={`Patient Clinical Profile - ${viewingPatient.name}`}
          maxWidth="600px"
          footer={
            <button onClick={() => setViewingPatient(null)} className="btn btn-secondary">
              Close Profile
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>{viewingPatient.name}</span>
                <Badge status={viewingPatient.status} text={viewingPatient.status} />
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                ID: <strong>{viewingPatient.id}</strong> • Registered: {formatDate(viewingPatient.registrationDate)}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Demographics</span>
                <div style={{ fontWeight: '600', color: '#0f172a', marginTop: '4px' }}>
                  {viewingPatient.gender}, {viewingPatient.age} years old
                </div>
                <div style={{ color: '#0284c7', fontWeight: '700', fontSize: '0.85rem' }}>
                  Blood Type: {viewingPatient.bloodGroup}
                </div>
              </div>

              <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Contact Info</span>
                <div style={{ fontWeight: '600', color: '#0f172a', marginTop: '4px' }}>{viewingPatient.phone}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{viewingPatient.email}</div>
              </div>
            </div>

            <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '8px', border: '1px solid #fee2e2' }}>
              <span style={{ fontSize: '0.72rem', color: '#991b1b', textTransform: 'uppercase', fontWeight: '700' }}>Known Allergies</span>
              <div style={{ fontWeight: '700', color: '#b91c1c', marginTop: '2px' }}>{viewingPatient.allergies || 'No known drug allergies'}</div>
            </div>

            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: '0.72rem', color: '#166534', textTransform: 'uppercase', fontWeight: '700' }}>Chronic Conditions & History</span>
              <div style={{ fontWeight: '600', color: '#15803d', marginTop: '2px' }}>{viewingPatient.chronicConditions || 'None recorded'}</div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              <strong>Emergency Contact:</strong> {viewingPatient.emergencyContact || 'Not specified'}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
