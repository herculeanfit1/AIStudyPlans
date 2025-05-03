'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardSimple() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is authenticated
    try {
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      console.log('Auth check result:', isAdmin);
      
      if (!isAdmin) {
        router.push('/admin-simple/login');
      } else {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error('Auth check error:', err);
      router.push('/admin-simple/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);
  
  const handleLogout = () => {
    try {
      localStorage.removeItem('isAdmin');
    } catch (err) {
      console.error('Logout error:', err);
    }
    router.push('/admin-simple/login');
  };
  
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f3f4f6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '3px solid #e5e7eb', 
            borderTopColor: '#4f46e5',
            borderRadius: '50%',
            margin: '0 auto',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading...</p>
          <style jsx global>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: '#111827'
          }}>
            Simple Admin Dashboard
          </h1>
          
          <button
            onClick={handleLogout}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#ef4444', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
        
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ 
            fontSize: '18px', 
            fontWeight: '500',
            color: '#374151',
            marginBottom: '16px'
          }}>
            Welcome to the Admin Dashboard
          </h2>
          
          <p style={{ color: '#4b5563', marginBottom: '16px' }}>
            This is a simplified version of the admin dashboard with no dependencies on Tailwind or other UI libraries.
          </p>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px',
            marginTop: '24px'
          }}>
            <div style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '16px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>245</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Users</div>
            </div>
            
            <div style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '16px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>128</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Feedback</div>
            </div>
            
            <div style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '16px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>4.2</div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 