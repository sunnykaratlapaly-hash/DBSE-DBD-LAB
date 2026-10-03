// Distributed Hospital Management System (DHMS) - Demo Clinical & Architectural Dataset

export const INITIAL_USERS = [
  {
    id: 'USR-001',
    name: 'Dr. Arthur Vance',
    email: 'admin@hospital.org',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    title: 'Chief Medical Administrator',
    department: 'Hospital Administration'
  },
  {
    id: 'USR-002',
    name: 'Dr. Sarah Jenkins, MD',
    email: 'dr.sarah@hospital.org',
    role: 'Doctor',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Cardiologist & HOD',
    department: 'Cardiology'
  },
  {
    id: 'USR-003',
    name: 'Emily Chen',
    email: 'reception@hospital.org',
    role: 'Receptionist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Front Desk Lead',
    department: 'Patient Services'
  },
  {
    id: 'USR-004',
    name: 'David Kim, MLS',
    email: 'lab@hospital.org',
    role: 'Laboratory Staff',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Diagnostic Pathologist',
    department: 'Central Pathology Lab'
  },
  {
    id: 'USR-005',
    name: 'Priya Sharma, PharmD',
    email: 'pharma@hospital.org',
    role: 'Pharmacist',
    avatar: 'https://images.unsplash.com/photo-1594824813684-256f1604a11c?w=150&auto=format&fit=crop&q=80',
    title: 'Chief Inpatient Pharmacist',
    department: 'Hospital Pharmacy'
  },
  {
    id: 'USR-006',
    name: 'James Wilson',
    email: 'patient@hospital.org',
    role: 'Patient',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Registered Patient',
    department: 'General Care',
    patientId: 'PAT-1001'
  }
];

export const INITIAL_PATIENTS = [
  {
    id: 'PAT-1001',
    name: 'James Wilson',
    age: 48,
    gender: 'Male',
    phone: '+1 (555) 234-5678',
    email: 'james.wilson@email.com',
    bloodGroup: 'O+',
    address: '742 Evergreen Terrace, Springfield',
    allergies: 'Penicillin, Shellfish',
    chronicConditions: 'Hypertension, Mild Asthma',
    emergencyContact: 'Sarah Wilson (Spouse) - +1 (555) 234-5679',
    registrationDate: '2026-01-15',
    status: 'Active'
  },
  {
    id: 'PAT-1002',
    name: 'Eleanor Vance',
    age: 34,
    gender: 'Female',
    phone: '+1 (555) 876-5432',
    email: 'eleanor.v@email.com',
    bloodGroup: 'A+',
    address: '124 Conch Street, Pacifica',
    allergies: 'Sulfa Drugs',
    chronicConditions: 'Type 2 Diabetes',
    emergencyContact: 'Robert Vance (Father) - +1 (555) 876-1122',
    registrationDate: '2026-02-04',
    status: 'Admitted'
  },
  {
    id: 'PAT-1003',
    name: 'Marcus Ramirez',
    age: 62,
    gender: 'Male',
    phone: '+1 (555) 345-9876',
    email: 'm.ramirez@email.com',
    bloodGroup: 'B-',
    address: '884 Oak Ridge Lane, Riverdale',
    allergies: 'None Known',
    chronicConditions: 'Coronary Artery Disease',
    emergencyContact: 'Maria Ramirez (Daughter) - +1 (555) 345-0012',
    registrationDate: '2026-02-18',
    status: 'Active'
  },
  {
    id: 'PAT-1004',
    name: 'Sophia Patel',
    age: 27,
    gender: 'Female',
    phone: '+1 (555) 654-3210',
    email: 'sophia.patel@email.com',
    bloodGroup: 'AB+',
    address: '43 Meadowbrook Court, Lakewood',
    allergies: 'Aspirin',
    chronicConditions: 'None',
    emergencyContact: 'Aarav Patel (Brother) - +1 (555) 654-9988',
    registrationDate: '2026-03-01',
    status: 'Active'
  },
  {
    id: 'PAT-1005',
    name: 'Liam Gallagher',
    age: 53,
    gender: 'Male',
    phone: '+1 (555) 432-8765',
    email: 'liam.g@email.com',
    bloodGroup: 'O-',
    address: '901 Highline Ave, Downtown',
    allergies: 'Ibuprofen',
    chronicConditions: 'Hyperlipidemia',
    emergencyContact: 'Fiona Gallagher (Sister) - +1 (555) 432-3344',
    registrationDate: '2026-03-05',
    status: 'Admitted'
  },
  {
    id: 'PAT-1006',
    name: 'Clara Oswald',
    age: 31,
    gender: 'Female',
    phone: '+1 (555) 789-0123',
    email: 'clara.oswald@email.com',
    bloodGroup: 'A-',
    address: '10 Downing Way, Brookside',
    allergies: 'Latex',
    chronicConditions: 'Migraine',
    emergencyContact: 'Danny Pink (Partner) - +1 (555) 789-4455',
    registrationDate: '2026-03-10',
    status: 'Active'
  }
];

