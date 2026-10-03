import React, { useState } from 'react';
import {
  FlaskConical,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  FileCheck,
  Search,
  Activity,
  FileText
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';

export const LaboratoryDashboard = ({ onNavigate }) => {
  const { labTests, patients, doctors, addLabTest, updateLabTest } = useData();
  const toast = useToast();

  const [filterStatus, setFilterStatus] = useState('All');
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isNewTestModalOpen, setIsNewTestModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  // Result entry state
  const [param1, setParam1] = useState('');
  const [val1, setVal1] = useState('');
  const [unit1, setUnit1] = useState('');
  const [refRange1, setRefRange1] = useState('');
  const [flag1, setFlag1] = useState('Normal');

  // New Test order form state
  const [newTest, setNewTest] = useState({
    patientId: patients[0]?.id || '',
    testName: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    orderedBy: doctors[0]?.name || 'Dr. Sarah Jenkins',
    priority: 'Normal',
    specimen: 'Venous Blood (EDTA)'
  });

  const pendingCount = labTests.filter((t) => t.status === 'Pending').length;
  const inProgressCount = labTests.filter((t) => t.status === 'In Progress').length;
  const completedCount = labTests.filter((t) => t.status === 'Completed').length;
  const statCount = labTests.filter((t) => t.priority === 'STAT').length;

  const filteredTests = labTests.filter((t) => {
    if (filterStatus === 'All') return true;
    return t.status === filterStatus;
  });

  const handleOpenResultModal = (test) => {
    setSelectedTest(test);
    if (test.results && test.results.length > 0) {
      setParam1(test.results[0].param);
      setVal1(test.results[0].value);
      setUnit1(test.results[0].unit);
      setRefRange1(test.results[0].referenceRange);
      setFlag1(test.results[0].flag || 'Normal');
    } else {
      setParam1(test.testName.includes('Lipid') ? 'Total Cholesterol' : test.testName.includes('Glucose') ? 'Fasting Glucose' : 'Result Parameter');
      setVal1('');
      setUnit1(test.testName.includes('Lipid') || test.testName.includes('Glucose') ? 'mg/dL' : 'g/dL');
      setRefRange1('< 200 mg/dL');
      setFlag1('Normal');
    }
    setIsResultModalOpen(true);
  };

  const handleSaveResults = (e) => {
    e.preventDefault();
    if (!selectedTest) return;

    updateLabTest(selectedTest.id, {
      status: 'Completed',
      completedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      results: [
        {
          param: param1 || 'Observed Parameter',
          value: val1 || 'Normal',
          unit: unit1,
          referenceRange: refRange1,
          flag: flag1
        }
      ]
    });

    toast.success(`Diagnostic test report finalized and posted for ${selectedTest.patientName}`);
    setIsResultModalOpen(false);
  };

  const handleCreateTest = (e) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === newTest.patientId) || patients[0];
    const created = addLabTest({
      ...newTest,
      patientName: patient.name,
      sampleDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
    });
    toast.success(`Lab investigation ordered for ${patient.name}`);
    setIsNewTestModalOpen(false);
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Diagnostic Pathology & Laboratory Services</h1>
          <p className="page-subtitle">
            Specimen tracking, automated analyzer integration, and diagnostic report verification.
          </p>
        </div>
        <div className="page-actions">
          <button onClick={() => setIsNewTestModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={15} /> Order Investigation
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <StatCard
          label="Pending Tests"
          value={pendingCount}
          icon={Clock}
          variant="warning"
          trend="Awaiting processing"
          trendType="neutral"
        />
        <StatCard
          label="In Progress"
          value={inProgressCount}
          icon={Activity}
          variant="primary"
          trend="On analyzer racks"
          trendType="positive"
        />
        <StatCard
          label="Completed Today"
          value={completedCount}
          icon={CheckCircle2}
          variant="success"
          trend="Verified & signed"
          trendType="positive"
        />
        <StatCard
          label="STAT Emergency Orders"
          value={statCount}
          icon={AlertTriangle}
          variant="danger"
          subtext="Immediate turnaround"
        />
      </div>

      {/* Tests Table Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Laboratory Specimen Queue</h3>
            <p className="card-subtitle">Microbiology, Hematology, Biochemistry, and Immunology batches</p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Pending', 'In Progress', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: filterStatus === st ? '#0284c7' : '#cbd5e1',
                  backgroundColor: filterStatus === st ? '#0284c7' : '#ffffff',
                  color: filterStatus === st ? '#ffffff' : '#64748b'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Test Code</th>
                <th>Patient Details</th>
                <th>Diagnostic Investigation</th>
                <th>Specimen</th>
                <th>Priority</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test) => (
                <tr key={test.id}>
                  <td><strong>{test.testCode}</strong></td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0f172a' }}>{test.patientName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{test.patientId}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#0369a1' }}>{test.testName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{test.category} • Ord: {test.orderedBy}</div>
                  </td>
                  <td>{test.specimen || 'Venous Blood'}</td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: test.priority === 'STAT' ? '#fee2e2' : test.priority === 'Urgent' ? '#fef3c7' : '#f1f5f9',
                        color: test.priority === 'STAT' ? '#dc2626' : test.priority === 'Urgent' ? '#d97706' : '#475569'
                      }}
                    >
                      {test.priority}
                    </span>
                  </td>
                  <td><Badge status={test.status} text={test.status} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      {test.status !== 'Completed' ? (
                        <button
                          onClick={() => handleOpenResultModal(test)}
                          className="btn btn-primary btn-sm"
                        >
                          <FileCheck size={14} /> Enter Results
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenResultModal(test)}
                          className="btn btn-secondary btn-sm"
                        >
                          View Results
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

      {/* Modal: Enter Test Results */}
      <Modal
        isOpen={isResultModalOpen}
        onClose={() => setIsResultModalOpen(false)}
        title={selectedTest?.status === 'Completed' ? 'Diagnostic Test Report' : 'Enter Quantitative Diagnostic Findings'}
        maxWidth="580px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button onClick={() => setIsResultModalOpen(false)} className="btn btn-secondary">
              Close
            </button>
            {selectedTest?.status !== 'Completed' && (
              <button onClick={handleSaveResults} className="btn btn-primary">
                Verify & Complete Report
              </button>
            )}
          </div>
        }
      >
        {selectedTest && (
          <div>
            <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: '700', color: '#0f172a' }}>{selectedTest.testName}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0284c7' }}>{selectedTest.testCode}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Patient: <strong>{selectedTest.patientName}</strong> ({selectedTest.patientId}) • Specimen: {selectedTest.specimen}
              </div>
            </div>

            {selectedTest.status === 'Completed' && selectedTest.results?.length > 0 ? (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f1f5f9' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left' }}>Parameter</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>Value</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>Unit</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center' }}>Reference</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTest.results.map((r, i) => (
                      <tr key={i} style={{ borderTop: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 12px', fontWeight: '600' }}>{r.param}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', fontWeight: '700', color: r.flag?.includes('Alert') ? '#dc2626' : '#0f172a' }}>
                          {r.value}
                        </td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', color: '#64748b' }}>{r.unit}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', color: '#64748b' }}>{r.referenceRange}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                          <span style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: '600',
                            background: r.flag?.includes('Alert') || r.flag?.includes('High') ? '#fee2e2' : '#dcfce7',
                            color: r.flag?.includes('Alert') || r.flag?.includes('High') ? '#b91c1c' : '#15803d'
                          }}>
                            {r.flag}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <form onSubmit={handleSaveResults}>
                <div className="form-group">
                  <label className="form-label">Tested Analyte / Parameter *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={param1}
                    onChange={(e) => setParam1(e.target.value)}
                    placeholder="e.g. Total Cholesterol"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label className="form-label">Quantitative Value *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={val1}
                      onChange={(e) => setVal1(e.target.value)}
                      placeholder="e.g. 185"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Units</label>
                    <input
                      type="text"
                      className="form-input"
                      value={unit1}
                      onChange={(e) => setUnit1(e.target.value)}
                      placeholder="mg/dL"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reference Range</label>
                    <input
                      type="text"
                      className="form-input"
                      value={refRange1}
                      onChange={(e) => setRefRange1(e.target.value)}
                      placeholder="< 200 mg/dL"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Clinical Interpretation Flag</label>
                  <select
                    className="form-select"
                    value={flag1}
                    onChange={(e) => setFlag1(e.target.value)}
                  >
                    <option value="Normal">Normal (Within Biological Reference)</option>
                    <option value="Borderline">Borderline Elevated</option>
                    <option value="High (Alert)">High (Critical Alert)</option>
                    <option value="Low">Low (Below Reference)</option>
                  </select>
                </div>
              </form>
            )}
          </div>
        )}
      </Modal>

      {/* Modal: Order New Test */}
      <Modal
        isOpen={isNewTestModalOpen}
        onClose={() => setIsNewTestModalOpen(false)}
        title="Order New Diagnostic Test"
        maxWidth="540px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button onClick={() => setIsNewTestModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreateTest} className="btn btn-primary">
              Submit Test Order
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateTest}>
          <div className="form-group">
            <label className="form-label">Select Patient *</label>
            <select
              className="form-select"
              value={newTest.patientId}
              onChange={(e) => setNewTest({ ...newTest, patientId: e.target.value })}
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.id}) - Blood {p.bloodGroup}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Test Investigation *</label>
            <input
              type="text"
              className="form-input"
              value={newTest.testName}
              onChange={(e) => setNewTest({ ...newTest, testName: e.target.value })}
              placeholder="e.g. Complete Blood Count (CBC)"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={newTest.category}
                onChange={(e) => setNewTest({ ...newTest, category: e.target.value })}
              >
                <option value="Hematology">Hematology</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Endocrinology">Endocrinology</option>
                <option value="Cardiology Diagnostics">Cardiology Diagnostics</option>
                <option value="Microbiology">Microbiology</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={newTest.priority}
                onChange={(e) => setNewTest({ ...newTest, priority: e.target.value })}
              >
                <option value="Normal">Normal</option>
                <option value="Urgent">Urgent</option>
                <option value="STAT">STAT Emergency</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Specimen Sample</label>
            <input
              type="text"
              className="form-input"
              value={newTest.specimen}
              onChange={(e) => setNewTest({ ...newTest, specimen: e.target.value })}
              placeholder="Venous Blood (EDTA), Urine, Sputum, etc."
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
