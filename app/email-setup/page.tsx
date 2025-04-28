'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function EmailSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-8">
          <div className="flex items-center space-x-2 mb-6">
            <Link 
              href="/"
              className="text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to home
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Email Setup Guide</h1>
          
          <div className="prose max-w-none">
            <div className="bg-blue-50 p-4 rounded-lg mb-8 border border-blue-100">
              <h2 className="text-blue-800 text-lg font-semibold mb-2">✉️ Overview</h2>
              <p className="text-blue-700">
                This guide explains how to set up email functionality for your SchedulEd application using Resend as the email service provider.
              </p>
            </div>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Step 1: Sign up for Resend</h2>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Go to <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">Resend.com</a> and create an account</li>
              <li>Verify your account</li>
              <li>Navigate to the API Keys section in your dashboard</li>
              <li>Create a new API key</li>
              <li>Copy the API key (it will look like <code>re_123abc...</code>)</li>
            </ol>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Step 2: Configure Environment Variables</h2>
            <p className="mb-4">
              Create a file named <code>.env.local</code> in the root directory of your project with the following variables:
            </p>
            
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6">
              <pre className="font-mono text-sm">
{`# Resend Email API Configuration
RESEND_API_KEY=your_resend_api_key_here

# Email Configuration
EMAIL_FROM=notifications@aistudyplans.com
EMAIL_REPLY_TO=support@aistudyplans.com
SEND_EMAILS_IN_DEVELOPMENT=true  # Set to true to test emails locally

# Application Configuration 
NEXT_PUBLIC_APP_URL=http://localhost:3000`}
              </pre>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 mb-6">
              <h3 className="text-yellow-800 font-semibold mb-2">⚠️ Important Note</h3>
              <p className="text-yellow-700">
                The <code>.env.local</code> file should <strong>never</strong> be committed to your repository. 
                It's automatically ignored by Git when using Next.js.
              </p>
            </div>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Step 3: Verify Your Domain (For Production)</h2>
            <p className="mb-3">For production use, you'll need to verify your domain with Resend:</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>In the Resend dashboard, go to the "Domains" section</li>
              <li>Click "Add Domain" and follow the verification process</li>
              <li>Update your DNS records as instructed by Resend</li>
              <li>Wait for domain verification to complete</li>
            </ol>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Step 4: Testing Email Functionality</h2>
            <p className="mb-3">You can test your email setup using one of these methods:</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">Option 1: Use the Test Script</h3>
            <p className="mb-2">Run the following command in your terminal:</p>
            <div className="bg-gray-100 p-3 rounded-lg mb-4">
              <code className="font-mono text-sm">node test-resend.js delivered@resend.dev</code>
            </div>
            
            <h3 className="text-xl font-semibold mt-6 mb-2">Option 2: Use the Waitlist Form</h3>
            <p className="mb-2">
              Fill out the waitlist form on the homepage with the test email <code>delivered@resend.dev</code>.
              This email is a special address provided by Resend for testing purposes.
            </p>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 mt-8 mb-6">
              <h2 className="text-green-800 text-lg font-semibold mb-2">🎉 Testing in Development</h2>
              <p className="text-green-700 mb-2">
                When in development mode, the application is configured to:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-green-700">
                <li>Send emails to <code>delivered@resend.dev</code> instead of the actual recipient</li>
                <li>This ensures you won't accidentally send test emails to real users</li>
                <li>Always check the API response in browser dev tools to verify operation</li>
              </ul>
            </div>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Troubleshooting</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold mb-2">No emails being sent</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Verify your API key is correctly set in <code>.env.local</code></li>
                  <li>Check server logs for error messages</li>
                  <li>Ensure the application was restarted after changing environment variables</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold mb-2">API Key Invalid</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Generate a new API key in the Resend dashboard</li>
                  <li>Update your <code>.env.local</code> file with the new key</li>
                  <li>Restart your development server</li>
                </ul>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold mb-2">Email Deliverability Issues</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Check your spam folder</li>
                  <li>Verify domain configuration in Resend dashboard</li>
                  <li>Ensure your from email uses a properly verified domain</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 