export const INITIAL_DOCTORS = [
  {
    id: 'DOC-201',
    name: 'Dr. Sarah Jenkins',
    department: 'Cardiology',
    qualification: 'MD, FACC - Johns Hopkins',
    experience: '14 years',
    room: 'Room 302, West Wing',
    availability: 'Mon - Fri (09:00 - 15:00)',
    phone: '+1 (555) 901-2211',
    email: 'dr.sarah@hospital.org',
    consultationFee: 120,
    rating: 4.9,
    status: 'Available'
  },
  {
    id: 'DOC-202',
    name: 'Dr. Marcus Brody',
    department: 'Neurology',
    qualification: 'MD, PhD - Harvard Medical',
    experience: '18 years',
    room: 'Room 410, Neuro Science Block',
    availability: 'Mon, Wed, Fri (10:00 - 16:00)',
    phone: '+1 (555) 901-3322',
    email: 'dr.brody@hospital.org',
    consultationFee: 150,
    rating: 4.8,
    status: 'In Consultation'
  },
  {
    id: 'DOC-203',
    name: 'Dr. Elena Rostova',
    department: 'Pediatrics',
    qualification: 'MD, FAAP - Stanford University',
    experience: '11 years',
    room: 'Room 105, Children Clinic',
    availability: 'Tue - Sat (08:30 - 14:00)',
    phone: '+1 (555) 901-4433',
    email: 'dr.elena@hospital.org',
    consultationFee: 100,
    rating: 5.0,
    status: 'Available'
  },
  {
    id: 'DOC-204',
    name: 'Dr. Rajiv Nair',
    department: 'Orthopedics',
    qualification: 'MS (Ortho), FRCS - London',
    experience: '16 years',
    room: 'Room 215, Surgical Wing',
    availability: 'Mon - Thu (11:00 - 17:00)',
    phone: '+1 (555) 901-5544',
    email: 'dr.rajiv@hospital.org',
    consultationFee: 130,
    rating: 4.7,
    status: 'In Surgery'
  },
  {
    id: 'DOC-205',
    name: 'Dr. Amanda Chen',
    department: 'General Medicine',
    qualification: 'MD (Internal Medicine) - Columbia',
    experience: '9 years',
    room: 'Room 101, Outpatient Clinic',
    availability: 'Daily (08:00 - 16:00)',
    phone: '+1 (555) 901-6655',
    email: 'dr.amanda@hospital.org',
    consultationFee: 80,
    rating: 4.9,
    status: 'Available'
  }
];

