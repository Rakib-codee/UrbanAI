"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, TreePine, Ruler, Cloud, Thermometer, Droplets, Leaf } from "lucide-react";
import { useUrbanData } from "@/components/UrbanContext";
import { analyzeWithAI } from "@/services/apiService";
import { motion } from "framer-motion";

// Define types for analysis results
interface AnalysisResult {
  insights: string;
  recommendations: string[];
  forecast: string;
}

// Define the type for environmental data
interface GreenspaceData {
  coverage?: string;
  biodiversity?: string;
  waterQuality?: string;
  [key: string]: string | GreenspaceData | undefined;
}

// Add these types to enhance type safety
interface WeatherData {
  current?: {
    airQuality?: number;
    pollutants?: {
      pm2_5: number;
      pm10: number;
      no2: number;
      o3: number;
      co: number;
    };
  };
}

export default function GreenSpacesPage() {
  const { darkMode, data, loading, location } = useUrbanData();
  const [selectedArea, setSelectedArea] = useState("all");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [viewMode, setViewMode] = useState<"overview" | "details" | "impact">("overview");

  // Fetch analysis when area changes
  useEffect(() => {
    if (selectedArea && data && 'greenspaces' in data) {
      performAnalysis();
    }
  }, [selectedArea, data]);

  // Perform AI analysis of environmental data
  const performAnalysis = async () => {
    setIsAnalyzing(true);

    try {
      // Get relevant data for analysis
      const greenspaceData = data && 'greenspaces' in data ? data.greenspaces as GreenspaceData : {};
      const weatherData = data && 'weather' in data ? data.weather as WeatherData : {};
      const pollutionData = {
        airQuality: weatherData.current?.airQuality || 75,
        pollutants: weatherData.current?.pollutants || {
          pm2_5: 12.5,
          pm10: 25.8,
          no2: 18.6,
          o3: 42.3,
          co: 0.8
        }
      };

      // Select area-specific data or full data
      const areaData = selectedArea === "all" 
        ? greenspaceData 
        : { [selectedArea]: greenspaceData[selectedArea] };

      // Call the API for analysis
      const result = await analyzeWithAI(
        {
          greenspaces: areaData,
          weather: weatherData,
          pollution: pollutionData,
          location: location
        },
        "environmental"
      );

      setAnalysisResult(result as AnalysisResult);
    } catch (error) {
      console.error("Error analyzing environmental data:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Green space areas (would come from API in real implementation)
  const greenSpaceAreas = [
    { id: "all", name: "All Areas" },
    { id: "central_park", name: "Central Park" },
    { id: "riverside", name: "Riverside Gardens" },
    { id: "botanical", name: "Botanical Gardens" },
    { id: "northern_reserve", name: "Northern Nature Reserve" }
  ];

  // Environmental metrics
  const environmentalMetrics = [
    {
      title: "Green Coverage",
      value: data && 'greenspaces' in data ? (data.greenspaces as GreenspaceData)?.coverage || "32%" : "32%",
      icon: TreePine,
      color: "bg-emerald-500",
      trend: "+2.3% from last year",
      positive: true
    },
    {
      title: "Air Quality Index",
      value: data && 'weather' in data ? (data.weather as WeatherData)?.current?.airQuality || "75" : "75",
      icon: Cloud,
      color: "bg-blue-500",
      trend: "-3.5 points from last month",
      positive: false
    },
    {
      title: "Biodiversity Score",
      value: data && 'greenspaces' in data ? (data.greenspaces as GreenspaceData)?.biodiversity || "68/100" : "68/100",
      icon: Leaf,
      color: "bg-lime-500",
      trend: "+5.8 points from last year",
      positive: true
    },
    {
      title: "Water Quality",
      value: data && 'greenspaces' in data ? (data.greenspaces as GreenspaceData)?.waterQuality || "82/100" : "82/100",
      icon: Droplets,
      color: "bg-cyan-500",
      trend: "Stable for 3 months",
      positive: true
    }
  ];

  // Detailed stats for selected area
  const getDetailedStats = () => {
    // In a real implementation, this would fetch detailed data for the selected area
    return [
      { name: "Total Area", value: "125 hectares", icon: Ruler },
      { name: "Tree Count", value: "15,240", icon: TreePine },
      { name: "Native Species", value: "68%", icon: Leaf },
      { name: "Carbon Sequestration", value: "2,850 tons/year", icon: Cloud },
      { name: "Temperature Reduction", value: "-2.4°C", icon: Thermometer },
      { name: "Rainwater Capture", value: "12.5 million liters/year", icon: Droplets }
    ];
  };

  // Environmental impact data
  const impactData = {
    carbon: { value: 2850, unit: "tons CO₂ sequestered annually" },
    temperature: { value: 2.4, unit: "°C cooler than urban center" },
    air: { value: 15.2, unit: "% improvement in air quality" },
    water: { value: 12.5, unit: "million liters of rainwater captured annually" },
    noise: { value: 7.8, unit: "dB reduction in noise pollution" },
    energy: { value: 345000, unit: "kWh saved through cooling effect" }
  };

  // Render the content based on the view mode
  const renderContent = () => {
    switch (viewMode) {
      case "overview":
        return (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {environmentalMetrics.map((metric, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${metric.color} text-white mr-3`}>
                      <metric.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium">{metric.title}</h3>
                  </div>
                  <div className="text-3xl font-bold mb-2">{metric.value}</div>
                  <div className={`text-sm ${metric.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {metric.trend}
                  </div>
                </div>
              ))}
            </div>

            {analysisResult && (
              <div className={`mt-6 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className="text-xl font-bold mb-4">Environmental Analysis</h3>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-50'} mb-4`}>
                  <div className="font-medium text-green-700 dark:text-green-300 mb-2">Current Status</div>
                  <p className="text-sm">{analysisResult.insights}</p>
                </div>
                
                <div className="mb-4">
                  <div className="font-medium mb-2">Key Findings</div>
                  <ul className="space-y-1">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm flex">
                        <span className="mr-2">•</span> {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-amber-900/20' : 'bg-amber-50'}`}>
                  <div className="font-medium text-amber-700 dark:text-amber-300 mb-2">Future Projections</div>
                  <p className="text-sm">{analysisResult.forecast}</p>
                </div>
              </div>
            )}
          </div>
        );
        
      case "details":
        const detailedStats = getDetailedStats();
        return (
          <div>
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className="text-xl font-bold mb-4">Detailed Analysis: {greenSpaceAreas.find(a => a.id === selectedArea)?.name}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {detailedStats.map((stat, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                  >
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} mr-3`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{stat.name}</div>
                      <div className="font-bold">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Seasonal Variation</h4>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="grid grid-cols-4 gap-2">
                    {["Spring", "Summer", "Fall", "Winter"].map((season, index) => (
                      <div key={season} className="text-center">
                        <div className="font-medium text-sm">{season}</div>
                        <div className="mt-2 mb-1 text-xs text-gray-500">Biodiversity</div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 h-3 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500" 
                            style={{ width: `${[85, 95, 75, 45][index]}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 mb-1 text-xs text-gray-500">Visitor Count</div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 h-3 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500" 
                            style={{ width: `${[65, 90, 70, 30][index]}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case "impact":
        return (
          <div>
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className="text-xl font-bold mb-4">Environmental Impact</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className="font-medium mb-3">Carbon Impact</h4>
                  <div className="text-3xl font-bold text-green-500 mb-1">{impactData.carbon.value.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{impactData.carbon.unit}</div>
                  <div className="mt-3 text-sm">
                    Equivalent to taking approximately 620 cars off the road for one year
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className="font-medium mb-3">Temperature Regulation</h4>
                  <div className="text-3xl font-bold text-blue-500 mb-1">{impactData.temperature.value}°C</div>
                  <div className="text-sm text-gray-500">{impactData.temperature.unit}</div>
                  <div className="mt-3 text-sm">
                    Reduces cooling energy requirements by approximately 20-30% for nearby buildings
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className="font-medium mb-3">Air Quality Improvement</h4>
                  <div className="text-3xl font-bold text-purple-500 mb-1">{impactData.air.value}%</div>
                  <div className="text-sm text-gray-500">{impactData.air.unit}</div>
                  <div className="mt-3 text-sm">
                    Trees and plants filter harmful pollutants, improving respiratory health
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className="font-medium mb-3">Water Management</h4>
                  <div className="text-3xl font-bold text-cyan-500 mb-1">{impactData.water.value}</div>
                  <div className="text-sm text-gray-500">{impactData.water.unit}</div>
                  <div className="mt-3 text-sm">
                    Reduces stormwater runoff and improves groundwater quality
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-3">Ecosystem Services Value</h4>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="text-sm">
                    The estimated annual economic value of ecosystem services provided by this green space:
                  </div>
                  <div className="text-3xl font-bold mt-2 mb-4">$3.2 million</div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Air Purification</div>
                      <div className="font-bold">$850,000</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Water Management</div>
                      <div className="font-bold">$1,200,000</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Health Benefits</div>
                      <div className="font-bold">$1,150,000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
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
          <h1 className="text-xl font-bold flex items-center">
            <TreePine className="w-6 h-6 mr-2 text-green-500" />
            Green Spaces Analysis
          </h1>
          <div className="w-[100px]">
            {/* Empty div for layout balance */}
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
            {/* Area Selection and View Controls */}
            <div className="flex flex-col md:flex-row justify-between mb-6">
              <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                {greenSpaceAreas.map((area) => (
                  <button
                    key={area.id}
                    onClick={() => setSelectedArea(area.id)}
                    className={`px-4 py-2 rounded-lg ${
                      selectedArea === area.id
                        ? 'bg-green-600 text-white'
                        : darkMode
                          ? 'bg-gray-800 hover:bg-gray-700'
                          : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {area.name}
                  </button>
                ))}
              </div>
              
              <div className={`inline-flex rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-1`}>
                {(['overview', 'details', 'impact'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-lg ${
                      viewMode === mode
                        ? 'bg-green-600 text-white'
                        : ''
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Analyzing indicator */}
            {isAnalyzing && (
              <div className="mb-6 flex items-center text-sm text-green-600 dark:text-green-400">
                <div className="mr-2 w-4 h-4 rounded-full border-2 border-t-transparent border-green-600 dark:border-green-400 animate-spin"></div>
                Analyzing environmental data...
              </div>
            )}
            
            {/* Content based on selected view */}
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
} 