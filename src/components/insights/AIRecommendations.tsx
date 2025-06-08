import { useState, useEffect } from 'react';
import { AIRecommendation } from '@/services/AIInsightsService';

interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
  isLoading?: boolean;
  error?: Error | null;
}

export default function AIRecommendations({
  recommendations,
  isLoading = false,
  error = null
}: AIRecommendationsProps) {
  // Filter recommendations by category
  const [filter, setFilter] = useState<string>('all');
  const [filteredRecommendations, setFilteredRecommendations] = useState<AIRecommendation[]>(recommendations);
  
  // Apply filter when recommendations change
  useEffect(() => {
    if (filter === 'all') {
      setFilteredRecommendations(recommendations);
    } else {
      setFilteredRecommendations(
        recommendations.filter(rec => rec.category === filter)
      );
    }
  }, [recommendations, filter]);
  
  // Get impact color based on impact level
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-500 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'medium':
        return 'text-yellow-500 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
      case 'low':
        return 'text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      default:
        return 'text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
    }
  };
  
  // Get category label based on category
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'traffic':
        return 'Traffic';
      case 'air-quality':
        return 'Air Quality';
      case 'resource':
        return 'Resource Management';
      default:
        return 'General';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">AI Recommendations</h2>
        
        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('traffic')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'traffic' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Traffic
          </button>
          <button
            onClick={() => setFilter('air-quality')}
            className={`px-3 py-1 text-sm rounded-full ${
              filter === 'air-quality' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Air Quality
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64 text-red-500">
          <p>Error loading recommendations. Please try again.</p>
        </div>
      ) : filteredRecommendations.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-gray-500">
          <p>No recommendations available for the selected filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRecommendations.map(recommendation => (
            <div 
              key={recommendation.id} 
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                  {recommendation.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getImpactColor(recommendation.impact)}`}>
                  {recommendation.impact.charAt(0).toUpperCase() + recommendation.impact.slice(1)} Impact
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {recommendation.description}
              </p>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Category: {getCategoryLabel(recommendation.category)}
                </span>
                
                <button 
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                >
                  Take Action
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 