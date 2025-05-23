import React from 'react';
import { format } from 'date-fns';
import { CIWorkflow, CISummary, MonitoringStats } from '../../types/monitoring';

interface CICDSectionProps {
  stats: MonitoringStats;
  getStatusColor: (status: string) => string;
}

export default function CICDSection({ stats, getStatusColor }: CICDSectionProps) {
  return (
    <div>
      {/* CI/CD Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500">CI/CD Pipeline Status</dt>
              <dd className="mt-1 flex justify-between items-center">
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                      stats.cicdStatus
                    )}`}
                  >
                    {stats.cicdStatus}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    Last deployment: {
                      stats.lastDeployment 
                        ? format(new Date(stats.lastDeployment), 'MMM d, h:mm a') 
                        : 'N/A'
                    }
                  </span>
                </div>
              </dd>
            </dl>
          </div>
        </div>

        {/* Success Rate Card */}
        {stats.ciSummary && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500">Success Rate</dt>
                <dd className="mt-1">
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.ciSummary.successRate}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {stats.ciSummary.totalWorkflows} total workflows
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div
                      className={`h-2.5 rounded-full ${
                        stats.ciSummary.successRate > 90
                          ? 'bg-green-600'
                          : stats.ciSummary.successRate > 75
                          ? 'bg-yellow-500'
                          : 'bg-red-600'
                      }`}
                      style={{ width: `${stats.ciSummary.successRate}%` }}
                    ></div>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        )}
      </div>

      {/* Recent Workflows */}
      {stats.ciWorkflows && stats.ciWorkflows.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Workflow Runs</h3>
          <div className="mt-4 bg-white shadow overflow-x-auto sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Workflow
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Branch
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Last Run
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.ciWorkflows.map((workflow) => (
                  <tr key={workflow.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {workflow.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(
                          workflow.status
                        )}`}
                      >
                        {workflow.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {workflow.branch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(workflow.lastRun), 'MMM d, h:mm a')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {workflow.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 