import React from 'react';
import {
  Users,
  Stethoscope,
  Calendar,
  BedDouble,
  FlaskConical,
  Pill,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Shield,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { AreaChart, BarChart, DonutChart } from '../../components/charts/MiniCharts';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const AdminDashboard = ({ onNavigate }) => {
  const { patients, doctors, appointments, admissions, labTests, medicines, bills, monitoring } = useData();

  // Metrics calculations
  const totalPatients = patients.length;
  const totalDoctors = doctors.length;
  const todayAppointments = appointments.filter((a) => a.date === '2026-09-12').length;
  const activeAdmissions = admissions.filter((a) => a.status === 'Admitted').length;
  const pendingLabs = labTests.filter((t) => t.status === 'Pending').length;
  const lowStockMeds = medicines.filter((m) => m.stockLevel < m.minThreshold).length;
  const totalRevenue = bills.reduce((acc, b) => acc + (b.paymentStatus === 'Paid' ? b.totalAmount : 0), 0);

  // Registration trend data for AreaChart
  const registrationTrend = [
    { label: 'Apr', value: 180 },
    { label: 'May', value: 240 },
    { label: 'Jun', value: 310 },
    { label: 'Jul', value: 290 },
    { label: 'Aug', value: 420 },
    { label: 'Sep', value: 510 }
  ];

  // Admissions by ward for BarChart
  const wardAdmissionsData = [
    { label: 'General', value: 18, color: '#0ea5e9' },
    { label: 'ICU / ICCU', value: 8, color: '#ef4444' },
    { label: 'Surgical', value: 14, color: '#0d9488' },
    { label: 'Pediatric', value: 10, color: '#8b5cf6' },
    { label: 'Maternity', value: 6, color: '#f59e0b' }
  ];

  // Lab Tests Status Donut
  const labStatusData = [
    { label: 'Completed', value: labTests.filter((t) => t.status === 'Completed').length, color: '#22c55e' },
    { label: 'In Progress', value: labTests.filter((t) => t.status === 'In Progress').length, color: '#0284c7' },
    { label: 'Pending', value: labTests.filter((t) => t.status === 'Pending').length, color: '#f59e0b' }
  ];

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Hospital Administration</h1>
          <p className="page-subtitle">
            Real-time telemetry, clinical volume, revenue streams, and distributed microservices status.
          </p>
        </div>
        <div className="page-actions">
          <button onClick={() => onNavigate('monitoring')} className="btn btn-secondary btn-sm">
            <Activity size={15} /> Cluster Telemetry
          </button>
          <button onClick={() => onNavigate('architecture')} className="btn btn-primary btn-sm">
            <Shield size={15} /> System Topology
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="stat-grid">
        <StatCard
          label="Total Patients"
          value={totalPatients}
          icon={Users}
          variant="primary"
          trend="+14% this month"
          trendType="positive"
        />
        <StatCard
          label="Active Doctors"
          value={totalDoctors}
          icon={Stethoscope}
          variant="teal"
          subtext="5 Medical Departments"
        />
        <StatCard
          label="Today's Appointments"
          value={todayAppointments}
          icon={Calendar}
          variant="purple"
          trend="3 scheduled now"
          trendType="neutral"
        />
        <StatCard
          label="Inpatient Admissions"
          value={activeAdmissions}
          icon={BedDouble}
          variant="warning"
          trend="78% Bed Occupancy"
          trendType="neutral"
        />
        <StatCard
          label="Pending Lab Tests"
          value={pendingLabs}
          icon={FlaskConical}
          variant="danger"
          trend="2 STAT Priority"
          trendType="negative"
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          variant="success"
          trend="+18.5% YoY"
          trendType="positive"
        />
      </div>

      {/* Cluster Node Pulse Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 20px',
          color: '#ffffff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
          <div>
            <span style={{ fontWeight: '700', fontSize: '0.875rem' }}>Distributed Backend Cluster: HEALTHY</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>
              6 Microservices Active • API Ingress: 428 RPS • P95 Latency: 18.4ms • PostgreSQL + MongoDB + Redis Online
            </span>
          </div>
        </div>
        <button
          onClick={() => onNavigate('monitoring')}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: '#ffffff',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          View Grafana Metrics <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Left Chart: Registrations Trend */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Patient Admissions & Registrations Trend</h3>
              <p className="card-subtitle">Monthly patient onboarding volume across distributed clinics</p>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0284c7' }}>Last 6 Months</span>
          </div>
          <AreaChart data={registrationTrend} height={230} color="#0284c7" />
        </div>

        {/* Right Chart: Lab Tests Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Diagnostic Laboratory Activity</h3>
              <p className="card-subtitle">Current test status breakdown in pathology pipeline</p>
            </div>
            <button onClick={() => onNavigate('laboratory')} className="btn btn-ghost btn-sm">
              View All
            </button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
            <DonutChart data={labStatusData} size={180} />
          </div>
        </div>
      </div>

      {/* Ward Occupancy Bar Chart & Recent Admissions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Bed Allocation by Ward */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Inpatient Bed Distribution</h3>
              <p className="card-subtitle">Active occupied beds grouped by specialized ward</p>
            </div>
            <button onClick={() => onNavigate('admissions')} className="btn btn-ghost btn-sm">
              Bed Grid
            </button>
          </div>
          <BarChart data={wardAdmissionsData} height={220} />
        </div>

        {/* Low Stock Medicines Warning Card */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ color: lowStockMeds > 0 ? '#dc2626' : '#0f172a' }}>
                <AlertTriangle size={18} style={{ color: '#ef4444' }} /> Pharmacy Low-Stock Warnings
              </h3>
              <p className="card-subtitle">Drugs approaching minimum replenishment thresholds</p>
            </div>
            <button onClick={() => onNavigate('pharmacy')} className="btn btn-danger btn-sm">
              Restock Now
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {medicines.filter((m) => m.stockLevel < m.minThreshold).map((med) => (
              <div
                key={med.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: '#fef2f2',
                  border: '1px solid #fee2e2',
                  borderRadius: '8px'
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: '#991b1b', fontSize: '0.875rem' }}>{med.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#b91c1c' }}>{med.category} • Batch {med.batchNumber}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#dc2626' }}>
                    {med.stockLevel} units
                  </span>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#991b1b' }}>
                    Min: {med.minThreshold}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Inpatients Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Currently Admitted Patients</h3>
            <p className="card-subtitle">Inpatient admissions tracked across PostgreSQL database</p>
          </div>
          <button onClick={() => onNavigate('admissions')} className="btn btn-secondary btn-sm">
            Manage All Admissions
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Adm Number</th>
                <th>Patient</th>
                <th>Ward & Bed</th>
                <th>Attending Doctor</th>
                <th>Admission Date</th>
                <th>Expected Discharge</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {admissions.map((adm) => (
                <tr key={adm.id}>
                  <td><strong>{adm.admissionNumber}</strong></td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{adm.patientName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{adm.patientId}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '500' }}>{adm.roomNumber}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{adm.ward}</div>
                  </td>
                  <td>{adm.attendingDoctor}</td>
                  <td>{formatDate(adm.admissionDate)}</td>
                  <td>{formatDate(adm.expectedDischarge)}</td>
                  <td><Badge status={adm.status} text={adm.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
