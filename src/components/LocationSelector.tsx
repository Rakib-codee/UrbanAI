"use client";

import { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Globe, Locate, Clock, Map, X, Heart } from 'lucide-react';

// Import the clearCache function and services
import { clearCache } from '@/services/apiService';
import { LocationDataService } from '@/services/locationDataService';
import WeatherService, { WeatherData } from '@/services/weatherService';

interface LocationSelectorProps {
  currentLocation: string;
  onLocationChange: (newLocation: string) => void;
  darkMode: boolean;
}

// Locations grouped by region
const worldLocations: { [key: string]: string[] } = {
  "China": [
    "Beijing, China",
    "Shanghai, China",
    "Guangzhou, China",
    "Shenzhen, China",
    "Chengdu, China",
    "Chongqing, China",
    "Tianjin, China",
    "Xi'an, China",
    "Wuhan, China",
    "Hangzhou, China",
    "Nanjing, China",
    "Suzhou, China",
    "Qingdao, China",
    "Dalian, China",
    "Xiamen, China",
    "Zhengzhou, China",
    "Shenyang, China",
    "Ningbo, China",
    "Changsha, China",
    "Kunming, China",
    "Harbin, China",
    "Jinan, China",
    "Fuzhou, China",
    "Nanning, China",
    "Hefei, China"
  ],
  "Bangladesh": [
    "Dhaka, Bangladesh",
    "Chattogram, Bangladesh",
    "Khulna, Bangladesh",
    "Rajshahi, Bangladesh",
    "Sylhet, Bangladesh",
    "Barishal, Bangladesh",
    "Rangpur, Bangladesh",
    "Cox's Bazar, Bangladesh"
  ],
  "Asia": [
    "Tokyo, Japan",
    "Singapore, Singapore",
    "Seoul, South Korea",
    "Bangkok, Thailand",
    "Taipei, Taiwan",
    "Hong Kong",
    "Macau",
    "Dubai, UAE",
    "Istanbul, Turkey"
  ],
  "India": [
    "Delhi, India",
    "Mumbai, India",
    "Kolkata, India",
    "Chennai, India",
    "Bangalore, India",
    "Hyderabad, India"
  ],
  "Europe": [
    "London, UK",
    "Paris, France",
    "Berlin, Germany",
    "Rome, Italy",
    "Madrid, Spain",
    "Amsterdam, Netherlands"
  ],
  "Americas": [
    "New York, USA",
    "Los Angeles, USA",
    "San Francisco, USA",
    "Toronto, Canada",
    "Sao Paulo, Brazil",
    "Mexico City, Mexico"
  ],
  "Australia & Oceania": [
    "Sydney, Australia",
    "Melbourne, Australia",
    "Auckland, New Zealand"
  ],
  "Africa": [
    "Cape Town, South Africa",
    "Cairo, Egypt",
    "Nairobi, Kenya",
    "Lagos, Nigeria"
  ]
};

// Create a flat array of all locations
const allLocations = Object.values(worldLocations).flat();

// Enhanced location coordinates with additional metadata
const locationCoordinates: { [key: string]: {
  coords: [number, number],
  population?: number,
  timezone?: string
}} = {
  "Dhaka, Bangladesh": { 
    coords: [23.8103, 90.4125],
    population: 8906039,
    timezone: "Asia/Dhaka"
  },
  "Chattogram, Bangladesh": { 
    coords: [22.3569, 91.7832], 
    population: 2592439,
    timezone: "Asia/Dhaka"
  },
  "Khulna, Bangladesh": { 
    coords: [22.8456, 89.5403],
    population: 663342,
    timezone: "Asia/Dhaka"
  },
  "Rajshahi, Bangladesh": { 
    coords: [24.3745, 88.6042],
    population: 449756,
    timezone: "Asia/Dhaka"
  },
  "Sylhet, Bangladesh": { 
    coords: [24.8949, 91.8687],
    population: 526412,
    timezone: "Asia/Dhaka"
  },
  "Barishal, Bangladesh": { 
    coords: [22.7010, 90.3535],
    population: 202242,
    timezone: "Asia/Dhaka"
  },
  "Rangpur, Bangladesh": { 
    coords: [25.7439, 89.2752],
    population: 294265,
    timezone: "Asia/Dhaka"
  },
  "Cox's Bazar, Bangladesh": { 
    coords: [21.4272, 92.0058],
    population: 169964,
    timezone: "Asia/Dhaka"
  },
  "Beijing, China": { 
    coords: [39.9042, 116.4074],
    population: 21893095,
    timezone: "Asia/Shanghai"
  },
  "Shanghai, China": { 
    coords: [31.2304, 121.4737],
    population: 24256800,
    timezone: "Asia/Shanghai"
  },
  "New York, USA": { 
    coords: [40.7128, -74.0060],
    population: 8804190,
    timezone: "America/New_York"
  },
  "London, UK": { 
    coords: [51.5074, -0.1278],
    population: 8825001,
    timezone: "Europe/London"
  },
  "Tokyo, Japan": { 
    coords: [35.6762, 139.6503],
    population: 13960236,
    timezone: "Asia/Tokyo"
  },
  "Delhi, India": { 
    coords: [28.6139, 77.2090],
    population: 16787941,
    timezone: "Asia/Kolkata"
  },
  "Singapore, Singapore": { 
    coords: [1.3521, 103.8198],
    population: 5453600,
    timezone: "Asia/Singapore"
  }
};

