"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Leaf,
  Map,
  BarChart2,
  Filter,
  Download,
  Plus,
  Search,
  Calendar,
  Droplets,
  Thermometer,
  Sun,
  Wind
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

// Sample data for charts
const monthlyVisitorsData = [
  { month: "Jan", visitors: 3200 },
  { month: "Feb", visitors: 3800 },
  { month: "Mar", visitors: 4200 },
  { month: "Apr", visitors: 4900 },
  { month: "May", visitors: 5700 },
  { month: "Jun", visitors: 6500 },
  { month: "Jul", visitors: 7200 },
  { month: "Aug", visitors: 7100 },
  { month: "Sep", visitors: 5800 },
  { month: "Oct", visitors: 4900 },
  { month: "Nov", visitors: 3800 },
  { month: "Dec", visitors: 3500 },
];

const parkUsageData = [
  { name: "Recreation", value: 35 },
  { name: "Exercise", value: 25 },
  { name: "Relaxation", value: 20 },
  { name: "Events", value: 10 },
  { name: "Other", value: 10 },
];

const COLORS = ["#4ade80", "#60a5fa", "#f97316", "#a78bfa", "#f43f5e"];

const maintenanceData = [
  { month: "Jan", irrigation: 45, pruning: 20, cleaning: 35 },
  { month: "Feb", irrigation: 40, pruning: 25, cleaning: 35 },
  { month: "Mar", irrigation: 50, pruning: 30, cleaning: 40 },
  { month: "Apr", irrigation: 65, pruning: 40, cleaning: 45 },
  { month: "May", irrigation: 80, pruning: 35, cleaning: 50 },
  { month: "Jun", irrigation: 95, pruning: 25, cleaning: 55 },
  { month: "Jul", irrigation: 100, pruning: 20, cleaning: 60 },
  { month: "Aug", irrigation: 90, pruning: 15, cleaning: 55 },
  { month: "Sep", irrigation: 75, pruning: 30, cleaning: 50 },
  { month: "Oct", irrigation: 60, pruning: 45, cleaning: 45 },
  { month: "Nov", irrigation: 50, pruning: 40, cleaning: 40 },
  { month: "Dec", irrigation: 45, pruning: 30, cleaning: 35 },
];

const parksList = [
  {
    id: 1,
    name: "Central City Park",
    area: "12.5 hectares",
    trees: 1250,
    facilities: ["Playground", "Sports Fields", "Walking Trails"],
    status: "Excellent",
    lastMaintenance: "May 15, 2024"
  },
  {
    id: 2,
    name: "Riverside Gardens",
    area: "8.2 hectares",
    trees: 950,
    facilities: ["Botanical Garden", "Picnic Areas", "Water Features"],
    status: "Good",
    lastMaintenance: "June 2, 2024"
  },
  {
    id: 3,
    name: "Highland Nature Reserve",
    area: "22.7 hectares",
    trees: 3200,
    facilities: ["Wildlife Sanctuary", "Hiking Trails", "Observation Points"],
    status: "Good",
    lastMaintenance: "April 28, 2024"
  },
  {
    id: 4,
    name: "Eastside Community Garden",
    area: "3.5 hectares",
    trees: 420,
    facilities: ["Community Plots", "Greenhouse", "Education Center"],
    status: "Needs Attention",
    lastMaintenance: "March 10, 2024"
  },
  {
    id: 5,
    name: "Sunset Recreation Area",
    area: "15.8 hectares",
    trees: 1850,
    facilities: ["Sports Complex", "Skate Park", "Amphitheater"],
    status: "Excellent",
    lastMaintenance: "May 30, 2024"
  }
];

const environmentalMetrics = [
  {
    title: "Air Quality Index",
    value: "72",
    trend: "up",
    change: "+5%",
    icon: Wind,
    color: "green"
  },
  {
    title: "Temperature Reduction",
    value: "3.2°C",
    trend: "up",
    change: "+0.4°C",
    icon: Thermometer,
    color: "blue"
  },
  {
    title: "Water Conservation",
    value: "18.5%",
    trend: "up",
    change: "+2.3%",
    icon: Droplets,
    color: "cyan"
  },
  {
    title: "Solar Efficiency",
    value: "82%",
    trend: "up",
    change: "+4%",
    icon: Sun,
    color: "amber"
  }
];

