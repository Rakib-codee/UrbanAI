// Basic API service for simulation data
export interface SimulationData {
  scenario: string;
  duration: number;
  parameters: Record<string, number>;
  location?: string;
}

export interface SimulationResult {
  id: string;
  success: boolean;
  metrics?: {
    trafficEfficiency?: number;
    energyUsage?: number;
    airQuality?: number;
    publicSatisfaction?: number;
    [key: string]: number | undefined;
  };
}

export interface SimulationHistoryItem {
  id: string;
  scenario: string;
  date: string;
  duration: string;
  metrics: {
    trafficEfficiency: number;
    energyUsage: number;
    airQuality: number;
    publicSatisfaction: number;
    [key: string]: number;
  };
}

export const simulationApi = {
  getScenarios: async () => {
    // Mock data for now, replace with actual API call
    return [
      { id: 'baseline', name: 'Baseline' },
      { id: 'optimized', name: 'Optimized Traffic' },
      { id: 'sustainable', name: 'Sustainable City' },
      { id: 'future', name: 'Future City 2040' }
    ];
  },
  
  saveSimulation: async (data: SimulationData): Promise<SimulationResult> => {
    console.log('Saving simulation data:', data);
    // Mock successful save
    return { success: true, id: 'sim-' + Date.now() };
  },
  
  getSimulationHistory: async (): Promise<SimulationHistoryItem[]> => {
    // Mock data for now
    return [
      {
        id: 'sim-001',
        scenario: 'optimized',
        date: '2023-11-15 14:30',
        duration: '30 minutes',
        metrics: {
          trafficEfficiency: 85,
          energyUsage: 85,
          airQuality: 78,
          publicSatisfaction: 82
        }
      },
      // ... other simulation history items
    ];
  }
};

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.urbanai.city';

// API service for real-time city data
export const cityDataApi = {
  // Traffic data
  getTrafficData: async (location?: string, timeFrame?: string) => {
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (timeFrame) params.append('timeFrame', timeFrame);
      
      const response = await fetch(`${API_BASE_URL}/traffic?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching traffic data: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch traffic data:', error);
      throw error;
    }
  },
  
  // Water resources data
  getWaterResourcesData: async (location?: string, timeFrame?: string) => {
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (timeFrame) params.append('timeFrame', timeFrame);
      
      const response = await fetch(`${API_BASE_URL}/water-resources?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching water resources data: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch water resources data:', error);
      throw error;
    }
  },
  
  // Energy usage data
  getEnergyData: async (location?: string, timeFrame?: string) => {
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (timeFrame) params.append('timeFrame', timeFrame);
      
      const response = await fetch(`${API_BASE_URL}/energy?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching energy data: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch energy data:', error);
      throw error;
    }
  },
  
  // Air quality data
  getAirQualityData: async (location?: string, timeFrame?: string) => {
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (timeFrame) params.append('timeFrame', timeFrame);
      
      const response = await fetch(`${API_BASE_URL}/air-quality?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching air quality data: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch air quality data:', error);
      throw error;
    }
  },
  
  // Green spaces data
  getGreenSpaceData: async (location?: string) => {
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      
      const response = await fetch(`${API_BASE_URL}/green-spaces?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching green space data: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch green space data:', error);
      throw error;
    }
  },
  
  // Historical data for analytics
  getHistoricalData: async (dataType: string, startDate: string, endDate: string, location?: string) => {
    try {
      const params = new URLSearchParams();
      params.append('dataType', dataType);
      params.append('startDate', startDate);
      params.append('endDate', endDate);
      if (location) params.append('location', location);
      
      const response = await fetch(`${API_BASE_URL}/historical-data?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching historical data: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch historical data:', error);
      throw error;
    }
  },
  
  // Send alerts or notifications
  sendAlert: async (alertData: {
    type: string;
    severity: 'info' | 'warning' | 'critical';
    message: string;
    location?: string;
    timestamp?: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      });
      
      if (!response.ok) {
        throw new Error(`Error sending alert: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to send alert:', error);
      throw error;
    }
  },
  
  // Update system settings or configurations
  updateSettings: async (settingsData: Record<string, unknown>) => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating settings: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }
};