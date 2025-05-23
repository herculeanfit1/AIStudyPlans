import React from 'react';
import { format } from 'date-fns';
import { HealthData, MonitoringStats } from '../../types/monitoring';

interface OverviewSectionProps {
  stats: MonitoringStats;
  formatUptime: (seconds: number) => string;
  getStatusColor: (status: string) => string;
}

export default function OverviewSection({ stats, formatUptime, getStatusColor }: OverviewSectionProps) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* API Status Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500">API Status</dt>
              <dd className="mt-1 flex justify-between items-center">
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      stats.apiStatus
                    )}`}
                  >
                    {stats.apiStatus}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    Last checked: {format(new Date(stats.lastChecked), 'HH:mm:ss')}
                  </span>
                </div>
              </dd>
            </dl>
          </div>
        </div>

        {/* Uptime Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500">System Uptime</dt>
              <dd className="mt-1 flex items-baseline justify-between">
                <div className="flex flex-col">
                  <div className="text-2xl font-semibold text-gray-900">
                    {formatUptime(stats.uptime)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Since last restart
                  </div>
                </div>
              </dd>
            </dl>
          </div>
        </div>

        {/* Email Delivery Rate */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500">Email Delivery</dt>
              <dd className="mt-1">
                <div className="flex justify-between items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.emailDeliveryRate}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {stats.emailsLastWeek} emails sent this week
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${stats.emailDeliveryRate}%` }}
                  ></div>
                </div>
              </dd>
            </dl>
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500">Avg Response Time</dt>
              <dd className="mt-1 flex items-baseline justify-between">
                <div className="flex flex-col">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stats.averageResponseTime} ms
                  </div>
                  <div className="text-sm text-gray-500">
                    API endpoints
                  </div>
                </div>
                <div
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    stats.averageResponseTime < 200
                      ? 'bg-green-100 text-green-800'
                      : stats.averageResponseTime < 500
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {stats.averageResponseTime < 200
                    ? 'Fast'
                    : stats.averageResponseTime < 500
                    ? 'Moderate'
                    : 'Slow'}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>

      {/* Server Details */}
      {stats.healthData && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Server Details</h3>
          <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Environment</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">
                    {stats.healthData.environment}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Version</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {stats.healthData.version || 'Not available'}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Hostname</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {stats.healthData.hostname}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Platform</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">
                    {stats.healthData.platform}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">CPU Cores</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {stats.healthData.system.cpuCount}
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Memory Usage</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {stats.healthData.system.memoryUsagePercent}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 