export const INITIAL_APPOINTMENTS = [
  {
    id: 'APT-3001',
    patientId: 'PAT-1001',
    patientName: 'James Wilson',
    doctorId: 'DOC-201',
    doctorName: 'Dr. Sarah Jenkins',
    department: 'Cardiology',
    date: '2026-09-12',
    time: '10:30 AM',
    reason: 'Follow-up for hypertension and ECG review',
    status: 'Scheduled',
    room: 'Room 302'
  },
  {
    id: 'APT-3002',
    patientId: 'PAT-1004',
    patientName: 'Sophia Patel',
    doctorId: 'DOC-205',
    doctorName: 'Dr. Amanda Chen',
    department: 'General Medicine',
    date: '2026-09-12',
    time: '11:15 AM',
    reason: 'Persistent seasonal allergies and dry cough',
    status: 'Scheduled',
    room: 'Room 101'
  },
  {
    id: 'APT-3003',
    patientId: 'PAT-1006',
    patientName: 'Clara Oswald',
    doctorId: 'DOC-202',
    doctorName: 'Dr. Marcus Brody',
    department: 'Neurology',
    date: '2026-09-12',
    time: '02:00 PM',
    reason: 'Severe recurrent migraines with aura',
    status: 'Pending',
    room: 'Room 410'
  },
  {
    id: 'APT-3004',
    patientId: 'PAT-1003',
    patientName: 'Marcus Ramirez',
    doctorId: 'DOC-201',
    doctorName: 'Dr. Sarah Jenkins',
    department: 'Cardiology',
    date: '2026-09-13',
    time: '09:00 AM',
    reason: 'Post-angioplasty 6-month checkup',
    status: 'Scheduled',
    room: 'Room 302'
  },
  {
    id: 'APT-3005',
    patientId: 'PAT-1001',
    patientName: 'James Wilson',
    doctorId: 'DOC-204',
    doctorName: 'Dr. Rajiv Nair',
    department: 'Orthopedics',
    date: '2026-08-25',
    time: '03:30 PM',
    reason: 'Left knee stiffness after marathon training',
    status: 'Completed',
    room: 'Room 215'
  }
];

export const INITIAL_RECORDS = [
  {
    id: 'REC-5001',
    recordNumber: 'EMR-2026-001',
    patientId: 'PAT-1001',
    patientName: 'James Wilson',
    doctorId: 'DOC-201',
    doctorName: 'Dr. Sarah Jenkins',
    department: 'Cardiology',
    date: '2026-09-02',
    diagnosis: 'Stage 1 Primary Hypertension & Sinus Tachycardia',
    symptoms: 'Occasional morning dizziness, palpitations after exertion, mild headache',
    notes: 'Patient shows elevated blood pressure readings over past 3 weeks. Recommended lifestyle alterations (low sodium DASH diet) and started on ACE inhibitor. Scheduled 24-hr Holter monitor and lipid panel.',
    vitals: {
      bp: '142/90 mmHg',
      heartRate: '88 bpm',
      temp: '98.6 °F',
      spo2: '98%',
      respiratoryRate: '16 bpm',
      weight: '82 kg'
    },
    prescriptions: [
      { medicine: 'Lisinopril 10mg', dosage: '1 tablet daily morning', duration: '30 days' },
      { medicine: 'Amlodipine 5mg', dosage: '1 tablet night', duration: '30 days' }
    ],
    labResults: ['Lipid Profile - Total Chol 215 mg/dL (Borderline)', 'Serum Creatinine - 0.9 mg/dL (Normal)'],
    vectorEmbeddingId: 'vec_emr_5001_cardio_htn'
  },
  {
    id: 'REC-5002',
    recordNumber: 'EMR-2026-002',
    patientId: 'PAT-1002',
    patientName: 'Eleanor Vance',
    doctorId: 'DOC-205',
    doctorName: 'Dr. Amanda Chen',
    department: 'General Medicine',
    date: '2026-09-08',
    diagnosis: 'Type 2 Diabetes Mellitus with Ketoacidosis risk',
    symptoms: 'Extreme polydipsia, fatigue, blurred vision, weight loss',
    notes: 'Fasting glucose above 240 mg/dL. Admitted to general ward for glycemic stabilization and insulin regimen calibration.',
    vitals: {
      bp: '128/82 mmHg',
      heartRate: '94 bpm',
      temp: '99.1 °F',
      spo2: '97%',
      respiratoryRate: '18 bpm',
      weight: '64 kg'
    },
    prescriptions: [
      { medicine: 'Insulin Glargine 100U/mL', dosage: '14 units subcutaneous daily at bedtime', duration: 'Inpatient' },
      { medicine: 'Metformin 500mg', dosage: '1 tablet twice daily with meals', duration: 'Ongoing' }
    ],
    labResults: ['HbA1c - 9.4% (Critical High)', 'Fasting Plasma Glucose - 242 mg/dL'],
    vectorEmbeddingId: 'vec_emr_5002_diabetes_dka'
  }
];

