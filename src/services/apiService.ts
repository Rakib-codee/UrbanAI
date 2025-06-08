import { auth } from '@/lib/simple-auth';

// API Keys
const API_KEYS = {
  TOMTOM_TRAFFIC: "RDPGbxApAG7Vfzo7qEz33NKcfPPQE55l",
  WORLD_WEATHER_ONLINE: "4d1cee20c4e74cd0b7c41821253105",
  USCG_WATER_DATA: "ML9GIcbJ28sg5sBKyajnxOfyVnQMaAsO7U5fgfNd",
  OPEN_WEATHER_MAP: "b78dd465c5bfc397e9d95acf5d22f219",
  DEEPSEEK_API: process.env.DEEPSEEK_API_KEY || "",
  USGS_WATER_DATA: "VBx9oDTZE6lVB86QyfVn3zgkJdQMnqwG"
};

// Types
export interface Location {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
}

export interface TrafficIncident {
  id: string;
  type: string;
  location: string;
  severity: string;
  status: string;
  time: string;
}

export interface TrafficData {
  congestionLevel: number;
  incidents: TrafficIncident[];
  flowData: {
    averageSpeed: number;
    vehicleCount: number;
    roadOccupancy: number;
  };
  predictions: {
    peakHours: string[];
    recommendedRoutes: string[];
    congestionForecast: number[];
  };
}

export interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    conditions: string;
    airQuality: number;
  };
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    precipitation: number;
    conditions: string;
  }>;
  alerts: string[];
}

export interface WaterData {
  levels: {
    reservoirs: number;
    groundwater: number;
    rivers: number;
  };
  quality: {
    pH: number;
    dissolved_oxygen: number;
    turbidity: number;
    pollutants: number;
  };
  usage: {
    residential: number;
    industrial: number;
    agricultural: number;
  };
  alerts: string[];
}

export interface ResourceAlert {
  id: number;
  resource: string;
  location: string;
  alert: string;
  status: string;
  time: string;
}

export interface ResourceData {
  electricity: {
    consumption: number;
    peak: number;
    renewable: number;
    savings: number;
  };
  water: WaterData;
  waste: {
    collection: number;
    recycling: number;
    landfill: number;
  };
  gas: {
    consumption: number;
    leakage: number;
    quality: number;
  };
  allocation: Record<string, number>;
  alerts: ResourceAlert[];
}

export interface AIAnalysisResult {
  recommendations: string[];
  insights: string;
  forecast: string;
  metrics?: Record<string, number>;
}

// Default Dhaka Coordinates
const DEFAULT_LOCATION: Location = {
  latitude: 23.8103,
  longitude: 90.4125,
  city: "Dhaka",
  country: "Bangladesh"
};

// Get current location from localStorage if available
export const getCurrentLocation = (): Location => {
  if (typeof window !== 'undefined') {
    try {
      // Try to get location object first
      const locationObjectStr = localStorage.getItem('selectedLocationObject');
      if (locationObjectStr) {
        const locationObject = JSON.parse(locationObjectStr);
        if (locationObject && locationObject.city && locationObject.country) {
          return locationObject as Location;
        }
      }
      
      // Try to get location string
      const locationStr = localStorage.getItem('selectedLocation');
      if (locationStr) {
        const [city, country] = locationStr.split(',').map(part => part.trim());
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
          
          return {
            city,
            country,
            latitude,
            longitude
          };
        }
      }
    } catch (error) {
      console.error('Error getting location from localStorage:', error);
    }
  }
  
  return DEFAULT_LOCATION;
};

// Cache to minimize API calls
const cache: Record<string, {data: unknown, timestamp: number}> = {};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Check if data is cached and still valid
 */
const getCachedData = <T>(key: string): T | null => {
  const cachedItem = cache[key];
  if (cachedItem && (Date.now() - cachedItem.timestamp) < CACHE_DURATION) {
    return cachedItem.data as T;
  }
  return null;
};

/**
 * Store data in cache
 */
const setCachedData = <T>(key: string, data: T): T => {
  cache[key] = {
    data,
    timestamp: Date.now()
  };
  return data;
};

