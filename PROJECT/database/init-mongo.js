// =============================================================================
// Distributed Hospital Management System (DHMS) - MongoDB 7.0 Initialization
// Database Systems Engineering (DBSE) Document Store for Pathology & Telemetry
// =============================================================================

db = db.getSiblingDB('hospital_diagnostics');

// Create collections with validation
db.createCollection('lab_reports');
db.createCollection('analyzer_telemetry');
db.createCollection('audit_logs');

// Create indexes
db.lab_reports.createIndex({ testCode: 1 }, { unique: true });
db.lab_reports.createIndex({ patientId: 1 });
db.lab_reports.createIndex({ status: 1 });
db.audit_logs.createIndex({ timestamp: -1 });

// Seed Laboratory Reports with dynamic nested parameters
db.lab_reports.insertMany([
  {
    testCode: "LT-CBC-01",
    patientId: "PAT-1001",
    patientName: "James Wilson",
    testName: "Complete Blood Count (CBC) with Differential",
    category: "Hematology",
    orderedBy: "Dr. Sarah Jenkins",
    sampleDate: ISODate("2026-09-11T08:30:00Z"),
    completedDate: ISODate("2026-09-11T14:15:00Z"),
    status: "Completed",
    priority: "Normal",
    specimen: "Venous Blood (EDTA)",
    analyzerId: "SYSMEX-XN-1000",
    results: [
      { param: "Hemoglobin", value: 14.8, unit: "g/dL", referenceRange: "13.5 - 17.5", flag: "Normal" },
      { param: "WBC Count", value: 6.4, unit: "x10^3/uL", referenceRange: "4.5 - 11.0", flag: "Normal" },
      { param: "Platelets", value: 245, unit: "x10^3/uL", referenceRange: "150 - 450", flag: "Normal" },
      { param: "Hematocrit", value: 44.2, unit: "%", referenceRange: "41.0 - 50.0", flag: "Normal" }
    ],
    verifiedBy: "David Kim, MLS"
  },
  {
    testCode: "LT-TROP-04",
    patientId: "PAT-1005",
    patientName: "Liam Gallagher",
    testName: "Cardiac Troponin I (High Sensitivity)",
    category: "Cardiology Diagnostics",
    orderedBy: "Dr. Sarah Jenkins",
    sampleDate: ISODate("2026-09-10T23:30:00Z"),
    completedDate: ISODate("2026-09-11T00:15:00Z"),
    status: "Completed",
    priority: "STAT",
    specimen: "Plasma (Lithium Heparin)",
    analyzerId: "ROCHE-COBAS-E411",
    results: [
      { param: "hs-cTnI", value: 0.082, unit: "ng/mL", referenceRange: "< 0.034", flag: "High (Alert)" },
      { param: "CK-MB", value: 18.4, unit: "ng/mL", referenceRange: "< 5.0", flag: "High (Alert)" }
    ],
    verifiedBy: "David Kim, MLS"
  },
  {
    testCode: "LT-GLU-03",
    patientId: "PAT-1002",
    patientName: "Eleanor Vance",
    testName: "Glycated Hemoglobin (HbA1c) & Fasting Insulin",
    category: "Endocrinology",
    orderedBy: "Dr. Amanda Chen",
    sampleDate: ISODate("2026-09-12T09:00:00Z"),
    completedDate: null,
    status: "Pending",
    priority: "Urgent",
    specimen: "Whole Blood",
    results: []
  }
]);

// Seed HIPAA Audit Logs
db.audit_logs.insertMany([
  {
    userId: "USR-002",
    userName: "Dr. Sarah Jenkins",
    action: "READ_EMR_RECORD",
    resourceId: "REC-5001",
    patientId: "PAT-1001",
    ipAddress: "10.0.4.12",
    timestamp: ISODate("2026-09-12T04:30:00Z"),
    status: "SUCCESS"
  },
  {
    userId: "USR-005",
    userName: "Priya Sharma",
    action: "DISPENSE_MEDICATION",
    resourceId: "MED-7001",
    quantity: 30,
    timestamp: ISODate("2026-09-12T05:15:00Z"),
    status: "SUCCESS"
  }
]);

print("MongoDB hospital_diagnostics initialized successfully.");
