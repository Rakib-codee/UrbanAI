import React from 'react';
import { motion } from 'framer-motion';

interface SimulationRun {
  id: string;
  scenario: string;
  date: string;
  duration: string;
  metrics: {
    trafficEfficiency: number;
    energyUsage: number;
    airQuality: number;
    publicSatisfaction: number;
  };
}

interface SimulationHistoryProps {
  onLoadSimulation: (id: string) => void;
}

export default function SimulationHistory({ onLoadSimulation }: SimulationHistoryProps) {
  // Mock simulation history data
  const simulationRuns: SimulationRun[] = [
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
    {
      id: 'sim-002',
      scenario: 'sustainable',
      date: '2023-11-14 10:15',
      duration: '45 minutes',
      metrics: {
        trafficEfficiency: 75,
        energyUsage: 55,
        airQuality: 88,
        publicSatisfaction: 85
      }
    },
    {
      id: 'sim-003',
      scenario: 'baseline',
      date: '2023-11-13 16:45',
      duration: '20 minutes',
      metrics: {
        trafficEfficiency: 65,
        energyUsage: 100,
        airQuality: 62,
        publicSatisfaction: 70
      }
    }
  ];

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
      <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Simulation History</h2>
        <button className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Scenario
              </th>
              <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Key Metrics
              </th>
              <th className="px-6 py-3 bg-gray-700 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {simulationRuns.map((run) => (
              <tr key={run.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {run.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {getScenarioName(run.scenario)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {run.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <div className="flex space-x-2">
                    <div className="flex items-center" title="Traffic Efficiency">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-1"></div>
                      <span>{run.metrics.trafficEfficiency}%</span>
                    </div>
                    <div className="flex items-center" title="Energy Usage">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                      <span>{run.metrics.energyUsage}%</span>
                    </div>
                    <div className="flex items-center" title="Air Quality">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      <span>{run.metrics.airQuality}%</span>
                    </div>
                    <div className="flex items-center" title="Public Satisfaction">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                      <span>{run.metrics.publicSatisfaction}%</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onLoadSimulation(run.id)}
                    className="text-indigo-400 hover:text-indigo-300 mr-3"
                  >
                    Load
                  </button>
                  <button className="text-gray-400 hover:text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 bg-gray-700 flex justify-between items-center">
        <span className="text-sm text-gray-300">Showing 3 of 3 simulation runs</span>
        <div className="flex space-x-2">
          <button className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm transition-colors">
            Previous
          </button>
          <button className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm transition-colors">
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}