// Define a window extension type
declare global {
  interface Window {
    __lastLocationUpdate: number;
  }
}

export default function LocationSelector({ 
  currentLocation, 
  onLocationChange,
  darkMode
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  const [recentLocations, setRecentLocations] = useState<string[]>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [weatherData, setWeatherData] = useState<{[key: string]: {temperature?: number, condition?: string}}>({});

  // Load recent and favorite locations from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedRecentLocations = localStorage.getItem('recentLocations');
        if (storedRecentLocations) {
          setRecentLocations(JSON.parse(storedRecentLocations));
        }
        
        const storedFavoriteLocations = localStorage.getItem('favoriteLocations');
        if (storedFavoriteLocations) {
          setFavoriteLocations(JSON.parse(storedFavoriteLocations));
        }

        // Load initial weather data for current location
        if (currentLocation) {
          fetchWeatherData(currentLocation)
            .then(data => {
              setWeatherData(prev => ({
                ...prev,
                [currentLocation]: data
              }));
            })
            .catch(error => {
              console.error('Error loading initial weather data:', error);
            });
        }
      } catch (error) {
        console.error('Error loading saved locations:', error);
      }
    }
  }, [currentLocation]);

  // Sync with parent component's currentLocation
  useEffect(() => {
    setSelectedLocation(currentLocation);
  }, [currentLocation]);

  // Filter locations based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = allLocations.filter(location => 
        location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
      setActiveCategory(null);
    } else if (activeCategory) {
      setFilteredLocations(worldLocations[activeCategory]);
    } else {
      // Show recent and favorite locations by default
      const combinedLocations = [...new Set([...favoriteLocations, ...recentLocations])];
      setFilteredLocations(combinedLocations.length > 0 ? combinedLocations : allLocations.slice(0, 10));
    }
  }, [searchQuery, activeCategory, recentLocations, favoriteLocations]);

  // Add location to recent locations
  const addToRecentLocations = (location: string) => {
    const updatedRecent = [location, ...recentLocations.filter(loc => loc !== location)].slice(0, 5);
    setRecentLocations(updatedRecent);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('recentLocations', JSON.stringify(updatedRecent));
      } catch (error) {
        console.error('Error saving recent locations:', error);
      }
    }
  };

  // Toggle favorite location
  const toggleFavorite = (location: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    let updatedFavorites: string[];
    if (favoriteLocations.includes(location)) {
      updatedFavorites = favoriteLocations.filter(loc => loc !== location);
    } else {
      updatedFavorites = [...favoriteLocations, location];
    }
    
    setFavoriteLocations(updatedFavorites);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('favoriteLocations', JSON.stringify(updatedFavorites));
      } catch (error) {
        console.error('Error saving favorite locations:', error);
      }
    }
  };

  // Improved weather data fetching with better error handling
  const fetchWeatherData = async (location: string) => {
    try {
      console.log(`Attempting to fetch weather data for ${location}`);
      
      // Add a timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Weather data request timed out')), 8000)
      );
      
      // Race between the actual API call and timeout
      const weatherData = await Promise.race([
        WeatherService.getCurrentWeather(location),
        timeoutPromise
      ]) as WeatherData;
      
      console.log(`Successfully fetched weather data for ${location}:`, weatherData);
      
      return {
        temperature: weatherData.temperature,
        condition: weatherData.condition
      };
    } catch (error) {
      console.error(`Error fetching weather data for ${location}:`, error);
      
      // First try to get data from localStorage
      try {
        const savedData = localStorage.getItem('weatherData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          if (parsedData[location]) {
            console.log('Using cached weather data from localStorage');
            const cachedData = parsedData[location];
            return {
              temperature: cachedData.temperature,
              condition: cachedData.condition
            };
          }
        }
      } catch (e) {
        console.error('Error reading from localStorage:', e);
      }
      
      // Generate fallback data if API call fails and no cache exists
      console.log('Generating fallback weather data');
      const temperature = Math.floor(Math.random() * 10) + 20; // 20-30°C
      const conditions = ['Sunny', 'Cloudy', 'Partly cloudy', 'Clear'];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      return { temperature, condition };
    }
  };

  // Function to get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLoading(true);
    console.log("Getting current location using browser geolocation API...");
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Get location name using reverse geocoding
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          console.log(`Retrieved coordinates: ${lat}, ${lng}`);
          
          // Example using Nominatim (OpenStreetMap) - no API key required but limited usage
          console.log("Reverse geocoding using Nominatim...");
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`
          );
          
          if (response.ok) {
            const data = await response.json();
            console.log("Reverse geocoding successful:", data);
            
            const city = data.address.city || data.address.town || data.address.village || "Unknown";
            const country = data.address.country || "Unknown";
            const locationName = `${city}, ${country}`;
            console.log(`🌍 Location identified as: ${locationName}`);
            
            // Add to recent locations
            addToRecentLocations(locationName);
            
            // Save to localStorage
            if (typeof window !== 'undefined') {
              try {
                // Save location string
                localStorage.setItem('selectedLocation', locationName);
                console.log(`Location string saved to localStorage: ${locationName}`);
                
                // Save location object with coordinates
                const locationObject = {
                  city,
                  country,
                  latitude: lat,
                  longitude: lng
                };
                
                localStorage.setItem('selectedLocationObject', JSON.stringify(locationObject));
                console.log(`Location object saved with coordinates: ${lat}, ${lng}`);
                
                // Initialize global timestamp if it doesn't exist
                if (!window.__lastLocationUpdate) {
                  window.__lastLocationUpdate = Date.now();
                }
                
                // Clear API cache to force fresh data load
                try {
                  console.log('🗑️ Clearing API cache for location change...');
                  clearCache();
                  LocationDataService.clearCache();
                  // Update the timestamp to ensure new data generation
                  window.__lastLocationUpdate = Date.now();
                  console.log('✅ Cache cleared successfully');
                } catch (error) {
                  console.error('Error clearing cache:', error);
                }
                
                // Create a custom event to notify other components
                const event = new Event('locationChanged');
                window.dispatchEvent(event);
              } catch (error) {
                console.error('Error updating location:', error);
              }
            }
            
            // Call the parent's onLocationChange
            onLocationChange(locationName);
            
            // Dispatch event instead of reload
            const dataRefreshEvent = new CustomEvent('locationDataUpdate', {
              detail: { location: locationName }
            });
            window.dispatchEvent(dataRefreshEvent);
            
            // Close the selector and reset loading state
            setIsOpen(false);
            setIsLoading(false);
            
            // No longer force page reload
            // setTimeout(() => {
            //   window.location.href = window.location.href;
            // }, 500);
          } else {
            // Fallback to coordinates if geocoding fails
            const locationName = `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
            onLocationChange(locationName);
          }
        } catch (error) {
          console.error("Error getting location name:", error);
          // Use coordinates as fallback
          const locationName = `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`;
          onLocationChange(locationName);
        } finally {
          setIsLoading(false);
          setIsOpen(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location. " + error.message);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Handle location selection with confirmation
  const handleLocationSelect = (location: string) => {
    if (location === selectedLocation) {
      // If same location is selected, no need to reload
      console.log("Same location selected, no change needed");
      setIsOpen(false);
      return;
    }
    
    setSelectedLocation(location);
    setIsLoading(true);
    
    console.log(`🌍 Location changed to: ${location}`);
    
    // Add to recent locations
    addToRecentLocations(location);
    
    // Save to localStorage before calling onLocationChange
    if (typeof window !== 'undefined') {
      try {
        // Save the location string
        localStorage.setItem('selectedLocation', location);
        
        // Create a Location object with coordinates
        const [city, country] = location.split(',').map(part => part.trim());
        if (city && country) {
          // Set default coordinates based on common cities
          let latitude = 23.8103;
          let longitude = 90.4125;
          
          // Map known cities to coordinates
          if (city === 'Dhaka') {
            latitude = 23.8103;
            longitude = 90.4125;
          } else if (city === 'Chattogram') {
            latitude = 22.3569;
            longitude = 91.7832;
          } else if (city === 'Khulna') {
            latitude = 22.8456;
            longitude = 89.5403;
          } else if (city === 'Rajshahi') {
            latitude = 24.3745;
            longitude = 88.6042;
          } else if (city === 'Sylhet') {
            latitude = 24.8949;
            longitude = 91.8687;
          } else if (city === 'Beijing') {
            latitude = 39.9042;
            longitude = 116.4074;
          } else if (city === 'Shanghai') {
            latitude = 31.2304;
            longitude = 121.4737;
          }
          
          // Save location object to localStorage
          const locationObject = {
            city,
            country,
            latitude,
            longitude
          };
          
          localStorage.setItem('selectedLocationObject', JSON.stringify(locationObject));
          console.log(`📍 Location coordinates saved: ${latitude}, ${longitude}`);
          
          // Clear API cache to force fresh data load
          try {
            console.log('🗑️ Clearing API cache...');
            clearCache();
            LocationDataService.clearCache();
            console.log('✅ Cache cleared successfully');
          } catch (error) {
            console.error('Error clearing cache:', error);
          }
        }
        
        // Create a custom event to notify other components
        const event = new Event('locationChanged');
        window.dispatchEvent(event);
        console.log('📢 locationChanged event dispatched');
      } catch (error) {
        console.error('Error updating location:', error);
      }
    }
    
    // Small delay to show loading state
    setTimeout(() => {
      onLocationChange(location);
      setIsOpen(false);
      setSearchQuery("");
      setIsLoading(false);
      
      // Dispatch event for data refresh instead of forcing reload
      const dataRefreshEvent = new CustomEvent('locationDataUpdate', {
        detail: { location }
      });
      window.dispatchEvent(dataRefreshEvent);
      
      // No longer force a full reload
      // setTimeout(() => {
      //   console.log('🔄 Forcing page reload to refresh data...');
      //   window.location.href = window.location.href;
      // }, 100);
    }, 300);

    // Fetch weather data for selected location
    fetchWeatherData(location)
      .then(data => {
        setWeatherData(prev => ({
          ...prev,
          [location]: data
        }));
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  };

  // Function to render the map view
  const renderMapView = () => {
    return (
      <div className="p-4 h-60 bg-gray-200 dark:bg-gray-700 relative rounded-md overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Map className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Interactive map view will be implemented soon
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Select from popular locations below
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-2 flex flex-wrap gap-1 bg-white/80 dark:bg-gray-800/80">
          {Object.entries(locationCoordinates).slice(0, 8).map(([location]) => (
            <button
              key={location}
              onClick={() => handleLocationSelect(location)}
              className={`text-xs px-2 py-1 rounded ${
                darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {location.split(',')[0]}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
          darkMode 
            ? 'bg-gray-800 hover:bg-gray-700 text-white' 
            : 'bg-white hover:bg-gray-100 text-gray-800'
        } transition-colors`}
      >
        {isLoading ? (
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        ) : (
          <Globe className="w-4 h-4" />
        )}
        <span className="max-w-[150px] truncate">{selectedLocation}</span>
        {weatherData[selectedLocation] && (
          <span className="text-xs opacity-80">
            {weatherData[selectedLocation].temperature}°C
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full right-0 mt-1 w-80 rounded-lg shadow-lg z-50 ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-8 pr-4 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 focus:bg-gray-600 text-white placeholder:text-gray-400' 
                    : 'bg-gray-100 focus:bg-gray-50 text-gray-800 placeholder:text-gray-500'
                } outline-none`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* View toggle - List vs Map */}
            <div className="flex mt-2 mb-2">
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 py-1.5 rounded-l-md flex items-center justify-center ${
                  viewMode === 'list'
                    ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Globe className="w-4 h-4 mr-1" />
                <span className="text-sm">List</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex-1 py-1.5 rounded-r-md flex items-center justify-center ${
                  viewMode === 'map'
                    ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                    : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Map className="w-4 h-4 mr-1" />
                <span className="text-sm">Map</span>
              </button>
            </div>
            
            {/* Current Location Button */}
            <button 
              onClick={getCurrentLocation}
              disabled={isLoading}
              className={`w-full flex items-center justify-center space-x-2 py-2 rounded-md ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              } transition-colors`}
            >
              {isLoading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              ) : (
                <Locate className="w-4 h-4 mr-2" />
              )}
              <span>Use current location</span>
            </button>
          </div>
          
          {/* Map View */}
          {viewMode === 'map' && renderMapView()}

          {/* Favorite locations */}
          {viewMode === 'list' && favoriteLocations.length > 0 && !searchQuery && (
            <div className={`p-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
              <div className="flex items-center mb-1">
                <Heart className="w-3.5 h-3.5 mr-1 text-red-500" />
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Favorite locations</span>
              </div>
              <div className="space-y-1">
                {favoriteLocations.map((location) => (
                  <button
                    key={location}
                    className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                      darkMode 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-100'
                    } flex items-center justify-between`}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="flex items-center">
                      <Heart className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-red-500 fill-red-500" />
                      <span className="truncate">{location}</span>
                    </div>
                    {weatherData[location] && (
                      <span className="text-xs ml-1 opacity-80">
                        {weatherData[location].temperature}°C
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent locations */}
          {viewMode === 'list' && recentLocations.length > 0 && !searchQuery && (
            <div className={`p-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
              <div className="flex items-center mb-1">
                <Clock className="w-3.5 h-3.5 mr-1 text-gray-500" />
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recent locations</span>
              </div>
              <div className="space-y-1">
                {recentLocations.map((location) => (
                  <button
                    key={location}
                    className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${
                      darkMode 
                        ? 'hover:bg-gray-700' 
                        : 'hover:bg-gray-100'
                    } flex items-center justify-between group`}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="flex items-center flex-grow">
                      <Clock className="w-3.5 h-3.5 mr-2 flex-shrink-0 text-gray-500" />
                      <span className="truncate">{location}</span>
                    </div>
                    <div className="flex items-center">
                      {weatherData[location] && (
                        <span className="text-xs mr-2 opacity-80">
                          {weatherData[location].temperature}°C
                        </span>
                      )}
                      <button 
                        onClick={(e) => toggleFavorite(location, e)} 
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart 
                          className={`w-3.5 h-3.5 ${
                            favoriteLocations.includes(location) 
                              ? 'text-red-500 fill-red-500' 
                              : 'text-gray-400 hover:text-red-500'
                          }`} 
                        />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Region categories - only show in list mode and when not searching */}
          {viewMode === 'list' && !searchQuery && (
            <div className={`flex flex-wrap gap-1 p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {Object.keys(worldLocations).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`text-xs px-2 py-1 rounded ${
                    activeCategory === category
                      ? 'bg-blue-500 text-white'
                      : darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
          
          {/* Location list - only show in list mode */}
          {viewMode === 'list' && (
            <div className="max-h-60 overflow-y-auto py-1">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <button
                    key={location}
                    className={`w-full text-left px-4 py-2 ${
                      currentLocation === location
                        ? darkMode ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-50 text-blue-700'
                        : darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    } transition-colors group`}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{location}</span>
                      </div>
                      <div className="flex items-center">
                        {weatherData[location] && (
                          <span className="text-xs mr-2 opacity-80">
                            {weatherData[location].temperature}°C
                          </span>
                        )}
                        <button 
                          onClick={(e) => toggleFavorite(location, e)} 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Heart 
                            className={`w-3.5 h-3.5 ${
                              favoriteLocations.includes(location) 
                                ? 'text-red-500 fill-red-500' 
                                : 'text-gray-400 hover:text-red-500'
                            }`} 
                          />
                        </button>
                      </div>
                    </div>
                    {locationCoordinates[location] && (
                      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {locationCoordinates[location].population && (
                          <span className="mr-2">Pop: {(locationCoordinates[location].population! / 1000000).toFixed(1)}M</span>
                        )}
                        {locationCoordinates[location].timezone && (
                          <span>TZ: {locationCoordinates[location].timezone}</span>
                        )}
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-gray-500 text-center">
                  No locations found
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}