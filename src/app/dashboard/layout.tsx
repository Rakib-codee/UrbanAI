"use client";

import React, { useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add effect to clear cache and prevent double rendering
  useEffect(() => {
    // Add unique class to this instance
    const dashboardRoot = document.getElementById('__next');
    if (dashboardRoot) {
      // Mark this as the primary dashboard
      dashboardRoot.classList.add('primary-dashboard-initialized');
      
      // Find and remove any duplicate dashboards
      const allDashboards = document.querySelectorAll('.dashboard-container, .flex.flex-col.min-h-screen.bg-gray-50');
      if (allDashboards.length > 1) {
        console.log('Removing duplicate dashboards, found:', allDashboards.length);
        allDashboards.forEach((dashboard, index) => {
          if (index > 0) {
            if (dashboard.parentNode) {
              dashboard.parentNode.removeChild(dashboard);
            }
          }
        });
      }
    }
    
    // Clear any cached components
    if (typeof window !== 'undefined') {
      // Force single rendering by cleaning any existing cached states
      sessionStorage.clear();
      
      // Trick Next.js into refreshing the component tree
      const currentUrl = window.location.href;
      window.history.replaceState(null, '', currentUrl);
    }
  }, []);
  
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
} 