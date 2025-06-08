import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { TrendDataPoint } from '@/services/AnalyticsService';

interface TrendAnalysisChartProps {
  title: string;
  trendData: TrendDataPoint[];
  color: string;
  unit: string;
  isLoading?: boolean;
  error?: Error | null;
}

export default function TrendAnalysisChart({
  title,
  trendData,
  color,
  unit,
  isLoading = false,
  error = null
}: TrendAnalysisChartProps) {
  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM dd');
    } catch {
      return dateStr;
    }
  };
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-red-500">
          <p>Error loading trend data. Please try again.</p>
        </div>
      ) : trendData.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          <p>No trend data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={trendData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
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
              labelFormatter={(label) => formatDate(label as string)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              name="Historical Value"
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