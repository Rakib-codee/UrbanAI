import { getCurrentLocation } from './apiService';

export interface CityRanking {
  id: string;
  name: string;
  country: string;
  sustainabilityScore: number;
  trafficScore: number;
  airQualityScore: number;
  greenSpaceScore: number;
  energyScore: number;
  waterScore: number;
  wasteScore: number;
  trend: 'up' | 'down' | 'stable';
  rank: number;
  previousRank: number;
  lastUpdated: string;
}

export interface CityRankingFilter {
  continent?: string;
  country?: string;
  population?: 'small' | 'medium' | 'large' | 'megacity';
  sortBy?: 'rank' | 'sustainabilityScore' | 'trafficScore' | 'airQualityScore' | 'greenSpaceScore';
  order?: 'asc' | 'desc';
}

export interface FeedbackItem {
  id: string;
  type: 'issue' | 'suggestion' | 'question';
  category: 'traffic' | 'environment' | 'infrastructure' | 'safety' | 'general';
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  mediaUrls?: string[];
  status: 'pending' | 'acknowledged' | 'in_progress' | 'resolved' | 'closed';
  votes: number;
  hasVoted?: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  userName?: string;
  comments?: FeedbackComment[];
}

export interface FeedbackComment {
  id: string;
  content: string;
  createdAt: string;
  userId?: string;
  userName?: string;
  isOfficial?: boolean;
}

/**
 * Fetch city rankings data with optional filtering
 */
