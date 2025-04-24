'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import WaitlistForm from '@/components/WaitlistForm';
import { initSmoothScroll } from '@/lib/smoothScroll';

export default function LandingPage() {
  useEffect(() => {
    // Initialize smooth scrolling
    initSmoothScroll();
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
                Your AI Study <span className="text-indigo-600">Partner</span> for Academic Success
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                SchedulEd creates personalized study plans tailored to your learning style, time availability, and knowledge level. Get ready to transform your learning experience.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a href="#waitlist" className="px-8 py-4 bg-indigo-600 text-white text-lg font-medium rounded-md hover:bg-indigo-700 transition text-center">
                  Join the Waitlist
                </a>
                <a href="#how-it-works" className="px-8 py-4 border border-gray-300 text-gray-700 text-lg font-medium rounded-md hover:bg-gray-50 transition text-center">
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white p-8 rounded-lg shadow-xl">
                <div className="relative w-full h-[400px]">
                  <Image 
                    src="https://placehold.co/600x400/e2e8f0/475569?text=Study+Plan+Preview" 
                    alt="SchedulEd Study Plan Example" 
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-indigo-100 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-600 rounded-full text-white">
                    <i className="fas fa-brain" aria-hidden="true"></i>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">AI-Powered</p>
                    <p className="text-sm text-gray-600">Learns as you learn</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="bg-white py-10">
          <div className="container mx-auto px-4">
            <p className="text-center text-gray-500 mb-8">Designed for students at all levels</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <span className="text-gray-400 text-xl font-medium">Middle School</span>
              <span className="text-gray-400 text-xl font-medium">High School</span>
              <span className="text-gray-400 text-xl font-medium">College</span>
              <span className="text-gray-400 text-xl font-medium">Graduate School</span>
              <span className="text-gray-400 text-xl font-medium">Professional Learning</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">Why Choose SchedulEd?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-brain text-2xl text-indigo-600" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Personalized Learning Paths</h3>
              <p className="text-gray-600">
                Study plans tailored to your learning style (visual, auditory, kinesthetic), time availability, and knowledge level.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-calendar-alt text-2xl text-indigo-600" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Smart Scheduling</h3>
              <p className="text-gray-600">
                Optimize your study time with intelligently scheduled sessions that match your availability and peak productivity hours.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-book-open text-2xl text-indigo-600" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Curated Resources</h3>
              <p className="text-gray-600">
                Access high-quality educational materials specifically chosen to match your learning style and subject matter.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-chart-line text-2xl text-indigo-600" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your learning journey with detailed progress reports and analytics to keep you motivated.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-bell text-2xl text-indigo-600" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Smart Reminders</h3>
              <p className="text-gray-600">
                Never miss a study session with timely reminders and calendar integration for upcoming study sessions.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-users text-2xl text-indigo-600" aria-hidden="true"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Privacy Focused</h3>
              <p className="text-gray-600">
                Enhanced protection for all users with special safeguards for students under 18, including parental controls.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="bg-indigo-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">How SchedulEd Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">1</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Create Your Profile</h3>
                <p className="text-gray-600">
                  Tell us about your learning style, time availability, and current knowledge level.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">2</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Select Your Subjects</h3>
                <p className="text-gray-600">
                  Choose what you want to learn and set your learning goals.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">3</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Receive Your Plan</h3>
                <p className="text-gray-600">
                  Our AI generates a personalized study plan optimized for your success.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">4</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Track & Adjust</h3>
                <p className="text-gray-600">
                  Follow your plan, track progress, and watch our AI adapt as you learn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials - Aspirational */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-16">What Students Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  <i className="fas fa-star" aria-hidden="true"></i>
                  <i className="fas fa-star" aria-hidden="true"></i>
                  <i className="fas fa-star" aria-hidden="true"></i>
                  <i className="fas fa-star" aria-hidden="true"></i>
                  <i className="fas fa-star" aria-hidden="true"></i>
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "As a visual learner, I've always struggled with traditional study methods. SchedulEd's personalized approach has completely transformed how I prepare for exams."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium text-gray-800">Alex J.</p>
                  <p className="text-sm text-gray-500">College Student</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  <i className="fas fa-star" aria-hidden="true"></i>
                  <i className="fas fa-star" aria-hidden="true"></i>
                  <i className="fas fa-star" aria-hidden="true"></i>
                  <i className="fas fa-star" aria-hidden="true"></i>
                  <i className="fas fa-star" aria-hidden="true"></i>
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "The smart scheduling feature has been a game-changer for me. I'm a busy parent and student, and SchedulEd helps me make the most of my limited study time."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium text-gray-800">Taylor M.</p>
                  <p className="text-sm text-gray-500">Graduate Student</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 flex">
                  <i className="fas fa-star" aria-hidden="true"></i>
                  <i className="fas fa-star" aria-hidden="true"></i>
                  <i className="fas fa-star" aria-hidden="true"></i>
                  <i className="fas fa-star" aria-hidden="true"></i>
                  <i className="fas fa-star" aria-hidden="true"></i>
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "As a high school teacher, I've recommended SchedulEd to my students preparing for college entrance exams. The results have been incredible."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-100 rounded-full mr-4"></div>
                <div>
                  <p className="font-medium text-gray-800">Jamie R.</p>
                  <p className="text-sm text-gray-500">High School Teacher</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist Signup Section */}
        <section id="waitlist" className="bg-indigo-600 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Join the SchedulEd Waitlist</h2>
              <p className="text-xl text-indigo-100 mb-10">
                Be the first to get access when we launch. We're currently in the final stages of development and will be inviting users in soon.
              </p>
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">SchedulEd</h3>
              <p className="mb-4">
                AI-powered study plan generator creating personalized learning paths tailored to individual learning styles.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-twitter" aria-hidden="true"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-instagram" aria-hidden="true"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-linkedin" aria-hidden="true"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Features</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Personalized Study Plans</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Resource Recommendations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Progress Tracking</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Learning Style Adaptation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-medium text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Youth Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} SchedulEd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 