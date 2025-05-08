import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

type HealthData = {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  hostname: string;
  platform: string;
  containerized: boolean;
  system: {
    memoryUsagePercent: string;
    cpuCount: number;
    loadAverage: number[];
  };
};

type CIWorkflow = {
  id: string;
  name: string;
  status: string;
  lastRun: string;
  branch: string;
  commit: string;
  duration: string;
};

type CISummary = {
  totalWorkflows: number;
  successRate: number;
  averageDuration: string;
  lastDeployment: string;
  status: string;
};

type MonitoringStats = {
  apiStatus: 'healthy' | 'degraded' | 'offline';
  lastChecked: string;
  uptime: number;
  emailDeliveryRate: number;
  emailsLastWeek: number;
  averageResponseTime: number;
  cicdStatus: 'passing' | 'failing' | 'unknown';
  lastDeployment: string;
  healthData: HealthData | null;
  ciWorkflows: CIWorkflow[];
  ciSummary: CISummary | null;
};

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
          Email Delivery
        </button>
      </div>
    </div>
  );

  // Overview section showing all key metrics
  const OverviewSection = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* API Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">API Status</h3>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(stats.apiStatus)}`}>
              {stats.apiStatus.toUpperCase()}
            </span>
            <span className="ml-2 text-lg font-bold">{stats.healthData?.system.memoryUsagePercent}% Memory</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">Uptime: {formatUptime(stats.uptime)}</p>
        </div>

        {/* Email Delivery */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Email Delivery</h3>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${stats.emailDeliveryRate > 95 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {stats.emailDeliveryRate}% SUCCESS
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">{stats.emailsLastWeek} emails sent last week</p>
        </div>

        {/* Response Time */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Response Time</h3>
          <div className="text-lg font-bold">
            {stats.averageResponseTime} ms
          </div>
          <p className="mt-2 text-sm text-gray-600">Average API response time</p>
        </div>

        {/* CI/CD Status */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">CI/CD Pipeline</h3>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(stats.cicdStatus)}`}>
              {stats.cicdStatus.toUpperCase()}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Last deployment: {format(new Date(stats.lastDeployment), 'MMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* System Details */}
      {stats.healthData && (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h3 className="text-lg font-medium mb-4">System Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Environment:</span>
                <span className="font-medium">{stats.healthData.environment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <span className="font-medium">{stats.healthData.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Platform:</span>
                <span className="font-medium">{stats.healthData.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Containerized:</span>
                <span className="font-medium">{stats.healthData.containerized ? 'Yes' : 'No'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Memory Usage:</span>
                <span className="font-medium">{stats.healthData.system.memoryUsagePercent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CPU Count:</span>
                <span className="font-medium">{stats.healthData.system.cpuCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">CPU Load Average:</span>
                <span className="font-medium">{stats.healthData.system.loadAverage[0].toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Hostname:</span>
                <span className="font-medium">{stats.healthData.hostname}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
  
  // CI/CD section with detailed workflow information
  const CICDSection = () => (
    <>
      {/* CI/CD Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">CI/CD Pipeline Summary</h3>
        
        {stats.ciSummary ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Overall Status</p>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(stats.ciSummary.status)}`}>
                  {stats.ciSummary.status.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Success Rate</p>
              <p className="text-xl font-bold">{stats.ciSummary.successRate}%</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Average Duration</p>
              <p className="text-xl font-bold">{stats.ciSummary.averageDuration}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Total Workflows</p>
              <p className="text-xl font-bold">{stats.ciSummary.totalWorkflows}</p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500 text-center">No CI/CD summary data available</p>
          </div>
        )}
      </div>
      
      {/* CI/CD Workflows */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Recent Workflow Runs</h3>
        
        {stats.ciWorkflows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.ciWorkflows.map((workflow) => (
                  <tr key={workflow.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{workflow.name}</div>
                      <div className="text-xs text-gray-500">{workflow.commit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                        {workflow.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {workflow.branch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(workflow.lastRun), 'MMM d, yyyy h:mm a')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {workflow.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500 text-center">No workflow data available</p>
          </div>
        )}
      </div>
    </>
  );
  
  // Email delivery stats section
  const EmailSection = () => (
    <>
      {/* Email Delivery Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Email Delivery Performance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Delivery Rate</p>
            <p className="text-xl font-bold">{stats.emailDeliveryRate}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className={`h-2.5 rounded-full ${stats.emailDeliveryRate > 95 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                style={{ width: `${stats.emailDeliveryRate}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Emails Last Week</p>
            <p className="text-xl font-bold">{stats.emailsLastWeek}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-500">Open Rate</p>
            <p className="text-xl font-bold">72%</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div className="h-2.5 rounded-full bg-blue-500" style={{ width: '72%' }}></div>
            </div>
          </div>
        </div>
        
        {/* Mock email distribution chart */}
        <div className="bg-gray-50 p-6 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Email Activity (Last 7 Days)</h4>
          <div className="h-48 flex items-end space-x-2">
            {[12, 18, 9, 24, 16, 20, 14].map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-indigo-400 rounded-t"
                  style={{ height: `${(value / 24) * 100}%` }}
                ></div>
                <span className="text-xs text-gray-500 mt-1">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h4 className="text-sm font-medium text-blue-700 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            Note
          </h4>
          <p className="text-sm text-blue-600 mt-1">
            Email statistics shown here are simulated data. In a production environment, you would integrate with your email provider's API (Resend, SendGrid, etc.) to fetch real metrics.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">System Monitoring</h2>
        <div className="text-sm text-gray-500">
          Last updated: {format(new Date(stats.lastChecked), 'MMM d, yyyy h:mm a')}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
      )}
      
      <MonitoringNavigation />
      
      {activeSection === 'overview' && <OverviewSection />}
      {activeSection === 'ci-cd' && <CICDSection />}
      {activeSection === 'email' && <EmailSection />}

      {/* Actions */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors"
        >
          Refresh Data
        </button>
        <button
          onClick={() => window.open('/api/health', '_blank')}
          className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-md transition-colors"
        >
          View Raw Health Data
        </button>
      </div>
    </div>
  );
} 