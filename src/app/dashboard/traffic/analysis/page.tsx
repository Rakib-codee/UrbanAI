'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, BarChart2, TrendingUp, Clock, Calendar, Map, AlertTriangle, Download, RefreshCw, Play, Pause, AlertCircle, BrainCircuit, Search, MapPin, Locate } from 'lucide-react';
import Link from 'next/link';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TrafficMenu from '@/components/traffic/TrafficMenu';
import { format, subDays, parseISO } from 'date-fns';
import { fetchTrafficTrendData, predictTrafficData } from '@/services/AnalyticsService';
import CompareTraffic from '@/components/traffic/CompareTraffic';
import LocationHeatMap from '@/components/traffic/LocationHeatMap';

// Define types
interface CityTrafficData {
  name: string;
  congestion: number;
  incidents: number;
  coordinates: {
    lat: number;
    lon: number;
  };
}

interface TrafficTrendData {
  date: string;
  congestion: number;
  incidents: number;
}

interface HourlyTrafficData {
  hour: string;
  congestion: number;
}

interface RoadTypeData {
  name: string;
  value: number;
  color: string;
}

interface PredictionDataPoint {
  date: string;
  historical: number | null;
  predicted: number | null;
  confidence: number | null;
}

interface TrafficMetricCard {
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
  color: string;
}

