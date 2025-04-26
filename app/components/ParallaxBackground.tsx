'use client';

import React, { useEffect, useState } from 'react';

interface ParallaxBackgroundProps {
  children: React.ReactNode;
}

export default function ParallaxBackground({ children }: ParallaxBackgroundProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background layers with different parallax rates */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{ 
          transform: `translateY(${scrollY * 0.05}px)`,
          backgroundImage: 'url(/bubble1.svg)',
          backgroundSize: '30%',
          backgroundRepeat: 'repeat',
          zIndex: -3,
        }}
      />
      <div 
        className="absolute inset-0 opacity-15" 
        style={{ 
          transform: `translateY(${scrollY * 0.1}px)`,
          backgroundImage: 'url(/bubble2.svg)',
          backgroundSize: '20%',
          backgroundRepeat: 'repeat',
          zIndex: -2,
        }}
      />
      <div 
        className="absolute inset-0 opacity-5" 
        style={{ 
          transform: `translateY(${scrollY * 0.15}px)`,
          backgroundImage: 'url(/bubble3.svg)',
          backgroundSize: '15%',
          backgroundRepeat: 'repeat',
          zIndex: -1,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
} 