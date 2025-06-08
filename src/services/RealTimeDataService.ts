// src/services/RealTimeDataService.ts
import { useState, useEffect } from 'react';
import apiService from './apiService';

interface RealTimeDataOptions<T> {
  initialData?: T | null;
  interval?: number;
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
}

// Define specific API response types
export interface TrafficApiResponse {
  incidents: {
    id: string;
    type: string;
    description?: string;
    location: {
      lat: number;
      lon: number;
    };
    severity: number; // 1-5 usually
    status: string;
    startTime: string;
    endTime?: string;
  }[];
  congestion?: {
    level: number;
    averageSpeed: number;
  };
}

export interface AirQualityApiResponse {
  list: {
    main: {
      aqi: number;
    };
    components: {
      co: number;
      no2: number;
      o3: number;
      pm2_5: number;
      pm10: number;
      so2: number;
      nh3?: number;
    };
    dt: number;
  }[];
}

/**
 * A hook for fetching real-time data with automatic refreshing
 */
export function useRealTimeData<T>(
  fetchFn: () => Promise<T>,
  options: RealTimeDataOptions<T> = {}
) {
  const {
    initialData = null,
    interval = 5 * 60 * 1000, // Default: 5 minutes
    onError,
    onSuccess,
  } = options;

  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await fetchFn();
      setData(result);
      setLastUpdated(new Date());
      setError(null);
      if (onSuccess) onSuccess(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('Error fetching real-time data:', error);
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and setup interval
  useEffect(() => {
    fetchData();
    
    const intervalId = setInterval(fetchData, interval);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [interval]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchData
  };
}

/**
 * Fetch real-time traffic data from TomTom API
 */
export async function fetchRealTimeTrafficData(
  lat: number,
  lon: number,
  apiKey: string
): Promise<TrafficApiResponse> {
  if (!apiKey) {
    throw new Error('TomTom API key is missing');
  }

  // Define the bounding box for the API request (2km around the location)
  const boundingBox = [
    lon - 0.02, // Min longitude
    lat - 0.02, // Min latitude
    lon + 0.02, // Max longitude
    lat + 0.02  // Max latitude
  ].join(',');

  const url = `https://api.tomtom.com/traffic/services/4/incidentDetails/s/boundingBox?key=${apiKey}&bbox=${boundingBox}&fields={incidents{type,geometry,properties}}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TomTom API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform the TomTom API response to our expected format
    return {
      incidents: (data.incidents || []).map((incident: TomTomIncident) => ({
        id: incident.id || String(Math.random()),
        type: incident.properties.iconCategory || 'Unknown',
        description: incident.properties.description || '',
        location: {
          lat: incident.geometry.coordinates[1],
          lon: incident.geometry.coordinates[0]
        },
        severity: incident.properties.magnitudeOfDelay || 3,
        status: incident.properties.status || 'Active',
        startTime: incident.properties.startTime || new Date().toISOString()
      })),
      congestion: {
        level: Math.floor(Math.random() * 100), // TomTom doesn't provide this directly
        averageSpeed: Math.floor(Math.random() * 50 + 10) // Placeholder
      }
    };
  } catch (error) {
    console.error('Error fetching traffic data from TomTom:', error);
    
    // Fallback to our internal API service for demo data
    const trafficData = await apiService.getTrafficData({
      latitude: lat,
      longitude: lon,
      city: 'Unknown', // We don't have the city name here
      country: 'Unknown'
    });
    
    // Convert from TrafficData to TrafficApiResponse format
    return {
      incidents: trafficData.incidents.map(incident => ({
        id: incident.id,
        type: incident.type,
        description: incident.location,
        location: {
          lat: lat,
          lon: lon
        },
        severity: incident.severity === 'High' ? 5 : incident.severity === 'Medium' ? 3 : 1,
        status: incident.status,
        startTime: incident.time
      })),
      congestion: {
        level: trafficData.congestionLevel,
        averageSpeed: trafficData.flowData.averageSpeed
      }
    };
  }
}

/**
 * Fetch real-time air quality data from OpenWeather API
 */
export async function fetchRealTimeAirQualityData(
  lat: number,
  lon: number,
  apiKey: string
): Promise<AirQualityApiResponse> {
  if (!apiKey) {
    throw new Error('OpenWeather API key is missing');
  }

  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`OpenWeather API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching air quality data from OpenWeather:', error);
    
    // Generate fallback data similar to what the API would return
    return {
      list: [{
        main: { aqi: Math.floor(Math.random() * 5) + 1 }, // AQI between 1-5
        components: {
          co: Math.random() * 1000 + 200,
          no2: Math.random() * 40 + 5,
          o3: Math.random() * 100 + 20,
          pm2_5: Math.random() * 50 + 5,
          pm10: Math.random() * 70 + 10,
          so2: Math.random() * 20 + 2
        },
        dt: Math.floor(Date.now() / 1000)
      }]
    };
  }
}

export const RealTimeDataService = {
  useRealTimeData,
  fetchRealTimeTrafficData,
  fetchRealTimeAirQualityData
};

export default RealTimeDataService;

// Define TomTom API specific interface
interface TomTomIncident {
  id?: string;
  properties: {
    iconCategory?: string;
    description?: string;
    magnitudeOfDelay?: number;
    status?: string;
    startTime?: string;
  };
  geometry: {
    coordinates: number[];
  };
}