export async function fetchCityRankings(
  filters: CityRankingFilter = {}
): Promise<CityRanking[]> {
  // In a real implementation, this would call a backend API
  // For demo purposes, we're generating rankings data
  
  // Wait for a small delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate rankings for major cities
  const rankings: CityRanking[] = [
    {
      id: 'copenhagen',
      name: 'Copenhagen',
      country: 'Denmark',
      sustainabilityScore: 92,
      trafficScore: 90,
      airQualityScore: 94,
      greenSpaceScore: 91,
      energyScore: 95,
      waterScore: 93,
      wasteScore: 89,
      trend: 'up',
      rank: 1,
      previousRank: 2,
      lastUpdated: '2023-11-15'
    },
    {
      id: 'stockholm',
      name: 'Stockholm',
      country: 'Sweden',
      sustainabilityScore: 90,
      trafficScore: 88,
      airQualityScore: 92,
      greenSpaceScore: 94,
      energyScore: 91,
      waterScore: 96,
      wasteScore: 88,
      trend: 'up',
      rank: 2,
      previousRank: 3,
      lastUpdated: '2023-11-15'
    },
    {
      id: 'oslo',
      name: 'Oslo',
      country: 'Norway',
      sustainabilityScore: 89,
      trafficScore: 86,
      airQualityScore: 93,
      greenSpaceScore: 90,
      energyScore: 97,
      waterScore: 95,
      wasteScore: 84,
      trend: 'up',
      rank: 3,
      previousRank: 4,
      lastUpdated: '2023-11-15'
    },
    {
      id: 'amsterdam',
      name: 'Amsterdam',
      country: 'Netherlands',
      sustainabilityScore: 88,
      trafficScore: 87,
      airQualityScore: 85,
      greenSpaceScore: 88,
      energyScore: 89,
      waterScore: 91,
      wasteScore: 90,
      trend: 'up',
      rank: 4,
      previousRank: 5,
      lastUpdated: '2023-11-15'
    },
    {
      id: 'singapore',
      name: 'Singapore',
      country: 'Singapore',
      sustainabilityScore: 87,
      trafficScore: 92,
      airQualityScore: 84,
      greenSpaceScore: 85,
      energyScore: 86,
      waterScore: 90,
      wasteScore: 91,
      trend: 'up',
      rank: 5,
      previousRank: 7,
      lastUpdated: '2023-11-15'
    },
    {
      id: 'zurich',
      name: 'Zurich',
      country: 'Switzerland',
      sustainabilityScore: 86,
      trafficScore: 85,
      airQualityScore: 90,
      greenSpaceScore: 84,
      energyScore: 88,
      waterScore: 92,
      wasteScore: 85,
      trend: 'down',
      rank: 6,
      previousRank: 1,
      lastUpdated: '2023-11-15'
    },
    {
      id: 'london',
      name: 'London',
      country: 'United Kingdom',
      sustainabilityScore: 82,
      trafficScore: 76,
      airQualityScore: 79,
      greenSpaceScore: 85,
      energyScore: 84,
      waterScore: 87,
      wasteScore: 83,
      trend: 'stable',
      rank: 7,
      previousRank: 7,
      lastUpdated: '2023-11-15'
    },
    {
      id: 'berlin',
      name: 'Berlin',
      country: 'Germany',
      sustainabilityScore: 81,
      trafficScore: 80,
      airQualityScore: 82,
      greenSpaceScore: 86,
      energyScore: 80,
      waterScore: 83,
      wasteScore: 82,
      trend: 'up',
      rank: 8,
      previousRank: 10,
      lastUpdated: '2023-11-15'
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      country: 'Japan',
      sustainabilityScore: 80,
      trafficScore: 84,
      airQualityScore: 78,
      greenSpaceScore: 72,
      energyScore: 85,
      waterScore: 86,
      wasteScore: 80,
      trend: 'stable',
      rank: 9,
      previousRank: 9,
      lastUpdated: '2023-11-15'
    },
    {
      id: 'seoul',
      name: 'Seoul',
      country: 'South Korea',
      sustainabilityScore: 79,
      trafficScore: 82,
      airQualityScore: 75,
      greenSpaceScore: 76,
      energyScore: 84,
      waterScore: 80,
      wasteScore: 81,
      trend: 'up',
      rank: 10,
      previousRank: 12,
      lastUpdated: '2023-11-15'
    },
    {
      id: 'new-york',
      name: 'New York',
      country: 'United States',
      sustainabilityScore: 78,
      trafficScore: 70,
      airQualityScore: 76,
      greenSpaceScore: 80,
      energyScore: 81,
      waterScore: 84,
      wasteScore: 79,
      trend: 'stable',
      rank: 11,
      previousRank: 11,
      lastUpdated: '2023-11-15'
    },
    {
      id: 'paris',
      name: 'Paris',
      country: 'France',
      sustainabilityScore: 77,
      trafficScore: 72,
      airQualityScore: 74,
      greenSpaceScore: 75,
      energyScore: 80,
      waterScore: 82,
      wasteScore: 78,
      trend: 'down',
      rank: 12,
      previousRank: 8,
      lastUpdated: '2023-11-15'
    },
    {
      id: 'vancouver',
      name: 'Vancouver',
      country: 'Canada',
      sustainabilityScore: 76,
      trafficScore: 75,
      airQualityScore: 85,
      greenSpaceScore: 87,
      energyScore: 78,
      waterScore: 88,
      wasteScore: 76,
      trend: 'stable',
      rank: 13,
      previousRank: 13,
      lastUpdated: '2023-11-15'
    },
    {
      id: 'sydney',
      name: 'Sydney',
      country: 'Australia',
      sustainabilityScore: 75,
      trafficScore: 73,
      airQualityScore: 83,
      greenSpaceScore: 82,
      energyScore: 74,
      waterScore: 78,
      wasteScore: 75,
      trend: 'down',
      rank: 14,
      previousRank: 12,
      lastUpdated: '2023-11-15'
    },
    {
      id: 'dhaka',
      name: 'Dhaka',
      country: 'Bangladesh',
      sustainabilityScore: 45,
      trafficScore: 25,
      airQualityScore: 30,
      greenSpaceScore: 40,
      energyScore: 50,
      waterScore: 45,
      wasteScore: 35,
      trend: 'up',
      rank: 85,
      previousRank: 92,
      lastUpdated: '2023-11-15'
    }
  ];
  
  // Apply filters
  let filteredRankings = [...rankings];
  
  if (filters.country) {
    filteredRankings = filteredRankings.filter(
      city => city.country.toLowerCase() === filters.country?.toLowerCase()
    );
  }
  
  if (filters.continent) {
    // For demo, we're not implementing continent filtering
    // But in a real implementation, we would have continent data
  }
  
  // Apply sorting
  const sortBy = filters.sortBy || 'rank';
  const order = filters.order || 'asc';
  
  filteredRankings.sort((a, b) => {
    const aValue = a[sortBy as keyof CityRanking];
    const bValue = b[sortBy as keyof CityRanking];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });
  
  return filteredRankings;
}

/**
 * Get the ranking data for a specific city
 */
export async function getCityRankingDetail(cityId: string): Promise<CityRanking | null> {
  const allRankings = await fetchCityRankings();
  return allRankings.find(city => city.id === cityId) || null;
}