export const INITIAL_ADMISSIONS = [
  {
    id: 'ADM-4001',
    admissionNumber: 'ADM-2026-88',
    patientId: 'PAT-1002',
    patientName: 'Eleanor Vance',
    roomNumber: '304-B',
    ward: 'Medical Inpatient Ward',
    bedType: 'Semi-Private Bed',
    admissionDate: '2026-09-08',
    expectedDischarge: '2026-09-14',
    actualDischarge: null,
    attendingDoctor: 'Dr. Amanda Chen',
    status: 'Admitted',
    dailyRate: 250,
    nurseInCharge: 'Staff Nurse Jennifer M.'
  },
  {
    id: 'ADM-4002',
    admissionNumber: 'ADM-2026-89',
    patientId: 'PAT-1005',
    patientName: 'Liam Gallagher',
    roomNumber: 'ICU-04',
    ward: 'Intensive Cardiac Care Unit (ICCU)',
    bedType: 'Critical Care Monitor Bed',
    admissionDate: '2026-09-10',
    expectedDischarge: '2026-09-16',
    actualDischarge: null,
    attendingDoctor: 'Dr. Sarah Jenkins',
    status: 'Admitted',
    dailyRate: 850,
    nurseInCharge: 'Critical Care Specialist Ryan T.'
  },
  {
    id: 'ADM-4003',
    admissionNumber: 'ADM-2026-75',
    patientId: 'PAT-1003',
    patientName: 'Marcus Ramirez',
    roomNumber: '210-A',
    ward: 'Surgical Recovery',
    bedType: 'Standard Ward Bed',
    admissionDate: '2026-08-20',
    expectedDischarge: '2026-08-24',
    actualDischarge: '2026-08-24',
    attendingDoctor: 'Dr. Rajiv Nair',
    status: 'Discharged',
    dailyRate: 180,
    nurseInCharge: 'Nurse David W.'
  }
];

