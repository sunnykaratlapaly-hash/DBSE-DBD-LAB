import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  DollarSign,
  Printer,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { InvoiceModal } from '../../components/invoice/InvoiceModal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const BillingPage = ({ onNavigate }) => {
  const { bills, patients, addBill, updateBillStatus } = useData();
  const toast = useToast();

  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const [selectedBillForInvoice, setSelectedBillForInvoice] = useState(null);

  // New Bill Form State
  const [billForm, setBillForm] = useState({
    patientId: patients[0]?.id || '',
    consultationCharge: 120,
    labCharge: 85,
    pharmacyCharge: 45,
    admissionCharge: 0,
    discount: 0,
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  });

  const filteredBills = bills.filter((b) => {
    if (statusFilter !== 'All' && b.paymentStatus !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      b.invoiceNumber.toLowerCase().includes(q) ||
      b.patientName.toLowerCase().includes(q) ||
      b.patientId.toLowerCase().includes(q)
    );
  });

  // Calculate Aggregates
  const totalInvoiced = bills.reduce((acc, b) => acc + b.totalAmount, 0);
  const paidRevenue = bills.reduce((acc, b) => acc + (b.paymentStatus === 'Paid' ? b.totalAmount : (b.amountPaid || 0)), 0);
  const pendingReceivables = bills.reduce((acc, b) => acc + (b.paymentStatus !== 'Paid' ? (b.balanceDue || b.totalAmount) : 0), 0);

  const handleCreateBill = (e) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === billForm.patientId) || patients[0];

    const items = [];
    if (billForm.consultationCharge > 0) items.push({ description: 'Specialist Physician Consultation', type: 'Consultation', amount: parseFloat(billForm.consultationCharge), quantity: 1 });
    if (billForm.labCharge > 0) items.push({ description: 'Pathology Diagnostics Panel', type: 'Laboratory', amount: parseFloat(billForm.labCharge), quantity: 1 });
    if (billForm.pharmacyCharge > 0) items.push({ description: 'Dispensed Formulary Prescription', type: 'Pharmacy', amount: parseFloat(billForm.pharmacyCharge), quantity: 1 });
    if (billForm.admissionCharge > 0) items.push({ description: 'Inpatient Room & Board Charge', type: 'Admission', amount: parseFloat(billForm.admissionCharge), quantity: 1 });

    const subtotal = items.reduce((acc, i) => acc + i.amount, 0);
    const tax = subtotal * 0.05;
    const discount = parseFloat(billForm.discount) || 0;
    const totalAmount = subtotal + tax - discount;

    const created = addBill({
      patientId: pat.id,
      patientName: pat.name,
      dueDate: billForm.dueDate,
      paymentStatus: 'Pending',
      paymentMethod: 'Pending Payment',
      items,
      subtotal,
      tax,
      discount,
      totalAmount
    });

    toast.success(`Generated invoice ${created.invoiceNumber} for ${pat.name}`);
    setIsNewBillModalOpen(false);
  };

  const handleMarkPaid = (billId, invoiceNumber) => {
    updateBillStatus(billId, 'Paid', 'Credit Card / Terminal');
    toast.success(`Invoice ${invoiceNumber} marked as Paid in full.`);
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Patient Billing, Charges & Invoicing</h1>
          <p className="page-subtitle">
            Consolidated financial ledger across consultations, diagnostics, pharmacy, and bed occupancy.
          </p>
        </div>
        <div className="page-actions">
          <button onClick={() => setIsNewBillModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={15} /> Create New Invoice
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="stat-grid">
        <StatCard
          label="Total Invoiced"
          value={formatCurrency(totalInvoiced)}
          icon={Receipt}
          variant="primary"
          subtext="All generated claims"
        />
        <StatCard
          label="Realized Revenue (Paid)"
          value={formatCurrency(paidRevenue)}
          icon={DollarSign}
          variant="success"
          trend="+18.4% collection rate"
          trendType="positive"
        />
        <StatCard
          label="Pending Receivables"
          value={formatCurrency(pendingReceivables)}
          icon={Clock}
          variant="warning"
          trend="3 accounts open"
          trendType="neutral"
        />
        <StatCard
          label="Billing Microservice"
          value="Node.js Core"
          icon={CheckCircle2}
          variant="teal"
          subtext="PostgreSQL ACID ledger"
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
              placeholder="Search by invoice number (e.g. INV-2026-00481), patient name, or ID..."
            />
            <Search size={16} className="search-icon" />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Paid', 'Pending', 'Partially Paid'].map((st) => (
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

      {/* Invoices Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Patient Statements & Invoices Ledger</h3>
            <p className="card-subtitle">Showing {filteredBills.length} billing records</p>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Patient Details</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Itemized Services</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill.id}>
                  <td><strong>{bill.invoiceNumber}</strong></td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#0f172a' }}>{bill.patientName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{bill.patientId}</div>
                  </td>
                  <td>{formatDate(bill.date)}</td>
                  <td>{formatDate(bill.dueDate)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {(bill.items || []).map((it, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: '0.7rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: '#f1f5f9',
                            color: '#475569',
                            fontWeight: '600'
                          }}
                        >
                          {it.type}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: '800', color: '#0284c7', fontSize: '0.95rem' }}>
                      {formatCurrency(bill.totalAmount)}
                    </div>
                    {bill.balanceDue && (
                      <div style={{ fontSize: '0.72rem', color: '#dc2626' }}>
                        Due: {formatCurrency(bill.balanceDue)}
                      </div>
                    )}
                  </td>
                  <td><Badge status={bill.paymentStatus} text={bill.paymentStatus} /></td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        onClick={() => setSelectedBillForInvoice(bill)}
                        className="btn btn-secondary btn-sm"
                        title="View / Print Invoice"
                      >
                        <Printer size={14} /> View Invoice
                      </button>
                      {bill.paymentStatus !== 'Paid' && (
                        <button
                          onClick={() => handleMarkPaid(bill.id, bill.invoiceNumber)}
                          className="btn btn-teal btn-sm"
                        >
                          Mark Paid
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

      {/* Modal: Create New Bill */}
      <Modal
        isOpen={isNewBillModalOpen}
        onClose={() => setIsNewBillModalOpen(false)}
        title="Generate Consolidated Medical Invoice"
        maxWidth="580px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button onClick={() => setIsNewBillModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreateBill} className="btn btn-primary">
              Generate & Post Invoice
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateBill}>
          <div className="form-group">
            <label className="form-label">Patient to Bill *</label>
            <select
              className="form-select"
              value={billForm.patientId}
              onChange={(e) => setBillForm({ ...billForm, patientId: e.target.value })}
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.id}) - Blood {p.bloodGroup}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Physician Consultation Fee ($)</label>
              <input
                type="number"
                className="form-input"
                value={billForm.consultationCharge}
                onChange={(e) => setBillForm({ ...billForm, consultationCharge: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Laboratory Diagnostic Fee ($)</label>
              <input
                type="number"
                className="form-input"
                value={billForm.labCharge}
                onChange={(e) => setBillForm({ ...billForm, labCharge: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Pharmacy Medications ($)</label>
              <input
                type="number"
                className="form-input"
                value={billForm.pharmacyCharge}
                onChange={(e) => setBillForm({ ...billForm, pharmacyCharge: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Inpatient Bed Charges ($)</label>
              <input
                type="number"
                className="form-input"
                value={billForm.admissionCharge}
                onChange={(e) => setBillForm({ ...billForm, admissionCharge: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Insurance / Concession Discount ($)</label>
              <input
                type="number"
                className="form-input"
                value={billForm.discount}
                onChange={(e) => setBillForm({ ...billForm, discount: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Payment Due Date</label>
              <input
                type="date"
                className="form-input"
                value={billForm.dueDate}
                onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Invoice Modal Preview */}
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
