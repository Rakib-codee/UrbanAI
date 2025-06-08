import { TrafficApiResponse } from './RealTimeDataService';
import { TrendDataPoint, PredictionDataPoint } from './AnalyticsService';

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  category: 'traffic' | 'air-quality' | 'resource' | 'general';
  actionable: boolean;
  timestamp: string;
}

export interface AIInsight {
  id: string;
  title: string;
  content: string;
  source: string;
  timestamp: string;
  category: 'traffic' | 'air-quality' | 'resource' | 'general';
}

export interface AlertConfig {
  trafficCongestionThreshold: number;
  airQualityPM25Threshold: number;
  airQualityAQIThreshold: number;
  resourceUsageThreshold: number;
  notificationsEnabled: boolean;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'traffic' | 'air-quality' | 'resource';
  timestamp: string;
  acknowledged: boolean;
}

const DEFAULT_ALERT_CONFIG: AlertConfig = {
  trafficCongestionThreshold: 70, // 0-100 scale
  airQualityPM25Threshold: 35, // μg/m³
  airQualityAQIThreshold: 100, // 0-500 scale
  resourceUsageThreshold: 85, // percentage
  notificationsEnabled: true
};

/**
 * Generate AI-powered recommendations based on traffic data and predictions
 */
export async function generateTrafficRecommendations(
  realtimeData: TrafficApiResponse,
  trendData: TrendDataPoint[],
  predictionData: PredictionDataPoint[],
  cityName: string
): Promise<AIRecommendation[]> {
  // In a real implementation, you would call an AI service API
  // For now, we'll generate recommendations based on simple logic
  
  const recommendations: AIRecommendation[] = [];
  const congestionLevel = realtimeData.congestion?.level || 50;
  const incidentCount = realtimeData.incidents?.length || 0;
  
  // Get trend direction (increasing or decreasing)
  let trendDirection = 'stable';
  if (trendData.length >= 2) {
    const firstHalf = trendData.slice(0, Math.floor(trendData.length / 2));
    const secondHalf = trendData.slice(Math.floor(trendData.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, point) => sum + point.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, point) => sum + point.value, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg * 1.1) {
      trendDirection = 'increasing';
    } else if (secondAvg < firstAvg * 0.9) {
      trendDirection = 'decreasing';
    }
  }
  
  // Check prediction data
  const futureCongestion = predictionData.length > 0 ? predictionData[0].predicted : congestionLevel;
  
  // Generate recommendations based on data
  if (congestionLevel > 70) {
    recommendations.push({
      id: `traffic-1-${Date.now()}`,
      title: 'Implement Dynamic Traffic Signal Control',
      description: `Current congestion levels in ${cityName} are high (${congestionLevel}%). We recommend implementing AI-powered traffic signal optimization to reduce wait times at major intersections.`,
      impact: 'high',
      category: 'traffic',
      actionable: true,
      timestamp: new Date().toISOString()
    });
  }
  
  if (trendDirection === 'increasing' && futureCongestion > congestionLevel) {
    recommendations.push({
      id: `traffic-2-${Date.now()}`,
      title: 'Expand Public Transportation Routes',
      description: `Traffic congestion is trending upward in ${cityName}. Consider expanding public transportation routes or frequency during peak hours to reduce private vehicle volume.`,
      impact: 'medium',
      category: 'traffic',
      actionable: true,
      timestamp: new Date().toISOString()
    });
  }
  
  if (incidentCount > 3) {
    recommendations.push({
      id: `traffic-3-${Date.now()}`,
      title: 'Increase Traffic Enforcement',
      description: `Multiple traffic incidents (${incidentCount}) detected. Recommend increasing traffic law enforcement in high-incident areas to improve safety.`,
      impact: 'medium',
      category: 'traffic',
      actionable: true,
      timestamp: new Date().toISOString()
    });
  }
  
  // Add a generic recommendation
  recommendations.push({
    id: `traffic-4-${Date.now()}`,
    title: 'Promote Carpooling Incentives',
    description: 'Implement or enhance carpooling incentives such as HOV lanes and reduced parking fees to decrease the number of vehicles during peak hours.',
    impact: 'medium',
    category: 'traffic',
    actionable: true,
    timestamp: new Date().toISOString()
  });
  
  return recommendations;
}

/**
 * Generate AI-powered recommendations based on air quality data and predictions
 */
export async function generateAirQualityRecommendations(
  pm25Level: number,
  trendData: TrendDataPoint[],
  predictionData: PredictionDataPoint[],
  cityName: string
): Promise<AIRecommendation[]> {
  // In a real implementation, you would call an AI service API
  // For now, we'll generate recommendations based on simple logic
  
  const recommendations: AIRecommendation[] = [];
  
  // Get trend direction (increasing or decreasing)
  let trendDirection = 'stable';
  if (trendData.length >= 2) {
    const firstHalf = trendData.slice(0, Math.floor(trendData.length / 2));
    const secondHalf = trendData.slice(Math.floor(trendData.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, point) => sum + point.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, point) => sum + point.value, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg * 1.1) {
      trendDirection = 'increasing';
    } else if (secondAvg < firstAvg * 0.9) {
      trendDirection = 'decreasing';
    }
  }
  
  // Check prediction data
  const futurePM25 = predictionData.length > 0 ? predictionData[0].predicted : pm25Level;
  
  // Generate recommendations based on data
  if (pm25Level > 35) {
    recommendations.push({
      id: `air-1-${Date.now()}`,
      title: 'Implement Vehicle Emission Controls',
      description: `PM2.5 levels in ${cityName} are high (${pm25Level} μg/m³). Recommend strengthening vehicle emission standards and increasing inspections to reduce pollutant sources.`,
      impact: 'high',
      category: 'air-quality',
      actionable: true,
      timestamp: new Date().toISOString()
    });
  }
  
  if (trendDirection === 'increasing' && futurePM25 > pm25Level) {
    recommendations.push({
      id: `air-2-${Date.now()}`,
      title: 'Expand Urban Green Spaces',
      description: `Air quality is trending downward in ${cityName}. Recommend increasing urban green spaces and tree planting initiatives to help filter pollutants naturally.`,
      impact: 'medium',
      category: 'air-quality',
      actionable: true,
      timestamp: new Date().toISOString()
    });
  }
  
  if (pm25Level > 25) {
    recommendations.push({
      id: `air-3-${Date.now()}`,
      title: 'Restrict High-Emission Activities',
      description: 'Consider implementing temporary restrictions on high-emission industrial activities during poor air quality periods.',
      impact: 'high',
      category: 'air-quality',
      actionable: true,
      timestamp: new Date().toISOString()
    });
  }
  
  // Add a generic recommendation
  recommendations.push({
    id: `air-4-${Date.now()}`,
    title: 'Promote Public Awareness Campaigns',
    description: 'Launch public awareness campaigns about air quality, its health impacts, and how citizens can contribute to improvement through daily choices.',
    impact: 'low',
    category: 'air-quality',
    actionable: true,
    timestamp: new Date().toISOString()
  });
  
  return recommendations;
}

