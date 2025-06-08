"use client";

import Link from "next/link";
import { Filter, MapPin, BarChart2, ArrowRight } from "lucide-react";
import TrafficMenu from '@/components/traffic/TrafficMenu';

export default function TrafficDashboardPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Traffic Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Monitor and analyze traffic conditions in urban areas.
        </p>
      </div>
      
      {/* Traffic Menu */}
      <TrafficMenu />
      
      {/* Quick links */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/dashboard/traffic/advanced-filters" 
          className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-transparent hover:border-blue-500"
        >
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Filter className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-800 dark:text-white">
              Advanced Filtering
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">
            Filter traffic data by area, road type, metrics, and more with our advanced filtering tools.
          </p>
          <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
            Explore Filters
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </Link>
        
        <Link 
          href="/dashboard/traffic/analysis" 
          className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-transparent hover:border-blue-500"
        >
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <BarChart2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-800 dark:text-white">
              Traffic Analysis
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">
            View detailed analytics and trends for traffic patterns across different time periods.
          </p>
          <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
            View Analytics
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </Link>
        
        <Link 
          href="/dashboard/traffic/map" 
          className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-transparent hover:border-blue-500"
        >
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="ml-3 text-lg font-semibold text-gray-800 dark:text-white">
              Live Traffic Map
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">
            Interactive map showing real-time traffic conditions, congestion hotspots, and incidents.
          </p>
          <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-medium">
            Open Map
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </Link>
      </div>
      
      {/* Featured Traffic Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Featured Traffic Insights
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Our advanced filtering system allows you to analyze traffic data with precision. Filter by specific 
          areas of the city, road types, congestion levels, and time periods to gain insights into traffic patterns.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">
              Area-Specific Analysis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Focus on specific neighborhoods or districts to understand localized traffic conditions and plan targeted interventions.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">
              Time-Based Filtering
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Analyze traffic patterns during morning rush hours, evening commutes, or any specific time period to identify peak congestion times.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">
              Road Type Comparisons
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Compare traffic conditions across highways, major roads, and local streets to identify bottlenecks in the transportation network.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 dark:text-white mb-2">
              Congestion Severity Tracking
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Filter by congestion levels to focus on critical areas experiencing severe traffic congestion and prioritize interventions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 