// src/components/dashboard/charts/RealTimeChart.tsx
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useRealTimeData } from '@/services/RealTimeDataService';

interface ChartDataPoint {
  time: string;
  value: number;
}

interface RealTimeChartProps {
  title: string;
  dataFetcher: () => Promise<unknown>;
  dataProcessor: (rawData: unknown) => ChartDataPoint[];
  color: string;
  unit: string;
  interval?: number; // Refresh interval in milliseconds
  historyPoints?: number; // Number of points to show in chart
}

export default function RealTimeChart({
  title,
  dataFetcher,
  dataProcessor,
  color,
  unit,
  interval = 60000, // Default 1 minute
  historyPoints = 20
}: RealTimeChartProps) {
  // Initial empty chart data
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  // Use the real-time data hook
  const { data, loading, error, lastUpdated, refetch } = useRealTimeData(
    dataFetcher,
    { interval }
  );
  
  // Process data when it arrives
  useEffect(() => {
    if (data) {
      const newPoint = dataProcessor(data);
      
      setChartData(prevData => {
        // Add new data point(s)
        const updatedData = [...prevData, ...newPoint];
        
        // Limit history length
        if (updatedData.length > historyPoints) {
          return updatedData.slice(updatedData.length - historyPoints);
        }
        
        return updatedData;
      });
    }
  }, [data, dataProcessor, historyPoints]);
  
  // Format the timestamp
  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center text-sm">
          {lastUpdated && (
            <span className="text-gray-500 dark:text-gray-400 mr-2">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={refetch}
            className="p-1 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      
      {loading && chartData.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-red-500">
          <p>Error loading data. Please try again.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime}
              stroke="#6B7280"
            />
            <YAxis
              stroke="#6B7280"
              unit={unit}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(17, 24, 39, 0.8)',
                border: 'none',
                borderRadius: '4px',
                color: '#F3F4F6'
              }}
              formatter={(value) => [`${value} ${unit}`, '']}
              labelFormatter={formatTime}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}