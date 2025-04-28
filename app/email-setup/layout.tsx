import type { Metadata } from 'next';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: 'Email Setup Guide - SchedulEd',
  description: 'Configure email functionality for your SchedulEd application',
  robots: {
    index: false,
    follow: false,
  }
};

export default function EmailSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
} 