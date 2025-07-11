import axios from 'axios';
import { AirQualityData, WeatherData } from '@/types/weatherTypes';
import { clearCache as clearApiCache } from '@/services/apiService';
// Weather API interface
export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
  wind: {
    speed: number;
  };
  visibility: number;
  coord: {
    lat: number;
    lon: number;
  };
  name: string;
}

// Air quality API interface
export interface AirQualityData {
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
  }[];
}

// Define the stats item interface for better typing
export interface StatsItem {
  title: string;
  value: string;
  icon: string; // We'll use string here and convert to component in the dashboard
  bgColor: string;
  textColor: string;
}

interface TrafficDataPoint {
  name: string;
  value: number;
}

interface ResourceDataPoint {
  name: string;
  value: number;
}

interface GreenSpaceDataPoint {
  name: string;
  value: number;
}

// Weather condition mapping
interface WeatherConditionMapping {
  icon: string;
  label: string;
  textColor: string;
}

interface TrafficIncident {
  id: number;
  location: string;
  time: string;
  type: string;
  severity: string;
  status: string;
}

interface TrafficPrediction {
  congestionRate: number;
  averageSpeed: number;
  peakHours: {
    morning: string;
    evening: string;
  };
  recommendations: string[];
}

// Simple cache implementation
const cache: Record<string, {data: unknown, timestamp: number}> = {};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Traffic data generation (as real traffic API would require payment)
const generateTrafficData = (cityName: string) => {
  const cityHash = cityName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const hourlyData = [];
  
  for (let hour = 0; hour < 24; hour += 3) {
    // Generate realistic traffic pattern with morning and evening peaks
    let trafficValue = 40; // base value
    
    // Morning peak (7-9 AM)
    if (hour >= 6 && hour <= 9) {
      trafficValue = 75 + (cityHash % 20);
    } 
    // Evening peak (4-7 PM)
    else if (hour >= 15 && hour <= 18) {
      trafficValue = 85 + (cityHash % 15);
    }
    // Late night (11 PM - 5 AM)
    else if (hour >= 21 || hour <= 5) {
      trafficValue = 20 + (cityHash % 15);
    }
    
    // Add some city-specific variation
    trafficValue = Math.max(10, Math.min(100, Math.floor(trafficValue * (0.8 + (cityHash % 10) / 20))));
    
    hourlyData.push({
      name: `${hour.toString().padStart(2, '0')}:00`,
      value: trafficValue
    });
  }
  
  return hourlyData;
};

