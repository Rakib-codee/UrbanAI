"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Save,
  Car,
  Building,
  TreePine,
  Users
} from "lucide-react";
import { useUrbanData } from "@/components/UrbanContext";
import { analyzeWithAI } from "@/services/apiService";

// Define simulation scenario types
type SimulationScenario = "traffic" | "growth" | "environmental" | "density";

// Define simulation result types
interface SimulationResults {
  congestionLevel?: number;
  averageSpeed?: number;
  waitTime?: number;
  trafficFlow?: number;
  populationGrowth?: number;
  landUseEfficiency?: number;
  economicImpact?: number;
  sustainabilityScore?: number;
  airQualityIndex?: number;
  greenSpaceCoverage?: number;
  carbonFootprint?: number;
  waterQuality?: number;
  populationDensity?: number;
  housingAvailability?: number;
  trafficImpact?: number;
  publicServiceAccess?: number;
  qualityOfLife?: number;
  hotspots?: Array<{
    name: string;
    level: string;
  }>;
  developmentAreas?: Array<{
    name: string;
    potential: string;
  }>;
  criticalAreas?: Array<{
    name: string;
    issue: string;
  }>;
}

// Define analysis result type from API service
interface AIAnalysisResult {
  insights: string;
  recommendations: string[];
  forecast: string;
}

// Define analysis result type for our component
interface AnalysisResult {
  summary: string;
  recommendations: string[];
  impact: {
    positive: string[];
    negative: string[];
  };
}

