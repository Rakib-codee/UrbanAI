import { useState, useEffect } from 'react';
import { Alert, AlertConfig } from '@/services/AIInsightsService';

interface AlertSystemProps {
  alerts: Alert[];
  alertConfig: AlertConfig;
  onAcknowledge: (alertId: string) => void;
  onConfigChange: (newConfig: AlertConfig) => void;
}

export default function AlertSystem({
  alerts,
  alertConfig,
  onAcknowledge,
  onConfigChange
}: AlertSystemProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState<AlertConfig>(alertConfig);
  
  // Update internal config when external config changes
  useEffect(() => {
    setConfig(alertConfig);
  }, [alertConfig]);
  
  // Apply configuration changes
  const handleConfigSave = () => {
    onConfigChange(config);
    setShowSettings(false);
  };
  
  // Get alert icon based on severity
  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'high':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };
  
  // Get background color based on severity
  const getAlertBackground = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700';
      case 'high':
        return 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700';
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700';
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Alert System
          {alerts.length > 0 && (
            <span className="ml-2 px-2 py-0.5 text-sm bg-red-500 text-white rounded-full">
              {alerts.length}
            </span>
          )}
        </h2>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      
      {showSettings ? (
        <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Alert Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Traffic Congestion Threshold ({config.trafficCongestionThreshold}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.trafficCongestionThreshold}
                onChange={(e) => setConfig({...config, trafficCongestionThreshold: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                PM2.5 Threshold ({config.airQualityPM25Threshold} μg/m³)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={config.airQualityPM25Threshold}
                onChange={(e) => setConfig({...config, airQualityPM25Threshold: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                AQI Threshold ({config.airQualityAQIThreshold})
              </label>
              <input
                type="range"
                min="0"
                max="500"
                value={config.airQualityAQIThreshold}
                onChange={(e) => setConfig({...config, airQualityAQIThreshold: Number(e.target.value)})}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="notifications"
                type="checkbox"
                checked={config.notificationsEnabled}
                onChange={(e) => setConfig({...config, notificationsEnabled: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable Notifications
              </label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfigSave}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>No active alerts</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`p-3 border rounded-lg flex items-start ${getAlertBackground(alert.severity)}`}
            >
              <div className="mr-3 mt-0.5">
                {getAlertIcon(alert.severity)}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {alert.title}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTimestamp(alert.timestamp)}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                  {alert.message}
                </p>
                
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="mt-2 text-sm px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 