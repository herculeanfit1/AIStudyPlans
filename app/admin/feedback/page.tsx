'use client';

import React, { useState, useEffect } from 'react';
import { 
  getAllFeedback, 
  getFeedbackStats, 
  getFeedbackTextAnalytics, 
  exportFeedbackToCsv,
  type FeedbackWithUser,
  type FeedbackStats,
  type FeedbackFilters
} from '@/lib/admin-supabase';
import { 
  FeedbackLineChart, 
  FeedbackBarChart, 
  FeedbackDoughnutChart,
  KeywordCloud 
} from '@/components/admin/FeedbackChart';
import FeedbackTable from '@/components/admin/FeedbackTable';
import FeedbackFiltersComponent from '@/components/admin/FeedbackFilters';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function FeedbackDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [devAdmin, setDevAdmin] = useState(false);

  // State for feedback data
  const [feedback, setFeedback] = useState<FeedbackWithUser[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClearingData, setIsClearingData] = useState(false);
  
  // State for charts and statistics
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [keywords, setKeywords] = useState<{ text: string; count: number }[]>([]);
  
  // State for filters
  const [filters, setFilters] = useState({
    type: '',
    minRating: undefined as number | undefined,
    maxRating: undefined as number | undefined,
    startDate: '',
    endDate: '',
    searchTerm: '',
  });

  useEffect(() => {
    // Check for dev admin flag in localStorage or cookies
    let isDevAdmin = false;
    try {
      isDevAdmin = localStorage.getItem('isAdmin') === 'true';
    } catch {}
    if (!isDevAdmin) {
      isDevAdmin = document.cookie.includes('isAdmin=true');
    }
    setDevAdmin(isDevAdmin);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    if (!(session?.user?.isAdmin || devAdmin)) {
      router.replace('/api/auth/signin?error=AccessDenied');
    }
  }, [session, status, devAdmin, router]);

  // Load feedback data with current page and filters
  const loadFeedback = async () => {
    setIsLoading(true);
    try {
      const { data, count, error } = await getAllFeedback(page, pageSize, filters);
      if (error) throw new Error(error);
      
      setFeedback(data);
      setTotalCount(count);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error('Error loading feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load stats for dashboard
  const loadStats = async () => {
    try {
      const { stats, error } = await getFeedbackStats();
      if (error) throw new Error(error);
      
      setStats(stats);
    } catch (err: unknown) {
      console.error('Error loading stats:', err);
    }
  };

  // Load text analytics
  const loadTextAnalytics = async () => {
    try {
      const { keywords, error } = await getFeedbackTextAnalytics();
      if (error) throw new Error(error);
      
      setKeywords(keywords);
    } catch (err: unknown) {
      console.error('Error analyzing text:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    loadFeedback();
    loadStats();
    loadTextAnalytics();
  }, []);

  // Reload data when page or filters change
  useEffect(() => {
    loadFeedback();
  }, [page, filters]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // Handle filter change
  const handleFilterChange = (newFilters: Partial<FeedbackFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  // Handle export to CSV
  const handleExport = async () => {
    try {
      setIsLoading(true);
      const { csv, error } = await exportFeedbackToCsv(filters);
      if (error) throw new Error(error);
      
      // Create a blob and download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `feedback_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error('Error exporting feedback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clearing all feedback data
  const handleClearData = async () => {
    if (!confirm('Are you sure you want to clear all feedback data? This action cannot be undone.')) {
      return;
    }
    
    try {
      setIsClearingData(true);
      
      const response = await fetch('/api/admin/clear-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('All feedback data has been cleared successfully.');
        // Reload the data
        setFeedback([]);
        setTotalCount(0);
        loadStats();
        loadTextAnalytics();
      } else {
        throw new Error(data.message || 'Failed to clear feedback data');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      console.error('Error clearing feedback data:', err);
    } finally {
      setIsClearingData(false);
    }
  };

  // Transform stats data for charts
  const prepareChartData = () => {
    if (!stats) return null;

    // Chart data for feedback by type
    const feedbackByTypeData = Object.entries(stats.feedbackByType).map(([label, value]) => ({
      label: label.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: value as number,
    }));

    // Chart data for feedback by rating
    const feedbackByRatingData = Object.entries(stats.feedbackByRating).map(([label, value]) => ({
      label,
      value: value as number,
    })).sort((a, b) => parseInt(a.label) - parseInt(b.label));

    return {
      byType: feedbackByTypeData,
      byRating: feedbackByRatingData,
      byDay: stats.feedbackByDay
    };
  };

  const chartData = prepareChartData();

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Feedback Dashboard</h1>
          <p className="text-gray-600">
            Review and analyze user feedback to improve your application
          </p>
        </div>
        <button
          onClick={handleClearData}
          disabled={isClearingData}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isClearingData ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Clearing...
            </>
          ) : (
            <>
              <i className="fas fa-trash-alt mr-2"></i>
              Clear All Data
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error: {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Feedback</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalFeedback}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <i className="fas fa-comment-alt text-indigo-600"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Rating</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {stats.averageRating !== null ? stats.averageRating.toFixed(1) : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <i className="fas fa-star text-yellow-600"></i>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">Recent Feedback (7 days)</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stats.recentFeedback}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <i className="fas fa-chart-line text-green-600"></i>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <FeedbackLineChart 
            title="Feedback Over Time" 
            data={chartData.byDay} 
          />
          
          <FeedbackDoughnutChart 
            title="Feedback by Type" 
            data={chartData.byType} 
          />
          
          <FeedbackBarChart 
            title="Feedback by Rating" 
            data={chartData.byRating} 
          />
          
          <KeywordCloud keywords={keywords} />
        </div>
      )}

      {/* Filters */}
      <FeedbackFiltersComponent 
        onFilterChange={handleFilterChange} 
        isLoading={isLoading} 
      />

      {/* Feedback List */}
      <FeedbackTable
        feedback={feedback}
        totalCount={totalCount}
        page={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onExport={handleExport}
        isLoading={isLoading}
      />
    </>
  );
} 