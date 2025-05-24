'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'

export default function AdminErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Admin page error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Admin Page</h1>
          <div className="text-gray-600 mb-6">
            <p className="mb-2">There was an error while loading the admin page.</p>
            <p className="text-sm text-gray-500">Error: {error.message}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md text-left mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Possible causes:</p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Authentication issue - your session may have expired</li>
              <li>Network connection problem</li>
              <li>Browser compatibility issue</li>
              <li>Application configuration error</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => reset()}
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors"
            >
              Try Again
            </button>
            
            <a
              href="/api/auth/signin"
              className="w-full inline-block py-2 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors"
            >
              Sign In Again
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 