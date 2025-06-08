import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronUp, Check, Save, Clock, BrainCircuit, BarChart2, Sparkles, RefreshCw, Bell, Download } from 'lucide-react';
import axios from 'axios';

// Define filter state types
export interface AdvancedFilterState {
  areas: string[];
  metrics: string[];
  dateRange: {
    startDate: string;
    endDate: string;
  };
  categories: string[];
  predictionEnabled?: boolean;
  realTimeUpdates?: boolean;
  anomalyDetection?: boolean;
  autoRefreshInterval?: number; // in seconds
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface FilterOption {
  id: string;
  name: string;
  value: string;
}

export interface FilterGroup {
  id: string;
  name: string;
  options: FilterOption[];
  multiSelect: boolean;
}

export interface SavedFilter {
  id: string;
  name: string;
  filters: AdvancedFilterState;
}

interface DataInsight {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  metrics: string[];
  severity: 'low' | 'medium' | 'high';
}

interface AdvancedFiltersProps {
  filterGroups: FilterGroup[];
  onFilterChange: (filters: AdvancedFilterState) => void;
  initialFilters?: Partial<AdvancedFilterState>;
  showDateRange?: boolean;
  savedFilters?: SavedFilter[];
  onSaveFilter?: (name: string, filters: AdvancedFilterState) => void;
  enablePredictiveFiltering?: boolean;
  enableRealTimeUpdates?: boolean;
  dataInsights?: DataInsight[];
}

export default function AdvancedFilters({
  filterGroups,
  onFilterChange,
  initialFilters,
  showDateRange = false,
  savedFilters = [],
  onSaveFilter,
  enablePredictiveFiltering = false,
  enableRealTimeUpdates = false,
  dataInsights = []
}: AdvancedFiltersProps) {
  // Initialize filter state with new fields
  const [filters, setFilters] = useState<AdvancedFilterState>({
    areas: [],
    metrics: [],
    dateRange: {
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0]
    },
    categories: [],
    predictionEnabled: false,
    realTimeUpdates: false,
    anomalyDetection: false,
    autoRefreshInterval: 0
  });
  
