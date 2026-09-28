-- =============================================================================
-- Distributed Hospital Management System (DHMS) - PostgreSQL 16 + pgvector Schema
-- Database Systems Engineering (DBSE) Project DDL & Initial Seed Data
-- =============================================================================

-- 1. Enable pgvector extension for clinical semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Clean existing tables if needed
DROP TABLE IF EXISTS invoice_items CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS medicines CASCADE;
DROP TABLE IF EXISTS admissions CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS patients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 3. Users & Authentication
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Doctor', 'Receptionist', 'Laboratory Staff', 'Pharmacist', 'Patient')),
    title VARCHAR(100),
    department VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Patients Master Table
CREATE TABLE patients (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    age INT NOT NULL CHECK (age > 0 AND age < 130),
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    blood_group VARCHAR(10) NOT NULL,
    address TEXT,
    allergies TEXT,
    chronic_conditions TEXT,
    emergency_contact TEXT,
    registration_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(30) DEFAULT 'Active' CHECK (status IN ('Active', 'Admitted', 'Inactive'))
);

-- 5. Doctors Directory Table
CREATE TABLE doctors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    qualification VARCHAR(150) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    room VARCHAR(50) NOT NULL,
    availability TEXT NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    rating NUMERIC(3, 1) DEFAULT 5.0,
    status VARCHAR(30) DEFAULT 'Available' CHECK (status IN ('Available', 'In Consultation', 'In Surgery', 'Off Duty'))
);

