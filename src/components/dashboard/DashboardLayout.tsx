'use client';

import { useEffect, useRef, useLayoutEffect } from 'react';
import DashboardNavbar from './DashboardNavbar';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/simple-auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dashboardRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  
  // Run before painting to remove duplicates immediately
  useLayoutEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    // Aggressive duplicate removal
    if (typeof window !== 'undefined') {
      const removeDuplicates = () => {
        const dashboards = document.querySelectorAll('.dashboard-container, .flex.flex-col.min-h-screen');
        
        // If our ref exists, ensure it's the first one
        if (dashboardRef.current) {
          if (dashboards.length > 1) {
            console.log('Found multiple dashboards, cleaning up...');
            dashboards.forEach((dashboard) => {
              // Keep our dashboard, remove others
              if (dashboard !== dashboardRef.current && dashboard.parentNode) {
                console.log('Removing duplicate dashboard');
                dashboard.parentNode.removeChild(dashboard);
              }
            });
          }
        }
      };
      
      // Run immediately
      removeDuplicates();
      
      // Run again after a small delay
      setTimeout(removeDuplicates, 100);
      setTimeout(removeDuplicates, 500);
    }
  }, []);
  
  // Check authentication directly on mount
  useEffect(() => {
    const isAuthenticated = auth.isAuthenticated();
    console.log('Authentication check:', { isAuthenticated });
    
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      router.push('/login');
    }
    
    // Set scroll position to top on mount
    window.scrollTo(0, 0);
    
    // Remove any margin or padding from body and html
    if (typeof document !== 'undefined') {
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
      document.body.style.overflowX = 'hidden';
      
      // Remove any top margin/padding
      const root = document.getElementById('__next') || document.documentElement;
      if (root) {
        root.style.marginTop = '0';
        root.style.paddingTop = '0';
      }
      
      // Handle duplicate dashboards
      const dashboards = document.querySelectorAll('.dashboard-container');
      if (dashboards.length > 1) {
        console.log('Found multiple dashboards, hiding duplicates');
        dashboards.forEach((dashboard, index) => {
          if (index > 0) {
            dashboard.classList.add('hidden');
          }
        });
      }
    }
  }, [router]);

  // Return the dashboard without blocking - the redirect handles unauthorized access
  return (
    <div ref={dashboardRef} id="primary-dashboard" className="dashboard-container flex flex-col min-h-screen bg-gray-50">
      <DashboardNavbar />
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 