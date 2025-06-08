import { useState, useEffect } from 'react';
import { fetchCityRankings, CityRanking, CityRankingFilter } from '@/services/SocialService';
import { ArrowUp, ArrowDown, Minus, Search, Filter, RefreshCw } from 'lucide-react';

interface CityRankingsProps {
  initialRankings?: CityRanking[];
  defaultFilters?: CityRankingFilter;
}

export default function CityRankings({
  initialRankings,
  defaultFilters = {}
}: CityRankingsProps) {
  const [rankings, setRankings] = useState<CityRanking[]>(initialRankings || []);
  const [filters, setFilters] = useState<CityRankingFilter>(defaultFilters);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(!initialRankings);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch rankings data when filters change
  useEffect(() => {
    if (initialRankings && !filters.country && !filters.sortBy) {
      // Use initial rankings if provided and no filters applied
      setRankings(initialRankings);
      return;
    }
    
    const fetchRankings = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCityRankings(filters);
        setRankings(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching city rankings:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRankings();
  }, [filters, initialRankings]);
  
  // Filter rankings by search term
  const filteredRankings = searchTerm
    ? rankings.filter(city => 
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : rankings;
  
  // Handle city selection for comparison
  const toggleCitySelection = (cityId: string) => {
    setSelectedCities(prev => {
      if (prev.includes(cityId)) {
        return prev.filter(id => id !== cityId);
      } else {
        // Limit to 3 cities for comparison
        const newSelection = [...prev, cityId];
        return newSelection.slice(-3);
      }
    });
  };
  
  // Get trend icon based on trend
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Get rank change display
  const getRankChangeDisplay = (city: CityRanking) => {
    const change = city.previousRank - city.rank;
    
    if (change > 0) {
      return (
        <span className="text-green-500 text-sm flex items-center">
          <ArrowUp className="h-3 w-3 mr-1" />+{change}
        </span>
      );
    } else if (change < 0) {
      return (
        <span className="text-red-500 text-sm flex items-center">
          <ArrowDown className="h-3 w-3 mr-1" />{change}
        </span>
      );
    } else {
      return (
        <span className="text-gray-500 text-sm flex items-center">
          <Minus className="h-3 w-3 mr-1" />0
        </span>
      );
    }
  };
  
  // Update filters
  const handleFilterChange = (filterKey: keyof CityRankingFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({});
    setSearchTerm('');
  };
  
  // Format score with color
  const formatScore = (score: number) => {
    let colorClass = 'text-gray-700 dark:text-gray-300';
    
    if (score >= 80) {
      colorClass = 'text-green-600 dark:text-green-400 font-semibold';
    } else if (score >= 60) {
      colorClass = 'text-blue-600 dark:text-blue-400';
    } else if (score >= 40) {
      colorClass = 'text-yellow-600 dark:text-yellow-400';
    } else {
      colorClass = 'text-red-600 dark:text-red-400';
    }
    
    return <span className={colorClass}>{score}</span>;
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
          City Sustainability Rankings
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Compare sustainability scores across major cities worldwide.
        </p>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white w-full sm:w-64"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            {/* Filter button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            
            {/* Reset button */}
            <button
              onClick={resetFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </button>
          </div>
        </div>
        
        {/* Filter panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  value={filters.sortBy || 'rank'}
                  onChange={e => handleFilterChange('sortBy', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                >
                  <option value="rank">Overall Rank</option>
                  <option value="sustainabilityScore">Sustainability Score</option>
                  <option value="trafficScore">Traffic Score</option>
                  <option value="airQualityScore">Air Quality Score</option>
                  <option value="greenSpaceScore">Green Space Score</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order
                </label>
                <select
                  value={filters.order || 'asc'}
                  onChange={e => handleFilterChange('order', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="Filter by country..."
                  value={filters.country || ''}
                  onChange={e => handleFilterChange('country', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Selected cities for comparison */}
      {selectedCities.length > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300">
              City Comparison
            </h3>
            <button
              onClick={() => setSelectedCities([])}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear Selection
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    City
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Overall
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Traffic
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Air Quality
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Green Space
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedCities.map(cityId => {
                  const city = rankings.find(c => c.id === cityId);
                  if (!city) return null;
                  
                  return (
                    <tr key={city.id} className="hover:bg-blue-100/50 dark:hover:bg-blue-800/30">
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {city.name}, {city.country}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {formatScore(city.sustainabilityScore)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {formatScore(city.trafficScore)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {formatScore(city.airQualityScore)}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {formatScore(city.greenSpaceScore)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Rankings table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64 text-red-500">
            <p>Error loading rankings. Please try again.</p>
          </div>
        ) : filteredRankings.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-gray-500">
            <p>No cities found matching your criteria.</p>
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  City
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sustainability Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Traffic
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Air Quality
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Green Space
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRankings.map(city => (
                <tr 
                  key={city.id}
                  className={`
                    hover:bg-gray-50 dark:hover:bg-gray-700/50
                    ${selectedCities.includes(city.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                  `}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white mr-2">
                        {city.rank}
                      </span>
                      {getRankChangeDisplay(city)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {city.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {city.country}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTrendIcon(city.trend)}
                      <span className="ml-1 text-sm capitalize text-gray-700 dark:text-gray-300">
                        {city.trend}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">
                      {formatScore(city.sustainabilityScore)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {formatScore(city.trafficScore)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {formatScore(city.airQualityScore)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {formatScore(city.greenSpaceScore)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleCitySelection(city.id)}
                      className={`px-3 py-1 rounded-md ${
                        selectedCities.includes(city.id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {selectedCities.includes(city.id) ? 'Selected' : 'Compare'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="p-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>Last updated: November 15, 2023. Data source: Global Sustainability Index.</p>
      </div>
    </div>
  );
} 