// Main location data service
export const LocationDataService = {
  // Get weather data for a location
  async getWeatherData(city: string): Promise<WeatherData | null> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'YOUR_API_KEY';
      
      // If API key is not set or is the default value, return fallback weather data
      if (!apiKey || apiKey === 'YOUR_API_KEY') {
        console.warn('OpenWeather API key not set. Using fallback weather data.');
        return this.getFallbackWeatherData(city);
      }
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      
      if (!response.ok) {
        console.error('Weather API error:', response.statusText);
        return this.getFallbackWeatherData(city);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return this.getFallbackWeatherData(city);
    }
  },
  
  // Provide fallback weather data
  getFallbackWeatherData(city: string): WeatherData {
    // Generate deterministic but city-specific weather data
    const cityHash = city.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    // Generate temperature between 5 and 35 degrees Celsius
    const temp = Math.min(35, Math.max(5, 20 + (cityHash % 30) - 15));
    
    // Generate humidity between 30% and 90%
    const humidity = Math.min(90, Math.max(30, 60 + (cityHash % 60) - 30));
    
    // Generate wind speed between 2 and 20 km/h
    const windSpeed = Math.min(20, Math.max(2, 8 + (cityHash % 16) - 8));
    
    // Possible weather conditions
    const conditions = ["Clear", "Clouds", "Rain", "Mist", "Snow", "Haze"];
    const conditionIndex = cityHash % conditions.length;
    
    // Generate latitude and longitude using the fallback coordinates function
    const coordinates = this.getFallbackCoordinates(city);
    
    return {
      main: {
        temp,
        humidity
      },
      weather: [
        {
          main: conditions[conditionIndex],
          description: `${conditions[conditionIndex].toLowerCase()} conditions`
        }
      ],
      wind: {
        speed: windSpeed
      },
      visibility: 10000 - (cityHash % 5000),
      coord: {
        lat: coordinates.lat,
        lon: coordinates.lon
      },
      name: city.split(',')[0].trim()
    };
  },
  
  // Get air quality data for a location
  async getAirQualityData(lat: number, lon: number): Promise<AirQualityData | null> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'YOUR_API_KEY';
      
      // If API key is not set or is the default value, return fallback air quality data
      if (!apiKey || apiKey === 'YOUR_API_KEY') {
        console.warn('OpenWeather API key not set. Using fallback air quality data.');
        return this.getFallbackAirQualityData(lat, lon);
      }
      
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
      );
      
      if (!response.ok) {
        console.error('Air Quality API error:', response.statusText);
        return this.getFallbackAirQualityData(lat, lon);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching air quality data:', error);
      return this.getFallbackAirQualityData(lat, lon);
    }
  },
  
  // Provide fallback air quality data
  getFallbackAirQualityData(lat: number, lon: number): AirQualityData {
    // Generate deterministic but location-specific air quality data
    const locationHash = Math.floor((lat + 90) * 180 + (lon + 180));
    
    // Generate AQI between 1 (good) and 5 (bad)
    const aqi = Math.min(5, Math.max(1, Math.floor(locationHash % 5) + 1));
    
    // Generate component values
    const pm25 = Math.min(100, Math.max(5, 20 + (locationHash % 80)));
    const pm10 = Math.min(150, Math.max(10, pm25 * 1.5 + (locationHash % 50)));
    const no2 = Math.min(200, Math.max(5, 30 + (locationHash % 100)));
    const so2 = Math.min(350, Math.max(5, 20 + (locationHash % 150)));
    const co = Math.min(10000, Math.max(200, 500 + (locationHash % 5000)));
    const o3 = Math.min(180, Math.max(20, 60 + (locationHash % 100)));
    
    return {
      list: [
        {
          main: {
            aqi
          },
          components: {
            co,
            no2,
            o3,
            so2,
            pm2_5: pm25,
            pm10,
            nh3: Math.floor(locationHash % 50)
          }
        }
      ]
    };
  },
  
  // Get geocoding data (coordinates) for a city name
  async getCoordinates(city: string): Promise<{lat: number, lon: number} | null> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'YOUR_API_KEY';
      
      // If API key is not set or is the default value, return fallback coordinates
      if (!apiKey || apiKey === 'YOUR_API_KEY') {
        console.warn('OpenWeather API key not set. Using fallback coordinates.');
        return this.getFallbackCoordinates(city);
      }
      
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
      );
      
      if (!response.ok) {
        console.error('Geocoding API error:', response.statusText);
        return this.getFallbackCoordinates(city);
      }
      
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: data[0].lat,
          lon: data[0].lon
        };
      }
      return this.getFallbackCoordinates(city);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      return this.getFallbackCoordinates(city);
    }
  },
  
  // Provide fallback coordinates based on city name
  getFallbackCoordinates(city: string): {lat: number, lon: number} {
    // Default coordinates map for major cities
    const cityCoordinates: Record<string, {lat: number, lon: number}> = {
      'Beijing': {lat: 39.9042, lon: 116.4074},
      'Shanghai': {lat: 31.2304, lon: 121.4737},
      'Guangzhou': {lat: 23.1291, lon: 113.2644},
      'Shenzhen': {lat: 22.5431, lon: 114.0579},
      'Chengdu': {lat: 30.5723, lon: 104.0665},
      'Tianjin': {lat: 39.3434, lon: 117.3616},
      'Chongqing': {lat: 29.4316, lon: 106.9123},
      'Wuhan': {lat: 30.5928, lon: 114.3055},
      'Xi\'an': {lat: 34.3416, lon: 108.9398},
      'Hangzhou': {lat: 30.2741, lon: 120.1551},
      'Dhaka': {lat: 23.8103, lon: 90.4125},
      'New York': {lat: 40.7128, lon: -74.0060},
      'London': {lat: 51.5074, lon: -0.1278},
      'Tokyo': {lat: 35.6762, lon: 139.6503},
      'Paris': {lat: 48.8566, lon: 2.3522},
      'Sydney': {lat: -33.8688, lon: 151.2093},
      'Singapore': {lat: 1.3521, lon: 103.8198}
    };
    
    // Look up the city in our map
    const cityKey = Object.keys(cityCoordinates).find(
      key => city.toLowerCase().includes(key.toLowerCase())
    );
    
    if (cityKey) {
      return cityCoordinates[cityKey];
    }
    
    // Generate deterministic but pseudo-random coordinates if city not found
    const cityHash = city.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    // Generate latitude between -90 and 90 degrees
    const lat = ((cityHash % 180) - 90) * (cityHash % 2 === 0 ? 1 : -1);
    // Generate longitude between -180 and 180 degrees
    const lon = ((cityHash * 2) % 360) - 180;
    
    return {lat, lon};
  },
  
  // Get traffic data for a city (simulated)
  getTrafficData(city: string): TrafficDataPoint[] {
    // Generate deterministic but city-specific traffic data
    console.log(`Generating traffic data for: ${city}`);
    
    // Get location update timestamp to ensure data changes when location changes
    const lastUpdate = typeof window !== 'undefined' ? (window as any).__lastLocationUpdate || Date.now() : Date.now();
    
    // City-specific modifiers to make data visibly different
    const cityModifiers: Record<string, number> = {
      'Dhaka': 1.35,      // High traffic
      'Chattogram': 1.1,  // Moderate high
      'Khulna': 0.95,     // Medium
      'Rajshahi': 0.85,   // Medium low
      'Sylhet': 0.8,      // Low
      'Beijing': 1.4,     // Very high
      'Shanghai': 1.3,    // High
      'Delhi': 1.45,      // Extremely high
      'Mumbai': 1.4,      // Very high
      'New York': 1.2,    // High
      'London': 1.15,     // Moderate high
      'Tokyo': 1.25       // High
    };
    
    // Extract city name without country part
    const cityName = city.split(',')[0].trim();
    
    // Get modifier for this city or default to 1.0
    const modifier = cityModifiers[cityName] || 1.0;
    
    // Generate hash based on city name - include lastUpdate timestamp to ensure change on location change
    const cityHash = city.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + (lastUpdate % 100);
    
    // Generate 24-hour traffic pattern with morning and evening peaks
    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      // Base traffic value
      let value = 30 + (cityHash % 20);
      
      // Morning rush hour (7-9 AM)
      if (hour >= 7 && hour <= 9) {
        value += 35 + (hour === 8 ? 15 : 0) + (cityHash % 15);
      }
      // Lunch hour (12-1 PM)
      else if (hour >= 12 && hour <= 13) {
        value += 20 + (cityHash % 10);
      }
      // Evening rush hour (5-7 PM)
      else if (hour >= 17 && hour <= 19) {
        value += 40 + (hour === 18 ? 15 : 0) + (cityHash % 15);
      }
      // Night time (10 PM - 5 AM)
      else if (hour >= 22 || hour <= 5) {
        value = Math.max(10, value - 25 - (cityHash % 10));
      }
      
      // Apply city-specific modifier
      value = Math.floor(value * modifier);
      
      return {
        name: `${hour}:00`,
        value: Math.min(100, Math.max(5, value)) // Cap between 5-100
      };
    });
    
    console.log(`Traffic data for ${cityName} generated with modifier: ${modifier}`);
    return hourlyData;
  },
  
  // Generate resource utilization data based on city
  getResourceData(city: string): ResourceDataPoint[] {
    // Generate deterministic but city-specific resource data
    const cityHash = city.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    // Different cities have different resource priorities
    const energyBase = 35 + (cityHash % 25);
    const waterBase = 25 + (cityHash % 20);
    const wasteBase = 20 + (cityHash % 15);
    const transportBase = 15 + (cityHash % 15);
    
    return [
      { name: "Energy", value: energyBase },
      { name: "Water", value: waterBase },
      { name: "Waste", value: wasteBase },
      { name: "Transport", value: transportBase }
    ];
  },
  
  // Calculate city efficiency score based on multiple factors
  calculateCityScore(weather: WeatherData | null, airQuality: AirQualityData | null, city: string): number {
    const cityHash = city.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    let score = 70; // Base score
    
    if (weather) {
      // Better weather conditions improve score
      if (weather.weather[0].main === 'Clear') score += 5;
      if (weather.weather[0].main === 'Clouds') score += 2;
      if (weather.weather[0].main === 'Rain' || weather.weather[0].main === 'Snow') score -= 3;
      
      // Extreme temperatures lower score
      const tempC = weather.main.temp;
      if (tempC > 30 || tempC < 5) score -= 5;
      else if (tempC > 15 && tempC < 25) score += 3;
    }
    
    if (airQuality) {
      // AQI score (1-5, with 1 being best)
      const aqi = airQuality.list[0].main.aqi;
      score += (6 - aqi) * 4; // Convert to positive impact
      
      // Penalize for high pollutants
      const pm25 = airQuality.list[0].components.pm2_5;
      if (pm25 > 50) score -= 7;
      else if (pm25 < 10) score += 5;
    }
    
    // Add city-specific variation
    score += (cityHash % 10) - 5;
    
    // Ensure score is within reasonable bounds
    return Math.max(50, Math.min(98, Math.floor(score)));
  },
  
  // Generate stats data for dashboard
  generateStats(city: string, weather: WeatherData | null): StatsItem[] {
    const cityHash = city.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    // Calculate active users based on city size
    const activeUsers = Math.floor(800 + (cityHash % 15) * 100);
    
    // Calculate projects based on city activity
    const projects = Math.floor(20 + (cityHash % 20));
    
    // Calculate usage time
    const usageHours = Math.floor(8 + (cityHash % 6)) + (cityHash % 10) / 10;
    
    // Calculate AI queries
    const aiQueries = Math.floor(700 + (cityHash % 30) * 25);
    
    // Adjust based on weather if available
    let weatherMultiplier = 1;
    if (weather) {
      if (weather.weather[0].main === 'Clear') weatherMultiplier = 1.1;
      else if (weather.weather[0].main === 'Rain' || weather.weather[0].main === 'Snow') weatherMultiplier = 0.9;
    }
    
    return [
      {
        title: "Active Users",
        value: Math.floor(activeUsers * weatherMultiplier).toLocaleString(),
        icon: "Users",
        bgColor: "bg-blue-500",
        textColor: "text-blue-500",
      },
      {
        title: "Completed Projects",
        value: Math.floor(projects * weatherMultiplier).toString(),
        icon: "CheckCircle",
        bgColor: "bg-green-500",
        textColor: "text-green-500",
      },
      {
        title: "Usage Time",
        value: `${usageHours.toFixed(1)} hrs`,
        icon: "Clock",
        bgColor: "bg-purple-500",
        textColor: "text-purple-500",
      },
      {
        title: "AI Queries",
        value: Math.floor(aiQueries * weatherMultiplier).toLocaleString(),
        icon: "MessageSquare",
        bgColor: "bg-amber-500",
        textColor: "text-amber-500",
      }
    ];
  },
  
  // Process air quality data into chart format
  processAirQualityData(airQuality: AirQualityData | null): { name: string; value: number }[] {
    if (!airQuality || !airQuality.list || !airQuality.list[0]) {
      // Generate random air quality data if API call failed
      const components = [
        { name: "PM2.5", value: Math.floor(Math.random() * 30) + 10 },
        { name: "PM10", value: Math.floor(Math.random() * 40) + 20 },
        { name: "NO2", value: Math.floor(Math.random() * 25) + 15 },
        { name: "O3", value: Math.floor(Math.random() * 35) + 25 },
        { name: "SO2", value: Math.floor(Math.random() * 15) + 5 }
      ];
      return components;
    }
    
    const { components } = airQuality.list[0];
    
    return [
      { name: "PM2.5", value: Math.round(components.pm2_5) },
      { name: "PM10", value: Math.round(components.pm10) },
      { name: "NO2", value: Math.round(components.no2) },
      { name: "O3", value: Math.round(components.o3) },
      { name: "SO2", value: Math.round(components.so2) }
    ];
  },
  
  // Green space data generation
  getGreenSpaceData(city: string): GreenSpaceDataPoint[] {
    // Generate deterministic but city-specific green space data
    console.log(`Generating green space data for: ${city}`);
    
    // Get location update timestamp to ensure data changes when location changes
    const lastUpdate = typeof window !== 'undefined' ? (window as any).__lastLocationUpdate || Date.now() : Date.now();
    
    // City-specific modifiers to make data visibly different
    const cityModifiers: Record<string, number> = {
      'Dhaka': 1.2,
      'Chattogram': 0.85,
      'Khulna': 1.35,
      'Rajshahi': 0.95,
      'Sylhet': 1.45,
      'Barishal': 1.1,
      'Rangpur': 0.75,
      'Beijing': 0.65,
      'Shanghai': 1.25,
      'Delhi': 0.9,
      'Mumbai': 1.15,
      'New York': 1.4,
      'London': 1.05,
      'Tokyo': 0.8
    };
    
    // Extract city name without country part
    const cityName = city.split(',')[0].trim();
    
    // Get modifier for this city or default to 1.0
    const modifier = cityModifiers[cityName] || 1.0;
    
    // Generate hash based on city name - include lastUpdate timestamp to ensure change on location change
    const cityHash = city.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + (lastUpdate % 100);
    
    // Add the city name to the generated data name to make it obvious which city's data we're showing
    const prefix = `${cityName}: `;
    
    // Different cities have different green space compositions with more variation
    const parksBase = Math.floor((35 + (cityHash % 20)) * modifier);
    const streetsBase = Math.floor((25 + (cityHash % 15)) * modifier);
    const gardensBase = Math.floor((20 + (cityHash % 15)) * modifier);
    const forestsBase = Math.floor((10 + (cityHash % 20)) * modifier);
    
    return [
      { name: `${prefix}Parks`, value: parksBase },
      { name: `${prefix}Street Trees`, value: streetsBase },
      { name: `${prefix}Community Gardens`, value: gardensBase },
      { name: `${prefix}Urban Forests`, value: forestsBase }
    ];
  },
  
  processWeatherData(weather: WeatherData | null, city: string): {
    temperature: number;
    conditions: string;
    humidity: number;
    windSpeed: number;
    location: string;
  } {
    if (!weather) {
      return {
        temperature: 25,
        conditions: "Clear",
        humidity: 60,
        windSpeed: 15,
        location: city
      };
    }
    
    return {
      temperature: Math.round(weather.main.temp),
      conditions: weather.weather[0].main,
      humidity: weather.main.humidity,
      windSpeed: Math.round(weather.wind.speed),
      location: weather.name
    };
  },
  
  // Get traffic incidents for a city
  getTrafficIncidents(city: string): TrafficIncident[] {
    // Generate deterministic but city-specific traffic incidents
    const cityHash = city.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    // Generate location names based on city
    const getLocationName = (index: number): string => {
      const locations = [
        "Main Street", "Central Avenue", "Park Road", "Downtown", "University District", 
        "North Junction", "West Bridge", "East Highway", "South Boulevard", "Market Square",
        "Industrial Zone", "Commercial District", "Riverside Drive", "Lake Road", "Station Road"
      ];
      
      // Make it city-specific by using hash
      const locationIndex = (cityHash + index * 3) % locations.length;
      return `${city} ${locations[locationIndex]}`;
    };
    
    // Generate time with city-specific offset
    const getTime = (index: number): string => {
      const hour = (7 + Math.floor((cityHash % 12) + index * 2.5) % 12);
      const minute = ((cityHash + index * 7) % 60).toString().padStart(2, '0');
      const period = hour >= 7 && hour < 19 ? "AM" : "PM";
      return `${hour === 0 ? 12 : hour}:${minute} ${period}`;
    };
    
    // Incident types
    const incidentTypes = ["Congestion", "Accident", "Road Closure", "Construction", "Public Event"];
    
    // Severity levels
    const severityLevels = ["Low", "Medium", "High"];
    
    // Status options
    const statusOptions = ["Ongoing", "Resolved", "Scheduled"];
    
    // Generate incidents based on city hash
    const incidentCount = 3 + (cityHash % 3); // 3-5 incidents
    const incidents: TrafficIncident[] = [];
    
    for (let i = 0; i < incidentCount; i++) {
      // Deterministic but seemingly random selection
      const typeIndex = (cityHash + i * 3) % incidentTypes.length;
      const severityIndex = (cityHash + i * 7) % severityLevels.length;
      const statusIndex = (cityHash + i * 11) % statusOptions.length;
      
      incidents.push({
        id: i + 1,
        location: getLocationName(i),
        time: getTime(i),
        type: incidentTypes[typeIndex],
        severity: severityLevels[severityIndex],
        status: statusOptions[statusIndex]
      });
    }
    
    return incidents;
  },
  
  // Get traffic prediction data for a city
  getTrafficPrediction(city: string): TrafficPrediction {
    // Generate deterministic but city-specific prediction
    const cityHash = city.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    
    // Calculate congestion rate (30-85%)
    const congestionRate = Math.min(85, Math.max(30, 45 + (cityHash % 40)));
    
    // Calculate average speed (15-45 km/h)
    const averageSpeed = Math.min(45, Math.max(15, 25 + (cityHash % 20)));
    
    // Calculate peak hours based on city (different cities have different rhythms)
    const morningStart = 7 + (cityHash % 2);
    const morningEnd = 9 + (cityHash % 2);
    const eveningStart = 17 + (cityHash % 2);
    const eveningEnd = 19 + (cityHash % 2);
    
    const peakHours = {
      morning: `${morningStart}:${cityHash % 2 === 0 ? '00' : '30'} - ${morningEnd}:00`,
      evening: `${eveningStart}:00 - ${eveningEnd}:${cityHash % 2 === 0 ? '30' : '00'}`
    };
    
    // Generate city-specific recommendations
    const allRecommendations = [
      "Implement congestion pricing in peak hours",
      "Optimize signal timing at key intersections",
      "Increase public transportation frequency on major routes",
      "Deploy traffic wardens at congestion hotspots",
      "Develop park-and-ride facilities at city entrances",
      "Expand bike lane network to reduce car dependency",
      "Introduce flexible work hours for businesses",
      "Create dedicated bus lanes on major arteries",
      "Improve real-time traffic information systems",
      "Develop smart parking solutions to reduce search traffic"
    ];
    
    // Select 4 recommendations based on city hash
    const recommendations = [];
    for (let i = 0; i < 4; i++) {
      const index = (cityHash + i * 13) % allRecommendations.length;
      recommendations.push(allRecommendations[index]);
    }
    
    return {
      congestionRate,
      averageSpeed,
      peakHours,
      recommendations
    };
  },
  
  // Clear cache
  clearCache() {
    try {
      console.log('LocationDataService: Clearing API cache...');
      
      // First try to call the apiService clearCache
      try {
        clearApiCache();
        console.log('✅ apiService cache cleared successfully');
      } catch (apiCacheError) {
        console.error('Error clearing apiService cache:', apiCacheError);
      }
      
      // Also clear local service data to force regeneration
      console.log('Forcing data regeneration for new location...');
      
      // A hacky way to make sure new data is generated with new location
      // We'll use a global timestamp to force recalculation
      (window as any).__lastLocationUpdate = Date.now();
      
      console.log('✅ LocationDataService cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },
  
  // Get real API data using environment variables
  async getRealApiData(endpoint: string, params: Record<string, string>) {
    try {
      // Get API keys from environment variables
      const weatherApiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const trafficApiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;
      const mapApiKey = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
      
      console.log(`🔑 Using API keys from .env.local for ${endpoint}`);
      
      // Construct URL based on endpoint
      let url = '';
      let headers = {};
      
      if (endpoint.includes('weather')) {
        // OpenWeather API
        url = `https://api.openweathermap.org/data/2.5/${endpoint}?appid=${weatherApiKey}`;
      } else if (endpoint.includes('traffic')) {
        // TomTom API
        url = `https://api.tomtom.com/traffic/services/${endpoint}/apiKey=${trafficApiKey}`;
        headers = {
          'Content-Type': 'application/json'
        };
      } else if (endpoint.includes('map')) {
        // Mapbox API
        url = `https://api.mapbox.com/${endpoint}?access_token=${mapApiKey}`;
      }
      
      // Add additional parameters
      Object.keys(params).forEach(key => {
        url += `&${key}=${params[key]}`;
      });
      
      console.log(`🌐 Fetching real data from: ${url}`);
      
      // Make API call
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching real API data for ${endpoint}:`, error);
      return null;
    }
  }
};

export default LocationDataService; 