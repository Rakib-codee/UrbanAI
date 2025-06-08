'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Droplet,
  Zap,
  ArrowLeft,
  Plus,
  AlertTriangle,
  Flame,
  BarChart2,
} from 'lucide-react';
import Link from 'next/link';
import { AreaChart } from '@/components/dashboard/charts';
import { useRouter } from 'next/navigation';
import React from 'react';

interface ResourceData {
  id: string;
  type: string;
  usage: number;
  timestamp: string;
}

const resourceTypes: { 
  [key: string]: { 
    icon: React.ComponentType; 
    color: string; 
    bgColor: string; 
  } 
} = {
  water: {
    icon: Droplet,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100'
  },
  electricity: {
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100'
  },
  gas: {
    icon: Flame,
    color: 'text-red-500',
    bgColor: 'bg-red-100'
  }
};

export default function ResourceManagementPage() {
  const params = useParams();
  const router = useRouter();
  const [resourceData, setResourceData] = useState<ResourceData[]>([]);
  const [selectedType, setSelectedType] = useState<string>('water');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        if (!params || !params.id) {
          console.error('Project ID is missing');
          setError('Project ID is missing');
          return;
        }
        
        const response = await fetch(`/api/projects/${params.id}/resources?type=${selectedType}`);
        if (response.ok) {
          const data = await response.json();
          setResourceData(data);
        }
      } catch (error) {
        console.error('Error fetching resource data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
    const interval = setInterval(fetchResources, 30000);
    return () => clearInterval(interval);
  }, [params?.id, selectedType]);

  const chartData = resourceData.map(data => ({
    name: new Date(data.timestamp).toLocaleTimeString('bn-BD', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    value: data.usage,
  }));

  const currentUsage = resourceData[0]?.usage || 0;
  const previousUsage = resourceData[1]?.usage || 0;
  const usageChange = currentUsage - previousUsage;
  const usageChangePercent = previousUsage ? (usageChange / previousUsage) * 100 : 0;

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
                <h2 className="text-xl font-bold text-white">Resource Usage</h2>
                <div className="flex items-center gap-2">
                  {Object.entries(resourceTypes).map(([type, { icon: Icon, color }]) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`p-2 rounded-lg transition-colors ${
                        selectedType === type
                          ? `${color} ${resourceTypes[selectedType].bgColor}`
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {React.createElement(Icon, { className: "w-5 h-5" })}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[400px]">
                <AreaChart
                  data={chartData}
                  title={`${selectedType === 'water' ? 'Water' : selectedType === 'electricity' ? 'Electricity' : 'Gas'} Usage`}
                  description="Last 24 hours usage"
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
                Current Usage
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-400">Current</span>
                  </div>
                  <span className="text-white">{currentUsage.toFixed(2)} Units</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`w-5 h-5 ${
                        usageChangePercent > 10
                          ? 'text-red-500'
                          : usageChangePercent < -10
                          ? 'text-green-500'
                          : 'text-yellow-500'
                      }`}
                    />
                    <span className="text-gray-400">Change</span>
                  </div>
                  <span
                    className={
                      usageChangePercent > 10
                        ? 'text-red-500'
                        : usageChangePercent < -10
                        ? 'text-green-500'
                        : 'text-yellow-500'
                    }
                  >
                    {usageChangePercent > 0 ? '+' : ''}
                    {usageChangePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Quick Actions</h3>
                <button className="p-2 text-indigo-500 hover:text-indigo-400">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <button className="w-full p-3 bg-gray-700 rounded-lg text-left hover:bg-gray-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-white text-sm">Optimization Suggestion</p>
                      <p className="text-gray-400 text-xs">
                        Optimize resource usage
                      </p>
                    </div>
                  </div>
                </button>
                <button className="w-full p-3 bg-gray-700 rounded-lg text-left hover:bg-gray-600 transition-colors">
                  <div className="flex items-center gap-3">
                    <BarChart2 className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-white text-sm">Generate Report</p>
                      <p className="text-gray-400 text-xs">
                        Detailed usage report
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 