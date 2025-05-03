'use client';

import React from 'react';
import Link from 'next/link';
import { FaShield, FaLock, FaClipboardCheck, FaEnvelope } from 'react-icons/fa6';

export default function ParentsPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">For Parents & Guardians</h1>
        <p className="text-gray-600 mb-6">Information about how we protect children's privacy and safety</p>

        <div className="mb-10">
          <p className="text-lg mb-4">
            At AI Study Plans, we're committed to providing a safe, secure, and educational experience for students of all ages. This page provides information specifically for parents and guardians about how we protect minors who use our platform.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md my-6">
            <h3 className="font-semibold text-blue-800 mb-2">Safety is our priority</h3>
            <p>
              We've designed our platform with comprehensive safety measures for users under 18, in compliance with the Children's Online Privacy Protection Act (COPPA) and other applicable regulations.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="border rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <FaShield className="text-blue-600 text-2xl mr-3" />
              <h2 className="text-xl font-semibold">How We Protect Minors</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>Accounts for users under 18 are set to private by default</li>
              <li>Profile pictures are disabled for users under 18</li>
              <li>No public sharing of study plans for youth users</li>
              <li>Age-appropriate content filtering based on educational level</li>
              <li>No private messaging between users</li>
              <li>Limited collection of personal information</li>
              <li>No targeting of advertisements to minors</li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-6 shadow-sm">
            <div className="flex items-center mb-4">
              <FaLock className="text-blue-600 text-2xl mr-3" />
              <h2 className="text-xl font-semibold">Parental Control Options</h2>
            </div>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create and manage your child's account</li>
              <li>Review all study plans created by your child</li>
              <li>Request access to all data associated with your child's account</li>
              <li>Request deletion of your child's account and all associated data</li>
              <li>Update or modify personal information</li>
              <li>Revoke consent for continued use of the platform</li>
              <li>Set time limits and usage restrictions (coming soon)</li>
            </ul>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Recommended Parental Involvement</h2>
          <p className="mb-4">
            While we've implemented numerous safety features, we recommend that parents remain actively involved in their child's use of AI Study Plans:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <FaClipboardCheck className="text-green-600 text-xl mr-2" />
                <h3 className="font-semibold">Set Up Together</h3>
              </div>
              <p>Create your child's account together and explain the platform's purpose and limitations. Review privacy settings and preferences as a team.</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <FaClipboardCheck className="text-green-600 text-xl mr-2" />
                <h3 className="font-semibold">Periodic Review</h3>
              </div>
              <p>Regularly review your child's study plans and progress. This helps you stay informed about their learning goals and provides an opportunity for discussion.</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <FaClipboardCheck className="text-green-600 text-xl mr-2" />
                <h3 className="font-semibold">Open Communication</h3>
              </div>
              <p>Maintain open communication about online safety. Encourage your child to tell you if they encounter any concerning content or interactions.</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-3">
                <FaClipboardCheck className="text-green-600 text-xl mr-2" />
                <h3 className="font-semibold">Educational Context</h3>
              </div>
              <p>Provide context for AI-generated content. Discuss the study plans with your child and help them understand how to effectively use them.</p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Detailed Privacy Information</h2>
          <p className="mb-4">
            For complete details about how we handle privacy for users under 18, please review our:
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/privacy#minors" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Children's Privacy Policy
            </Link>
            <Link href="/terms" className="inline-block px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
              Terms of Service
            </Link>
          </div>
        </div>

        <div className="border-t pt-8 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Our Privacy Team</h2>
          <p className="mb-4">If you have questions or concerns about your child's privacy or how our platform works, please don't hesitate to contact us:</p>
          
          <div className="flex items-center text-blue-600">
            <FaEnvelope className="mr-2" />
            <a href="mailto:privacy@aistudyplans.com" className="hover:underline">privacy@aistudyplans.com</a>
          </div>
          
          <p className="mt-6 text-sm text-gray-500">
            We typically respond to all privacy inquiries within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
} 