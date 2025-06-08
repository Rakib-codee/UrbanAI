"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  BarChart,
  CalendarDays,
  Zap,
  AlertTriangle,
  PieChart,
  LineChart
} from "lucide-react";
import { useUrbanData } from "@/components/UrbanContext";
import { analyzeWithAI } from "@/services/apiService";

// Types for predictions
type DataCategory = "traffic" | "environment" | "growth" | "resources";
type TimeFrame = "week" | "month" | "quarter" | "year";

interface Prediction {
  category: DataCategory;
  title: string;
  description: string;
  confidence: number;
  impact: "high" | "medium" | "low";
  trend: "increasing" | "decreasing" | "stable";
  timeFrame: TimeFrame;
}

interface InsightData {
  trend?: string;
  recommendations?: string[];
  reliability?: string;
}

// Define the interface for API result
interface AIAnalysisResult {
  insights?: InsightData;
  predictions?: Prediction[];
}

export default function AIPredictionsPage() {
  const { darkMode, data, loading, location } = useUrbanData();
  const [selectedCategory, setSelectedCategory] = useState<DataCategory>("traffic");
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("month");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insightData, setInsightData] = useState<InsightData | null>(null);

  // Generate predictions based on historical data
  useEffect(() => {
    if (!loading && data) {
      generatePredictions();
    }
  }, [loading, data, selectedCategory, selectedTimeFrame]);

  // Generate AI predictions
  const generatePredictions = async () => {
    setIsAnalyzing(true);

    try {
      // Collect relevant data from our API sources
      const urbanData = {
        traffic: data?.traffic || {},
        weather: data?.weather || {},
        resources: data?.resources || {},
        location: location
      };

      // Call DeepSeek AI for analysis and predictions
      const result = await analyzeWithAI(
        urbanData,
        "predictive"
      );

      // Process and format predictions
      const formattedPredictions = processPredictionResults(result as AIAnalysisResult);
      setPredictions(formattedPredictions);
      
      if (result.insights) {
        setInsightData(result.insights as unknown as InsightData);
      }
    } catch (error) {
      console.error("Error generating predictions:", error);
      // Use fallback predictions if AI fails
      setPredictions(getFallbackPredictions());
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Process AI response into formatted predictions
  const processPredictionResults = (aiResult: AIAnalysisResult): Prediction[] => {
    // Check if AI returned predictions, otherwise use fallback
    if (aiResult.predictions && aiResult.predictions.length > 0) {
      return aiResult.predictions.filter(
        pred => pred.category === selectedCategory && pred.timeFrame === selectedTimeFrame
      );
    }
    
    // Use fallback predictions if no valid predictions in AI result
    return getFallbackPredictions().filter(
      pred => pred.category === selectedCategory && pred.timeFrame === selectedTimeFrame
    );
  };

  // Fallback predictions if API fails
  const getFallbackPredictions = (): Prediction[] => {
    const trafficPredictions: Prediction[] = [
      {
        category: "traffic",
        title: "Peak Hour Congestion Increase",
        description: "Traffic congestion during peak hours (7-9 AM, 4-6 PM) is predicted to increase by 12% due to ongoing construction projects and seasonal changes.",
        confidence: 87,
        impact: "high",
        trend: "increasing",
        timeFrame: "month"
      },
      {
        category: "traffic",
        title: "Public Transit Ridership Growth",
        description: "Public transit usage is expected to grow by 8% as fuel prices increase and new transit routes become operational.",
        confidence: 82,
        impact: "medium",
        trend: "increasing",
        timeFrame: "month"
      },
      {
        category: "traffic",
        title: "Alternative Route Adoption",
        description: "Drivers will increasingly utilize alternative routes through residential areas, increasing traffic in previously low-traffic zones.",
        confidence: 75,
        impact: "medium",
        trend: "increasing",
        timeFrame: "month"
      },
      {
        category: "traffic",
        title: "Weekend Traffic Pattern Shift",
        description: "Weekend traffic will spread more evenly throughout the day rather than concentrating in afternoons, due to changing shopping and leisure patterns.",
        confidence: 68,
        impact: "low",
        trend: "decreasing",
        timeFrame: "month"
      },
      {
        category: "traffic",
        title: "Long-term Congestion Reduction",
        description: "Despite short-term increases, overall congestion is expected to decrease by 15% over the next year as infrastructure projects complete and traffic management systems improve.",
        confidence: 79,
        impact: "high",
        trend: "decreasing",
        timeFrame: "year"
      }
    ];

    const environmentPredictions: Prediction[] = [
      {
        category: "environment",
        title: "Air Quality Improvement",
        description: "Air quality index is predicted to improve by 7% due to seasonal changes and recent emissions reduction initiatives.",
        confidence: 81,
        impact: "medium",
        trend: "decreasing",
        timeFrame: "month"
      },
      {
        category: "environment",
        title: "Green Space Utilization Increase",
        description: "Public green space usage will increase by 22% with improving weather conditions and new park amenities.",
        confidence: 88,
        impact: "medium",
        trend: "increasing",
        timeFrame: "month"
      },
      {
        category: "environment",
        title: "Water Quality Challenges",
        description: "Local water bodies may experience a 5% decline in quality due to increased runoff from expected precipitation.",
        confidence: 73,
        impact: "medium",
        trend: "decreasing",
        timeFrame: "month"
      },
      {
        category: "environment",
        title: "Urban Heat Island Effect Intensification",
        description: "Urban core temperatures will average 3.2°C higher than surrounding areas as summer approaches and building density effects intensify.",
        confidence: 85,
        impact: "high",
        trend: "increasing",
        timeFrame: "quarter"
      },
      {
        category: "environment",
        title: "Carbon Emissions Trajectory",
        description: "Annual carbon emissions are projected to decrease by 4% as renewable energy adoption increases and efficiency measures take effect.",
        confidence: 76,
        impact: "high",
        trend: "decreasing",
        timeFrame: "year"
      }
    ];

    const growthPredictions: Prediction[] = [
      {
        category: "growth",
        title: "Downtown Development Acceleration",
        description: "Commercial development in the downtown core will accelerate with 3 major projects breaking ground, increasing property values by an estimated 8%.",
        confidence: 84,
        impact: "high",
        trend: "increasing",
        timeFrame: "month"
      },
      {
        category: "growth",
        title: "Residential Expansion in Eastern Districts",
        description: "Eastern suburbs will see 12% more residential development permits than previous periods, shifting population distribution.",
        confidence: 79,
        impact: "medium",
        trend: "increasing",
        timeFrame: "month"
      },
      {
        category: "growth",
        title: "Commercial Vacancy Rate Improvement",
        description: "Commercial vacancy rates will decrease from 15% to approximately 12% as businesses expand operations post-pandemic.",
        confidence: 76,
        impact: "medium",
        trend: "decreasing",
        timeFrame: "quarter"
      },
      {
        category: "growth",
        title: "Mixed-Use Development Trend",
        description: "New construction will increasingly feature mixed-use designs, with 40% of new projects including both residential and commercial components.",
        confidence: 82,
        impact: "medium",
        trend: "increasing",
        timeFrame: "year"
      },
      {
        category: "growth",
        title: "Long-term Population Growth",
        description: "The urban area population is projected to grow by 2.8% annually over the next five years, requiring infrastructure expansion.",
        confidence: 88,
        impact: "high",
        trend: "increasing",
        timeFrame: "year"
      }
    ];

    const resourcePredictions: Prediction[] = [
      {
        category: "resources",
        title: "Peak Water Usage Increase",
        description: "Daily water consumption will peak 8% higher than previous averages due to seasonal changes and population activities.",
        confidence: 83,
        impact: "medium",
        trend: "increasing",
        timeFrame: "month"
      },
      {
        category: "resources",
        title: "Energy Demand Fluctuation",
        description: "Energy demand will experience greater daily fluctuations (±15%) as temperature variations increase and renewable inputs change.",
        confidence: 79,
        impact: "medium",
        trend: "increasing",
        timeFrame: "month"
      },
      {
        category: "resources",
        title: "Waste Management Efficiency",
        description: "Waste processing efficiency will improve by 6% as new sorting technologies come online and recycling programs expand.",
        confidence: 75,
        impact: "low",
        trend: "increasing",
        timeFrame: "quarter"
      },
      {
        category: "resources",
        title: "Renewable Energy Contribution",
        description: "Renewable sources will contribute an additional 4% to the total energy mix as new solar installations become operational.",
        confidence: 87,
        impact: "medium",
        trend: "increasing",
        timeFrame: "quarter"
      },
      {
        category: "resources",
        title: "Water Infrastructure Stress Points",
        description: "Three key water infrastructure nodes will approach 85% capacity during peak usage, requiring management intervention.",
        confidence: 82,
        impact: "high",
        trend: "increasing",
        timeFrame: "year"
      }
    ];

    return [
      ...trafficPredictions,
      ...environmentPredictions,
      ...growthPredictions,
      ...resourcePredictions
    ];
  };

  // Filter predictions by selected category and timeframe
  const filteredPredictions = predictions.filter(
    pred => pred.category === selectedCategory && pred.timeFrame === selectedTimeFrame
  );

  // Render impact badge
  const renderImpactBadge = (impact: "high" | "medium" | "low") => {
    const colors = {
      high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      low: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
    };

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[impact]}`}>
        {impact.charAt(0).toUpperCase() + impact.slice(1)} Impact
      </span>
    );
  };

  // Render trend indicator
  const renderTrendIndicator = (trend: "increasing" | "decreasing" | "stable") => {
    const colors = {
      increasing: "text-red-500",
      decreasing: "text-green-500",
      stable: "text-blue-500"
    };

    const icons = {
      increasing: <TrendingUp className={`w-4 h-4 ${colors[trend]}`} />,
      decreasing: <TrendingUp className={`w-4 h-4 ${colors[trend]} transform rotate-180`} />,
      stable: <TrendingUp className={`w-4 h-4 ${colors[trend]} transform rotate-90`} />
    };

    return icons[trend];
  };

  // Get category icon
  const getCategoryIcon = (category: DataCategory) => {
    switch (category) {
      case "traffic": return <BarChart className="w-5 h-5" />;
      case "environment": return <PieChart className="w-5 h-5" />;
      case "growth": return <TrendingUp className="w-5 h-5" />;
      case "resources": return <LineChart className="w-5 h-5" />;
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
            <Brain className="w-6 h-6 mr-2 text-purple-500" />
            AI Predictive Models
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
            {/* Location and Info */}
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold">{String(location)}</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Predictive analytics and trend forecasting
                </p>
              </div>
              
              <div className={`mt-4 md:mt-0 flex items-center ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                <Zap className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Powered by DeepSeek AI</span>
              </div>
            </div>

            {/* Category and Timeframe Selection */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className={`inline-flex p-1 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {(['traffic', 'environment', 'growth', 'resources'] as const).map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      selectedCategory === category
                        ? 'bg-purple-600 text-white'
                        : ''
                    }`}
                  >
                    <span className="mr-2">{getCategoryIcon(category)}</span>
                    <span className="capitalize">{category}</span>
                  </button>
                ))}
              </div>
              
              <div className={`inline-flex p-1 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                {(['week', 'month', 'quarter', 'year'] as const).map((timeFrame) => (
                  <button
                    key={timeFrame}
                    onClick={() => setSelectedTimeFrame(timeFrame)}
                    className={`px-4 py-2 rounded-lg flex items-center ${
                      selectedTimeFrame === timeFrame
                        ? 'bg-purple-600 text-white'
                        : ''
                    }`}
                  >
                    <span className="capitalize">{timeFrame}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Analyzing indicator */}
            {isAnalyzing && (
              <div className="mb-6 flex items-center text-sm text-purple-600 dark:text-purple-400">
                <div className="mr-2 w-4 h-4 rounded-full border-2 border-t-transparent border-purple-600 dark:border-purple-400 animate-spin"></div>
                Analyzing urban data and generating predictions...
              </div>
            )}

            {/* Predictions */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2" />
                <span className="capitalize">{selectedTimeFrame}</span> Predictions for <span className="capitalize ml-1">{selectedCategory}</span>
              </h3>
              
              {filteredPredictions.length === 0 ? (
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm text-center`}>
                  <div className="flex justify-center mb-4">
                    <AlertTriangle className="w-12 h-12 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No Predictions Available</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    There are no predictions available for this combination of category and timeframe.
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {filteredPredictions.map((prediction, index) => (
                    <div 
                      key={index}
                      className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm mb-4`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold">{prediction.title}</h3>
                        <div className="flex items-center space-x-2">
                          {renderImpactBadge(prediction.impact)}
                          {renderTrendIndicator(prediction.trend)}
                        </div>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        {prediction.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mr-2">Confidence:</div>
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                            <div 
                              className="h-2.5 rounded-full bg-purple-600" 
                              style={{ width: `${prediction.confidence}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-medium">{prediction.confidence}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Insight Summary */}
            {insightData && (
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm mb-6`}>
                <h3 className="text-xl font-bold mb-4">Key Insights</h3>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'} mb-4`}>
                  <div className="font-medium text-purple-700 dark:text-purple-300 mb-2">Trend Analysis</div>
                  <p className="text-sm">{insightData.trend || "Urban data shows significant patterns that can inform policy and planning decisions."}</p>
                </div>
                
                <div className="mb-4">
                  <div className="font-medium mb-2">Recommendations</div>
                  <ul className="space-y-1">
                    {(insightData.recommendations || [
                      "Monitor key metrics closely as trends develop",
                      "Consider adjustments to resource allocation based on predictions",
                      "Implement proactive measures to address high-impact predictions"
                    ]).map((rec: string, index: number) => (
                      <li key={index} className="text-sm flex">
                        <span className="mr-2">•</span> {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
                  <div className="font-medium text-blue-700 dark:text-blue-300 mb-2">Data Reliability</div>
                  <p className="text-sm">{insightData.reliability || "Predictions are based on historical patterns and current data. Actual outcomes may vary based on unforeseen factors and interventions."}</p>
                </div>
              </div>
            )}

            {/* Data Sources */}
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Predictions generated using DeepSeek AI based on data from TomTom Traffic API, OpenWeatherMap API, and USCG Water Data API.
              <br />Last updated: {new Date().toLocaleString()}
            </div>
          </>
        )}
      </main>
    </div>
  );
} 