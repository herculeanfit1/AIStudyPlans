'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedFeature from './AnimatedFeature';

export default function Features() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <i className="fas fa-brain text-indigo-600 dark:text-indigo-400 text-2xl"></i>,
      title: "AI-Powered Plans",
      description: "Our AI algorithm creates personalized study plans based on your learning style, goals, and schedule."
    },
    {
      icon: <i className="fas fa-clock text-indigo-600 dark:text-indigo-400 text-2xl"></i>,
      title: "Time Optimization",
      description: "Maximize your study efficiency with scientifically-proven time management techniques."
    },
    {
      icon: <i className="fas fa-chart-line text-indigo-600 dark:text-indigo-400 text-2xl"></i>,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics and adjustable goals."
    },
    {
      icon: <i className="fas fa-puzzle-piece text-indigo-600 dark:text-indigo-400 text-2xl"></i>,
      title: "Adaptive Learning",
      description: "Your plan evolves based on your performance, focusing more time on challenging areas."
    },
    {
      icon: <i className="fas fa-bell text-indigo-600 dark:text-indigo-400 text-2xl"></i>,
      title: "Smart Reminders",
      description: "Stay on track with personalized notifications and study session reminders."
    },
    {
      icon: <i className="fas fa-users text-indigo-600 dark:text-indigo-400 text-2xl"></i>,
      title: "Collaborative Study",
      description: "Connect with peers studying similar subjects for group sessions and knowledge sharing."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span 
            className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm uppercase tracking-wider"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The SchedulEd Difference
          </motion.span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-2 mb-4">Features Designed for Student Success</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Our platform combines cutting-edge AI with proven study techniques to help you achieve academic excellence.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <AnimatedFeature
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 