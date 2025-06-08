'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, AlertTriangle, BarChart2, RefreshCw, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { AreaChart } from '@/components/dashboard/charts/AreaChart';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

interface TrafficData {
  id: string;
  location: string;
  density: number;
  timestamp: string;
}

export default function TrafficMonitoringPage() {
  const params = useParams();
  const router = useRouter();
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        if (!params || !params.id) {
          console.error('Project ID is missing');
          setError('Project ID is missing');
          return;
        }
        
        const response = await fetch(`/api/projects/${params.id}/traffic`);
        if (response.ok) {
          const data = await response.json();
          setTrafficData(data);
        }
      } catch (error) {
        console.error('Error fetching traffic data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrafficData();
    // Set up real-time updates (simulated here with interval)
    const interval = setInterval(fetchTrafficData, 30000);
    return () => clearInterval(interval);
  }, [params?.id]);

  const chartData = trafficData.map(data => ({
    name: new Date(data.timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    value: data.density,
  }));

  const getTrafficStatus = (density: number) => {
    if (density < 30) return { color: 'text-green-500', text: 'Normal' };
    if (density < 70) return { color: 'text-yellow-500', text: 'Moderate' };
    return { color: 'text-red-500', text: 'Heavy' };
  };

  const averageDensity =
    trafficData.reduce((sum, data) => sum + data.density, 0) / trafficData.length;

  const refreshData = async () => {
    setIsLoading(true);
    try {
      if (!params?.id) {
        console.error('Project ID is missing');
        return;
      }
      
      const response = await fetch(`/api/projects/${params.id}/traffic`);
      if (response.ok) {
        const data = await response.json();
        setTrafficData(data);
      }
    } catch (error) {
      console.error('Error refreshing traffic data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
        <p>Error: {error}</p>
        <button 
          onClick={() => router.push('/projects')}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link 
            href={`/projects/${params?.id || ''}`}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-2 inline-flex items-center"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Project</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Traffic Density Trend</h2>
                <div className="flex items-center gap-2">
                  <Button onClick={refreshData} size="sm" variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
              
              <div className="h-[400px]">
                <AreaChart
                  data={chartData}
                  title="Traffic Density"
                  description="Last 1 hour traffic density"
                />
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-medium text-white mb-4">
                Current Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-400">Average Density</span>
                  </div>
                  <span className={`${getTrafficStatus(averageDensity).color} font-medium`}>
                    {averageDensity.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-400">Monitored Areas</span>
                  </div>
                  <span className="text-white">{trafficData.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-400">Update Frequency</span>
                  </div>
                  <span className="text-white">30 seconds</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-medium text-white mb-4">
                Alerts and Notifications
              </h3>
              <div className="space-y-3">
                {trafficData
                  .filter((data) => data.density > 70)
                  .slice(0, 3)
                  .map((data) => (
                    <div key={data.id} className="p-3 bg-red-500/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <p className="text-white text-sm">
                          Heavy traffic at {data.location} ({data.density}%)
                        </p>
                      </div>
                    </div>
                  ))}
                
                {trafficData.filter((data) => data.density > 70).length === 0 && (
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <p className="text-white text-sm">No alerts</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          {/* Additional content can be added here */}
        </motion.div>
      </div>
    </div>
  );
} 