import React from 'react';
import {
  Hospital,
  Activity,
  Layers,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Brain,
  Baby,
  Bone,
  FlaskConical,
  Pill,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Database,
  Server
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LandingPage = ({ onNavigate }) => {
  const { switchRole } = useAuth();

  const handleRoleQuickDemo = (roleName) => {
    switchRole(roleName);
    onNavigate(`${roleName.toLowerCase().replace(' staff', '')}-dashboard`);
  };

  const services = [
    {
      icon: HeartPulse,
      title: 'Advanced Cardiology',
      desc: 'State-of-the-art non-invasive diagnostics, 24/7 cath lab, and specialized coronary care.',
      color: '#ef4444'
    },
    {
      icon: Brain,
      title: 'Neurology & Neurosurgery',
      desc: 'Comprehensive neuro-diagnostics, stroke management, and minimally invasive treatments.',
      color: '#8b5cf6'
    },
    {
      icon: Baby,
      title: 'Pediatrics & Neonatal Care',
      desc: 'Compassionate pediatric healthcare, neonatal intensive care units (NICU), and immunization.',
      color: '#0ea5e9'
    },
    {
      icon: Bone,
      title: 'Orthopedic Surgery',
      desc: 'Joint replacement, trauma care, arthroscopy, and robotic-assisted mobility reconstruction.',
      color: '#f59e0b'
    },
    {
      icon: FlaskConical,
      title: 'Robotic Laboratory & Pathology',
      desc: 'Fully automated biochemistry, hematology, and high-sensitivity immunoassay diagnostic pipelines.',
      color: '#10b981'
    },
    {
      icon: Pill,
      title: 'Digital Inpatient Pharmacy',
      desc: 'Real-time inventory synchronization, barcode dosage verification, and automated dispensing.',
      color: '#06b6d4'
    }
  ];

  const doctors = [
    {
      name: 'Dr. Sarah Jenkins, MD',
      dept: 'Cardiology',
      exp: '14 Years Experience',
      rating: '4.9 ★★★★★',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80'
    },
    {
      name: 'Dr. Marcus Brody, PhD',
      dept: 'Neurology',
      exp: '18 Years Experience',
      rating: '4.8 ★★★★★',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80'
    },
    {
      name: 'Dr. Elena Rostova, MD',
      dept: 'Pediatrics',
      exp: '11 Years Experience',
      rating: '5.0 ★★★★★',
      image: 'https://images.unsplash.com/photo-1594824813684-256f1604a11c?w=300&auto=format&fit=crop&q=80'
    },
    {
      name: 'Dr. Rajiv Nair, FRCS',
      dept: 'Orthopedics',
      exp: '16 Years Experience',
      rating: '4.7 ★★★★★',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <header
        style={{
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          zIndex: 100
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Logo */}
          <div
            onClick={() => onNavigate('landing')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
              }}
            >
              <Hospital size={26} />
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                DHMS <span style={{ color: '#0284c7' }}>HEALTH</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Distributed Hospital Management System
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="hide-mobile">
            <a href="#services" style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>Services</a>
            <a href="#doctors" style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>Doctors</a>
            <a href="#why-us" style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>Why Distributed?</a>
            <button
              onClick={() => onNavigate('architecture')}
              style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0f766e', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Layers size={16} /> Architecture
            </button>
            <button
              onClick={() => onNavigate('monitoring')}
              style={{ fontSize: '0.9rem', fontWeight: '600', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Activity size={16} /> Monitoring
            </button>
          </nav>

          {/* Auth Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => onNavigate('login')}
              className="btn btn-secondary btn-sm"
            >
              Login
            </button>
            <button
              onClick={() => onNavigate('register')}
              className="btn btn-primary btn-sm"
            >
              Register Patient
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        style={{
          background: 'radial-gradient(circle at 10% 20%, rgba(224, 242, 254, 0.7) 0%, rgba(248, 250, 252, 0.8) 90%)',
          padding: '80px 24px 70px 24px',
          borderBottom: '1px solid #e2e8f0'
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '48px', alignItems: 'center' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: '#e0f2fe',
                color: '#0369a1',
                fontSize: '0.8125rem',
                fontWeight: '700',
                marginBottom: '20px'
              }}
            >
              <Database size={16} /> Distributed Microservices Architecture • DBSE 2026
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 4vw, 3.4rem)',
                fontWeight: '800',
                color: '#0f172a',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '20px'
              }}
            >
              Smart Healthcare Management, <br />
              <span style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Connected Through One System
              </span>
            </h1>

            <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, marginBottom: '32px', maxWidth: '620px' }}>
              DHMS provides unified role-based workflows for doctors, receptionists, lab personnel, pharmacists, patients, and administrators. Powered by a high-availability distributed backend featuring <strong>FastAPI, Spring Boot, Node.js, PostgreSQL, MongoDB, Redis</strong>, and <strong>pgvector</strong> semantic search.
            </p>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className="btn btn-primary btn-lg"
              >
                Launch Admin Portal <ArrowRight size={18} />
              </button>

              <button
                onClick={() => onNavigate('architecture')}
                className="btn btn-secondary btn-lg"
              >
                <Layers size={18} /> Explore Distributed Tech
              </button>
            </div>

            {/* Quick Role Launchers */}
            <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #cbd5e1' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                Instant Demonstration Dashboards:
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Admin', 'Doctor', 'Receptionist', 'Laboratory Staff', 'Pharmacist', 'Patient'].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleQuickDemo(r)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: '#0f172a',
                      cursor: 'pointer',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0284c7'; e.currentTarget.style.color = '#0284c7'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#0f172a'; }}
                  >
                    {r} View
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.12)',
              border: '1px solid #e2e8f0',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
                <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.9rem' }}>Distributed Cluster Status</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#0284c7', background: '#e0f2fe', padding: '3px 8px', borderRadius: '12px', fontWeight: '600' }}>
                Active Multi-Zone
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                  <span style={{ color: '#475569' }}>API Gateway Ingress (Kong)</span>
                  <span style={{ fontWeight: '700', color: '#16a34a' }}>428 RPS • 4.2ms</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '68%', height: '100%', background: '#0284c7' }} />
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                  <span style={{ color: '#475569' }}>pgvector Semantic Search Engine</span>
                  <span style={{ fontWeight: '700', color: '#0284c7' }}>1536-Dim • 6.4ms Index Scan</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '84%', height: '100%', background: '#0d9488' }} />
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                  <span style={{ color: '#475569' }}>Redis Cache Hit Ratio</span>
                  <span style={{ fontWeight: '700', color: '#16a34a' }}>94.6% Optimal</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '94%', height: '100%', background: '#22c55e' }} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
              <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: '500' }}>
                All 6 microservice instances (FastAPI, Node, Spring Boot) are online and synchronized.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section style={{ background: '#0f172a', color: '#ffffff', padding: '40px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#38bdf8', fontFamily: 'var(--font-heading)' }}>24,000+</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Patients Treated</div>
          </div>
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#34d399', fontFamily: 'var(--font-heading)' }}>99.98%</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Availability</div>
          </div>
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#fcd34d', fontFamily: 'var(--font-heading)' }}>150+</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Specialist Clinicians</div>
          </div>
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#c084fc', fontFamily: 'var(--font-heading)' }}>6 Microservices</div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Distributed Architecture</div>
          </div>
        </div>
      </section>

      {/* Hospital Services Section */}
      <section id="services" style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ color: '#0284c7', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Comprehensive Care
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginTop: '6px' }}>
            Hospital Clinical Departments & Services
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '8px auto 0 auto' }}>
            Integrated clinical services coordinated across our distributed scheduling and electronic health record ecosystem.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div
                key={i}
                className="card"
                style={{
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '12px',
                      backgroundColor: `${svc.color}15`,
                      color: svc.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '16px'
                    }}
                  >
                    <Icon size={26} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                    {svc.title}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {svc.desc}
                  </p>
                </div>
                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => onNavigate('appointments')}
                    style={{
                      color: '#0284c7',
                      fontWeight: '600',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Book Consultation <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Distributed Section */}
      <section id="why-us" style={{ background: '#f8fafc', padding: '80px 24px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ color: '#0d9488', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Distributed Systems Engineering
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginTop: '6px' }}>
              Why a Distributed Hospital Architecture?
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '640px', margin: '8px auto 0 auto' }}>
              Eliminating single points of failure, scaling high-frequency appointment spikes, and unlocking semantic medical intelligence.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ color: '#0284c7', marginBottom: '12px' }}><Database size={32} /></div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>PostgreSQL & MongoDB Hybrid</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                PostgreSQL guarantees ACID compliance for billing, admissions, and orders. MongoDB provides schema flexibility for complex diagnostic reports and sensor telemetry.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{ color: '#0d9488', marginBottom: '12px' }}><Activity size={32} /></div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>pgvector Clinical Search</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                Physicians can query symptoms conceptually rather than through strict keywords, matching complex clinical encounters through high-dimensional cosine similarity.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{ color: '#f59e0b', marginBottom: '12px' }}><Server size={32} /></div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Redis Distributed Caching</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                Sub-millisecond access for doctor availability schedules, patient session tokens, and distributed atomic locking to prevent double-booking.
              </p>
            </div>

            <div className="card" style={{ padding: '24px' }}>
              <div style={{ color: '#8b5cf6', marginBottom: '12px' }}><ShieldCheck size={32} /></div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '8px' }}>Role-Based Access Control</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                Cryptographically verified JWT authorization tokens ensure sensitive health records are strictly partitioned between doctors, staff, and patients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Doctors Showcase */}
      <section id="doctors" style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ color: '#0284c7', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Board Certified Specialists
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginTop: '6px' }}>
            Meet Our Senior Medical Consultants
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          {doctors.map((d, idx) => (
            <div key={idx} className="card" style={{ padding: '20px', textAlign: 'center' }}>
              <img
                src={d.image}
                alt={d.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  margin: '0 auto 16px auto',
                  border: '3px solid #e0f2fe'
                }}
              />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>
                {d.name}
              </h3>
              <div style={{ color: '#0284c7', fontWeight: '600', fontSize: '0.8125rem', marginBottom: '4px' }}>
                {d.dept}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', marginBottom: '8px' }}>
                {d.exp}
              </div>
              <div style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: '700', marginBottom: '16px' }}>
                {d.rating}
              </div>
              <button
                onClick={() => onNavigate('appointments')}
                className="btn btn-secondary btn-sm"
                style={{ width: '100%' }}
              >
                Check Availability
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Footer */}
      <footer style={{ background: '#0f172a', color: '#94a3b8', borderTop: '1px solid #1e293b', marginTop: 'auto', padding: '60px 24px 30px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff', marginBottom: '16px' }}>
              <Hospital size={28} style={{ color: '#38bdf8' }} />
              <span style={{ fontWeight: '800', fontSize: '1.25rem' }}>DHMS SYSTEM</span>
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#94a3b8' }}>
              Enterprise Distributed Hospital Management System built for Database Systems Engineering (DBSE) and Distributed Backend Development.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px' }}>Platform Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <button onClick={() => onNavigate('admin-dashboard')} style={{ color: '#94a3b8', textAlign: 'left', cursor: 'pointer' }}>Admin Dashboard</button>
              <button onClick={() => onNavigate('doctor-dashboard')} style={{ color: '#94a3b8', textAlign: 'left', cursor: 'pointer' }}>Doctor Dashboard</button>
              <button onClick={() => onNavigate('patient-dashboard')} style={{ color: '#94a3b8', textAlign: 'left', cursor: 'pointer' }}>Patient Portal</button>
              <button onClick={() => onNavigate('architecture')} style={{ color: '#94a3b8', textAlign: 'left', cursor: 'pointer' }}>System Architecture Diagram</button>
              <button onClick={() => onNavigate('monitoring')} style={{ color: '#94a3b8', textAlign: 'left', cursor: 'pointer' }}>Prometheus & Grafana Monitoring</button>
              <button onClick={() => onNavigate('api-docs')} style={{ color: '#94a3b8', textAlign: 'left', cursor: 'pointer' }}>OpenAPI / Swagger Docs</button>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: '700', marginBottom: '16px' }}>Contact Hospital</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={16} /> 100 Innovation Pkwy, Healthcare City</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={16} /> +1 (800) 555-DHMS (Emergency 24/7)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={16} /> support@dhms-hospital.org</div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid #1e293b', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.75rem', color: '#64748b' }}>
          <div>© 2026 Distributed Hospital Management System. All rights reserved. Database Systems Engineering Capstone.</div>
          <div>PostgreSQL 16 • MongoDB 7.0 • Redis 7.2 • pgvector • FastAPI • Spring Boot • Node.js</div>
        </div>
      </footer>
    </div>
  );
};