/**
 * Get rankings for the current user's city and nearby cities
 */
export async function getLocalCityRankings(): Promise<CityRanking[]> {
  const location = getCurrentLocation();
  const allRankings = await fetchCityRankings();
  
  // Find the user's city in rankings
  const userCity = allRankings.find(
    city => city.name.toLowerCase() === location.city.toLowerCase()
  );
  
  if (!userCity) {
    // If user's city is not found, return top 5
    return allRankings.slice(0, 5);
  }
  
  // Find cities with similar ranks (5 above and 5 below)
  const userRank = userCity.rank;
  return allRankings.filter(
    city => Math.abs(city.rank - userRank) <= 5
  ).sort((a, b) => a.rank - b.rank);
}

/**
 * Submit user feedback
 */
export async function submitFeedback(feedback: Omit<FeedbackItem, 'id' | 'createdAt' | 'updatedAt' | 'votes' | 'status' | 'comments'>): Promise<FeedbackItem> {
  // In a real implementation, this would call a backend API
  // For demo purposes, we're just returning a mock response
  
  // Wait for a small delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const now = new Date().toISOString();
  
  // Create a new feedback item
  const newFeedback: FeedbackItem = {
    id: `feedback-${Date.now()}`,
    ...feedback,
    votes: 0,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
    comments: []
  };
  
  return newFeedback;
}

/**
 * Fetch feedback items, with optional filtering
 */
