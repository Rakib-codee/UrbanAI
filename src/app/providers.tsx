'use client';

// import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/lib/ThemeContext';
import RealTimeDataProvider from '@/contexts/RealTimeDataContext';
import NotificationProvider from '@/contexts/NotificationContext';
import UserRoleProvider from '@/contexts/UserRoleContext';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { initI18n } from './i18n/hooks';
import i18n from './i18n/i18n';
import { SessionProvider } from '@/components/SessionProvider';
import ErrorBoundary from '@/components/ErrorBoundary';

// Utility functions for mobile responsiveness
const useResponsiveLayout = () => {
  useEffect(() => {
    // Handle viewport height for mobile browsers
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Handle touch interface enhancements
    const enhanceTouchInterface = () => {
      document.documentElement.classList.toggle('touch-device', 'ontouchstart' in window || navigator.maxTouchPoints > 0);
    };

    // Handle orientation change
    const handleOrientationChange = () => {
      document.documentElement.classList.toggle('landscape', window.matchMedia('(orientation: landscape)').matches);
      setVH();
    };

    // Initialize
    setVH();
    enhanceTouchInterface();
    handleOrientationChange();

    // Set up event listeners
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    // Cleanup
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return null;
};

export default function Providers({ children }: { children: React.ReactNode }) {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  // Apply responsive layout adjustments
  useResponsiveLayout();

  // Initialize i18n with proper language detection
  useEffect(() => {
    // Check localStorage for language preference
    const storedLang = localStorage.getItem('i18nextLng');
    
    if (storedLang) {
      // Apply stored language
      i18n.changeLanguage(storedLang);
    }
    
    // Mark as initialized
    setIsI18nInitialized(true);
    
    // Initialize i18n
    initI18n();
  }, []);

  // Don't render until i18n is initialized
  if (!isI18nInitialized && typeof window !== 'undefined') {
    return null; // Or a simple loading indicator
  }

  return (
    <ErrorBoundary>
      <SessionProvider>
        <ThemeProvider>
          <RealTimeDataProvider>
            <NotificationProvider>
              <UserRoleProvider>
                {children}
                <Toaster position="top-right" />
              </UserRoleProvider>
            </NotificationProvider>
          </RealTimeDataProvider>
        </ThemeProvider>
      </SessionProvider>
    </ErrorBoundary>
  );
} 