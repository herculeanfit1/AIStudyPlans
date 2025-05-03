'use client';

import React from 'react';
import Link from 'next/link';
import { FaRocket, FaRegLightbulb, FaChalkboardTeacher, FaBrain } from 'react-icons/fa';

export default function ServicesPage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Personalized AI-powered study plans and learning resources tailored to your educational goals
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaRocket className="text-blue-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold">Personalized Study Plans</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Our core offering provides custom study plans based on your learning style, goals, and schedule. 
            We analyze your needs and create a structured approach to help you achieve your academic objectives.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>Customized learning paths for any subject</li>
            <li>Adapts to your learning pace and style</li>
            <li>Optimized scheduling based on your availability</li>
            <li>Regular progress assessments and plan adjustments</li>
            <li>Comprehensive resource recommendations</li>
          </ul>
          <Link href="/pricing" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium">
            View Plans
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <FaRegLightbulb className="text-purple-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold">Concept Mastery</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Struggling with specific concepts? Our Concept Mastery service identifies knowledge gaps and creates targeted 
            learning materials to help you overcome challenging topics across any subject.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>Detailed explanation of complex concepts</li>
            <li>Simplified breakdowns with real-world examples</li>
            <li>Interactive practice exercises</li>
            <li>Visual learning aids and concept maps</li>
            <li>Mastery verification through targeted assessments</li>
          </ul>
          <Link href="/pricing" className="inline-block px-6 py-2.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition font-medium">
            Learn More
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FaChalkboardTeacher className="text-green-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold">Exam Preparation</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Facing an important test? Our Exam Preparation service creates a structured study plan with practice tests, 
            review materials, and targeted strategies designed specifically for your upcoming exam.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>Comprehensive exam-specific study plans</li>
            <li>Practice tests with detailed feedback</li>
            <li>Strategic review of high-value content</li>
            <li>Time management and test-taking strategies</li>
            <li>Performance tracking and weak area identification</li>
          </ul>
          <Link href="/pricing" className="inline-block px-6 py-2.5 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium">
            Prepare Now
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center mb-6">
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <FaBrain className="text-yellow-600 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold">Learning Style Optimization</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Everyone learns differently. Our Learning Style Optimization analyzes your unique learning preferences and 
            creates a personalized approach that maximizes retention and understanding.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
            <li>Comprehensive learning style assessment</li>
            <li>Custom-formatted study materials</li>
            <li>Format-specific learning resources</li>
            <li>Memory and retention techniques</li>
            <li>Ongoing style refinement based on performance</li>
          </ul>
          <Link href="/pricing" className="inline-block px-6 py-2.5 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition font-medium">
            Discover Your Style
          </Link>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-8 shadow-sm mb-16">
        <h2 className="text-2xl font-bold mb-4">How Our Service Works</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-10 h-10 flex items-center justify-center rounded-full mb-3">
              <span className="font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-semibold mb-2">Tell Us Your Goals</h3>
            <p className="text-gray-700">Share your learning objectives, timeline, and current knowledge level.</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-10 h-10 flex items-center justify-center rounded-full mb-3">
              <span className="font-bold text-blue-600">2</span>
            </div>
            <h3 className="font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-700">Our AI analyzes your needs and creates a tailored learning approach.</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-10 h-10 flex items-center justify-center rounded-full mb-3">
              <span className="font-bold text-blue-600">3</span>
            </div>
            <h3 className="font-semibold mb-2">Get Your Plan</h3>
            <p className="text-gray-700">Receive a comprehensive, personalized study plan and resources.</p>
          </div>
          
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-10 h-10 flex items-center justify-center rounded-full mb-3">
              <span className="font-bold text-blue-600">4</span>
            </div>
            <h3 className="font-semibold mb-2">Track & Adjust</h3>
            <p className="text-gray-700">Monitor progress and receive adjustments as you learn and grow.</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to transform your learning experience?</h2>
        <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
          Join thousands of students who have improved their academic performance with AI Study Plans.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/pricing" className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium">
            View Pricing
          </Link>
          <Link href="/contact" className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
} 