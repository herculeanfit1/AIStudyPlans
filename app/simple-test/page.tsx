'use client';

import { useState } from 'react';

export default function SimpleTest() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await fetch('/api/simple-test');
      const text = await response.text();
      
      // Log the raw text first
      console.log('Raw response:', text);
      setResult(text);
    } catch (err: any) {
      console.error('API call failed:', err);
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Simple API Test</h1>
      <p className="mb-4">Testing a basic API endpoint with simplified response handling</p>
      
      <button 
        onClick={testApi} 
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Simple API'}
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Raw Response:</h2>
          <div className="p-4 bg-gray-100 rounded overflow-auto">
            <pre>{result}</pre>
          </div>
        </div>
      )}
    </div>
  );
} 