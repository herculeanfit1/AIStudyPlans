'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the landing page
    router.push('/landing');
  }, [router]);
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <p className="text-center text-lg">Redirecting to SchedulEd...</p>
    </div>
  );
}
