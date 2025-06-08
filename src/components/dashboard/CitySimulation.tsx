import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Sky } from '@react-three/drei';
import { motion } from 'framer-motion';
import CityGrid from '../3d/CityGrid';

interface CitySimulationProps {
  scenario: string;
  timeOfDay: 'day' | 'night' | 'sunset';
  weatherCondition: 'clear' | 'cloudy' | 'rainy';
  density: number;
  size: number;
}

export default function CitySimulation({ 
  scenario, 
  timeOfDay, 
  weatherCondition,
  density = 0.8,
  size = 5
}: CitySimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Get sky parameters based on time of day
  const getSkyParams = () => {
    switch (timeOfDay) {
      case 'day':
        return { sunPosition: [1, 2, 3] as [number, number, number], turbidity: 10, rayleigh: 0.5 };
      case 'night':
        return { sunPosition: [1, -2, -5] as [number, number, number], turbidity: 10, rayleigh: 0.5 };
      case 'sunset':
        return { sunPosition: [10, 0.5, 2] as [number, number, number], turbidity: 10, rayleigh: 2 };
      default:
        return { sunPosition: [1, 2, 3] as [number, number, number], turbidity: 10, rayleigh: 0.5 };
    }
  };
  
  // Get environment parameters based on weather condition
  const getEnvironment = () => {
    const getPreset = () => {
      switch (weatherCondition) {
        case 'clear':
          return 'city' as const;
        case 'cloudy':
          return 'dawn' as const;
        case 'rainy':
          return 'night' as const;
        default:
          return 'city' as const;
      }
    };
    
    return { preset: getPreset() };
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-[500px] rounded-lg overflow-hidden bg-gray-900"
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-white">Loading city simulation...</p>
          </div>
        </div>
      ) : (
        <>
          <Canvas ref={canvasRef} shadows camera={{ position: [20, 20, 20], fov: 50 }}>
            {/* Sky and environment */}
            <Sky {...getSkyParams()} />
            <Environment {...getEnvironment()} />
            
            {/* Lighting */}
            <ambientLight intensity={timeOfDay === 'night' ? 0.2 : 0.5} />
            <directionalLight 
              position={timeOfDay === 'night' ? [-5, 5, -5] : [5, 10, 5]} 
              intensity={timeOfDay === 'night' ? 0.1 : 1} 
              castShadow 
            />
            
            {/* City grid */}
            <CityGrid scenario={scenario} size={size} density={density} />
            
            {/* Controls */}
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={5}
              maxDistance={50}
              minPolarAngle={0}
              maxPolarAngle={Math.PI / 2.5}
            />
          </Canvas>
          
          {/* Overlay controls */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button className="bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="bg-gray-800 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}