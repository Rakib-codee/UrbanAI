"use client";

import Link from 'next/link';
import {
  MonitorIcon,
  BarChart2,
  Beaker,
  Leaf,
  Brain,
  Clock,
  Users,
  CheckCircle,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Cloud,
  Target,
  Award
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/simple-auth';

// Define types for the components
interface ProgressBarProps {
  value: number;
  maxValue: number;
  color: string;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState('User');
  const greeting = getGreeting();
  
  // Get user info on mount to avoid auth context dependency
  useEffect(() => {
    const user = auth.getUser();
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);
  
  const features = [
    {
      title: "AI Assistant",
      description: "Get AI-powered suggestions for urban planning",
      icon: MonitorIcon,
      href: "/dashboard/ai-assistant",
      gradient: "from-indigo-500 to-blue-600",
      hoverGradient: "from-indigo-600 to-blue-700",
    },
    {
      title: "Traffic Analysis",
      description: "Monitor and analyze traffic patterns",
      icon: BarChart2,
      href: "/dashboard/traffic",
      gradient: "from-emerald-500 to-teal-600",
      hoverGradient: "from-emerald-600 to-teal-700",
    },
    {
      title: "Resource Management",
      description: "Track and optimize resource utilization",
      icon: Sparkles,
      href: "/dashboard/resources",
      gradient: "from-amber-500 to-orange-600",
      hoverGradient: "from-amber-600 to-orange-700",
    },
    {
      title: "Green Spaces",
      description: "Manage and monitor green areas",
      icon: Leaf,
      href: "/dashboard/green-spaces",
      gradient: "from-green-500 to-emerald-600",
      hoverGradient: "from-green-600 to-emerald-700",
    },
    {
      title: "Urban Simulation",
      description: "Run simulations for urban development",
      icon: Beaker,
      href: "/dashboard/simulation",
      gradient: "from-violet-500 to-purple-600",
      hoverGradient: "from-violet-600 to-purple-700",
    },
    {
      title: "Environmental Goals",
      description: "Track environmental sustainability targets",
      icon: Target,
      href: "/dashboard/environmental-goals",
      gradient: "from-green-500 to-teal-600",
      hoverGradient: "from-green-600 to-teal-700",
    },
    {
      title: "Weather Insights",
      description: "View weather data and forecasts",
      icon: Cloud,
      href: "/dashboard/weather",
      gradient: "from-cyan-500 to-blue-600",
      hoverGradient: "from-cyan-600 to-blue-700",
    },
    {
      title: "Success Stories",
      description: "View successful urban planning projects",
      icon: Award,
      href: "/dashboard/success-stories",
      gradient: "from-amber-500 to-yellow-600",
      hoverGradient: "from-amber-600 to-yellow-700",
    },
    {
      title: "AI Testing",
      description: "Test and evaluate AI models",
      icon: Brain,
      href: "/dashboard/ai-testing",
      gradient: "from-blue-500 to-cyan-600",
      hoverGradient: "from-blue-600 to-cyan-700",
    },
    {
      title: "Social Impact",
      description: "Analyze social impact of urban planning",
      icon: Users,
      href: "/dashboard/social",
      gradient: "from-pink-500 to-rose-600",
      hoverGradient: "from-pink-600 to-rose-700",
    }
  ];

  const stats = [
    {
      title: "Active Users",
      value: "1,287",
      change: "+12%",
      icon: Users,
      gradient: "from-blue-500 to-indigo-600",
    },
    {
      title: "Completed Projects",
      value: "34",
      change: "+5",
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-600",
    },
    {
      title: "Usage Time",
      value: "12.5 hrs",
      change: "+2.3",
      icon: Clock,
      gradient: "from-purple-500 to-violet-600",
    },
    {
      title: "AI Queries",
      value: "987",
      change: "+24%",
      icon: MessageSquare,
      gradient: "from-amber-500 to-orange-600",
    }
  ];

  const cityMetrics = [
    { name: "Energy Usage", value: 72, maxValue: 100, color: "from-amber-500 to-yellow-300" },
    { name: "Traffic Flow", value: 85, maxValue: 100, color: "from-blue-500 to-cyan-300" },
    { name: "Green Coverage", value: 63, maxValue: 100, color: "from-green-500 to-emerald-300" },
    { name: "Air Quality", value: 91, maxValue: 100, color: "from-indigo-500 to-purple-300" }
  ];

  // Helper function to get greeting based on time of day
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    else if (hour < 17) return 'Good Afternoon';
    else return 'Good Evening';
  }

  // Progress bar component
  const ProgressBar = ({ value, maxValue, color }: ProgressBarProps) => {
    const percentage = (value / maxValue) * 100;
    
    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div 
          className={`h-2.5 rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div id="main-dashboard-content" className="dashboard-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 pt-0">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-lg mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {greeting}, {userName}!
            </h1>
            <p className="text-blue-100 mt-2 text-lg">
              Welcome to your Urban AI Dashboard
            </p>
            <div className="flex items-center mt-4 bg-white/20 rounded-full px-4 py-1 w-fit">
              <Sparkles className="w-4 h-4 text-yellow-300 mr-2" />
              <p className="text-sm text-white">Your city efficiency score is <span className="font-bold">87/100</span></p>
            </div>
          </div>
          <div className="text-sm text-white bg-white/20 py-2 px-4 rounded-lg">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        {/* Left column - Features */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 w-1 h-6 rounded mr-2"></span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <Link 
                href={feature.href} 
                key={index}
                className={`bg-gradient-to-r ${feature.gradient} hover:${feature.hoverGradient} rounded-xl p-5 text-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1`}
              >
                <div className="bg-white/20 p-2 rounded-lg w-fit mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-white/80">{feature.description}</p>
              </Link>
            ))}
          </div>

          {/* City Metrics */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 w-1 h-6 rounded mr-2"></span>
              City Metrics
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cityMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">{metric.name}</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{metric.value}/{metric.maxValue}</span>
                    </div>
                    <ProgressBar value={metric.value} maxValue={metric.maxValue} color={metric.color} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Stats */}
        <div className="space-y-8">
          {/* Quick Stats */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <span className="bg-gradient-to-r from-purple-600 to-violet-600 w-1 h-6 rounded mr-2"></span>
              Quick Stats
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <div className={`bg-gradient-to-r ${stat.gradient} p-4`}>
                    <div className="flex justify-between items-center">
                      <div className="bg-white/20 p-2 rounded-lg">
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center bg-white/20 py-1 px-2 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-white mr-1" />
                        <span className="text-xs font-medium text-white">{stat.change}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent Updates */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 w-1 h-6 rounded mr-2"></span>
              Recent Updates
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Today</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">New traffic analysis complete</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4 py-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Yesterday</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Green space project approved</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">3 days ago</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">AI model updated with new data</p>
                </div>
                <Link 
                  href="/dashboard/updates" 
                  className="flex items-center justify-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mt-4 font-medium"
                >
                  View all updates
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 