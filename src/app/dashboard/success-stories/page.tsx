'use client';

import { useState } from 'react';
import { Search, Calendar, User, MapPin, Award, Building, TreePine, Zap, Leaf, MoreHorizontal, ChevronRight, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

// Define types for our data
interface Impact {
  name: string;
  value: string;
}

interface Testimonial {
  author: string;
  role: string;
  quote: string;
}

interface SuccessStory {
  id: number;
  title: string;
  category: string;
  location: string;
  date: string;
  image: string;
  icon: LucideIcon;
  description: string;
  impact: Impact[];
  before: string;
  after: string;
  testimonials: Testimonial[];
}

interface Category {
  id: string;
  name: string;
}

export default function SuccessStoriesPage() {
  // Mock darkMode and location since we don't have the actual context
  const darkMode = false;
  const location = { city: 'New York' };
  const loading = false;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
  
  // Sample categories
  const categories: Category[] = [
    { id: 'All', name: 'All Categories' },
    { id: 'Green Spaces', name: 'Green Spaces' },
    { id: 'Mobility', name: 'Mobility' },
    { id: 'Energy', name: 'Energy' },
    { id: 'Urban Planning', name: 'Urban Planning' },
    { id: 'Water Management', name: 'Water Management' }
  ];
  
  // Sample success stories
  const successStories: SuccessStory[] = [
    {
      id: 1,
      title: 'Central Park Revitalization',
      category: 'Green Spaces',
      location: 'Downtown District',
      date: '2023-08-15',
      image: '/images/success-stories/park.jpg',
      icon: TreePine,
      description: 'Transformation of an abandoned industrial site into a thriving urban park with native plant species, recreational facilities, and improved air quality.',
      impact: [
        { name: 'Air Quality Improvement', value: '+15%' },
        { name: 'Biodiversity Increase', value: '+230 species' },
        { name: 'Temperature Reduction', value: '-2.3°C in summer' },
        { name: 'Community Engagement', value: '5,000+ volunteers' }
      ],
      before: '/images/success-stories/park-before.jpg',
      after: '/images/success-stories/park-after.jpg',
      testimonials: [
        { author: 'Sarah Chen', role: 'Community Leader', quote: 'This park has transformed our neighborhood, providing a green haven in the heart of the city.' },
        { author: 'Dr. James Wilson', role: 'Urban Ecologist', quote: 'The biodiversity gains in just one year have exceeded our expectations. A model for urban rewilding.' }
      ]
    },
    {
      id: 2,
      title: 'Smart Transit System Implementation',
      category: 'Mobility',
      location: 'Citywide',
      date: '2023-05-22',
      image: '/images/success-stories/transit.jpg',
      icon: Zap,
      description: 'Deployment of AI-powered traffic management and public transit optimization, reducing congestion and emissions while improving commute times.',
      impact: [
        { name: 'Traffic Congestion', value: '-28%' },
        { name: 'Average Commute Time', value: '-12 minutes' },
        { name: 'Carbon Emissions', value: '-32,000 tons/year' },
        { name: 'Public Transit Ridership', value: '+45%' }
      ],
      before: '/images/success-stories/transit-before.jpg',
      after: '/images/success-stories/transit-after.jpg',
      testimonials: [
        { author: 'Michael Rodriguez', role: 'City Transit Director', quote: 'The smart transit system has revolutionized how people move through our city.' },
        { author: 'Lisa Johnson', role: 'Daily Commuter', quote: 'My commute time has been cut in half, and I\'ve switched from driving to using public transit.' }
      ]
    },
    {
      id: 3,
      title: 'Renewable Energy Microgrid',
      category: 'Energy',
      location: 'Eastern District',
      date: '2023-11-10',
      image: '/images/success-stories/energy.jpg',
      icon: Zap,
      description: 'Implementation of a solar-powered microgrid serving 5,000 homes and businesses, providing clean energy and improved grid resilience.',
      impact: [
        { name: 'Renewable Energy Generation', value: '12.5 MW' },
        { name: 'Carbon Emissions Reduction', value: '-18,000 tons/year' },
        { name: 'Energy Cost Savings', value: '-22% for residents' },
        { name: 'Blackout Duration', value: '-95% during storms' }
      ],
      before: '/images/success-stories/energy-before.jpg',
      after: '/images/success-stories/energy-after.jpg',
      testimonials: [
        { author: 'Dr. Emily Chen', role: 'Energy Policy Advisor', quote: 'This project demonstrates how urban areas can transition to renewable energy while improving reliability.' },
        { author: 'Robert Kim', role: 'Local Business Owner', quote: 'Our energy costs have decreased significantly, and we haven\'t experienced a power outage since the microgrid was installed.' }
      ]
    },
    {
      id: 4,
      title: 'Urban Watershed Restoration',
      category: 'Water Management',
      location: 'River District',
      date: '2023-02-28',
      image: '/images/success-stories/water.jpg',
      icon: Leaf,
      description: 'Comprehensive restoration of urban waterways and implementation of green infrastructure for stormwater management and flood prevention.',
      impact: [
        { name: 'Flood Risk Reduction', value: '-65% in vulnerable areas' },
        { name: 'Water Quality Improvement', value: '+42% in clarity' },
        { name: 'Stormwater Captured', value: '15.2 million gallons/year' },
        { name: 'Ecosystem Restoration', value: '18 km of riverbank' }
      ],
      before: '/images/success-stories/water-before.jpg',
      after: '/images/success-stories/water-after.jpg',
      testimonials: [
        { author: 'Thomas Parker', role: 'Environmental Engineer', quote: 'The watershed restoration has transformed our relationship with the river, turning it from a liability to an asset.' },
        { author: 'Maria Gonzalez', role: 'Riverside Resident', quote: 'We used to fear heavy rains, but now our neighborhood stays dry and we enjoy the beautiful riverside park.' }
      ]
    },
    {
      id: 5,
      title: 'Mixed-Use Development Project',
      category: 'Urban Planning',
      location: 'North Quarter',
      date: '2023-07-05',
      image: '/images/success-stories/building.jpg',
      icon: Building,
      description: 'Transformation of an abandoned shopping mall into a vibrant mixed-use community with affordable housing, retail, and office space.',
      impact: [
        { name: 'New Housing Units', value: '420 (35% affordable)' },
        { name: 'New Jobs Created', value: '850+' },
        { name: 'Walkability Score', value: 'From 45 to 92' },
        { name: 'Tax Revenue Increase', value: '+$3.2 million/year' }
      ],
      before: '/images/success-stories/building-before.jpg',
      after: '/images/success-stories/building-after.jpg',
      testimonials: [
        { author: 'Jennifer Wu', role: 'Urban Planner', quote: 'This project exemplifies how thoughtful redevelopment can address housing, economic, and environmental needs simultaneously.' },
        { author: 'David Thompson', role: 'Local Resident', quote: 'I can now walk to work, grocery stores, and restaurants. The community feel is incredible.' }
      ]
    },
    {
      id: 6,
      title: 'Community Garden Network',
      category: 'Green Spaces',
      location: 'Multiple Districts',
      date: '2023-09-30',
      image: '/images/success-stories/garden.jpg',
      icon: Leaf,
      description: 'Creation of a network of 25 community gardens on vacant lots, providing food security, community cohesion, and green space.',
      impact: [
        { name: 'Fresh Produce Grown', value: '15,000 kg/year' },
        { name: 'Food Desert Reduction', value: '-28% in affected areas' },
        { name: 'Community Participation', value: '1,200+ gardeners' },
        { name: 'Impervious Surface Reduction', value: '3.5 hectares' }
      ],
      before: '/images/success-stories/garden-before.jpg',
      after: '/images/success-stories/garden-after.jpg',
      testimonials: [
        { author: 'Grace Lee', role: 'Community Garden Coordinator', quote: 'The garden network has become the heart of our communities, bringing people together while addressing food insecurity.' },
        { author: 'Carlos Mendez', role: 'Urban Nutrition Specialist', quote: 'We\'ve seen tangible health improvements in neighborhoods with active community gardens.' }
      ]
    }
  ];
  
  // Filter stories based on search query and category
  const filteredStories = successStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        story.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || story.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get story details when one is selected
  const handleStoryClick = (story: SuccessStory) => {
    setSelectedStory(story);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Get color for category badge
  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Green Spaces': return 'bg-green-100 text-green-800';
      case 'Mobility': return 'bg-blue-100 text-blue-800';
      case 'Energy': return 'bg-amber-100 text-amber-800';
      case 'Urban Planning': return 'bg-purple-100 text-purple-800';
      case 'Water Management': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
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
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1">Success Stories</h1>
              <p className="text-gray-500 dark:text-gray-400">Showcasing successful urban development projects in {location?.city || 'your city'}</p>
            </div>
            
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className={`relative flex-grow ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-3 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                  } border`}
                  placeholder="Search success stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      selectedCategory === category.id 
                        ? 'bg-blue-600 text-white' 
                        : darkMode 
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Selected Story Detail View */}
            {selectedStory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-12 p-6 rounded-xl shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <button 
                    onClick={() => setSelectedStory(null)}
                    className={`px-3 py-1 rounded-lg text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    ← Back to Stories
                  </button>
                  
                  <div className="flex gap-2">
                    <button className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                      <Share2 size={16} />
                    </button>
                    <button className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-2/3">
                    <h2 className="text-2xl font-bold mb-2">{selectedStory.title}</h2>
                    
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${getCategoryColor(selectedStory.category)}`}>
                        {selectedStory.category}
                      </span>
                      <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <MapPin size={14} className="mr-1" />
                        {selectedStory.location}
                      </span>
                      <span className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(selectedStory.date)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {selectedStory.description}
                    </p>
                    
                    {/* Before and After */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">Before & After</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                            {/* In a real app, this would be an actual image */}
                            <p className="text-sm">Before Image</p>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Before implementation</p>
                        </div>
                        <div>
                          <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg mb-2 flex items-center justify-center">
                            {/* In a real app, this would be an actual image */}
                            <p className="text-sm">After Image</p>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">After implementation</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Testimonials */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Testimonials</h3>
                      <div className="space-y-4">
                        {selectedStory.testimonials.map((testimonial, index) => (
                          <div 
                            key={index} 
                            className={`p-4 rounded-lg border-l-4 border-blue-500 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}
                          >
                            <p className="italic text-gray-600 dark:text-gray-300 mb-3">&ldquo;{testimonial.quote}&rdquo;</p>
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-blue-200'} flex items-center justify-center`}>
                                <User size={16} className="text-blue-600 dark:text-blue-300" />
                              </div>
                              <div className="ml-3">
                                <p className="font-medium">{testimonial.author}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/3">
                    {/* Main Image */}
                    <div className="mb-6">
                      <div className="aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        {/* In a real app, this would be an actual image */}
                        <selectedStory.icon size={48} className="text-gray-500 dark:text-gray-400" />
                      </div>
                    </div>
                    
                    {/* Impact Metrics */}
                    <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-blue-50'} mb-6`}>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Award size={18} className="mr-2 text-blue-500" />
                        Key Impacts
                      </h3>
                      <div className="space-y-4">
                        {selectedStory.impact.map((item, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                            <span className="font-semibold text-blue-600 dark:text-blue-300">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Related Stories */}
                    <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <h3 className="text-lg font-semibold mb-4">Related Projects</h3>
                      <div className="space-y-3">
                        {successStories
                          .filter(story => 
                            story.category === selectedStory.category && 
                            story.id !== selectedStory.id
                          )
                          .slice(0, 2)
                          .map(story => (
                            <button
                              key={story.id}
                              onClick={() => handleStoryClick(story)}
                              className={`w-full text-left p-3 rounded-lg flex items-center ${
                                darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-full ${
                                story.category === 'Green Spaces' ? 'bg-green-100' :
                                story.category === 'Mobility' ? 'bg-blue-100' :
                                story.category === 'Energy' ? 'bg-amber-100' :
                                story.category === 'Urban Planning' ? 'bg-purple-100' :
                                'bg-cyan-100'
                              } flex items-center justify-center mr-3`}>
                                <story.icon size={18} className={
                                  story.category === 'Green Spaces' ? 'text-green-600' :
                                  story.category === 'Mobility' ? 'text-blue-600' :
                                  story.category === 'Energy' ? 'text-amber-600' :
                                  story.category === 'Urban Planning' ? 'text-purple-600' :
                                  'text-cyan-600'
                                } />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{story.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{story.location}</p>
                              </div>
                              <ChevronRight size={16} className="text-gray-400" />
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Stories Grid */}
            {!selectedStory && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStories.map((story) => (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-xl shadow-sm overflow-hidden cursor-pointer ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                    onClick={() => handleStoryClick(story)}
                  >
                    {/* Image Area - In a real app, use actual images */}
                    <div className="aspect-video bg-gray-300 dark:bg-gray-700 relative flex items-center justify-center">
                      <story.icon size={40} className="text-gray-500 dark:text-gray-400" />
                      <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs ${getCategoryColor(story.category)}`}>
                        {story.category}
                      </span>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-2">{story.title}</h3>
                      <div className="flex space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {story.location}
                        </span>
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(story.date)}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-4">
                        {story.description}
                      </p>
                      
                      {/* Impact Highlights */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {story.impact.slice(0, 2).map((impact, idx) => (
                          <div key={idx} className="text-sm">
                            <p className="text-gray-500 dark:text-gray-400">{impact.name}</p>
                            <p className="font-semibold">{impact.value}</p>
                          </div>
                        ))}
                      </div>
                      
                      <button className="w-full py-2 text-center text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center justify-center">
                        View Project Details
                        <ChevronRight size={16} className="ml-1" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                
                {filteredStories.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-16">
                    <Search size={48} className="text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No stories found</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      Try adjusting your search or filter criteria
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
} 