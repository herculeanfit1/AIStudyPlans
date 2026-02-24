'use client';

import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';

interface AnimatedFeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
  index: number; // For staggered animations
}

export default function AnimatedFeature({ icon, title, description, index }: AnimatedFeatureProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px',
  });

  return (
    <motion.div
      ref={ref}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1, // Stagger effect
        ease: "easeOut" 
      }}
    >
      <motion.div 
        className="feature-icon"
        whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{title}</h3>
      
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </motion.div>
  );
} 