export default function GreenSpacesPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPark, setSelectedPark] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  
  // Check system preference for dark mode
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Filter parks based on search query and status filter
  const filteredParks = parksList.filter(park => {
    const matchesSearch = park.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "All" || park.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

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
            <Leaf className="w-6 h-6 mr-2 text-green-500" />
            Green Spaces Management
          </h1>
          <div className="flex items-center space-x-3">
            <button className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <Map size={18} />
            </button>
            <button className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <BarChart2 size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Environmental Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {environmentalMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg bg-${metric.color}-100 text-${metric.color}-600 dark:bg-${metric.color}-900 dark:text-${metric.color}-300 mr-4`}>
                  <metric.icon size={20} />
                </div>
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{metric.title}</h3>
              </div>
              <div className="flex items-center">
                <p className="text-3xl font-bold mr-2">{metric.value}</p>
                <div className={`flex items-center ${
                  metric.trend === "up" 
                    ? "text-green-500" 
                    : "text-red-500"
                }`}>
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Monthly Visitors Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`col-span-1 lg:col-span-2 p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold mb-1">Monthly Park Visitors</h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Visitor count across all green spaces
                </p>
              </div>
              <div className="flex space-x-2">
                <button className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  <Filter size={16} />
                </button>
                <button className={`p-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                  <Download size={16} />
                </button>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyVisitorsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                  <XAxis 
                    dataKey="month" 
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
                  />
                  <Bar 
                    dataKey="visitors" 
                    name="Visitors" 
                    fill="#4ade80" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Park Usage Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className={`p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
          >
            <h2 className="text-xl font-bold mb-4">Park Usage Distribution</h2>
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={parkUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {parkUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                      borderColor: darkMode ? '#374151' : '#e5e7eb',
                      color: darkMode ? '#ffffff' : '#000000'
                    }} 
                    formatter={(value) => [`${value}%`, 'Usage']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Maintenance Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={`mb-8 p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Maintenance Activities</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Monthly maintenance hours by activity type
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Calendar size={18} className="text-green-500" />
              </div>
              <select 
                className={`border rounded-md px-3 py-1 text-sm ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={maintenanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="month" 
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
                  formatter={(value) => [`${value} hours`, '']}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="irrigation" 
                  name="Irrigation" 
                  stroke="#60a5fa" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pruning" 
                  name="Pruning & Planting" 
                  stroke="#4ade80" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cleaning" 
                  name="Cleaning & Waste" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Parks Management */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`p-6 rounded-xl shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'} mb-8`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Parks & Green Spaces</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Manage and monitor all green areas
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full md:w-auto">
              <div className={`relative flex items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-md px-3 py-2`}>
                <Search size={16} className="text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search parks..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`ml-2 outline-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'} w-full`}
                />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`border rounded-md px-3 py-2 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <option value="All">All Statuses</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Needs Attention">Needs Attention</option>
              </select>
              <button className="flex items-center justify-center py-2 px-4 rounded-md bg-green-500 text-white hover:bg-green-600">
                <Plus size={16} className="mr-1" />
                Add Park
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-600 border-gray-200'} border-b`}>
                  <th className="py-3 text-left font-medium">Park Name</th>
                  <th className="py-3 text-left font-medium">Area</th>
                  <th className="py-3 text-left font-medium">Trees</th>
                  <th className="py-3 text-left font-medium">Facilities</th>
                  <th className="py-3 text-left font-medium">Status</th>
                  <th className="py-3 text-left font-medium">Last Maintenance</th>
                </tr>
              </thead>
              <tbody>
                {filteredParks.map((park) => (
                  <tr 
                    key={park.id} 
                    className={`${darkMode ? 'border-gray-700 hover:bg-gray-750' : 'border-gray-100 hover:bg-gray-50'} border-b cursor-pointer`}
                    onClick={() => setSelectedPark(park.id === selectedPark ? null : park.id)}
                  >
                    <td className="py-3 flex items-center">
                      <Leaf className={`w-4 h-4 mr-2 ${
                        park.status === "Excellent" 
                          ? "text-green-500" 
                          : park.status === "Good"
                            ? "text-blue-500"
                            : "text-amber-500"
                      }`} />
                      {park.name}
                    </td>
                    <td className="py-3">{park.area}</td>
                    <td className="py-3">{park.trees}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1">
                        {park.facilities.map((facility, idx) => (
                          <span 
                            key={idx} 
                            className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {facility}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        park.status === "Excellent" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                          : park.status === "Good"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                      }`}>
                        {park.status}
                      </span>
                    </td>
                    <td className="py-3">{park.lastMaintenance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredParks.length === 0 && (
            <div className="text-center py-8">
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No parks found matching your criteria.</p>
            </div>
          )}
        </motion.div>
        
        {/* Sustainability Tips */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`p-6 rounded-xl ${darkMode ? 'bg-green-900' : 'bg-green-50'} shadow-sm`}
        >
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-green-900'}`}>
            Sustainability Recommendations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-800' : 'bg-white'} shadow-sm`}>
              <h3 className="font-medium mb-2">Water Conservation</h3>
              <p className={`text-sm ${darkMode ? 'text-green-200' : 'text-gray-600'}`}>
                Implementing smart irrigation systems at Central City Park could reduce water usage by 35% while maintaining plant health. Consider installing soil moisture sensors to optimize watering schedules.
              </p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-800' : 'bg-white'} shadow-sm`}>
              <h3 className="font-medium mb-2">Biodiversity Enhancement</h3>
              <p className={`text-sm ${darkMode ? 'text-green-200' : 'text-gray-600'}`}>
                Highland Nature Reserve shows potential for increased biodiversity. Adding native plant species and creating microhabitats could attract 40% more pollinator species and improve ecosystem resilience.
              </p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-800' : 'bg-white'} shadow-sm`}>
              <h3 className="font-medium mb-2">Community Engagement</h3>
              <p className={`text-sm ${darkMode ? 'text-green-200' : 'text-gray-600'}`}>
                Eastside Community Garden requires maintenance attention. Organizing monthly volunteer days could address maintenance backlog while increasing community ownership and participation.
              </p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-800' : 'bg-white'} shadow-sm`}>
              <h3 className="font-medium mb-2">Carbon Sequestration</h3>
              <p className={`text-sm ${darkMode ? 'text-green-200' : 'text-gray-600'}`}>
                Adding 200 new trees across all parks would increase carbon sequestration by approximately 4 tons annually. Focus on fast-growing native species with high carbon capture potential.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 