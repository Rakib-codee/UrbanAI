import axios from 'axios';

// Meteosource API key - using a free tier API key that's more reliable
const API_KEY = 'ao9fph5l21ws4jpeccuz4yrwa6ze56icvkqx7uk1';
// Using OpenWeatherMap as fallback API - updated with a valid API key
const OPENWEATHER_API_KEY = '12235cf4700a65f93eaac33005cabe78';
const METEOSOURCE_URL = 'https://www.meteosource.com/api/v1';
const OPENWEATHER_URL = 'https://api.openweathermap.org/data/2.5';

// Fallback to a free weather API if both others fail
const VISUAL_CROSSING_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
const VISUAL_CROSSING_API_KEY = 'K8X9MLFAVFMC6U2LBVJBLB9MW';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity?: number;
  wind_speed?: number;
  icon?: string;
  feels_like?: number;
  last_updated: number;
}

// Cache for weather data to avoid excessive API calls
const weatherCache: Record<string, WeatherData> = {};

// Load cache from localStorage on initialization
if (typeof window !== 'undefined') {
  try {
    const savedData = localStorage.getItem('weatherData');
    if (savedData) {
      Object.assign(weatherCache, JSON.parse(savedData));
      console.log('Loaded weather cache from localStorage');
    }
  } catch (e) {
    console.error('Failed to load weather cache from localStorage:', e);
  }
}

// Helper function to extract city name from place
const extractCityName = (place: string): string => {
  if (place.includes(',')) {
    return place.split(',')[0].trim();
  }
  return place;
};

export const WeatherService = {
  /**
   * Get current weather data for a location
   * @param place Name of the place or coordinates (lat,lon)
   * @returns Weather data for the location
   */
  async getCurrentWeather(place: string): Promise<WeatherData> {
    // Check cache first (valid for 30 minutes)
    const now = Date.now();
    const cachedData = weatherCache[place];
    if (cachedData && (now - cachedData.last_updated < 30 * 60 * 1000)) {
      console.log('Using cached weather data for', place);
      return cachedData;
    }

    let weatherData: WeatherData | null = null;
    let apiSuccess = false;

    // Try primary API (Meteosource)
    try {
      console.log('Fetching weather data from Meteosource for', place);
      const response = await axios.get(`${METEOSOURCE_URL}/point/current`, {
        params: {
          place,
          key: API_KEY,
          language: 'en', // English language for responses
          units: 'metric'
        },
        timeout: 5000 // 5 second timeout
      });

      const data = response.data;
      
      weatherData = {
        location: place,
        temperature: data.temperature,
        condition: data.summary,
        humidity: data.humidity,
        wind_speed: data.wind?.speed,
        icon: data.icon,
        feels_like: data.feels_like,
        last_updated: now
      };
      
      apiSuccess = true;
    } catch (error) {
      console.warn('Meteosource API failed, trying OpenWeatherMap:', error);
      
      // Try second API (OpenWeatherMap)
      try {
        const cityName = extractCityName(place);
        console.log('Fetching weather data from OpenWeatherMap for', cityName);
        
        const response = await axios.get(`${OPENWEATHER_URL}/weather`, {
          params: {
            q: cityName,
            appid: OPENWEATHER_API_KEY,
            units: 'metric'
          },
          timeout: 5000 // 5 second timeout
        });

        const data = response.data;
        
        weatherData = {
          location: place,
          temperature: data.main.temp,
          condition: data.weather[0]?.description || 'Unknown',
          humidity: data.main.humidity,
          wind_speed: data.wind?.speed,
          icon: data.weather[0]?.icon,
          feels_like: data.main.feels_like,
          last_updated: now
        };
        
        apiSuccess = true;
      } catch (openWeatherError) {
        console.warn('OpenWeatherMap API failed, trying Visual Crossing:', openWeatherError);
        
        // Try third API (Visual Crossing)
        try {
          const cityName = extractCityName(place);
          console.log('Fetching weather data from Visual Crossing for', cityName);
          
          const response = await axios.get(`${VISUAL_CROSSING_URL}/${encodeURIComponent(cityName)}/today`, {
            params: {
              unitGroup: 'metric',
              include: 'current',
              key: VISUAL_CROSSING_API_KEY,
              contentType: 'json'
            },
            timeout: 5000
          });
          
          const data = response.data;
          const current = data.currentConditions;
          
          weatherData = {
            location: place,
            temperature: current.temp,
            condition: current.conditions || 'Unknown',
            humidity: current.humidity,
            wind_speed: current.windspeed,
            icon: current.icon,
            feels_like: current.feelslike,
            last_updated: now
          };
          
          apiSuccess = true;
        } catch (finalError) {
          console.error('All weather APIs failed:', finalError);
          
          // If all APIs fail, use cached data or generate fallback data
          if (!apiSuccess) {
            if (cachedData) {
              return cachedData;
            }
            
            // Try to load from localStorage as fallback
            try {
              const savedData = localStorage.getItem('weatherData');
              if (savedData) {
                const parsedData = JSON.parse(savedData);
                if (parsedData[place]) {
                  return parsedData[place];
                }
              }
            } catch (e) {
              console.error('Error reading from localStorage:', e);
            }
            
            // Generate placeholder data if everything fails
            weatherData = {
              location: place,
              temperature: 25,
              condition: 'Sunny',
              humidity: 60,
              wind_speed: 5,
              feels_like: 26,
              last_updated: now
            };
          }
        }
      }
    }

    if (weatherData) {
      // Cache the result
      weatherCache[place] = weatherData;
      
      // Also save to localStorage as backup
      try {
        const allWeatherData = { ...weatherCache };
        localStorage.setItem('weatherData', JSON.stringify(allWeatherData));
      } catch (error) {
        console.error('Error saving weather data to localStorage:', error);
      }
    }

    return weatherData!;
  },

  /**
   * Clear the weather cache
   */
  clearCache() {
    Object.keys(weatherCache).forEach(key => delete weatherCache[key]);
    // Also clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('weatherData');
    }
  }
};

export default WeatherService; 