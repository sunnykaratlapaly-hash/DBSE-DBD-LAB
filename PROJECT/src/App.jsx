import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './context/ToastContext';

// Components
import { DemoRoleBar } from './components/common/DemoRoleBar';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { SearchModal } from './components/common/SearchModal';

// Pages - Landing & Auth
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Pages - Role Dashboards
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import { DoctorDashboard } from './pages/dashboards/DoctorDashboard';
import { ReceptionistDashboard } from './pages/dashboards/ReceptionistDashboard';
import { LaboratoryDashboard } from './pages/dashboards/LaboratoryDashboard';
import { PharmacyDashboard } from './pages/dashboards/PharmacyDashboard';
import { PatientDashboard } from './pages/dashboards/PatientDashboard';

// Pages - Clinical Operations
import { PatientsPage } from './pages/clinical/PatientsPage';
import { DoctorsPage } from './pages/clinical/DoctorsPage';
import { AppointmentsPage } from './pages/clinical/AppointmentsPage';
import { MedicalRecordsPage } from './pages/clinical/MedicalRecordsPage';
import { AdmissionsPage } from './pages/clinical/AdmissionsPage';
import { LaboratoryPage } from './pages/clinical/LaboratoryPage';
import { PharmacyPage } from './pages/clinical/PharmacyPage';
import { BillingPage } from './pages/clinical/BillingPage';

// Pages - Engineering & System
import { ArchitecturePage } from './pages/engineering/ArchitecturePage';
import { MonitoringPage } from './pages/engineering/MonitoringPage';
import { ApiDocsPage } from './pages/engineering/ApiDocsPage';
import { ReportsPage } from './pages/engineering/ReportsPage';
import { SettingsPage } from './pages/misc/SettingsPage';
import { ProfilePage } from './pages/misc/ProfilePage';
import { NotFoundPage } from './pages/misc/NotFoundPage';

const AppContent = () => {
  const { role, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('landing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut for Global Search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavigate = (viewId) => {
    setCurrentView(viewId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Full-screen Standalone Views (No Sidebar)
  const isStandalone = ['landing', 'login', 'register', 'forgot-password'].includes(currentView);

  if (isStandalone) {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  }

  // Dashboard & Operational Views (With Sidebar & Navbar)
  const renderView = () => {
    switch (currentView) {
      // 6 Role Dashboards
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={handleNavigate} />;
      case 'doctor-dashboard':
        return <DoctorDashboard onNavigate={handleNavigate} />;
      case 'receptionist-dashboard':
        return <ReceptionistDashboard onNavigate={handleNavigate} />;
      case 'lab-dashboard':
        return <LaboratoryDashboard onNavigate={handleNavigate} />;
      case 'pharmacy-dashboard':
        return <PharmacyDashboard onNavigate={handleNavigate} />;
      case 'patient-dashboard':
        return <PatientDashboard onNavigate={handleNavigate} />;

      // Clinical Operations
      case 'patients':
        return <PatientsPage onNavigate={handleNavigate} />;
      case 'doctors':
        return <DoctorsPage onNavigate={handleNavigate} />;
      case 'appointments':
        return <AppointmentsPage onNavigate={handleNavigate} />;
      case 'records':
        return <MedicalRecordsPage onNavigate={handleNavigate} />;
      case 'admissions':
        return <AdmissionsPage onNavigate={handleNavigate} />;
      case 'laboratory':
        return <LaboratoryPage onNavigate={handleNavigate} />;
      case 'pharmacy':
        return <PharmacyPage onNavigate={handleNavigate} />;
      case 'billing':
        return <BillingPage onNavigate={handleNavigate} />;

      // DBSE Engineering & Architecture
      case 'architecture':
        return <ArchitecturePage onNavigate={handleNavigate} />;
      case 'monitoring':
        return <MonitoringPage onNavigate={handleNavigate} />;
      case 'api-docs':
        return <ApiDocsPage onNavigate={handleNavigate} />;
      case 'reports':
        return <ReportsPage onNavigate={handleNavigate} />;

      // System & Misc
      case 'settings':
        return <SettingsPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;

      default:
        return <NotFoundPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Demo Quick Role Switcher Bar */}
      <DemoRoleBar currentView={currentView} onNavigate={handleNavigate} />

      <div className="app-container">
        {/* Collapsible Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content Area */}
        <div className="main-content">
          <Navbar
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onNavigate={handleNavigate}
          />

          <main style={{ flex: 1 }}>{renderView()}</main>
        </div>
      </div>

      {/* Global & Semantic Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