/**
 * Clear cache when location changes
 */
export const clearCache = (): void => {
  Object.keys(cache).forEach(key => {
    delete cache[key];
  });
};

// Helper function to get authorization headers
const getAuthHeaders = () => {
  const token = auth.getToken();
  return { 
    headers: token ? { Authorization: `Bearer ${token}` } : undefined 
  };
};

/**
 * Get traffic data from TomTom API
 */
export async function getTrafficData(location: Location = getCurrentLocation()): Promise<TrafficData> {
  const cacheKey = `traffic_${location.latitude}_${location.longitude}`;
  const cachedData = getCachedData<TrafficData>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  try {
    // In a real implementation, we would call the TomTom Traffic API here
    // Using the API key: API_KEYS.TOMTOM_TRAFFIC
    
    // For now, we'll generate city-specific mock data
    const cityHash = location.city.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    const trafficData: TrafficData = {
      congestionLevel: 40 + (cityHash % 40), // 40-79
      incidents: [
        {
          id: "1",
          type: "Congestion",
          location: `${location.city} Downtown`,
          severity: "Medium",
          status: "Ongoing",
          time: new Date().toLocaleTimeString()
        }
      ],
      flowData: {
        averageSpeed: 15 + (cityHash % 30), // 15-44
        vehicleCount: 500 + (cityHash % 1000), // 500-1499
        roadOccupancy: 40 + (cityHash % 40) // 40-79
      },
      predictions: {
        peakHours: ["08:00-09:30", "17:00-18:30"],
        recommendedRoutes: [],
        congestionForecast: [
          20 + (cityHash % 20),
          30 + (cityHash % 20),
          50 + (cityHash % 20),
          70 + (cityHash % 20),
          60 + (cityHash % 20),
          40 + (cityHash % 20)
        ]
      }
    };
    
    return setCachedData<TrafficData>(cacheKey, trafficData);
  } catch (error) {
    console.error("Error fetching traffic data:", error);
    
    // Return fallback data
    const trafficData: TrafficData = {
      congestionLevel: 65,
      incidents: [
        {
          id: "1",
          type: "Congestion",
          location: `${location.city} Downtown`,
          severity: "Medium",
          status: "Ongoing",
          time: new Date().toLocaleTimeString()
        }
      ],
      flowData: {
        averageSpeed: 25,
        vehicleCount: 750,
        roadOccupancy: 55
      },
      predictions: {
        peakHours: ["08:00-09:30", "17:00-18:30"],
        recommendedRoutes: [],
        congestionForecast: [20, 35, 60, 85, 70, 40]
      }
    };
    
    return trafficData;
  }
}

/**
 * Get weather data from OpenWeatherMap and WorldWeatherOnline APIs
 */
export async function getWeatherData(location: Location = getCurrentLocation()): Promise<WeatherData> {
  const cacheKey = `weather_${location.latitude}_${location.longitude}`;
  const cachedData = getCachedData<WeatherData>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  // Return fallback data instead of trying to fetch from external API
  const weatherData: WeatherData = {
    current: {
      temperature: 28,
      humidity: 65,
      windSpeed: 5,
      conditions: "Partly Cloudy",
      airQuality: 75
    },
    forecast: Array(5).fill(0).map((_, i) => ({
      date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      maxTemp: 32,
      minTemp: 25,
      precipitation: Math.random() * 100,
      conditions: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy", "Clear"][Math.floor(Math.random() * 5)]
    })),
    alerts: []
  };
  
  return setCachedData<WeatherData>(cacheKey, weatherData);
}

/**
 * Get water data from USCG Water Data API
 */
