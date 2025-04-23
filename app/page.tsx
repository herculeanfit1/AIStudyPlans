import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Stats from '@/components/Stats';
import HowItWorksCards from '@/components/HowItWorksCards';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import Waitlist from '@/components/Waitlist';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ 
        padding: '50px 20px', 
        background: 'linear-gradient(to right, #4f46e5, #3b82f6)',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '20px' }}>
          Your AI Study <span style={{ color: '#fde047' }}>Partner</span> for Academic Success
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 30px' }}>
          SchedulEd creates personalized study plans tailored to your learning style, time availability, and knowledge level.
        </p>
        <div>
          <a href="#waitlist" style={{ 
            display: 'inline-block',
            background: '#fde047', 
            color: '#1f2937', 
            padding: '12px 24px', 
            borderRadius: '8px',
            fontWeight: 'bold',
            textDecoration: 'none',
            margin: '10px'
          }}>
            Join the Waitlist
          </a>
          <a href="#how-it-works" style={{ 
            display: 'inline-block',
            border: '2px solid white', 
            color: 'white', 
            padding: '12px 24px', 
            borderRadius: '8px',
            fontWeight: 'bold',
            textDecoration: 'none',
            margin: '10px'
          }}>
            Learn More
          </a>
        </div>
      </div>
      
      <div id="stats" style={{ 
        padding: '40px 20px', 
        background: 'linear-gradient(to right, #7e22ce, #4f46e5)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            flex: '1 1 300px', 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '20px', 
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>10,000+</h3>
            <p>Students Using Our Platform</p>
          </div>
          
          <div style={{ 
            flex: '1 1 300px', 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '20px', 
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>94%</h3>
            <p>Report Grade Improvement</p>
          </div>
          
          <div style={{ 
            flex: '1 1 300px', 
            background: 'rgba(255, 255, 255, 0.2)', 
            padding: '20px', 
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>25+</h3>
            <p>Subjects Covered</p>
          </div>
        </div>
      </div>
      
      <div id="how-it-works" style={{ padding: '40px 20px', textAlign: 'center', background: 'white' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          How It Works
        </h2>
        <p style={{ maxWidth: '800px', margin: '0 auto 40px', color: '#4b5563' }}>
          Get started with our AI-powered study plans in just a few simple steps
        </p>
      </div>
      
      <div id="waitlist" style={{ padding: '40px 20px', textAlign: 'center', background: '#eef2ff' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
          Join Our Waitlist
        </h2>
        <p style={{ maxWidth: '800px', margin: '0 auto 40px', color: '#4b5563' }}>
          Be the first to know when we launch
        </p>
        <form style={{ maxWidth: '500px', margin: '0 auto' }}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '8px', 
              border: '1px solid #d1d5db',
              marginBottom: '16px' 
            }} 
          />
          <button 
            type="submit" 
            style={{ 
              width: '100%', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              background: '#4f46e5', 
              color: 'white', 
              fontWeight: 'bold', 
              border: 'none', 
              cursor: 'pointer' 
            }}
          >
            Join the Waitlist
          </button>
        </form>
      </div>
    </main>
  );
} 