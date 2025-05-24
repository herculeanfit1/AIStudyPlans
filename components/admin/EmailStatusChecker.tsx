'use client';

import { useState, useEffect } from 'react';

/**
 * Component to check and display email configuration status
 * Helps administrators diagnose email delivery issues
 */
export default function EmailStatusChecker() {
  const [status, setStatus] = useState<{
    configured: boolean;
    resendApiKey: boolean;
    emailFrom: boolean;
    emailReplyTo: boolean;
    nextPublicResendConfigured: string;
    debug?: Record<string, any>;
  } | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState<Record<string, any> | null>(null);
  const [testLoading, setTestLoading] = useState(false);
  const [debugEnabled, setDebugEnabled] = useState(false);

  // Check email configuration status on mount
  useEffect(() => {
    const checkEmailConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add a random query parameter to avoid caching
        const response = await fetch(`/api/email-config?t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        
        const data = await response.json();
        setStatus(data);
        
        // Log the event instead of tracking
        console.log('Admin: Email configuration checked', {
          configured: data.configured,
          resendApiKey: data.resendApiKey,
          emailFrom: data.emailFrom,
          emailReplyTo: data.emailReplyTo,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to check email configuration');
        console.log('Admin: Email configuration error', {
          error: err.message,
        });
      } finally {
        setLoading(false);
      }
    };
    
    checkEmailConfig();
  }, []);
  
  // Send a test email
  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!testEmail || !testEmail.includes('@')) {
      setTestResult({ error: 'Please enter a valid email address' });
      return;
    }
    
    try {
      setTestLoading(true);
      setTestResult(null);
      
      const response = await fetch('/api/debug-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: testEmail }),
      });
      
      const data = await response.json();
      setTestResult(data);
      
      // Log the event instead of tracking
      console.log('Admin: Test email sent', {
        success: data.success,
        to: testEmail,
      });
    } catch (err: any) {
      setTestResult({ 
        success: false, 
        error: err.message || 'Failed to send test email' 
      });
      console.log('Admin: Test email error', {
        error: err.message,
        to: testEmail,
      });
    } finally {
      setTestLoading(false);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Email Configuration Status</h2>
      
      {loading ? (
        <p className="text-gray-500">Checking email configuration...</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>Error checking email configuration: {error}</p>
        </div>
      ) : status ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Configuration Status</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 ${status.configured ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {status.configured ? '✓' : '×'}
                  </span>
                  <span>Overall Status: {status.configured ? 'Configured' : 'Not Configured'}</span>
                </li>
                <li className="flex items-center">
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 ${status.resendApiKey ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {status.resendApiKey ? '✓' : '×'}
                  </span>
                  <span>Resend API Key: {status.resendApiKey ? 'Present' : 'Missing'}</span>
                </li>
                <li className="flex items-center">
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 ${status.emailFrom ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {status.emailFrom ? '✓' : '×'}
                  </span>
                  <span>FROM Email: {status.emailFrom ? 'Configured' : 'Missing'}</span>
                </li>
                <li className="flex items-center">
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 ${status.emailReplyTo ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {status.emailReplyTo ? '✓' : '×'}
                  </span>
                  <span>REPLY-TO Email: {status.emailReplyTo ? 'Configured' : 'Missing'}</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Client-Side Access</h3>
              <p className="mb-2">
                <span className="font-semibold">NEXT_PUBLIC_RESEND_CONFIGURED:</span> {status.nextPublicResendConfigured}
              </p>
              <div className="text-sm text-gray-600">
                <p>This public variable tells client-side code if email is configured.</p>
                <p>If waitlist forms aren't sending emails, check this value in production.</p>
              </div>
            </div>
          </div>
          
          {/* Debug Information (togglable) */}
          <div className="mt-4">
            <button
              onClick={() => setDebugEnabled(!debugEnabled)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {debugEnabled ? 'Hide Debug Info' : 'Show Debug Info'}
            </button>
            
            {debugEnabled && status.debug && (
              <div className="mt-2 p-3 bg-gray-100 rounded text-sm font-mono whitespace-pre overflow-x-auto">
                {JSON.stringify(status.debug, null, 2)}
              </div>
            )}
          </div>
          
          {/* Email Testing Form */}
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold mb-3">Test Email Delivery</h3>
            <form onSubmit={handleSendTestEmail} className="space-y-4">
              <div>
                <label htmlFor="testEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Send Test Email To:
                </label>
                <input
                  type="email"
                  id="testEmail"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={testLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {testLoading ? 'Sending...' : 'Send Test Email'}
              </button>
            </form>
            
            {/* Test Results */}
            {testResult && (
              <div className={`mt-4 p-4 rounded-md ${testResult.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                <h4 className="font-medium mb-2">{testResult.success ? 'Email Sent Successfully' : 'Failed to Send Email'}</h4>
                {testResult.success ? (
                  <div>
                    <p>Sent to: {testResult.to}</p>
                    <p>Message ID: {testResult.messageId}</p>
                    <p>Environment: {testResult.environment}</p>
                  </div>
                ) : (
                  <div>
                    <p>Error: {testResult.error}</p>
                    {testResult.details && (
                      <pre className="mt-2 text-xs overflow-x-auto">
                        {JSON.stringify(testResult.details, null, 2)}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
} 