'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PricingFeature {
  title: string;
  included: boolean;
}

interface PricingTierProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  highlighted?: boolean;
}

function PricingTier({ name, price, period, description, features, buttonText, highlighted }: PricingTierProps) {
  return (
    <div className={`pricing-tier ${highlighted ? 'popular' : ''}`}>
      {highlighted && (
        <div className="absolute top-0 left-0 right-0 bg-indigo-500 text-white text-center text-sm py-1 font-medium rounded-t-xl">
          Most Popular
        </div>
      )}
      
      <div className={`pricing-header ${highlighted ? 'pt-10' : ''}`}>
        <h3 className="text-2xl font-bold pricing-text mb-4">{name}</h3>
        <div className="mb-6">
          <span className="text-4xl font-bold pricing-text">{price}</span>
          <span className="pricing-secondary text-sm ml-1">{period}</span>
        </div>
        <p className="pricing-description mb-6">{description}</p>
      </div>
      
      <div className="pricing-features">
        <p className="font-medium pricing-label mb-4">What's included:</p>
        <ul className="space-y-3">
          {features.map((feature, featureIndex) => (
            <li key={featureIndex} className="flex items-start">
              {feature.included ? (
                <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-gray-400 dark:text-gray-600 mt-0.5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className={feature.included ? 'pricing-label' : 'pricing-muted'}>
                {feature.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-8">
        {buttonText === "Contact Sales" ? (
          <Link href="/contact/sales">
            <button 
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                highlighted 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {buttonText}
            </button>
          </Link>
        ) : (
          <button 
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              highlighted 
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  
  const tiers = [
    {
      name: "Basic",
      price: annual ? "Free" : "Free",
      period: "",
      description: "Perfect for getting started with study plan outlines.",
      features: [
        { title: "3 Study Plan Outlines", included: true },
        { title: "Basic Templates", included: true },
        { title: "Community Support", included: true },
        { title: "Detailed Plan Content", included: false },
        { title: "Analytics", included: false },
        { title: "Scheduling Features", included: false },
        { title: "AI-Powered Adaptations", included: false },
      ],
      buttonText: "Try It Free"
    },
    {
      name: "Pro",
      price: annual ? "$6" : "$8",
      period: annual ? "/month, billed annually" : "/month",
      description: "Advanced features for serious students.",
      features: [
        { title: "Unlimited Study Plans", included: true },
        { title: "Advanced Analytics", included: true },
        { title: "Smart Scheduling", included: true },
        { title: "Email Support", included: true },
        { title: "Resource Recommendations", included: true },
        { title: "AI-Powered Adaptations", included: true },
        { title: "Priority Support", included: false },
      ],
      buttonText: "Get Started",
      highlighted: true
    },
    {
      name: "Premium",
      price: annual ? "$8" : "$11",
      period: annual ? "/month, billed annually" : "/month",
      description: "The ultimate learning experience for maximum results.",
      features: [
        { title: "Unlimited Study Plans", included: true },
        { title: "Advanced Analytics with Insights", included: true },
        { title: "Smart Scheduling with Calendar Integration", included: true },
        { title: "Priority Email Support", included: true },
        { title: "Curated Resource Recommendations", included: true },
        { title: "Enhanced AI-Powered Adaptations", included: true },
        { title: "1-on-1 Study Coach Sessions", included: true },
      ],
      buttonText: "Get Premium"
    },
    {
      name: "Enterprise / Education",
      price: "Contact Sales",
      period: "",
      description: "Custom solutions for institutions and organizations.",
      features: [
        { title: "Unlimited Users & Study Plans", included: true },
        { title: "Centralized Administration", included: true },
        { title: "Custom Integration Options", included: true },
        { title: "Dedicated Account Manager", included: true },
        { title: "White-Label Options", included: true },
        { title: "Custom Analytics & Reporting", included: true },
        { title: "Bulk User Management", included: true },
      ],
      buttonText: "Contact Sales"
    }
  ];

  return (
    <section id="pricing" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that works best for your learning journey.
          </p>
          
          <div className="flex items-center justify-center mb-8">
            <span className={`mr-3 text-sm ${annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Annual</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                value="" 
                className="sr-only peer" 
                checked={!annual}
                onChange={() => setAnnual(!annual)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
            <span className={`ml-3 text-sm ${!annual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Monthly</span>
          </div>
          
          {annual && (
            <div className="text-sm text-indigo-600 font-medium">
              Save up to 25% with annual billing
            </div>
          )}
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <PricingTier 
              key={index} 
              name={tier.name}
              price={tier.price}
              period={tier.period}
              description={tier.description}
              features={tier.features}
              buttonText={tier.buttonText}
              highlighted={tier.highlighted}
            />
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-gray-500">
            Need a custom plan for your institution? 
            <Link href="/contact/sales" className="text-indigo-600 hover:text-indigo-800 ml-1 font-medium">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
} 