export async function fetchFeedbackItems(
  options: {
    city?: string;
    category?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<{ items: FeedbackItem[]; total: number }> {
  // In a real implementation, this would call a backend API
  // For demo purposes, we're generating feedback data
  
  // Wait for a small delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate some mock feedback items
  const mockFeedback: FeedbackItem[] = [
    {
      id: 'feedback-1',
      type: 'issue',
      category: 'traffic',
      title: 'Heavy traffic congestion on Main Street',
      description: 'There has been increasing traffic congestion on Main Street between 5-7 PM on weekdays. Traffic lights timing might need adjustment.',
      location: {
        latitude: 23.8103,
        longitude: 90.4125,
        address: 'Main Street & 5th Avenue'
      },
      status: 'acknowledged',
      votes: 45,
      createdAt: '2023-10-15T10:30:00Z',
      updatedAt: '2023-10-16T14:20:00Z',
      userName: 'Citizen123',
      comments: [
        {
          id: 'comment-1',
          content: "I've noticed this too, it's getting worse each week.",
          createdAt: '2023-10-15T14:30:00Z',
          userName: 'CommutePro'
        },
        {
          id: 'comment-2',
          content: 'We are aware of this issue and are currently analyzing traffic patterns. We plan to adjust signal timing next week.',
          createdAt: '2023-10-16T14:20:00Z',
          userName: 'TrafficDepartment',
          isOfficial: true
        }
      ]
    },
    {
      id: 'feedback-2',
      type: 'suggestion',
      category: 'environment',
      title: 'Add more recycling bins in Central Park',
      description: 'Central Park could benefit from more recycling bins, especially near the eastern entrance. Currently, there are only general waste bins which discourages recycling.',
      location: {
        latitude: 23.8203,
        longitude: 90.4225,
        address: 'Central Park, East Entrance'
      },
      status: 'in_progress',
      votes: 32,
      createdAt: '2023-10-10T08:15:00Z',
      updatedAt: '2023-10-14T11:05:00Z',
      userName: 'GreenCityAdvocate',
      comments: [
        {
          id: 'comment-3',
          content: 'Great suggestion! This would help reduce waste going to landfills.',
          createdAt: '2023-10-11T16:45:00Z',
          userName: 'EcoFriend22'
        },
        {
          id: 'comment-4',
          content: 'We have ordered 15 new recycling bins to be installed throughout Central Park. Installation will begin next Monday.',
          createdAt: '2023-10-14T11:05:00Z',
          userName: 'Parks Department',
          isOfficial: true
        }
      ]
    },
    {
      id: 'feedback-3',
      type: 'issue',
      category: 'infrastructure',
      title: 'Pothole on Riverside Drive',
      description: "There's a large pothole on Riverside Drive near the intersection with Oak Street. It's a hazard for cyclists and has caused damage to vehicles.",
      location: {
        latitude: 23.7998,
        longitude: 90.4050,
        address: 'Riverside Drive & Oak Street'
      },
      status: 'resolved',
      votes: 28,
      createdAt: '2023-09-28T15:40:00Z',
      updatedAt: '2023-10-05T09:30:00Z',
      userName: 'DailyCommuter',
      comments: [
        {
          id: 'comment-5',
          content: "I've reported this three times already! Please fix it!",
          createdAt: '2023-09-29T07:20:00Z',
          userName: 'FrustratedDriver'
        },
        {
          id: 'comment-6',
          content: 'The pothole has been repaired as of this morning. Thank you for your patience.',
          createdAt: '2023-10-05T09:30:00Z',
          userName: 'Public Works',
          isOfficial: true
        }
      ]
    },
    {
      id: 'feedback-4',
      type: 'question',
      category: 'general',
      title: 'When will the new bus route 42 be operational?',
      description: "I've heard that a new bus route 42 is being planned to connect the eastern suburbs. When will this service begin operations?",
      location: {
        latitude: 23.8300,
        longitude: 90.4350,
        address: 'Eastern District'
      },
      status: 'pending',
      votes: 15,
      createdAt: '2023-10-17T11:25:00Z',
      updatedAt: '2023-10-17T11:25:00Z',
      userName: 'TransitUser'
    },
    {
      id: 'feedback-5',
      type: 'suggestion',
      category: 'safety',
      title: 'Add pedestrian crossing at Market Square',
      description: 'Market Square has become very busy and there is no safe way for pedestrians to cross the street. A zebra crossing or traffic light would improve safety.',
      location: {
        latitude: 23.8050,
        longitude: 90.4180,
        address: 'Market Square'
      },
      status: 'acknowledged',
      votes: 51,
      createdAt: '2023-10-05T13:10:00Z',
      updatedAt: '2023-10-12T16:40:00Z',
      userName: 'SafetyFirst',
      comments: [
        {
          id: 'comment-7',
          content: "This is definitely needed. I've seen several near-accidents there.",
          createdAt: '2023-10-06T10:35:00Z',
          userName: 'ConcernedParent'
        },
        {
          id: 'comment-8',
          content: 'Thank you for this suggestion. We are conducting a safety assessment and will include this location in our review.',
          createdAt: '2023-10-12T16:40:00Z',
          userName: 'Traffic Safety Office',
          isOfficial: true
        }
      ]
    }
  ];
  
  // Apply filters
  let filteredFeedback = [...mockFeedback];
  
  if (options.category) {
    filteredFeedback = filteredFeedback.filter(
      item => item.category === options.category
    );
  }
  
  if (options.status) {
    filteredFeedback = filteredFeedback.filter(
      item => item.status === options.status
    );
  }
  
  // Apply pagination
  const limit = options.limit || 10;
  const offset = options.offset || 0;
  const paginatedFeedback = filteredFeedback.slice(offset, offset + limit);
  
  return {
    items: paginatedFeedback,
    total: filteredFeedback.length
  };
}

/**
 * Vote on a feedback item
 */
export async function voteFeedback(feedbackId: string, vote: 'up' | 'down'): Promise<FeedbackItem> {
  // In a real implementation, this would call a backend API
  // For demo purposes, we're just returning a mock response
  
  // Wait for a small delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get the feedback data
  const { items } = await fetchFeedbackItems();
  const feedback = items.find(item => item.id === feedbackId);
  
  if (!feedback) {
    throw new Error('Feedback not found');
  }
  
  // Update votes
  const updatedFeedback = {
    ...feedback,
    votes: vote === 'up' ? feedback.votes + 1 : Math.max(0, feedback.votes - 1),
    hasVoted: true
  };
  
  return updatedFeedback;
}

/**
 * Add a comment to a feedback item
 */
export async function addComment(
  feedbackId: string,
  content: string,
  userName: string
): Promise<FeedbackComment> {
  // In a real implementation, this would call a backend API
  // For demo purposes, we're just returning a mock response
  
  // Wait for a small delay to simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newComment: FeedbackComment = {
    id: `comment-${Date.now()}`,
    content,
    userName,
    createdAt: new Date().toISOString(),
    isOfficial: false
  };
  
  return newComment;
}

export const SocialService = {
  fetchCityRankings,
  getCityRankingDetail,
  getLocalCityRankings,
  submitFeedback,
  fetchFeedbackItems,
  voteFeedback,
  addComment
};

export default SocialService; 