import React, { useMemo } from 'react';
import * as THREE from 'three';

interface RoadProps {
  position: [number, number, number];
  width: number;
  length: number;
  direction: 'horizontal' | 'vertical';
  scenario: string;
}

export default function Road({ position, width, length, direction, scenario }: RoadProps) {
  // Create road markings based on scenario
  const roadMarkings = useMemo(() => {
    const markings = [];
    
    // Road color based on scenario
    let roadColor = '#444444'; // Default dark asphalt
    
    if (scenario === 'optimized') {
      roadColor = '#505050'; // Slightly lighter for better maintained roads
    } else if (scenario === 'sustainable') {
      roadColor = '#555555'; // Even lighter for eco-friendly materials
    } else if (scenario === 'future') {
      roadColor = '#606060'; // Light colored for advanced materials
    }
    
    // Create the main road surface
    const roadGeometry = new THREE.PlaneGeometry(
      direction === 'horizontal' ? width : length,
      direction === 'horizontal' ? length : width
    );
    const roadMaterial = new THREE.MeshStandardMaterial({ 
      color: roadColor,
      roughness: scenario === 'future' ? 0.7 : 0.9
    });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    markings.push(road);
    
    // Add lane markings
    const laneMarkingMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.2
    });
    
    if (direction === 'horizontal') {
      // Center line
      const centerLineGeometry = new THREE.PlaneGeometry(width, 0.1);
      const centerLine = new THREE.Mesh(centerLineGeometry, laneMarkingMaterial);
      centerLine.rotation.x = -Math.PI / 2;
      centerLine.position.y = 0.01;
      markings.push(centerLine);
      
      // Add bike lanes for sustainable and future scenarios
      if (scenario === 'sustainable' || scenario === 'future') {
        const bikeColor = scenario === 'future' ? 0x22cc22 : 0x88aa88;
        const bikeLaneMaterial = new THREE.MeshStandardMaterial({ 
          color: bikeColor,
          roughness: 0.8
        });
        
        // Left bike lane
        const leftBikeGeometry = new THREE.PlaneGeometry(width, 0.3);
        const leftBike = new THREE.Mesh(leftBikeGeometry, bikeLaneMaterial);
        leftBike.rotation.x = -Math.PI / 2;
        leftBike.position.y = 0.005;
        leftBike.position.z = length / 2 - 0.3;
        markings.push(leftBike);
        
        // Right bike lane
        const rightBikeGeometry = new THREE.PlaneGeometry(width, 0.3);
        const rightBike = new THREE.Mesh(rightBikeGeometry, bikeLaneMaterial);
        rightBike.rotation.x = -Math.PI / 2;
        rightBike.position.y = 0.005;
        rightBike.position.z = -length / 2 + 0.3;
        markings.push(rightBike);
      }
    } else {
      // Center line
      const centerLineGeometry = new THREE.PlaneGeometry(0.1, length);
      const centerLine = new THREE.Mesh(centerLineGeometry, laneMarkingMaterial);
      centerLine.rotation.x = -Math.PI / 2;
      centerLine.position.y = 0.01;
      markings.push(centerLine);
      
      // Add bike lanes for sustainable and future scenarios
      if (scenario === 'sustainable' || scenario === 'future') {
        const bikeColor = scenario === 'future' ? 0x22cc22 : 0x88aa88;
        const bikeLaneMaterial = new THREE.MeshStandardMaterial({ 
          color: bikeColor,
          roughness: 0.8
        });
        
        // Left bike lane
        const leftBikeGeometry = new THREE.PlaneGeometry(0.3, length);
        const leftBike = new THREE.Mesh(leftBikeGeometry, bikeLaneMaterial);
        leftBike.rotation.x = -Math.PI / 2;
        leftBike.position.y = 0.005;
        leftBike.position.x = width / 2 - 0.3;
        markings.push(leftBike);
        
        // Right bike lane
        const rightBikeGeometry = new THREE.PlaneGeometry(0.3, length);
        const rightBike = new THREE.Mesh(rightBikeGeometry, bikeLaneMaterial);
        rightBike.rotation.x = -Math.PI / 2;
        rightBike.position.y = 0.005;
        rightBike.position.x = -width / 2 + 0.3;
        markings.push(rightBike);
      }
    }
    
    // Add smart road elements for future scenario
    if (scenario === 'future') {
      const sensorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x00aaff,
        emissive: 0x0066aa,
        emissiveIntensity: 0.5
      });
      
      // Add sensors along the road
      const sensorCount = direction === 'horizontal' ? Math.floor(width / 2) : Math.floor(length / 2);
      
      for (let i = 0; i < sensorCount; i++) {
        const sensorGeometry = new THREE.CircleGeometry(0.1, 8);
        const sensor = new THREE.Mesh(sensorGeometry, sensorMaterial);
        sensor.rotation.x = -Math.PI / 2;
        sensor.position.y = 0.02;
        
        if (direction === 'horizontal') {
          sensor.position.x = -width / 2 + (i + 1) * (width / (sensorCount + 1));
        } else {
          sensor.position.z = -length / 2 + (i + 1) * (length / (sensorCount + 1));
        }
        
        markings.push(sensor);
      }
    }
    
    return markings;
  }, [width, length, direction, scenario]);
  
  return (
    <group position={position}>
      {roadMarkings.map((marking, index) => (
        <primitive key={`marking-${index}`} object={marking} />
      ))}
    </group>
  );
}