export default function UrbanSimulationPage() {
  const { darkMode, data, loading, location } = useUrbanData();
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>("traffic");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [simSpeed, setSimSpeed] = useState(1);
  const [simResults, setSimResults] = useState<SimulationResults | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Parameters for each simulation type
  const [trafficParams, setTrafficParams] = useState({
    density: 50,
    signalTiming: 60,
    publicTransport: 30,
    roadCondition: 70
  });
  
  const [growthParams, setGrowthParams] = useState({
    population: 65,
    commercialZone: 40,
    residentialZone: 50,
    industrialZone: 30
  });
  
  const [environmentalParams, setEnvironmentalParams] = useState({
    greenCoverage: 35,
    pollution: 60,
    wasteManagement: 45,
    waterUsage: 55
  });
  
  const [densityParams, setDensityParams] = useState({
    centralDensity: 80,
    suburbanDensity: 40,
    mixedUse: 50,
    infrastructure: 60,
    residentialDensity: 45
  });

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setProgress(0);
    setSimResults(null);
    setAnalysisResults(null);
  };

  // Run the simulation
  const runSimulation = () => {
    if (isRunning) {
      setIsRunning(false);
      return;
    }
    
    setIsRunning(true);
    setProgress(0);
    setSimResults(null);
    setAnalysisResults(null);
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          generateResults();
          return 100;
        }
        return prev + (1 * simSpeed);
      });
    }, 100);
  };
  
  // Generate simulation results based on parameters and real data
  const generateResults = async () => {
    let results: SimulationResults = {};
    
    // Use real traffic data from our API where available
    const trafficData = data.traffic;
    const weatherData = data.weather;
    
    switch (activeScenario) {
      case "traffic":
        results = {
          congestionLevel: trafficData?.congestion?.current || Math.round(100 - (trafficParams.signalTiming/100 * 30 + trafficParams.publicTransport/100 * 40 + trafficParams.roadCondition/100 * 30)),
          averageSpeed: trafficData?.congestion?.average || Math.round(10 + (trafficParams.roadCondition/100 * 50)),
          waitTime: Math.round(10 + (100 - trafficParams.signalTiming)/100 * 20),
          trafficFlow: trafficData?.volumes?.daily?.[4]?.volume || Math.round(500 + trafficParams.density * 10),
          hotspots: [
            { name: "Downtown", level: "High" },
            { name: "Highway Junction", level: "Medium" },
            { name: "Shopping District", level: trafficParams.density > 70 ? "High" : "Medium" }
          ]
        };
        break;
        
      case "growth":
        results = {
          populationGrowth: Math.round(growthParams.population/10),
          landUseEfficiency: Math.round((growthParams.commercialZone + growthParams.residentialZone + growthParams.industrialZone) / 3),
          economicImpact: Math.round(growthParams.commercialZone * 1.2),
          sustainabilityScore: Math.round((100 - growthParams.industrialZone) * 0.8),
          developmentAreas: [
            { name: "North District", potential: "High" },
            { name: "Waterfront", potential: "Medium" },
            { name: "Industrial Zone", potential: growthParams.industrialZone > 60 ? "High" : "Low" }
          ]
        };
        break;
        
      case "environmental":
        const pollutionLevel = environmentalParams.pollution;
        const airQualityIndex = weatherData?.current?.humidity || Math.round(100 - pollutionLevel);
        
        results = {
          airQualityIndex: airQualityIndex,
          greenSpaceCoverage: environmentalParams.greenCoverage,
          carbonFootprint: Math.round(pollutionLevel * 0.8),
          waterQuality: Math.round(100 - (pollutionLevel * 0.5)),
          sustainabilityScore: Math.round((environmentalParams.greenCoverage + environmentalParams.wasteManagement + (100 - pollutionLevel)) / 3),
          criticalAreas: [
            { name: "Industrial Park", issue: "Air Pollution" },
            { name: "River Basin", issue: "Water Quality" },
            { name: "Downtown", issue: pollutionLevel > 70 ? "Emissions" : "Moderate Pollution" }
          ]
        };
        break;
        
      case "density":
        results = {
          populationDensity: Math.round(densityParams.centralDensity * 1.5),
          housingAvailability: Math.round(densityParams.residentialDensity),
          trafficImpact: Math.round((densityParams.centralDensity - densityParams.infrastructure) * 0.8),
          publicServiceAccess: Math.round(densityParams.mixedUse * 0.9),
          qualityOfLife: Math.round((densityParams.infrastructure + densityParams.mixedUse + (100 - densityParams.centralDensity)) / 3),
          hotspots: [
            { name: "Downtown", level: densityParams.centralDensity > 70 ? "Very High" : "High" },
            { name: "Suburbs", level: "Medium" },
            { name: "New Developments", level: "Growing" }
          ]
        };
        break;
    }
    
    setSimResults(results);
    
    // Run AI analysis on results
    runAnalysis(results);
  };
  
  // Run AI analysis on simulation results
  const runAnalysis = async (results: SimulationResults) => {
    setIsAnalyzing(true);
    
    try {
      const analysis = await analyzeWithAI(
        { 
          results, 
          parameters: getCurrentParameters(),
          location: location
        }, 
        activeScenario
      ) as AIAnalysisResult;
      
      // Convert API result to our internal format
      const formattedAnalysis: AnalysisResult = {
        summary: analysis.insights,
        recommendations: analysis.recommendations || [],
        impact: {
          positive: analysis.forecast ? [analysis.forecast] : [],
          negative: []
        }
      };
      
      setAnalysisResults(formattedAnalysis);
    } catch (error) {
      console.error("Error analyzing results:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Get current scenario parameters
  const getCurrentParameters = () => {
    switch (activeScenario) {
      case "traffic": return trafficParams;
      case "growth": return growthParams;
      case "environmental": return environmentalParams;
      case "density": return densityParams;
      default: return trafficParams;
    }
  };

  // Handle parameter changes
  const handleParamChange = (scenario: SimulationScenario, param: string, value: number) => {
    switch (scenario) {
      case "traffic":
        setTrafficParams(prev => ({ ...prev, [param]: value }));
        break;
      case "growth":
        setGrowthParams(prev => ({ ...prev, [param]: value }));
        break;
      case "environmental":
        setEnvironmentalParams(prev => ({ ...prev, [param]: value }));
        break;
      case "density":
        setDensityParams(prev => ({ ...prev, [param]: value }));
        break;
    }
  };

  // Render parameter controls for current scenario
  const renderParameterControls = () => {
    const getParams = () => {
      switch (activeScenario) {
        case "traffic":
          return [
            { name: "Traffic Density", key: "density", value: trafficParams.density },
            { name: "Signal Timing Efficiency", key: "signalTiming", value: trafficParams.signalTiming },
            { name: "Public Transport Coverage", key: "publicTransport", value: trafficParams.publicTransport },
            { name: "Road Condition", key: "roadCondition", value: trafficParams.roadCondition }
          ];
        case "growth":
          return [
            { name: "Population Growth Rate", key: "population", value: growthParams.population },
            { name: "Commercial Zone Development", key: "commercialZone", value: growthParams.commercialZone },
            { name: "Residential Zone Expansion", key: "residentialZone", value: growthParams.residentialZone },
            { name: "Industrial Zone Allocation", key: "industrialZone", value: growthParams.industrialZone }
          ];
        case "environmental":
          return [
            { name: "Green Coverage", key: "greenCoverage", value: environmentalParams.greenCoverage },
            { name: "Pollution Control", key: "pollution", value: environmentalParams.pollution },
            { name: "Waste Management Efficiency", key: "wasteManagement", value: environmentalParams.wasteManagement },
            { name: "Water Usage Optimization", key: "waterUsage", value: environmentalParams.waterUsage }
          ];
        case "density":
          return [
            { name: "Central Area Density", key: "centralDensity", value: densityParams.centralDensity },
            { name: "Suburban Density", key: "suburbanDensity", value: densityParams.suburbanDensity },
            { name: "Mixed-Use Development", key: "mixedUse", value: densityParams.mixedUse },
            { name: "Infrastructure Capacity", key: "infrastructure", value: densityParams.infrastructure }
          ];
      }
    };
    
    const params = getParams();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {params.map((param) => (
          <div key={param.key} className="mb-4">
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium">{param.name}</label>
              <span className="text-sm font-bold">{param.value}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={param.value}
              onChange={(e) => handleParamChange(activeScenario, param.key, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}
      </div>
    );
  };

  // Render scenario icon
  const getScenarioIcon = (scenario: SimulationScenario) => {
    switch (scenario) {
      case "traffic": return <Car className="w-5 h-5 mr-2" />;
      case "growth": return <Building className="w-5 h-5 mr-2" />;
      case "environmental": return <TreePine className="w-5 h-5 mr-2" />;
      case "density": return <Users className="w-5 h-5 mr-2" />;
    }
  };
  
  // Render simulation results
  const renderResults = () => {
    if (!simResults) return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(simResults).map(([key, value]) => {
          // Skip arrays like hotspots, developmentAreas, etc.
          if (Array.isArray(value)) return null;
          
          return (
            <div 
              key={key} 
              className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-2xl font-bold">
                {typeof value === 'number' ? 
                  (key.includes('Percent') || key.includes('Coverage') ? `${value}%` : value) : 
                  value.toString()}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  // Render specific area info (hotspots, development areas, critical areas)
  const renderAreaInfo = () => {
    if (!simResults) return null;
    
    let areas = null;
    
    if (simResults.hotspots && activeScenario === "traffic") {
      areas = simResults.hotspots.map((spot, index) => (
        <div key={index} className="flex justify-between items-center p-3 border-b last:border-0">
          <span>{spot.name}</span>
          <span className={
            spot.level === "High" ? "text-red-500" :
            spot.level === "Medium" ? "text-amber-500" : "text-green-500"
          }>{spot.level}</span>
        </div>
      ));
    } else if (simResults.developmentAreas && activeScenario === "growth") {
      areas = simResults.developmentAreas.map((area, index) => (
        <div key={index} className="flex justify-between items-center p-3 border-b last:border-0">
          <span>{area.name}</span>
          <span className={
            area.potential === "High" ? "text-green-500" :
            area.potential === "Medium" ? "text-amber-500" : "text-red-500"
          }>{area.potential}</span>
        </div>
      ));
    } else if (simResults.criticalAreas && activeScenario === "environmental") {
      areas = simResults.criticalAreas.map((area, index) => (
        <div key={index} className="flex justify-between items-center p-3 border-b last:border-0">
          <span>{area.name}</span>
          <span className="text-red-500">{area.issue}</span>
        </div>
      ));
    }
    
    if (!areas) return null;
    
    return (
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm mt-6`}>
        <h3 className="font-bold mb-3">
          {activeScenario === "traffic" ? "Traffic Hotspots" :
           activeScenario === "growth" ? "Development Areas" :
           activeScenario === "environmental" ? "Critical Environmental Areas" :
           "Urban Density Hotspots"}
        </h3>
        <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
          {areas}
        </div>
      </div>
    );
  };
  
  // Render AI analysis results
  const renderAnalysisResults = () => {
    if (!analysisResults) return null;
    
    return (
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm mt-6`}>
        <h3 className="text-xl font-bold mb-4">AI Analysis</h3>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} mb-4`}>
          <div className="font-medium text-blue-700 dark:text-blue-300 mb-2">Insights</div>
          <p className="text-sm">{analysisResults.summary}</p>
        </div>
        
        <div className="mb-4">
          <div className="font-medium mb-2">Recommendations</div>
          <ul className="space-y-1">
            {analysisResults.recommendations.map((rec, index) => (
              <li key={index} className="text-sm flex">
                <span className="mr-2">•</span> {rec}
              </li>
            ))}
          </ul>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
          <div className="font-medium text-amber-700 dark:text-amber-300 mb-2">Impact Forecast</div>
          <p className="text-sm">{analysisResults.impact.positive.join(' ')}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm py-4 px-6`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className={`flex items-center ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Dashboard</span>
            </Link>
          </div>
          <h1 className="text-xl font-bold">Urban Simulation</h1>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className={`h-12 w-12 rounded-full border-4 border-t-transparent ${darkMode ? 'border-white' : 'border-gray-800'} animate-spin`}></div>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Scenario Selection */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {["traffic", "growth", "environmental", "density"].map((scenario) => (
                <motion.button
                  key={scenario}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setActiveScenario(scenario as SimulationScenario);
                    resetSimulation();
                  }}
                  className={`p-4 rounded-xl ${
                    activeScenario === scenario 
                      ? darkMode 
                        ? 'bg-blue-900 text-white' 
                        : 'bg-blue-100 text-blue-900'
                      : darkMode 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-white hover:bg-gray-50'
                  } transition-colors flex items-center justify-center font-medium`}
                >
                  {getScenarioIcon(scenario as SimulationScenario)}
                  <span className="capitalize">{scenario.replace('_', ' ')} Simulation</span>
                </motion.button>
              ))}
            </div>

            {/* Parameter Settings Panel */}
            <motion.div 
              className={`mb-6 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Simulation Parameters</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={resetSimulation} 
                    className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                    title="Reset Simulation"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {}} 
                    className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                    title="Save Configuration"
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Parameter Controls */}
              {renderParameterControls()}
              
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium">Simulation Speed:</div>
                  <select 
                    value={simSpeed} 
                    onChange={(e) => setSimSpeed(Number(e.target.value))}
                    className={`rounded-md p-1 text-sm ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-white border-gray-300'
                    } border`}
                  >
                    <option value={0.5}>0.5x (Slow)</option>
                    <option value={1}>1x (Normal)</option>
                    <option value={2}>2x (Fast)</option>
                    <option value={3}>3x (Very Fast)</option>
                  </select>
                </div>
                
                <button
                  onClick={runSimulation}
                  disabled={isRunning && progress >= 100}
                  className={`px-4 py-2 rounded-md flex items-center ${
                    isRunning 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white font-medium transition-colors`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-5 h-5 mr-2" />
                      <span>Stop Simulation</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      <span>Run Simulation</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Progress bar */}
              {(isRunning || progress > 0) && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Simulation Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {/* Analyzing indicator */}
              {isAnalyzing && (
                <div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400">
                  <div className="mr-2 w-4 h-4 rounded-full border-2 border-t-transparent border-blue-600 dark:border-blue-400 animate-spin"></div>
                  Analyzing simulation results with AI...
                </div>
              )}
            </motion.div>

            {/* Simulation Results */}
            {renderResults()}
            {renderAreaInfo()}
            {renderAnalysisResults()}
          </>
        )}
      </main>
    </div>
  );
} 