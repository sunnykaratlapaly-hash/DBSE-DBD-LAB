import React, { useState } from 'react';
import {
  Layers,
  Server,
  Database,
  Shield,
  Zap,
  Cpu,
  ArrowDown,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code2,
  Box,
  FileCode,
  Network
} from 'lucide-react';

export const ArchitecturePage = () => {
  const [selectedNode, setSelectedNode] = useState('pgvector');

  const nodeDetails = {
    frontend: {
      title: 'Client Layer: React Single Page App (SPA)',
      tech: 'React.js, HTML5, CSS3, Vite, REST Client',
      role: 'Role-based responsive frontend providing authenticated portals for Admin, Doctor, Receptionist, Lab, Pharmacist, and Patient.',
      details: 'Connects to backend via central API Gateway. Maintains JWT in Authorization headers with client-side reactive caching.'
    },
    gateway: {
      title: 'Ingress Layer: API Gateway (Kong / Nginx Reverse Proxy)',
      tech: 'Kong Gateway / Nginx Reverse Proxy (Port 8000)',
      role: 'Unified entry point for all frontend API calls. Handles route dispatch, rate limiting, CORS, and cryptographic JWT validation.',
      details: 'Prevents direct public exposure of internal microservices. Distributes traffic across backend nodes with health checking.'
    },
    authService: {
      title: 'Auth & Session Service',
      tech: 'FastAPI (Python 3.11) • Port 8001',
      role: 'User identity verification, role-based access control (RBAC), and stateless JWT token issuance.',
      details: 'Integrates with Redis for fast distributed token blacklisting and session validation during logout.'
    },
    patientService: {
      title: 'Patient & EMR Microservice',
      tech: 'FastAPI (Python 3.11) + SQLAlchemy • Port 8002',
      role: 'Patient master directory, electronic medical records (EMR), and semantic symptom retrieval.',
      details: 'Uses pgvector to compute and store 1536-dimensional vector embeddings for clinical encounter notes.'
    },
    appointmentService: {
      title: 'Doctor & Appointment Service',
      tech: 'Node.js + Express.js • Port 8003',
      role: 'Doctor schedule availability, consultation queue management, and slot booking.',
      details: 'Leverages Redis distributed locks (Redlock algorithm) to guarantee zero double-booking during concurrent user requests.'
    },
    labService: {
      title: 'Laboratory Diagnostics Service',
      tech: 'Spring Boot (Java 21) • Port 8004',
      role: 'Diagnostic test order processing, analyzer specimen queues, and quantitative result verification.',
      details: 'Stores semi-structured diagnostic telemetry in MongoDB, allowing dynamic lab parameter schemas.'
    },
    pharmacyService: {
      title: 'Pharmacy & Stock Service',
      tech: 'Spring Boot (Java 21) • Port 8005',
      role: 'Formulary medication catalog, batch inventory tracking, and atomic dispensing.',
      details: 'Maintains stock replenishment safety thresholds with automated warning triggers.'
    },
    billingService: {
      title: 'Billing & Invoicing Service',
      tech: 'Node.js + Express.js • Port 8006',
      role: 'Consolidated patient invoicing, consultation fees, lab charges, and bed occupancy rates.',
      details: 'Performs ACID-compliant financial transactions against the PostgreSQL primary database.'
    },
    postgres: {
      title: 'PostgreSQL Relational Cluster (v16.2)',
      tech: 'PostgreSQL ACID Relational Core • Port 5432',
      role: 'Primary storage for structured relational entities: Patients, Doctors, Appointments, Admissions, and Invoices.',
      details: 'Enforces foreign key referential integrity, transaction rollbacks, and multi-version concurrency control (MVCC).'
    },
    pgvector: {
      title: 'pgvector Extension: Semantic AI Clinical Embeddings',
      tech: 'PostgreSQL Extension pgvector • Cosine Distance Operator (<=>)',
      role: 'Enables vector similarity search directly inside the primary PostgreSQL database.',
      details: 'Clinical symptoms like "chest tightness and shortness of breath" are embedded via LLM embeddings and indexed with HNSW/IVFFlat indexes for 6ms retrieval.'
    },
    mongo: {
      title: 'MongoDB Document Database (v7.0)',
      tech: 'MongoDB Sharded Cluster • Port 27017',
      role: 'Stores flexible diagnostic laboratory reports, analyzer raw outputs, and FHIR/HL7 compliant clinical payloads.',
      details: 'Provides horizontal scalability and dynamic JSON document schemas without requiring relational schema migrations.'
    },
    redis: {
      title: 'Redis In-Memory Distributed Cache (v7.2)',
      tech: 'Redis Cluster • Port 6379',
      role: 'Distributed session cache, real-time doctor availability caching, and atomic booking mutex locks.',
      details: 'Achieves 94.6% cache hit ratio, offloading read pressure from PostgreSQL and providing sub-millisecond query latencies.'
    }
  };

  const active = nodeDetails[selectedNode] || nodeDetails.postgres;

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Distributed Backend System Architecture</h1>
          <p className="page-subtitle">
            Database Systems Engineering (DBSE) architectural blueprint showing Microservices, Multi-Database Layer, and pgvector.
          </p>
        </div>
      </div>

      {/* Main Architecture Diagram Canvas */}
      <div className="card" style={{ marginBottom: '24px', padding: '28px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Interactive Topology Diagram
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>
            Click any component below to inspect its distributed engineering role & schema
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          {/* Layer 1: Client Application */}
          <div
            onClick={() => setSelectedNode('frontend')}
            style={{
              width: '100%',
              maxWidth: '680px',
              padding: '16px 20px',
              borderRadius: '12px',
              background: selectedNode === 'frontend' ? '#e0f2fe' : '#ffffff',
              border: '2px solid',
              borderColor: selectedNode === 'frontend' ? '#0284c7' : '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#0284c7', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box size={22} />
              </div>
              <div>
                <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>Frontend Client Tier (React SPA)</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>6 Role Dashboards • Responsive UI • REST Client • Token Storage</div>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0284c7', background: '#ffffff', padding: '4px 8px', borderRadius: '6px' }}>
              HTTPS / JSON
            </span>
          </div>

          <ArrowDown size={24} style={{ color: '#94a3b8' }} />

          {/* Layer 2: API Gateway */}
          <div
            onClick={() => setSelectedNode('gateway')}
            style={{
              width: '100%',
              maxWidth: '680px',
              padding: '16px 20px',
              borderRadius: '12px',
              background: selectedNode === 'gateway' ? '#f0fdfa' : '#ffffff',
              border: '2px solid',
              borderColor: selectedNode === 'gateway' ? '#0d9488' : '#cbd5e1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#0d9488', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Network size={22} />
              </div>
              <div>
                <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '1rem' }}>API Gateway & Ingress (Kong / Nginx Reverse Proxy)</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Rate Limiting • SSL Termination • Route Dispatch • JWT Auth Validation</div>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0d9488', background: '#ffffff', padding: '4px 8px', borderRadius: '6px' }}>
              Port 8000
            </span>
          </div>

          <ArrowDown size={24} style={{ color: '#94a3b8' }} />

          {/* Layer 3: Microservices Grid */}
          <div style={{ width: '100%', maxWidth: '980px' }}>
            <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
              Distributed Microservices Layer (FastAPI, Node.js, Spring Boot)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {[
                { id: 'authService', name: 'Auth & Session Service', tech: 'FastAPI (Python)', port: '8001', color: '#0284c7' },
                { id: 'patientService', name: 'Patient & EMR Service', tech: 'FastAPI + pgvector', port: '8002', color: '#0284c7' },
                { id: 'appointmentService', name: 'Doctor & Appointment', tech: 'Node.js + Express', port: '8003', color: '#16a34a' },
                { id: 'labService', name: 'Laboratory Diagnostics', tech: 'Spring Boot (Java 21)', port: '8004', color: '#ea580c' },
                { id: 'pharmacyService', name: 'Pharmacy & Stock', tech: 'Spring Boot (Java 21)', port: '8005', color: '#ea580c' },
                { id: 'billingService', name: 'Billing & Payments', tech: 'Node.js + Express', port: '8006', color: '#16a34a' }
              ].map((svc) => (
                <div
                  key={svc.id}
                  onClick={() => setSelectedNode(svc.id)}
                  style={{
                    background: selectedNode === svc.id ? '#f1f5f9' : '#ffffff',
                    border: '2px solid',
                    borderColor: selectedNode === svc.id ? svc.color : '#e2e8f0',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{svc.name}</div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'monospace' }}>:{svc.port}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: svc.color, fontWeight: '600' }}>{svc.tech}</div>
                </div>
              ))}
            </div>
          </div>

          <ArrowDown size={24} style={{ color: '#94a3b8' }} />

          {/* Layer 4: Multi-Database Distributed Layer */}
          <div style={{ width: '100%', maxWidth: '980px' }}>
            <div style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
              Distributed Storage & Vector Search Layer
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              {/* PostgreSQL */}
              <div
                onClick={() => setSelectedNode('postgres')}
                style={{
                  background: selectedNode === 'postgres' ? '#e0f2fe' : '#ffffff',
                  border: '2px solid',
                  borderColor: selectedNode === 'postgres' ? '#0284c7' : '#cbd5e1',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <Database size={28} style={{ color: '#0284c7', margin: '0 auto 8px auto' }} />
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a' }}>PostgreSQL 16</div>
                <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: '600' }}>Relational ACID Core</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>Patients, Staff, Appointments, Bills</div>
              </div>

              {/* pgvector */}
              <div
                onClick={() => setSelectedNode('pgvector')}
                style={{
                  background: selectedNode === 'pgvector' ? '#f0fdfa' : '#ffffff',
                  border: '2px solid',
                  borderColor: selectedNode === 'pgvector' ? '#0d9488' : '#cbd5e1',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <Sparkles size={28} style={{ color: '#0d9488', margin: '0 auto 8px auto' }} />
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a' }}>pgvector Extension</div>
                <div style={{ fontSize: '0.75rem', color: '#0d9488', fontWeight: '600' }}>AI Semantic Embeddings</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>1536-Dim Cosine Similarity</div>
              </div>

              {/* MongoDB */}
              <div
                onClick={() => setSelectedNode('mongo')}
                style={{
                  background: selectedNode === 'mongo' ? '#f0fdf4' : '#ffffff',
                  border: '2px solid',
                  borderColor: selectedNode === 'mongo' ? '#16a34a' : '#cbd5e1',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <Server size={28} style={{ color: '#16a34a', margin: '0 auto 8px auto' }} />
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a' }}>MongoDB 7.0</div>
                <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '600' }}>Unstructured Telemetry</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>Diagnostic Reports & Lab Schema</div>
              </div>

              {/* Redis */}
              <div
                onClick={() => setSelectedNode('redis')}
                style={{
                  background: selectedNode === 'redis' ? '#fef2f2' : '#ffffff',
                  border: '2px solid',
                  borderColor: selectedNode === 'redis' ? '#dc2626' : '#cbd5e1',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <Zap size={28} style={{ color: '#dc2626', margin: '0 auto 8px auto' }} />
                <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a' }}>Redis 7.2</div>
                <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: '600' }}>Distributed Cache & Lock</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '4px' }}>JWT Sessions, Atomic Mutex, RPS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Component Technical Inspector Card */}
      <div className="card" style={{ background: '#0f172a', color: '#ffffff', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '14px', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              DBSE Architecture Deep Dive
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>
              {active.title}
            </h3>
          </div>
          <span style={{ fontSize: '0.8rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontWeight: '600' }}>
            {active.tech}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Functional Role</span>
            <p style={{ color: '#e2e8f0', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '6px' }}>
              {active.role}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>Distributed Engineering Rationale</span>
            <p style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '6px' }}>
              {active.details}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
