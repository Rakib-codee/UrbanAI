import { useState, useEffect } from 'react';
import { 
  FeedbackItem, 
  fetchFeedbackItems, 
  submitFeedback, 
  voteFeedback, 
  addComment 
} from '@/services/SocialService';
import { getCurrentLocation } from '@/services/apiService';
import { 
  MessageSquare, 
  ThumbsUp, 
  AlertCircle, 
  Lightbulb, 
  HelpCircle, 
  Clock, 
  CheckCircle, 
  Filter, 
  Plus, 
  Send 
} from 'lucide-react';

export default function FeedbackSystem() {
  // States for feedback data
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // States for filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for new feedback form
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    type: 'issue',
    category: 'traffic',
    title: '',
    description: '',
    location: {
      latitude: 0,
      longitude: 0,
      address: ''
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  // States for commenting
  const [commentText, setCommentText] = useState('');
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  // Get location for new feedback
  useEffect(() => {
    const location = getCurrentLocation();
    setNewFeedback(prev => ({
      ...prev,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address || `${location.city}, ${location.country}`
      }
    }));
  }, []);
  
  // Fetch feedback items
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        
        // Prepare filter options
        const options: Record<string, string | number> = {
          limit: 10,
          offset: 0
        };
        
        if (selectedCategory !== 'all') {
          options.category = selectedCategory;
        }
        
        if (selectedStatus !== 'all') {
          options.status = selectedStatus;
        }
        
        // Fetch data
        const { items, total } = await fetchFeedbackItems(options);
        setFeedbackItems(items);
        setTotalItems(total);
        setError(null);
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeedback();
  }, [selectedCategory, selectedStatus]);
  
  // Filter feedback items by search term
  const filteredFeedbackItems = searchTerm
    ? feedbackItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : feedbackItems;
  
  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle nested location object
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setNewFeedback(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value
        }
      }));
    } else {
      setNewFeedback(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Submit new feedback
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Validate form
      if (!newFeedback.title || !newFeedback.description) {
        throw new Error('Please fill out all required fields');
      }
      
      // Submit feedback
      const response = await submitFeedback({
        ...newFeedback,
        // Get user info from localStorage or session
        userName: localStorage.getItem('userName') || 'Anonymous Citizen'
      });
      
      // Update state with new feedback
      setFeedbackItems(prev => [response, ...prev]);
      setTotalItems(prev => prev + 1);
      
      // Reset form
      setNewFeedback({
        type: 'issue',
        category: 'traffic',
        title: '',
        description: '',
        location: {
          ...newFeedback.location
        }
      });
      
      // Show success message and hide form
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowFeedbackForm(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle voting on feedback
  const handleVote = async (feedbackId: string, voteType: 'up' | 'down') => {
    try {
      const updatedFeedback = await voteFeedback(feedbackId, voteType);
      
      // Update feedback item in state
      setFeedbackItems(prev =>
        prev.map(item =>
          item.id === feedbackId ? updatedFeedback : item
        )
      );
    } catch (err) {
      console.error('Error voting on feedback:', err);
    }
  };
  
  // Handle commenting on feedback
  const handleAddComment = async (feedbackId: string) => {
    if (!commentText.trim()) return;
    
    try {
      setIsSubmittingComment(true);
      
      const newComment = await addComment(
        feedbackId,
        commentText,
        localStorage.getItem('userName') || 'Anonymous Citizen'
      );
      
      // Update feedback item in state
      setFeedbackItems(prev =>
        prev.map(item => {
          if (item.id === feedbackId) {
            return {
              ...item,
              comments: [...(item.comments || []), newComment]
            };
          }
          return item;
        })
      );
      
      // Reset comment state
      setCommentText('');
      setCommentingOn(null);
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  // Get icon based on feedback type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'issue':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'suggestion':
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case 'question':
        return <HelpCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
    }
  };
  
  // Get status badge based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <Clock className="inline-block h-3 w-3 mr-1" />
            Pending
          </span>
        );
      case 'acknowledged':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <CheckCircle className="inline-block h-3 w-3 mr-1" />
            Acknowledged
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
            <Clock className="inline-block h-3 w-3 mr-1" />
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle className="inline-block h-3 w-3 mr-1" />
            Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            <CheckCircle className="inline-block h-3 w-3 mr-1" />
            Closed
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Community Feedback
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Report issues, share suggestions, or ask questions about your city.
          </p>
        </div>
        
        <button
          onClick={() => setShowFeedbackForm(!showFeedbackForm)}
          className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Submit Feedback
        </button>
      </div>
      
      {/* New feedback form */}
      {showFeedbackForm && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Submit New Feedback
          </h3>
          
          {submitSuccess ? (
            <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
              <p className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Your feedback has been submitted successfully!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitFeedback}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Feedback Type*
                  </label>
                  <select
                    name="type"
                    value={newFeedback.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    required
                  >
                    <option value="issue">Report an Issue</option>
                    <option value="suggestion">Make a Suggestion</option>
                    <option value="question">Ask a Question</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category*
                  </label>
                  <select
                    name="category"
                    value={newFeedback.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    required
                  >
                    <option value="traffic">Traffic</option>
                    <option value="environment">Environment</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="safety">Safety</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title*
                </label>
                <input
                  type="text"
                  name="title"
                  value={newFeedback.title}
                  onChange={handleInputChange}
                  placeholder="Brief title describing the issue or suggestion"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description*
                </label>
                <textarea
                  name="description"
                  value={newFeedback.description}
                  onChange={handleInputChange}
                  placeholder="Provide details about your feedback..."
                  rows={4}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location.address"
                  value={newFeedback.location.address}
                  onChange={handleInputChange}
                  placeholder="Address or location description"
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFeedbackForm(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-md transition-colors ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit Feedback'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 flex flex-wrap items-center gap-2">
        <div className="flex items-center mr-4">
          <Filter className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-700 dark:text-gray-300">Filter:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            All Categories
          </button>
          <button
            onClick={() => setSelectedCategory('traffic')}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedCategory === 'traffic'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Traffic
          </button>
          <button
            onClick={() => setSelectedCategory('environment')}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedCategory === 'environment'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Environment
          </button>
          <button
            onClick={() => setSelectedCategory('infrastructure')}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedCategory === 'infrastructure'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Infrastructure
          </button>
          <button
            onClick={() => setSelectedCategory('safety')}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedCategory === 'safety'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Safety
          </button>
        </div>
        
        <div className="flex items-center ml-auto">
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
          />
        </div>
      </div>
      
      {/* Feedback list */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500 text-center">
            <p>Error loading feedback. Please try again.</p>
          </div>
        ) : filteredFeedbackItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <p className="mb-2">No feedback items found.</p>
            <p>Be the first to submit feedback about your city!</p>
          </div>
        ) : (
          filteredFeedbackItems.map(item => (
            <div key={item.id} className="p-4">
              <div className="flex items-start">
                <div className="mt-1 mr-3">
                  {getTypeIcon(item.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {item.title}
                    </h3>
                    {getStatusBadge(item.status)}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="mr-4">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                    <span className="mr-4">
                      By: {item.userName || 'Anonymous'}
                    </span>
                    <span>
                      Location: {item.location.address || 'Not specified'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleVote(item.id, 'up')}
                      className={`flex items-center text-sm ${
                        item.hasVoted
                          ? 'text-blue-500 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
                      }`}
                      disabled={item.hasVoted}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {item.votes} {item.votes === 1 ? 'Vote' : 'Votes'}
                    </button>
                    
                    <button
                      onClick={() => setCommentingOn(commentingOn === item.id ? null : item.id)}
                      className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {item.comments?.length || 0} {(item.comments?.length || 0) === 1 ? 'Comment' : 'Comments'}
                    </button>
                  </div>
                  
                  {/* Comments section */}
                  {item.comments && item.comments.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
                      {item.comments.map(comment => (
                        <div key={comment.id} className="text-sm">
                          <div className="flex items-start">
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <span className={`font-medium ${
                                  comment.isOfficial
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {comment.userName || 'Anonymous'}
                                  {comment.isOfficial && ' (Official)'}
                                </span>
                                <span className="mx-2 text-gray-400">•</span>
                                <span className="text-gray-500 dark:text-gray-400 text-xs">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300">
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Comment form */}
                  {commentingOn === item.id && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md py-2 px-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                        />
                        <button
                          onClick={() => handleAddComment(item.id)}
                          disabled={!commentText.trim() || isSubmittingComment}
                          className={`px-3 py-2 rounded-r-md bg-blue-500 text-white ${
                            !commentText.trim() || isSubmittingComment
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-blue-600'
                          }`}
                        >
                          {isSubmittingComment ? (
                            <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="p-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>All feedback is public. Please avoid sharing personal information.</p>
      </div>
    </div>
  );
} 