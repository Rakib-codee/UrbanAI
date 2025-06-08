import React from 'react';
import { motion } from 'framer-motion';

interface ScenarioDetailsProps {
  scenario: string;
}

export default function ScenarioDetails({ scenario }: ScenarioDetailsProps) {
  const getScenarioDetails = () => {
    switch (scenario) {
      case 'baseline':
        return {
          title: 'Baseline Scenario',
          description: 'Current city configuration without optimizations',
          features: [
            'Current traffic signal patterns with fixed timing',
            'Standard energy consumption patterns',
            'Current green space distribution',
            'Existing public transportation routes',
            'No smart city infrastructure'
          ],
          metrics: {
            trafficEfficiency: '65%',
            energyUsage: '100%',
            airQuality: '62%',
            publicSatisfaction: '70%'
          }
        };
      case 'optimized':
        return {
          title: 'Optimized Traffic Scenario',
          description: 'Optimized traffic flow with AI-controlled signals',
          features: [
            'AI-controlled adaptive traffic signals',
            'Smart routing to distribute traffic load',
            'Real-time congestion management',
            'Optimized public transportation schedules',
            'Intelligent parking management'
          ],
          metrics: {
            trafficEfficiency: '85%',
            energyUsage: '85%',
            airQuality: '78%',
            publicSatisfaction: '82%'
          }
        };
      case 'sustainable':
        return {
          title: 'Sustainable City Scenario',
          description: 'Increased green spaces and renewable energy',
          features: [
            'Expanded urban green spaces and parks',
            'Solar panel integration on public buildings',
            'Reduced vehicle emissions through electrification',
            'Enhanced public transportation network',
            'Green roof implementation on commercial buildings'
          ],
          metrics: {
            trafficEfficiency: '75%',
            energyUsage: '55%',
            airQuality: '88%',
            publicSatisfaction: '85%'
          }
        };
      case 'future':
        return {
          title: 'Future City 2040 Scenario',
          description: 'Projected future with all AI recommendations implemented',
          features: [
            'Fully autonomous transportation system',
            'Comprehensive renewable energy infrastructure',
            'Integrated green spaces throughout urban areas',
            'Smart buildings with zero net energy consumption',
            'Advanced air quality management systems'
          ],
          metrics: {
            trafficEfficiency: '92%',
            energyUsage: '48%',
            airQuality: '95%',
            publicSatisfaction: '90%'
          }
        };
      default:
        return {
          title: 'Unknown Scenario',
          description: 'No details available',
          features: [],
          metrics: {
            trafficEfficiency: '0%',
            energyUsage: '0%',
            airQuality: '0%',
            publicSatisfaction: '0%'
          }
        };
    }
  };

  const details = getScenarioDetails();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">{details.title}</h2>
        <p className="mt-1 text-gray-400">{details.description}</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Key Features</h3>
            <ul className="space-y-2">
              {details.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-2 text-gray-300">{feature}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-300">Traffic Efficiency</span>
                  <span className="text-sm text-white">{details.metrics.trafficEfficiency}</span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                    <div 
                      style={{ width: details.metrics.trafficEfficiency }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-300">Energy Optimization</span>
                  <span className="text-sm text-white">{details.metrics.energyUsage}</span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                    <div 
                      style={{ width: details.metrics.energyUsage }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-300">Air Quality</span>
                  <span className="text-sm text-white">{details.metrics.airQuality}</span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                    <div 
                      style={{ width: details.metrics.airQuality }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                    ></div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-300">Public Satisfaction</span>
                  <span className="text-sm text-white">{details.metrics.publicSatisfaction}</span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-700">
                    <div 
                      style={{ width: details.metrics.publicSatisfaction }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}