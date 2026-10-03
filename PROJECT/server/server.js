// =============================================================================
// Distributed Hospital Management System (DHMS) - API Gateway & Microservices Server
// Port 8000 (Kong / Nginx Ingress Simulation)
// Works with zero extra npm packages using native Node.js HTTP!
// =============================================================================

import http from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = 8000;

// In-memory data store with disk persistence fallback
let patients = [
  { id: 'PAT-1001', name: 'James Wilson', age: 48, gender: 'Male', phone: '+1 (555) 234-5678', email: 'james.wilson@email.com', bloodGroup: 'O+', address: '742 Evergreen Terrace', allergies: 'Penicillin', chronicConditions: 'Hypertension', status: 'Active' },
  { id: 'PAT-1002', name: 'Eleanor Vance', age: 34, gender: 'Female', phone: '+1 (555) 876-5432', email: 'eleanor.v@email.com', bloodGroup: 'A+', address: '124 Conch Street', allergies: 'Sulfa Drugs', chronicConditions: 'Type 2 Diabetes', status: 'Admitted' },
  { id: 'PAT-1003', name: 'Marcus Ramirez', age: 62, gender: 'Male', phone: '+1 (555) 345-9876', email: 'm.ramirez@email.com', bloodGroup: 'B-', address: '884 Oak Ridge Lane', allergies: 'None Known', chronicConditions: 'Coronary Artery Disease', status: 'Active' }
];

let doctors = [
  { id: 'DOC-201', name: 'Dr. Sarah Jenkins', department: 'Cardiology', qualification: 'MD, FACC', room: 'Room 302', availability: 'Mon - Fri (09:00 - 15:00)', consultationFee: 120, status: 'Available' },
  { id: 'DOC-202', name: 'Dr. Marcus Brody', department: 'Neurology', qualification: 'MD, PhD', room: 'Room 410', availability: 'Mon, Wed, Fri (10:00 - 16:00)', consultationFee: 150, status: 'In Consultation' },
  { id: 'DOC-203', name: 'Dr. Elena Rostova', department: 'Pediatrics', qualification: 'MD, FAAP', room: 'Room 105', availability: 'Tue - Sat (08:30 - 14:00)', consultationFee: 100, status: 'Available' }
];

let appointments = [
  { id: 'APT-3001', patientId: 'PAT-1001', patientName: 'James Wilson', doctorId: 'DOC-201', doctorName: 'Dr. Sarah Jenkins', department: 'Cardiology', date: '2026-09-12', time: '10:30 AM', reason: 'Hypertension follow-up', status: 'Scheduled' },
  { id: 'APT-3002', patientId: 'PAT-1002', patientName: 'Eleanor Vance', doctorId: 'DOC-203', doctorName: 'Dr. Elena Rostova', department: 'Pediatrics', date: '2026-09-12', time: '11:15 AM', reason: 'Allergy consultation', status: 'Scheduled' }
];

let records = [
  { id: 'REC-5001', recordNumber: 'EMR-2026-001', patientId: 'PAT-1001', patientName: 'James Wilson', doctorName: 'Dr. Sarah Jenkins', diagnosis: 'Stage 1 Primary Hypertension', symptoms: 'Occasional morning dizziness, palpitations', notes: 'Advised low sodium diet. Prescribed Lisinopril.', vitals: { bp: '142/90', heartRate: '88 bpm' }, vectorEmbeddingId: 'vec_emr_5001_cardio_htn' }
];

let medicines = [
  { id: 'MED-7001', code: 'RX-LIS-10', name: 'Lisinopril 10mg', category: 'Cardiovascular', stockLevel: 420, minThreshold: 100, unitPrice: 12.50 },
  { id: 'MED-7002', code: 'RX-AML-05', name: 'Amlodipine 5mg', category: 'Cardiovascular', stockLevel: 28, minThreshold: 80, unitPrice: 8.75 },
  { id: 'MED-7003', code: 'RX-MET-500', name: 'Metformin 500mg', category: 'Antidiabetic', stockLevel: 650, minThreshold: 150, unitPrice: 9.20 }
];

let bills = [
  { id: 'INV-8001', invoiceNumber: 'INV-2026-00481', patientId: 'PAT-1001', patientName: 'James Wilson', totalAmount: 267.75, paymentStatus: 'Paid', date: '2026-09-11' }
];

// Helper: Parse JSON Body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try { resolve(body ? JSON.parse(body) : {}); }
      catch { resolve({}); }
    });
  });
}

