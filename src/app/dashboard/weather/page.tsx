"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Sun,
  Cloud,
  CloudRain,
  Thermometer,
  Wind,
  Droplets,
  CloudFog,
  CloudLightning,
  CloudSnow,
  ArrowUpRight,
  ArrowDownRight,
  Compass
} from "lucide-react";
import { useUrbanData } from "@/components/UrbanContext";

// Define weather types for the forecast
type WeatherCondition = "clear" | "clouds" | "rain" | "drizzle" | "thunderstorm" | "snow" | "mist" | "fog";
type ForecastType = "hourly" | "daily" | "trends";

interface WeatherForecastProps {
  date: string;
  time?: string;
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  precipitation: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  high?: number;
  low?: number;
}

// Define hourly forecast data structure
interface HourlyForecastData {
  temperature: number;
  feelsLike: number;
  condition: string;
  precipitation: number;
  humidity: number;
  wind: {
    speed: number;
    direction: string;
  };
}

// Define API weather data structure
interface WeatherApiData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  conditions: string;
  airQuality: number;
  feelsLike?: number;
  precipitation?: number;
  wind?: {
    speed: number;
    direction: string;
  };
}

interface ForecastApiData {
  date: string;
  maxTemp: number;
  minTemp: number;
  precipitation: number;
  conditions: string;
  hourly?: HourlyForecastData[];
  daily?: ForecastApiData[];
}

