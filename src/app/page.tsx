'use client';

import dynamic from 'next/dynamic';

// Import LandingPage with dynamic import to prevent hydration issues
const LandingPage = dynamic(() => import('@/components/landing/LandingPage'), { ssr: false });

export default function Home() {
  // Always show the landing page for the root route
  return <LandingPage />;
}
