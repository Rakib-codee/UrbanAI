'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import LocationSelector from '@/components/LocationSelector';
import { NotificationCenter } from '@/components/ui/NotificationCenter';
import {
  LayoutDashboard,
  GanttChartSquare,
  Map,
  Trees,
  MessageSquare,
  CarTaxiFront,
  FileBarChart,
  ScanLine,
  Settings,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  ChevronRight,
  Search,
  Target,
  Award,
  Database
} from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { useTranslation } from '@/app/i18n/hooks';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { auth } from '@/lib/simple-auth';
import { clearCache } from '@/services/apiService';

type DashboardClientProps = {
  children: React.ReactNode;
};

export function DashboardClient({ children }: DashboardClientProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNav, setActiveNav] = useState('/dashboard');
  const [currentLocation, setCurrentLocation] = useState('Dhaka, Bangladesh');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  // Ensure client-side rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Check for saved location on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && mounted) {
      const savedLocation = localStorage.getItem('selectedLocation');
      if (savedLocation) {
        if (typeof savedLocation === 'string') {
          setCurrentLocation(savedLocation);
        }
      }
    }
  }, [mounted]);

  // Watch for localStorage changes made by other components
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'selectedLocation' && e.newValue) {
        setCurrentLocation(e.newValue);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, []);
  
  // Reflect theme and language preferences in HTML attributes
  useEffect(() => {
    if (!mounted) return;
    
    // Apply theme attributes
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Apply language attributes
    document.documentElement.lang = language;

    // Track current path for navigation highlighting
    const pathname = window.location.pathname;
    setActiveNav(pathname);
  }, [theme, language, mounted]);

  if (auth.isLoading()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLocationChange = (newLocation: string) => {
    setCurrentLocation(newLocation);
    
    // Save to localStorage
    localStorage.setItem('selectedLocation', newLocation);
    
    // Create a Location object for components that need it
    const [city, country] = newLocation.split(',').map(part => part.trim());
    if (city && country) {
      // Default coordinates for common cities
      let latitude = 23.8103;
      let longitude = 90.4125;
      
      // Set default coordinates based on common cities
      if (city === 'Dhaka') {
        latitude = 23.8103;
        longitude = 90.4125;
      } else if (city === 'Chattogram') {
        latitude = 22.3569;
        longitude = 91.7832;
      } else if (city === 'Khulna') {
        latitude = 22.8456;
        longitude = 89.5403;
      }
      
      // Save location object to localStorage
      const locationObject = {
        city,
        country,
        latitude,
        longitude
      };
      
      localStorage.setItem('selectedLocationObject', JSON.stringify(locationObject));
      
      // Clear API cache to force fresh data load with new location
      clearCache();
      
      // Trigger page reload to refresh data
      window.location.reload();
    }
  };

  const navigationItems = [
    {
      title: "Dashboard", 
      translationKey: "dashboard",
      icon: <LayoutDashboard size={18} />,
      href: "/dashboard"
    },
    {
      title: "AI Analysis",
      translationKey: "aiAnalysis",
      icon: <ScanLine size={18} />,
      href: "/dashboard/ai-analysis"
    },
    {
      title: "AI Assistant",
      translationKey: "aiAssistant",
      icon: <MessageSquare size={18} />,
      href: "/dashboard/ai-assistant"
    },
    {
      title: "Simulation",
      translationKey: "simulation",
      icon: <GanttChartSquare size={18} />,
      href: "/dashboard/simulation"
    },
    {
      title: "City Maps",
      translationKey: "cityMaps",
      icon: <Map size={18} />,
      href: "/dashboard/maps"
    },
    {
      title: "Green Spaces",
      translationKey: "greenSpaces",
      icon: <Trees size={18} />,
      href: "/dashboard/green-spaces"
    },
    {
      title: "Environmental Goals",
      translationKey: "environmentalGoals",
      icon: <Target size={18} />,
      href: "/dashboard/environmental-goals"
    },
    {
      title: "Success Stories",
      translationKey: "successStories",
      icon: <Award size={18} />,
      href: "/dashboard/success-stories"
    },
    {
      title: "Data Transparency",
      translationKey: "dataTransparency",
      icon: <Database size={18} />,
      href: "/dashboard/data-transparency"
    },
    {
      title: "Traffic Management",
      translationKey: "traffic",
      icon: <CarTaxiFront size={18} />,
      href: "/dashboard/traffic"
    },
    {
      title: "Reports",
      translationKey: "reports",
      icon: <FileBarChart size={18} />,
      href: "/dashboard/reports"
    },
    {
      title: "Settings",
      translationKey: "settings",
      icon: <Settings size={18} />,
      href: "/dashboard/settings"
    },
    {
      title: "Help",
      translationKey: "help",
      icon: <HelpCircle size={18} />,
      href: "/dashboard/help"
    }
  ];

  if (!mounted) {
    return null;
  }

  // Get user's initials for the avatar fallback
  const getInitials = () => {
    const user = auth.getUser();
    if (!user?.name) return 'U';
    
    // Split the name and get initials
    const nameParts = user.name.trim().split(/\s+/);
    
    if (nameParts.length === 1) {
      // If single name, use first two characters or just first if only one character
      return nameParts[0].substring(0, Math.min(2, nameParts[0].length)).toUpperCase();
    }
    
    // For multiple parts, take first character of first and last parts
    const firstInitial = nameParts[0].charAt(0);
    const lastInitial = nameParts[nameParts.length - 1].charAt(0);
    
    return (firstInitial + lastInitial).toUpperCase();
  };

  // Filter navigation items by search query
  const filteredNavItems = navigationItems.filter(item => 
    t(`nav.${item.translationKey}`).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard-container dashboard-client-container flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out z-50 ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">UrbanAI</span>
            </Link>
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Welcome Banner */}
          {auth.getUser()?.name && (
            <div className="px-4 py-3 bg-indigo-50 dark:bg-indigo-900/30 border-b border-indigo-100 dark:border-indigo-800/30">
              <p className="text-sm text-indigo-800 dark:text-indigo-200">
                Welcome, <span className="font-semibold">{auth.getUser()?.name.split(' ')[0]}</span>!
              </p>
            </div>
          )}

          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <input
                type="search"
                placeholder={`${t('common.search')}...`}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-9 pr-4 text-sm placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-2 px-3">
            <nav className="space-y-1">
              {filteredNavItems.map((item) => {
                const isActive = activeNav.startsWith(item.href);
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={`group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                      isActive 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`mr-3 ${
                        isActive 
                          ? 'text-indigo-600 dark:text-indigo-400' 
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                      }`}>
                        {item.icon}
                      </div>
                      <span>{t(`nav.${item.translationKey}`)}</span>
                    </div>
                    {isActive && <ChevronRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-800">
                <AvatarImage src={auth.getUser()?.image || ''} alt={auth.getUser()?.name || 'User'} />
                <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium truncate">
                  {auth.getUser()?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {auth.getUser()?.email || ''}
                </p>
              </div>
              <button 
                onClick={() => router.push('/api/auth/signout')}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                title={t('auth.logout')}
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none mr-4"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <nav className="hidden md:flex">
                <ol className="flex items-center space-x-2 text-sm">
                  <li>
                    <Link href="/dashboard" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                      {t('dashboard.title')}
                    </Link>
                  </li>
                  {activeNav !== '/dashboard' && (
                    <>
                      <li>
                        <span className="text-gray-400 dark:text-gray-500">/</span>
                      </li>
                      <li>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                          {navigationItems.find(item => activeNav.startsWith(item.href))
                            ? t(`nav.${navigationItems.find(item => activeNav.startsWith(item.href))?.translationKey}`)
                            : ''}
                        </span>
                      </li>
                    </>
                  )}
                </ol>
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              <LocationSelector 
                currentLocation={currentLocation}
                onLocationChange={handleLocationChange}
                darkMode={theme === 'dark'}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-600" />
                )}
                <span className="sr-only">
                  {theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
                </span>
              </Button>
              <NotificationCenter />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        <footer className="py-3 px-6 text-center text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p>© {new Date().getFullYear()} UrbanAI. {t('common.allRightsReserved')}</p>
        </footer>
      </div>
    </div>
  );
} 