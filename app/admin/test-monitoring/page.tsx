'use client';

import React from 'react';
import MonitoringDashboard from '../settings/monitoring';

export default function TestMonitoring() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Test Monitoring Dashboard</h1>
        <p className="text-gray-600">
          This is a test page to view the monitoring dashboard without authentication
        </p>
      </div>
      
      <MonitoringDashboard />
    </div>
  );
} 