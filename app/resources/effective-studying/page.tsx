'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Components
const ResourceCard = ({ title, description, icon }: { title: string; description: string; icon: string }) => (
  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 border border-gray-100">
    <div className="flex items-center mb-4">
      <div className="p-2 bg-indigo-100 rounded-full mr-4">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default function EffectiveStudyingPage() {
  // State for interactive elements
  const [activeTab, setActiveTab] = useState('pomodoro');
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  // Tabs content
  const tabContent = {
    pomodoro: {
      title: "The Pomodoro Technique",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            The Pomodoro Technique is a time management method that uses a timer to break work into intervals, traditionally 25 minutes in length, separated by short breaks.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg mt-4">
            <h4 className="font-medium text-gray-800 mb-3">Customize Your Pomodoro Timer</h4>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Work Duration (minutes)
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  value={pomodoroMinutes}
                  onChange={(e) => setPomodoroMinutes(parseInt(e.target.value))}
                  className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="block text-center text-sm font-medium mt-1">{pomodoroMinutes} minutes</span>
              </div>
              <div className="w-full sm:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Break Duration (minutes)
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(parseInt(e.target.value))}
                  className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="block text-center text-sm font-medium mt-1">{breakMinutes} minutes</span>
              </div>
            </div>
            <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200">
              Download Your Custom Pomodoro Schedule
            </button>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium text-gray-800 mb-2">Steps to Follow:</h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Choose a task to work on</li>
              <li>Set your timer for {pomodoroMinutes} minutes</li>
              <li>Work on the task until the timer rings</li>
              <li>Take a short break ({breakMinutes} minutes)</li>
              <li>After 4 pomodoros, take a longer break (15-30 minutes)</li>
            </ol>
          </div>
        </div>
      )
    },
    spaced: {
      title: "Spaced Repetition",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Spaced repetition is a learning technique that involves reviewing information at increasing intervals. It's one of the most effective methods for long-term retention.
          </p>
          
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Interval</th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">When to Review</th>
                  <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benefits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-4 text-sm text-gray-700">First review</td>
                  <td className="py-4 px-4 text-sm text-gray-700">Within 24 hours of learning</td>
                  <td className="py-4 px-4 text-sm text-gray-700">Initial retention</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-sm text-gray-700">Second review</td>
                  <td className="py-4 px-4 text-sm text-gray-700">3 days after first review</td>
                  <td className="py-4 px-4 text-sm text-gray-700">Strengthens neural pathways</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-sm text-gray-700">Third review</td>
                  <td className="py-4 px-4 text-sm text-gray-700">1 week after second review</td>
                  <td className="py-4 px-4 text-sm text-gray-700">Long-term memory encoding</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-sm text-gray-700">Fourth review</td>
                  <td className="py-4 px-4 text-sm text-gray-700">2 weeks after third review</td>
                  <td className="py-4 px-4 text-sm text-gray-700">Near-permanent retention</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4">
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200">
              Download Spaced Repetition Calendar Template
            </button>
          </div>
        </div>
      )
    },
    active: {
      title: "Active Learning Strategies",
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Active learning involves engaging with the material through meaningful activities rather than passively consuming information. These techniques increase comprehension and retention.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-indigo-50 p-4 rounded-md">
              <h4 className="font-medium text-indigo-800 mb-2">Feynman Technique</h4>
              <p className="text-gray-700 text-sm">Explain a concept in simple terms as if teaching someone else. This identifies gaps in your understanding.</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-md">
              <h4 className="font-medium text-indigo-800 mb-2">Mind Mapping</h4>
              <p className="text-gray-700 text-sm">Create visual diagrams that connect concepts and ideas, helping to organize information spatially.</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-md">
              <h4 className="font-medium text-indigo-800 mb-2">Practice Testing</h4>
              <p className="text-gray-700 text-sm">Create and take practice tests to strengthen retrieval pathways and identify weak areas.</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-md">
              <h4 className="font-medium text-indigo-800 mb-2">Teach Others</h4>
              <p className="text-gray-700 text-sm">Explaining concepts to others reinforces your own understanding and highlights areas needing review.</p>
            </div>
          </div>
          
          <div className="mt-4 bg-white border border-gray-200 rounded-md p-4">
            <h4 className="font-medium text-gray-800 mb-2">Try It: The Feynman Technique</h4>
            <p className="text-gray-600 text-sm mb-3">Pick a concept you're studying and try to explain it in simple terms below:</p>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              rows={4}
              placeholder="Explain the concept here in simple terms..."
            ></textarea>
            <p className="text-gray-600 text-sm mt-2">Notice any gaps in your explanation? Those are areas to review!</p>
          </div>
        </div>
      )
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6">
            <Image 
              src="/SchedulEd_new_logo.png" 
              alt="AIStudyPlans Logo" 
              width={180} 
              height={48} 
            />
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Effective Studying Techniques</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Science-backed methods to improve your study efficiency, retention, and overall learning experience.
          </p>
        </div>
        
        {/* Main content */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Hero section */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">Transform Your Study Routine</h2>
              <p className="text-lg mb-6">
                Effective studying isn't about studying harder—it's about studying smarter. These evidence-based techniques can help you maximize your learning while minimizing burnout.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-white text-indigo-700 px-4 py-2 rounded-md font-medium hover:bg-indigo-50 transition">
                  Download Study Planner
                </button>
                <button className="bg-indigo-800 text-white px-4 py-2 rounded-md font-medium hover:bg-indigo-900 transition">
                  Take Study Style Quiz
                </button>
              </div>
            </div>
          </div>
          
          {/* Quick facts */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-indigo-600 mb-2">2-3x</p>
              <p className="text-gray-600">Increased retention when using spaced repetition</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-indigo-600 mb-2">25%</p>
              <p className="text-gray-600">More productive with the Pomodoro Technique</p>
            </div>
            <div className="p-6 text-center">
              <p className="text-4xl font-bold text-indigo-600 mb-2">90%</p>
              <p className="text-gray-600">Information retention when teaching others</p>
            </div>
          </div>
          
          {/* Technique tabs */}
          <div className="p-6 md:p-8 lg:p-10">
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                <button
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pomodoro'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } transition`}
                  onClick={() => setActiveTab('pomodoro')}
                >
                  Pomodoro Technique
                </button>
                <button
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'spaced'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } transition`}
                  onClick={() => setActiveTab('spaced')}
                >
                  Spaced Repetition
                </button>
                <button
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'active'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } transition`}
                  onClick={() => setActiveTab('active')}
                >
                  Active Learning
                </button>
              </nav>
            </div>
            
            {/* Tab content */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{tabContent[activeTab as keyof typeof tabContent].title}</h3>
              {tabContent[activeTab as keyof typeof tabContent].content}
            </div>
          </div>
          
          {/* Additional resources section */}
          <div className="bg-gray-50 p-6 md:p-8 lg:p-10 border-t border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResourceCard 
                title="Study Environment Optimization" 
                description="Create the perfect study space with these research-backed tips for lighting, sound, and organization."
                icon="🏠"
              />
              <ResourceCard 
                title="Memory Enhancement Techniques" 
                description="Learn mnemonic devices, visualization strategies, and other memory boosters for better recall."
                icon="🧠"
              />
              <ResourceCard 
                title="Digital Tools for Students" 
                description="Discover apps and software that can streamline your studying process and improve productivity."
                icon="💻"
              />
            </div>
          </div>
          
          {/* Newsletter signup */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 md:p-12">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Get Weekly Study Tips</h3>
              <p className="mb-6">
                Join our newsletter to receive the latest research-backed study techniques, productivity tips, and exclusive templates.
              </p>
              
              {isSubscribed ? (
                <div className="bg-white/20 p-4 rounded-md inline-block">
                  <p className="font-medium">
                    Thank you for subscribing! Check your email to confirm.
                  </p>
                </div>
              ) : (
                <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" onSubmit={(e) => {
                  e.preventDefault();
                  setIsSubscribed(true);
                }}>
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-1 px-4 py-2 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    required 
                  />
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-indigo-800 text-white rounded-md font-medium hover:bg-indigo-900 transition"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* Related resources */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/resources/time-management" className="block">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 border border-gray-100 h-full flex flex-col">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Time Management for Students</h4>
                <p className="text-gray-600 mb-4 flex-grow">
                  Master your schedule with proven time management techniques specifically designed for academic success.
                </p>
                <span className="text-indigo-600 font-medium flex items-center">
                  Read more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </Link>
            <Link href="/dashboard" className="block">
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 border border-gray-100 h-full flex flex-col">
                <h4 className="text-xl font-semibold text-gray-800 mb-2">Your Personalized Study Plan</h4>
                <p className="text-gray-600 mb-4 flex-grow">
                  Get a custom AI-generated study plan tailored to your learning style, goals, and schedule.
                </p>
                <span className="text-indigo-600 font-medium flex items-center">
                  Create your plan
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Image 
                src="/SchedulEd_new_logo.png" 
                alt="AIStudyPlans Logo" 
                width={120} 
                height={32} 
              />
            </div>
            <div className="flex space-x-6">
              <Link href="/" className="text-gray-500 hover:text-gray-900">
                Home
              </Link>
              <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/resources/time-management" className="text-gray-500 hover:text-gray-900">
                Time Management
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} AIStudyPlans. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
} 