import { useMemo, useState, useEffect } from 'react';
import RealTimeChart from '@/components/dashboard/charts/RealTimeChart';
import TrendAnalysisChart from '@/components/dashboard/charts/TrendAnalysisChart';
import PredictionChart from '@/components/dashboard/charts/PredictionChart';
import { fetchRealTimeTrafficData, TrafficApiResponse } from '@/services/RealTimeDataService';
import { fetchTrafficTrendData, predictTrafficData, TrendDataPoint, PredictionDataPoint } from '@/services/AnalyticsService';

interface RealTimeTrafficMonitorProps {
  city: string;
  interval?: number;
}

export default function RealTimeTrafficMonitor({ 
  city,
  interval = 5 * 60 * 1000 // 5 minutes
}: RealTimeTrafficMonitorProps) {
  // State for trend and prediction data
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionDataPoint[]>([]);
  const [isLoadingTrend, setIsLoadingTrend] = useState(true);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(true);
  const [trendError, setTrendError] = useState<Error | null>(null);
  const [predictionError, setPredictionError] = useState<Error | null>(null);
  
  // Get API key from environment variable
  const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY || '';
  
  // Get coordinates for the city (hardcoded for now - ideally this would come from a geocoding service)
  const getCityCoordinates = (cityName: string): [number, number] => {
    const cityCoordinates: Record<string, [number, number]> = {
      'Dhaka': [23.8103, 90.4125],
      'Chattogram': [22.3569, 91.7832],
      'Khulna': [22.8456, 89.5403],
      'Beijing': [39.9042, 116.4074],
      'Shanghai': [31.2304, 121.4737],
      'New York': [40.7128, -74.0060],
      'London': [51.5074, -0.1278],
      'Tokyo': [35.6762, 139.6503],
      'Delhi': [28.6139, 77.2090],
      'Singapore': [1.3521, 103.8198]
    };
    
    return cityCoordinates[cityName] || [23.8103, 90.4125]; // Default to Dhaka
  };
  
  const [lat, lon] = getCityCoordinates(city.split(',')[0]);
  
  // Data fetcher function for real-time data
  const dataFetcher = useMemo(() => {
    return () => fetchRealTimeTrafficData(lat, lon, apiKey);
  }, [lat, lon, apiKey]);
  
  // Process traffic data for the real-time chart
  const processTrafficData = (rawData: unknown) => {
    const data = rawData as TrafficApiResponse;
    
    // Extract congestion value from the API response
    const incidents = data?.incidents || [];
    const congestionValue = incidents.length;
    const congestionLevel = data?.congestion?.level || 50;
    
    return [{
      time: new Date().toISOString(),
      value: congestionLevel || congestionValue
    }];
  };
  
  // Fetch trend and prediction data
  useEffect(() => {
    // Fetch trend data
    const fetchTrend = async () => {
      setIsLoadingTrend(true);
      try {
        const data = await fetchTrafficTrendData(lat, lon, 7, apiKey);
        setTrendData(data);
        setTrendError(null);
      } catch (error) {
        console.error('Error fetching traffic trend data:', error);
        setTrendError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoadingTrend(false);
      }
    };
    
    // Fetch prediction data
    const fetchPrediction = async () => {
      setIsLoadingPrediction(true);
      try {
        const data = await predictTrafficData(lat, lon, 5, apiKey);
        setPredictionData(data);
        setPredictionError(null);
      } catch (error) {
        console.error('Error fetching traffic prediction data:', error);
        setPredictionError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsLoadingPrediction(false);
      }
    };
    
    fetchTrend();
    fetchPrediction();
    
    // Refresh trend and prediction data less frequently than real-time data
    const trendInterval = setInterval(fetchTrend, 30 * 60 * 1000); // 30 minutes
    const predictionInterval = setInterval(fetchPrediction, 60 * 60 * 1000); // 1 hour
    
    return () => {
      clearInterval(trendInterval);
      clearInterval(predictionInterval);
    };
  }, [lat, lon, apiKey]);
  
  if (!apiKey) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
        <p>Error: TomTom API key is not set. Please add it to your environment variables.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <RealTimeChart
          title={`Real-Time Traffic Congestion in ${city}`}
          dataFetcher={dataFetcher}
          dataProcessor={processTrafficData}
          color="#EF4444" // Red color for traffic
          unit="level"
          interval={interval}
          historyPoints={30} // 30 data points history
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrendAnalysisChart
          title={`Traffic Congestion Trend (Last 7 Days) in ${city}`}
          trendData={trendData}
          color="#EF4444"
          unit="level"
          isLoading={isLoadingTrend}
          error={trendError}
        />
        
        <PredictionChart
          title={`Traffic Congestion Forecast for ${city}`}
          predictionData={predictionData}
          color="#EF4444"
          unit="level"
          isLoading={isLoadingPrediction}
          error={predictionError}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Traffic Alerts</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
              <p className="font-medium">High Congestion Alert</p>
              <p className="text-sm">Downtown area experiencing heavy traffic due to rush hour.</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Updated 3 min ago</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Traffic Forecast</h3>
          <div className="text-sm space-y-2">
            <p>Morning peak expected between <span className="font-medium">7:30 - 9:00 AM</span></p>
            <p>Evening peak expected between <span className="font-medium">5:00 - 7:30 PM</span></p>
            <div className="h-1 bg-gray-200 dark:bg-gray-700 w-full rounded-full mt-3">
              <div className="h-1 bg-blue-500 rounded-full" style={{ width: '40%' }}></div>
            </div>
            <p className="text-xs text-right">Current congestion: 40% of daily peak</p>
          </div>
        </div>
      </div>
    </div>
  );
}