interface LocationData {
  id: string;
  name: string;
  district: string;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export default function TrafficAnalysisPage() {
  // State for traffic data
  const [cityData, setCityData] = useState<CityTrafficData[]>([]);
  const [trendData, setTrendData] = useState<TrafficTrendData[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyTrafficData[]>([]);
  const [roadTypeData, setRoadTypeData] = useState<RoadTypeData[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('Shanghai');
  const [isLoading, setIsLoading] = useState(true);
  const [predictionData, setPredictionData] = useState<PredictionDataPoint[]>([]);
  
  // WebSocket connection for real-time updates
  const wsRef = useRef<WebSocket | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString());
  const [isLiveUpdates, setIsLiveUpdates] = useState<boolean>(false);

  // Traffic metrics cards
  const [trafficMetrics, setTrafficMetrics] = useState<TrafficMetricCard[]>([
    {
      title: "Average Congestion",
      value: "0%",
      change: 0,
      changeType: "neutral",
      icon: BarChart2,
      color: "blue"
    },
    {
      title: "Total Incidents",
      value: 0,
      change: 0,
      changeType: "neutral",
      icon: AlertTriangle,
      color: "red"
    },
    {
      title: "Average Speed",
      value: "0 km/h",
      change: 0,
      changeType: "neutral",
      icon: Clock,
      color: "green"
    },
    {
      title: "Traffic Volume",
      value: "0",
      change: 0,
      changeType: "neutral",
      icon: Calendar,
      color: "purple"
    }
  ]);

  // Add these state variables inside the component
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationResults, setLocationResults] = useState<LocationData[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  // Simple traffic visualization (inline component)
  const SimpleTrafficVisualization = ({ city, congestionLevel }: { city: string; congestionLevel: number }) => (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{city} Traffic Model</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Congestion Level: {congestionLevel}%</p>
      </div>
      
      {/* Simple visualization grid */}
      <div className="grid grid-cols-10 grid-rows-10 gap-1 w-full max-w-lg">
        {Array.from({ length: 100 }).map((_, index) => {
          // Create visual pattern based on city and congestion
          const row = Math.floor(index / 10);
          const col = index % 10;
          const isRoad = row === 4 || col === 5;
          const distance = Math.sqrt(Math.pow(row - 5, 2) + Math.pow(col - 5, 2));
          const intensity = Math.max(0, 1 - (distance / 7));
          const cellCongestion = congestionLevel * intensity;
          
          // Determine color based on congestion
          let bgColor = 'bg-green-500';
          if (cellCongestion > 70) bgColor = 'bg-red-500';
          else if (cellCongestion > 50) bgColor = 'bg-orange-500';
          else if (cellCongestion > 30) bgColor = 'bg-yellow-500';
          
          return (
            <div 
              key={index} 
              className={`
                ${isRoad ? 'bg-gray-800' : bgColor} 
                h-6 rounded-sm
              `}
              style={{ 
                opacity: isRoad ? 0.8 : Math.max(0.2, Math.min(0.9, intensity)) 
              }}
            ></div>
          );
        })}
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        Note: Interactive 3D visualization available in premium version
      </p>
    </div>
  );

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, these would be API calls with proper error handling
        
        // 1. Get city traffic data
        const cities: CityTrafficData[] = [
          {
            name: 'Shanghai',
            congestion: 78,
            incidents: 14,
            coordinates: { lat: 31.2304, lon: 121.4737 }
          },
          {
            name: 'Beijing',
            congestion: 82,
            incidents: 17,
            coordinates: { lat: 39.9042, lon: 116.4074 }
          },
          {
            name: 'Guangzhou',
            congestion: 65,
            incidents: 9,
            coordinates: { lat: 23.1291, lon: 113.2644 }
          },
          {
            name: 'Shenzhen',
            congestion: 70,
            incidents: 11,
            coordinates: { lat: 22.5431, lon: 114.0579 }
          },
          {
            name: 'Chengdu',
            congestion: 58,
            incidents: 7,
            coordinates: { lat: 30.5723, lon: 104.0665 }
          }
        ];
        
        setCityData(cities);
        
        // 2. Get trend data for the selected city
        const city = cities.find(c => c.name === selectedCity) || cities[0];
        
        // Generate 7 days of trend data
        const trend: TrafficTrendData[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i);
          
          // Generate realistic trend with weekday patterns
          const dayOfWeek = date.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          
          // Base congestion is lower on weekends
          let baseCongestion = isWeekend ? 40 + Math.random() * 20 : 60 + Math.random() * 25;
          
          // Adjust based on city's congestion level
          baseCongestion = baseCongestion * (city.congestion / 65);
          
          trend.push({
            date: format(date, 'yyyy-MM-dd'),
            congestion: Math.min(100, Math.round(baseCongestion)),
            incidents: Math.round(isWeekend ? city.incidents * 0.6 : city.incidents * (0.8 + Math.random() * 0.4))
          });
        }
        
        setTrendData(trend);
        
        // 3. Get hourly data for today
        const hourly: HourlyTrafficData[] = [];
        for (let hour = 0; hour < 24; hour++) {
          // Morning rush hour (7-9 AM)
          let congestionFactor = 1;
          if (hour >= 7 && hour <= 9) {
            congestionFactor = 1.8;
          }
          // Evening rush hour (5-7 PM)
          else if (hour >= 17 && hour <= 19) {
            congestionFactor = 1.9;
          }
          // Late night (11 PM - 5 AM)
          else if (hour >= 23 || hour <= 5) {
            congestionFactor = 0.4;
          }
          
          hourly.push({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            congestion: Math.min(100, Math.round(city.congestion * congestionFactor * (0.9 + Math.random() * 0.2)))
          });
        }
        
        setHourlyData(hourly);
        
        // 4. Get road type distribution data
        const roadTypes: RoadTypeData[] = [
          { name: 'Highways', value: 35, color: '#3b82f6' },
          { name: 'Major Roads', value: 28, color: '#10b981' },
          { name: 'Arterial Roads', value: 22, color: '#f59e0b' },
          { name: 'Local Streets', value: 15, color: '#6366f1' }
        ];
        
        setRoadTypeData(roadTypes);
        
        // 5. Get historical trend data from service
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || '';
        const historicalData = await fetchTrafficTrendData(
          city.coordinates.lat,
          city.coordinates.lon,
          14,
          apiKey
        );
        
        // 6. Get prediction data
        const predictions = await predictTrafficData(
          city.coordinates.lon,
          city.coordinates.lat,
          7,
          apiKey
        );
        
        // Combine historical and prediction data for visualization
        const combinedData: PredictionDataPoint[] = [
          ...historicalData.map(item => ({
            date: item.date,
            historical: item.value,
            predicted: null,
            confidence: null
          })),
          ...predictions.map(item => ({
            date: item.date,
            historical: null,
            predicted: item.predicted,
            confidence: item.confidence
          }))
        ];
        
        setPredictionData(combinedData);
      } catch (error) {
        console.error('Error loading traffic analysis data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCity]);
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM dd');
    } catch {
      return dateStr;
    }
  };
  
