'use client';

import { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import TrafficMenu from '@/components/traffic/TrafficMenu';
import TrafficService, { TrafficDataItem } from '@/services/trafficService';

// Import TrafficFilters component dynamically to avoid build errors
const TrafficFilters = dynamic(
  () => import('@/components/traffic/TrafficFilters'),
  {
    ssr: false,
    loading: () => (
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
        <div className="h-24 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
      </div>
    )
  }
);

// Define the filter state type
interface AdvancedFilterState {
  areas: string[];
  metrics: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  categories: string[];
  roadTypes?: string[];
  severity?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function AdvancedTrafficFiltersPage() {
  // State for filtered data
  const [filteredData, setFilteredData] = useState<TrafficDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState<AdvancedFilterState | null>(null);
  
  // Load traffic data
  useEffect(() => {
    // Fetch data from our real API service
    const fetchTrafficData = async (filters?: AdvancedFilterState) => {
      setIsLoading(true);
      
      try {
        if (!filters) {
          // Default filters if none provided
          filters = {
            areas: [],
            metrics: ['congestion', 'speed', 'travelTime'],
            dateRange: {
              startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              endDate: new Date().toISOString().split('T')[0]
            },
            categories: []
          };
        }
        
        // Get real traffic data from our service
        const trafficData = await TrafficService.getTrafficData(filters);
        setFilteredData(trafficData);
      } catch (error) {
        console.error('Error fetching traffic data:', error);
        setFilteredData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Initial data load
    fetchTrafficData(activeFilters || undefined);
  }, [activeFilters]);
  
  // Handle filter changes
  const handleFilterChange = (filters: AdvancedFilterState) => {
    console.log('Filters applied:', filters);
    setActiveFilters(filters);
  };
  
  // Get severity class based on congestion level
  const getSeverityClass = (congestion: number) => {
    if (congestion >= 80) return 'text-red-500 dark:text-red-400';
    if (congestion >= 60) return 'text-orange-500 dark:text-orange-400';
    if (congestion >= 30) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-green-500 dark:text-green-400';
  };
  
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Advanced Traffic Filtering
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Filter traffic data by area, road type, metrics, and more.
          </p>
        </div>
        
        {/* Traffic Menu */}
        <TrafficMenu />
        
        {/* Advanced Filters */}
        <div className="mb-6">
          <Suspense fallback={
            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-600 rounded w-1/3 mb-4"></div>
              <div className="h-24 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
            </div>
          }>
            <TrafficFilters onFilterChange={handleFilterChange} />
          </Suspense>
        </div>
        
        {/* Traffic Data Display */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Traffic Conditions
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filteredData.length} results
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="mb-2">No traffic data found for the selected filters.</p>
              <p>Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Road Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Congestion
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Speed (km/h)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Travel Time (min)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Incidents
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          {item.area}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.roadType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-2.5 w-2.5 rounded-full ${
                            item.congestion >= 80 ? 'bg-red-500' :
                            item.congestion >= 60 ? 'bg-orange-500' :
                            item.congestion >= 30 ? 'bg-yellow-500' :
                            'bg-green-500'
                          } mr-2`}></div>
                          <span className={`text-sm font-medium ${getSeverityClass(item.congestion)}`}>
                            {item.congestion}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {item.speed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1 text-gray-400" />
                          {item.travelTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.incidents > 0 ? (
                          <div className="flex items-center text-sm text-red-500 dark:text-red-400">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            {item.incidents}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 dark:text-gray-400">None</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Legend */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-1"></div>
                <span className="text-gray-600 dark:text-gray-300">Low (0-30%)</span>
              </div>
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-1"></div>
                <span className="text-gray-600 dark:text-gray-300">Moderate (30-60%)</span>
              </div>
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-orange-500 mr-1"></div>
                <span className="text-gray-600 dark:text-gray-300">High (60-80%)</span>
              </div>
              <div className="flex items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-1"></div>
                <span className="text-gray-600 dark:text-gray-300">Severe (80-100%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 