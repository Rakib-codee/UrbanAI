import axios from 'axios';
import { TrafficData, ResourceData, AirQualityData } from './realTimeData';

// Types for prediction results
export interface TrafficPrediction {
  predictedCongestionLevel: number;
  predictedIncidents: number;
  predictedAverageSpeed: number;
  confidence: number;
  peakTimes: string[];
  recommendations: string[];
}

export interface ResourcePrediction {
  predictedWaterUsage: number;
  predictedElectricityUsage: number;
  predictedWasteGeneration: number;
  predictedRecyclingRate: number;
  savingsPotential: {
    water: number;
    electricity: number;
    waste: number;
  };
  recommendations: string[];
}

export interface AirQualityPrediction {
  predictedAqi: number;
  predictedPm25: number;
  predictedO3: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  healthImpact: string;
  recommendations: string[];
}

export interface PredictionOptions {
  timeFrame: 'day' | 'week' | 'month';
  includeRecommendations: boolean;
  confidenceInterval?: boolean;
}

// Default prediction options
const defaultOptions: PredictionOptions = {
  timeFrame: 'day',
  includeRecommendations: true,
  confidenceInterval: false,
};

/**
 * Predict future traffic conditions based on historical data
 * @param historicalData Array of historical traffic data points
 * @param options Prediction options
 */
export const predictTraffic = async (
  historicalData: TrafficData[],
  options: Partial<PredictionOptions> = {}
): Promise<TrafficPrediction> => {
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    // In a production environment, this would call an AI model API
    // For now, we're simulating predictions based on historical data

    // Try to use a real AI service if configured
    if (process.env.NEXT_PUBLIC_AI_SERVICE_URL) {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/predict/traffic`,
        {
          historicalData,
          options: mergedOptions
        }
      );
      
      return response.data;
    }
    
    // Fallback to simulated predictions
    return simulateTrafficPrediction(historicalData, mergedOptions);
  } catch (error) {
    console.error('Error predicting traffic:', error);
    return simulateTrafficPrediction(historicalData, mergedOptions);
  }
};

/**
 * Predict future resource usage based on historical data
 * @param historicalData Array of historical resource data points
 * @param options Prediction options
 */
export const predictResourceUsage = async (
  historicalData: ResourceData[],
  options: Partial<PredictionOptions> = {}
): Promise<ResourcePrediction> => {
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    // In a production environment, this would call an AI model API
    if (process.env.NEXT_PUBLIC_AI_SERVICE_URL) {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/predict/resources`,
        {
          historicalData,
          options: mergedOptions
        }
      );
      
      return response.data;
    }
    
    // Fallback to simulated predictions
    return simulateResourcePrediction(historicalData, mergedOptions);
  } catch (error) {
    console.error('Error predicting resource usage:', error);
    return simulateResourcePrediction(historicalData, mergedOptions);
  }
};

/**
 * Predict future air quality based on historical data
 * @param historicalData Array of historical air quality data points
 * @param options Prediction options
 */