export default function WeatherForecastPage() {
  const { darkMode, data, loading, location } = useUrbanData();
  const [forecastType, setForecastType] = useState<ForecastType>("hourly");
  const [selectedDay, setSelectedDay] = useState(0);

  // Get the weather icon based on condition
  const getWeatherIcon = (condition: WeatherCondition) => {
    switch (condition) {
      case "clear": return <Sun className="w-6 h-6 text-yellow-500" />;
      case "clouds": return <Cloud className="w-6 h-6 text-gray-500" />;
      case "rain": return <CloudRain className="w-6 h-6 text-blue-500" />;
      case "drizzle": return <CloudRain className="w-6 h-6 text-blue-400" />;
      case "thunderstorm": return <CloudLightning className="w-6 h-6 text-purple-500" />;
      case "snow": return <CloudSnow className="w-6 h-6 text-blue-200" />;
      case "mist":
      case "fog": return <CloudFog className="w-6 h-6 text-gray-400" />;
      default: return <Cloud className="w-6 h-6 text-gray-500" />;
    }
  };

  // Mock forecast data (would come from the API in a real implementation)
  const generateMockForecast = (): {
    current: WeatherForecastProps;
    hourly: WeatherForecastProps[];
    daily: WeatherForecastProps[];
  } => {
    // Map real weather data from UrbanContext to the expected types
    const contextWeather = data?.weather?.current;
    const contextForecast = data?.weather?.forecast;
    
    // Create correctly typed data from the context data
    const weatherData: WeatherApiData | null = contextWeather ? {
      temperature: contextWeather.temp,
      humidity: contextWeather.humidity,
      windSpeed: contextWeather.wind,
      conditions: contextWeather.condition,
      airQuality: 75, // Default air quality if not available
      feelsLike: contextWeather.feelsLike,
      wind: {
        speed: contextWeather.wind,
        direction: "N" // Default direction if not available
      }
    } : null;
    
    // Map forecast data
    const forecast: ForecastApiData[] | null = contextForecast ? 
      contextForecast.map(day => ({
        date: day.date,
        maxTemp: day.high,
        minTemp: day.low,
        precipitation: day.precipitation,
        conditions: day.condition
      })) : null;
    
    // Current weather based on API data or fallback
    const current: WeatherForecastProps = weatherData ? {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: weatherData.temperature,
      feelsLike: weatherData.feelsLike || weatherData.temperature - 1,
      condition: (weatherData.conditions?.toLowerCase() as WeatherCondition) || "clear",
      precipitation: weatherData.precipitation || 0,
      humidity: weatherData.humidity,
      windSpeed: weatherData.wind?.speed || weatherData.windSpeed,
      windDirection: weatherData.wind?.direction || "N"
    } : {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: 23,
      feelsLike: 25,
      condition: "clear",
      precipitation: 0,
      humidity: 60,
      windSpeed: 10,
      windDirection: "NE"
    };
    
    // Generate hourly forecast
    const hourly: WeatherForecastProps[] = [];
    for (let i = 1; i <= 24; i++) {
      const hour = new Date();
      hour.setHours(hour.getHours() + i);
      
      // Add mock data since real API integration would be more complex
      hourly.push({
        date: hour.toLocaleDateString(),
        time: hour.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: Math.round(current.temperature + (Math.random() * 6 - 3)),
        feelsLike: Math.round(current.temperature + (Math.random() * 4 - 1)),
        condition: i % 8 === 0 ? "clouds" : i % 7 === 0 ? "rain" : "clear",
        precipitation: i % 7 === 0 ? Math.round(Math.random() * 80) : 0,
        humidity: Math.round(current.humidity + (Math.random() * 20 - 10)),
        windSpeed: Math.round(current.windSpeed + (Math.random() * 8 - 4)),
        windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)]
      });
    }
    
    // Generate daily forecast
    const daily: WeatherForecastProps[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date();
      day.setDate(day.getDate() + i);
      
      // In a real implementation, this would come from forecast[i]
      const realDailyData = forecast && i < forecast.length ? forecast[i] : null;
      
      daily.push(realDailyData ? {
        date: day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
        temperature: (realDailyData.maxTemp + realDailyData.minTemp) / 2,
        feelsLike: (realDailyData.maxTemp + realDailyData.minTemp) / 2 + 1,
        condition: (realDailyData.conditions?.toLowerCase() as WeatherCondition) || "clear",
        precipitation: realDailyData.precipitation || 0,
        humidity: 65, // Default value as it might not be available in the API
        windSpeed: 10, // Default value as it might not be available in the API
        windDirection: "N", // Default value as it might not be available in the API
        high: realDailyData.maxTemp,
        low: realDailyData.minTemp
      } : {
        date: day.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
        temperature: Math.round(22 + (Math.random() * 10 - 5)),
        feelsLike: Math.round(23 + (Math.random() * 8 - 4)),
        condition: i % 7 === 0 ? "rain" : i % 5 === 0 ? "clouds" : "clear",
        precipitation: i % 7 === 0 ? Math.round(Math.random() * 70) : 0,
        humidity: Math.round(60 + (Math.random() * 20 - 10)),
        windSpeed: Math.round(8 + (Math.random() * 10 - 5)),
        windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
        high: Math.round(26 + (Math.random() * 8 - 4)),
        low: Math.round(18 + (Math.random() * 6 - 3))
      });
    }
    
    return { current, hourly, daily };
  };

  const forecast = generateMockForecast();

  // Get the current day weather data
  const getSelectedDayData = () => {
    return forecast.daily[selectedDay];
  };

  // Render hourly forecast
  const renderHourlyForecast = () => {
    return (
      <div className="overflow-x-auto -mx-6 px-6">
        <div className="inline-block min-w-full">
          <div className="flex space-x-4 pb-4">
            {forecast.hourly.map((hour, index) => (
              <div 
                key={index}
                className={`p-4 rounded-xl min-w-[100px] text-center ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                } shadow-sm`}
              >
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">{hour.time}</div>
                <div className="flex justify-center my-2">
                  {getWeatherIcon(hour.condition)}
                </div>
                <div className="font-bold text-2xl mb-1">{hour.temperature}°</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {hour.precipitation > 0 ? `${hour.precipitation}% rain` : 'No rain'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render daily forecast
  const renderDailyForecast = () => {
    return (
      <div className="space-y-4">
        {forecast.daily.map((day, index) => (
          <div 
            key={index}
            onClick={() => setSelectedDay(index)}
            className={`p-4 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
              selectedDay === index
                ? darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                : darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-sm hover:${darkMode ? 'bg-gray-750' : 'bg-gray-50'}`}
          >
            <div className="flex items-center space-x-4">
              <div className="w-10">
                {getWeatherIcon(day.condition)}
              </div>
              <div>
                <div className="font-medium">{index === 0 ? "Today" : day.date}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {day.condition.charAt(0).toUpperCase() + day.condition.slice(1)}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {day.precipitation > 0 ? `${day.precipitation}%` : ''}
              </div>
              <div className="flex space-x-2">
                <span className="font-bold">{day.high}°</span>
                <span className="text-gray-500 dark:text-gray-400">{day.low}°</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render weather trends
  const renderWeatherTrends = () => {
    const trendCategories = [
      { name: "Temperature", icon: Thermometer, data: [22, 24, 25, 27, 26, 25, 23], unit: "°C", color: "text-red-500" },
      { name: "Precipitation", icon: CloudRain, data: [10, 20, 70, 80, 40, 10, 5], unit: "%", color: "text-blue-500" },
      { name: "Humidity", icon: Droplets, data: [65, 70, 75, 80, 75, 70, 65], unit: "%", color: "text-cyan-500" },
      { name: "Wind Speed", icon: Wind, data: [10, 12, 15, 8, 10, 14, 16], unit: "km/h", color: "text-teal-500" }
    ];

    // Get day labels for the chart
    const dayLabels = forecast.daily.map((day, index) => {
      return index === 0 ? "Today" : day.date.split(',')[0];
    });

    return (
      <div className="space-y-8">
        {trendCategories.map((category, catIndex) => (
          <div key={catIndex} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
            <div className="flex items-center mb-4">
              <category.icon className={`w-5 h-5 mr-2 ${category.color}`} />
              <h3 className="font-medium">{category.name} Trend</h3>
            </div>
            
            {/* Chart */}
            <div className="h-40 relative mt-6">
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex justify-between h-full">
                {category.data.map((value, index) => {
                  // Calculate height percentage
                  const max = Math.max(...category.data);
                  const height = (value / max) * 100;
                  
                  return (
                    <div key={index} className="flex flex-col items-center justify-end flex-1">
                      <div 
                        className={`w-6 rounded-t-md ${catIndex === 0 ? 'bg-red-500' : catIndex === 1 ? 'bg-blue-500' : catIndex === 2 ? 'bg-cyan-500' : 'bg-teal-500'}`} 
                        style={{ height: `${height}%` }}
                      ></div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">{dayLabels[index]}</div>
                    </div>
                  );
                })}
              </div>
              
              {/* Y-axis labels */}
              <div className="absolute top-0 left-0 h-full flex flex-col justify-between pointer-events-none text-xs text-gray-500 dark:text-gray-400">
                <div>Max: {Math.max(...category.data)}{category.unit}</div>
                <div>Min: {Math.min(...category.data)}{category.unit}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render current weather details
  const renderCurrentWeather = () => {
    const selectedData = selectedDay === 0 ? forecast.current : getSelectedDayData();
    
    return (
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm mb-6`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg text-gray-500 dark:text-gray-400">
              {selectedDay === 0 ? 'Current Weather' : forecast.daily[selectedDay].date}
            </h2>
            <div className="flex items-center mt-2">
              <div className="text-5xl font-bold mr-4">{selectedData.temperature}°C</div>
              <div>
                {getWeatherIcon(selectedData.condition)}
              </div>
            </div>
            <div className="mt-2 text-gray-500 dark:text-gray-400">
              Feels like {selectedData.feelsLike}°C • {selectedData.condition.charAt(0).toUpperCase() + selectedData.condition.slice(1)}
            </div>
          </div>
          
          {selectedDay === 0 && (
            <div className="flex flex-wrap gap-4">
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center`}>
                <ArrowUpRight className="w-4 h-4 mr-2 text-red-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">High</div>
                  <div className="font-bold">{forecast.daily[0].high}°</div>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center`}>
                <ArrowDownRight className="w-4 h-4 mr-2 text-blue-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Low</div>
                  <div className="font-bold">{forecast.daily[0].low}°</div>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center`}>
                <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Humidity</div>
                  <div className="font-bold">{selectedData.humidity}%</div>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center`}>
                <Wind className="w-4 h-4 mr-2 text-teal-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Wind</div>
                  <div className="font-bold">{selectedData.windSpeed} km/h</div>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center`}>
                <Compass className="w-4 h-4 mr-2 text-purple-500" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Direction</div>
                  <div className="font-bold">{selectedData.windDirection}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm py-4 px-6`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className={`flex items-center ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="text-xl font-bold flex items-center">
            <Cloud className="w-6 h-6 mr-2 text-blue-500" />
            Weather Forecast
          </h1>
          <div className="w-[100px]">
            {/* Empty div for layout balance */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className={`h-12 w-12 rounded-full border-4 border-t-transparent ${darkMode ? 'border-white' : 'border-gray-800'} animate-spin`}></div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Location */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{String(location)}</h2>
              <p className="text-gray-500 dark:text-gray-400">
                {new Date().toLocaleDateString(undefined, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Current Weather */}
            {renderCurrentWeather()}

            {/* Forecast Type Selector */}
            <div className="mb-6">
              <div className={`inline-flex p-1 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {(['hourly', 'daily', 'trends'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setForecastType(type)}
                    className={`px-4 py-2 rounded-lg ${
                      forecastType === type
                        ? 'bg-blue-600 text-white'
                        : ''
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Weather Content based on selected type */}
            <motion.div
              key={forecastType}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              {forecastType === 'hourly' && renderHourlyForecast()}
              {forecastType === 'daily' && renderDailyForecast()}
              {forecastType === 'trends' && renderWeatherTrends()}
            </motion.div>

            {/* Weather Advisory */}
            <div className={`p-4 rounded-xl border-l-4 border-amber-500 ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'} mb-6`}>
              <h3 className="font-medium text-amber-700 dark:text-amber-300 mb-1">Weather Advisory</h3>
              <p className="text-sm">
                {forecast.daily.some(day => day.condition === "rain") 
                  ? "Rainfall expected in the coming days. Plan outdoor activities accordingly."
                  : "No severe weather conditions expected in the next 7 days."}
              </p>
            </div>

            {/* Data Sources */}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Weather data provided by OpenWeatherMap API. Last updated: {new Date().toLocaleTimeString()}
            </div>
          </>
        )}
      </main>
    </div>
  );
} 