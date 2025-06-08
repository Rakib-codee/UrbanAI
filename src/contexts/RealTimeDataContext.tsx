import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getWeatherData, getTrafficData, getAirQualityData, 
  getResourceData, getGreenSpaceData,
  WeatherData, TrafficData, AirQualityData, 
  ResourceData, GreenSpaceData 
} from '@/services/realTimeData';

type City = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country: string;
};

interface RealTimeDataContextType {
  isLoading: boolean;
  weatherData: WeatherData | null;
  trafficData: TrafficData | null;
  airQualityData: AirQualityData | null;
  resourceData: ResourceData | null;
  greenSpaceData: GreenSpaceData | null;
  userLocation: City | null;
  refreshData: () => void;
}

const RealTimeDataContext = createContext<RealTimeDataContextType | undefined>(undefined);

export const useRealTimeData = () => {
  const context = useContext(RealTimeDataContext);
  if (context === undefined) {
    throw new Error('useRealTimeData must be used within a RealTimeDataProvider');
  }
  
  // Force an immediate data refresh when components use this hook
  useEffect(() => {
    console.log('🔄 Component using useRealTimeData mounted - triggering refresh');
    if (!context.isLoading && context.refreshData) {
      // Add a small delay to prevent multiple refreshes if many components mount at once
      const timeoutId = setTimeout(() => {
        context.refreshData();
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, []);
  
  return context;
};

export const RealTimeDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [resourceData, setResourceData] = useState<ResourceData | null>(null);
  const [greenSpaceData, setGreenSpaceData] = useState<GreenSpaceData | null>(null);
  const [userLocation, setUserLocation] = useState<City | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0);

  // Initialize user location from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
          setUserLocation(JSON.parse(savedLocation));
        } else {
          // Default to Dhaka
          const defaultLocation = {
            id: '1',
            name: 'Dhaka',
            lat: 23.8103,
            lng: 90.4125,
            country: 'Bangladesh'
          };
          localStorage.setItem('userLocation', JSON.stringify(defaultLocation));
          setUserLocation(defaultLocation);
        }
        
        // Force an initial data load with a slight delay to ensure all components are mounted
        console.log('🚀 Initial app loading - forcing data refresh');
        setTimeout(() => {
          refreshData();
        }, 500);
        
      } catch (error) {
        console.error('Error loading user location:', error);
      }
    }
  }, []);

  // Set up periodic refresh every 2 minutes
  useEffect(() => {
    console.log('⏱️ Setting up periodic data refresh (every 2 minutes)');
    const intervalId = setInterval(() => {
      console.log('⏱️ Periodic refresh triggered');
      refreshData();
    }, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Fetch data when user location changes
  useEffect(() => {
    if (userLocation) {
      fetchAllData();
    }
  }, [userLocation]);

  // Listen for storage events (when location is updated in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedLocation = localStorage.getItem('userLocation');
        if (savedLocation) {
          setUserLocation(JSON.parse(savedLocation));
        }
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);

  const fetchAllData = async () => {
    if (!userLocation) return;
    
    // Check if we've refreshed within the last 10 seconds to prevent spamming
    // Reduced from 30 seconds to improve responsiveness
    const now = Date.now();
    if (now - lastRefreshTime < 10000) {
      console.log('🔄 Skipping refresh - last refresh was less than 10 seconds ago');
      return;
    }
    
    setIsLoading(true);
    console.log('🔍 Fetching data for location:', userLocation);
    setLastRefreshTime(now);
    
    try {
      // Fetch all data in parallel
      console.log('📡 Starting API calls...');
      
      // Create all API requests with individual error handling
      const fetchWithFallback = async <T,>(
        fetchFn: () => Promise<T>,
        errorMessage: string
      ): Promise<T | null> => {
        try {
          return await fetchFn();
        } catch (error) {
          console.error(`❌ ${errorMessage}:`, error);
          return null;
        }
      };
      
      // Wrap each API call with the error handling function
      const [weather, traffic, airQuality, resource, greenSpace] = await Promise.allSettled([
        fetchWithFallback(() => getWeatherData(userLocation.lat, userLocation.lng), 'Error fetching weather data'),
        fetchWithFallback(() => getTrafficData(userLocation.lat, userLocation.lng), 'Error fetching traffic data'),
        fetchWithFallback(() => getAirQualityData(userLocation.lat, userLocation.lng), 'Error fetching air quality data'),
        fetchWithFallback(() => getResourceData(userLocation.lat, userLocation.lng), 'Error fetching resource data'),
        fetchWithFallback(() => getGreenSpaceData(userLocation.lat, userLocation.lng), 'Error fetching green space data')
      ]);
      
      console.log('✅ API calls completed');
      
      // Process results from Promise.allSettled
      if (weather.status === 'fulfilled' && weather.value) setWeatherData(weather.value);
      if (traffic.status === 'fulfilled' && traffic.value) setTrafficData(traffic.value);
      if (airQuality.status === 'fulfilled' && airQuality.value) setAirQualityData(airQuality.value);
      if (resource.status === 'fulfilled' && resource.value) setResourceData(resource.value);
      if (greenSpace.status === 'fulfilled' && greenSpace.value) setGreenSpaceData(greenSpace.value);
      
      // Force a rerender in components
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('data-refreshed'));
        console.log('🔄 Dispatched data-refreshed event');
      }, 100);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to manually refresh data
  const refreshData = () => {
    console.log('🔄 Manual refresh requested');
    
    // Force refresh data from APIs
    setIsLoading(true);
    
    // Simulate a brief loading state
    setTimeout(() => {
      fetchAllData();
    }, 300);
  };

  return (
    <RealTimeDataContext.Provider
      value={{
        isLoading,
        weatherData,
        trafficData,
        airQualityData,
        resourceData,
        greenSpaceData,
        userLocation,
        refreshData,
      }}
    >
      {children}
    </RealTimeDataContext.Provider>
  );
};

export default RealTimeDataProvider; 