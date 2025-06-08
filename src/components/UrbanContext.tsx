'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/simple-auth';

// Define user type
interface User {
  id: string;
  email: string;
  name?: string;
}

// Define alert type
interface Alert {
  id: number;
  resource: string;
  location: string;
  alert: string;
  status: string;
  time: string;
}

// Define weather type
interface Weather {
  current: {
    temp: number;
    condition: string;
    icon: string;
    humidity: number;
    wind: number;
    feelsLike: number;
  };
  forecast: Array<{
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
    precipitation: number;
  }>;
  historical: Array<{
    month: string;
    temperature: number;
    precipitation: number;
  }>;
  // Add more fields as needed
}

// Define traffic type
interface Traffic {
  congestion: {
    current: number;
    average: number;
    peak: number;
  };
  incidents: Array<{
    id: number;
    type: string;
    location: string;
    severity: number;
    time: string;
  }>;
  volumes: {
    daily: Array<{
      hour: number;
      volume: number;
    }>;
    weekly: Array<{
      day: string;
      volume: number;
    }>;
  };
  // Add more fields as needed
}

// Define simulation data type
interface SimulationData {
  centralDensity: number;
  suburbanDensity: number;
  mixedUse: number;
  infrastructure: number;
  residentialDensity: number;
  // Add more fields as needed
}

// Define types for urban data
interface UrbanData {
  resources: {
    electricity?: {
      consumption?: number;
      savings?: number;
      renewable?: number;
    };
    water?: {
      usage?: {
        residential?: number;
      };
    };
    waste?: {
      recycling?: number;
      collection?: number;
    };
    alerts?: Alert[];
  };
  weather?: Weather;
  traffic?: Traffic;
  simulation?: SimulationData;
  location?: string;
  // Add more fields as needed
}

// Define context type
interface UrbanContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  data: UrbanData;
  loading: boolean;
  location: string;
  setLocation: (location: string) => void;
  user: User | null;
}

// Create the context
const UrbanContext = createContext<UrbanContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
  data: { resources: {} },
  loading: true,
  location: 'Dhaka, Bangladesh',
  setLocation: () => {},
  user: null
});

// Create a provider component
export const UrbanProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState<UrbanData>({ resources: {} });
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('Dhaka, Bangladesh');
  const [user, setUser] = useState<User | null>(null);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Load initial data
  useEffect(() => {
    // Check for dark mode preference
    if (typeof window !== 'undefined') {
      // Check localStorage first
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        setDarkMode(savedMode === 'true');
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Fall back to system preference
        setDarkMode(true);
      }
      
      // Check for saved location
      const savedLocation = localStorage.getItem('selectedLocation');
      if (savedLocation) {
        setLocation(savedLocation);
      }
    }
    
    // Get user info
    const currentUser = auth.getUser();
    setUser(currentUser as User | null);
    
    // Mock data for resources
    const mockData: UrbanData = {
      resources: {
        electricity: {
          consumption: 450,
          savings: 12,
          renewable: 22
        },
        water: {
          usage: {
            residential: 45
          }
        },
        waste: {
          recycling: 35,
          collection: 85
        },
        alerts: [
          {
            id: 1,
            resource: "Energy",
            location: "Downtown District",
            alert: "High consumption detected",
            status: "Warning",
            time: "2 hours ago"
          },
          {
            id: 2,
            resource: "Water",
            location: "Northern Residential Area",
            alert: "Leak detected in main pipe",
            status: "Critical",
            time: "30 minutes ago"
          },
          {
            id: 3,
            resource: "Waste",
            location: "Industrial Zone",
            alert: "Recycling rate below target",
            status: "Warning",
            time: "1 day ago"
          }
        ]
      },
      // Mock weather data
      weather: {
        current: {
          temp: 28,
          condition: "Sunny",
          icon: "sun",
          humidity: 65,
          wind: 12,
          feelsLike: 30
        },
        forecast: [
          { date: "2023-07-01", day: "Mon", high: 29, low: 22, condition: "Sunny", icon: "sun", precipitation: 0 },
          { date: "2023-07-02", day: "Tue", high: 28, low: 21, condition: "Partly Cloudy", icon: "cloud-sun", precipitation: 10 },
          { date: "2023-07-03", day: "Wed", high: 27, low: 20, condition: "Rain", icon: "cloud-rain", precipitation: 80 },
          { date: "2023-07-04", day: "Thu", high: 26, low: 19, condition: "Rain", icon: "cloud-rain", precipitation: 60 },
          { date: "2023-07-05", day: "Fri", high: 28, low: 20, condition: "Cloudy", icon: "cloud", precipitation: 20 }
        ],
        historical: [
          { month: "Jan", temperature: 15, precipitation: 40 },
          { month: "Feb", temperature: 17, precipitation: 35 },
          { month: "Mar", temperature: 20, precipitation: 30 },
          { month: "Apr", temperature: 23, precipitation: 25 },
          { month: "May", temperature: 26, precipitation: 20 },
          { month: "Jun", temperature: 28, precipitation: 15 }
        ]
      },
      // Mock traffic data
      traffic: {
        congestion: {
          current: 45,
          average: 40,
          peak: 75
        },
        incidents: [
          { id: 1, type: "Accident", location: "Main St & 5th Ave", severity: 3, time: "15 minutes ago" },
          { id: 2, type: "Construction", location: "Highway 101, Mile 23", severity: 2, time: "2 hours ago" },
          { id: 3, type: "Road Closure", location: "Downtown Bridge", severity: 4, time: "1 day ago" }
        ],
        volumes: {
          daily: [
            { hour: 0, volume: 200 },
            { hour: 3, volume: 100 },
            { hour: 6, volume: 800 },
            { hour: 9, volume: 1500 },
            { hour: 12, volume: 1200 },
            { hour: 15, volume: 1800 },
            { hour: 18, volume: 1600 },
            { hour: 21, volume: 500 }
          ],
          weekly: [
            { day: "Mon", volume: 12000 },
            { day: "Tue", volume: 11500 },
            { day: "Wed", volume: 11000 },
            { day: "Thu", volume: 12500 },
            { day: "Fri", volume: 14000 },
            { day: "Sat", volume: 9000 },
            { day: "Sun", volume: 7500 }
          ]
        }
      },
      // Mock simulation data
      simulation: {
        centralDensity: 70,
        suburbanDensity: 40,
        mixedUse: 55,
        infrastructure: 65,
        residentialDensity: 60
      },
      location: location
    };
    
    // Simulate API loading
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Update data when location changes
  useEffect(() => {
    if (location) {
      setLoading(true);
      // Update mock data with new location
      const updatedData = { ...data, location };
      
      // Simulate API loading
      setTimeout(() => {
        setData(updatedData);
        setLoading(false);
      }, 500);
    }
  }, [location]);

  return (
    <UrbanContext.Provider value={{ 
      darkMode, 
      toggleDarkMode, 
      data, 
      loading, 
      location, 
      setLocation,
      user
    }}>
      {children}
    </UrbanContext.Provider>
  );
};

// Custom hook to use the context
export const useUrbanData = () => useContext(UrbanContext);

export default UrbanContext; 