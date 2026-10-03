import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const StatCard = ({
  label,
  value,
  icon: Icon,
  variant = 'primary',
  trend,
  trendType = 'positive',
  subtext
}) => {
  return (
    <div className="stat-card">
      <div>
        <span className="stat-label">{label}</span>
        <div className="stat-value">{value}</div>
        {trend && (
          <div className={`stat-trend ${trendType}`}>
            {trendType === 'positive' && <TrendingUp size={14} />}
            {trendType === 'negative' && <TrendingDown size={14} />}
            {trendType === 'neutral' && <Minus size={14} />}
            <span>{trend}</span>
          </div>
        )}
        {subtext && !trend && (
          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '6px' }}>
            {subtext}
          </span>
        )}
      </div>
      {Icon && (
        <div className={`stat-icon ${variant}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};
