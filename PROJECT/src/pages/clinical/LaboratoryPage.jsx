import React from 'react';
import { LaboratoryDashboard } from '../dashboards/LaboratoryDashboard';

export const LaboratoryPage = ({ onNavigate }) => {
  return <LaboratoryDashboard onNavigate={onNavigate} />;
};
