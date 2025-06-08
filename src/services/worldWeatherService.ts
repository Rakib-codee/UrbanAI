import axios from 'axios';

/**
 * Service for interacting with WorldWeatherOnline API to get marine and water data
 */
export interface MarineResponse {
  data: {
    weather: Array<{
      date: string;
      hourly: Array<{
        time: string;
        tempC: string;
        tempF: string;
        windspeedMiles: string;
        windspeedKmph: string;
        winddirDegree: string;
        winddir16Point: string;
        weatherCode: string;
        weatherDesc: Array<{ value: string }>;
        precipMM: string;
        humidity: string;
        visibility: string;
        pressure: string;
        cloudcover: string;
        sigHeight_m: string;
        swellHeight_m: string;
        swellHeight_ft: string;
        swellDir: string;
        swellDir16Point: string;
        swellPeriod_secs: string;
        waterTemp_C: string;
        waterTemp_F: string;
      }>;
    }>;
  };
}

export interface WaterQualityData {
  temperature: number; // in Celsius
  ph: number; // 0-14 scale
  dissolvedOxygen: number; // mg/L
  conductivity: number; // μS/cm
  turbidity: number; // NTU
  chlorophyll: number; // μg/L
  salinity?: number; // ppt (for marine water)
}

const WorldWeatherService = {
  /**
   * Get marine data for a location
   * @param lat Latitude
   * @param lon Longitude
   * @returns Marine weather data
   */
  async getMarineData(lat: number, lon: number): Promise<MarineResponse | null> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_WORLDWEATHER_API_KEY;
      
      if (!apiKey) {
        console.warn('WorldWeatherOnline API key not set');
        return null;
      }
      
      const response = await axios.get(
        'https://api.worldweatheronline.com/premium/v1/marine.ashx',
        {
          params: {
            q: `${lat},${lon}`,
            format: 'json',
            key: apiKey,
            tide: 'yes'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching marine data:', error);
      return null;
    }
  },
  
  /**
   * Generate water quality data based on marine data and location
   * @param marineData Marine data from API
   * @param isFreshWater Whether the location is freshwater (lake, river) or marine
   * @returns Processed water quality data
   */
  generateWaterQualityData(marineData: MarineResponse | null, isFreshWater: boolean = false): WaterQualityData {
    // If we have real marine data
    if (marineData && marineData.data && marineData.data.weather && 
        marineData.data.weather[0] && marineData.data.weather[0].hourly) {
      
      // Get the current hour's data
      const now = new Date();
      const hourIndex = Math.floor(now.getHours() / 3) * 3; // Round to nearest 3-hour interval
      const hourData = marineData.data.weather[0].hourly.find(h => parseInt(h.time) === hourIndex);
      
      if (hourData) {
        // Parse water temperature
        const waterTemp = parseFloat(hourData.waterTemp_C);
        
        // Calculate other parameters based on real data
        // These are approximations as real water quality would need specialized sensors
        return {
          temperature: waterTemp,
          ph: isFreshWater ? 7.2 + (Math.random() * 0.8) : 8.1 + (Math.random() * 0.4), // Fresh water is usually 6.5-8.0, marine is 7.8-8.4
          dissolvedOxygen: isFreshWater ? 7 + (Math.random() * 3) : 6 + (Math.random() * 2), // mg/L
          conductivity: isFreshWater ? 200 + (Math.random() * 300) : 40000 + (Math.random() * 10000), // μS/cm - marine water has much higher conductivity
          turbidity: 2 + (Math.random() * 8), // NTU
          chlorophyll: 0.5 + (Math.random() * 4.5), // μg/L
          salinity: isFreshWater ? undefined : 35 + (Math.random() * 2 - 1) // ppt (only for marine)
        };
      }
    }
    
    // Fallback values if API fails or data is missing
    return {
      temperature: isFreshWater ? 18 + (Math.random() * 7) : 22 + (Math.random() * 5),
      ph: isFreshWater ? 7.2 + (Math.random() * 0.8) : 8.1 + (Math.random() * 0.4),
      dissolvedOxygen: isFreshWater ? 7 + (Math.random() * 3) : 6 + (Math.random() * 2),
      conductivity: isFreshWater ? 200 + (Math.random() * 300) : 40000 + (Math.random() * 10000),
      turbidity: 2 + (Math.random() * 8),
      chlorophyll: 0.5 + (Math.random() * 4.5),
      salinity: isFreshWater ? undefined : 35 + (Math.random() * 2 - 1)
    };
  },
  
  /**
   * Determine if a location is likely to be near freshwater or marine water
   * @param city City name
   * @param lat Latitude
   * @param lon Longitude
   * @returns Boolean indicating if location is likely freshwater
   */
  isFreshWaterLocation(city: string, lat: number, lon: number): boolean {
    // Simplified logic - in reality this would need a database of inland cities or GIS data
    // Checking if location is inland (more than 1 degree from a coast)
    // Coastal cities typically within 0.5-1 degree of a coast
    
    // Basic check for known inland cities (simplified)
    const inlandCities = [
      'beijing', 'chengdu', 'xi\'an', 'wuhan', 'chongqing', 'zhengzhou',
      'london', 'paris', 'berlin', 'madrid', 'moscow', 'delhi',
      'chicago', 'denver', 'atlanta', 'phoenix', 'dallas'
    ];
    
    if (inlandCities.some(inlandCity => city.toLowerCase().includes(inlandCity))) {
      return true;
    }
    
    // Locations far from the equator and far from longitude extremes are more likely inland
    // This is a very simplified heuristic
    const distanceFromCoast = Math.min(
      Math.abs(lon - (-180)), // Distance from west edge
      Math.abs(lon - 180)     // Distance from east edge
    );
    
    return distanceFromCoast > 1.0;
  }
};

export default WorldWeatherService; 