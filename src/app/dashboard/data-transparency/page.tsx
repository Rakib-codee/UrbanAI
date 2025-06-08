'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Database, 
  FileText, 
  BarChart, 
  Search,
  ChevronDown
} from 'lucide-react';

// Types for our data structures
interface DataSource {
  id: string;
  name: string;
  description: string;
  lastUpdated: Date;
  updateFrequency: string;
  provider: string;
  format: string;
  category: string;
  qualityScore: number;
  completeness: number;
  reliability: number;
  accuracy: number;
  status: 'verified' | 'pending' | 'issue';
}

interface QualityMetric {
  name: string;
  description: string;
  value: number;
  icon: React.ReactNode;
  status: 'good' | 'warning' | 'critical';
}

export default function DataTransparencyPage() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [filteredSources, setFilteredSources] = useState<DataSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Mock data sources
  const mockDataSources: DataSource[] = [
    {
      id: 'ds1',
      name: 'City Traffic Data',
      description: 'Real-time traffic flow data from city sensors and cameras',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
      updateFrequency: 'Every 15 minutes',
      provider: 'City Transport Department',
      format: 'JSON API',
      category: 'Transportation',
      qualityScore: 92,
      completeness: 98,
      reliability: 95,
      accuracy: 89,
      status: 'verified'
    },
    {
      id: 'ds2',
      name: 'Air Quality Measurements',
      description: 'Air quality index and pollutant measurements from monitoring stations',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      updateFrequency: 'Hourly',
      provider: 'Environmental Protection Agency',
      format: 'CSV',
      category: 'Environment',
      qualityScore: 87,
      completeness: 91,
      reliability: 88,
      accuracy: 85,
      status: 'verified'
    },
    {
      id: 'ds3',
      name: 'Green Space Inventory',
      description: 'Inventory of parks, gardens, and green spaces with size and vegetation data',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
      updateFrequency: 'Monthly',
      provider: 'Parks Department',
      format: 'GeoJSON',
      category: 'Environment',
      qualityScore: 95,
      completeness: 97,
      reliability: 93,
      accuracy: 96,
      status: 'verified'
    },
    {
      id: 'ds4',
      name: 'Energy Consumption Data',
      description: 'Public buildings and infrastructure energy usage data',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      updateFrequency: 'Daily',
      provider: 'Energy Department',
      format: 'JSON API',
      category: 'Energy',
      qualityScore: 78,
      completeness: 82,
      reliability: 75,
      accuracy: 80,
      status: 'pending'
    },
    {
      id: 'ds5',
      name: 'Public Transit Ridership',
      description: 'Passenger counts for buses, trains, and other public transit',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      updateFrequency: 'Every 3 hours',
      provider: 'Transit Authority',
      format: 'CSV',
      category: 'Transportation',
      qualityScore: 84,
      completeness: 88,
      reliability: 83,
      accuracy: 82,
      status: 'verified'
    },
    {
      id: 'ds6',
      name: 'Water Quality Monitoring',
      description: 'Measurements of water quality in city reservoirs and distribution system',
      lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      updateFrequency: 'Every 6 hours',
      provider: 'Water Authority',
      format: 'JSON API',
      category: 'Environment',
      qualityScore: 65,
      completeness: 72,
      reliability: 68,
      accuracy: 60,
      status: 'issue'
    },
  ];

  // Initialize data
  useEffect(() => {
    // Simulate API call to fetch data sources
    setTimeout(() => {
      setDataSources(mockDataSources);
      setFilteredSources(mockDataSources);
      setIsLoading(false);
    }, 1000);

    // Check system preference for dark mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Apply filters when search query, category, or status changes
  useEffect(() => {
    let filtered = dataSources;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(source =>
        source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        source.provider.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(source => source.category === filterCategory);
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(source => source.status === filterStatus);
    }
    
    setFilteredSources(filtered);
  }, [searchQuery, filterCategory, filterStatus, dataSources]);

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Generate quality metrics for a data source
  const getQualityMetrics = (source: DataSource): QualityMetric[] => {
    return [
      {
        name: 'Completeness',
        description: 'Measures how complete the dataset is without missing values',
        value: source.completeness,
        icon: <FileText className={`h-5 w-5 ${source.completeness > 90 ? 'text-green-500' : source.completeness > 70 ? 'text-yellow-500' : 'text-red-500'}`} />,
        status: source.completeness > 90 ? 'good' : source.completeness > 70 ? 'warning' : 'critical'
      },
      {
        name: 'Reliability',
        description: 'Measures how consistent and dependable the data collection is',
        value: source.reliability,
        icon: <CheckCircle className={`h-5 w-5 ${source.reliability > 90 ? 'text-green-500' : source.reliability > 70 ? 'text-yellow-500' : 'text-red-500'}`} />,
        status: source.reliability > 90 ? 'good' : source.reliability > 70 ? 'warning' : 'critical'
      },
      {
        name: 'Accuracy',
        description: 'Measures how close the data values are to the actual values',
        value: source.accuracy,
        icon: <BarChart className={`h-5 w-5 ${source.accuracy > 90 ? 'text-green-500' : source.accuracy > 70 ? 'text-yellow-500' : 'text-red-500'}`} />,
        status: source.accuracy > 90 ? 'good' : source.accuracy > 70 ? 'warning' : 'critical'
      },
    ];
  };

  // Get categories for filter dropdown
  const getCategories = () => {
    const categories = new Set<string>();
    dataSources.forEach(source => categories.add(source.category));
    return Array.from(categories);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Data Transparency & Validation</h1>
          <p className="text-gray-500 dark:text-gray-400">Explore data sources, quality metrics, and transparency information</p>
        </div>

        {/* Filters and search */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search data sources..."
              className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              } border`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {/* Category filter */}
            <div className="relative">
              <select
                className={`appearance-none pl-3 pr-8 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                } border`}
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {getCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
            
            {/* Status filter */}
            <div className="relative">
              <select
                className={`appearance-none pl-3 pr-8 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                } border`}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="issue">Has Issues</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : selectedSource ? (
          /* Detailed view of selected data source */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center mb-1">
                  <Database className="mr-2 text-blue-500" size={22} />
                  <h2 className="text-xl font-bold">{selectedSource.name}</h2>
                </div>
                <p className="text-gray-500 dark:text-gray-400">{selectedSource.description}</p>
              </div>
              <button
                onClick={() => setSelectedSource(null)}
                className={`px-3 py-1 rounded-lg text-sm ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Back to list
              </button>
            </div>

            {/* Data source details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Source Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Provider:</span>
                    <span className="font-medium">{selectedSource.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Category:</span>
                    <span className="font-medium">{selectedSource.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Format:</span>
                    <span className="font-medium">{selectedSource.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Last Updated:</span>
                    <span className="font-medium">{formatDate(selectedSource.lastUpdated)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Update Frequency:</span>
                    <span className="font-medium">{selectedSource.updateFrequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedSource.status === 'verified' ? 'bg-green-100 text-green-800' :
                      selectedSource.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedSource.status.charAt(0).toUpperCase() + selectedSource.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Quality Assessment</h3>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Overall Data Quality Score</span>
                    <span className="font-bold">{selectedSource.qualityScore}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className={`h-full rounded-full ${
                        selectedSource.qualityScore >= 90 ? 'bg-green-500' :
                        selectedSource.qualityScore >= 70 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${selectedSource.qualityScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {getQualityMetrics(selectedSource).map((metric, index) => (
                    <div key={index} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          {metric.icon}
                          <span className="ml-2 font-medium">{metric.name}</span>
                        </div>
                        <span className={`font-bold ${
                          metric.status === 'good' ? 'text-green-500' :
                          metric.status === 'warning' ? 'text-yellow-500' :
                          'text-red-500'
                        }`}>{metric.value}%</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{metric.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Data validation information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Data Validation Methods</h3>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Automated Validation</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Data is automatically checked for inconsistencies, missing values, and statistical outliers.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Expert Review</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Domain experts periodically review data samples to ensure accuracy and reliability.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Cross-Validation</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Data is cross-checked against other trusted sources where applicable.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* List of data sources */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSources.length > 0 ? (
              filteredSources.map((source) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-6 rounded-xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'} cursor-pointer hover:shadow-lg transition-shadow`}
                  onClick={() => setSelectedSource(source)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Database className="text-blue-500 mr-3" size={20} />
                      <h3 className="font-semibold">{source.name}</h3>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      source.status === 'verified' ? 'bg-green-100 text-green-800' :
                      source.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{source.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500 dark:text-gray-400">Quality Score</span>
                      <span className={`font-medium ${
                        source.qualityScore >= 90 ? 'text-green-500' :
                        source.qualityScore >= 70 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>{source.qualityScore}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div
                        className={`h-full rounded-full ${
                          source.qualityScore >= 90 ? 'bg-green-500' :
                          source.qualityScore >= 70 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${source.qualityScore}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-between text-xs">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Clock size={14} className="mr-1" />
                      <span>Updated: {formatDate(source.lastUpdated)}</span>
                    </div>
                    <div className="text-blue-500 font-medium">View Details</div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <AlertCircle size={48} className="text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No data sources found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 