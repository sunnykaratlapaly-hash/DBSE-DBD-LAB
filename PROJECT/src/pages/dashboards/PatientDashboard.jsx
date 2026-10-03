import React, { useState } from 'react';
import {
  User,
  Calendar,
  FileText,
  FlaskConical,
  Pill,
  Receipt,
  Clock,
  Plus,
  Heart,
  Phone,
  MapPin,
  AlertCircle,
  Download,
  Printer
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { InvoiceModal } from '../../components/invoice/InvoiceModal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const PatientDashboard = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const { patients, appointments, records, labTests, bills, doctors, addAppointment } = useData();
  const toast = useToast();

  // Find active patient record
  const currentPatient = patients.find((p) => p.email === currentUser?.email) || patients[0];

  const myAppointments = appointments.filter((a) => a.patientId === currentPatient.id || a.patientName === currentPatient.name);
  const myRecords = records.filter((r) => r.patientId === currentPatient.id || r.patientName === currentPatient.name);
  const myLabs = labTests.filter((l) => l.patientId === currentPatient.id || l.patientName === currentPatient.name);
  const myBills = bills.filter((b) => b.patientId === currentPatient.id || b.patientName === currentPatient.name);

  // Modals
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [selectedBillForInvoice, setSelectedBillForInvoice] = useState(null);

  // Booking form
  const [bookingForm, setBookingForm] = useState({
    doctorId: doctors[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    reason: 'Routine Medical Review'
  });

  const handleBookAppointment = (e) => {
    e.preventDefault();
    const doc = doctors.find((d) => d.id === bookingForm.doctorId) || doctors[0];

    addAppointment({
      patientId: currentPatient.id,
      patientName: currentPatient.name,
      doctorId: doc.id,
      doctorName: doc.name,
      department: doc.department,
      date: bookingForm.date,
      time: bookingForm.time,
      reason: bookingForm.reason,
      status: 'Scheduled',
      room: doc.room
    });

    toast.success(`Appointment request scheduled with ${doc.name} for ${bookingForm.date}`);
    setIsBookModalOpen(false);
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Personal Patient Health Portal</h1>
          <p className="page-subtitle">
            Welcome, <strong>{currentPatient.name}</strong> • Patient Record: <code>{currentPatient.id}</code>
          </p>
        </div>
        <div className="page-actions">
          <button onClick={() => setIsBookModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={15} /> Book Doctor Appointment
          </button>
        </div>
      </div>

      {/* Patient Demographic Profile Summary Card */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          marginBottom: '24px',
          border: 'none',
          boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.4)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '20px', alignItems: 'center' }}>
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={currentPatient.name}
            style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid rgba(255, 255, 255, 0.4)', objectFit: 'cover' }}
          />

          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: 1.1 }}>{currentPatient.name}</div>
            <div style={{ fontSize: '0.85rem', color: '#bae6fd', marginTop: '4px' }}>
              {currentPatient.gender}, {currentPatient.age} years old • Blood Group: <strong>{currentPatient.bloodGroup}</strong>
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.8rem', color: '#e0f2fe', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {currentPatient.phone}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {currentPatient.address}</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.12)', backdropFilter: 'blur(4px)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <div style={{ fontSize: '0.72rem', color: '#bae6fd', textTransform: 'uppercase', fontWeight: '600' }}>Known Allergies</div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fef3c7', marginTop: '2px' }}>{currentPatient.allergies}</div>
            <div style={{ fontSize: '0.72rem', color: '#bae6fd', textTransform: 'uppercase', fontWeight: '600', marginTop: '8px' }}>Chronic Status</div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#ffffff', marginTop: '2px' }}>{currentPatient.chronicConditions}</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <StatCard
          label="Upcoming Visits"
          value={myAppointments.filter((a) => a.status === 'Scheduled').length}
          icon={Calendar}
          variant="primary"
          subtext="Next: Cardiology"
        />
        <StatCard
          label="Clinical Encounters"
          value={myRecords.length}
          icon={FileText}
          variant="teal"
          subtext="EMR records on file"
        />
        <StatCard
          label="Diagnostic Reports"
          value={myLabs.length}
          icon={FlaskConical}
          variant="purple"
          subtext="All reports verified"
        />
        <StatCard
          label="Outstanding Bills"
          value={formatCurrency(myBills.filter((b) => b.paymentStatus !== 'Paid').reduce((acc, b) => acc + (b.balanceDue || b.totalAmount), 0))}
          icon={Receipt}
          variant="warning"
          subtext="Available online"
        />
      </div>

      {/* Appointments & Prescriptions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Upcoming Appointments */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">My Appointments</h3>
              <p className="card-subtitle">Scheduled doctor consultations & past visits</p>
            </div>
            <button onClick={() => setIsBookModalOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={14} /> Book New
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Doctor & Dept</th>
                  <th>Date & Time</th>
                  <th>Room</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {myAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{apt.doctorName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{apt.department}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{apt.time}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{formatDate(apt.date)}</div>
                    </td>
                    <td>{apt.room || 'Room 302'}</td>
                    <td><Badge status={apt.status} text={apt.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Prescriptions */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">My Active Prescriptions</h3>
              <p className="card-subtitle">Medications prescribed by attending physicians</p>
            </div>
            <button onClick={() => onNavigate('pharmacy')} className="btn btn-ghost btn-sm">
              Refill
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myRecords.flatMap((r) => r.prescriptions || []).map((rx, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Pill size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{rx.medicine}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{rx.dosage} • Duration: {rx.duration}</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '12px', fontWeight: '700' }}>
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lab Results & Invoices Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Lab Results */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Diagnostic Laboratory Reports</h3>
              <p className="card-subtitle">Blood panels, biochemistry, and pathology findings</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myLabs.map((lab) => (
              <div
                key={lab.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  background: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{lab.testName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Category: {lab.category} • Sample: {lab.sampleDate}
                    </div>
                  </div>
                  <Badge status={lab.status} text={lab.status} />
                </div>

                {lab.results && lab.results.length > 0 && (
                  <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', fontSize: '0.8rem', marginTop: '8px' }}>
                    {lab.results.map((r, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                        <span style={{ color: '#475569' }}>{r.param}:</span>
                        <span style={{ fontWeight: '700', color: '#0f172a' }}>{r.value} {r.unit} ({r.referenceRange})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bills & Invoices */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Medical Invoices & Statements</h3>
              <p className="card-subtitle">Itemized charges and payment receipts</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myBills.map((bill) => (
              <div
                key={bill.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '14px',
                  background: '#ffffff',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>{bill.invoiceNumber}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Date: {formatDate(bill.date)} • {bill.items?.length || 1} Services
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0284c7', marginTop: '4px' }}>
                    {formatCurrency(bill.totalAmount)}
                  </div>
                </div>

                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                  <Badge status={bill.paymentStatus} text={bill.paymentStatus} />
                  <button
                    onClick={() => setSelectedBillForInvoice(bill)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                  >
                    View / Print Invoice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Book Appointment */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Book Doctor Appointment"
        maxWidth="520px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button onClick={() => setIsBookModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleBookAppointment} className="btn btn-primary">
              Confirm Appointment
            </button>
          </div>
        }
      >
        <form onSubmit={handleBookAppointment}>
          <div className="form-group">
            <label className="form-label">Select Specialist Doctor *</label>
            <select
              className="form-select"
              value={bookingForm.doctorId}
              onChange={(e) => setBookingForm({ ...bookingForm, doctorId: e.target.value })}
              required
            >
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.department}) - Fee: ${d.consultationFee}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Preferred Date *</label>
              <input
                type="date"
                className="form-input"
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Preferred Time Slot *</label>
              <select
                className="form-select"
                value={bookingForm.time}
                onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Symptoms / Reason for Visit *</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={bookingForm.reason}
              onChange={(e) => setBookingForm({ ...bookingForm, reason: e.target.value })}
              placeholder="Describe what you are experiencing..."
              required
            />
          </div>
        </form>
      </Modal>

      {/* Invoice Modal */}
      {selectedBillForInvoice && (
        <InvoiceModal
          isOpen={!!selectedBillForInvoice}
          onClose={() => setSelectedBillForInvoice(null)}
          bill={selectedBillForInvoice}
        />
      )}
    </div>
  );
};