export const INITIAL_LAB_TESTS = [
  {
    id: 'LAB-6001',
    testCode: 'LT-CBC-01',
    patientId: 'PAT-1001',
    patientName: 'James Wilson',
    testName: 'Complete Blood Count (CBC) with Differential',
    category: 'Hematology',
    orderedBy: 'Dr. Sarah Jenkins',
    sampleDate: '2026-09-11 08:30 AM',
    completedDate: '2026-09-11 02:15 PM',
    status: 'Completed',
    priority: 'Normal',
    specimen: 'Venous Blood (EDTA)',
    results: [
      { param: 'Hemoglobin', value: '14.8', unit: 'g/dL', referenceRange: '13.5 - 17.5', flag: 'Normal' },
      { param: 'WBC Count', value: '6.4', unit: 'x10^3/uL', referenceRange: '4.5 - 11.0', flag: 'Normal' },
      { param: 'Platelets', value: '245', unit: 'x10^3/uL', referenceRange: '150 - 450', flag: 'Normal' },
      { param: 'Hematocrit', value: '44.2', unit: '%', referenceRange: '41.0 - 50.0', flag: 'Normal' }
    ]
  },
  {
    id: 'LAB-6002',
    testCode: 'LT-LIP-02',
    patientId: 'PAT-1001',
    patientName: 'James Wilson',
    testName: 'Comprehensive Lipid Profile',
    category: 'Biochemistry',
    orderedBy: 'Dr. Sarah Jenkins',
    sampleDate: '2026-09-12 07:45 AM',
    completedDate: null,
    status: 'In Progress',
    priority: 'Normal',
    specimen: 'Serum (Gold Top Tube)',
    results: []
  },
  {
    id: 'LAB-6003',
    testCode: 'LT-GLU-03',
    patientId: 'PAT-1002',
    patientName: 'Eleanor Vance',
    testName: 'Glycated Hemoglobin (HbA1c) & Fasting Insulin',
    category: 'Endocrinology',
    orderedBy: 'Dr. Amanda Chen',
    sampleDate: '2026-09-12 09:00 AM',
    completedDate: null,
    status: 'Pending',
    priority: 'Urgent',
    specimen: 'Whole Blood',
    results: []
  },
  {
    id: 'LAB-6004',
    testCode: 'LT-TROP-04',
    patientId: 'PAT-1005',
    patientName: 'Liam Gallagher',
    testName: 'Cardiac Troponin I (High Sensitivity)',
    category: 'Cardiology Diagnostics',
    orderedBy: 'Dr. Sarah Jenkins',
    sampleDate: '2026-09-10 11:30 PM',
    completedDate: '2026-09-11 12:15 AM',
    status: 'Completed',
    priority: 'STAT',
    specimen: 'Plasma (Lithium Heparin)',
    results: [
      { param: 'hs-cTnI', value: '0.082', unit: 'ng/mL', referenceRange: '< 0.034', flag: 'High (Alert)' },
      { param: 'CK-MB', value: '18.4', unit: 'ng/mL', referenceRange: '< 5.0', flag: 'High (Alert)' }
    ]
  }
];

export const INITIAL_MEDICINES = [
  {
    id: 'MED-7001',
    code: 'RX-LIS-10',
    name: 'Lisinopril 10mg',
    genericName: 'Lisinopril',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    stockLevel: 420,
    minThreshold: 100,
    unitPrice: 12.50,
    expiryDate: '2027-08-31',
    manufacturer: 'Pfizer Labs',
    batchNumber: 'B-78921'
  },
  {
    id: 'MED-7002',
    code: 'RX-AML-05',
    name: 'Amlodipine 5mg',
    genericName: 'Amlodipine Besylate',
    category: 'Cardiovascular',
    dosageForm: 'Tablet',
    stockLevel: 28,
    minThreshold: 80,
    unitPrice: 8.75,
    expiryDate: '2027-04-15',
    manufacturer: 'Novartis Healthcare',
    batchNumber: 'B-65412'
  },
  {
    id: 'MED-7003',
    code: 'RX-MET-500',
    name: 'Metformin HCl 500mg',
    genericName: 'Metformin Hydrochloride',
    category: 'Antidiabetic',
    dosageForm: 'Film-coated Tablet',
    stockLevel: 650,
    minThreshold: 150,
    unitPrice: 9.20,
    expiryDate: '2028-01-20',
    manufacturer: 'Merck Group',
    batchNumber: 'B-99810'
  },
  {
    id: 'MED-7004',
    code: 'RX-AMO-500',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin Trihydrate',
    category: 'Antibiotics',
    dosageForm: 'Capsule',
    stockLevel: 18,
    minThreshold: 90,
    unitPrice: 15.00,
    expiryDate: '2026-11-30',
    manufacturer: 'GlaxoSmithKline',
    batchNumber: 'B-44129'
  },
  {
    id: 'MED-7005',
    code: 'RX-ATO-20',
    name: 'Atorvastatin 20mg',
    genericName: 'Atorvastatin Calcium',
    category: 'Hypolipidemic',
    dosageForm: 'Tablet',
    stockLevel: 310,
    minThreshold: 100,
    unitPrice: 18.40,
    expiryDate: '2027-12-10',
    manufacturer: 'AstraZeneca',
    batchNumber: 'B-33291'
  },
  {
    id: 'MED-7006',
    code: 'RX-PAR-650',
    name: 'Paracetamol 650mg',
    genericName: 'Acetaminophen',
    category: 'Analgesic & Antipyretic',
    dosageForm: 'Tablet',
    stockLevel: 1400,
    minThreshold: 250,
    unitPrice: 3.50,
    expiryDate: '2028-06-30',
    manufacturer: 'Sanofi Healthcare',
    batchNumber: 'B-10924'
  }
];

