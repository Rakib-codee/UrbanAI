'use client';

import { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';
import WeatherService from '@/services/weatherService';

interface WeatherDisplayProps {
  location: string;
  className?: string;
}

export default function WeatherDisplay({ location, className = '' }: WeatherDisplayProps) {
  const [weatherData, setWeatherData] = useState<{
    temperature?: number;
    condition?: string;
    humidity?: number;
    wind_speed?: number;
    feels_like?: number;
    icon?: string;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!location) return;
      
      setLoading(true);
      try {
        const data = await WeatherService.getCurrentWeather(location);
        setWeatherData({
          temperature: data.temperature,
          condition: data.condition,
          humidity: data.humidity,
          wind_speed: data.wind_speed,
          feels_like: data.feels_like,
          icon: data.icon
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  // Helper function to determine which weather icon to show
  const getWeatherIcon = () => {
    if (!weatherData.condition) return <Cloud className="w-5 h-5" />;
    
    const condition = weatherData.condition.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('雨')) {
      return <CloudRain className="w-5 h-5 text-blue-500" />;
    } else if (condition.includes('cloud') || condition.includes('阴') || condition.includes('云')) {
      return <Cloud className="w-5 h-5 text-gray-500" />;
    } else if (condition.includes('wind') || condition.includes('风')) {
      return <Wind className="w-5 h-5 text-teal-500" />;
    } else {
      return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-sm text-red-500 ${className}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex items-center mr-3">
        {getWeatherIcon()}
        <span className="ml-1 font-medium">
          {weatherData.temperature !== undefined ? `${weatherData.temperature}°C` : '--'}
        </span>
      </div>
      <div className="text-xs text-gray-500">
        <div>{weatherData.condition || 'Weather data'}</div>
        <div className="flex items-center">
          <Thermometer className="w-3 h-3 mr-1" />
          <span>Feels like: {weatherData.feels_like !== undefined ? `${weatherData.feels_like}°C` : '--'}</span>
        </div>
      </div>
    </div>
  );
} 