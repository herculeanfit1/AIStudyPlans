'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState<string>('general');
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
        <p className="text-gray-500 mb-6">Last Updated: April 7, 2025</p>
        
        <div className="flex border-b mb-6">
          <button 
            className={`py-2 px-4 font-medium ${activeTab === 'general' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('general')}
          >
            General Policy
          </button>
          <button 
            className={`py-2 px-4 font-medium ${activeTab === 'minors' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('minors')}
            id="minors"
          >
            Children's Privacy
          </button>
        </div>
        
        {activeTab === 'general' && (
          <div className="privacy-content">
            <h2 className="text-xl font-semibold mt-6 mb-3">Introduction</h2>
            <p className="mb-4">AIStudyPlans.com ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Information We Collect</h2>
            <p className="mb-2">We collect information that you provide directly to us when you:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Register for an account</li>
              <li>Create or modify your profile</li>
              <li>Create and save study plans</li>
              <li>Participate in surveys or provide feedback</li>
              <li>Contact customer support</li>
              <li>Subscribe to our premium services</li>
            </ul>
            
            <p className="mb-2">This information may include:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Name and email address</li>
              <li>Age range and educational level</li>
              <li>Learning preferences and goals</li>
              <li>Content of study plans you create</li>
              <li>Payment information (for premium subscribers)</li>
              <li>Usage data and interaction with our platform</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Provide, maintain, and improve our services</li>
              <li>Create personalized study plans based on your preferences</li>
              <li>Process transactions and send related information</li>
              <li>Send transactional emails, service updates, and promotional messages</li>
              <li>Respond to comments, questions, and customer service requests</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Protect the security and integrity of our services</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Data Sharing and Disclosure</h2>
            <p className="mb-2">We do not sell your personal information. We may share your information in the following circumstances:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>With service providers who perform services on our behalf</li>
              <li>To comply with legal obligations</li>
              <li>To protect and defend our rights and property</li>
              <li>With your consent or at your direction</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Data Protection</h2>
            <p className="mb-4">We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Despite our efforts, no security measures are perfect, and we cannot guarantee the security of your information.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Your Rights</h2>
            <p className="mb-2">Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate data</li>
              <li>Deletion of your personal information</li>
              <li>Data portability</li>
              <li>Restriction of processing</li>
              <li>Objection to processing</li>
            </ul>
            <p className="mb-4">To exercise these rights, please contact us at privacy@aistudyplans.com.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Children's Privacy</h2>
            <p className="mb-4">Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we learn we have collected personal information from a child under 13, we will delete that information. For users between 13-17 years old, please review our <button className="text-blue-600 underline" onClick={() => setActiveTab('minors')}>Youth Privacy Policy</button>.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Changes to This Privacy Policy</h2>
            <p className="mb-4">We may update this privacy policy from time to time. The updated version will be indicated by an updated "Last Updated" date. We encourage you to review this privacy policy periodically to stay informed about how we protect your information.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Contact Us</h2>
            <p className="mb-1">If you have any questions or concerns about this privacy policy, please contact us at:</p>
            <p className="mb-4">
              AIStudyPlans.com<br />
              <a href="mailto:privacy@aistudyplans.com" className="text-blue-600">privacy@aistudyplans.com</a>
            </p>
          </div>
        )}
        
        {activeTab === 'minors' && (
          <div className="minors-privacy-content">
            <h2 className="text-2xl font-bold mb-3">Privacy Policy for Youth Users (Ages 13-17)</h2>
            <p className="text-gray-500 mb-6">Last Updated: April 7, 2025</p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
              <h5 className="font-semibold mb-2">For Parents and Guardians</h5>
              <p>This policy explains how AI Study Plans collects, uses, and protects data from users between 13-17 years old. We're committed to protecting your child's privacy while providing educational services.</p>
            </div>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">1. Our Commitment to Youth Privacy</h3>
            <p className="mb-4">AI Study Plans is designed for users aged 13 and older. We are committed to complying with laws protecting minors online, including the Children's Online Privacy Protection Act (COPPA) and other applicable privacy regulations. This policy specifically addresses how we handle information from users between 13-17 years old.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">2. Information We Collect from Youth Users</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold mb-2">Basic Account Information</h4>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>First and last name</li>
                <li>Email address</li>
                <li>School level (middle school, high school)</li>
                <li>Password (securely stored)</li>
                <li>Optional: Learning goals and preferences</li>
                <li>Optional: Zip code (for local resource recommendations)</li>
              </ul>
              
              <h4 className="font-semibold mb-2">Usage Information</h4>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Study plans created</li>
                <li>Learning style preferences</li>
                <li>Progress through study materials</li>
                <li>Time spent on various learning activities</li>
                <li>Device type and browser information</li>
              </ul>
            </div>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">3. How We Use Youth Information</h3>
            <p className="mb-2">We use information collected from youth users only to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Create and maintain their account</li>
              <li>Provide personalized study plans and educational content</li>
              <li>Recommend local educational resources (based on zip code)</li>
              <li>Improve our educational services</li>
              <li>Track progress through learning materials</li>
              <li>Send email notifications about study plans and progress (to parent-approved email addresses)</li>
            </ul>
            <p className="mb-2 font-medium">We <span className="font-bold">never</span> use youth data for:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Marketing or advertising unrelated to educational content</li>
              <li>Selling to third parties</li>
              <li>Creating public profiles visible to strangers</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">4. Parental/Guardian Involvement</h3>
            <p className="mb-2">For users under 18, we encourage parents or guardians to:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Create the account on behalf of the youth user</li>
              <li>Review our full privacy policy and terms of service</li>
              <li>Monitor the youth's use of AI Study Plans</li>
              <li>Review study plans created by the youth user</li>
            </ul>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-6 mt-4">
              <h4 className="font-semibold mb-2">Parental Control Options</h4>
              <p className="mb-2">Parents/guardians of users under 18 can:</p>
              <ul className="list-disc pl-6 mb-2 space-y-1">
                <li>Request to review any personal information we have collected from their child</li>
                <li>Request deletion of their child's account and associated data</li>
                <li>Revoke consent for continued collection or use of their child's data</li>
              </ul>
              <p>To exercise these rights, please contact us at <a href="mailto:privacy@aistudyplans.com" className="text-blue-600">privacy@aistudyplans.com</a></p>
            </div>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">5. Safety Measures for Youth Users</h3>
            <p className="mb-2">To protect our youth users, we implement the following safety measures:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Youth accounts (under 18) are automatically set to private</li>
              <li>Profile pictures are not allowed for users under 18</li>
              <li>Youth users cannot share study plans publicly</li>
              <li>All content is filtered for age-appropriateness based on school level</li>
              <li>Private messaging features are not available to youth users</li>
              <li>Local resource recommendations are limited to established educational institutions</li>
            </ul>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">6. Data Retention and Deletion</h3>
            <p className="mb-4">We store youth user data only as long as necessary to provide our educational services or as required by law. Parents/guardians can request the deletion of their child's data at any time by contacting us at <a href="mailto:privacy@aistudyplans.com" className="text-blue-600">privacy@aistudyplans.com</a>.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">7. Third-Party Services</h3>
            <p className="mb-2">We use certain third-party services to support our platform:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Google OAuth for account authentication (optional)</li>
              <li>Microsoft OAuth for account authentication (optional)</li>
              <li>Stripe for payment processing (handled by parents/guardians)</li>
            </ul>
            <p className="mb-4">These services receive limited data necessary for their specific function and are bound by their own privacy policies and our data processing agreements.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">8. US-Only Availability</h3>
            <p className="mb-4">AI Study Plans is currently available only to users located in the United States. This helps us ensure compliance with US privacy laws regarding minors.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">9. Changes to This Policy</h3>
            <p className="mb-4">If we make material changes to how we collect, use, or share youth user data, we will notify parents/guardians via email and require renewed consent where applicable.</p>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">10. Contact Us</h3>
            <p className="mb-2">If you have questions or concerns about our youth privacy practices, please contact us at:</p>
            <address className="mb-6 not-italic">
              <strong>AI Study Plans Privacy Team</strong><br />
              <a href="mailto:privacy@aistudyplans.com" className="text-blue-600">privacy@aistudyplans.com</a><br />
              1-800-PRIVACY<br />
              123 Education Lane<br />
              Learning City, CA 94000
            </address>
            
            <div className="flex space-x-4 mt-8">
              <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                Return to Home
              </Link>
              <button onClick={() => setActiveTab('general')} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition">
                Back to General Policy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 