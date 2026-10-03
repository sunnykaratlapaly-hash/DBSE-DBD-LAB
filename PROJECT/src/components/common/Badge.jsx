import React from 'react';
import { getStatusBadgeClass } from '../../utils/formatters';

export const Badge = ({ status, text, dot = true, className = '', variant }) => {
  const label = text || status;
  const badgeClass = variant ? `badge-${variant}` : getStatusBadgeClass(status);

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {dot && <span className="badge-dot" />}
      {label}
    </span>
  );
};
