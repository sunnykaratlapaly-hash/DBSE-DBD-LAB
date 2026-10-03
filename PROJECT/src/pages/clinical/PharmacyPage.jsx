import React from 'react';
import { PharmacyDashboard } from '../dashboards/PharmacyDashboard';

export const PharmacyPage = ({ onNavigate }) => {
  return <PharmacyDashboard onNavigate={onNavigate} />;
};
