import { format, subDays, addDays } from 'date-fns';
import { fetchRealTimeTrafficData, fetchRealTimeAirQualityData } from './RealTimeDataService';
import apiService from './apiService';

export interface TrendDataPoint {
  date: string;
  value: number;
}

export interface PredictionDataPoint {
  date: string;
  predicted: number;
  confidence: number; // Confidence level (0-100)
}

/**
 * Fetch historical traffic data for trend analysis
 */
export async function fetchTrafficTrendData(
  lat: number,
  lon: number,
  days: number = 7,
  apiKey: string
): Promise<TrendDataPoint[]> {
  console.log(`Fetching traffic data for lat: ${lat}, lon: ${lon} with API key: ${apiKey}`);
  
  // Simulate API call with timeout
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real implementation, we would use the apiKey to fetch from an actual API
  // Generate realistic historical data
  const today = new Date();
  const result: TrendDataPoint[] = [];
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Create realistic patterns
    // Weekends have lower congestion
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Base congestion varies with location
    let baseCongestion = 50;
    
    // Higher congestion for certain locations (like city centers)
    const distanceFromCenter = Math.sqrt(Math.pow(lat - 35, 2) + Math.pow(lon - 120, 2));
    if (distanceFromCenter < 10) {
      baseCongestion += 15;
    }
    
    // Add daily variation
    baseCongestion = isWeekend ? 
      baseCongestion * 0.7 + (Math.random() * 10) : // Weekend pattern
      baseCongestion + (Math.random() * 15); // Weekday pattern
    
    // Add some randomness but keep a trend
    const value = Math.min(100, Math.max(20, Math.round(baseCongestion)));
    
    result.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      value
    });
  }
  
  return result;
}

/**
 * Fetch historical air quality data for trend analysis
 */
export async function fetchAirQualityTrendData(
  lat: number,
  lon: number,
  days: number = 7,
  apiKey: string
): Promise<TrendDataPoint[]> {
  try {
    const trendData: TrendDataPoint[] = [];
    
    // Get current data first
    const currentData = await fetchRealTimeAirQualityData(lat, lon, apiKey);
    
    // Calculate the current air quality value (PM2.5)
    const currentAQ = currentData.list?.[0]?.components?.pm2_5 || 20;
    
    // Add current data point
    trendData.push({
      date: format(new Date(), 'yyyy-MM-dd'),
      value: currentAQ
    });
    
    // Generate "historical" data for previous days
    // In production, replace this with actual API calls to a historical data service
    for (let i = 1; i <= days; i++) {
      const date = subDays(new Date(), i);
      
      // Calculate a "historical" value with some random variation around current value
      // In production, this would be real historical data
      const variation = Math.sin(i * 0.7) * 8 + (Math.random() * 6 - 3);
      const historicalValue = Math.max(
        5, 
        Math.min(
          80, 
          currentAQ + variation
        )
      );
      
      trendData.push({
        date: format(date, 'yyyy-MM-dd'),
        value: Math.round(historicalValue * 10) / 10
      });
    }
    
    // Sort by date (oldest to newest)
    return trendData.sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } catch (error) {
    console.error('Error fetching air quality trend data:', error);
    throw error;
  }
}

/**
 * Generate traffic prediction data
 * In a real implementation, this would call an ML model API
 */
export async function predictTrafficData(
  lat: number,
  lon: number,
  days: number = 7,
  apiKey: string
): Promise<PredictionDataPoint[]> {
  console.log(`Predicting traffic data for lat: ${lat}, lon: ${lon} with API key: ${apiKey}`);
  
  // Simulate API call with timeout
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // In a real implementation, we would use a machine learning model
  // For this demo, we'll generate plausible predictions with increasing uncertainty
  
  const today = new Date();
  const result: PredictionDataPoint[] = [];
  
  // Get some historical data to base predictions on
  const historicalData = await fetchTrafficTrendData(lat, lon, 7, apiKey);
  const lastValue = historicalData[historicalData.length - 1].value;
  
  // Calculate average and trend from historical data
  let sum = 0;
  let trend = 0;
  
  for (let i = 1; i < historicalData.length; i++) {
    sum += historicalData[i].value;
    trend += historicalData[i].value - historicalData[i-1].value;
  }
  
  const average = sum / (historicalData.length - 1);
  const averageTrend = trend / (historicalData.length - 1);
  
  // Generate predictions with increasing uncertainty
  for (let i = 1; i <= days; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    // Prediction becomes less certain further into the future
    const uncertaintyFactor = 1 + (i * 0.2);
    
    // Create realistic patterns based on day of week
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dayFactor = isWeekend ? 0.8 : 1.1;
    
    // Calculate predicted value using trend, average, and some seasonality
    let predicted = lastValue + (averageTrend * i * 0.5);
    predicted = (predicted + average) / 2 * dayFactor;
    
    // Add controlled randomness that increases with forecast distance
    predicted += (Math.random() * 10 - 5) * (i / days);
    
    // Ensure value is within reasonable bounds
    predicted = Math.min(100, Math.max(20, Math.round(predicted)));
    
    // Confidence decreases as we look further into the future
    const confidence = Math.max(30, Math.round(95 - (i * 8)));
    
    result.push({
      date: date.toISOString().split('T')[0],
      predicted,
      confidence
    });
  }
  
  return result;
}

/**
 * Generate air quality prediction data
 * In a real implementation, this would call an ML model API
 */
export async function predictAirQualityData(
  lat: number,
  lon: number,
  days: number = 7,
  apiKey: string
): Promise<PredictionDataPoint[]> {
  try {
    // First get historical data to base predictions on
    const historicalData = await fetchAirQualityTrendData(lat, lon, days, apiKey);
    
    if (!historicalData.length) {
      throw new Error('No historical data available for prediction');
    }
    
    // Calculate trend
    const values = historicalData.map(point => point.value);
    
    // Simple linear trend (could be replaced with more sophisticated algorithms)
    const firstVal = values[0];
    const lastVal = values[values.length - 1];
    const slope = (lastVal - firstVal) / (values.length - 1);
    
    // Generate predictions for future days
    const predictions: PredictionDataPoint[] = [];
    
    for (let i = 1; i <= days; i++) {
      const date = addDays(new Date(), i);
      
      // Linear prediction with some random variation
      // In production, replace with actual ML prediction model
      const linearPrediction = lastVal + (slope * i);
      const seasonalFactor = Math.sin(i * 0.7) * 5;
      const randomFactor = (Math.random() * 4 - 2);
      
      let predictedValue = linearPrediction + seasonalFactor + randomFactor;
      
      // Ensure value is within reasonable range
      predictedValue = Math.max(5, Math.min(80, predictedValue));
      
      // Confidence decreases as we predict further into the future
      const confidence = Math.max(20, 100 - (i * 8));
      
      predictions.push({
        date: format(date, 'yyyy-MM-dd'),
        predicted: Math.round(predictedValue * 10) / 10,
        confidence
      });
    }
    
    return predictions;
  } catch (error) {
    console.error('Error generating air quality predictions:', error);
    throw error;
  }
}

export const AnalyticsService = {
  fetchTrafficTrendData,
  fetchAirQualityTrendData,
  predictTrafficData,
  predictAirQualityData
};

export default AnalyticsService; 