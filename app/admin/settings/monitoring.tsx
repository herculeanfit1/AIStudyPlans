import React, { useState, useEffect } from 'react';
import { MonitoringStats } from '../../types/monitoring';
import OverviewSection from '../../components/monitoring/OverviewSection';
import CICDSection from '../../components/monitoring/CICDSection';
import EmailSection from '../../components/monitoring/EmailSection';

export default function MonitoringDashboard() {
  const [stats, setStats] = useState<MonitoringStats>({
    apiStatus: 'unknown' as any,
    lastChecked: '',
    uptime: 0,
    emailDeliveryRate: 0,
    emailsLastWeek: 0,
    averageResponseTime: 0,
    cicdStatus: 'unknown',
    lastDeployment: '',
    healthData: null,
    ciWorkflows: [],
    ciSummary: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'ci-cd' | 'email'>('overview');

  // Fetch monitoring data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get health check data
        const healthResponse = await fetch('/api/health');
        let healthData = null;
        
        if (healthResponse.ok) {
          healthData = await healthResponse.json();
        }
        
        // Get CI/CD status
        const ciResponse = await fetch('/api/admin/ci-status');
        let ciData = { workflows: [], summary: null };
        
        if (ciResponse.ok) {
          ciData = await ciResponse.json();
        }
        
        // For demo purposes, we'll use mock data for email metrics
        // In production, you would fetch this from your email service provider API
        
        setStats({
          apiStatus: healthData?.status || 'offline',
          lastChecked: new Date().toISOString(),
          uptime: healthData?.uptime || 0,
          emailDeliveryRate: 98.5, // Mock data
          emailsLastWeek: 45, // Mock data
          averageResponseTime: 285, // Mock data in ms
          cicdStatus: ciData.summary?.status || 'unknown',
          lastDeployment: ciData.summary?.lastDeployment || new Date().toISOString(),
          healthData: healthData,
          ciWorkflows: ciData.workflows || [],
          ciSummary: ciData.summary
        });
      } catch (err: any) {
        console.error('Error fetching monitoring data:', err);
        setError(err.message || 'Failed to fetch monitoring data');
        
        // Set default offline status
        setStats(prev => ({
          ...prev,
          apiStatus: 'offline',
          lastChecked: new Date().toISOString(),
        }));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Set up polling every 60 seconds
    const intervalId = setInterval(fetchData, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Format uptime as days, hours, minutes
  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    
    return parts.join(' ') || '0m';
  };

  // Get status color classes
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'healthy':
      case 'passing':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'degraded':
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
      case 'failing':
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold">System Monitoring</h2>
        <div className="flex items-center justify-center p-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="ml-3 text-gray-600">Loading monitoring data...</p>
        </div>
      </div>
    );
  }
  
  // Navigation tabs for different monitoring sections
  const MonitoringNavigation = () => (
    <div className="mb-6 border-b">
      <div className="flex space-x-6">
        <button
          onClick={() => setActiveSection('overview')}
          className={`pb-3 px-1 ${
            activeSection === 'overview'
              ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveSection('ci-cd')}
          className={`pb-3 px-1 ${
            activeSection === 'ci-cd'
              ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          CI/CD Pipeline
        </button>
        <button
          onClick={() => setActiveSection('email')}
          className={`pb-3 px-1 ${
            activeSection === 'email'
              ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Email Service
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">System Monitoring</h2>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg
            className="-ml-0.5 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <MonitoringNavigation />

      {activeSection === 'overview' && <OverviewSection stats={stats} formatUptime={formatUptime} getStatusColor={getStatusColor} />}
      {activeSection === 'ci-cd' && <CICDSection stats={stats} getStatusColor={getStatusColor} />}
      {activeSection === 'email' && <EmailSection stats={stats} />}
    </div>
  );
} 