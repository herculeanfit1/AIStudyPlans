'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getFeedbackStats, FeedbackStats } from '@/lib/admin-supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    try {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      if (!isAdmin) {
        console.log('Not authenticated, redirecting to login');
        router.push('/admin/login');
        return;
      }
      
      // Load real feedback stats
      loadStats();
    } catch (err) {
      console.error('Auth check error:', err);
      router.push('/admin/login');
    }
  }, [router]);
  
  // Load stats for dashboard
  const loadStats = async () => {
    setIsLoading(true);
    try {
      const { stats, error } = await getFeedbackStats();
      if (error) throw new Error(error);
      
      setStats(stats);
    } catch (err: any) {
      console.error('Error loading stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Overview of application statistics and activities
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="ml-3 text-gray-600">Loading statistics...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {/* Use actual user count when available */}
                    {stats?.totalFeedback || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500 text-xl">
                  👥
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Users</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {/* Use actual active user count when available */}
                    {stats?.recentFeedback || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-xl">
                  ✓
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Feedback</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stats?.totalFeedback || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 text-xl">
                  💬
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stats?.averageRating?.toFixed(1) || 'N/A'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 text-xl">
                  ⭐
                </div>
              </div>
            </div>
          </div>
          
          {/* Recently Added Feedback */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Recently Added Feedback
              </h2>
              <Link 
                href="/admin/feedback" 
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                View All →
              </Link>
            </div>
            
            {stats?.totalFeedback === 0 ? (
              <div className="p-4 bg-gray-50 rounded-md text-center">
                <p className="text-gray-600">No feedback data available.</p>
                <p className="text-sm text-gray-500 mt-1">
                  Go to <Link href="/admin/settings" className="text-indigo-600 hover:text-indigo-800">Settings</Link> to add test feedback or check the application.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-gray-600">
                  You have {stats?.totalFeedback || 0} total feedback entries.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Visit the <Link href="/admin/feedback" className="text-indigo-600 hover:text-indigo-800">Feedback Dashboard</Link> to view and analyze all feedback.
                </p>
              </div>
            )}
          </div>
          
          {/* Admin Shortcuts */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Admin Shortcuts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                href="/admin/feedback" 
                className="p-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors text-center"
              >
                Feedback Dashboard
              </Link>
              <Link 
                href="/admin/settings" 
                className="p-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors text-center"
              >
                Admin Settings
              </Link>
              <Link 
                href="/" 
                className="p-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors text-center"
                target="_blank"
              >
                Visit Website
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 