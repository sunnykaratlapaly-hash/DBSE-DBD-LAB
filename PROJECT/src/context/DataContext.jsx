import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_PATIENTS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_RECORDS,
  INITIAL_ADMISSIONS,
  INITIAL_LAB_TESTS,
  INITIAL_MEDICINES,
  INITIAL_BILLS,
  INITIAL_MONITORING_DATA
} from '../utils/demoData';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // Initialize state from localStorage or initial constants
  const [patients, setPatients] = useState(() => {
    try {
      const saved = localStorage.getItem('dhms_patients');
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [doctors, setDoctors] = useState(() => {
    try {
      const saved = localStorage.getItem('dhms_doctors');
      return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
    } catch {
      return INITIAL_DOCTORS;
    }
  });

  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem('dhms_appointments');
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [records, setRecords] = useState(() => {
    try {
      const saved = localStorage.getItem('dhms_records');
      return saved ? JSON.parse(saved) : INITIAL_RECORDS;
    } catch {
      return INITIAL_RECORDS;
    }
  });

  const [admissions, setAdmissions] = useState(() => {
    try {
      const saved = localStorage.getItem('dhms_admissions');
      return saved ? JSON.parse(saved) : INITIAL_ADMISSIONS;
    } catch {
      return INITIAL_ADMISSIONS;
    }
  });

  const [labTests, setLabTests] = useState(() => {
    try {
      const saved = localStorage.getItem('dhms_lab_tests');
      return saved ? JSON.parse(saved) : INITIAL_LAB_TESTS;
    } catch {
      return INITIAL_LAB_TESTS;
    }
  });

  const [medicines, setMedicines] = useState(() => {
    try {
      const saved = localStorage.getItem('dhms_medicines');
      return saved ? JSON.parse(saved) : INITIAL_MEDICINES;
    } catch {
      return INITIAL_MEDICINES;
    }
  });

  const [bills, setBills] = useState(() => {
    try {
      const saved = localStorage.getItem('dhms_bills');
      return saved ? JSON.parse(saved) : INITIAL_BILLS;
    } catch {
      return INITIAL_BILLS;
    }
  });

  const [monitoring, setMonitoring] = useState(INITIAL_MONITORING_DATA);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('dhms_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('dhms_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('dhms_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('dhms_records', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('dhms_admissions', JSON.stringify(admissions));
  }, [admissions]);

  useEffect(() => {
    localStorage.setItem('dhms_lab_tests', JSON.stringify(labTests));
  }, [labTests]);

  useEffect(() => {
    localStorage.setItem('dhms_medicines', JSON.stringify(medicines));
  }, [medicines]);

  useEffect(() => {
    localStorage.setItem('dhms_bills', JSON.stringify(bills));
  }, [bills]);

  // CRUD Operations

  // --- Patients ---
  const addPatient = (newPatient) => {
    const created = {
      ...newPatient,
      id: newPatient.id || `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setPatients((prev) => [created, ...prev]);
    return created;
  };

  const updatePatient = (id, updatedFields) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deletePatient = (id) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  // --- Appointments ---
  const addAppointment = (apt) => {
    const created = {
      ...apt,
      id: apt.id || `APT-${Math.floor(3000 + Math.random() * 7000)}`,
      status: apt.status || 'Scheduled'
    };
    setAppointments((prev) => [created, ...prev]);
    return created;
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  // --- Medical Records ---
  const addMedicalRecord = (rec) => {
    const created = {
      ...rec,
      id: rec.id || `REC-${Math.floor(5000 + Math.random() * 5000)}`,
      recordNumber: `EMR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      date: rec.date || new Date().toISOString().split('T')[0],
      vectorEmbeddingId: `vec_emr_${Date.now()}`
    };
    setRecords((prev) => [created, ...prev]);
    return created;
  };

  // --- Admissions ---
  const addAdmission = (adm) => {
    const created = {
      ...adm,
      id: adm.id || `ADM-${Math.floor(4000 + Math.random() * 6000)}`,
      admissionNumber: `ADM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      admissionDate: adm.admissionDate || new Date().toISOString().split('T')[0],
      status: 'Admitted'
    };
    setAdmissions((prev) => [created, ...prev]);
    // Also update patient status
    if (adm.patientId) {
      updatePatient(adm.patientId, { status: 'Admitted' });
    }
    return created;
  };

  const updateAdmissionStatus = (id, status, actualDischarge = null) => {
    setAdmissions((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          if (status === 'Discharged' && a.patientId) {
            updatePatient(a.patientId, { status: 'Active' });
          }
          return {
            ...a,
            status,
            actualDischarge: actualDischarge || (status === 'Discharged' ? new Date().toISOString().split('T')[0] : a.actualDischarge)
          };
        }
        return a;
      })
    );
  };

  // --- Laboratory Tests ---
  const addLabTest = (test) => {
    const created = {
      ...test,
      id: test.id || `LAB-${Math.floor(6000 + Math.random() * 4000)}`,
      testCode: `LT-${Math.floor(100 + Math.random() * 900)}`,
      status: test.status || 'Pending',
      results: test.results || []
    };
    setLabTests((prev) => [created, ...prev]);
    return created;
  };

  const updateLabTest = (id, updateFields) => {
    setLabTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updateFields } : t))
    );
  };

  // --- Medicines & Pharmacy ---
  const addMedicine = (med) => {
    const created = {
      ...med,
      id: med.id || `MED-${Math.floor(7000 + Math.random() * 3000)}`,
      code: `RX-${med.name.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`
    };
    setMedicines((prev) => [created, ...prev]);
    return created;
  };

  const dispenseMedicine = (medId, quantity) => {
    let success = false;
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === medId) {
          if (m.stockLevel >= quantity) {
            success = true;
            return { ...m, stockLevel: m.stockLevel - quantity };
          }
        }
        return m;
      })
    );
    return success;
  };

  const updateMedicineStock = (medId, addedUnits) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === medId ? { ...m, stockLevel: Number(m.stockLevel) + Number(addedUnits) } : m))
    );
  };

  // --- Billing ---
  const addBill = (bill) => {
    const created = {
      ...bill,
      id: bill.id || `INV-${Math.floor(8000 + Math.random() * 2000)}`,
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      date: bill.date || new Date().toISOString().split('T')[0]
    };
    setBills((prev) => [created, ...prev]);
    return created;
  };

  const updateBillStatus = (id, paymentStatus, paymentMethod) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, paymentStatus, paymentMethod: paymentMethod || b.paymentMethod } : b))
    );
  };

  // Reset demo data to defaults
  const resetToDefaults = () => {
    setPatients(INITIAL_PATIENTS);
    setDoctors(INITIAL_DOCTORS);
    setAppointments(INITIAL_APPOINTMENTS);
    setRecords(INITIAL_RECORDS);
    setAdmissions(INITIAL_ADMISSIONS);
    setLabTests(INITIAL_LAB_TESTS);
    setMedicines(INITIAL_MEDICINES);
    setBills(INITIAL_BILLS);
    localStorage.clear();
  };

  return (
    <DataContext.Provider
      value={{
        patients,
        doctors,
        appointments,
        records,
        admissions,
        labTests,
        medicines,
        bills,
        monitoring,
        setMonitoring,
        addPatient,
        updatePatient,
        deletePatient,
        addAppointment,
        updateAppointmentStatus,
        addMedicalRecord,
        addAdmission,
        updateAdmissionStatus,
        addLabTest,
        updateLabTest,
        addMedicine,
        dispenseMedicine,
        updateMedicineStock,
        addBill,
        updateBillStatus,
        resetToDefaults
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