  // Handle city selection
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
  };
  
  // Custom tooltip for charts
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }
  
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded shadow-lg text-white text-sm">
          <p className="mb-1 font-medium">{formatDate(label || '')}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name.includes('Congestion') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Setup WebSocket connection
  const setupWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    // In production, use a real WebSocket endpoint
    try {
      // Simulating WebSocket connection
      console.log('Setting up WebSocket connection for traffic data...');
      setIsLiveUpdates(true);
      
      // Simulate receiving updates every 30 seconds
      const intervalId = setInterval(() => {
        if (!isLiveUpdates) {
          clearInterval(intervalId);
          return;
        }
        
        // Update hourly data with small variations
        setHourlyData(prev => {
          return prev.map(item => ({
            ...item,
            congestion: Math.min(100, Math.max(0, item.congestion + (Math.random() * 10 - 5)))
          }));
        });
        
        setLastUpdate(new Date().toLocaleTimeString());
      }, 30000);
      
      return () => {
        clearInterval(intervalId);
        setIsLiveUpdates(false);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setIsLiveUpdates(false);
    }
  }, [isLiveUpdates]);

  // Toggle live updates
  const toggleLiveUpdates = () => {
    if (!isLiveUpdates) {
      setupWebSocket();
    } else {
      setIsLiveUpdates(false);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }
  };
  
  // Update metrics when city changes
  useEffect(() => {
    if (cityData.length > 0 && trendData.length > 0) {
      const city = cityData.find(c => c.name === selectedCity) || cityData[0];
      const latestTrend = trendData[trendData.length - 1];
      const previousTrend = trendData[trendData.length - 2] || trendData[0];
      
      // Calculate changes
      const congestionChange = latestTrend.congestion - previousTrend.congestion;
      const incidentsChange = latestTrend.incidents - previousTrend.incidents;
      
      // Update metrics
      setTrafficMetrics([
        {
          title: "Average Congestion",
          value: `${city.congestion}%`,
          change: congestionChange,
          changeType: congestionChange < 0 ? "positive" : congestionChange > 0 ? "negative" : "neutral",
          icon: BarChart2,
          color: "blue"
        },
        {
          title: "Total Incidents",
          value: city.incidents,
          change: incidentsChange,
          changeType: incidentsChange < 0 ? "positive" : incidentsChange > 0 ? "negative" : "neutral",
          icon: AlertTriangle,
          color: "red"
        },
        {
          title: "Average Speed",
          value: `${Math.max(5, Math.round(60 - (city.congestion * 0.5)))} km/h`,
          change: congestionChange * -0.5, // Speed changes inversely to congestion
          changeType: congestionChange > 0 ? "negative" : congestionChange < 0 ? "positive" : "neutral",
          icon: Clock,
          color: "green"
        },
        {
          title: "Traffic Volume",
          value: `${Math.round(10000 + (city.congestion * 100))}`,
          change: congestionChange * 0.8,
          changeType: "neutral", // Volume itself isn't necessarily good or bad
          icon: Calendar,
          color: "purple"
        }
      ]);
    }
  }, [cityData, trendData, selectedCity]);
  
  // Search for locations
  const searchLocations = async (query: string) => {
    if (query.trim().length < 2) {
      setLocationResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      // In a real app, this would be an API call to a geocoding service
      // For demo purposes, we'll use a mock response
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API delay
      
      // Mock locations in China
      const mockLocations: LocationData[] = [
        {
          id: 'sh-cbd',
          name: 'Central Business District',
          district: 'Shanghai',
          coordinates: { lat: 31.2304, lon: 121.4737 }
        },
        {
          id: 'sh-pudong',
          name: 'Pudong New Area',
          district: 'Shanghai',
          coordinates: { lat: 31.2304, lon: 121.5437 }
        },
        {
          id: 'bj-cbd',
          name: 'Central Business District',
          district: 'Beijing',
          coordinates: { lat: 39.9042, lon: 116.4074 }
        },
        {
          id: 'bj-haidian',
          name: 'Haidian District',
          district: 'Beijing',
          coordinates: { lat: 39.9526, lon: 116.3376 }
        },
        {
          id: 'gz-tianhe',
          name: 'Tianhe District',
          district: 'Guangzhou',
          coordinates: { lat: 23.1291, lon: 113.3264 }
        },
        {
          id: 'sz-futian',
          name: 'Futian District',
          district: 'Shenzhen',
          coordinates: { lat: 22.5431, lon: 114.0579 }
        },
        {
          id: 'cd-jinjiang',
          name: 'Jinjiang District',
          district: 'Chengdu',
          coordinates: { lat: 30.5723, lon: 104.0665 }
        },
        {
          id: 'wh-downtown',
          name: 'Wuhan Downtown',
          district: 'Wuhan',
          coordinates: { lat: 30.5928, lon: 114.3055 }
        },
        {
          id: 'nj-xinjiekou',
          name: 'Xinjiekou',
          district: 'Nanjing',
          coordinates: { lat: 32.0584, lon: 118.7965 }
        },
        {
          id: 'xa-downtown',
          name: "Xi'an Downtown",
          district: "Xi'an",
          coordinates: { lat: 34.3416, lon: 108.9398 }
        }
      ];
      
      // Filter locations based on search query
      const results = mockLocations.filter(
        location => 
          location.name.toLowerCase().includes(query.toLowerCase()) ||
          location.district.toLowerCase().includes(query.toLowerCase())
      );
      
      setLocationResults(results);
    } catch (error) {
      console.error('Error searching for locations:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    setSearchQuery('');
    setLocationResults([]);
    
    // Find the corresponding city or use a default
    const city = cityData.find(c => c.name === location.district) || cityData[0];
    setSelectedCity(city.name);
    
    // In a real app, you would fetch data for this specific location
    // For now, we'll use the city data but could update it with more specific data
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6 flex items-center">
          <Link 
            href="/dashboard/traffic"
            className="mr-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Traffic Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Detailed analytics and trends for traffic patterns across China&apos;s major cities
            </p>
          </div>
        </div>
        
        {/* Traffic Menu */}
        <TrafficMenu />
        
        {/* City Selection */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <Map className="h-5 w-5 mr-2 text-blue-500" />
            Select City
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {cityData.map(city => (
              <button
                key={city.name}
                onClick={() => handleCityChange(city.name)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  selectedCity === city.name 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700' 
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="font-medium">{city.name}</div>
                <div className={`text-sm mt-1 ${
                  city.congestion > 70 ? 'text-red-500 dark:text-red-400' : 
                  city.congestion > 50 ? 'text-orange-500 dark:text-orange-400' : 
                  'text-green-500 dark:text-green-400'
                }`}>
                  {city.congestion}% Congestion
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Location Search */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-purple-500" />
            Specific Location Analysis
          </h2>
          
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for a specific location..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  searchLocations(e.target.value);
                }}
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                </div>
              )}
            </div>
            
            {/* Search Results */}
            {locationResults.length > 0 && (
              <div className="mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {locationResults.map(location => (
                    <li 
                      key={location.id}
                      className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => handleLocationSelect(location)}
                    >
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{location.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{location.district}, China</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Selected Location */}
          {selectedLocation && (
            <div className="p-3 border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-center justify-between">
              <div className="flex items-center">
                <Locate className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{selectedLocation.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedLocation.district}, China • 
                    <span className="ml-1 text-gray-500 dark:text-gray-500">
                      {selectedLocation.coordinates.lat.toFixed(4)}, {selectedLocation.coordinates.lon.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLocation(null)}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Change
              </button>
            </div>
          )}
        </div>
        
        {/* Location Heat Map */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Heat Map */}
          <LocationHeatMap 
            location={selectedLocation} 
            congestionLevel={cityData.find(c => c.name === (selectedLocation?.district || selectedCity))?.congestion || 50} 
          />
          
          {/* Location-specific stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-semibold text-gray-800 dark:text-white">
                Location Analysis
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Traffic metrics for {selectedLocation ? selectedLocation.name : selectedCity}
              </p>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                {/* Congestion Level */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Congestion Level</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {cityData.find(c => c.name === (selectedLocation?.district || selectedCity))?.congestion || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        (cityData.find(c => c.name === (selectedLocation?.district || selectedCity))?.congestion || 0) > 70 
                        ? 'bg-red-500' 
                        : (cityData.find(c => c.name === (selectedLocation?.district || selectedCity))?.congestion || 0) > 50 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                      }`}
                      style={{ width: `${cityData.find(c => c.name === (selectedLocation?.district || selectedCity))?.congestion || 0}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Time to Destination */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Est. Time to City Center</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {selectedLocation 
                        ? Math.round(15 + (cityData.find(c => c.name === selectedLocation.district)?.congestion || 50) * 0.2) 
                        : Math.round(15 + (cityData.find(c => c.name === selectedCity)?.congestion || 50) * 0.2)
                      } min
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-blue-500"
                      style={{ 
                        width: `${
                          selectedLocation 
                            ? Math.min(100, Math.round(30 + (cityData.find(c => c.name === selectedLocation.district)?.congestion || 50) * 0.4)) 
                            : Math.min(100, Math.round(30 + (cityData.find(c => c.name === selectedCity)?.congestion || 50) * 0.4))
                        }%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Traffic Density */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Traffic Density</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {selectedLocation 
                        ? Math.round(50 + (cityData.find(c => c.name === selectedLocation.district)?.congestion || 50) * 0.3) 
                        : Math.round(50 + (cityData.find(c => c.name === selectedCity)?.congestion || 50) * 0.3)
                      } vehicles/km
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-purple-500"
                      style={{ 
                        width: `${
                          selectedLocation 
                            ? Math.min(100, Math.round(40 + (cityData.find(c => c.name === selectedLocation.district)?.congestion || 50) * 0.5)) 
                            : Math.min(100, Math.round(40 + (cityData.find(c => c.name === selectedCity)?.congestion || 50) * 0.5))
                        }%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Traffic Incident Risk */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Traffic Incident Risk</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {cityData.find(c => c.name === (selectedLocation?.district || selectedCity))?.congestion || 0 > 70
                        ? 'High'
                        : cityData.find(c => c.name === (selectedLocation?.district || selectedCity))?.congestion || 0 > 50
                        ? 'Medium'
                        : 'Low'
                      }
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        (cityData.find(c => c.name === (selectedLocation?.district || selectedCity))?.congestion || 0) > 70 
                        ? 'bg-red-500' 
                        : (cityData.find(c => c.name === (selectedLocation?.district || selectedCity))?.congestion || 0) > 50 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                      }`}
                      style={{ 
                        width: `${
                          selectedLocation 
                            ? Math.min(100, Math.round((cityData.find(c => c.name === selectedLocation.district)?.congestion || 50) * 0.9)) 
                            : Math.min(100, Math.round((cityData.find(c => c.name === selectedCity)?.congestion || 50) * 0.9))
                        }%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md text-sm text-blue-800 dark:text-blue-300">
                <div className="font-medium mb-1">Location Insight</div>
                <p>
                  {selectedLocation 
                    ? `${selectedLocation.name} in ${selectedLocation.district} typically experiences ${
                        cityData.find(c => c.name === selectedLocation.district)?.congestion || 50 > 70
                          ? 'heavy traffic during peak hours. Consider alternative routes or travel times.'
                          : cityData.find(c => c.name === selectedLocation.district)?.congestion || 50 > 50
                          ? 'moderate congestion during rush hours. Plan your journey accordingly.'
                          : 'good traffic flow throughout most of the day.'
                      }`
                    : `${selectedCity} typically experiences ${
                        cityData.find(c => c.name === selectedCity)?.congestion || 50 > 70
                          ? 'heavy traffic during peak hours. Consider alternative routes or travel times.'
                          : cityData.find(c => c.name === selectedCity)?.congestion || 50 > 50
                          ? 'moderate congestion during rush hours. Plan your journey accordingly.'
                          : 'good traffic flow throughout most of the day.'
                      }`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {trafficMetrics.map((metric, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4"
              style={{ borderLeftColor: 
                metric.color === "blue" ? "#3b82f6" : 
                metric.color === "red" ? "#ef4444" : 
                metric.color === "green" ? "#10b981" : 
                "#8b5cf6"
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{metric.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{metric.value}</h3>
                </div>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  metric.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" : 
                  metric.color === "red" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" : 
                  metric.color === "green" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" : 
                  "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                }`}>
                  {metric.icon === BarChart2 && <BarChart2 className="h-5 w-5" />}
                  {metric.icon === AlertTriangle && <AlertTriangle className="h-5 w-5" />}
                  {metric.icon === Clock && <Clock className="h-5 w-5" />}
                  {metric.icon === Calendar && <Calendar className="h-5 w-5" />}
                </div>
              </div>
              {metric.change !== 0 && (
                <div className={`flex items-center mt-2 text-sm ${
                  metric.changeType === "positive" ? "text-green-600 dark:text-green-400" : 
                  metric.changeType === "negative" ? "text-red-600 dark:text-red-400" : 
                  "text-gray-600 dark:text-gray-400"
                }`}>
                  {metric.changeType === "positive" ? "↓" : metric.changeType === "negative" ? "↑" : "→"}
                  <span className="ml-1">{Math.abs(metric.change).toFixed(1)}% {metric.changeType === "positive" ? "decrease" : metric.changeType === "negative" ? "increase" : "change"}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-80">
                <div className="animate-pulse h-full flex flex-col">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
                  <div className="flex-grow bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Main Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Weekly Trend Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                  Weekly Traffic Trends
                </h2>
                
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="#6B7280"
                    />
                    <YAxis 
                      stroke="#6B7280"
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="congestion" 
                      name="Congestion Level" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="incidents" 
                      name="Incidents" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Hourly Distribution Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-500" />
                  Hourly Traffic Distribution
                </h2>
                
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis 
                      dataKey="hour" 
                      stroke="#6B7280"
                    />
                    <YAxis 
                      stroke="#6B7280"
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Congestion']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="congestion" 
                      name="Congestion" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.2} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* Road Type Distribution Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <BarChart2 className="h-5 w-5 mr-2 text-purple-500" />
                  Congestion by Road Type
                </h2>
                
                <div className="flex items-center justify-center h-[300px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={roadTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {roadTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Congestion']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Traffic Prediction Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-orange-500" />
                  Traffic Forecast (7-Day)
                </h2>
                
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      stroke="#6B7280"
                    />
                    <YAxis 
                      stroke="#6B7280"
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="historical" 
                      name="Historical" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      name="Predicted" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Traffic Visualization */}
            <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <Map className="h-5 w-5 mr-2 text-blue-500" />
                  Traffic Visualization
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Visual model of traffic flow in {selectedCity}
                </p>
              </div>
              
              <div className="h-[400px]">
                <SimpleTrafficVisualization 
                  city={selectedCity} 
                  congestionLevel={cityData.find(c => c.name === selectedCity)?.congestion || 50} 
                />
              </div>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center mr-4">
                    <div className="h-3 w-3 rounded-full bg-green-500 mr-1"></div>
                    <span>Low Congestion</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
                    <span>Medium Congestion</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <div className="h-3 w-3 rounded-full bg-orange-500 mr-1"></div>
                    <span>High Congestion</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
                    <span>Severe Congestion</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Key Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Key Insights for {selectedCity}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
                    Peak Congestion Times
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Morning rush hour (7:00-9:00) shows {selectedCity === 'Beijing' ? '82%' : selectedCity === 'Shanghai' ? '78%' : '70%'} congestion, 
                    while evening peak (17:00-19:00) reaches {selectedCity === 'Beijing' ? '85%' : selectedCity === 'Shanghai' ? '80%' : '75%'} congestion levels.
                  </p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center">
                    <Map className="h-4 w-4 mr-2 text-blue-500" />
                    Most Congested Roads
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedCity === 'Shanghai' ? 'Yanan Elevated Road and North-South Elevated Road' : 
                     selectedCity === 'Beijing' ? '2nd and 3rd Ring Roads' : 
                     selectedCity === 'Guangzhou' ? 'Guangzhou Avenue and Tianhe Road' :
                     selectedCity === 'Shenzhen' ? 'Shennan Boulevard and Binhai Boulevard' :
                     'First Ring Road and Second Ring Road'} experience the highest congestion levels.
                  </p>
                </div>
                
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    Weekly Pattern
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Traffic congestion is {selectedCity === 'Beijing' || selectedCity === 'Shanghai' ? '35%' : '30%'} lower on weekends. 
                    Fridays show the highest congestion levels, particularly between 16:00-19:00.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 justify-end items-center">
              {isLiveUpdates ? (
                <div className="flex items-center mr-auto">
                  <div className="animate-pulse h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-green-600 dark:text-green-400">
                    Live updates active - Last update: {lastUpdate}
                  </span>
                </div>
              ) : null}
              
              <button 
                onClick={toggleLiveUpdates} 
                className={`flex items-center px-4 py-2 rounded-md text-white ${isLiveUpdates ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
              >
                {isLiveUpdates ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isLiveUpdates ? 'Stop Live Updates' : 'Start Live Updates'}
              </button>

              <button className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
              
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </button>
            </div>
            
            {/* AI-Powered Insights */}
            <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                <BrainCircuit className="h-5 w-5 mr-2 text-indigo-500" />
                AI-Powered Traffic Insights
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">Traffic Pattern Analysis</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    AI analysis detected a recurring pattern in {selectedCity} where traffic congestion increases by 
                    {selectedCity === 'Beijing' ? ' 32%' : selectedCity === 'Shanghai' ? ' 28%' : ' 22%'} on rainy days, 
                    particularly affecting the {
                      selectedCity === 'Shanghai' ? 'Pudong and Jing\'an districts' : 
                      selectedCity === 'Beijing' ? 'Chaoyang and Haidian districts' : 
                      'central business district'
                    }.
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Based on historical data from the last 6 months
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">Anomaly Detection</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    Our AI system has detected unusual traffic patterns forming in the {
                      selectedCity === 'Shanghai' ? 'Xujiahui' : 
                      selectedCity === 'Beijing' ? 'Wangjing' : 
                      selectedCity === 'Guangzhou' ? 'Tianhe' :
                      selectedCity === 'Shenzhen' ? 'Futian' :
                      'Jinjiang'
                    } area. Prediction models indicate a {
                      selectedCity === 'Beijing' || selectedCity === 'Shanghai' ? '45%' : '35%'
                    } probability of significant congestion developing in the next 2 hours.
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Real-time anomaly detection using predictive modeling
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">Optimization Recommendations</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    Based on current traffic flows, AI recommends adjusting traffic light timing at {
                      selectedCity === 'Shanghai' ? '12 intersections along Nanjing Road' : 
                      selectedCity === 'Beijing' ? '8 intersections on Chang&apos;an Avenue' : 
                      '6 major intersections in the city center'
                    }. This could reduce average wait times by up to {
                      selectedCity === 'Beijing' ? '28%' : selectedCity === 'Shanghai' ? '24%' : '20%'
                    }.
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Generated using optimization algorithms and simulation models
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                  <h3 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">Future Infrastructure Needs</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">
                    AI analysis of long-term traffic trends suggests the need for expanded capacity in the {
                      selectedCity === 'Shanghai' ? 'southwest corridor connecting to Hongqiao Hub' : 
                      selectedCity === 'Beijing' ? 'northeast sector connecting to the airport expressway' : 
                      'main east-west corridor'
                    }. Growth projections indicate a {
                      selectedCity === 'Beijing' ? '37%' : selectedCity === 'Shanghai' ? '32%' : '25%'
                    } increase in traffic volume over the next 5 years.
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Based on machine learning predictive growth models
                  </div>
                </div>
              </div>
            </div>
            
            {/* City Comparison */}
            <div className="mt-6">
              <CompareTraffic cities={['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen'].filter(
                city => city === selectedCity || Math.random() > 0.3 // Include selected city and some random others
              )} />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
} 