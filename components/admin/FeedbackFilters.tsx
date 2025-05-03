'use client';

import React, { useState } from 'react';

interface FeedbackFiltersProps {
  onFilterChange: (filters: {
    type?: string;
    minRating?: number;
    maxRating?: number;
    startDate?: string;
    endDate?: string;
    searchTerm?: string;
  }) => void;
  isLoading: boolean;
}

export default function FeedbackFilters({ onFilterChange, isLoading }: FeedbackFiltersProps) {
  const [filters, setFilters] = useState({
    type: '',
    minRating: undefined as number | undefined,
    maxRating: undefined as number | undefined,
    startDate: '',
    endDate: '',
    searchTerm: '',
  });

  // Handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    let processedValue: string | number | undefined = value;
    
    // Convert rating values to numbers if they're not empty
    if ((name === 'minRating' || name === 'maxRating') && value !== '') {
      processedValue = parseInt(value, 10);
    }
    
    setFilters({
      ...filters,
      [name]: processedValue,
    });
  };

  // Apply filters
  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  // Clear all filters
  const clearFilters = () => {
    const resetFilters = {
      type: '',
      minRating: undefined,
      maxRating: undefined,
      startDate: '',
      endDate: '',
      searchTerm: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
      </div>
      
      <form onSubmit={applyFilters} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div>
            <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              name="searchTerm"
              id="searchTerm"
              placeholder="Search in feedback text"
              value={filters.searchTerm}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          {/* Feedback Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Feedback Type
            </label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Types</option>
              <option value="feature_request">Feature Request</option>
              <option value="general">General</option>
              <option value="improvement">Improvement</option>
              <option value="bug">Bug</option>
            </select>
          </div>
          
          {/* Rating Range */}
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label htmlFor="minRating" className="block text-sm font-medium text-gray-700 mb-1">
                Min Rating
              </label>
              <select
                id="minRating"
                name="minRating"
                value={filters.minRating !== undefined ? filters.minRating.toString() : ''}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className="w-1/2">
              <label htmlFor="maxRating" className="block text-sm font-medium text-gray-700 mb-1">
                Max Rating
              </label>
              <select
                id="maxRating"
                name="maxRating"
                value={filters.maxRating !== undefined ? filters.maxRating.toString() : ''}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
          
          {/* Date Range */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleInputChange}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            Clear All
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Applying...
              </>
            ) : (
              <>Apply Filters</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 