import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Printer, Download, Hospital, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const InvoiceModal = ({ isOpen, onClose, bill }) => {
  const toast = useToast();
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success(`Generated PDF for ${bill.invoiceNumber}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Medical Invoice Details"
      maxWidth="740px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Distributed Ledger Ref: <code>TXN-BL-{bill.id}</code>
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleDownload} className="btn btn-secondary btn-sm">
              <Download size={15} /> Download PDF
            </button>
            <button onClick={handlePrint} className="btn btn-primary btn-sm">
              <Printer size={15} /> Print Invoice
            </button>
          </div>
        </div>
      }
    >
      <div className="printable-area" style={{ padding: '8px' }}>
        {/* Invoice Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0284c7', marginBottom: '6px' }}>
              <Hospital size={26} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                DHMS MEMORIAL HEALTHCARE
              </h2>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
              Distributed Clinical Network • System Node US-EAST<br />
              100 Innovation Parkway, Healthcare City, MD 20814<br />
              Contact: billing@dhms-hospital.org • Tel: +1 (800) 555-DHMS
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: '800', color: '#0284c7' }}>
              INVOICE
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#0f172a' }}>
              #{bill.invoiceNumber}
            </div>
            <div style={{ marginTop: '8px' }}>
              <Badge status={bill.paymentStatus} text={bill.paymentStatus} />
            </div>
          </div>
        </div>

        {/* Bill To & Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Billed To Patient
            </span>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>{bill.patientName}</div>
            <div style={{ fontSize: '0.8rem', color: '#475569' }}>Patient ID: <strong>{bill.patientId}</strong></div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Payment Mode: {bill.paymentMethod || 'Hospital Account'}</div>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'right' }}>
            <div style={{ fontSize: '0.8125rem', marginBottom: '4px' }}>
              <span style={{ color: '#64748b' }}>Invoice Date: </span>
              <strong>{formatDate(bill.date)}</strong>
            </div>
            <div style={{ fontSize: '0.8125rem', marginBottom: '4px' }}>
              <span style={{ color: '#64748b' }}>Payment Due: </span>
              <strong>{formatDate(bill.dueDate)}</strong>
            </div>
            <div style={{ fontSize: '0.8125rem' }}>
              <span style={{ color: '#64748b' }}>Billing Service: </span>
              <span style={{ color: '#0f766e', fontWeight: '600' }}>Node.js Microservice</span>
            </div>
          </div>
        </div>

        {/* Itemized Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', color: '#475569', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Item & Service Description</th>
              <th style={{ padding: '10px 12px', textAlign: 'center', color: '#475569', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Department</th>
              <th style={{ padding: '10px 12px', textAlign: 'center', color: '#475569', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Qty</th>
              <th style={{ padding: '10px 12px', textAlign: 'right', color: '#475569', fontWeight: '600', fontSize: '0.75rem', textTransform: 'uppercase' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {(bill.items || []).map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontWeight: '500', color: '#1e293b' }}>{item.description}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontWeight: '600' }}>
                    {item.type}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', color: '#475569' }}>{item.quantity || 1}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#0f172a' }}>
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Calculation Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <div style={{ width: '280px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', color: '#64748b' }}>
              <span>Subtotal:</span>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>{formatCurrency(bill.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', color: '#64748b' }}>
              <span>Tax / VAT (5%):</span>
              <span style={{ fontWeight: '600', color: '#0f172a' }}>{formatCurrency(bill.tax)}</span>
            </div>
            {bill.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', color: '#16a34a' }}>
                <span>Discount / Concession:</span>
                <span>-{formatCurrency(bill.discount)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '2px solid #e2e8f0', fontSize: '1.1rem', fontWeight: '800', color: '#0f172a' }}>
              <span>Grand Total:</span>
              <span style={{ color: '#0284c7' }}>{formatCurrency(bill.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
          This is an electronically generated healthcare statement certified by DHMS Distributed Ledger. All records are synchronized with primary PostgreSQL database clusters and Redis cache layers.
        </div>
      </div>
    </Modal>
  );
};