  // State for UI controls
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [availableAreas, setAvailableAreas] = useState<FilterOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [saveFilterName, setSaveFilterName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [smartFilterSuggestions, setSmartFilterSuggestions] = useState<AdvancedFilterState[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);
  const [showInsights, setShowInsights] = useState(false);
  
  // Initialize expanded groups
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    filterGroups.forEach(group => {
      initialExpandedState[group.id] = true;
    });
    setExpandedGroups(initialExpandedState);
  }, [filterGroups]);
  
  // Apply initial filters if provided
  useEffect(() => {
    if (initialFilters) {
      setFilters(prev => ({
        ...prev,
        ...initialFilters
      }));
    }
  }, [initialFilters]);
  
  // Fetch available areas from API
  useEffect(() => {
    const fetchAreas = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        // For now, we'll use a simulated API call that returns after a short delay
        const response = await axios.get('/api/areas');
        
        // If the API call fails, use fallback data
        if (!response.data || response.status !== 200) {
          throw new Error('Failed to fetch areas');
        }
        
        setAvailableAreas(response.data);
      } catch (error) {
        console.error('Error fetching areas:', error);
        
        // Fallback areas data
        setAvailableAreas([
          { id: 'dhanmondi', name: 'Dhanmondi', value: 'dhanmondi' },
          { id: 'gulshan', name: 'Gulshan', value: 'gulshan' },
          { id: 'banani', name: 'Banani', value: 'banani' },
          { id: 'mirpur', name: 'Mirpur', value: 'mirpur' },
          { id: 'uttara', name: 'Uttara', value: 'uttara' },
          { id: 'motijheel', name: 'Motijheel', value: 'motijheel' },
          { id: 'mohammadpur', name: 'Mohammadpur', value: 'mohammadpur' },
          { id: 'oldDhaka', name: 'Old Dhaka', value: 'oldDhaka' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAreas();
  }, []);
  
  // Set up auto-refresh when real-time updates are enabled
  useEffect(() => {
    if (filters.realTimeUpdates && filters.autoRefreshInterval > 0) {
      // Clear any existing timer
      if (refreshTimer) {
        clearInterval(refreshTimer);
      }
      
      // Set new timer
      const timer = setInterval(() => {
        applyFilters();
        setLastUpdated(new Date());
      }, filters.autoRefreshInterval * 1000);
      
      setRefreshTimer(timer);
      
      return () => {
        if (timer) clearInterval(timer);
      };
    } else if (refreshTimer) {
      // Clear timer if real-time updates are disabled
      clearInterval(refreshTimer);
      setRefreshTimer(null);
    }
  }, [filters.realTimeUpdates, filters.autoRefreshInterval]);
  
  // Generate AI-powered filter suggestions
  const generateSmartFilterSuggestions = useCallback(async () => {
    setIsGeneratingSuggestions(true);
    
    try {
      // In a real implementation, this would call an AI service API
      // For this demo, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      // Generate some example suggestions based on current filters
      const suggestions: AdvancedFilterState[] = [
        {
          ...filters,
          areas: filters.areas.length ? filters.areas : ['high_congestion_areas'],
          metrics: ['congestion', 'incidents', 'speed'],
          categories: ['traffic_flow'],
          predictionEnabled: true,
          anomalyDetection: true
        },
        {
          ...filters,
          dateRange: {
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0]
          },
          metrics: ['congestion_trends', 'peak_hours'],
          categories: ['historical_analysis']
        },
        {
          ...filters,
          metrics: ['accidents', 'hazards', 'roadworks'],
          categories: ['safety'],
          anomalyDetection: true,
          realTimeUpdates: true,
          autoRefreshInterval: 60
        }
      ];
      
      setSmartFilterSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating smart filter suggestions:', error);
    } finally {
      setIsGeneratingSuggestions(false);
    }
  }, [filters]);
  
  // Apply a suggested filter
  const applySuggestion = (suggestion: AdvancedFilterState) => {
    setFilters(suggestion);
    onFilterChange(suggestion);
  };
  
  // Toggle predictive filtering
  const togglePredictiveFiltering = () => {
    setFilters(prev => ({
      ...prev,
      predictionEnabled: !prev.predictionEnabled
    }));
  };
  
  // Toggle real-time updates
  const toggleRealTimeUpdates = () => {
    setFilters(prev => ({
      ...prev,
      realTimeUpdates: !prev.realTimeUpdates,
      // Default to 30 seconds if enabling and not already set
      autoRefreshInterval: !prev.realTimeUpdates && !prev.autoRefreshInterval ? 30 : prev.autoRefreshInterval
    }));
  };
  
  // Toggle anomaly detection
  const toggleAnomalyDetection = () => {
    setFilters(prev => ({
      ...prev,
      anomalyDetection: !prev.anomalyDetection
    }));
  };
  
  // Set auto-refresh interval
  const setAutoRefreshInterval = (seconds: number) => {
    setFilters(prev => ({
      ...prev,
      autoRefreshInterval: seconds
    }));
  };
  
  // Handle filter changes
  const handleFilterChange = (groupId: string, value: string, checked: boolean) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      // Initialize the array if it doesn't exist
      if (!newFilters[groupId]) {
        newFilters[groupId] = [];
      }
      
      // Update the array based on checked state
      if (checked) {
        newFilters[groupId] = [...newFilters[groupId], value];
      } else {
        newFilters[groupId] = newFilters[groupId].filter((item: string) => item !== value);
      }
      
      return newFilters;
    });
  };
  
  // Handle area selection
  const handleAreaChange = (areaId: string, checked: boolean) => {
    setFilters(prev => {
      const newAreas = checked
        ? [...prev.areas, areaId]
        : prev.areas.filter(a => a !== areaId);
      
      return {
        ...prev,
        areas: newAreas
      };
    });
  };
  
  // Handle date range changes
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value
      }
    }));
  };
  
  // Toggle group expansion
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };
  
  // Apply filters
  const applyFilters = () => {
    onFilterChange(filters);
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      areas: [],
      metrics: [],
      dateRange: {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      },
      categories: [],
      predictionEnabled: false,
      realTimeUpdates: false,
      anomalyDetection: false,
      autoRefreshInterval: 0
    });
  };
  
  // Load a saved filter
  const loadSavedFilter = (savedFilter: SavedFilter) => {
    setFilters(savedFilter.filters);
    onFilterChange(savedFilter.filters);
  };
  
  // Save current filter
  const saveCurrentFilter = () => {
    if (saveFilterName.trim() && onSaveFilter) {
      onSaveFilter(saveFilterName, filters);
      setSaveFilterName('');
      setShowSaveDialog(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Advanced Filters
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Customize your view with precise filtering options
        </p>
      </div>
      
      {/* Areas filter section */}
      <div className="mb-4">
        <div 
          className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
          onClick={() => toggleGroup('areas')}
        >
          <h3 className="font-medium text-gray-800 dark:text-white">Areas</h3>
          {expandedGroups['areas'] ? 
            <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" /> : 
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
        </div>
        
        {expandedGroups['areas'] && (
          <div className="mt-2 pl-2">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableAreas.map(area => (
                  <div key={area.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`area-${area.id}`}
                      checked={filters.areas.includes(area.value)}
                      onChange={(e) => handleAreaChange(area.value, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={`area-${area.id}`}
                      className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      {area.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Date range filter */}
      {showDateRange && (
        <div className="mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            onClick={() => toggleGroup('dateRange')}
          >
            <h3 className="font-medium text-gray-800 dark:text-white">Date Range</h3>
            {expandedGroups['dateRange'] ? 
              <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" /> : 
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            }
          </div>
          
          {expandedGroups['dateRange'] && (
            <div className="mt-2 pl-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label 
                  htmlFor="startDate" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Start Date
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    id="startDate"
                    value={filters.dateRange.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label 
                  htmlFor="endDate" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  End Date
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    id="endDate"
                    value={filters.dateRange.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Dynamic filter groups */}
      {filterGroups.map(group => (
        <div key={group.id} className="mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            onClick={() => toggleGroup(group.id)}
          >
            <h3 className="font-medium text-gray-800 dark:text-white">{group.name}</h3>
            {expandedGroups[group.id] ? 
              <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" /> : 
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            }
          </div>
          
          {expandedGroups[group.id] && (
            <div className="mt-2 pl-2 grid grid-cols-2 md:grid-cols-3 gap-2">
              {group.options.map(option => (
                <div key={option.id} className="flex items-center">
                  <input
                    type={group.multiSelect ? "checkbox" : "radio"}
                    id={`${group.id}-${option.id}`}
                    name={group.id}
                    value={option.value}
                    checked={filters[group.id]?.includes(option.value)}
                    onChange={(e) => handleFilterChange(group.id, option.value, e.target.checked)}
                    className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ${group.multiSelect ? 'rounded' : 'rounded-full'}`}
                  />
                  <label 
                    htmlFor={`${group.id}-${option.id}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {option.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {/* Saved filters */}
      {savedFilters.length > 0 && (
        <div className="mb-4">
          <div 
            className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            onClick={() => toggleGroup('savedFilters')}
          >
            <h3 className="font-medium text-gray-800 dark:text-white">Saved Filters</h3>
            {expandedGroups['savedFilters'] ? 
              <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" /> : 
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            }
          </div>
          
          {expandedGroups['savedFilters'] && (
            <div className="mt-2 pl-2 space-y-2">
              {savedFilters.map(savedFilter => (
                <button
                  key={savedFilter.id}
                  onClick={() => loadSavedFilter(savedFilter)}
                  className="flex items-center w-full text-left p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
                >
                  <Check className="h-4 w-4 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {savedFilter.name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Save filter dialog */}
      {showSaveDialog && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-2">
            Save Current Filter
          </h4>
          <div className="flex">
            <input
              type="text"
              placeholder="Filter name"
              value={saveFilterName}
              onChange={(e) => setSaveFilterName(e.target.value)}
              className="flex-grow border border-gray-300 dark:border-gray-600 rounded-l-md py-1 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
            />
            <button
              onClick={saveCurrentFilter}
              disabled={!saveFilterName.trim()}
              className="bg-blue-500 text-white rounded-r-md px-3 py-1 text-sm disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </div>
      )}
      
      {/* Real-time updates section */}
      {enableRealTimeUpdates && (
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            onClick={() => toggleGroup('realtime')}>
            <div className="flex items-center">
              <RefreshCw className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium text-gray-800 dark:text-white">Real-Time Updates</h3>
            </div>
            {expandedGroups['realtime'] ? 
              <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" /> : 
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            }
          </div>
          
          {expandedGroups['realtime'] && (
            <div className="mt-2 pl-2 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="toggle-realtime"
                  checked={filters.realTimeUpdates}
                  onChange={toggleRealTimeUpdates}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor="toggle-realtime"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Enable real-time data updates
                </label>
              </div>
              
              {filters.realTimeUpdates && (
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Auto-refresh interval (seconds)
                  </label>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setAutoRefreshInterval(15)}
                      className={`px-2 py-1 text-xs rounded ${filters.autoRefreshInterval === 15 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      15s
                    </button>
                    <button 
                      onClick={() => setAutoRefreshInterval(30)}
                      className={`px-2 py-1 text-xs rounded ${filters.autoRefreshInterval === 30 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      30s
                    </button>
                    <button 
                      onClick={() => setAutoRefreshInterval(60)}
                      className={`px-2 py-1 text-xs rounded ${filters.autoRefreshInterval === 60 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      1m
                    </button>
                    <button 
                      onClick={() => setAutoRefreshInterval(300)}
                      className={`px-2 py-1 text-xs rounded ${filters.autoRefreshInterval === 300 ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    >
                      5m
                    </button>
                  </div>
                  
                  {lastUpdated && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Last updated: {lastUpdated.toLocaleTimeString()}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Smart Filtering / AI-powered filtering */}
      {enablePredictiveFiltering && (
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            onClick={() => toggleGroup('smart')}>
            <div className="flex items-center">
              <BrainCircuit className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="font-medium text-gray-800 dark:text-white">Smart Filtering</h3>
              <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">AI</span>
            </div>
            {expandedGroups['smart'] ? 
              <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" /> : 
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            }
          </div>
          
          {expandedGroups['smart'] && (
            <div className="mt-2 pl-2 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="toggle-prediction"
                  checked={filters.predictionEnabled}
                  onChange={togglePredictiveFiltering}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor="toggle-prediction"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Enable predictive traffic insights
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="toggle-anomaly"
                  checked={filters.anomalyDetection}
                  onChange={toggleAnomalyDetection}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label 
                  htmlFor="toggle-anomaly"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Enable anomaly detection
                </label>
              </div>
              
              <div>
                <button
                  onClick={generateSmartFilterSuggestions}
                  disabled={isGeneratingSuggestions}
                  className="flex items-center px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                >
                  {isGeneratingSuggestions ? (
                    <>
                      <div className="mr-2 h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate AI Filter Suggestions
                    </>
                  )}
                </button>
              </div>
              
              {smartFilterSuggestions.length > 0 && (
                <div className="mt-2 space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Suggested Filters:</h4>
                  {smartFilterSuggestions.map((suggestion, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-sm">
                      <div className="mb-1 text-xs text-gray-500 dark:text-gray-400">
                        {suggestion.predictionEnabled && 'Predictive • '}
                        {suggestion.anomalyDetection && 'Anomaly Detection • '}
                        {suggestion.realTimeUpdates && 'Real-time • '}
                        {suggestion.categories.join(', ')}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium text-gray-800 dark:text-white">
                          {suggestion.areas.length > 0 
                            ? `${suggestion.areas.length} areas, ${suggestion.metrics.length} metrics` 
                            : `${suggestion.metrics.length} metrics, ${
                                Math.round((new Date(suggestion.dateRange.endDate).getTime() - 
                                new Date(suggestion.dateRange.startDate).getTime()) / (1000 * 60 * 60 * 24)
                              )} days`
                          }
                        </div>
                        <button
                          onClick={() => applySuggestion(suggestion)}
                          className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Data Insights Section */}
      {dataInsights.length > 0 && (
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
            onClick={() => setShowInsights(!showInsights)}>
            <div className="flex items-center">
              <BarChart2 className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="font-medium text-gray-800 dark:text-white">Data Insights</h3>
              <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                {dataInsights.length}
              </span>
            </div>
            {showInsights ? 
              <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" /> : 
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            }
          </div>
          
          {showInsights && (
            <div className="mt-2 space-y-2">
              {dataInsights.map(insight => (
                <div key={insight.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <div className="flex items-center mb-1">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white">{insight.title}</h4>
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      insight.severity === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                      insight.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                      'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                    }`}>
                      {insight.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">{insight.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {insight.metrics.join(', ')}
                    </div>
                    <button
                      onClick={() => {
                        // Apply this insight's recommendations as filters
                        const newFilters = {
                          ...filters,
                          metrics: [...filters.metrics, ...insight.metrics.filter(m => !filters.metrics.includes(m))]
                        };
                        setFilters(newFilters);
                        onFilterChange(newFilters);
                      }}
                      className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Apply Recommendation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Notification / Alerts Section - add before the actions section */}
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md"
          onClick={() => toggleGroup('notifications')}>
          <div className="flex items-center">
            <Bell className="h-5 w-5 text-amber-500 mr-2" />
            <h3 className="font-medium text-gray-800 dark:text-white">Filter Alerts</h3>
          </div>
          {expandedGroups['notifications'] ? 
            <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-400" /> : 
            <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          }
        </div>
        
        {expandedGroups['notifications'] && (
          <div className="mt-2 pl-2 space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set up alerts for when filter conditions meet specific thresholds
            </p>
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="alert-congestion"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="alert-congestion" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Alert when congestion exceeds threshold
                </label>
              </div>
              
              <div className="pl-6">
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  defaultValue="75"
                  className="w-full max-w-xs"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 max-w-xs">
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="alert-incidents"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="alert-incidents" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Alert on new traffic incidents
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="alert-anomalies"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="alert-anomalies" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Alert on traffic anomalies
              </label>
            </div>
            
            <button className="flex items-center px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors">
              <Bell className="h-4 w-4 mr-2" />
              Save Alert Settings
            </button>
          </div>
        )}
      </div>
      
      {/* Export options - add after the actions section */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <button className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Export Filtered Data
          </button>
          
          <div className="relative group">
            <button className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <BarChart2 className="h-4 w-4" />
            </button>
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 hidden group-hover:block z-10">
              <div className="text-xs text-gray-700 dark:text-gray-300 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
                Export as CSV
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
                Export as Excel
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
                Export as PDF
              </div>
              <div className="text-xs text-gray-700 dark:text-gray-300 py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded">
                Export Chart as Image
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-wrap gap-2 mt-6">
        <button
          onClick={applyFilters}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
        >
          Apply Filters
        </button>
        
        <button
          onClick={resetFilters}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
        >
          Reset
        </button>
        
        {onSaveFilter && (
          <button
            onClick={() => setShowSaveDialog(!showSaveDialog)}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 ml-auto text-sm flex items-center"
          >
            <Save className="h-4 w-4 mr-1" />
            {showSaveDialog ? 'Cancel' : 'Save Filter'}
          </button>
        )}
      </div>
    </div>
  );
} 