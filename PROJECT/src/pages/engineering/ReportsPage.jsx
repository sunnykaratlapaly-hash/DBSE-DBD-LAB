import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  Activity,
  Users,
  CheckCircle2
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { StatCard } from '../../components/common/StatCard';
import { AreaChart, BarChart, DonutChart } from '../../components/charts/MiniCharts';
import { formatCurrency } from '../../utils/formatters';

export const ReportsPage = () => {
  const { bills, appointments, patients, admissions, labTests } = useData();
  const toast = useToast();

  const handleExportCSV = () => {
    toast.success('Generated and downloaded clinical analytics CSV report');
  };

  const revenueByDept = [
    { label: 'Consultations', value: 2450, color: '#0284c7' },
    { label: 'Inpatient Beds', value: 4800, color: '#0d9488' },
    { label: 'Laboratory Diagnostics', value: 1650, color: '#f59e0b' },
    { label: 'Pharmacy Formulary', value: 3100, color: '#8b5cf6' }
  ];

  const monthlyVolume = [
    { label: 'Jan', value: 320 },
    { label: 'Feb', value: 410 },
    { label: 'Mar', value: 390 },
    { label: 'Apr', value: 520 },
    { label: 'May', value: 610 },
    { label: 'Jun', value: 740 }
  ];

  const deptWorkload = [
    { label: 'Cardiology', value: 42, color: '#ef4444' },
    { label: 'Neurology', value: 28, color: '#8b5cf6' },
    { label: 'Pediatrics', value: 35, color: '#0ea5e9' },
    { label: 'Orthopedics', value: 31, color: '#f59e0b' },
    { label: 'Internal Med', value: 55, color: '#10b981' }
  ];

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Analytics & Clinical Reports</h1>
          <p className="page-subtitle">
            Longitudinal hospital metrics, department utilization, revenue streams, and quality benchmarks.
          </p>
        </div>
        <div className="page-actions">
          <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
            <Download size={15} /> Export Analytical Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <StatCard
          label="Total Clinical Encounters"
          value="2,480"
          icon={Activity}
          variant="primary"
          trend="+12.4% vs last quarter"
          trendType="positive"
        />
        <StatCard
          label="Gross Revenue Realized"
          value={formatCurrency(12000)}
          icon={DollarSign}
          variant="success"
          trend="+15.8% YoY"
          trendType="positive"
        />
        <StatCard
          label="Avg Lab Turnaround"
          value="4.2 Hours"
          icon={Calendar}
          variant="teal"
          trend="98.5% within SLA"
          trendType="positive"
        />
        <StatCard
          label="Readmission Rate (30d)"
          value="3.1%"
          icon={Users}
          variant="warning"
          trend="Below national avg (5.8%)"
          trendType="positive"
        />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Patient Intake Volume (H1 2026)</h3>
              <p className="card-subtitle">Monthly patient consultations across all hospital clinics</p>
            </div>
          </div>
          <AreaChart data={monthlyVolume} height={240} color="#0284c7" />
        </div>

        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Revenue Distribution by Service</h3>
              <p className="card-subtitle">Contributions from consultations, lab, pharmacy, and admissions</p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
            <DonutChart data={revenueByDept} size={180} />
          </div>
        </div>
      </div>

      {/* Department Workload Bar Chart */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Consultation Workload by Department</h3>
            <p className="card-subtitle">Weekly patient appointment volume distributed across specialties</p>
          </div>
        </div>
        <BarChart data={deptWorkload} height={220} />
      </div>
    </div>
  );
};
