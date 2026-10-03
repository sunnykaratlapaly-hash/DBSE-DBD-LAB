import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Table,
  CalendarDays,
  Search
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';

export const AppointmentsPage = ({ onNavigate }) => {
  const { appointments, patients, doctors, addAppointment, updateAppointmentStatus } = useData();
  const toast = useToast();

  const [viewMode, setViewMode] = useState('table'); // 'table' | 'calendar'
  const [statusFilter, setStatusFilter] = useState('All');
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    reason: 'Follow-up Consultation'
  });

  const filteredAppointments = appointments.filter((apt) => {
    if (statusFilter !== 'All' && apt.status !== statusFilter) return false;
    if (doctorFilter !== 'All' && apt.doctorId !== doctorFilter) return false;
    return true;
  });

  const handleStatusChange = (id, newStatus) => {
    updateAppointmentStatus(id, newStatus);
    toast.success(`Appointment status updated to ${newStatus}`);
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === bookingForm.patientId) || patients[0];
    const doc = doctors.find((d) => d.id === bookingForm.doctorId) || doctors[0];

    addAppointment({
      patientId: pat.id,
      patientName: pat.name,
      doctorId: doc.id,
      doctorName: doc.name,
      department: doc.department,
      date: bookingForm.date,
      time: bookingForm.time,
      reason: bookingForm.reason,
      status: 'Scheduled',
      room: doc.room
    });

    toast.success(`Consultation booked for ${pat.name} with ${doc.name}`);
    setIsBookModalOpen(false);
  };

  // Calendar dates mock grid
  const calendarDays = [
    { day: 'Sep 10', date: '2026-09-10' },
    { day: 'Sep 11', date: '2026-09-11' },
    { day: 'Sep 12 (Today)', date: '2026-09-12', isToday: true },
    { day: 'Sep 13', date: '2026-09-13' },
    { day: 'Sep 14', date: '2026-09-14' },
    { day: 'Sep 15', date: '2026-09-15' },
    { day: 'Sep 16', date: '2026-09-16' }
  ];

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointment Master Schedule</h1>
          <p className="page-subtitle">
            Centralized consultation booking engine with calendar view and distributed slot allocation.
          </p>
        </div>
        <div className="page-actions">
          <div style={{ display: 'flex', background: '#e2e8f0', borderRadius: '8px', padding: '3px' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer',
                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#0f172a' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <Table size={14} /> Table View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: '600',
                cursor: 'pointer',
                background: viewMode === 'calendar' ? '#ffffff' : 'transparent',
                color: viewMode === 'calendar' ? '#0f172a' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: viewMode === 'calendar' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <CalendarDays size={14} /> Calendar Matrix
            </button>
          </div>

          <button onClick={() => setIsBookModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={15} /> Book Appointment
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Scheduled', 'Pending', 'Completed', 'Cancelled'].map((st) => (
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: '500' }}>Physician:</span>
            <select
              className="form-select"
              style={{ width: 'auto', padding: '6px 12px' }}
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
            >
              <option value="All">All Doctors</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.department})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* View: Table Mode */}
      {viewMode === 'table' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Appointments Ledger</h3>
              <p className="card-subtitle">Showing {filteredAppointments.length} consultation slots</p>
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Appt ID</th>
                  <th>Patient</th>
                  <th>Attending Physician</th>
                  <th>Department</th>
                  <th>Date & Slot</th>
                  <th>Clinical Reason</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td><strong>{apt.id}</strong></td>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{apt.patientName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{apt.patientId}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#0284c7' }}>{apt.doctorName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{apt.room || 'Room 302'}</div>
                    </td>
                    <td>{apt.department}</td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{apt.time}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{formatDate(apt.date)}</div>
                    </td>
                    <td style={{ maxWidth: '240px' }}>
                      <span style={{ fontSize: '0.8125rem', color: '#334155' }}>{apt.reason}</span>
                    </td>
                    <td><Badge status={apt.status} text={apt.status} /></td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {apt.status === 'Scheduled' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(apt.id, 'Completed')}
                              className="btn btn-teal btn-sm"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleStatusChange(apt.id, 'Cancelled')}
                              className="btn btn-danger btn-sm"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        {apt.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'Scheduled')}
                            className="btn btn-primary btn-sm"
                          >
                            Approve
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
      )}

      {/* View: Calendar Matrix Mode */}
      {viewMode === 'calendar' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Weekly Roster Matrix</h3>
              <p className="card-subtitle">Consultation distribution across the schedule horizon</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px', minWidth: '800px', overflowX: 'auto' }}>
            {calendarDays.map((col) => {
              const dayAppointments = appointments.filter((a) => a.date === col.date);

              return (
                <div
                  key={col.date}
                  style={{
                    background: col.isToday ? '#f0f9ff' : '#f8fafc',
                    border: '1px solid',
                    borderColor: col.isToday ? '#bae6fd' : '#e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 10px',
                    minHeight: '260px'
                  }}
                >
                  <div style={{ textAlign: 'center', paddingBottom: '10px', borderBottom: '1px solid #e2e8f0', marginBottom: '10px' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: col.isToday ? '#0284c7' : '#0f172a' }}>
                      {col.day}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {dayAppointments.length} Booked
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {dayAppointments.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          background: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          padding: '8px',
                          fontSize: '0.75rem',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                        }}
                      >
                        <div style={{ fontWeight: '700', color: '#0284c7' }}>{item.time}</div>
                        <div style={{ fontWeight: '600', color: '#0f172a', marginTop: '2px' }}>{item.patientName}</div>
                        <div style={{ color: '#64748b', fontSize: '0.7rem' }}>{item.doctorName}</div>
                        <div style={{ marginTop: '4px' }}>
                          <Badge status={item.status} text={item.status} style={{ fontSize: '0.65rem', padding: '1px 5px' }} />
                        </div>
                      </div>
                    ))}
                    {dayAppointments.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '24px 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                        No slots booked
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Book Appointment */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Schedule Clinical Consultation"
        maxWidth="540px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button onClick={() => setIsBookModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleScheduleSubmit} className="btn btn-primary">
              Confirm & Book
            </button>
          </div>
        }
      >
        <form onSubmit={handleScheduleSubmit}>
          <div className="form-group">
            <label className="form-label">Patient *</label>
            <select
              className="form-select"
              value={bookingForm.patientId}
              onChange={(e) => setBookingForm({ ...bookingForm, patientId: e.target.value })}
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.id}) - Blood {p.bloodGroup}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Doctor & Specialty *</label>
            <select
              className="form-select"
              value={bookingForm.doctorId}
              onChange={(e) => setBookingForm({ ...bookingForm, doctorId: e.target.value })}
              required
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.department}) - {d.status}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                className="form-input"
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time Slot *</label>
              <select
                className="form-select"
                value={bookingForm.time}
                onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:30 PM">04:30 PM</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Reason for Visit</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={bookingForm.reason}
              onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
              placeholder="Symptoms or follow-up details..."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
