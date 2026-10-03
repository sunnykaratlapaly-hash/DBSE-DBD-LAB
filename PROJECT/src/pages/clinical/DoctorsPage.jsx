import React, { useState } from 'react';
import {
  Stethoscope,
  Search,
  Filter,
  Calendar,
  Clock,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatCurrency } from '../../utils/formatters';

export const DoctorsPage = ({ onNavigate }) => {
  const { doctors, appointments } = useData();

  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const departments = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine'];

  const filteredDoctors = doctors.filter((doc) => {
    if (selectedDept !== 'All' && doc.department !== selectedDept) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      doc.name.toLowerCase().includes(q) ||
      doc.department.toLowerCase().includes(q) ||
      doc.qualification.toLowerCase().includes(q) ||
      doc.room.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Physician & Specialist Faculty</h1>
          <p className="page-subtitle">
            Medical staff schedules, clinical departments, consulting chambers, and real-time consultation status.
          </p>
        </div>
        <div className="page-actions">
          <button onClick={() => onNavigate('appointments')} className="btn btn-primary btn-sm">
            <Calendar size={15} /> View Master Appointment Calendar
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
              placeholder="Search by physician name, qualification, room, or specialty..."
            />
            <Search size={16} className="search-icon" />
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: selectedDept === dept ? '#0284c7' : '#cbd5e1',
                  backgroundColor: selectedDept === dept ? '#0284c7' : '#ffffff',
                  color: selectedDept === dept ? '#ffffff' : '#475569',
                  transition: 'all 0.15s'
                }}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {filteredDoctors.map((doc) => {
          const docAppointmentsCount = appointments.filter((a) => a.doctorId === doc.id).length;

          return (
            <div
              key={doc.id}
              className="card"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', lineHeight: 1.2 }}>
                      {doc.name}
                    </h3>
                    <div style={{ color: '#0284c7', fontWeight: '700', fontSize: '0.85rem', marginTop: '2px' }}>
                      {doc.department}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {doc.qualification}
                    </div>
                  </div>
                  <Badge status={doc.status} text={doc.status} />
                </div>

                <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#334155', marginBottom: '6px' }}>
                    <MapPin size={15} style={{ color: '#64748b' }} />
                    <span>Location: <strong>{doc.room}</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#334155', marginBottom: '6px' }}>
                    <Clock size={15} style={{ color: '#64748b' }} />
                    <span>Clinic Hours: {doc.availability}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#334155' }}>
                    <Phone size={15} style={{ color: '#64748b' }} />
                    <span>Direct: {doc.phone}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: '700' }}>
                    <Star size={16} fill="#f59e0b" />
                    <span>{doc.rating} Rating</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: '400' }}>({doc.experience})</span>
                  </div>
                  <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1.05rem' }}>
                    {formatCurrency(doc.consultationFee)} <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '400' }}>/ visit</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  <strong>{docAppointmentsCount}</strong> appointments scheduled
                </span>
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="btn btn-secondary btn-sm"
                >
                  View Schedule & Info
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: View Doctor Schedule & Info */}
      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title={`Physician Schedule Profile - ${selectedDoc.name}`}
          maxWidth="560px"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>ID: <code>{selectedDoc.id}</code></span>
              <button onClick={() => setSelectedDoc(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>{selectedDoc.name}</h3>
                  <div style={{ color: '#0284c7', fontWeight: '700' }}>{selectedDoc.department}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedDoc.qualification} • {selectedDoc.experience}</div>
                </div>
                <Badge status={selectedDoc.status} text={selectedDoc.status} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Consultation Room</span>
                <div style={{ fontWeight: '700', color: '#0f172a', marginTop: '4px' }}>{selectedDoc.room}</div>
              </div>
              <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Standard Fee</span>
                <div style={{ fontWeight: '700', color: '#0284c7', marginTop: '4px' }}>{formatCurrency(selectedDoc.consultationFee)}</div>
              </div>
            </div>

            <div style={{ background: '#f0fdfa', padding: '14px', borderRadius: '8px', border: '1px solid #ccfbf1' }}>
              <span style={{ fontSize: '0.75rem', color: '#0f766e', fontWeight: '700', textTransform: 'uppercase' }}>Weekly Consulting Roster</span>
              <div style={{ fontWeight: '600', color: '#134e4a', marginTop: '4px', fontSize: '0.9rem' }}>
                {selectedDoc.availability}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#0f766e', marginTop: '4px' }}>
                Walk-ins accepted through Front Desk intake until 1 hour prior to shift close.
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Email: <strong>{selectedDoc.email}</strong> • Direct Phone: <strong>{selectedDoc.phone}</strong>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
