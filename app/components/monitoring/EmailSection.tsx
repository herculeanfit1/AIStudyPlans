import React from 'react';
import { MonitoringStats } from '../../types/monitoring';

interface EmailSectionProps {
  stats: MonitoringStats;
}

export default function EmailSection({ stats }: EmailSectionProps) {
  // Mock email data for the chart (in a real app, this would come from the API)
  const mockEmailData = [
    { date: 'Mon', sent: 5, delivered: 5, opened: 3 },
    { date: 'Tue', sent: 8, delivered: 7, opened: 5 },
    { date: 'Wed', sent: 12, delivered: 12, opened: 8 },
    { date: 'Thu', sent: 6, delivered: 6, opened: 4 },
    { date: 'Fri', sent: 10, delivered: 9, opened: 7 },
    { date: 'Sat', sent: 3, delivered: 3, opened: 1 },
    { date: 'Sun', sent: 1, delivered: 1, opened: 0 },
  ];

  // Calculate max value for the chart
  const maxValue = Math.max(...mockEmailData.map((d) => d.sent));

  return (
    <div>
      {/* Email Delivery Card */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Email Delivery</h3>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-700">Delivery Rate</div>
              <div className="text-sm font-medium text-green-600">{stats.emailDeliveryRate}%</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${stats.emailDeliveryRate}%` }}
              ></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-medium text-gray-700">Emails Sent (Last Week)</div>
              <div className="text-sm text-gray-500">{stats.emailsLastWeek}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Activity Chart */}
      <div className="bg-white overflow-hidden shadow rounded-lg mt-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Last Week's Email Activity
          </h3>
          <div className="mt-6">
            {/* Simple bar chart */}
            <div className="flex h-64 items-end space-x-2">
              {mockEmailData.map((day) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full flex flex-col items-center space-y-1">
                    {/* Opened bar */}
                    <div
                      className="w-full bg-blue-700 rounded-t"
                      style={{
                        height: `${(day.opened / maxValue) * 100}%`,
                        maxWidth: '24px',
                      }}
                    ></div>
                    
                    {/* Delivered bar */}
                    <div
                      className="w-full bg-blue-500 rounded-none"
                      style={{
                        height: `${((day.delivered - day.opened) / maxValue) * 100}%`,
                        marginTop: '-4px',
                        maxWidth: '24px',
                      }}
                    ></div>
                    
                    {/* Sent bar */}
                    <div
                      className="w-full bg-blue-300 rounded-none"
                      style={{
                        height: `${((day.sent - day.delivered) / maxValue) * 100}%`,
                        marginTop: '-4px',
                        maxWidth: '24px',
                      }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{day.date}</div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-4 flex items-center justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-300 rounded"></div>
                <span className="ml-1 text-xs text-gray-500">Sent</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="ml-1 text-xs text-gray-500">Delivered</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-700 rounded"></div>
                <span className="ml-1 text-xs text-gray-500">Opened</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Configuration Status */}
      <div className="bg-white overflow-hidden shadow rounded-lg mt-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Email Configuration</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Email Provider</span>
              <span className="text-sm font-medium text-gray-900">Resend</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">From Address</span>
              <span className="text-sm font-medium text-gray-900">noreply@aistudyplans.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Reply-To Address</span>
              <span className="text-sm font-medium text-gray-900">support@aistudyplans.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Templates</span>
              <span className="text-sm font-medium text-green-600">All configured</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">API Status</span>
              <span className="text-sm font-medium text-green-600">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 