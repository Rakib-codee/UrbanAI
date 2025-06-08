import { useState, useEffect } from 'react';
import AIRecommendations from './AIRecommendations';
import AlertSystem from './AlertSystem';
import ReportGenerator from './ReportGenerator';
import { 
  AIRecommendation, 
  Alert, 
  AlertConfig, 
  generateTrafficRecommendations, 
  generateAirQualityRecommendations, 
  checkForAlerts 
} from '@/services/AIInsightsService';
import AIInsightsService from '@/services/AIInsightsService';
import { TrafficApiResponse, AirQualityApiResponse } from '@/services/RealTimeDataService';
import { TrendDataPoint, PredictionDataPoint } from '@/services/AnalyticsService';

interface ActionableInsightsProps {
  cityName: string;
  trafficData: {
    realtime: TrafficApiResponse | null;
    trend: TrendDataPoint[];
    prediction: PredictionDataPoint[];
  };
  airQualityData: {
    realtime: AirQualityApiResponse | null;
    trend: TrendDataPoint[];
    prediction: PredictionDataPoint[];
  };
}

export default function ActionableInsights({
  cityName,
  trafficData,
  airQualityData
}: ActionableInsightsProps) {
  // States for recommendations, alerts, and config
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [alertConfig, setAlertConfig] = useState<AlertConfig>(AIInsightsService.DEFAULT_ALERT_CONFIG);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(true);
  
  // Extract current traffic and air quality values
  const trafficCongestion = trafficData.realtime?.congestion?.level || 50;
  const pm25Level = airQualityData.realtime?.list?.[0]?.components?.pm2_5 || 20;
  
  // Fetch recommendations and check for alerts
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoadingRecommendations(true);
        
        // Only try to generate recommendations if we have the necessary data
        if (trafficData.realtime && trafficData.trend.length && trafficData.prediction.length) {
          const trafficRecommendations = await generateTrafficRecommendations(
            trafficData.realtime,
            trafficData.trend,
            trafficData.prediction,
            cityName
          );
          
          const airQualityRecommendations = await generateAirQualityRecommendations(
            pm25Level,
            airQualityData.trend,
            airQualityData.prediction,
            cityName
          );
          
          setRecommendations([...trafficRecommendations, ...airQualityRecommendations]);
        } else {
          // If data is not available, set empty recommendations
          setRecommendations([]);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };
    
    // Generate alerts based on current data
    const generateAlerts = () => {
      const newAlerts = checkForAlerts(trafficCongestion, pm25Level, alertConfig);
      
      // Only add new alerts that don't already exist
      const existingAlertIds = alerts.map(alert => alert.id);
      const uniqueNewAlerts = newAlerts.filter(alert => !existingAlertIds.includes(alert.id));
      
      if (uniqueNewAlerts.length > 0) {
        setAlerts(prevAlerts => [...uniqueNewAlerts, ...prevAlerts]);
      }
    };
    
    fetchRecommendations();
    generateAlerts();
    
    // Set up interval to check for alerts
    const alertInterval = setInterval(generateAlerts, 5 * 60 * 1000); // Every 5 minutes
    
    return () => {
      clearInterval(alertInterval);
    };
  }, [cityName, trafficData.realtime, airQualityData.realtime, trafficData.trend, trafficData.prediction, airQualityData.trend, airQualityData.prediction, pm25Level, trafficCongestion, alertConfig, alerts]);
  
  // Handle alert acknowledgment
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.filter(alert => alert.id !== alertId)
    );
  };
  
  // Handle alert config changes
  const handleAlertConfigChange = (newConfig: AlertConfig) => {
    setAlertConfig(newConfig);
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('alertConfig', JSON.stringify(newConfig));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIRecommendations 
            recommendations={recommendations}
            isLoading={isLoadingRecommendations}
            error={null}
          />
        </div>
        
        <div>
          <div className="space-y-6">
            <AlertSystem 
              alerts={alerts}
              alertConfig={alertConfig}
              onAcknowledge={handleAcknowledgeAlert}
              onConfigChange={handleAlertConfigChange}
            />
            
            <ReportGenerator 
              cityName={cityName}
              trafficData={{
                current: trafficCongestion,
                trend: trafficData.trend,
                prediction: trafficData.prediction
              }}
              airQualityData={{
                current: pm25Level,
                trend: airQualityData.trend,
                prediction: airQualityData.prediction
              }}
              recommendations={recommendations}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 