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
    <main>
      <Hero />
      <Stats />
      <Features />
      <HowItWorksCards />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Waitlist />
      <Footer />
    </main>
  );
} 