export async function getWaterData(location: Location = getCurrentLocation()): Promise<WaterData> {
  const cacheKey = `water_${location.latitude}_${location.longitude}`;
  const cachedData = getCachedData<WaterData>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  try {
    // In a real implementation, we would call the USCG Water Data API here
    // For now, we'll generate mock data
    
    const waterData: WaterData = {
      levels: {
        reservoirs: 65 + Math.random() * 10,
        groundwater: 70 + Math.random() * 15,
        rivers: 45 + Math.random() * 20
      },
      quality: {
        pH: 6.5 + Math.random() * 1.5,
        dissolved_oxygen: 6 + Math.random() * 4,
        turbidity: Math.random() * 10,
        pollutants: Math.random() * 50
      },
      usage: {
        residential: 45 + Math.random() * 10,
        industrial: 30 + Math.random() * 15,
        agricultural: 15 + Math.random() * 10
      },
      alerts: []
    };
    
    return setCachedData<WaterData>(cacheKey, waterData);
  } catch (error) {
    console.error("Error fetching water data:", error);
    
    // Return fallback data
    return {
      levels: {
        reservoirs: 70,
        groundwater: 75,
        rivers: 50
      },
      quality: {
        pH: 7.2,
        dissolved_oxygen: 8,
        turbidity: 5,
        pollutants: 20
      },
      usage: {
        residential: 50,
        industrial: 35,
        agricultural: 15
      },
      alerts: []
    };
  }
}

/**
 * Get comprehensive resource data
 */
export async function getResourceData(location: Location = getCurrentLocation()): Promise<ResourceData> {
  const cacheKey = `resources_${location.latitude}_${location.longitude}`;
  const cachedData = getCachedData<ResourceData>(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  // Get water data first
  const waterData = await getWaterData(location);
  
  try {
    // In a real implementation, we would call appropriate APIs for each resource type
    // For now, we'll generate mock data
    
    const resourceData: ResourceData = {
      electricity: {
        consumption: 450 + Math.random() * 100,
        peak: 650 + Math.random() * 150,
        renewable: 25 + Math.random() * 15,
        savings: 12 + Math.random() * 8
      },
      water: waterData,
      waste: {
        collection: 85 + Math.random() * 15,
        recycling: 35 + Math.random() * 20,
        landfill: 50 + Math.random() * 30
      },
      gas: {
        consumption: 320 + Math.random() * 80,
        leakage: Math.random() * 5,
        quality: 90 + Math.random() * 10
      },
      allocation: {
        "Downtown": 35,
        "North Area": 25,
        "East Side": 15,
        "South District": 20,
        "West Zone": 5,
      },
      alerts: [
        {
          id: 1,
          resource: "Electricity",
          location: "Downtown",
          alert: "Peak Usage Alert",
          status: "Ongoing",
          time: "2 hours ago"
        },
        {
          id: 2,
          resource: "Water",
          location: "North Area",
          alert: "Pipe Leakage",
          status: "Resolved",
          time: "5 hours ago"
        }
      ]
    };
    
    return setCachedData<ResourceData>(cacheKey, resourceData);
  } catch (error) {
    console.error("Error fetching resource data:", error);
    
    // Return fallback data
    return {
      electricity: {
        consumption: 500,
        peak: 750,
        renewable: 30,
        savings: 15
      },
      water: waterData,
      waste: {
        collection: 90,
        recycling: 40,
        landfill: 60
      },
      gas: {
        consumption: 350,
        leakage: 2,
        quality: 95
      },
      allocation: {
        "Downtown": 35,
        "North Area": 25,
        "East Side": 15,
        "South District": 20,
        "West Zone": 5,
      },
      alerts: []
    };
  }
}

/**
 * Analyze data using DeepSeek AI
 */
export async function analyzeWithAI(data: Record<string, unknown>, analysisType: string): Promise<AIAnalysisResult> {
  try {
    const response = await fetch('/api/ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data,
        analysisType
      }),
    });
    
    if (!response.ok) {
      throw new Error(`AI analysis error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error analyzing with AI:", error);
    
    // Return fallback analysis
    return {
      recommendations: [
        "Optimize traffic signals during peak hours",
        "Implement water conservation measures",
        "Increase renewable energy usage"
      ],
      insights: "Data shows above average congestion in downtown areas",
      forecast: "Resource usage trending upward with 15% projected increase"
    };
  }
}

export default {
  getTrafficData,
  getWeatherData,
  getWaterData,
  getResourceData,
  analyzeWithAI,
  clearCache
}; 