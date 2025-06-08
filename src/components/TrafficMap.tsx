import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useRealTimeData } from '@/contexts/RealTimeDataContext';
import { TrafficData } from '@/services/realTimeData';

// Fix Leaflet marker icon issue
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

// Custom traffic icons
const trafficIcons = {
  low: new L.Icon({
    iconUrl: '/icons/traffic-light-green.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  medium: new L.Icon({
    iconUrl: '/icons/traffic-light-yellow.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  high: new L.Icon({
    iconUrl: '/icons/traffic-light-red.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
};

const TrafficMap = () => {
  const { trafficData, userLocation } = useRealTimeData();
  const [mapKey, setMapKey] = useState(0);
  
  // Fallback traffic data when real data is not available
  const fallbackTrafficData: TrafficData = useMemo(() => ({
    location: userLocation ? `${userLocation.name}` : 'Unknown',
    congestionLevel: 45 + Math.random() * 20,
    incidentCount: Math.floor(Math.random() * 4),
    averageSpeed: 35 - (Math.random() * 10),
    timestamp: new Date(),
  }), [userLocation]);
  
  // Get actual data or fallback
  const actualTrafficData = trafficData || fallbackTrafficData;
  
  // Force map re-render when data changes
  useEffect(() => {
    setMapKey(prev => prev + 1);
  }, [trafficData, userLocation]);

  // Default center is Dhaka
  const defaultCenter = { lat: 23.8103, lng: 90.4125 };
  const center = userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : defaultCenter;
  
  // Generate traffic hotspots around the center
  const hotspots = useMemo(() => {
    if (!center) return [];
    
    const congestionLevel = actualTrafficData?.congestionLevel || 50;
    
    // Generate more hotspots for higher congestion levels
    const spotCount = Math.max(4, Math.round(congestionLevel / 20) + 2);
    
    return Array.from({ length: spotCount }).map((_, i) => {
      // Distance from center, 0.01-0.05 degrees
      const distance = 0.01 + (Math.random() * 0.04);
      // Random angle
      const angle = Math.random() * Math.PI * 2;
      
      // Calculate position
      const lat = center.lat + (distance * Math.cos(angle));
      const lng = center.lng + (distance * Math.sin(angle));
      
      // Traffic level varies with base congestion but with randomness
      const baseSeverity = congestionLevel / 100;
      let severity = baseSeverity + (Math.random() * 0.4 - 0.2);
      severity = Math.max(0.1, Math.min(0.9, severity));
      
      // Calculate congestion level (0-100)
      const spotCongestion = Math.round(severity * 100);
      
      // Determine traffic level category
      let level = 'low';
      if (spotCongestion > 70) level = 'high';
      else if (spotCongestion > 40) level = 'medium';
      
      // Calculate average speed based on congestion
      const avgSpeed = Math.round(Math.max(5, 60 - (spotCongestion * 0.5)));
      
      // Determine location name
      let locationName = '';
      
      // Location names in English for different areas
      if (i === 0) locationName = 'Shahbag Mor';
      else if (i === 1) locationName = 'Farmgate';
      else if (i === 2) locationName = 'Mirpur 10';
      else if (i === 3) locationName = 'Gulshan 1';
      else if (i === 4) locationName = 'Uttara Sector 4';
      else if (i === 5) locationName = 'Mohammadpur';
      else if (i === 6) locationName = 'Motijheel';
      else if (i === 7) locationName = 'Banani';
      else if (i === 8) locationName = 'Ramna';
      else locationName = `Traffic Point ${i+1}`;
      
      return {
        id: i + 1,
        lat,
        lng,
        level,
        congestion: spotCongestion,
        incidents: Math.floor(Math.random() < 0.3 ? Math.random() * 3 + 1 : 0),
        avgSpeed,
        locationName,
      };
    });
  }, [center, actualTrafficData]);

  // Calculate circle radius based on congestion
  const getCircleRadius = (congestion: number) => {
    // Base radius in meters
    return 300 + (congestion * 5);
  };

  // Get circle color based on traffic level
  const getCircleColor = (level: string) => {
    if (level === 'high') return 'red';
    if (level === 'medium') return 'yellow';
    return 'green';
  };
  
  // Check if data is available
  if (!center) {
    return <div className="h-[400px] flex items-center justify-center bg-gray-800 rounded-lg">
      <p className="text-gray-400">Loading location data...</p>
    </div>;
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <MapContainer
        key={mapKey}
        center={[center.lat, center.lng]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* City center marker */}
        <Marker position={[center.lat, center.lng]}>
          <Popup>
            <div className="text-center">
              <h3 className="font-semibold">{userLocation?.name || 'Dhaka'}</h3>
              <p className="text-xs">Center of the map</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Traffic hotspots */}
        {hotspots.map((spot) => (
          <div key={spot.id}>
            <Marker 
              position={[spot.lat, spot.lng]} 
              icon={trafficIcons[spot.level as keyof typeof trafficIcons]}
            >
              <Popup>
                <div className="space-y-1">
                  <div className="font-semibold">{spot.locationName}</div>
                  <div>Traffic congestion: {spot.congestion}%</div>
                  <div>Average speed: {spot.avgSpeed} km/h</div>
                  {spot.incidents > 0 && (
                    <div className="text-red-500 font-semibold">Incidents: {spot.incidents}</div>
                  )}
                </div>
              </Popup>
            </Marker>
            
            <Circle 
              center={[spot.lat, spot.lng]} 
              radius={getCircleRadius(spot.congestion)}
              pathOptions={{
                color: getCircleColor(spot.level),
                fillColor: getCircleColor(spot.level),
                fillOpacity: 0.2,
              }}
            />
          </div>
        ))}
      </MapContainer>
      
      <div className="px-4 py-2 bg-gray-900 text-xs text-gray-400 flex justify-between">
        <div>Traffic data updated: {new Date(actualTrafficData?.timestamp || Date.now()).toLocaleTimeString()}</div>
        <div>
          <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span> Low congestion
          <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mx-1 ml-2"></span> Medium congestion
          <span className="inline-block w-3 h-3 rounded-full bg-red-500 mx-1 ml-2"></span> High congestion
        </div>
      </div>
    </div>
  );
};

export default TrafficMap; 