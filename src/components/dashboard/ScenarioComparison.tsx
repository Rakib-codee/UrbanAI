import React from 'react';
import { motion } from 'framer-motion';

interface ScenarioComparisonProps {
  scenarios: string[];
}

export default function ScenarioComparison({ scenarios }: ScenarioComparisonProps) {
  // Get metrics for each scenario
  const getMetrics = (scenario: string) => {
    switch (scenario) {
      case 'baseline':
        return {
          trafficEfficiency: 65,
          energyUsage: 100,
          airQuality: 62,
          publicSatisfaction: 70,
          co2Reduction: 0,
          costSavings: 0
        };
      case 'optimized':
        return {
          trafficEfficiency: 85,
          energyUsage: 85,
          airQuality: 78,
          publicSatisfaction: 82,
          co2Reduction: 18,
          costSavings: 22
        };
      case 'sustainable':
        return {
          trafficEfficiency: 75,
          energyUsage: 55,
          airQuality: 88,
          publicSatisfaction: 85,
          co2Reduction: 35,
          costSavings: 28
        };
      case 'future':
        return {
          trafficEfficiency: 92,
          energyUsage: 48,
          airQuality: 95,
          publicSatisfaction: 90,
          co2Reduction: 52,
          costSavings: 45
        };
      default:
        return {
          trafficEfficiency: 0,
          energyUsage: 0,
          airQuality: 0,
          publicSatisfaction: 0,
          co2Reduction: 0,
          costSavings: 0
        };
    }
  };

  // Get scenario name
  const getScenarioName = (scenario: string) => {
    switch (scenario) {
      case 'baseline':
        return 'Baseline';
      case 'optimized':
        return 'Optimized Traffic';
      case 'sustainable':
        return 'Sustainable City';
      case 'future':
        return 'Future City 2040';
      default:
        return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">Scenario Comparison</h2>
      </div>
      <div className="p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Metric
              </th>
              {scenarios.map((scenario) => (
                <th key={scenario} className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {getScenarioName(scenario)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                Traffic Efficiency
              </td>
              {scenarios.map((scenario) => (
                <td key={`${scenario}-traffic`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center">
                    <span className="mr-2">{getMetrics(scenario).trafficEfficiency}%</span>
                    <div className="relative w-24 h-2 bg-gray-700 rounded">
                      <div 
                        className="absolute top-0 left-0 h-full bg-indigo-500 rounded"
                        style={{ width: `${getMetrics(scenario).trafficEfficiency}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                Energy Usage
              </td>
              {scenarios.map((scenario) => (
                <td key={`${scenario}-energy`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center">
                    <span className="mr-2">{getMetrics(scenario).energyUsage}%</span>
                    <div className="relative w-24 h-2 bg-gray-700 rounded">
                      <div 
                        className="absolute top-0 left-0 h-full bg-yellow-500 rounded"
                        style={{ width: `${getMetrics(scenario).energyUsage}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                Air Quality
              </td>
              {scenarios.map((scenario) => (
                <td key={`${scenario}-air`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center">
                    <span className="mr-2">{getMetrics(scenario).airQuality}%</span>
                    <div className="relative w-24 h-2 bg-gray-700 rounded">
                      <div 
                        className="absolute top-0 left-0 h-full bg-green-500 rounded"
                        style={{ width: `${getMetrics(scenario).airQuality}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                Public Satisfaction
              </td>
              {scenarios.map((scenario) => (
                <td key={`${scenario}-satisfaction`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center">
                    <span className="mr-2">{getMetrics(scenario).publicSatisfaction}%</span>
                    <div className="relative w-24 h-2 bg-gray-700 rounded">
                      <div 
                        className="absolute top-0 left-0 h-full bg-purple-500 rounded"
                        style={{ width: `${getMetrics(scenario).publicSatisfaction}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                CO₂ Reduction
              </td>
              {scenarios.map((scenario) => (
                <td key={`${scenario}-co2`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center">
                    <span className="mr-2">{getMetrics(scenario).co2Reduction}%</span>
                    <div className="relative w-24 h-2 bg-gray-700 rounded">
                      <div 
                        className="absolute top-0 left-0 h-full bg-green-500 rounded"
                        style={{ width: `${getMetrics(scenario).co2Reduction}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                Cost Savings
              </td>
              {scenarios.map((scenario) => (
                <td key={`${scenario}-cost`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex items-center">
                    <span className="mr-2">{getMetrics(scenario).costSavings}%</span>
                    <div className="relative w-24 h-2 bg-gray-700 rounded">
                      <div 
                        className="absolute top-0 left-0 h-full bg-blue-500 rounded"
                        style={{ width: `${getMetrics(scenario).costSavings}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-gray-700">
        <div className="flex justify-end">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors">
            Export Comparison
          </button>
        </div>
      </div>
    </motion.div>
  );
}