-- 6. Appointments Scheduling Table
CREATE TABLE appointments (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id VARCHAR(50) NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    reason TEXT NOT NULL,
    room VARCHAR(50),
    status VARCHAR(30) DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'Pending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Electronic Medical Records (EMR) with pgvector Embeddings
CREATE TABLE medical_records (
    id VARCHAR(50) PRIMARY KEY,
    record_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(50) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id VARCHAR(50) NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    encounter_date DATE DEFAULT CURRENT_DATE,
    diagnosis TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    notes TEXT,
    bp VARCHAR(30),
    heart_rate VARCHAR(20),
    temp VARCHAR(20),
    spo2 VARCHAR(20),
    prescriptions JSONB DEFAULT '[]'::jsonb,
    lab_results JSONB DEFAULT '[]'::jsonb,
    -- 1536-dimensional vector embedding for semantic cosine search
    embedding vector(1536),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for pgvector cosine distance similarity (<=> operator)
CREATE INDEX IF NOT EXISTS idx_medical_records_vector 
ON medical_records USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

-- 8. Inpatient Admissions & Bed Management
CREATE TABLE admissions (
    id VARCHAR(50) PRIMARY KEY,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(50) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    room_number VARCHAR(30) NOT NULL,
    ward VARCHAR(100) NOT NULL,
    bed_type VARCHAR(100) NOT NULL,
    admission_date DATE NOT NULL,
    expected_discharge DATE,
    actual_discharge DATE,
    attending_doctor VARCHAR(150) NOT NULL,
    daily_rate NUMERIC(10, 2) NOT NULL DEFAULT 200.00,
    nurse_in_charge VARCHAR(150),
    status VARCHAR(30) DEFAULT 'Admitted' CHECK (status IN ('Admitted', 'Discharged', 'Transferred'))
);

-- 9. Pharmacy Formulary & Stock Catalog
CREATE TABLE medicines (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    generic_name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    dosage_form VARCHAR(50) NOT NULL,
    stock_level INT NOT NULL CHECK (stock_level >= 0),
    min_threshold INT NOT NULL DEFAULT 50,
    unit_price NUMERIC(10, 2) NOT NULL,
    expiry_date DATE NOT NULL,
    manufacturer VARCHAR(150) NOT NULL,
    batch_number VARCHAR(50) NOT NULL
);

-- 10. Billing Invoices Table
CREATE TABLE invoices (
    id VARCHAR(50) PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id VARCHAR(50) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    invoice_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    amount_paid NUMERIC(10, 2) DEFAULT 0.00,
    balance_due NUMERIC(10, 2) GENERATED ALWAYS AS (total_amount - amount_paid) STORED,
    payment_status VARCHAR(30) DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Pending', 'Partially Paid')),
    payment_method VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Invoice Itemized Breakdown
CREATE TABLE invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id VARCHAR(50) NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('Consultation', 'Laboratory', 'Pharmacy', 'Admission', 'Clinical')),
    amount NUMERIC(10, 2) NOT NULL,
    quantity INT DEFAULT 1
);

-- =============================================================================
-- SEED DATA INSERTION
-- =============================================================================

-- Seed Users
INSERT INTO users (id, name, email, password_hash, role, title, department) VALUES
('USR-001', 'Dr. Arthur Vance', 'admin@hospital.org', '$2b$12$e8YQd...', 'Admin', 'Chief Medical Administrator', 'Administration'),
('USR-002', 'Dr. Sarah Jenkins', 'dr.sarah@hospital.org', '$2b$12$e8YQd...', 'Doctor', 'Senior Cardiologist & HOD', 'Cardiology'),
('USR-003', 'Emily Chen', 'reception@hospital.org', '$2b$12$e8YQd...', 'Receptionist', 'Front Desk Lead', 'Patient Services'),
('USR-004', 'David Kim', 'lab@hospital.org', '$2b$12$e8YQd...', 'Laboratory Staff', 'Senior Diagnostic Pathologist', 'Pathology'),
('USR-005', 'Priya Sharma', 'pharma@hospital.org', '$2b$12$e8YQd...', 'Pharmacist', 'Chief Pharmacist', 'Pharmacy'),
('USR-006', 'James Wilson', 'patient@hospital.org', '$2b$12$e8YQd...', 'Patient', 'Registered Patient', 'General Care');

-- Seed Patients
INSERT INTO patients (id, name, age, gender, phone, email, blood_group, address, allergies, chronic_conditions, emergency_contact, status) VALUES
('PAT-1001', 'James Wilson', 48, 'Male', '+1 (555) 234-5678', 'james.wilson@email.com', 'O+', '742 Evergreen Terrace, Springfield', 'Penicillin, Shellfish', 'Hypertension, Mild Asthma', 'Sarah Wilson (Spouse) - +1 (555) 234-5679', 'Active'),
('PAT-1002', 'Eleanor Vance', 34, 'Female', '+1 (555) 876-5432', 'eleanor.v@email.com', 'A+', '124 Conch Street, Pacifica', 'Sulfa Drugs', 'Type 2 Diabetes', 'Robert Vance (Father) - +1 (555) 876-1122', 'Admitted'),
('PAT-1003', 'Marcus Ramirez', 62, 'Male', '+1 (555) 345-9876', 'm.ramirez@email.com', 'B-', '884 Oak Ridge Lane, Riverdale', 'None Known', 'Coronary Artery Disease', 'Maria Ramirez (Daughter) - +1 (555) 345-0012', 'Active'),
('PAT-1004', 'Sophia Patel', 27, 'Female', '+1 (555) 654-3210', 'sophia.patel@email.com', 'AB+', '43 Meadowbrook Court, Lakewood', 'Aspirin', 'None', 'Aarav Patel (Brother) - +1 (555) 654-9988', 'Active'),
('PAT-1005', 'Liam Gallagher', 53, 'Male', '+1 (555) 432-8765', 'liam.g@email.com', 'O-', '901 Highline Ave, Downtown', 'Ibuprofen', 'Hyperlipidemia', 'Fiona Gallagher (Sister) - +1 (555) 432-3344', 'Admitted');

-- Seed Doctors
INSERT INTO doctors (id, name, department, qualification, experience, room, availability, phone, email, consultation_fee, rating, status) VALUES
('DOC-201', 'Dr. Sarah Jenkins', 'Cardiology', 'MD, FACC - Johns Hopkins', '14 years', 'Room 302, West Wing', 'Mon - Fri (09:00 - 15:00)', '+1 (555) 901-2211', 'dr.sarah@hospital.org', 120.00, 4.9, 'Available'),
('DOC-202', 'Dr. Marcus Brody', 'Neurology', 'MD, PhD - Harvard Medical', '18 years', 'Room 410, Neuro Science Block', 'Mon, Wed, Fri (10:00 - 16:00)', '+1 (555) 901-3322', 'dr.brody@hospital.org', 150.00, 4.8, 'In Consultation'),
('DOC-203', 'Dr. Elena Rostova', 'Pediatrics', 'MD, FAAP - Stanford University', '11 years', 'Room 105, Children Clinic', 'Tue - Sat (08:30 - 14:00)', '+1 (555) 901-4433', 'dr.elena@hospital.org', 100.00, 5.0, 'Available'),
('DOC-204', 'Dr. Rajiv Nair', 'Orthopedics', 'MS (Ortho), FRCS - London', '16 years', 'Room 215, Surgical Wing', 'Mon - Thu (11:00 - 17:00)', '+1 (555) 901-5544', 'dr.rajiv@hospital.org', 130.00, 4.7, 'In Surgery'),
('DOC-205', 'Dr. Amanda Chen', 'General Medicine', 'MD (Internal Med) - Columbia', '9 years', 'Room 101, Outpatient Clinic', 'Daily (08:00 - 16:00)', '+1 (555) 901-6655', 'dr.amanda@hospital.org', 80.00, 4.9, 'Available');

-- Seed Appointments
INSERT INTO appointments (id, patient_id, doctor_id, appointment_date, appointment_time, reason, room, status) VALUES
('APT-3001', 'PAT-1001', 'DOC-201', '2026-09-12', '10:30 AM', 'Follow-up for hypertension and ECG review', 'Room 302', 'Scheduled'),
('APT-3002', 'PAT-1004', 'DOC-205', '2026-09-12', '11:15 AM', 'Persistent seasonal allergies and dry cough', 'Room 101', 'Scheduled'),
('APT-3003', 'PAT-1003', 'DOC-201', '2026-09-13', '09:00 AM', 'Post-angioplasty 6-month checkup', 'Room 302', 'Scheduled');

-- Seed Medicines
INSERT INTO medicines (id, code, name, generic_name, category, dosage_form, stock_level, min_threshold, unit_price, expiry_date, manufacturer, batch_number) VALUES
('MED-7001', 'RX-LIS-10', 'Lisinopril 10mg', 'Lisinopril', 'Cardiovascular', 'Tablet', 420, 100, 12.50, '2027-08-31', 'Pfizer Labs', 'B-78921'),
('MED-7002', 'RX-AML-05', 'Amlodipine 5mg', 'Amlodipine Besylate', 'Cardiovascular', 'Tablet', 28, 80, 8.75, '2027-04-15', 'Novartis Healthcare', 'B-65412'),
('MED-7003', 'RX-MET-500', 'Metformin HCl 500mg', 'Metformin Hydrochloride', 'Antidiabetic', 'Tablet', 650, 150, 9.20, '2028-01-20', 'Merck Group', 'B-99810'),
('MED-7004', 'RX-AMO-500', 'Amoxicillin 500mg', 'Amoxicillin Trihydrate', 'Antibiotics', 'Capsule', 18, 90, 15.00, '2026-11-30', 'GlaxoSmithKline', 'B-44129'),
('MED-7005', 'RX-ATO-20', 'Atorvastatin 20mg', 'Atorvastatin Calcium', 'Hypolipidemic', 'Tablet', 310, 100, 18.40, '2027-12-10', 'AstraZeneca', 'B-33291');

-- Seed Admissions
INSERT INTO admissions (id, admission_number, patient_id, room_number, ward, bed_type, admission_date, expected_discharge, attending_doctor, daily_rate, status) VALUES
('ADM-4001', 'ADM-2026-88', 'PAT-1002', '304-B', 'Medical Inpatient Ward', 'Semi-Private Bed', '2026-09-08', '2026-09-14', 'Dr. Amanda Chen', 250.00, 'Admitted'),
('ADM-4002', 'ADM-2026-89', 'PAT-1005', 'ICU-04', 'Intensive Cardiac Care Unit (ICCU)', 'Critical Care Monitor Bed', '2026-09-10', '2026-09-16', 'Dr. Sarah Jenkins', 850.00, 'Admitted');

-- Seed Invoices
INSERT INTO invoices (id, invoice_number, patient_id, invoice_date, due_date, subtotal, tax, discount, total_amount, amount_paid, payment_status, payment_method) VALUES
('INV-8001', 'INV-2026-00481', 'PAT-1001', '2026-09-11', '2026-09-25', 255.00, 12.75, 0.00, 267.75, 267.75, 'Paid', 'Credit Card (Visa)'),
('INV-8002', 'INV-2026-00482', 'PAT-1002', '2026-09-12', '2026-09-19', 1263.50, 63.18, 50.00, 1276.68, 0.00, 'Pending', 'Pending Insurance Claim');

INSERT INTO invoice_items (invoice_id, description, service_type, amount, quantity) VALUES
('INV-8001', 'Cardiology Specialist Consultation (Dr. Sarah Jenkins)', 'Consultation', 120.00, 1),
('INV-8001', 'Complete Blood Count (CBC) Laboratory Diagnostic', 'Laboratory', 45.00, 1),
('INV-8001', 'Comprehensive Lipid Profile Panel', 'Laboratory', 65.00, 1),
('INV-8001', 'Lisinopril 10mg (30-day supply)', 'Pharmacy', 25.00, 1),
('INV-8002', 'General Inpatient Room Charge (4 Nights @ $250)', 'Admission', 1000.00, 4),
('INV-8002', 'Endocrinology Inpatient Consultation', 'Consultation', 100.00, 1),
('INV-8002', 'HbA1c & Fasting Insulin Diagnostic Panel', 'Laboratory', 85.00, 1),
('INV-8002', 'Insulin Glargine 100U/mL Vials', 'Pharmacy', 78.50, 2);
