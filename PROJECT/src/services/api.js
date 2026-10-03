// =============================================================================
// Distributed Hospital Management System (DHMS) - API Client Service
// Bridges React Frontend to API Gateway at http://localhost:8000/api/v1
// =============================================================================

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Generic Fetch Wrapper with timeout and fallback
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('dhms_jwt_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Graceful fallback to client-side data
    return null;
  }
}

export const api = {
  // Health & Cluster Telemetry
  getHealth: () => request('/health'),

  // Patients
  getPatients: () => request('/patients'),
  createPatient: (data) => request('/patients', { method: 'POST', body: JSON.stringify(data) }),

  // Doctors
  getDoctors: () => request('/doctors'),

  // Appointments
  getAppointments: () => request('/appointments'),
  createAppointment: (data) => request('/appointments', { method: 'POST', body: JSON.stringify(data) }),

  // Medical Records & pgvector
  getRecords: () => request('/medical-records'),
  createRecord: (data) => request('/medical-records', { method: 'POST', body: JSON.stringify(data) }),
  semanticSearch: (query) => request('/search/semantic', { method: 'POST', body: JSON.stringify({ query }) }),

  // Medicines & Pharmacy
  getMedicines: () => request('/medicines'),
  dispenseMedicine: (medicineId, quantity) => request('/medicines/dispense', { method: 'POST', body: JSON.stringify({ medicineId, quantity }) }),

  // Billing
  getBills: () => request('/bills')
};
