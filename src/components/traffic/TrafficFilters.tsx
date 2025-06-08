import { useState, useEffect } from 'react';
import AdvancedFilters, { 
  AdvancedFilterState, 
  FilterGroup, 
  SavedFilter 
} from '@/components/filters/AdvancedFilters';

interface TrafficFiltersProps {
  onFilterChange: (filters: AdvancedFilterState) => void;
  initialFilters?: Partial<AdvancedFilterState>;
}

export default function TrafficFilters({ onFilterChange, initialFilters }: TrafficFiltersProps) {
  // Define filter groups for traffic data
  const trafficFilterGroups: FilterGroup[] = [
    {
      id: 'metrics',
      name: 'Traffic Metrics',
      options: [
        { id: 'congestion', name: 'Congestion Level', value: 'congestion' },
        { id: 'volume', name: 'Traffic Volume', value: 'volume' },
        { id: 'speed', name: 'Average Speed', value: 'speed' },
        { id: 'incidents', name: 'Incidents', value: 'incidents' },
        { id: 'travelTime', name: 'Travel Time', value: 'travelTime' }
      ],
      multiSelect: true
    },
    {
      id: 'roadTypes',
      name: 'Road Types',
      options: [
        { id: 'highway', name: 'Highways', value: 'highway' },
        { id: 'major', name: 'Major Roads', value: 'major' },
        { id: 'arterial', name: 'Arterial Roads', value: 'arterial' },
        { id: 'local', name: 'Local Streets', value: 'local' }
      ],
      multiSelect: true
    },
    {
      id: 'timeOfDay',
      name: 'Time of Day',
      options: [
        { id: 'morning', name: 'Morning Rush (6-10 AM)', value: 'morning' },
        { id: 'midday', name: 'Midday (10 AM-3 PM)', value: 'midday' },
        { id: 'evening', name: 'Evening Rush (3-7 PM)', value: 'evening' },
        { id: 'night', name: 'Night (7 PM-6 AM)', value: 'night' }
      ],
      multiSelect: true
    },
    {
      id: 'severity',
      name: 'Congestion Severity',
      options: [
        { id: 'low', name: 'Low (0-30%)', value: 'low' },
        { id: 'moderate', name: 'Moderate (30-60%)', value: 'moderate' },
        { id: 'high', name: 'High (60-80%)', value: 'high' },
        { id: 'severe', name: 'Severe (80-100%)', value: 'severe' }
      ],
      multiSelect: true
    }
  ];
  
  // State for saved filters - will be loaded from API or local storage
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  
  // Load saved filters from localStorage or API
  useEffect(() => {
    const loadSavedFilters = async () => {
      try {
        // Try to load from localStorage first
        const savedFiltersJson = localStorage.getItem('trafficSavedFilters');
        if (savedFiltersJson) {
          const parsedFilters = JSON.parse(savedFiltersJson);
          setSavedFilters(parsedFilters);
          return;
        }
        
        // If not in localStorage, try to load from API
        // In a real app, this would be an API call
        // For now, use default filters
        setSavedFilters([
          {
            id: 'morning-rush',
            name: 'Morning Rush Hour',
            filters: {
              areas: ['dhanmondi', 'gulshan', 'motijheel'],
              metrics: ['congestion', 'speed'],
              dateRange: {
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
              },
              categories: [],
              timeOfDay: ['morning'],
              roadTypes: ['major', 'arterial']
            }
          },
          {
            id: 'critical-areas',
            name: 'Critical Congestion Areas',
            filters: {
              areas: ['motijheel', 'gulshan'],
              metrics: ['congestion', 'incidents'],
              dateRange: {
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
              },
              categories: [],
              severity: ['high', 'severe']
            }
          }
        ]);
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    };
    
    loadSavedFilters();
  }, []);
  
  // Handle saving a new filter
  const handleSaveFilter = (name: string, filters: AdvancedFilterState) => {
    const newFilter: SavedFilter = {
      id: `filter-${Date.now()}`,
      name,
      filters
    };
    
    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    
    // Save to localStorage
    try {
      localStorage.setItem('trafficSavedFilters', JSON.stringify(updatedFilters));
    } catch (error) {
      console.error('Error saving filters to localStorage:', error);
    }
    
    // In a real app, you would also save this to an API
    console.log('Filter saved:', newFilter);
  };
  
  return (
    <AdvancedFilters
      filterGroups={trafficFilterGroups}
      initialFilters={initialFilters}
      onFilterChange={onFilterChange}
      showDateRange={true}
      savedFilters={savedFilters}
      onSaveFilter={handleSaveFilter}
    />
  );
} 