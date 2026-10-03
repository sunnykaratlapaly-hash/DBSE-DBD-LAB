import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Database,
  Cpu,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  RotateCw,
  Clock,
  Layers
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { AreaChart } from '../../components/charts/MiniCharts';

export const MonitoringPage = () => {
  const { monitoring } = useData();
  const [liveRps, setLiveRps] = useState(monitoring.apiThroughputRPS);
  const [liveLatency, setLiveLatency] = useState(monitoring.p95LatencyMs);

  // Live telemetry pulse simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveRps(Math.floor(410 + Math.random() * 35));
      setLiveLatency(parseFloat((17.5 + Math.random() * 2.2).toFixed(1)));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const rpsTrend = [
    { label: '13:00', value: 390 },
    { label: '13:05', value: 412 },
    { label: '13:10', value: 435 },
    { label: '13:15', value: 420 },
    { label: '13:20', value: 445 },
    { label: '13:25', value: liveRps }
  ];

  return (
    <div className="page-body">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Distributed System Telemetry & Monitoring</h1>
          <p className="page-subtitle">
            Prometheus metric collectors, Grafana cluster telemetry, node load, and database connection pools.
          </p>
        </div>
        <div className="page-actions">
          <span style={{ fontSize: '0.78rem', background: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '6px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            Prometheus Exporter Live
          </span>
        </div>
      </div>

      {/* Cluster Primary Telemetry Cards */}
      <div className="stat-grid">
        <StatCard
          label="API Ingress Throughput"
          value={`${liveRps} RPS`}
          icon={Zap}
          variant="primary"
          trend="Kong Reverse Proxy"
          trendType="positive"
        />
        <StatCard
          label="P95 End-to-End Latency"
          value={`${liveLatency} ms`}
          icon={Clock}
          variant="teal"
          trend="Optimal (< 50ms SLA)"
          trendType="positive"
        />
        <StatCard
          label="HTTP Error Rate"
          value="0.04%"
          icon={CheckCircle2}
          variant="success"
          trend="Zero critical 5xx"
          trendType="positive"
        />
        <StatCard
          label="Redis Cache Hit Ratio"
          value="94.6%"
          icon={Activity}
          variant="purple"
          subtext="Distributed hot cache"
        />
      </div>

      {/* Live RPS Chart */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Real-Time Ingress Traffic (RPS over Time)</h3>
            <p className="card-subtitle">Aggregated requests hitting the API Gateway from web and mobile clients</p>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: '700' }}>Polled Every 2.5s</span>
        </div>
        <AreaChart data={rpsTrend} height={200} color="#0284c7" />
      </div>

      {/* Microservices Node Health Table */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Microservice Node Instances (Service Mesh)</h3>
            <p className="card-subtitle">Containerized processes running FastAPI, Spring Boot, and Node.js</p>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: '700' }}>7 / 7 Healthy</span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Port</th>
                <th>Framework / Language</th>
                <th>Throughput</th>
                <th>Latency</th>
                <th>CPU Load</th>
                <th>Memory</th>
                <th>Health</th>
              </tr>
            </thead>
            <tbody>
              {monitoring.services.map((svc, i) => (
                <tr key={i}>
                  <td><strong>{svc.name}</strong></td>
                  <td><code>:{svc.port}</code></td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: '600' }}>{svc.tech}</span>
                  </td>
                  <td>{svc.rps} RPS</td>
                  <td>{svc.latency}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ minWidth: '40px', fontSize: '0.8rem' }}>{svc.cpu}</span>
                      <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: svc.cpu, height: '100%', background: '#0ea5e9' }} />
                      </div>
                    </div>
                  </td>
                  <td>{svc.memory}</td>
                  <td><Badge status={svc.status} text={svc.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Database Cluster Telemetry Cards */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">Distributed Database Cluster Metrics</h3>
            <p className="card-subtitle">PostgreSQL, pgvector, MongoDB sharding, and Redis cache stats</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {monitoring.databases.map((db, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                background: '#f8fafc'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{db.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: '600' }}>{db.role}</div>
                </div>
                <Badge status={db.status} text={db.status} />
              </div>

              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: '#475569' }}>
                {db.activeConnections && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Active Connection Pool:</span>
                    <strong>{db.activeConnections} / {db.maxConnections}</strong>
                  </div>
                )}
                {db.storageUsed && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Allocated Storage:</span>
                    <strong>{db.storageUsed} (IOPS: {db.iops})</strong>
                  </div>
                )}
                {db.totalVectors && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Indexed Vectors (1536-dim):</span>
                    <strong>{db.totalVectors.toLocaleString()}</strong>
                  </div>
                )}
                {db.avgIndexScanTime && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Avg HNSW Scan Time:</span>
                    <strong style={{ color: '#16a34a' }}>{db.avgIndexScanTime}</strong>
                  </div>
                )}
                {db.hitRatio && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cache Hit Ratio:</span>
                    <strong style={{ color: '#16a34a' }}>{db.hitRatio}</strong>
                  </div>
                )}
                {db.memoryUsed && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Resident Memory:</span>
                    <strong>{db.memoryUsed}</strong>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
