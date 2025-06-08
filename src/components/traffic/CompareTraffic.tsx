'use client';

import { useState, useEffect } from 'react';
import { BarChart3, ArrowRight, RefreshCw } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

// Define types
interface CityComparisonProps {
  cities: string[];
}

interface CityData {
  name: string;
  congestion: number;
  incidents: number;
  flow: number;
  speed: number;
  density: number;
}

interface ComparisonData {
  parameter: string;
  [key: string]: string | number;
}

export default function CompareTraffic({ cities }: CityComparisonProps) {
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comparisonType, setComparisonType] = useState<'bar' | 'radar'>('bar');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // Simulating realistic traffic data for Chinese cities
        const data: CityData[] = [
          {
            name: 'Shanghai',
            congestion: 78,
            incidents: 14,
            flow: 85,
            speed: 32,
            density: 76
          },
          {
            name: 'Beijing',
            congestion: 82,
            incidents: 17,
            flow: 79,
            speed: 28,
            density: 83
          },
          {
            name: 'Guangzhou',
            congestion: 65,
            incidents: 9,
            flow: 72,
            speed: 38,
            density: 62
          },
          {
            name: 'Shenzhen',
            congestion: 70,
            incidents: 11,
            flow: 75,
            speed: 35,
            density: 68
          },
          {
            name: 'Chengdu',
            congestion: 58,
            incidents: 7,
            flow: 68,
            speed: 42,
            density: 54
          }
        ];

        // Filter for only the selected cities
        const filteredData = data.filter(city => cities.includes(city.name));
        setCityData(filteredData);

        // Generate comparison data structure for charts
        const compData = [
          { parameter: 'Congestion (%)' },
          { parameter: 'Incidents' },
          { parameter: 'Traffic Flow' },
          { parameter: 'Average Speed (km/h)' },
          { parameter: 'Traffic Density' }
        ];

        // Add each city's data to the comparison structure
        filteredData.forEach(city => {
          compData[0][city.name] = city.congestion;
          compData[1][city.name] = city.incidents;
          compData[2][city.name] = city.flow;
          compData[3][city.name] = city.speed;
          compData[4][city.name] = city.density;
        });

        setComparisonData(compData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching comparison data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [cities]);

  // Generate colors for each city
  const cityColors = {
    'Shanghai': '#3b82f6',
    'Beijing': '#ef4444',
    'Guangzhou': '#10b981',
    'Shenzhen': '#8b5cf6',
    'Chengdu': '#f59e0b'
  };

  // Toggle between chart types
  const toggleChartType = () => {
    setComparisonType(prev => prev === 'bar' ? 'radar' : 'bar');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Prepare data for radar chart
  const radarData = cities.map(cityName => {
    const city = cityData.find(c => c.name === cityName);
    if (!city) return null;
    
    return {
      name: cityName,
      congestion: city.congestion,
      incidents: city.incidents * 5, // Scale up to be visible on chart
      flow: city.flow,
      speed: city.speed * 2, // Scale up to be visible on chart
      density: city.density
    };
  }).filter(Boolean);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
            Traffic Comparison
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Comparing key traffic metrics across selected cities
          </p>
        </div>
        <button 
          onClick={toggleChartType}
          className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 flex items-center text-sm"
        >
          {comparisonType === 'bar' ? 'Show Radar Chart' : 'Show Bar Chart'}
          <ArrowRight className="ml-1 h-4 w-4" />
        </button>
      </div>

      <div className="p-4">
        {comparisonType === 'bar' ? (
          // Bar chart view
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="parameter" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Legend />
              {cities.map(city => (
                <Bar 
                  key={city} 
                  dataKey={city} 
                  name={city} 
                  fill={cityColors[city as keyof typeof cityColors] || '#3b82f6'} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          // Radar chart view
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart outerRadius={150} data={radarData.length > 0 ? [
              { subject: 'Congestion', fullMark: 100 },
              { subject: 'Incidents', fullMark: 100 },
              { subject: 'Flow', fullMark: 100 },
              { subject: 'Speed', fullMark: 100 },
              { subject: 'Density', fullMark: 100 }
            ] : []}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              {radarData.map((entry, index) => (
                <Radar
                  key={index}
                  name={entry?.name}
                  dataKey={entry?.name}
                  stroke={cityColors[entry?.name as keyof typeof cityColors] || '#3b82f6'}
                  fill={cityColors[entry?.name as keyof typeof cityColors] || '#3b82f6'}
                  fillOpacity={0.3}
                />
              ))}
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/20 flex justify-end">
        <button className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh Data
        </button>
      </div>
    </div>
  );
} 