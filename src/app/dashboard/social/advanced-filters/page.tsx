'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { BarChart2, MessageSquare, Filter, ArrowLeft } from 'lucide-react';
import { fetchCityRankings, CityRanking, fetchFeedbackItems, FeedbackItem } from '@/services/SocialService';

export default function SocialAdvancedFiltersPage() {
  // States for data
  const [cityRankings, setCityRankings] = useState<CityRanking[]>([]);
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [activeTab, setActiveTab] = useState<'rankings' | 'feedback'>('rankings');
  const [isLoading, setIsLoading] = useState(false);
  
  // States for filters
  const [rankingFilters, setRankingFilters] = useState({
    country: '',
    sortBy: 'rank' as 'rank' | 'sustainabilityScore' | 'trafficScore' | 'airQualityScore' | 'greenSpaceScore',
    order: 'asc' as 'asc' | 'desc',
    minScore: 0,
    maxScore: 100
  });
  
  const [feedbackFilters, setFeedbackFilters] = useState({
    type: 'all' as 'all' | 'issue' | 'suggestion' | 'question',
    category: 'all' as 'all' | 'traffic' | 'environment' | 'infrastructure' | 'safety' | 'general',
    status: 'all' as 'all' | 'pending' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed',
    sortBy: 'date' as 'date' | 'votes' | 'status',
    order: 'desc' as 'asc' | 'desc'
  });
  
  // Apply ranking filters
  const applyRankingFilters = async () => {
    setIsLoading(true);
    try {
      const filteredRankings = await fetchCityRankings({
        country: rankingFilters.country || undefined,
        sortBy: rankingFilters.sortBy,
        order: rankingFilters.order
      });
      
      // Apply min/max score filter in memory
      const scoreFiltered = filteredRankings.filter(city => 
        city.sustainabilityScore >= rankingFilters.minScore && 
        city.sustainabilityScore <= rankingFilters.maxScore
      );
      
      setCityRankings(scoreFiltered);
    } catch (error) {
      console.error('Error applying ranking filters:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Apply feedback filters
  const applyFeedbackFilters = async () => {
    setIsLoading(true);
    try {
      const options: any = {};
      
      if (feedbackFilters.category !== 'all') {
        options.category = feedbackFilters.category;
      }
      
      if (feedbackFilters.status !== 'all') {
        options.status = feedbackFilters.status;
      }
      
      const response = await fetchFeedbackItems(options);
      
      // Filter by type in memory
      let filtered = response.items;
      if (feedbackFilters.type !== 'all') {
        filtered = filtered.filter(item => item.type === feedbackFilters.type);
      }
      
      // Apply sorting in memory
      if (feedbackFilters.sortBy === 'date') {
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return feedbackFilters.order === 'asc' ? dateA - dateB : dateB - dateA;
        });
      } else if (feedbackFilters.sortBy === 'votes') {
        filtered.sort((a, b) => {
          return feedbackFilters.order === 'asc' ? a.votes - b.votes : b.votes - a.votes;
        });
      } else if (feedbackFilters.sortBy === 'status') {
        const statusOrder = {
          'pending': 1,
          'acknowledged': 2,
          'in_progress': 3,
          'resolved': 4,
          'closed': 5
        };
        
        filtered.sort((a, b) => {
          const orderA = statusOrder[a.status as keyof typeof statusOrder] || 0;
          const orderB = statusOrder[b.status as keyof typeof statusOrder] || 0;
          return feedbackFilters.order === 'asc' ? orderA - orderB : orderB - orderA;
        });
      }
      
      setFeedbackItems(filtered);
    } catch (error) {
      console.error('Error applying feedback filters:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle initial data load
  const loadInitialData = () => {
    if (activeTab === 'rankings') {
      applyRankingFilters();
    } else {
      applyFeedbackFilters();
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6 flex items-center">
          <Link 
            href="/dashboard/social"
            className="mr-4 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Advanced Social Filtering
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Filter city rankings and community feedback with precision.
            </p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="mb-6">
          <div className="inline-flex p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => {
                setActiveTab('rankings');
                loadInitialData();
              }}
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
              onClick={() => {
                setActiveTab('feedback');
                loadInitialData();
              }}
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
        
        {/* Filters */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {activeTab === 'rankings' ? 'City Rankings Filters' : 'Feedback Filters'}
            </h2>
          </div>
          
          {activeTab === 'rankings' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="Filter by country..."
                  value={rankingFilters.country}
                  onChange={(e) => setRankingFilters({...rankingFilters, country: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  value={rankingFilters.sortBy}
                  onChange={(e) => setRankingFilters({...rankingFilters, sortBy: e.target.value as any})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="rank">Overall Rank</option>
                  <option value="sustainabilityScore">Sustainability Score</option>
                  <option value="trafficScore">Traffic Score</option>
                  <option value="airQualityScore">Air Quality Score</option>
                  <option value="greenSpaceScore">Green Space Score</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order
                </label>
                <select
                  value={rankingFilters.order}
                  onChange={(e) => setRankingFilters({...rankingFilters, order: e.target.value as any})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Sustainability Score
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rankingFilters.minScore}
                  onChange={(e) => setRankingFilters({...rankingFilters, minScore: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {rankingFilters.minScore}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Sustainability Score
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rankingFilters.maxScore}
                  onChange={(e) => setRankingFilters({...rankingFilters, maxScore: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {rankingFilters.maxScore}
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={applyRankingFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Feedback Type
                </label>
                <select
                  value={feedbackFilters.type}
                  onChange={(e) => setFeedbackFilters({...feedbackFilters, type: e.target.value as any})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="issue">Issues</option>
                  <option value="suggestion">Suggestions</option>
                  <option value="question">Questions</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={feedbackFilters.category}
                  onChange={(e) => setFeedbackFilters({...feedbackFilters, category: e.target.value as any})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="all">All Categories</option>
                  <option value="traffic">Traffic</option>
                  <option value="environment">Environment</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="safety">Safety</option>
                  <option value="general">General</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={feedbackFilters.status}
                  onChange={(e) => setFeedbackFilters({...feedbackFilters, status: e.target.value as any})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sort By
                </label>
                <select
                  value={feedbackFilters.sortBy}
                  onChange={(e) => setFeedbackFilters({...feedbackFilters, sortBy: e.target.value as any})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="date">Date</option>
                  <option value="votes">Votes</option>
                  <option value="status">Status</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Order
                </label>
                <select
                  value={feedbackFilters.order}
                  onChange={(e) => setFeedbackFilters({...feedbackFilters, order: e.target.value as any})}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                >
                  <option value="desc">Descending</option>
                  <option value="asc">Ascending</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={applyFeedbackFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {activeTab === 'rankings' ? 'City Rankings' : 'Community Feedback'}
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {activeTab === 'rankings' ? cityRankings.length : feedbackItems.length} results
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : activeTab === 'rankings' ? (
            <div className="overflow-x-auto">
              {cityRankings.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <p className="mb-2">No cities found matching your criteria.</p>
                  <p>Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        City
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Country
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Sustainability
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Traffic
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Air Quality
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Green Space
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {cityRankings.map((city) => (
                      <tr key={city.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {city.rank}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {city.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {city.country}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-2.5 w-2.5 rounded-full ${
                              city.sustainabilityScore >= 80 ? 'bg-green-500' :
                              city.sustainabilityScore >= 60 ? 'bg-blue-500' :
                              city.sustainabilityScore >= 40 ? 'bg-yellow-500' :
                              'bg-red-500'
                            } mr-2`}></div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {city.sustainabilityScore}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {city.trafficScore}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {city.airQualityScore}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {city.greenSpaceScore}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            <div>
              {feedbackItems.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <p className="mb-2">No feedback items found matching your criteria.</p>
                  <p>Try adjusting your filters to see more results.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {feedbackItems.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex justify-between">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                          item.status === 'acknowledged' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          item.status === 'in_progress' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                          item.status === 'resolved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">
                        <span className="mr-3">
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </span>
                        <span className="mr-3">
                          {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                        </span>
                        <span>
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center text-sm">
                        <span className="flex items-center text-blue-600 dark:text-blue-400">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          {item.votes} Votes
                        </span>
                        <span className="ml-4 flex items-center text-gray-500 dark:text-gray-400">
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          {item.comments?.length || 0} Comments
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 