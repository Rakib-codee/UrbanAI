"use client";

import { useState, useEffect } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ComposedChart,
  Bar,
  Line
} from "recharts";
import { motion } from "framer-motion";
import { 
  Leaf, 
  Droplets, 
  Wind, 
  TreePine, 
  Users, 
  Thermometer, 
  RefreshCw,
  Map,
  ArrowUpRight,
  ArrowDownRight,
  TreeDeciduous,
  ArrowLeft
} from "lucide-react";
import LocationDataService from "@/services/locationDataService";
import Link from "next/link";

export default function GreenSpaceAnalysisPage() {
  const [currentLocation, setCurrentLocation] = useState("Beijing, China");
  const [refreshing, setRefreshing] = useState(false);
  const [greenCoverage, setGreenCoverage] = useState(32);
  const [parkAccessibility, setParkAccessibility] = useState(78);
  const [biodiversityScore, setBiodiversityScore] = useState(65);
  const [airQualityImprovement, setAirQualityImprovement] = useState(42);
  const [greenSpaceData, setGreenSpaceData] = useState<{ name: string; value: number }[]>([]);
  const [seasonalData, setSeasonalData] = useState<{ name: string; visitors: number; temperature: number }[]>([]);
  
  // Colors for charts
  const COLORS = ["#00C49F", "#8884d8", "#FFBB28", "#FF8042"];
  
  useEffect(() => {
    // Load initial data
    fetchGreenSpaceData(currentLocation);
    
    // Check for saved location preference
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      setCurrentLocation(savedLocation);
      fetchGreenSpaceData(savedLocation);
    }
  }, []);
  
  const handleRefresh = () => {
    setRefreshing(true);
    fetchGreenSpaceData(currentLocation);
  };
  
  const fetchGreenSpaceData = async (location: string) => {
    try {
      setRefreshing(true);
      
      // Extract city name from location string
      const city = location.split(',')[0].trim();
      console.log(`🌱 Fetching green space data for: ${city}`);
      
      // Generate city-specific data using a hash
      const cityHash = city.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      console.log(`City hash for ${city}: ${cityHash}`);
      
      // Calculate metrics based on city characteristics
      const baseCoverage = 25 + (cityHash % 20);
      setGreenCoverage(Math.min(55, Math.max(15, baseCoverage)));
      console.log(`Green coverage for ${city}: ${Math.min(55, Math.max(15, baseCoverage))}%`);
      
      const baseAccessibility = 65 + (cityHash % 25);
      setParkAccessibility(Math.min(90, Math.max(50, baseAccessibility)));
      console.log(`Park accessibility for ${city}: ${Math.min(90, Math.max(50, baseAccessibility))}%`);
      
      const baseBiodiversity = 50 + (cityHash % 35);
      setBiodiversityScore(Math.min(85, Math.max(40, baseBiodiversity)));
      console.log(`Biodiversity score for ${city}: ${Math.min(85, Math.max(40, baseBiodiversity))}`);
      
      const baseAirImprovement = 30 + (cityHash % 25);
      setAirQualityImprovement(Math.min(60, Math.max(25, baseAirImprovement)));
      console.log(`Air quality improvement for ${city}: ${Math.min(60, Math.max(25, baseAirImprovement))}%`);
      
      // Get green space data from service
      console.log(`Requesting green space data from LocationDataService for ${city}...`);
      const greenData = LocationDataService.getGreenSpaceData(city);
      setGreenSpaceData(greenData);
      console.log('Green space data received:', greenData);
      
      // Generate seasonal data
      const seasons = ["Winter", "Spring", "Summer", "Fall"];
      const seasonalStats = seasons.map((season, index) => {
        // Different seasonal patterns based on city
        let visitorBase = 50;
        let tempBase = 15;
        
        // Adjust for season
        switch(index) {
          case 0: // Winter
            visitorBase = 30 + (cityHash % 10);
            tempBase = 5 + (cityHash % 10);
            break;
          case 1: // Spring
            visitorBase = 70 + (cityHash % 15);
            tempBase = 20 + (cityHash % 5);
            break;
          case 2: // Summer
            visitorBase = 90 + (cityHash % 20);
            tempBase = 30 + (cityHash % 8);
            break;
          case 3: // Fall
            visitorBase = 60 + (cityHash % 15);
            tempBase = 15 + (cityHash % 5);
            break;
        }
        
        return {
          name: season,
          visitors: visitorBase,
          temperature: tempBase
        };
      });
      
      setSeasonalData(seasonalStats);
      
    } catch (error) {
      console.error("Error fetching green space data:", error);
    } finally {
      setTimeout(() => {
        setRefreshing(false);
      }, 600);
    }
  };
  
  // Calculate green space per capita
  const perCapitaGreenSpace = Math.round(greenCoverage * 0.8);
  
  // Calculate improvement status
  const isImproving = biodiversityScore > 60;
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header - Simplified */}
      <header className="bg-emerald-600 text-white py-3 px-4 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-white hover:text-emerald-100">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span className="text-sm">Dashboard</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1.5 rounded-md bg-emerald-700 flex items-center">
              <span className="text-xs font-medium text-white">{currentLocation}</span>
            </div>
            <button 
              onClick={handleRefresh}
              className="p-1.5 rounded-full hover:bg-emerald-700 transition-colors"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Green Coverage */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-emerald-500 text-white rounded-lg mr-4">
                <TreePine size={20} />
              </div>
              <h3 className="text-lg font-medium text-gray-600">Green Coverage</h3>
            </div>
            <div className="flex items-center">
              <p className="text-3xl font-bold">{greenCoverage}%</p>
              <span className="ml-2 text-sm text-gray-500">of urban area</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div 
                className="bg-emerald-500 h-2.5 rounded-full" 
                style={{ width: `${greenCoverage}%` }}
              ></div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {perCapitaGreenSpace} m² per capita
            </p>
          </motion.div>
          
          {/* Park Accessibility */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-500 text-white rounded-lg mr-4">
                <Users size={20} />
              </div>
              <h3 className="text-lg font-medium text-gray-600">Park Accessibility</h3>
            </div>
            <div className="flex items-center">
              <p className="text-3xl font-bold">{parkAccessibility}%</p>
              <span className="ml-2 text-sm text-gray-500">of residents</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div 
                className="bg-blue-500 h-2.5 rounded-full" 
                style={{ width: `${parkAccessibility}%` }}
              ></div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              within 10-minute walk to a park
            </p>
          </motion.div>
          
          {/* Biodiversity Score */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-amber-500 text-white rounded-lg mr-4">
                <Leaf size={20} />
              </div>
              <h3 className="text-lg font-medium text-gray-600">Biodiversity</h3>
            </div>
            <div className="flex items-center">
              <p className="text-3xl font-bold">{biodiversityScore}</p>
              <div className="ml-3 flex items-center">
                {isImproving ? (
                  <span className="text-green-500 flex items-center">
                    <ArrowUpRight size={16} className="mr-1" /> Improving
                  </span>
                ) : (
                  <span className="text-amber-500 flex items-center">
                    <ArrowDownRight size={16} className="mr-1" /> Declining
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div 
                className={`h-2.5 rounded-full ${
                  biodiversityScore > 70 ? 'bg-green-500' : 
                  biodiversityScore > 50 ? 'bg-amber-500' : 'bg-red-500'
                }`} 
                style={{ width: `${biodiversityScore}%` }}
              ></div>
            </div>
          </motion.div>
          
          {/* Air Quality Improvement */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-500 text-white rounded-lg mr-4">
                <Wind size={20} />
              </div>
              <h3 className="text-lg font-medium text-gray-600">Air Quality Boost</h3>
            </div>
            <div className="flex items-center">
              <p className="text-3xl font-bold">{airQualityImprovement}%</p>
              <span className="ml-2 text-sm text-gray-500">improvement</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div 
                className="bg-purple-500 h-2.5 rounded-full" 
                style={{ width: `${airQualityImprovement}%` }}
              ></div>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              compared to non-green areas
            </p>
          </motion.div>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Green Space Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold mb-6">Green Space Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={greenSpaceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {greenSpaceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          
          {/* Seasonal Trends */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-bold mb-6">Seasonal Usage Patterns</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={seasonalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                  <YAxis yAxisId="left" tick={{ fill: '#6b7280' }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#6b7280' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      borderColor: '#e5e7eb',
                    }} 
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="visitors" name="Visitors (thousands)" fill="#8884d8" />
                  <Line yAxisId="right" type="monotone" dataKey="temperature" name="Avg. Temperature (°C)" stroke="#ff7300" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
        
        {/* Green Space Benefits */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <h2 className="text-xl font-bold mb-6">Environmental Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-emerald-100 rounded-lg bg-emerald-50">
              <h3 className="font-medium text-emerald-800 mb-2 flex items-center">
                <Thermometer className="mr-2 h-5 w-5" /> Temperature Reduction
              </h3>
              <p className="text-emerald-700 text-sm">
                Green spaces in {currentLocation.split(',')[0]} reduce urban heat island effect by <span className="font-bold">3.2°C</span> on average during summer months.
              </p>
            </div>
            
            <div className="p-4 border border-blue-100 rounded-lg bg-blue-50">
              <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                <Droplets className="mr-2 h-5 w-5" /> Water Management
              </h3>
              <p className="text-blue-700 text-sm">
                Urban parks absorb <span className="font-bold">{15 + (greenCoverage % 10)}%</span> of rainfall, reducing stormwater runoff and flood risks in the city.
              </p>
            </div>
            
            <div className="p-4 border border-purple-100 rounded-lg bg-purple-50">
              <h3 className="font-medium text-purple-800 mb-2 flex items-center">
                <Wind className="mr-2 h-5 w-5" /> Carbon Sequestration
              </h3>
              <p className="text-purple-700 text-sm">
                Urban forests in the area capture approximately <span className="font-bold">{Math.round(greenCoverage * 1.5)}</span> tons of CO₂ annually per hectare.
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Green Space Development Plans */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Map className="mr-2 h-5 w-5 text-emerald-600" /> 
            Future Development Plans
          </h2>
          
          <div className="space-y-4 mt-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <TreeDeciduous className="h-5 w-5 text-emerald-500" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">Urban Forest Expansion</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Planning to increase tree canopy coverage by {Math.round(greenCoverage * 0.3)}% over the next 5 years, focusing on high-density residential areas.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">Community Gardens Initiative</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Developing {3 + (greenCoverage % 5)} new community garden locations in underserved neighborhoods to improve food security and community engagement.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Droplets className="h-5 w-5 text-teal-500" />
              </div>
              <div className="ml-4">
                <h3 className="font-medium">Green Infrastructure</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Implementing bioswales and rain gardens in {Math.round(parkAccessibility * 0.1)} locations to manage stormwater runoff while creating additional green spaces.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 