'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About AI Study Plans</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Revolutionizing education through personalized, AI-powered learning solutions
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            At AI Study Plans, we believe that every student deserves a learning experience tailored to their unique needs, 
            goals, and learning style. Our mission is to democratize access to personalized education by leveraging the 
            power of artificial intelligence.
          </p>
          <p className="text-gray-700 mb-4">
            We're committed to helping students at all levels—from high school to university and beyond—achieve academic 
            success through customized study plans that adapt to their individual learning journey.
          </p>
          <p className="text-gray-700">
            By combining advanced AI technology with educational expertise, we're creating a future where education is 
            more effective, accessible, and enjoyable for everyone.
          </p>
        </div>
        <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center">
          {/* Placeholder for image - replace with actual company image */}
          <div className="text-center p-4">
            <svg className="w-24 h-24 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <p className="text-gray-600">Company Image</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-8 mb-20">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Core Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Personalization</h3>
            <p className="text-gray-700">
              We believe that effective learning must be tailored to each individual's unique needs, goals, and learning styles. 
              One-size-fits-all approaches don't work in education.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
            <p className="text-gray-700">
              We're committed to making high-quality educational resources available to all students, regardless of their 
              background, location, or financial situation.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Continuous Improvement</h3>
            <p className="text-gray-700">
              We constantly refine our algorithms, expand our knowledge base, and incorporate feedback to provide an 
              increasingly effective learning experience.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Our Story</h2>
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-16 h-16 flex items-center justify-center mb-2">2021</div>
              <div className="h-full w-1 bg-blue-100 hidden md:block"></div>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-xl font-semibold mb-3">The Beginning</h3>
              <p className="text-gray-700">
                AI Study Plans was founded by a group of educators, technologists, and AI researchers who recognized the potential 
                for artificial intelligence to revolutionize education. Frustrated by the one-size-fits-all approach of traditional 
                education systems, our team set out to create a platform that could adapt to each student's unique learning needs.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-16 h-16 flex items-center justify-center mb-2">2022</div>
              <div className="h-full w-1 bg-blue-100 hidden md:block"></div>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-xl font-semibold mb-3">Building the Platform</h3>
              <p className="text-gray-700">
                After months of research and development, we launched the beta version of our platform. Working closely with 
                educators and early users, we refined our algorithms and expanded our content library to cover a broad range 
                of subjects and educational levels.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-16 h-16 flex items-center justify-center mb-2">2023</div>
              <div className="h-full w-1 bg-blue-100 hidden md:block"></div>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-xl font-semibold mb-3">Expansion and Growth</h3>
              <p className="text-gray-700">
                Our platform began gaining recognition for its effectiveness. We partnered with schools and universities to 
                bring personalized learning to more students. During this period, we expanded our team and introduced new 
                features like concept mastery tracking and advanced progress analytics.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4 flex flex-col items-center">
              <div className="bg-blue-100 text-blue-800 font-bold rounded-full w-16 h-16 flex items-center justify-center">2025</div>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-xl font-semibold mb-3">Today and Beyond</h3>
              <p className="text-gray-700">
                Today, AI Study Plans serves thousands of students worldwide. We continue to innovate and improve our platform, 
                incorporating the latest advancements in AI and educational research. Our vision for the future includes expanding 
                our subject coverage, developing more sophisticated personalization algorithms, and making our platform even more 
                accessible to learners everywhere.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>
        <p className="text-center text-gray-700 mb-10 max-w-3xl mx-auto">
          AI Study Plans is built by a dedicated team of educators, AI specialists, learning scientists, 
          and technologists passionate about transforming education.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="bg-gray-300 rounded-full w-24 h-24 mx-auto mb-4"></div>
            <h3 className="font-semibold">Dr. Sarah Chen</h3>
            <p className="text-gray-600 text-sm">Founder & CEO</p>
          </div>
          <div>
            <div className="bg-gray-300 rounded-full w-24 h-24 mx-auto mb-4"></div>
            <h3 className="font-semibold">Michael Rodriguez</h3>
            <p className="text-gray-600 text-sm">Chief Technology Officer</p>
          </div>
          <div>
            <div className="bg-gray-300 rounded-full w-24 h-24 mx-auto mb-4"></div>
            <h3 className="font-semibold">Dr. James Wilson</h3>
            <p className="text-gray-600 text-sm">Head of Education</p>
          </div>
          <div>
            <div className="bg-gray-300 rounded-full w-24 h-24 mx-auto mb-4"></div>
            <h3 className="font-semibold">Aisha Patel</h3>
            <p className="text-gray-600 text-sm">AI Research Lead</p>
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
            Get Started
          </Link>
          <Link href="/contact" className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
} 