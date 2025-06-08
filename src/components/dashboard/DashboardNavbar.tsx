import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutGrid,
  BarChart2,
  MessageSquare,
  FlaskConical,
  Map,
  TreePine,
  Car,
  FileText,
  Settings,
  HelpCircle,
  Bell,
  User,
  Search,
  Check,
  Lightbulb,
  Users,
  LogOut
} from 'lucide-react';
import LocationSelector from '@/components/LocationSelector';
import { useAuth } from '@/components/SessionProvider';
import { auth } from '@/lib/simple-auth';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutGrid
  },
  {
    name: 'AI Analysis',
    href: '/dashboard/ai-analysis',
    icon: BarChart2
  },
  {
    name: 'AI Assistant',
    href: '/dashboard/ai-assistant',
    icon: MessageSquare
  },
  {
    name: 'Simulation',
    href: '/dashboard/simulation',
    icon: FlaskConical
  },
  {
    name: 'City Maps',
    href: '/dashboard/maps',
    icon: Map
  },
  {
    name: 'Green Spaces',
    href: '/dashboard/green-spaces',
    icon: TreePine
  },
  {
    name: 'Traffic',
    href: '/dashboard/traffic',
    icon: Car
  },
  {
    name: 'Insights',
    href: '/dashboard/insights',
    icon: Lightbulb
  },
  {
    name: 'Social',
    href: '/dashboard/social',
    icon: Users
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: FileText
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings
  },
  {
    name: 'Help',
    href: '/dashboard/help',
    icon: HelpCircle
  }
];

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('Dhaka, Bangladesh');
  const [darkMode, setDarkMode] = useState(false);
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [showLocationSuccess, setShowLocationSuccess] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New report available',
      message: 'The monthly urban analysis report is now available',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      title: 'System update',
      message: 'The system has been updated with new features',
      time: '1 day ago',
      read: true
    },
    {
      id: 3,
      title: 'New data available',
      message: 'New traffic data for Dhaka has been imported',
      time: '3 days ago',
      read: true
    }
  ]);

  // Check for dark mode and load saved location on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for dark mode
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
      }
      
      // Load saved location
      const savedLocation = localStorage.getItem('selectedLocation');
      if (savedLocation) {
        try {
          // Try to parse as JSON first (for Location object)
          const parsedLocation = JSON.parse(savedLocation);
          if (parsedLocation && typeof parsedLocation === 'object') {
            if (parsedLocation.city && parsedLocation.country) {
              setCurrentLocation(`${parsedLocation.city}, ${parsedLocation.country}`);
            }
          }
        } catch {
          // If it's not JSON, it might be a string
          if (typeof savedLocation === 'string' && savedLocation.includes(',')) {
            setCurrentLocation(savedLocation);
          }
        }
      }
    }
  }, []);

  // Handle location change event
  useEffect(() => {
    const handleLocationChanged = () => {
      // Show success message
      setShowLocationSuccess(true);
      
      // Hide after 3 seconds
      setTimeout(() => {
        setShowLocationSuccess(false);
      }, 3000);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('locationChanged', handleLocationChanged);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('locationChanged', handleLocationChanged);
      }
    };
  }, []);

  const handleLocationChange = (newLocation: string) => {
    // Show loading indicator
    setIsChangingLocation(true);
    setCurrentLocation(newLocation);
    
    // Save to localStorage as string
    localStorage.setItem('selectedLocation', newLocation);
    
    // Create a Location object for compatibility with other components
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
      
      // Save as JSON for components that expect a Location object
      const locationObject = {
        city,
        country,
        latitude,
        longitude
      };
      
      localStorage.setItem('selectedLocationObject', JSON.stringify(locationObject));
      
      // Wait briefly to show loading state, then reload
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    router.push('/login');
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // Right section elements
  
  // Search
  const searchSection = (
    <div className="relative">
      <button
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className="text-gray-400 hover:text-white p-1"
      >
        <Search className="h-5 w-5" />
      </button>
      {isSearchOpen && (
        <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-lg py-1 z-50">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-1.5 text-sm text-gray-700 focus:outline-none"
          />
        </div>
      )}
    </div>
  );

  // Notifications
  const notificationsSection = (
    <div className="relative">
      <button 
        className="text-gray-400 hover:text-white p-1 relative"
        onClick={() => {
          setShowNotifications(!showNotifications);
          setShowUserMenu(false);
        }}
      >
        <Bell className="h-5 w-5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadNotificationCount}
          </span>
        )}
      </button>
      
      {showNotifications && (
        <div className="absolute right-0 mt-1 w-72 bg-white rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
            <button 
              onClick={markAllNotificationsAsRead}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Mark all as read
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              <div>
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${notification.read ? '' : 'bg-blue-50'}`}
                  >
                    <div className="flex justify-between">
                      <p className="text-xs font-medium text-gray-900">{notification.title}</p>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 text-center text-gray-500 text-xs">
                No notifications
              </div>
            )}
          </div>
          <div className="p-2 text-center border-t border-gray-200">
            <Link 
              href="/dashboard/notifications" 
              className="text-xs text-blue-600 hover:text-blue-800"
              onClick={() => setShowNotifications(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  // User Profile
  const userProfileSection = (
    <div className="relative">
      <button 
        className="text-gray-400 hover:text-white p-1"
        onClick={() => {
          setShowUserMenu(!showUserMenu);
          setShowNotifications(false);
        }}
      >
        <User className="h-5 w-5" />
      </button>
      
      {showUserMenu && (
        <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-lg py-1 z-50">
          <div className="px-3 py-2 border-b border-gray-200">
            <p className="text-xs font-medium text-gray-900">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || 'user@example.com'}
            </p>
          </div>
          <Link
            href="/dashboard/profile"
            className="block px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
            onClick={() => setShowUserMenu(false)}
          >
            Profile Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-gray-100 flex items-center"
          >
            <LogOut className="h-3 w-3 mr-1.5" />
            Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <nav className="bg-[#1e1f25] shadow-md sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <Image 
                src="/logo.svg" 
                alt="Urban AI" 
                className="h-7 w-auto" 
                width={500} 
                height={300} 
                style={{ objectFit: 'contain' }}
              />
              <span className="ml-2 text-lg font-semibold text-white">UrbanAI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-2 py-1 rounded-md text-sm font-medium transition-colors
                    ${
                      pathname === item.href
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="h-4 w-4 mr-1" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* Location Selector */}
            <div className="relative">
              {isChangingLocation && (
                <div className="absolute inset-0 bg-black bg-opacity-25 rounded-lg flex items-center justify-center z-50">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                </div>
              )}
              <LocationSelector
                currentLocation={currentLocation}
                onLocationChange={handleLocationChange}
                darkMode={darkMode}
              />
              
              {/* Success Notification */}
              {showLocationSuccess && (
                <div className="absolute -bottom-10 left-0 right-0 mx-auto w-max bg-green-500 text-white px-2 py-1 rounded-md shadow-lg flex items-center z-50 text-xs">
                  <Check className="w-3 h-3 mr-1" />
                  <span>Location updated successfully</span>
                </div>
              )}
            </div>
            
            {/* Search */}
            {searchSection}

            {/* Notifications */}
            {notificationsSection}

            {/* User Profile */}
            {userProfileSection}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white p-1"
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                    ${
                      pathname === item.href
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-2" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-gray-700 hover:text-red-300"
              >
                <LogOut className="h-5 w-5 mr-2" aria-hidden="true" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 