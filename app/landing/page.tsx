"use client";

import { useEffect } from "react";
import Header from "@/app/components/Header";
import { initSmoothScroll } from "@/lib/smoothScroll";
import InteractiveStudyPlanDemo from "@/components/InteractiveStudyPlanDemo";
import HeroSection from "@/app/components/landing/HeroSection";
import SocialProofSection from "@/app/components/landing/SocialProofSection";
import FeaturesSection from "@/app/components/landing/FeaturesSection";
import HowItWorksSection from "@/app/components/landing/HowItWorksSection";
import WaitlistSection from "@/app/components/landing/WaitlistSection";
import FooterSection from "@/app/components/landing/FooterSection";

/**
 * Main landing page component
 * Orchestrates all landing page sections in a cohesive layout
 */
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
        <HeroSection />

        {/* Social Proof */}
        <SocialProofSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* How It Works */}
        <HowItWorksSection />

        {/* Interactive Study Plan Demo */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              See SchedulEd in Action
            </h2>
            <p className="text-xl text-gray-600">
              Experience how our AI creates personalized study plans tailored to your needs
            </p>
          </div>
          <InteractiveStudyPlanDemo />
        </section>

        {/* Waitlist Section */}
        <WaitlistSection />
      </main>

      <FooterSection />
    </div>
  );
}
