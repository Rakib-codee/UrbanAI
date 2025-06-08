'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ActionableInsights from '@/components/insights/ActionableInsights';
import { 
  fetchRealTimeTrafficData, 
  fetchRealTimeAirQualityData,
  TrafficApiResponse,
  AirQualityApiResponse
} from '@/services/RealTimeDataService';
import { 
  fetchTrafficTrendData, 
  fetchAirQualityTrendData,
  predictTrafficData,
  predictAirQualityData,
  TrendDataPoint,
  PredictionDataPoint
} from '@/services/AnalyticsService';
import { getCurrentLocation } from '@/services/apiService';

export default function InsightsPage() {
  // City
  const [city, setCity] = useState('Dhaka');
  
  // Data states
  const [trafficData, setTrafficData] = useState<{
    realtime: TrafficApiResponse | null;
    trend: TrendDataPoint[];
    prediction: PredictionDataPoint[];
  }>({
    realtime: null,
    trend: [],
    prediction: []
  });
  
  const [airQualityData, setAirQualityData] = useState<{
    realtime: AirQualityApiResponse | null;
    trend: TrendDataPoint[];
    prediction: PredictionDataPoint[];
  }>({
    realtime: null,
    trend: [],
    prediction: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // API keys
  const trafficApiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || '';
  const airQualityApiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';
  
  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get location from API service
        const location = getCurrentLocation();
        setCity(location.city + ', ' + location.country);
        
        const [lat, lon] = [location.latitude, location.longitude];
        
        // Fetch all data in parallel
        const [
          trafficRealtimeData,
          trafficTrendData,
          trafficPredictionData,
          airQualityRealtimeData,
          airQualityTrendData,
          airQualityPredictionData
        ] = await Promise.all([
          fetchRealTimeTrafficData(lat, lon, trafficApiKey),
          fetchTrafficTrendData(lat, lon, 7, trafficApiKey),
          predictTrafficData(lat, lon, 5, trafficApiKey),
          fetchRealTimeAirQualityData(lat, lon, airQualityApiKey),
          fetchAirQualityTrendData(lat, lon, 7, airQualityApiKey),
          predictAirQualityData(lat, lon, 5, airQualityApiKey)
        ]);
        
        // Update state with fetched data
        setTrafficData({
          realtime: trafficRealtimeData,
          trend: trafficTrendData,
          prediction: trafficPredictionData
        });
        
        setAirQualityData({
          realtime: airQualityRealtimeData,
          trend: airQualityTrendData,
          prediction: airQualityPredictionData
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [trafficApiKey, airQualityApiKey]);
  
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Actionable Insights for {city}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            AI-powered recommendations, alerts, and reports based on real-time data.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg">
            <p>Error loading insights: {error.message}</p>
            <p className="mt-2">Please check your internet connection and try again.</p>
          </div>
        ) : (
          <ActionableInsights 
            cityName={city}
            trafficData={trafficData}
            airQualityData={airQualityData}
          />
        )}
      </div>
    </DashboardLayout>
  );
} 