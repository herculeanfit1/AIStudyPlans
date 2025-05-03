'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginSimple() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', username);
    
    if (username === 'admin' && password === 'adminpass') {
      try {
        localStorage.setItem('isAdmin', 'true');
        router.push('/admin-simple');
      } catch (err) {
        console.error('Login error:', err);
        setError('Browser storage error. Please enable cookies.');
      }
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
            Simple Admin Login
          </h1>
          <p style={{ fontSize: '14px', color: '#6b7280' }}>
            Enter your credentials to continue
          </p>
        </div>
        
        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            borderLeft: '4px solid #ef4444',
            padding: '8px 12px',
            marginBottom: '16px',
            borderRadius: '4px'
          }}>
            <p style={{ fontSize: '14px', color: '#b91c1c' }}>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="username" style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500',
              marginBottom: '4px',
              color: '#374151'
            }}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ 
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
          </div>
          
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: '500',
              marginBottom: '4px',
              color: '#374151'
            }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ 
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            style={{ 
              width: '100%',
              padding: '10px 16px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Sign in
          </button>
          
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#6b7280' }}>
            <p>For demo: username "admin" / password "adminpass"</p>
          </div>
        </form>
      </div>
    </div>
  );
} 