export const INITIAL_BILLS = [
  {
    id: 'INV-8001',
    invoiceNumber: 'INV-2026-00481',
    patientId: 'PAT-1001',
    patientName: 'James Wilson',
    date: '2026-09-11',
    dueDate: '2026-09-25',
    paymentStatus: 'Paid',
    paymentMethod: 'Credit Card (Visa)',
    items: [
      { description: 'Cardiology Specialist Consultation (Dr. Sarah Jenkins)', type: 'Consultation', amount: 120.00, quantity: 1 },
      { description: 'Complete Blood Count (CBC) Laboratory Diagnostic', type: 'Laboratory', amount: 45.00, quantity: 1 },
      { description: 'Comprehensive Lipid Profile Panel', type: 'Laboratory', amount: 65.00, quantity: 1 },
      { description: 'Lisinopril 10mg (30-day supply)', type: 'Pharmacy', amount: 25.00, quantity: 1 }
    ],
    subtotal: 255.00,
    tax: 12.75,
    discount: 0,
    totalAmount: 267.75
  },
  {
    id: 'INV-8002',
    invoiceNumber: 'INV-2026-00482',
    patientId: 'PAT-1002',
    patientName: 'Eleanor Vance',
    date: '2026-09-12',
    dueDate: '2026-09-19',
    paymentStatus: 'Pending',
    paymentMethod: 'Pending Insurance Claim',
    items: [
      { description: 'General Inpatient Room Charge (4 Nights @ $250)', type: 'Admission', amount: 1000.00, quantity: 4 },
      { description: 'Endocrinology Inpatient Consultation', type: 'Consultation', amount: 100.00, quantity: 1 },
      { description: 'HbA1c & Fasting Insulin Diagnostic Panel', type: 'Laboratory', amount: 85.00, quantity: 1 },
      { description: 'Insulin Glargine 100U/mL Vials', type: 'Pharmacy', amount: 78.50, quantity: 2 }
    ],
    subtotal: 1263.50,
    tax: 63.18,
    discount: 50.00,
    totalAmount: 1276.68
  },
  {
    id: 'INV-8003',
    invoiceNumber: 'INV-2026-00483',
    patientId: 'PAT-1003',
    patientName: 'Marcus Ramirez',
    date: '2026-08-24',
    dueDate: '2026-09-07',
    paymentStatus: 'Partially Paid',
    paymentMethod: 'Cash & Copay',
    items: [
      { description: 'Surgical Recovery Ward Bed (4 Days)', type: 'Admission', amount: 720.00, quantity: 4 },
      { description: 'Orthopedic Surgeon Ward Visits (Dr. Rajiv Nair)', type: 'Consultation', amount: 260.00, quantity: 2 },
      { description: 'Post-op Physiotherapy & Mobility Evaluation', type: 'Clinical', amount: 150.00, quantity: 1 }
    ],
    subtotal: 1130.00,
    tax: 56.50,
    discount: 0,
    totalAmount: 1186.50,
    amountPaid: 800.00,
    balanceDue: 386.50
  }
];

