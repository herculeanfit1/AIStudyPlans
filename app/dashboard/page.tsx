'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StudyPlanCard from '@/components/StudyPlanCard';
import TodoApp from '@/components/TodoApp';
import StudyTimer from '@/components/StudyTimer';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your learning progress.</p>
      </div>
      
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {['overview', 'study plans', 'analytics', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Active Study Plans</h2>
              <div className="space-y-4">
                <StudyPlanCard 
                  title="Data Science Fundamentals"
                  subject="Computer Science"
                  progress={65}
                  dueDate="April 30, 2023"
                  tasks={16}
                  completedTasks={10}
                />
                <StudyPlanCard 
                  title="Advanced Machine Learning"
                  subject="AI"
                  progress={30}
                  dueDate="May 15, 2023" 
                  tasks={12}
                  completedTasks={4}
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <i className="fas fa-check text-green-600"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Completed "Introduction to Python" chapter</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <i className="fas fa-book-open text-blue-600"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Started "Data Visualization" module</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <i className="fas fa-star text-purple-600"></i>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Earned "Quick Learner" badge</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <StudyTimer initialSeconds={1500} />
            <TodoApp />
          </div>
        </div>
      )}
      
      {activeTab !== 'overview' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-gray-600">This section is under development.</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 