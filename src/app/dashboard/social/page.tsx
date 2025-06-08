'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import CityRankings from '@/components/social/CityRankings';
import FeedbackSystem from '@/components/social/FeedbackSystem';
import { getLocalCityRankings, CityRanking } from '@/services/SocialService';
import { BarChart2, MessageSquare, Filter, ArrowRight } from 'lucide-react';

export default function SocialPage() {
  const [localRankings, setLocalRankings] = useState<CityRanking[]>([]);
  const [activeTab, setActiveTab] = useState('rankings');
  
  // Fetch local city rankings
  useEffect(() => {
    const fetchLocalRankings = async () => {
      try {
        const rankings = await getLocalCityRankings();
        setLocalRankings(rankings);
      } catch (error) {
        console.error('Error fetching local rankings:', error);
      }
    };
    
    fetchLocalRankings();
  }, []);
  
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Social Components
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Explore city sustainability rankings and share your feedback to improve urban areas.
          </p>
        </div>
        
        {/* Advanced Filtering Link */}
        <div className="mb-6">
          <Link 
            href="/dashboard/social/advanced-filters" 
            className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filtering
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
        
        {/* Tabs for navigation */}
        <div className="mb-6">
          <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => setActiveTab('rankings')}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === 'rankings' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <BarChart2 className="h-4 w-4 mr-2" />
              City Rankings
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === 'feedback' 
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Community Feedback
            </button>
          </div>
        </div>
        
        {/* Content based on active tab */}
        {activeTab === 'rankings' ? (
          <div className="space-y-8">
            {/* Local rankings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Your Local Area and Similar Cities
              </h2>
              <CityRankings 
                initialRankings={localRankings}
                defaultFilters={{ sortBy: 'rank', order: 'asc' }}
              />
            </div>
            
            {/* All cities */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Global City Sustainability Rankings
              </h2>
              <CityRankings />
            </div>
          </div>
        ) : (
          <FeedbackSystem />
        )}
      </div>
    </DashboardLayout>
  );
} 