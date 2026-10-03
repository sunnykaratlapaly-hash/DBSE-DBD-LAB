import React, { useState } from 'react';
import {
  Pill,
  AlertTriangle,
  PackagePlus,
  ArrowDownCircle,
  Search,
  CheckCircle2,
  Receipt,
  Plus,
  Clock,
  Filter
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const PharmacyDashboard = ({ onNavigate }) => {
  const { medicines, dispenseMedicine, updateMedicineStock, addMedicine } = useData();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Modals
  const [isDispenseModalOpen, setIsDispenseModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isNewMedModalOpen, setIsNewMedModalOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState(null);

  // Dispense Form state
  const [dispenseQty, setDispenseQty] = useState(30);
  const [patientRxNote, setPatientRxNote] = useState('');

  // Restock Form state
  const [restockQty, setRestockQty] = useState(100);

  // Add Med state
  const [newMedForm, setNewMedForm] = useState({
    name: '',
    genericName: '',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    stockLevel: 200,
    minThreshold: 50,
    unitPrice: 10.00,
    expiryDate: '2028-12-31',
    manufacturer: 'Pfizer',
    batchNumber: 'B-12903'
  });

  const lowStockCount = medicines.filter((m) => m.stockLevel < m.minThreshold).length;
  const totalItems = medicines.length;
  const totalStockUnits = medicines.reduce((acc, m) => acc + m.stockLevel, 0);

  const filteredMeds = medicines.filter((m) => {
    if (filterLowStockOnly && m.stockLevel >= m.minThreshold) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.code.toLowerCase().includes(q)
    );
  });

  const handleDispense = (e) => {
    e.preventDefault();
    if (!selectedMed) return;

    const qty = parseInt(dispenseQty);
    if (qty > selectedMed.stockLevel) {
      toast.error(`Insufficient inventory. Available: ${selectedMed.stockLevel} units`);
      return;
    }

    const success = dispenseMedicine(selectedMed.id, qty);
    if (success) {
      toast.success(`Dispensed ${qty} units of ${selectedMed.name}. Inventory decremented.`);
      setIsDispenseModalOpen(false);
    }
  };

  const handleRestock = (e) => {
    e.preventDefault();
    if (!selectedMed) return;

    const qty = parseInt(restockQty);
    updateMedicineStock(selectedMed.id, qty);
    toast.success(`Restocked ${qty} units of ${selectedMed.name}. Batch updated.`);
    setIsRestockModalOpen(false);
  };

  const handleCreateMed = (e) => {
    e.preventDefault();
    const created = addMedicine({
      ...newMedForm,
      stockLevel: parseInt(newMedForm.stockLevel),
      minThreshold: parseInt(newMedForm.minThreshold),
      unitPrice: parseFloat(newMedForm.unitPrice)
    });
    toast.success(`Added ${created.name} to pharmacy formulary.`);
    setIsNewMedModalOpen(false);
    setNewMedForm({ name: '', genericName: '', category: 'Cardiovascular', dosageForm: 'Tablet', stockLevel: 200, minThreshold: 50, unitPrice: 10.00, expiryDate: '2028-12-31', manufacturer: 'Pfizer', batchNumber: 'B-12903' });
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Hospital Pharmacy & Inventory Management</h1>
          <p className="page-subtitle">
            Dispensing, automated stock threshold tracking, formulary management, and batch expiration checks.
          </p>
        </div>
        <div className="page-actions">
          <button onClick={() => setIsNewMedModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={15} /> Add Medication
          </button>
          <button onClick={() => onNavigate('billing')} className="btn btn-secondary btn-sm">
            <Receipt size={15} /> Pharmacy Billing
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stat-grid">
        <StatCard
          label="Total Formulary Drugs"
          value={totalItems}
          icon={Pill}
          variant="primary"
          subtext="Catalogued medications"
        />
        <StatCard
          label="Total Stock Units"
          value={totalStockUnits.toLocaleString()}
          icon={ArrowDownCircle}
          variant="teal"
          subtext="Distributed across wards"
        />
        <StatCard
          label="Low-Stock Alerts"
          value={lowStockCount}
          icon={AlertTriangle}
          variant="danger"
          trend={lowStockCount > 0 ? 'Replenishment needed' : 'All stocks optimal'}
          trendType={lowStockCount > 0 ? 'negative' : 'positive'}
        />
        <StatCard
          label="Dispense Service"
          value="Online"
          icon={CheckCircle2}
          variant="success"
          subtext="Atomic lock protected"
        />
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockCount > 0 && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            borderRadius: 'var(--radius-lg)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={22} style={{ color: '#dc2626' }} />
            <div>
              <div style={{ fontWeight: '700', color: '#991b1b', fontSize: '0.9rem' }}>
                Inventory Alert: {lowStockCount} medications are below their critical safety thresholds!
              </div>
              <div style={{ fontSize: '0.78rem', color: '#b91c1c' }}>
                Items: {medicines.filter((m) => m.stockLevel < m.minThreshold).map((m) => `${m.name} (${m.stockLevel} left)`).join(', ')}
              </div>
            </div>
          </div>
          <button
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className="btn btn-danger btn-sm"
          >
            {filterLowStockOnly ? 'Show All Catalog' : 'Filter Low Stock Only'}
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      <div className="card" style={{ marginBottom: '24px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div className="search-wrapper" style={{ flex: 1, minWidth: '260px' }}>
            <input
              type="text"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medication name, generic compound, category, batch..."
            />
            <Search size={16} className="search-icon" />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
              style={{
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8125rem',
                fontWeight: '600',
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filterLowStockOnly ? '#dc2626' : '#cbd5e1',
                backgroundColor: filterLowStockOnly ? '#fee2e2' : '#ffffff',
                color: filterLowStockOnly ? '#b91c1c' : '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Filter size={14} /> Low Stock Only ({lowStockCount})
            </button>
          </div>
        </div>
      </div>

      {/* Medicines Inventory Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Medication Inventory & Formulary</h3>
            <p className="card-subtitle">Real-time stock levels synchronized with Inpatient & Outpatient pharmacy</p>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Showing {filteredMeds.length} of {medicines.length} products
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code & Name</th>
                <th>Category</th>
                <th>Dosage Form</th>
                <th>Current Stock</th>
                <th>Unit Price</th>
                <th>Expiry Date</th>
                <th>Manufacturer</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeds.map((med) => {
                const isLow = med.stockLevel < med.minThreshold;
                return (
                  <tr key={med.id} style={{ backgroundColor: isLow ? 'rgba(254, 242, 242, 0.4)' : 'transparent' }}>
                    <td>
                      <div style={{ fontWeight: '700', color: '#0f172a' }}>{med.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{med.genericName} • {med.code}</div>
                    </td>
                    <td>{med.category}</td>
                    <td>{med.dosageForm}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '700', color: isLow ? '#dc2626' : '#0f172a', minWidth: '40px' }}>
                          {med.stockLevel}
                        </span>
                        {isLow ? (
                          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: '#fee2e2', color: '#b91c1c', borderRadius: '4px', fontWeight: '700' }}>
                            LOW
                          </span>
                        ) : (
                          <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${Math.min(100, (med.stockLevel / 500) * 100)}%`, height: '100%', background: '#10b981' }} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td><strong>{formatCurrency(med.unitPrice)}</strong></td>
                    <td>{formatDate(med.expiryDate)}</td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{med.manufacturer}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setSelectedMed(med);
                            setDispenseQty(30);
                            setIsDispenseModalOpen(true);
                          }}
                          className="btn btn-primary btn-sm"
                          disabled={med.stockLevel <= 0}
                        >
                          Dispense
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMed(med);
                            setRestockQty(100);
                            setIsRestockModalOpen(true);
                          }}
                          className="btn btn-secondary btn-sm"
                        >
                          Restock
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Dispense Medicine */}
      <Modal
        isOpen={isDispenseModalOpen}
        onClose={() => setIsDispenseModalOpen(false)}
        title="Dispense Prescription Medication"
        maxWidth="520px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button onClick={() => setIsDispenseModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleDispense} className="btn btn-primary">
              Confirm & Dispense
            </button>
          </div>
        }
      >
        {selectedMed && (
          <form onSubmit={handleDispense}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>{selectedMed.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Batch: {selectedMed.batchNumber} • Available Stock: <strong>{selectedMed.stockLevel} units</strong>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#0284c7', marginTop: '4px' }}>
                Unit Price: {formatCurrency(selectedMed.unitPrice)}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity to Dispense *</label>
              <input
                type="number"
                className="form-input"
                min="1"
                max={selectedMed.stockLevel}
                value={dispenseQty}
                onChange={(e) => setDispenseQty(e.target.value)}
                required
              />
              <span className="form-hint">
                Subtotal charge: <strong>{formatCurrency((parseInt(dispenseQty) || 0) * selectedMed.unitPrice)}</strong>
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Prescription / Patient Order Ref</label>
              <input
                type="text"
                className="form-input"
                value={patientRxNote}
                onChange={(e) => setPatientRxNote(e.target.value)}
                placeholder="e.g. Rx-SarahJenkins-Wilson-1001"
              />
            </div>
          </form>
        )}
      </Modal>

      {/* Modal: Restock Medicine */}
      <Modal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        title="Restock Inventory Order"
        maxWidth="500px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button onClick={() => setIsRestockModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleRestock} className="btn btn-primary">
              Add to Stock
            </button>
          </div>
        }
      >
        {selectedMed && (
          <form onSubmit={handleRestock}>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: '#0f172a' }}>{selectedMed.name}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Current Level: <strong>{selectedMed.stockLevel}</strong> | Minimum Threshold: <strong>{selectedMed.minThreshold}</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Restock Units Received *</label>
              <input
                type="number"
                className="form-input"
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(e.target.value)}
                required
              />
            </div>
          </form>
        )}
      </Modal>

      {/* Modal: Add New Medication */}
      <Modal
        isOpen={isNewMedModalOpen}
        onClose={() => setIsNewMedModalOpen(false)}
        title="Add New Medication to Formulary"
        maxWidth="580px"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', width: '100%' }}>
            <button onClick={() => setIsNewMedModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={handleCreateMed} className="btn btn-primary">
              Register Medicine
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateMed}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Brand / Product Name *</label>
              <input
                type="text"
                className="form-input"
                value={newMedForm.name}
                onChange={(e) => setNewMedForm({ ...newMedForm, name: e.target.value })}
                placeholder="e.g. Ciprofloxacin 500mg"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Generic Chemical Name</label>
              <input
                type="text"
                className="form-input"
                value={newMedForm.genericName}
                onChange={(e) => setNewMedForm({ ...newMedForm, genericName: e.target.value })}
                placeholder="Ciprofloxacin HCl"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={newMedForm.category}
                onChange={(e) => setNewMedForm({ ...newMedForm, category: e.target.value })}
              >
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Antidiabetic">Antidiabetic</option>
                <option value="Analgesic & Antipyretic">Analgesic & Antipyretic</option>
                <option value="Hypolipidemic">Hypolipidemic</option>
                <option value="Respiratory">Respiratory</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Dosage Form</label>
              <select
                className="form-select"
                value={newMedForm.dosageForm}
                onChange={(e) => setNewMedForm({ ...newMedForm, dosageForm: e.target.value })}
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup / Suspension</option>
                <option value="Injection">Injection / Vial</option>
                <option value="Inhaler">Inhaler</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Initial Stock</label>
              <input
                type="number"
                className="form-input"
                value={newMedForm.stockLevel}
                onChange={(e) => setNewMedForm({ ...newMedForm, stockLevel: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Min Threshold</label>
              <input
                type="number"
                className="form-input"
                value={newMedForm.minThreshold}
                onChange={(e) => setNewMedForm({ ...newMedForm, minThreshold: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                value={newMedForm.unitPrice}
                onChange={(e) => setNewMedForm({ ...newMedForm, unitPrice: e.target.value })}
                required
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