/**
 * Check if current data exceeds alert thresholds
 */
export function checkForAlerts(
  trafficCongestion: number,
  pm25Level: number,
  alertConfig: AlertConfig = DEFAULT_ALERT_CONFIG
): Alert[] {
  const alerts: Alert[] = [];
  
  // Check traffic congestion alert
  if (trafficCongestion > alertConfig.trafficCongestionThreshold) {
    alerts.push({
      id: `traffic-alert-${Date.now()}`,
      title: 'High Traffic Congestion',
      message: `Traffic congestion level (${trafficCongestion}%) has exceeded the threshold (${alertConfig.trafficCongestionThreshold}%).`,
      severity: trafficCongestion > 90 ? 'critical' : 'high',
      category: 'traffic',
      timestamp: new Date().toISOString(),
      acknowledged: false
    });
  }
  
  // Check air quality alert
  if (pm25Level > alertConfig.airQualityPM25Threshold) {
    alerts.push({
      id: `air-alert-${Date.now()}`,
      title: 'Poor Air Quality',
      message: `PM2.5 level (${pm25Level} μg/m³) has exceeded the threshold (${alertConfig.airQualityPM25Threshold} μg/m³).`,
      severity: pm25Level > 55 ? 'critical' : 'high',
      category: 'air-quality',
      timestamp: new Date().toISOString(),
      acknowledged: false
    });
  }
  
  return alerts;
}

/**
 * Generate exportable report data
 */
export function generateReportData(
  cityName: string,
  trafficData: {
    current: number;
    trend: TrendDataPoint[];
    prediction: PredictionDataPoint[];
  },
  airQualityData: {
    current: number;
    trend: TrendDataPoint[];
    prediction: PredictionDataPoint[];
  },
  recommendations: AIRecommendation[]
): Record<string, unknown> {
  return {
    reportTitle: `Urban Analytics Report - ${cityName}`,
    generatedAt: new Date().toISOString(),
    location: cityName,
    trafficSummary: {
      currentCongestion: trafficData.current,
      averageTrend: trafficData.trend.reduce((sum, point) => sum + point.value, 0) / trafficData.trend.length,
      predictedTrend: trafficData.prediction.map(p => p.predicted),
      status: trafficData.current > 70 ? 'Critical' : trafficData.current > 50 ? 'Concerning' : 'Normal'
    },
    airQualitySummary: {
      currentPM25: airQualityData.current,
      averageTrend: airQualityData.trend.reduce((sum, point) => sum + point.value, 0) / airQualityData.trend.length,
      predictedTrend: airQualityData.prediction.map(p => p.predicted),
      status: airQualityData.current > 35 ? 'Unhealthy' : airQualityData.current > 12 ? 'Moderate' : 'Good'
    },
    topRecommendations: recommendations.filter(r => r.impact === 'high').map(r => ({
      title: r.title,
      description: r.description,
      category: r.category
    })),
    rawData: {
      trafficTrend: trafficData.trend,
      trafficPrediction: trafficData.prediction,
      airQualityTrend: airQualityData.trend,
      airQualityPrediction: airQualityData.prediction
    }
  };
}

/**
 * Convert report data to CSV format
 */
export function convertReportToCSV(reportData: Record<string, unknown>): string {
  // Helper function to flatten nested objects
  const flattenObject = (obj: Record<string, unknown>, prefix = ''): Record<string, string | number | boolean> => {
    return Object.keys(obj).reduce((acc: Record<string, string | number | boolean>, k) => {
      const pre = prefix.length ? `${prefix}.` : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k] as Record<string, unknown>, pre + k));
      } else if (Array.isArray(obj[k])) {
        // Handle arrays differently
        acc[pre + k] = JSON.stringify(obj[k]);
      } else {
        acc[pre + k] = obj[k] as string | number | boolean;
      }
      return acc;
    }, {});
  };
  
  // Flatten the report data
  const flatData = flattenObject(reportData);
  
  // Create CSV headers and values
  const headers = Object.keys(flatData).join(',');
  const values = Object.values(flatData).map(v => 
    typeof v === 'string' ? `"${v.replace(/"/g, '""')}"` : v
  ).join(',');
  
  return `${headers}\n${values}`;
}

export const AIInsightsService = {
  generateTrafficRecommendations,
  generateAirQualityRecommendations,
  checkForAlerts,
  generateReportData,
  convertReportToCSV,
  DEFAULT_ALERT_CONFIG
};

export default AIInsightsService; 