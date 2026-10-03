import React, { useState } from 'react';
import {
  UserPlus,
  Calendar,
  BedDouble,
  Search,
  CheckCircle2,
  Clock,
  Stethoscope,
  Receipt,
  Plus,
  Phone,
  User
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatDate } from '../../utils/formatters';

export const ReceptionistDashboard = ({ onNavigate }) => {
  const { patients, doctors, appointments, admissions, addPatient, addAppointment } = useData();
  const toast = useToast();

  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  // New Patient Form state
  const [patientForm, setPatientForm] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    bloodGroup: 'O+',
    address: '',
    allergies: ''
  });

  // Appointment Form state
  const [aptForm, setAptForm] = useState({
    patientId: patients[0]?.id || '',
    doctorId: doctors[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    reason: 'General Consultation'
  });

  const handleCreatePatient = (e) => {
    e.preventDefault();
    const created = addPatient(patientForm);
    toast.success(`Patient ${created.name} registered with ID ${created.id}`);
    setIsPatientModalOpen(false);
    setPatientForm({ name: '', age: '', gender: 'Male', phone: '', bloodGroup: 'O+', address: '', allergies: '' });
  };

  const handleScheduleAppointment = (e) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === aptForm.patientId) || patients[0];
    const doctor = doctors.find((d) => d.id === aptForm.doctorId) || doctors[0];

    const created = addAppointment({
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      department: doctor.department,
      date: aptForm.date,
      time: aptForm.time,
      reason: aptForm.reason,
      status: 'Scheduled',
      room: doctor.room
    });

    toast.success(`Appointment booked with ${doctor.name} for ${patient.name}`);
    setIsAppointmentModalOpen(false);
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Reception & Patient Intake Desk</h1>
          <p className="page-subtitle">
            Front counter registration, physician schedule coordination, and inpatient check-ins.
          </p>
        </div>
        <div className="page-actions">
          <button onClick={() => setIsPatientModalOpen(true)} className="btn btn-primary btn-sm">
            <UserPlus size={15} /> New Patient Check-In
          </button>
          <button onClick={() => setIsAppointmentModalOpen(true)} className="btn btn-teal btn-sm">
            <Calendar size={15} /> Schedule Appointment
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <StatCard
          label="Registered Patients"
          value={patients.length}
          icon={User}
          variant="primary"
          trend="+3 registered today"
          trendType="positive"
        />
        <StatCard
          label="Today's Appointments"
          value={appointments.filter((a) => a.date === '2026-09-12').length}
          icon={Calendar}
          variant="teal"
          subtext="Front desk queue"
        />
        <StatCard
          label="Available Doctors"
          value={doctors.filter((d) => d.status === 'Available').length}
          icon={Stethoscope}
          variant="success"
          subtext="Ready for walk-in"
        />
        <StatCard
          label="Active Admissions"
          value={admissions.filter((a) => a.status === 'Admitted').length}
          icon={BedDouble}
          variant="warning"
          subtext="Ward allocations"
        />
      </div>

      {/* Doctor Availability Matrix */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Real-Time Doctor Availability Matrix</h3>
            <p className="card-subtitle">Consultation rooms, shifts, and immediate queue status</p>
          </div>
          <button onClick={() => onNavigate('doctors')} className="btn btn-ghost btn-sm">
            Directory
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {doctors.map((doc) => (
            <div
              key={doc.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                background: '#ffffff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{doc.name}</div>
                    <div style={{ color: '#0284c7', fontSize: '0.78rem', fontWeight: '600' }}>{doc.department}</div>
                  </div>
                  <Badge status={doc.status} text={doc.status} />
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '6px' }}>
                  <strong>Location:</strong> {doc.room}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  <strong>Hours:</strong> {doc.availability}
                </div>
              </div>

              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0f172a' }}>Fee: ${doc.consultationFee}</span>
                <button
                  onClick={() => {
                    setAptForm({ ...aptForm, doctorId: doc.id });
                    setIsAppointmentModalOpen(true);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                >
                  Book Slot
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Appointments Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Front Desk Appointments Intake</h3>
            <p className="card-subtitle">Scheduled consultations for check-in and billing</p>
          </div>
          <button onClick={() => onNavigate('billing')} className="btn btn-secondary btn-sm">
            <Receipt size={14} /> Quick Bill
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Appt ID</th>
                <th>Patient Name</th>
                <th>Doctor</th>
                <th>Department</th>
                <th>Time & Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id}>
                  <td><strong>{apt.id}</strong></td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{apt.patientName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{apt.patientId}</div>
                  </td>
                  <td>{apt.doctorName}</td>
                  <td>{apt.department}</td>
                  <td>
                    <div style={{ fontWeight: '600' }}>{apt.time}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{formatDate(apt.date)}</div>
                  </td>
                  <td><Badge status={apt.status} text={apt.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Register Patient */}
      <Modal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        title="Register New Patient at Front Desk"
        maxWidth="580px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button onClick={() => setIsPatientModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreatePatient} className="btn btn-primary">
              Register Patient
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreatePatient}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Patient Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={patientForm.name}
                onChange={(e) => setPatientForm({ ...patientForm, name: e.target.value })}
                placeholder="e.g. Liam Gallagher"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                value={patientForm.phone}
                onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
                placeholder="+1 (555) 432-8765"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input
                type="number"
                className="form-input"
                value={patientForm.age}
                onChange={(e) => setPatientForm({ ...patientForm, age: e.target.value })}
                placeholder="45"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={patientForm.gender}
                onChange={(e) => setPatientForm({ ...patientForm, gender: e.target.value })}
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
                value={patientForm.bloodGroup}
                onChange={(e) => setPatientForm({ ...patientForm, bloodGroup: e.target.value })}
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

          <div className="form-group">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-input"
              value={patientForm.address}
              onChange={(e) => setPatientForm({ ...patientForm, address: e.target.value })}
              placeholder="Full home address"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Known Drug Allergies</label>
            <input
              type="text"
              className="form-input"
              value={patientForm.allergies}
              onChange={(e) => setPatientForm({ ...patientForm, allergies: e.target.value })}
              placeholder="e.g. Penicillin, Aspirin"
            />
          </div>
        </form>
      </Modal>

      {/* Modal: Schedule Appointment */}
      <Modal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        title="Schedule Clinical Appointment"
        maxWidth="540px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button onClick={() => setIsAppointmentModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleScheduleAppointment} className="btn btn-primary">
              Confirm & Book Slot
            </button>
          </div>
        }
      >
        <form onSubmit={handleScheduleAppointment}>
          <div className="form-group">
            <label className="form-label">Select Patient *</label>
            <select
              className="form-select"
              value={aptForm.patientId}
              onChange={(e) => setAptForm({ ...aptForm, patientId: e.target.value })}
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.id}) - Blood {p.bloodGroup}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Select Physician & Department *</label>
            <select
              className="form-select"
              value={aptForm.doctorId}
              onChange={(e) => setAptForm({ ...aptForm, doctorId: e.target.value })}
              required
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.department}) - {d.status}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Appointment Date *</label>
              <input
                type="date"
                className="form-input"
                value={aptForm.date}
                onChange={(e) => setAptForm({ ...aptForm, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time Slot *</label>
              <select
                className="form-select"
                value={aptForm.time}
                onChange={(e) => setAptForm({ ...aptForm, time: e.target.value })}
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:30 PM">03:30 PM</option>
                <option value="04:30 PM">04:30 PM</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Consultation</label>
            <input
              type="text"
              className="form-input"
              value={aptForm.reason}
              onChange={(e) => setAptForm({ ...aptForm, reason: e.target.value })}
              placeholder="e.g. Chest discomfort, routine checkup, rash"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