// Telemetry & Engineering Mock Data for Grafana/Prometheus Dashboard
export const INITIAL_MONITORING_DATA = {
  overallHealth: 'Operational',
  uptimeSeconds: 849210, // ~9.8 days
  uptimePercentage: '99.98%',
  apiThroughputRPS: 428,
  p95LatencyMs: 18.4,
  errorRatePercent: 0.04,
  services: [
    { name: 'API Gateway (Kong / Nginx Reverse Proxy)', status: 'Healthy', port: 8000, latency: '4.2ms', memory: '142 MB', cpu: '8.4%', rps: 428, tech: 'Nginx + Lua' },
    { name: 'Auth & Session Service', status: 'Healthy', port: 8001, latency: '12.1ms', memory: '210 MB', cpu: '11.2%', rps: 84, tech: 'FastAPI (Python)' },
    { name: 'Patient & EMR Microservice', status: 'Healthy', port: 8002, latency: '19.8ms', memory: '340 MB', cpu: '18.7%', rps: 112, tech: 'FastAPI + pgvector' },
    { name: 'Doctor & Appointment Service', status: 'Healthy', port: 8003, latency: '15.3ms', memory: '185 MB', cpu: '14.1%', rps: 96, tech: 'Node.js + Express' },
    { name: 'Laboratory & Diagnostic Service', status: 'Healthy', port: 8004, latency: '24.6ms', memory: '480 MB', cpu: '22.5%', rps: 68, tech: 'Spring Boot (Java 21)' },
    { name: 'Pharmacy & Stock Service', status: 'Healthy', port: 8005, latency: '16.9ms', memory: '410 MB', cpu: '16.3%', rps: 45, tech: 'Spring Boot (Java 21)' },
    { name: 'Billing & Invoicing Service', status: 'Healthy', port: 8006, latency: '21.0ms', memory: '195 MB', cpu: '12.8%', rps: 23, tech: 'Node.js + Express' }
  ],
  databases: [
    { name: 'PostgreSQL Primary Cluster (v16.2)', role: 'Relational ACID Core', activeConnections: 42, maxConnections: 200, storageUsed: '18.4 GB', iops: 820, status: 'Online' },
    { name: 'pgvector Extension', role: 'Clinical Embeddings Vector Search', totalVectors: 14200, dimensions: 1536, avgIndexScanTime: '6.4ms', status: 'Optimal' },
    { name: 'MongoDB Sharded Cluster (v7.0)', role: 'Diagnostic Documents & Telemetry', collections: 18, dataSize: '42.8 GB', queryLatency: '8.2ms', status: 'Online' },
    { name: 'Redis Distributed Cache (v7.2)', role: 'Session Store & Pub/Sub Lock', memoryUsed: '840 MB', hitRatio: '94.6%', connectedClients: 58, status: 'Active' }
  ]
};

