'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-6">Last Updated: April 7, 2025</p>
        
        <div className="terms-content">
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
          <p className="mb-4">Welcome to AIStudyPlans.com ("we," "our," or "us"). By accessing or using our website, mobile applications, or any other features, technologies, or functionalities offered by us on our website, through any platform, device, or interface (collectively, the "Services"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Services.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Changes to Terms</h2>
          <p className="mb-4">We reserve the right to modify these Terms of Service at any time. We will provide notice of any material changes by updating the "Last Updated" date at the top of this page. Your continued use of the Services after any such changes constitutes acceptance of the revised terms.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. User Accounts</h2>
          <p className="mb-4">To access certain features of our Services, you may need to create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. User Content</h2>
          <p className="mb-2">Our Services allow you to create study plans and store educational content ("User Content"). You retain all rights to your User Content, but you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute such content in connection with providing our Services.</p>
          
          <p className="mb-2">You represent and warrant that:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>You own or have the necessary rights to your User Content</li>
            <li>Your User Content does not violate the rights of any third party</li>
            <li>Your User Content complies with these Terms and all applicable laws</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Prohibited Activities</h2>
          <p className="mb-2">You agree not to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Use the Services for any illegal purpose</li>
            <li>Violate any laws in your jurisdiction</li>
            <li>Infringe upon the rights of others</li>
            <li>Share inappropriate content, including content that is harmful, threatening, abusive, harassing, defamatory, or pornographic</li>
            <li>Attempt to gain unauthorized access to our systems or user accounts</li>
            <li>Use the Services to distribute malware or other harmful code</li>
            <li>Interfere with or disrupt the Services or servers</li>
            <li>Impersonate any person or entity</li>
            <li>Collect or store personal data about other users without their consent</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Intellectual Property Rights</h2>
          <p className="mb-4">The Services and their content, features, and functionality are owned by AIStudyPlans.com and are protected by copyright, trademark, and other intellectual property laws. You may not use our trademarks, logos, or service marks without our prior written consent.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Subscription Services</h2>
          <p className="mb-2">Some of our Services require payment of fees for access to premium features ("Premium Services"). If you subscribe to our Premium Services:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>You agree to pay all applicable fees and taxes</li>
            <li>Your subscription will automatically renew unless you cancel it</li>
            <li>You authorize us to charge your payment method for subscription fees</li>
            <li>Fees are non-refundable except as required by law or expressly stated in our refund policy</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Termination</h2>
          <p className="mb-4">We reserve the right to terminate or suspend your account and access to the Services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Services, us, or third parties, or for any other reason.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Disclaimers</h2>
          <p className="mb-4">THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
          
          <p className="mb-2">We do not guarantee that:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>The Services will meet your requirements</li>
            <li>The Services will be uninterrupted, timely, secure, or error-free</li>
            <li>The results obtained from using the Services will be accurate or reliable</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">10. Limitation of Liability</h2>
          <p className="mb-4">TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL AISTUDYPLANS.COM, ITS AFFILIATES, OR THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF OR RELATING TO THE USE OF OR INABILITY TO USE THE SERVICES.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">11. Indemnification</h2>
          <p className="mb-4">You agree to indemnify, defend, and hold harmless AIStudyPlans.com and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys' fees and costs, arising out of or in any way connected with your access to or use of the Services or your violation of these Terms.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">12. Governing Law</h2>
          <p className="mb-4">These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles. Any dispute arising from these Terms shall be resolved exclusively in the state or federal courts located in San Francisco County, California.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">13. Severability</h2>
          <p className="mb-4">If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced to the fullest extent under law.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">14. Contact Information</h2>
          <p className="mb-1">If you have any questions about these Terms, please contact us at:</p>
          <p className="mb-8">
            AIStudyPlans.com<br />
            <a href="mailto:legal@aistudyplans.com" className="text-blue-600">legal@aistudyplans.com</a>
          </p>
          
          <div className="mt-8 flex justify-center">
            <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 