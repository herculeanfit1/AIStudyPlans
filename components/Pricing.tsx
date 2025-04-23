import React from 'react';

interface PricingFeature {
  title: string;
  included: boolean;
}

interface PricingTierProps {
  name: string;
  price: string;
  description: string;
  features: PricingFeature[];
  popularPlan?: boolean;
  ctaText: string;
}

const PricingTier: React.FC<PricingTierProps> = ({ 
  name, 
  price, 
  description, 
  features, 
  popularPlan = false,
  ctaText 
}) => {
  return (
    <div className={`
      rounded-2xl p-8 h-full flex flex-col
      ${popularPlan 
        ? 'bg-blue-600 text-white ring-4 ring-blue-500 shadow-xl' 
        : 'bg-white text-gray-900 border border-gray-200'
      }
    `}>
      <div className="mb-6">
        <h3 className={`text-xl font-bold mb-2 ${popularPlan ? 'text-white' : 'text-gray-900'}`}>
          {name}
        </h3>
        <div className="mb-2 flex items-baseline">
          <span className="text-4xl font-bold">{price}</span>
          {price !== 'Free' && <span className={`ml-1 ${popularPlan ? 'text-blue-100' : 'text-gray-500'}`}>/month</span>}
        </div>
        <p className={`${popularPlan ? 'text-blue-100' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
      
      {popularPlan && (
        <div className="inline-block px-4 py-1 bg-blue-800 text-xs font-medium text-white rounded-full mb-5">
          Most Popular
        </div>
      )}
      
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className={`mr-2 ${feature.included 
              ? popularPlan ? 'text-blue-200' : 'text-blue-500' 
              : popularPlan ? 'text-blue-400' : 'text-gray-400'
            }`}>
              <i className={`fa-solid ${feature.included ? 'fa-check' : 'fa-xmark'}`}></i>
            </span>
            <span className={`${popularPlan 
              ? feature.included ? 'text-white' : 'text-blue-200' 
              : feature.included ? 'text-gray-700' : 'text-gray-400'
            }`}>
              {feature.title}
            </span>
          </li>
        ))}
      </ul>
      
      <button 
        className={`py-2 px-4 rounded-lg font-medium mt-auto ${popularPlan 
          ? 'bg-white text-blue-600 hover:bg-blue-50' 
          : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {ctaText}
      </button>
    </div>
  );
};

interface PricingProps {
  className?: string;
}

const Pricing: React.FC<PricingProps> = ({ className = '' }) => {
  const pricingTiers: PricingTierProps[] = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for casual learners looking to improve their study habits.",
      features: [
        { title: "Create up to 3 study plans", included: true },
        { title: "Basic scheduling features", included: true },
        { title: "Progress tracking", included: true },
        { title: "Access to practice exercises", included: false },
        { title: "Multi-subject support", included: false },
        { title: "Learning analytics", included: false },
        { title: "Priority support", included: false },
      ],
      ctaText: "Sign Up Free"
    },
    {
      name: "Pro",
      price: "$9.99",
      description: "Ideal for students serious about maximizing their learning efficiency.",
      features: [
        { title: "Unlimited study plans", included: true },
        { title: "Advanced scheduling features", included: true },
        { title: "Comprehensive progress tracking", included: true },
        { title: "Access to practice exercises", included: true },
        { title: "Multi-subject support", included: true },
        { title: "Learning analytics", included: true },
        { title: "Priority support", included: false },
      ],
      popularPlan: true,
      ctaText: "Try Pro Free"
    },
    {
      name: "Premium",
      price: "$19.99",
      description: "For dedicated learners who want the full educational experience.",
      features: [
        { title: "Unlimited study plans", included: true },
        { title: "Advanced scheduling features", included: true },
        { title: "Comprehensive progress tracking", included: true },
        { title: "Access to practice exercises", included: true },
        { title: "Multi-subject support", included: true },
        { title: "Learning analytics", included: true },
        { title: "Priority support", included: true },
      ],
      ctaText: "Get Premium"
    }
  ];

  return (
    <div className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your learning needs. Upgrade or downgrade anytime.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
            <PricingTier
              key={index}
              name={tier.name}
              price={tier.price}
              description={tier.description}
              features={tier.features}
              popularPlan={tier.popularPlan}
              ctaText={tier.ctaText}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center text-gray-600">
          <p>All plans include a 14-day money-back guarantee. No questions asked.</p>
          <p className="mt-2">Need a custom plan for your organization? <a href="#" className="text-blue-600 hover:underline">Contact us</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 