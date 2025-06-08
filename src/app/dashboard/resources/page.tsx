"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Clock, 
  Filter, 
  Download, 
  CheckCircle2,
  Sparkles,
  Battery,
  Droplets,
  Trash2,
  Wind,
  AlertCircle,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Leaf,
  Activity
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useUrbanData } from "@/components/UrbanContext";
import LocationDataService from "@/services/locationDataService";
import WorldWeatherService from "@/services/worldWeatherService";
import UscgWaterService from "@/services/uscgWaterService";

// Colors for pie chart
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

// Resource Data types
interface ResourceItem {
  name: string;
  value: number;
}

interface Alert {
  id: number;
  resource: string;
  location: string;
  alert: string;
  status: string;
  time: string;
}

interface ResourceDataType {
  electricity: {
    consumption: number;
    savings: number;
    renewable: number;
  };
  water: {
    usage: {
      residential: number;
    };
  };
  waste: {
    recycling: number;
    collection: number;
  };
  alerts: Alert[];
}

export default function ResourceManagementPage() {
  const { darkMode, data, loading, location } = useUrbanData();
  const [selectedResource, setSelectedResource] = useState("all");
  const resourceData = Array.isArray(data.resources) ? data.resources as unknown as ResourceItem[] : [];
  const resourceDataDetails = data.resources as unknown as ResourceDataType;
  const [currentLocation, setCurrentLocation] = useState(location);
  const [sustainabilityScore, setSustainabilityScore] = useState(75);
  const [energyData, setEnergyData] = useState<{ name: string; energy: number }[]>([
    { name: "Jan", energy: 420 },
    { name: "Feb", energy: 380 },
    { name: "Mar", energy: 340 },
    { name: "Apr", energy: 380 },
    { name: "May", energy: 440 },
    { name: "Jun", energy: 460 },
  ]);
  
  // Convert resourceStats to a state variable so it can be updated
  const [resourceStats, setResourceStats] = useState([
    {
      title: "Energy Savings",
      value: `${resourceDataDetails?.electricity?.savings || 12}%`,
      trend: (resourceDataDetails?.electricity?.savings || 0) > 10 ? "up" : "down",
      icon: Battery,
      color: "blue"
    },
    {
      title: "Water Usage",
      value: `${Math.round((resourceDataDetails?.water?.usage?.residential || 45) / 50 * 100)}%`,
      trend: (resourceDataDetails?.water?.usage?.residential || 45) < 50 ? "down" : "up",
      icon: Droplets,
      color: "cyan"
    },
    {
      title: "Waste Recycling",
      value: `${Math.round(((resourceDataDetails?.waste?.recycling || 35) / (resourceDataDetails?.waste?.collection || 85)) * 100)}%`,
      trend: "up",
      icon: Trash2,
      color: "amber"
    },
    {
      title: "Renewable Energy",
      value: `${resourceDataDetails?.electricity?.renewable || 22}%`,
      trend: "up",
      icon: Wind,
      color: "green"
    }
  ]);

  // Filtered alerts based on selected resource
  const filteredAlerts = selectedResource === "all" 
    ? (resourceDataDetails?.alerts || [])
    : (resourceDataDetails?.alerts || []).filter((alert: Alert) => alert.resource === selectedResource);

  // Map resource names to icons
  const resourceIcons: Record<string, React.ComponentType<{ size: number; className?: string }>> = {
    "Energy": Zap,
    "Water": Droplets,
    "Waste": Trash2,
    "Transport": Wind
  };

  // Define fetchResourceData with useCallback to prevent recreation on each render
  const fetchResourceData = useCallback(async (locationStr: string) => {
    try {
      // Extract city name from location string
      const city = locationStr.split(',')[0].trim();
      
      // Get coordinates for the location
      const coordinates = await LocationDataService.getCoordinates(city);
      
      // Variables for water quality and safety data
      let waterQualityData = null;
      let waterSafetyData = null;
      let waterUsageData = null;
      
      if (coordinates) {
        try {
          // Determine if this is likely a freshwater location
          const isFreshWater = WorldWeatherService.isFreshWaterLocation(
            city,
            coordinates.lat,
            coordinates.lon
          );
          
          // Get marine data from WorldWeatherOnline API
          const marineData = await WorldWeatherService.getMarineData(
            coordinates.lat,
            coordinates.lon
          );
          
          // Generate water quality data based on marine data
          waterQualityData = WorldWeatherService.generateWaterQualityData(
            marineData,
            isFreshWater
          );
          
          // Get water safety data from USCG API
          try {
            const safetyData = await UscgWaterService.getWaterSafetyData(
              coordinates.lat,
              coordinates.lon
            );
            
            if (safetyData) {
              waterSafetyData = safetyData;
            } else {
              // Generate fallback water safety data
              waterSafetyData = UscgWaterService.generateWaterSafetyData(
                city,
                coordinates.lat,
                coordinates.lon,
                isFreshWater
              );
            }
          } catch (safetyError) {
            console.error('Error fetching water safety data:', safetyError);
            // Generate fallback water safety data
            waterSafetyData = UscgWaterService.generateWaterSafetyData(
              city,
              coordinates.lat,
              coordinates.lon,
              isFreshWater
            );
          }
          
          // Generate water usage data
          waterUsageData = UscgWaterService.generateWaterUsageData(
            city,
            coordinates.lat,
            coordinates.lon,
            isFreshWater
          );
          
          // Update resource stats with real water data
          if (waterQualityData && waterSafetyData && waterUsageData) {
            // Create a new array to avoid mutating state directly
            const updatedStats = [...resourceStats];
            updatedStats[1] = {
              ...updatedStats[1],
              value: `${Math.round(waterUsageData.recreationalIndex)}%`,
              trend: waterUsageData.recreationalIndex < 50 ? "down" : "up"
            };
            // Update the state with the new array
            setResourceStats(updatedStats);
          }
        } catch (waterDataError) {
          console.error('Error fetching water data:', waterDataError);
        }
      }
      
      // Generate city-specific data using a hash
      const cityHash = city.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      
      // Generate consumption trend data (6 months)
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      const trend = months.map((month, index) => {
        // Create trends with seasonal variations
        const baseEnergy = 60 + (cityHash % 20);
        
        // Energy usage higher in winter (Jan-Feb) and summer (May-Jun)
        let energyFactor = 1.0;
        if (index === 0 || index === 1 || index === 4 || index === 5) {
          energyFactor = 1.2;
        }
        
        return {
          name: month,
          energy: Math.round(baseEnergy * energyFactor + (index % 3) * 5)
        };
      });
      setEnergyData(trend);
      
      // Generate efficiency data
      const efficiency = [
        { subject: 'Energy', A: 65 + (cityHash % 25), fullMark: 100 },
        { subject: 'Water', A: 60 + (cityHash % 30), fullMark: 100 },
        { subject: 'Waste', A: 55 + (cityHash % 20), fullMark: 100 },
        { subject: 'Transport', A: 70 + (cityHash % 15), fullMark: 100 },
        { subject: 'Green Space', A: 75 + (cityHash % 10), fullMark: 100 }
      ];
      
      // Calculate sustainability score
      const avgEfficiency = Math.round(
        efficiency.reduce((sum, item) => sum + item.A, 0) / efficiency.length
      );
      setSustainabilityScore(avgEfficiency);
      
    } catch (error) {
      console.error("Error fetching resource data:", error);
    }
  }, [resourceStats, setResourceStats]);
  
  // Update resourceStats if resourceDataDetails changes
  useEffect(() => {
    setResourceStats([
      {
        title: "Energy Savings",
        value: `${resourceDataDetails?.electricity?.savings || 12}%`,
        trend: (resourceDataDetails?.electricity?.savings || 0) > 10 ? "up" : "down",
        icon: Battery,
        color: "blue"
      },
      {
        title: "Water Usage",
        value: `${Math.round((resourceDataDetails?.water?.usage?.residential || 45) / 50 * 100)}%`,
        trend: (resourceDataDetails?.water?.usage?.residential || 45) < 50 ? "down" : "up",
        icon: Droplets,
        color: "cyan"
      },
      {
        title: "Waste Recycling",
        value: `${Math.round(((resourceDataDetails?.waste?.recycling || 35) / (resourceDataDetails?.waste?.collection || 85)) * 100)}%`,
        trend: "up",
        icon: Trash2,
        color: "amber"
      },
      {
        title: "Renewable Energy",
        value: `${resourceDataDetails?.electricity?.renewable || 22}%`,
        trend: "up",
        icon: Wind,
        color: "green"
      }
    ]);
  }, [resourceDataDetails]);

  useEffect(() => {
    // Load initial data
    fetchResourceData(currentLocation);
    
    // Check for saved location preference
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      setCurrentLocation(savedLocation);
      fetchResourceData(savedLocation);
    }
  }, [currentLocation, fetchResourceData]);
  
  // Calculate total resource usage with safety check
  const totalResourceUsage = Array.isArray(resourceData) ? 
    resourceData.reduce((sum: number, resource: ResourceItem) => sum + resource.value, 0) : 0;
  
  // Determine if sustainability score is improving
  const isImproving = sustainabilityScore > 70;

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
            <Sparkles className="w-6 h-6 mr-2 text-amber-500" />
            Resource Management
          </h1>
          <div className="flex items-center space-x-3">
            <select 
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className={`border rounded-md px-3 py-1 text-sm ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <option value="all">All Resources</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Waste">Waste</option>
              <option value="Gas">Gas</option>
            </select>
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
            {/* Resource Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Sustainability Score */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-green-500 text-white mr-4`}>
                    <Leaf size={20} />
                  </div>
                  <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Sustainability</h3>
                </div>
                <div className="flex items-center">
                  <p className="text-3xl font-bold">{sustainabilityScore}</p>
                  <div className="ml-3 flex items-center">
                    {isImproving ? (
                      <span className="text-green-500 flex items-center">
                        <ArrowUpRight size={16} className="mr-1" /> Improving
                      </span>
                    ) : (
                      <span className="text-amber-500 flex items-center">
                        <ArrowDownRight size={16} className="mr-1" /> Needs Attention
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                  <div 
                    className={`h-2.5 rounded-full ${
                      sustainabilityScore > 80 ? 'bg-green-500' : 
                      sustainabilityScore > 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${sustainabilityScore}%` }}
                  ></div>
                </div>
              </motion.div>
              
              {/* Resource Cards */}
              {Array.isArray(resourceData) && resourceData.length > 0 ? resourceData.slice(0, 3).map((resource, index) => {
                const IconComponent = resourceIcons[resource.name] || Activity;
                const colors = ['bg-blue-500', 'bg-teal-500', 'bg-amber-500', 'bg-purple-500'];
                const textColors = ['text-blue-600', 'text-teal-600', 'text-amber-600', 'text-purple-600'];
                
                return (
                  <motion.div 
                    key={resource.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: (index + 1) * 0.1 }}
                    className={`p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`p-3 ${colors[index]} text-white rounded-lg mr-4`}>
                        <IconComponent size={20} />
                      </div>
                      <h3 className={`text-lg font-medium ${textColors[index]}`}>{resource.name}</h3>
                    </div>
                    <div className="flex items-center">
                      <p className="text-3xl font-bold">{resource.value}</p>
                      <span className="ml-2 text-sm text-gray-500">units</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
                      <div 
                        className={`h-2.5 rounded-full ${colors[index]}`} 
                        style={{ width: `${(resource.value / 100) * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      {Math.round((resource.value / totalResourceUsage) * 100)}% of total usage
                    </p>
                  </motion.div>
                );
              }) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className={`p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                  <div className="flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-amber-500 mr-2" />
                    <p>No resource data available</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Resource Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Energy Consumption Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`col-span-1 lg:col-span-2 p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Annual Energy Consumption</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Monthly electricity usage in kWh for {currentLocation}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                      <Filter className="w-5 h-5" />
                    </button>
                    <button className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={energyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }} 
                      />
                      <YAxis 
                        tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                          borderColor: darkMode ? '#374151' : '#e5e7eb',
                          color: darkMode ? '#ffffff' : '#000000'
                        }} 
                        formatter={(value) => [`${value} kWh`, 'Usage']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="energy" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Resource Distribution Pie Chart */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className={`p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <h2 className="text-xl font-bold mb-4">Resource Distribution</h2>
                <div className="h-80 flex items-center justify-center">
                  {Array.isArray(resourceData) && resourceData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={resourceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {resourceData.map((entry: ResourceItem, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                            borderColor: darkMode ? '#374151' : '#e5e7eb',
                            color: darkMode ? '#ffffff' : '#000000'
                          }} 
                          formatter={(value) => [`${value}%`, 'Usage']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
                      <p className="text-center">No resource distribution data available</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Resource Alerts */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`mb-8 p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Resource Alerts</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Recent alerts and incidents in {currentLocation}
                  </p>
                </div>
              </div>
              
              {filteredAlerts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-600 border-gray-200'} border-b`}>
                        <th className="py-3 text-left font-medium">Resource</th>
                        <th className="py-3 text-left font-medium">Location</th>
                        <th className="py-3 text-left font-medium">Alert</th>
                        <th className="py-3 text-left font-medium">Status</th>
                        <th className="py-3 text-left font-medium">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAlerts.map((alert) => (
                        <tr 
                          key={alert.id} 
                          className={`${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'} border-b`}
                        >
                          <td className="py-3">
                            <span className="flex items-center">
                              {alert.resource === "Electricity" && <Battery className="w-4 h-4 mr-2 text-blue-500" />}
                              {alert.resource === "Water" && <Droplets className="w-4 h-4 mr-2 text-cyan-500" />}
                              {alert.resource === "Waste" && <Trash2 className="w-4 h-4 mr-2 text-amber-500" />}
                              {alert.resource === "Gas" && <Wind className="w-4 h-4 mr-2 text-purple-500" />}
                              {alert.resource}
                            </span>
                          </td>
                          <td className="py-3">{alert.location}</td>
                          <td className="py-3">{alert.alert}</td>
                          <td className="py-3">
                            <span className={`flex items-center ${
                              alert.status === "Unresolved" || alert.status === "Ongoing"
                                ? "text-amber-500" 
                                : "text-green-500"
                            }`}>
                              {alert.status === "Unresolved" && <AlertCircle className="w-4 h-4 mr-1" />}
                              {alert.status === "Ongoing" && <Clock className="w-4 h-4 mr-1" />}
                              {alert.status === "Resolved" && <CheckCircle2 className="w-4 h-4 mr-1" />}
                              {alert.status}
                            </span>
                          </td>
                          <td className="py-3">{alert.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    No alerts found for the selected resource
                  </p>
                </div>
              )}
            </motion.div>

            {/* Resource Optimization Tips */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className={`p-6 rounded-xl ${darkMode ? 'bg-amber-900' : 'bg-amber-50'} shadow-sm`}
            >
              <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-amber-900'}`}>
                AI Resource Optimization Tips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-amber-800' : 'bg-white'} shadow-sm`}>
                  <h3 className="font-medium mb-2">Energy Efficiency</h3>
                  <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-gray-600'}`}>
                    Turn off unnecessary lights between 10 PM and 6 AM to reduce monthly electricity consumption by 15%.
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-amber-800' : 'bg-white'} shadow-sm`}>
                  <h3 className="font-medium mb-2">Water Conservation</h3>
                  <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-gray-600'}`}>
                    Collect rainwater for gardening and other uses to reduce water consumption by 20%.
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-amber-800' : 'bg-white'} shadow-sm`}>
                  <h3 className="font-medium mb-2">Waste Reduction</h3>
                  <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-gray-600'}`}>
                    Separate waste and compost to reduce waste disposal by 30%.
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-amber-800' : 'bg-white'} shadow-sm`}>
                  <h3 className="font-medium mb-2">Smart Monitoring</h3>
                  <p className={`text-sm ${darkMode ? 'text-amber-200' : 'text-gray-600'}`}>
                    Install smart meters to monitor resource usage in real-time and optimize consumption.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
} 