'use client';

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LeafletMap.css'; // Import global leaflet styles
import { useRealTimeData } from '@/contexts/RealTimeDataContext';
import styles from './Leaflet.module.css';
import { MapPin } from 'lucide-react';
import { RefreshCw } from 'lucide-react';

// Map center updater component
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

interface TrafficMapProps {
  height?: string;
}

const TrafficMap = ({ height = '500px' }: TrafficMapProps) => {
  const { trafficData, userLocation, refreshData } = useRealTimeData();
  const [congestionHotspots, setCongestionHotspots] = useState<Array<{
    id: number;
    location: string;
    lat: number;
    lng: number;
    congestionLevel: 'High' | 'Medium' | 'Low';
  }>>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.8103, 90.4125]); // Default to Dhaka
  const [lastDataTimestamp, setLastDataTimestamp] = useState<Date | null>(null);

  // Listen for data refresh events
  useEffect(() => {
    const handleDataRefresh = () => {
      console.log('🗺️ TrafficMap detected data refresh event');
      generateHotspots();
    };
    
    window.addEventListener('data-refreshed', handleDataRefresh);
    return () => window.removeEventListener('data-refreshed', handleDataRefresh);
  }, [userLocation, trafficData]);

  // Add console logs to check if data is being received
  useEffect(() => {
    console.log('🗺️ TrafficMap: userLocation changed:', userLocation);
    console.log('🗺️ TrafficMap: trafficData changed:', trafficData);
    
    if (userLocation) {
      console.log(`🗺️ Setting map center to: ${userLocation.lat}, ${userLocation.lng}`);
      setMapCenter([userLocation.lat, userLocation.lng]);
    }
    
    // Store timestamp when data was last updated
    if (trafficData && trafficData.timestamp) {
      setLastDataTimestamp(new Date(trafficData.timestamp));
    }
    
  }, [userLocation, trafficData]);

  useEffect(() => {
    // Fix for leaflet default marker icons in NextJS
    // We need to override this because Next.js build process breaks the default Leaflet icon path
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Create custom icon for markers
  const createCustomIcon = (color: string) => {
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  // Function to generate hotspots based on traffic data and location
  const generateHotspots = useCallback(() => {
    if (userLocation) {
      console.log('🗺️ Generating hotspots for:', userLocation.name);
      console.log('🗺️ Using traffic data:', trafficData);
      
      // Create some sample hotspots around the user's location
      const hour = new Date().getHours();
      const congestionFactor = trafficData?.congestionLevel || 50;
      
      // Rush hour adjustment - higher congestion during morning/evening commutes
      const timeAdjustment = 
        (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19) ? 1.3 : 
        (hour >= 10 && hour <= 15) ? 0.8 : 1.0;
      
      // Helper function to determine congestion level based on base value and adjustments
      const getCongestionLevel = (baseValue: number) => {
        const adjustedValue = baseValue * timeAdjustment * (congestionFactor / 50);
        if (adjustedValue > 70) return 'High';
        if (adjustedValue > 40) return 'Medium';
        return 'Low';
      };
      
      const hotspots = [
        {
          id: 1,
          location: `${userLocation.name} Downtown (Main Square)`,
          lat: userLocation.lat + 0.012,
          lng: userLocation.lng - 0.008,
          congestionLevel: getCongestionLevel(80) as 'High' | 'Medium' | 'Low'
        },
        {
          id: 2,
          location: `${userLocation.name} Main Highway`,
          lat: userLocation.lat - 0.01,
          lng: userLocation.lng + 0.015,
          congestionLevel: getCongestionLevel(65) as 'High' | 'Medium' | 'Low'
        },
        {
          id: 3,
          location: `${userLocation.name} Commercial Area`,
          lat: userLocation.lat + 0.008,
          lng: userLocation.lng + 0.012,
          congestionLevel: getCongestionLevel(50) as 'High' | 'Medium' | 'Low'
        },
        {
          id: 4,
          location: `${userLocation.name} University Area`,
          lat: userLocation.lat - 0.015,
          lng: userLocation.lng - 0.01,
          congestionLevel: getCongestionLevel(75) as 'High' | 'Medium' | 'Low'
        },
        {
          id: 5,
          location: `${userLocation.name} Shopping Mall Area`,
          lat: userLocation.lat + 0.005,
          lng: userLocation.lng + 0.005,
          congestionLevel: getCongestionLevel(90) as 'High' | 'Medium' | 'Low'
        },
        {
          id: 6,
          location: `${userLocation.name} Industrial Area`,
          lat: userLocation.lat - 0.012,
          lng: userLocation.lng - 0.015,
          congestionLevel: getCongestionLevel(60) as 'High' | 'Medium' | 'Low'
        },
        {
          id: 7,
          location: `${userLocation.name} Hospital Area`,
          lat: userLocation.lat - 0.002,
          lng: userLocation.lng + 0.018,
          congestionLevel: getCongestionLevel(40) as 'High' | 'Medium' | 'Low'
        },
        {
          id: 8,
          location: `${userLocation.name} Government Office Area`,
          lat: userLocation.lat + 0.018,
          lng: userLocation.lng - 0.002,
          congestionLevel: getCongestionLevel(55) as 'High' | 'Medium' | 'Low'
        },
        {
          id: 9,
          location: `${userLocation.name} Residential Area`,
          lat: userLocation.lat - 0.02,
          lng: userLocation.lng - 0.02,
          congestionLevel: getCongestionLevel(30) as 'High' | 'Medium' | 'Low'
        },
        {
          id: 10,
          location: `${userLocation.name} Bus Terminal`,
          lat: userLocation.lat + 0.022,
          lng: userLocation.lng + 0.022,
          congestionLevel: getCongestionLevel(85) as 'High' | 'Medium' | 'Low'
        }
      ];
      
      console.log('🗺️ Generated hotspots:', hotspots);
      setCongestionHotspots(hotspots);
    }
  }, [userLocation, trafficData]);

  // Generate hotspots when traffic data or location changes
  useEffect(() => {
    generateHotspots();
  }, [generateHotspots]);

  // Manual refresh button to update data
  const handleRefresh = () => {
    console.log('Manual refresh requested from map');
    if (refreshData) {
      refreshData();
    }
  };

  // Return appropriate color based on congestion level
  const getCongestionColor = (level: 'High' | 'Medium' | 'Low') => {
    switch (level) {
      case 'High':
        return '#ef4444'; // red
      case 'Medium':
        return '#f59e0b'; // amber
      case 'Low':
        return '#10b981'; // green
      default:
        return '#3b82f6'; // blue
    }
  };

  if (!userLocation) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <MapPin className="w-12 h-12 text-gray-400 mb-4" />
        <p>Select a location to view traffic information.</p>
        
        <div className="mt-4">
          <select 
            className="p-2 rounded-md bg-gray-700 text-white"
            onChange={(e) => {
              const [lat, lng, name, country] = e.target.value.split('|');
              const newLocation = {
                id: Date.now().toString(),
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                name,
                country
              };
              // Save to localStorage to trigger the context update
              localStorage.setItem('userLocation', JSON.stringify(newLocation));
              // Force a refresh
              window.dispatchEvent(new Event('storage'));
            }}
            defaultValue=""
          >
            <option value="" disabled>Select a location</option>
            <option value="23.8103|90.4125|Dhaka|Bangladesh">Dhaka, Bangladesh</option>
            <option value="22.3569|91.7832|Chittagong|Bangladesh">Chittagong, Bangladesh</option>
            <option value="24.3636|88.6241|Rajshahi|Bangladesh">Rajshahi, Bangladesh</option>
            <option value="22.8456|89.5403|Khulna|Bangladesh">Khulna, Bangladesh</option>
          </select>
        </div>
      </div>
    );
  }

  const formatTimestamp = (timestamp: Date | null) => {
    if (!timestamp) return 'Unknown Time';
    
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden" style={{ height }}>
      <div className="p-2 bg-gray-700 flex justify-between items-center">
        <div className="text-sm text-gray-300">
          <p>Location: {userLocation.name}, {userLocation.country}</p>
          {lastDataTimestamp && (
            <p className="text-xs text-gray-400">
              Last update: {formatTimestamp(lastDataTimestamp)}
            </p>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-gray-600 rounded-md transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="w-4 h-4 text-gray-300" />
          <span className="sr-only">Refresh</span>
        </button>
      </div>
      
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        style={{ height: 'calc(100% - 40px)', width: '100%' }}
        scrollWheelZoom={true}
        className={styles.mapContainer}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Map center updater */}
        <MapUpdater center={mapCenter} />
        
        {/* Main location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createCustomIcon('blue')}
          >
            <Popup>
              <div className="text-center">
                <p className="text-sm">Your current selected location</p>
                <p className="font-semibold">{userLocation.name}</p>
                <p>Traffic density: {Math.round(60 + Math.random() * 20)}%</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Congestion hotspots */}
        {congestionHotspots.map((hotspot) => (
          <CircleMarker 
            key={hotspot.id}
            center={[hotspot.lat, hotspot.lng]}
            radius={10}
            pathOptions={{ 
              fillColor: getCongestionColor(hotspot.congestionLevel), 
              color: getCongestionColor(hotspot.congestionLevel),
              fillOpacity: 0.7,
              weight: 2
            }}
          >
            <Popup>
              <div className="text-gray-800">
                <p className="font-semibold">{hotspot.location}</p>
                <p className="text-sm">Traffic density: <span className={
                  getCongestionColor(hotspot.congestionLevel) === '#ef4444' ? 'text-red-500' :
                  getCongestionColor(hotspot.congestionLevel) === '#f59e0b' ? 'text-yellow-500' : 'text-green-500'
                }>
                  {hotspot.congestionLevel}%
                </span></p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
};

export default TrafficMap; 