export const predictAirQuality = async (
  historicalData: AirQualityData[],
  options: Partial<PredictionOptions> = {}
): Promise<AirQualityPrediction> => {
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    // In a production environment, this would call an AI model API
    if (process.env.NEXT_PUBLIC_AI_SERVICE_URL) {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_AI_SERVICE_URL}/predict/airquality`,
        {
          historicalData,
          options: mergedOptions
        }
      );
      
      return response.data;
    }
    
    // Fallback to simulated predictions
    return simulateAirQualityPrediction(historicalData, mergedOptions);
  } catch (error) {
    console.error('Error predicting air quality:', error);
    return simulateAirQualityPrediction(historicalData, mergedOptions);
  }
};

// Helper functions to simulate predictions

/**
 * Simulate traffic prediction using basic statistical analysis
 */
const simulateTrafficPrediction = (
  historicalData: TrafficData[],
  options: PredictionOptions
): TrafficPrediction => {
  if (!historicalData || historicalData.length === 0) {
    return {
      predictedCongestionLevel: 45,
      predictedIncidents: 2,
      predictedAverageSpeed: 35,
      confidence: 70,
      peakTimes: ['08:00-09:30', '17:00-18:30'],
      recommendations: [
        'Consider implementing congestion pricing',
        'Encourage public transportation usage',
        'Optimize traffic signal timing'
      ]
    };
  }

  // Calculate average congestion level
  const avgCongestion = historicalData.reduce(
    (sum, data) => sum + data.congestionLevel, 
    0
  ) / historicalData.length;
  
  // Simulate day/week/month prediction adjustment
  let timeFactor = 1;
  switch (options.timeFrame) {
    case 'week':
      timeFactor = 1.2;
      break;
    case 'month':
      timeFactor = 1.5;
      break;
    default:
      timeFactor = 1;
  }
  
  // Current hour affects prediction
  const hour = new Date().getHours();
  let hourFactor = 1;
  
  // Rush hours have higher congestion
  if ((hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 18)) {
    hourFactor = 1.3;
  } else if (hour >= 22 || hour <= 5) {
    hourFactor = 0.6; // Late night has less congestion
  }
  
  const predictedCongestion = Math.min(
    100, 
    Math.max(10, avgCongestion * hourFactor * timeFactor)
  );
  
  // Predict incidents based on congestion
  const predictedIncidents = Math.round(
    (predictedCongestion / 100) * 5 * timeFactor
  );
  
  // Predict speed (inversely related to congestion)
  const predictedSpeed = Math.max(
    5, 
    55 - (predictedCongestion / 100) * 40
  );
  
  // Generate appropriate recommendations
  const recommendations = [];
  
  if (predictedCongestion > 70) {
    recommendations.push('Implement emergency traffic management protocols');
    recommendations.push('Consider temporary road closures to redirect traffic');
    recommendations.push('Alert citizens to avoid affected areas');
  } else if (predictedCongestion > 50) {
    recommendations.push('Optimize traffic signal timing in affected areas');
    recommendations.push('Encourage use of alternative routes');
    recommendations.push('Promote public transportation or carpooling');
  } else {
    recommendations.push('Routine traffic monitoring recommended');
    recommendations.push('Good time for scheduled road maintenance');
    recommendations.push('Continue normal traffic operations');
  }
  
  return {
    predictedCongestionLevel: Math.round(predictedCongestion * 10) / 10,
    predictedIncidents: predictedIncidents,
    predictedAverageSpeed: Math.round(predictedSpeed * 10) / 10,
    confidence: Math.round(85 - (timeFactor * 10)),
    peakTimes: ['08:00-09:30', '17:00-18:30'],
    recommendations: options.includeRecommendations ? recommendations : []
  };
};

/**
 * Simulate resource usage prediction
 */
const simulateResourcePrediction = (
  historicalData: ResourceData[],
  options: PredictionOptions
): ResourcePrediction => {
  if (!historicalData || historicalData.length === 0) {
    return {
      predictedWaterUsage: 125,
      predictedElectricityUsage: 145,
      predictedWasteGeneration: 48,
      predictedRecyclingRate: 28,
      savingsPotential: {
        water: 15,
        electricity: 20,
        waste: 10
      },
      recommendations: [
        'Implement water-saving fixtures in public buildings',
        'Transition to LED lighting in city infrastructure',
        'Expand recycling programs in high-waste areas'
      ]
    };
  }

  // Calculate averages from historical data
  const avgWaterUsage = historicalData.reduce(
    (sum, data) => sum + data.waterUsage, 
    0
  ) / historicalData.length;
  
  const avgElectricityUsage = historicalData.reduce(
    (sum, data) => sum + data.electricityUsage, 
    0
  ) / historicalData.length;
  
  const avgWasteGeneration = historicalData.reduce(
    (sum, data) => sum + data.wasteGeneration, 
    0
  ) / historicalData.length;
  
  const avgRecyclingRate = historicalData.reduce(
    (sum, data) => sum + data.recyclingRate, 
    0
  ) / historicalData.length;
  
  // Adjust predictions based on time frame
  let timeFactor = 1;
  switch (options.timeFrame) {
    case 'week':
      timeFactor = 1.1;
      break;
    case 'month':
      timeFactor = 1.25;
      break;
    default:
      timeFactor = 1;
  }
  
  // Seasonal adjustments
  const month = new Date().getMonth();
  let seasonalWaterFactor = 1;
  let seasonalElectricityFactor = 1;
  
  // Summer months: more water usage, more electricity (AC)
  if (month >= 5 && month <= 8) {
    seasonalWaterFactor = 1.3;
    seasonalElectricityFactor = 1.4;
  } 
  // Winter months: less water usage, more electricity (heating)
  else if (month === 11 || month === 0 || month === 1) {
    seasonalWaterFactor = 0.8;
    seasonalElectricityFactor = 1.5;
  }
  
  const predictedWaterUsage = avgWaterUsage * seasonalWaterFactor * timeFactor;
  const predictedElectricityUsage = avgElectricityUsage * seasonalElectricityFactor * timeFactor;
  const predictedWasteGeneration = avgWasteGeneration * timeFactor;
  
  // Recycling rate tends to improve over time with education
  const predictedRecyclingRate = Math.min(95, avgRecyclingRate * (1 + (0.05 * timeFactor)));
  
  // Calculate potential savings
  const waterSavings = predictedWaterUsage * 0.12; // 12% potential savings
  const electricitySavings = predictedElectricityUsage * 0.15; // 15% potential savings
  const wasteSavings = predictedWasteGeneration * 0.2; // 20% potential reduction
  
  // Generate recommendations
  const recommendations = [];
  
  if (predictedWaterUsage > 150) {
    recommendations.push('Implement water use restrictions during peak hours');
    recommendations.push('Inspect water infrastructure for leaks and inefficiencies');
  } else {
    recommendations.push('Continue water conservation education programs');
  }
  
  if (predictedElectricityUsage > 160) {
    recommendations.push('Implement rolling energy conservation measures');
    recommendations.push('Accelerate transition to renewable energy sources');
  } else {
    recommendations.push('Encourage off-peak electricity usage through pricing incentives');
  }
  
  if (predictedRecyclingRate < 30) {
    recommendations.push('Enhance recycling education and awareness programs');
    recommendations.push('Increase accessibility of recycling facilities');
  } else {
    recommendations.push('Expand composting programs to further reduce waste');
  }
  
  return {
    predictedWaterUsage: Math.round(predictedWaterUsage),
    predictedElectricityUsage: Math.round(predictedElectricityUsage),
    predictedWasteGeneration: Math.round(predictedWasteGeneration),
    predictedRecyclingRate: Math.round(predictedRecyclingRate),
    savingsPotential: {
      water: Math.round(waterSavings),
      electricity: Math.round(electricitySavings),
      waste: Math.round(wasteSavings)
    },
    recommendations: options.includeRecommendations ? recommendations : []
  };
};

/**
 * Simulate air quality prediction
 */
const simulateAirQualityPrediction = (
  historicalData: AirQualityData[],
  options: PredictionOptions
): AirQualityPrediction => {
  if (!historicalData || historicalData.length === 0) {
    return {
      predictedAqi: 65,
      predictedPm25: 42,
      predictedO3: 35,
      riskLevel: 'moderate',
      healthImpact: 'May cause breathing discomfort for sensitive individuals',
      recommendations: [
        'Sensitive groups should reduce prolonged outdoor activities',
        'Consider implementing temporary traffic reduction measures',
        'Increase monitoring frequency in affected areas'
      ]
    };
  }

  // Calculate averages from historical data
  const avgAqi = historicalData.reduce(
    (sum, data) => sum + data.aqi, 
    0
  ) / historicalData.length;
  
  const avgPm25 = historicalData.reduce(
    (sum, data) => sum + data.pm25, 
    0
  ) / historicalData.length;
  
  const avgO3 = historicalData.reduce(
    (sum, data) => sum + data.o3, 
    0
  ) / historicalData.length;
  
  // Adjust predictions based on time frame
  let timeFactor = 1;
  switch (options.timeFrame) {
    case 'week':
      timeFactor = 1.05;
      break;
    case 'month':
      timeFactor = 1.15;
      break;
    default:
      timeFactor = 1;
  }
  
  // Weather and seasonal factors
  const month = new Date().getMonth();
  let seasonalFactor = 1;
  
  // Summer months often have worse air quality due to ozone
  if (month >= 5 && month <= 8) {
    seasonalFactor = 1.2;
  } 
  // Winter can have worse air quality due to inversions
  else if (month === 11 || month === 0 || month === 1) {
    seasonalFactor = 1.15;
  }
  
  const predictedAqi = avgAqi * seasonalFactor * timeFactor;
  const predictedPm25 = avgPm25 * seasonalFactor * timeFactor;
  const predictedO3 = avgO3 * (month >= 5 && month <= 8 ? 1.3 : 1) * timeFactor;
  
  // Determine risk level based on AQI
  let riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  let healthImpact: string;
  
  if (predictedAqi < 50) {
    riskLevel = 'low';
    healthImpact = 'Air quality is satisfactory with minimal health risk';
  } else if (predictedAqi < 100) {
    riskLevel = 'moderate';
    healthImpact = 'May cause minor breathing discomfort for sensitive individuals';
  } else if (predictedAqi < 150) {
    riskLevel = 'high';
    healthImpact = 'Everyone may experience health effects, especially sensitive groups';
  } else {
    riskLevel = 'very-high';
    healthImpact = 'Health warnings of emergency conditions for general population';
  }
  
  // Generate recommendations
  const recommendations = [];
  
  if (riskLevel === 'very-high') {
    recommendations.push('Issue public health alert for vulnerable populations');
    recommendations.push('Implement emergency traffic reduction measures');
    recommendations.push('Consider temporary school and outdoor activity closures');
  } else if (riskLevel === 'high') {
    recommendations.push('Advise sensitive groups to avoid outdoor activities');
    recommendations.push('Implement voluntary driving restrictions');
    recommendations.push('Increase public transportation frequency');
  } else if (riskLevel === 'moderate') {
    recommendations.push('Monitor conditions for sensitive individuals');
    recommendations.push('Continue enforcement of emission standards');
    recommendations.push('Promote use of public transportation');
  } else {
    recommendations.push('Maintain current air quality monitoring');
    recommendations.push('Continue public education on emission reduction');
    recommendations.push('Good conditions for outdoor activities');
  }
  
  return {
    predictedAqi: Math.round(predictedAqi),
    predictedPm25: Math.round(predictedPm25),
    predictedO3: Math.round(predictedO3),
    riskLevel,
    healthImpact,
    recommendations: options.includeRecommendations ? recommendations : []
  };
}; 