// API Documentation Endpoints for Interactive Swagger/OpenAPI Console
export const API_DOCUMENTATION = [
  {
    tag: 'Patients',
    endpoints: [
      { method: 'GET', path: '/api/v1/patients', summary: 'List all registered patients with pagination & filters', params: 'limit=20, offset=0, search=string', response: '200 OK: Array<Patient>' },
      { method: 'POST', path: '/api/v1/patients', summary: 'Register a new patient into the distributed repository', body: '{\n  "name": "string",\n  "age": 0,\n  "gender": "Male|Female|Other",\n  "phone": "string",\n  "bloodGroup": "string",\n  "address": "string"\n}', response: '201 Created: Patient' },
      { method: 'GET', path: '/api/v1/patients/{id}', summary: 'Get complete patient profile and medical record summary', params: 'id: string (e.g. PAT-1001)', response: '200 OK: PatientDetails' },
      { method: 'PUT', path: '/api/v1/patients/{id}', summary: 'Update patient demographic and emergency info', body: '{\n  "phone": "string",\n  "address": "string",\n  "allergies": "string"\n}', response: '200 OK: Patient' }
    ]
  },
  {
    tag: 'Doctors & Appointments',
    endpoints: [
      { method: 'GET', path: '/api/v1/doctors', summary: 'Retrieve doctor schedules, specialties, and real-time availability', params: 'department=string, status=Available', response: '200 OK: Array<Doctor>' },
      { method: 'GET', path: '/api/v1/appointments', summary: 'Query appointment calendar by doctor, date, or status', params: 'date=YYYY-MM-DD, doctorId=string', response: '200 OK: Array<Appointment>' },
      { method: 'POST', path: '/api/v1/appointments', summary: 'Book new clinical consultation slot (acquires Redis lock)', body: '{\n  "patientId": "PAT-1001",\n  "doctorId": "DOC-201",\n  "date": "2026-09-15",\n  "time": "10:00 AM",\n  "reason": "Routine follow-up"\n}', response: '201 Created: Appointment' }
    ]
  },
  {
    tag: 'Clinical EMR & pgvector Search',
    endpoints: [
      { method: 'GET', path: '/api/v1/medical-records', summary: 'Fetch patient electronic medical records (EMR)', params: 'patientId=string', response: '200 OK: Array<MedicalRecord>' },
      { method: 'POST', path: '/api/v1/medical-records', summary: 'Add clinical encounter note and generate vector embeddings', body: '{\n  "patientId": "PAT-1001",\n  "diagnosis": "Hypertension",\n  "symptoms": "Dizziness",\n  "notes": "Clinical review...",\n  "vitals": { "bp": "140/90" }\n}', response: '201 Created' },
      { method: 'POST', path: '/api/v1/search/semantic', summary: 'Vector cosine similarity search over clinical notes (pgvector)', body: '{\n  "query": "chest tightness with elevated troponin",\n  "topK": 5,\n  "minScore": 0.85\n}', response: '200 OK: Array<{ recordId, similarityScore, snippet }>' }
    ]
  },
  {
    tag: 'Laboratory Diagnostics',
    endpoints: [
      { method: 'GET', path: '/api/v1/lab-tests', summary: 'List diagnostic lab tests filtered by status (Pending/In Progress/Completed)', params: 'status=Pending', response: '200 OK: Array<LabTest>' },
      { method: 'POST', path: '/api/v1/lab-tests', summary: 'Order laboratory investigation from physician dashboard', body: '{\n  "patientId": "PAT-1001",\n  "testName": "Complete Blood Count",\n  "priority": "Urgent"\n}', response: '201 Created: LabTest' },
      { method: 'PUT', path: '/api/v1/lab-tests/{id}/results', summary: 'Upload quantitative lab result parameters and complete order', body: '{\n  "results": [{ "param": "Hemoglobin", "value": "14.8", "flag": "Normal" }]\n}', response: '200 OK' }
    ]
  },
  {
    tag: 'Pharmacy & Stock',
    endpoints: [
      { method: 'GET', path: '/api/v1/medicines', summary: 'Search medication catalog and inventory stock levels', params: 'search=string, lowStockOnly=boolean', response: '200 OK: Array<Medicine>' },
      { method: 'POST', path: '/api/v1/medicines/dispense', summary: 'Dispense prescription medicine and atomically decrement inventory', body: '{\n  "medicineId": "MED-7001",\n  "quantity": 30,\n  "prescriptionId": "string"\n}', response: '200 OK: StockUpdate' }
    ]
  },
  {
    tag: 'Billing & Invoicing',
    endpoints: [
      { method: 'GET', path: '/api/v1/bills', summary: 'Retrieve itemized patient invoices and revenue streams', params: 'status=Paid|Pending|Partially Paid', response: '200 OK: Array<Invoice>' },
      { method: 'POST', path: '/api/v1/bills', summary: 'Generate new consolidated bill for consultations, lab, and meds', body: '{\n  "patientId": "PAT-1001",\n  "items": [{ "description": "Consultation", "amount": 120 }]\n}', response: '201 Created: Invoice' }
    ]
  }
];
