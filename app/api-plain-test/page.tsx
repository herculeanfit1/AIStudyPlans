'use client';

import React, { useState } from 'react';

export default function ApiPlainTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/debug-plain');
      const text = await response.text();
      
      console.log('Raw response:', text);
      
      try {
        const data = JSON.parse(text);
        setResult({
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries([...response.headers.entries()]),
          data
        });
      } catch (jsonError) {
        setResult({
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries([...response.headers.entries()]),
          rawText: text,
          parseError: 'Failed to parse JSON'
        });
      }
    } catch (err) {
      console.error('API test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Plain API Test Page
      </h1>
      <p>
        This page tests a minimal API endpoint with nodejs runtime.
      </p>
      
      <div style={{ marginTop: '1rem' }}>
        <button 
          onClick={testApi}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
      </div>
      
      {error && (
        <div style={{ 
          marginTop: '1rem', 
          padding: '1rem', 
          backgroundColor: '#ffebee', 
          border: '1px solid #ffcdd2',
          borderRadius: '0.25rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div style={{ marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Response:
          </h2>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f5f5f5', 
            border: '1px solid #e0e0e0',
            borderRadius: '0.25rem',
            overflow: 'auto'
          }}>
            <pre style={{ margin: 0 }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 