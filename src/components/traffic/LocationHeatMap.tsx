'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationHeatMapProps {
  location: {
    name: string;
    district: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  } | null;
  congestionLevel: number;
}

const HEATMAP_COLORS = [
  { threshold: 20, color: '#10b981' }, // Green for low congestion
  { threshold: 40, color: '#84cc16' }, // Lime
  { threshold: 60, color: '#eab308' }, // Yellow
  { threshold: 80, color: '#f97316' }, // Orange
  { threshold: 100, color: '#ef4444' }, // Red for high congestion
];

export default function LocationHeatMap({ location, congestionLevel }: LocationHeatMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!location || !mapContainerRef.current) return;
    
    const loadMap = async () => {
      try {
        setIsLoaded(false);
        
        // Simulate map loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, we would initialize a map library here
        // such as Leaflet, Mapbox, or Google Maps
        
        // For this demo, we'll create a simple visualization
        const mapContainer = mapContainerRef.current;
        if (!mapContainer) return; // Early return if container is null
        
        mapContainer.innerHTML = '';
        
        // Create the map container
        const mapElement = document.createElement('div');
        mapElement.className = 'relative w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden';
        
        // Create a grid of cells to represent the heatmap
        const gridSize = 20;
        const grid = document.createElement('div');
        grid.className = 'absolute inset-0 grid';
        grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
        
        // Create the heatmap with a center point of higher congestion
        const centerX = Math.floor(gridSize / 2);
        const centerY = Math.floor(gridSize / 2);
        
        for (let y = 0; y < gridSize; y++) {
          for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement('div');
            
            // Calculate distance from center (0-1 range)
            const distanceFromCenter = Math.sqrt(
              Math.pow((x - centerX) / (gridSize / 2), 2) + 
              Math.pow((y - centerY) / (gridSize / 2), 2)
            );
            
            // Generate congestion level based on distance from center and base congestion
            let cellCongestion = congestionLevel * (1 - (distanceFromCenter * 0.8));
            
            // Add some random variation
            cellCongestion += (Math.random() * 20 - 10);
            cellCongestion = Math.max(0, Math.min(100, cellCongestion));
            
            // Determine color based on congestion
            let color = HEATMAP_COLORS[0].color;
            for (const { threshold, color: thresholdColor } of HEATMAP_COLORS) {
              if (cellCongestion <= threshold) {
                color = thresholdColor;
                break;
              }
            }
            
            // Set cell color with opacity based on congestion
            cell.style.backgroundColor = color;
            cell.style.opacity = `${0.2 + (cellCongestion / 100) * 0.7}`;
            
            grid.appendChild(cell);
          }
        }
        
        // Create roads
        const horizontalRoad = document.createElement('div');
        horizontalRoad.className = 'absolute left-0 right-0 h-4 bg-gray-800 opacity-70';
        horizontalRoad.style.top = '50%';
        horizontalRoad.style.transform = 'translateY(-50%)';
        
        const verticalRoad = document.createElement('div');
        verticalRoad.className = 'absolute top-0 bottom-0 w-4 bg-gray-800 opacity-70';
        verticalRoad.style.left = '50%';
        verticalRoad.style.transform = 'translateX(-50%)';
        
        // Create a marker for the location
        const marker = document.createElement('div');
        marker.className = 'absolute z-10 flex items-center justify-center';
        marker.style.top = '50%';
        marker.style.left = '50%';
        marker.style.transform = 'translate(-50%, -50%)';
        marker.innerHTML = `<div class="text-red-500"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>`;
        
        // Create map labels
        const nameLabel = document.createElement('div');
        nameLabel.className = 'absolute bottom-4 left-4 bg-white dark:bg-gray-800 px-3 py-2 rounded shadow-md text-sm z-20';
        nameLabel.innerHTML = `
          <div class="font-medium text-gray-900 dark:text-white">${location.name}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400">${location.district}</div>
        `;
        
        // Create a legend
        const legend = document.createElement('div');
        legend.className = 'absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded shadow-md z-20';
        legend.innerHTML = `
          <div class="text-xs font-medium text-gray-900 dark:text-white mb-1">Traffic Congestion</div>
          <div class="flex items-center space-x-1">
            <div class="w-3 h-3 bg-green-500"></div>
            <div class="w-3 h-3 bg-lime-500"></div>
            <div class="w-3 h-3 bg-yellow-500"></div>
            <div class="w-3 h-3 bg-orange-500"></div>
            <div class="w-3 h-3 bg-red-500"></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Low</span>
            <span>High</span>
          </div>
        `;
        
        // Assemble the map
        mapElement.appendChild(grid);
        mapElement.appendChild(horizontalRoad);
        mapElement.appendChild(verticalRoad);
        mapElement.appendChild(marker);
        mapElement.appendChild(nameLabel);
        mapElement.appendChild(legend);
        
        mapContainer.appendChild(mapElement);
        
        setIsLoaded(true);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to load the traffic map. Please try again later.');
      }
    };
    
    loadMap();
    
    return () => {
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = '';
      }
    };
  }, [location, congestionLevel]);
  
  if (!location) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 h-64 flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Select a location to view traffic heat map</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 h-64 flex items-center justify-center">
        <div className="text-center text-red-500 dark:text-red-400">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-md font-semibold text-gray-800 dark:text-white">
          Traffic Heat Map
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Current traffic density around {location.name}
        </p>
      </div>
      
      <div className="h-64 relative" ref={mapContainerRef}>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
} 