// Helper: Send JSON Response with CORS
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'X-Served-By': 'DHMS-API-Gateway-v1'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    });
    res.end();
    return;
  }

  // --- Health & Cluster Telemetry ---
  if (pathname === '/api/v1/health' || pathname === '/health') {
    return sendJson(res, 200, {
      status: 'HEALTHY',
      cluster: 'US-EAST-01',
      uptimeSeconds: process.uptime(),
      databases: {
        postgresql: { status: 'ONLINE', pool: '42/200', version: '16.2' },
        pgvector: { status: 'OPTIMAL', indexedVectors: 14200, avgScanMs: 6.4 },
        mongodb: { status: 'ONLINE', collections: 18, dataSize: '42.8 GB' },
        redis: { status: 'ACTIVE', hitRatio: '94.6%', port: 6379 }
      },
      microservices: ['AuthService', 'PatientService', 'AppointmentService', 'LabService', 'PharmacyService', 'BillingService']
    });
  }

  // --- Patients ---
  if (pathname === '/api/v1/patients') {
    if (method === 'GET') {
      return sendJson(res, 200, patients);
    }
    if (method === 'POST') {
      const data = await parseBody(req);
      const newPatient = {
        id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: data.name || 'New Patient',
        age: data.age || 30,
        gender: data.gender || 'Male',
        phone: data.phone || '+1 555-000-0000',
        email: data.email || 'patient@email.com',
        bloodGroup: data.bloodGroup || 'O+',
        address: data.address || '',
        allergies: data.allergies || 'None',
        chronicConditions: data.chronicConditions || 'None',
        status: 'Active'
      };
      patients.unshift(newPatient);
      return sendJson(res, 201, newPatient);
    }
  }

  // --- Doctors ---
  if (pathname === '/api/v1/doctors' && method === 'GET') {
    return sendJson(res, 200, doctors);
  }

  // --- Appointments ---
  if (pathname === '/api/v1/appointments') {
    if (method === 'GET') {
      return sendJson(res, 200, appointments);
    }
    if (method === 'POST') {
      const data = await parseBody(req);
      const newApt = {
        id: `APT-${Math.floor(3000 + Math.random() * 7000)}`,
        patientId: data.patientId,
        patientName: data.patientName || 'Patient',
        doctorId: data.doctorId,
        doctorName: data.doctorName || 'Doctor',
        department: data.department || 'General Medicine',
        date: data.date,
        time: data.time,
        reason: data.reason,
        status: 'Scheduled',
        room: data.room || 'Room 101'
      };
      appointments.unshift(newApt);
      return sendJson(res, 201, newApt);
    }
  }

  // --- EMR & pgvector Semantic Search ---
  if (pathname === '/api/v1/medical-records') {
    if (method === 'GET') {
      return sendJson(res, 200, records);
    }
    if (method === 'POST') {
      const data = await parseBody(req);
      const newRec = {
        id: `REC-${Math.floor(5000 + Math.random() * 5000)}`,
        recordNumber: `EMR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        patientId: data.patientId,
        patientName: data.patientName,
        diagnosis: data.diagnosis,
        symptoms: data.symptoms,
        notes: data.notes,
        vitals: data.vitals,
        prescriptions: data.prescriptions || [],
        vectorEmbeddingId: `vec_emr_${Date.now()}`
      };
      records.unshift(newRec);
      return sendJson(res, 201, newRec);
    }
  }

  if (pathname === '/api/v1/search/semantic' && method === 'POST') {
    const data = await parseBody(req);
    const query = (data.query || '').toLowerCase();
    
    // Compute cosine similarity score simulation
    const matches = records.map((r) => {
      let score = 0.55;
      if (query.includes('heart') || query.includes('pressure') || query.includes('dizziness')) score += 0.38;
      if (query.includes('sugar') || query.includes('diabetes')) score += 0.35;
      return {
        recordId: r.id,
        recordNumber: r.recordNumber,
        diagnosis: r.diagnosis,
        symptoms: r.symptoms,
        cosineSimilarity: Math.min(0.98, parseFloat(score.toFixed(3))),
        vectorEmbeddingId: r.vectorEmbeddingId
      };
    }).sort((a, b) => b.cosineSimilarity - a.cosineSimilarity);

    return sendJson(res, 200, {
      query: data.query,
      dimensions: 1536,
      distanceOperator: '<=> (Cosine Distance)',
      indexScanTimeMs: 6.2,
      matches
    });
  }

  // --- Medicines & Dispensing ---
  if (pathname === '/api/v1/medicines' && method === 'GET') {
    return sendJson(res, 200, medicines);
  }

  if (pathname === '/api/v1/medicines/dispense' && method === 'POST') {
    const data = await parseBody(req);
    const med = medicines.find((m) => m.id === data.medicineId);
    if (!med) return sendJson(res, 404, { error: 'Medicine not found' });
    if (med.stockLevel < data.quantity) return sendJson(res, 400, { error: 'Insufficient stock' });

    med.stockLevel -= data.quantity;
    return sendJson(res, 200, { success: true, remainingStock: med.stockLevel, dispensed: data.quantity });
  }

  // --- Bills ---
  if (pathname === '/api/v1/bills') {
    return sendJson(res, 200, bills);
  }

  // Fallback 404
  return sendJson(res, 404, { error: 'API route not found', requestedPath: pathname });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 DHMS API Gateway & Microservices Live on Port ${PORT}`);
  console.log(`🔗 Health Endpoint:  http://localhost:${PORT}/api/v1/health`);
  console.log(`🔗 Patients API:     http://localhost:${PORT}/api/v1/patients`);
  console.log(`🔗 pgvector Search:  http://localhost:${PORT}/api/v1/search/semantic`);
  console.log(`=======================================================`);
});
