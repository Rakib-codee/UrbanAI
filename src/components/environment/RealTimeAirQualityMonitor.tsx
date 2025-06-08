import { useMemo, useState, useEffect } from 'react';
import RealTimeChart from '@/components/dashboard/charts/RealTimeChart';
import TrendAnalysisChart from '@/components/dashboard/charts/TrendAnalysisChart';
import PredictionChart from '@/components/dashboard/charts/PredictionChart';
import { fetchRealTimeAirQualityData, AirQualityApiResponse } from '@/services/RealTimeDataService';
import { fetchAirQualityTrendData, predictAirQualityData, TrendDataPoint, PredictionDataPoint } from '@/services/AnalyticsService';

interface RealTimeAirQualityMonitorProps {
  lat: number;
  lon: number;
  cityName: string;
  interval?: number;
}

export default function RealTimeAirQualityMonitor({ 
  lat,
  lon,
  cityName,
  interval = 30 * 60 * 1000 // 30 minutes
}: RealTimeAirQualityMonitorProps) {
  // State for trend and prediction data
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionDataPoint[]>([]);
  const [isLoadingTrend, setIsLoadingTrend] = useState(true);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(true);
  const [trendError, setTrendError] = useState<Error | null>(null);
  const [predictionError, setPredictionError] = useState<Error | null>(null);
  
  // Get API key from environment variable
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';
  
  // Data fetcher function
  const dataFetcher = useMemo(() => {
    return () => fetchRealTimeAirQualityData(lat, lon, apiKey);
  }, [lat, lon, apiKey]);
  
  // Process air quality data for the chart
  const processAirQualityData = (rawData: unknown) => {
    const data = rawData as AirQualityApiResponse;
    
    if (!data || !data.list || !data.list[0]) {
      return [{
        time: new Date().toISOString(),
        value: 0
      }];
    }
    
    const airQualityData = data.list[0];
    
    // Calculate a combined air quality value (simplified example)
    // In reality, this might be more complex based on the AQI calculation
    const components = airQualityData.components || {};
    const pm25Value = components.pm2_5 || 0;
    
    return [{
      time: new Date().toISOString(),
      value: pm25Value
    }];
  };
  
  // Fetch trend and prediction data
  useEffect(() => {
    // Fetch trend data
    const fetchTrend = async () => {
      setIsLoadingTrend(true);
      try {
        const data = await fetchAirQualityTrendData(lat, lon, 7, apiKey);
        setTrendData(data);
        setTrendError(null);
      } catch (error) {
        console.error('Error fetching air quality trend data:', error);
        setTrendError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoadingTrend(false);
      }
    };
    
    // Fetch prediction data
    const fetchPrediction = async () => {
      setIsLoadingPrediction(true);
      try {
        const data = await predictAirQualityData(lat, lon, 5, apiKey);
        setPredictionData(data);
        setPredictionError(null);
      } catch (error) {
        console.error('Error fetching air quality prediction data:', error);
        setPredictionError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoadingPrediction(false);
      }
    };
    
    fetchTrend();
    fetchPrediction();
    
    // Refresh trend and prediction data less frequently than real-time data
    const trendInterval = setInterval(fetchTrend, 60 * 60 * 1000); // 1 hour
    const predictionInterval = setInterval(fetchPrediction, 3 * 60 * 60 * 1000); // 3 hours
    
    return () => {
      clearInterval(trendInterval);
      clearInterval(predictionInterval);
    };
  }, [lat, lon, apiKey]);
  
  if (!apiKey) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
        <p>Error: OpenWeather API key is not set. Please add it to your environment variables.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <RealTimeChart
          title={`Real-Time Air Quality (PM2.5) in ${cityName}`}
          dataFetcher={dataFetcher}
          dataProcessor={processAirQualityData}
          color="#10B981" // Green color for air quality
          unit="μg/m³"
          interval={interval}
          historyPoints={24} // 24 data points history
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrendAnalysisChart
          title={`Air Quality Trend (Last 7 Days) in ${cityName}`}
          trendData={trendData}
          color="#10B981"
          unit="μg/m³"
          isLoading={isLoadingTrend}
          error={trendError}
        />
        
        <PredictionChart
          title={`Air Quality Forecast for ${cityName}`}
          predictionData={predictionData}
          color="#10B981"
          unit="μg/m³"
          isLoading={isLoadingPrediction}
          error={predictionError}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">PM2.5</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold">27</span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">μg/m³</span>
          </div>
          <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 w-full rounded-full">
            <div className="h-1 bg-yellow-500 rounded-full" style={{ width: '54%' }}></div>
          </div>
          <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">Moderate</p>
        </div>
        
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Ozone (O₃)</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold">41</span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">μg/m³</span>
          </div>
          <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 w-full rounded-full">
            <div className="h-1 bg-green-500 rounded-full" style={{ width: '30%' }}></div>
          </div>
          <p className="mt-1 text-xs text-green-600 dark:text-green-400">Good</p>
        </div>
        
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">NO₂</h3>
          <div className="flex items-end">
            <span className="text-3xl font-bold">18</span>
            <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">μg/m³</span>
          </div>
          <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 w-full rounded-full">
            <div className="h-1 bg-green-500 rounded-full" style={{ width: '20%' }}></div>
          </div>
          <p className="mt-1 text-xs text-green-600 dark:text-green-400">Good</p>
        </div>
      </div>
    </div>
  );
}
