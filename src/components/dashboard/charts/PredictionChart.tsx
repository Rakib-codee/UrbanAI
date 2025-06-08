import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { format, parseISO } from 'date-fns';
import { PredictionDataPoint } from '@/services/AnalyticsService';

interface PredictionChartProps {
  title: string;
  predictionData: PredictionDataPoint[];
  color: string;
  unit: string;
  isLoading?: boolean;
  error?: Error | null;
}

export default function PredictionChart({
  title,
  predictionData,
  color,
  unit,
  isLoading = false,
  error = null
}: PredictionChartProps) {
  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM dd');
    } catch {
      return dateStr;
    }
  };
  
  // Process data to create confidence bands
  const chartData = predictionData.map(point => ({
    date: point.date,
    predicted: point.predicted,
    upper: point.predicted * (1 + ((100 - point.confidence) / 200)),
    lower: point.predicted * (1 - ((100 - point.confidence) / 200))
  }));
  
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
          <p>Error loading prediction data. Please try again.</p>
        </div>
      ) : predictionData.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          <p>No prediction data available</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={chartData}
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
            
            {/* Confidence band */}
            <Area 
              type="monotone" 
              dataKey="upper" 
              stroke="none"
              fillOpacity={0.1}
              fill={color}
              name="Confidence Range"
            />
            <Area 
              type="monotone" 
              dataKey="lower" 
              stroke="none"
              fillOpacity={0}
              fill={color}
            />
            
            {/* Predicted value line */}
            <Line
              type="monotone"
              dataKey="predicted"
              name="Predicted Value"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      )}
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Forecast shows predicted values for the next {predictionData.length} days with confidence range.</p>
      </div>
    </div>
  );
} 