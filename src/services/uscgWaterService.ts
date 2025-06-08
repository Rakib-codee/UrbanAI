import axios from 'axios';

/**
 * Service for interacting with USCG Water API to get water safety and navigation data
 */
export interface WaterSafetyData {
  safetyIndex: number; // 0-100, higher is safer
  warnings: string[];
  advisories: string[];
  navigationalHazards: {
    type: string;
    description: string;
    severity: string;
  }[];
}

export interface WaterUsageData {
  recreationalIndex: number; // 0-100, higher is better for recreation
  navigationIndex: number; // 0-100, higher is better for navigation
  fishingIndex: number; // 0-100, higher is better for fishing
  commercialIndex: number; // 0-100, higher is better for commercial use
}

const UscgWaterService = {
  /**
   * Get water safety information for a location
   * @param lat Latitude
   * @param lon Longitude
   * @returns Water safety data
   */
  async getWaterSafetyData(lat: number, lon: number): Promise<any> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_USCG_WATER_API_KEY;
      
      if (!apiKey) {
        console.warn('USCG Water API key not set');
        return null;
      }
      
      // Note: This is a placeholder for the actual API endpoint
      // Replace with the correct USCG API endpoint when available
      const response = await axios.get(
        `https://api.uscgwaterdata.com/v1/safety`,
        {
          params: {
            lat,
            lon,
            api_key: apiKey
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching water safety data:', error);
      return null;
    }
  },
  
  /**
   * Generate water safety data for a location
   * This is a fallback when the API is not available or fails
   * @param city City name for context
   * @param lat Latitude
   * @param lon Longitude
   * @param isFreshWater Whether the location is freshwater (lake, river) or marine
   * @returns Generated water safety data
   */
  generateWaterSafetyData(city: string, lat: number, lon: number, isFreshWater: boolean): WaterSafetyData {
    // Generate deterministic but location-specific water safety data
    const locationHash = Math.floor((lat + 90) * 180 + (lon + 180));
    
    // Generate safety index (0-100)
    // Coastal waters typically have more hazards than inland waters
    const baseIndex = isFreshWater ? 75 : 65;
    const safetyIndex = Math.min(100, Math.max(30, baseIndex + (locationHash % 25) - 10));
    
    // Potential warnings based on location
    const allWarnings = [
      "Strong currents reported",
      "High tide expected",
      "Visibility may be reduced in early morning",
      "Shallow water in marked areas",
      "Heavy boat traffic expected",
      "Submerged objects reported",
      "Weather conditions may change rapidly",
      "Water temperature below seasonal average"
    ];
    
    // Potential advisories
    const allAdvisories = [
      "Life jackets recommended for all water activities",
      "Stay within designated swimming areas",
      "Check weather forecast before boating",
      "Be aware of local fishing regulations",
      "Maintain safe distance from wildlife",
      "Avoid swimming after heavy rainfall",
      "Monitor children at all times",
      "Be cautious of underwater currents"
    ];
    
    // Potential navigational hazards
    const allHazards = [
      { type: "Rocks", description: "Submerged rocks near shoreline", severity: "Medium" },
      { type: "Shallow", description: "Shallow water areas marked with buoys", severity: "Low" },
      { type: "Current", description: "Strong currents in channel", severity: "High" },
      { type: "Debris", description: "Floating debris reported", severity: "Low" },
      { type: "Restricted", description: "Restricted navigation zone", severity: "Medium" },
      { type: "Bridge", description: "Low clearance under bridge", severity: "Medium" },
      { type: "Traffic", description: "Heavy vessel traffic area", severity: "Medium" },
      { type: "Construction", description: "Ongoing water construction", severity: "High" }
    ];
    
    // Select warnings, advisories, and hazards based on location hash
    const warningCount = 1 + (locationHash % 3); // 1-3 warnings
    const advisoryCount = 2 + (locationHash % 3); // 2-4 advisories
    const hazardCount = 1 + (locationHash % 2); // 1-2 hazards
    
    const warnings: string[] = [];
    const advisories: string[] = [];
    const navigationalHazards: { type: string; description: string; severity: string }[] = [];
    
    for (let i = 0; i < warningCount; i++) {
      const index = (locationHash + i * 7) % allWarnings.length;
      warnings.push(allWarnings[index]);
    }
    
    for (let i = 0; i < advisoryCount; i++) {
      const index = (locationHash + i * 11) % allAdvisories.length;
      advisories.push(allAdvisories[index]);
    }
    
    for (let i = 0; i < hazardCount; i++) {
      const index = (locationHash + i * 13) % allHazards.length;
      navigationalHazards.push(allHazards[index]);
    }
    
    return {
      safetyIndex,
      warnings,
      advisories,
      navigationalHazards
    };
  },
  
  /**
   * Generate water usage data for a location
   * @param city City name for context
   * @param lat Latitude
   * @param lon Longitude
   * @param isFreshWater Whether the location is freshwater (lake, river) or marine
   * @returns Generated water usage data
   */
  generateWaterUsageData(city: string, lat: number, lon: number, isFreshWater: boolean): WaterUsageData {
    // Generate deterministic but location-specific water usage data
    const locationHash = Math.floor((lat + 90) * 180 + (lon + 180));
    
    // Base values differ for freshwater vs marine
    const recreationalBase = isFreshWater ? 70 : 65;
    const navigationBase = isFreshWater ? 65 : 75;
    const fishingBase = isFreshWater ? 75 : 70;
    const commercialBase = isFreshWater ? 60 : 80;
    
    // Add location-specific variation
    return {
      recreationalIndex: Math.min(100, Math.max(20, recreationalBase + (locationHash % 30) - 15)),
      navigationIndex: Math.min(100, Math.max(20, navigationBase + (locationHash % 30) - 15)),
      fishingIndex: Math.min(100, Math.max(20, fishingBase + (locationHash % 30) - 15)),
      commercialIndex: Math.min(100, Math.max(20, commercialBase + (locationHash % 30) - 15))
    };
  }
};

export default UscgWaterService; 