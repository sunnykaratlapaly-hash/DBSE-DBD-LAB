// Formatting utilities for DHMS

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount || 0);
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const getStatusBadgeClass = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'paid':
    case 'available':
    case 'completed':
    case 'discharged':
    case 'active':
    case 'optimal':
    case 'healthy':
    case 'operational':
      return 'badge-success';

    case 'pending':
    case 'in consultation':
    case 'partially paid':
    case 'urgent':
    case 'semi-private':
      return 'badge-warning';

    case 'in progress':
    case 'admitted':
    case 'scheduled':
    case 'critical':
      return 'badge-primary';

    case 'cancelled':
    case 'in surgery':
    case 'stat':
    case 'low stock':
    case 'high (alert)':
      return 'badge-danger';

    default:
      return 'badge-slate';
  }
};
