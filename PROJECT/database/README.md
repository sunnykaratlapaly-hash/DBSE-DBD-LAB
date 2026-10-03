# Distributed Database & Backend Infrastructure Guide (DBSE)

This directory contains the database initialization scripts, schemas, and container specifications for the **Distributed Hospital Management System (DHMS)**.

---

## 🏛️ Database Technologies & Roles

1. **PostgreSQL 16 + pgvector Extension**
   - File: `database/init-postgres.sql`
   - Role: Relational ACID core transactions (`patients`, `doctors`, `appointments`, `admissions`, `medicines`, `invoices`, `invoice_items`).
   - Vector Search: Stores 1536-dimensional clinical embeddings in `medical_records.embedding` with an `ivfflat (embedding vector_cosine_ops)` index.

2. **MongoDB 7.0 Document Store**
   - File: `database/init-mongo.js`
   - Role: Semi-structured diagnostic lab reports (`lab_reports`), analyzer specimen telemetry, and immutable HIPAA audit logs (`audit_logs`).

3. **Redis 7.2 In-Memory Distributed Cache**
   - Role: JWT session caching, real-time doctor availability cache, and distributed appointment booking mutex locks (Redlock algorithm).

---

## 🚀 Running the Databases via Docker Compose

If Docker Desktop is installed, you can spin up all 4 databases + management UIs with a single command:

```bash
docker compose up -d
```

This starts:
- **PostgreSQL 16 (pgvector)** on port `5432`
- **MongoDB 7.0** on port `27017`
- **Redis 7.2** on port `6379`
- **pgAdmin 4 (SQL Web GUI)** on port `5050` (Login: `admin@hospital.org` / `admin_password`)
- **Mongo Express (MongoDB Web GUI)** on port `8081` (Login: `admin` / `password`)

---

## ⚡ Running the Backend Microservices Server

A standalone API Gateway & Microservices server is included in `server/server.js`. It runs on port `8000`:

```bash
node server/server.js
```

Endpoints provided:
- `GET  /api/v1/health` - Cluster telemetry & database health
- `GET  /api/v1/patients` - List all registered patients
- `POST /api/v1/patients` - Register new patient
- `GET  /api/v1/doctors` - Physician directory & schedules
- `GET  /api/v1/appointments` - Consultation booking queue
- `POST /api/v1/appointments` - Book appointment slot
- `GET  /api/v1/medical-records` - Electronic medical records
- `POST /api/v1/search/semantic` - **pgvector cosine similarity search**
- `GET  /api/v1/medicines` - Pharmacy drug formulary
- `POST /api/v1/medicines/dispense` - Atomic stock reduction
- `GET  /api/v1/bills` - Financial statements & billing
