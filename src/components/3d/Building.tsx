import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BuildingProps {
  position: [number, number, number];
  width: number;
  depth: number;
  height: number;
  color: string;
  type: 'residential' | 'commercial' | 'industrial' | 'government';
  hasLights?: boolean;
  efficiency?: number; // 0-100 energy efficiency rating
}

export default function Building({ 
  position, 
  width, 
  depth, 
  height, 
  color, 
  type, 
  hasLights = true,
  efficiency = 50 
}: BuildingProps) {
  const meshRef = useRef<THREE.Group>(null);
  const lightsRef = useRef<THREE.PointLight[]>([]);
  const windowsRef = useRef<THREE.Mesh[]>([]);
  
  // Create windows for the building
  const windows = useMemo(() => {
    const windowMeshes = [];
    const windowGeometry = new THREE.BoxGeometry(0.2, 0.3, 0.05);
    const windowMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffffcc,
      emissive: 0xffffcc,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.9
    });
    
    // Calculate number of windows based on building size
    const floorsCount = Math.floor(height / 0.8);
    const widthCount = Math.floor(width / 0.6);
    const depthCount = Math.floor(depth / 0.6);
    
    // Create windows on each side of the building
    for (let floor = 0; floor < floorsCount; floor++) {
      const y = floor * 0.8 + 0.4;
      
      // Front and back sides
      for (let w = 0; w < widthCount; w++) {
        const x = (w * 0.6) - (width / 2) + 0.3;
        
        // Front side
        const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial.clone());
        frontWindow.position.set(x, y, depth / 2);
        windowMeshes.push(frontWindow);
        
        // Back side
        const backWindow = new THREE.Mesh(windowGeometry, windowMaterial.clone());
        backWindow.position.set(x, y, -depth / 2);
        backWindow.rotation.y = Math.PI;
        windowMeshes.push(backWindow);
      }
      
      // Left and right sides
      for (let d = 0; d < depthCount; d++) {
        const z = (d * 0.6) - (depth / 2) + 0.3;
        
        // Left side
        const leftWindow = new THREE.Mesh(windowGeometry, windowMaterial.clone());
        leftWindow.position.set(-width / 2, y, z);
        leftWindow.rotation.y = Math.PI / 2;
        windowMeshes.push(leftWindow);
        
        // Right side
        const rightWindow = new THREE.Mesh(windowGeometry, windowMaterial.clone());
        rightWindow.position.set(width / 2, y, z);
        rightWindow.rotation.y = -Math.PI / 2;
        windowMeshes.push(rightWindow);
      }
    }
    
    return windowMeshes;
  }, [width, depth, height]);
  
  // Store references to window meshes
  useEffect(() => {
    windowsRef.current = windows;
  }, [windows]);
  
  // Create lights for the building
  const lights = useMemo(() => {
    if (!hasLights) return [];
    
    const buildingLights = [];
    const lightCount = Math.max(1, Math.floor((width + depth) / 2));
    
    for (let i = 0; i < lightCount; i++) {
      const light = new THREE.PointLight(0xffffcc, 0.2, 5);
      const x = (Math.random() - 0.5) * width;
      const z = (Math.random() - 0.5) * depth;
      light.position.set(x, height + 0.5, z);
      buildingLights.push(light);
    }
    
    return buildingLights;
  }, [width, depth, height, hasLights]);
  
  // Store references to lights
  useEffect(() => {
    lightsRef.current = lights;
  }, [lights]);
  
  // Animate windows and lights based on time of day
  useFrame((state) => {
    if (!hasLights) return;
    
    // Get the time of day (0-24)
    const timeOfDay = (state.clock.elapsedTime % 24) / 24 * 24;
    
    // Determine if lights should be on based on time of day
    const lightsOn = timeOfDay < 6 || timeOfDay > 18;
    
    // Update window materials
    windowsRef.current.forEach((window, index) => {
      if (window.material instanceof THREE.MeshStandardMaterial) {
        // Randomize which windows are lit
        const isLit = lightsOn && Math.random() > 0.3;
        
        // Set window emissive intensity based on whether it's lit
        window.material.emissiveIntensity = isLit ? 0.5 : 0;
      }
    });
    
    // Update building lights
    lightsRef.current.forEach(light => {
      light.intensity = lightsOn ? 0.2 : 0;
    });
  });
  
  // Get building material based on type
  const getBuildingMaterial = () => {
    switch (type) {
      case 'residential':
        return new THREE.MeshStandardMaterial({ 
          color: new THREE.Color(color),
          roughness: 0.7,
          metalness: 0.1
        });
      case 'commercial':
        return new THREE.MeshStandardMaterial({ 
          color: new THREE.Color(color),
          roughness: 0.3,
          metalness: 0.5,
          envMapIntensity: 1.5
        });
      case 'industrial':
        return new THREE.MeshStandardMaterial({ 
          color: new THREE.Color(color),
          roughness: 0.8,
          metalness: 0.6
        });
      case 'government':
        return new THREE.MeshStandardMaterial({ 
          color: new THREE.Color(color),
          roughness: 0.4,
          metalness: 0.3
        });
      default:
        return new THREE.MeshStandardMaterial({ color: new THREE.Color(color) });
    }
  };
  
  // Create roof details based on building type
  const roofDetails = useMemo(() => {
    const details = [];
    
    switch (type) {
      case 'residential':
        // Pitched roof for residential buildings
        const roofGeometry = new THREE.ConeGeometry(Math.max(width, depth) / 1.5, height / 4, 4);
        const roofMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x884422,
          roughness: 0.8
        });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.set(0, height + (height / 8), 0);
        roof.rotation.y = Math.PI / 4;
        details.push(roof);
        break;
        
      case 'commercial':
        // Antenna or satellite dish for commercial buildings
        const antennaGeometry = new THREE.CylinderGeometry(0.05, 0.05, height / 3, 8);
        const antennaMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x888888,
          metalness: 0.8,
          roughness: 0.2
        });
        const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
        antenna.position.set(width / 4, height + (height / 6), depth / 4);
        details.push(antenna);
        
        // Satellite dish
        const dishGeometry = new THREE.SphereGeometry(0.2, 8, 8, 0, Math.PI);
        const dishMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xffffff,
          metalness: 0.5,
          roughness: 0.5
        });
        const dish = new THREE.Mesh(dishGeometry, dishMaterial);
        dish.position.set(-width / 4, height + 0.2, -depth / 4);
        dish.rotation.x = Math.PI / 2;
        details.push(dish);
        break;
        
      case 'industrial':
        // Smokestacks for industrial buildings
        for (let i = 0; i < 2; i++) {
          const stackGeometry = new THREE.CylinderGeometry(0.2, 0.3, height / 2, 8);
          const stackMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x555555,
            roughness: 0.7
          });
          const stack = new THREE.Mesh(stackGeometry, stackMaterial);
          stack.position.set(
            (i === 0 ? 1 : -1) * (width / 3),
            height + (height / 4),
            (i === 0 ? 1 : -1) * (depth / 3)
          );
          details.push(stack);
        }
        break;
        
      case 'government':
        // Dome or flag for government buildings
        const domeGeometry = new THREE.SphereGeometry(width / 3, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.MeshStandardMaterial({ 
          color: 0xdddddd,
          metalness: 0.3,
          roughness: 0.6
        });
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        dome.position.set(0, height, 0);
        details.push(dome);
        
        // Flag pole
        const poleGeometry = new THREE.CylinderGeometry(0.05, 0.05, height / 2, 8);
        const poleMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x888888,
          metalness: 0.8,
          roughness: 0.2
        });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(width / 2 - 0.2, height + (height / 4), depth / 2 - 0.2);
        details.push(pole);
        break;
    }
    
    return details;
  }, [type, width, depth, height]);
  
  // Create solar panels if the building is energy efficient
  const solarPanels = useMemo(() => {
    if (efficiency < 70) return [];
    
    const panels = [];
    const panelSize = 0.4;
    const panelGeometry = new THREE.BoxGeometry(panelSize, 0.05, panelSize);
    const panelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x2244aa,
      metalness: 0.9,
      roughness: 0.3
    });
    
    // Calculate number of panels based on roof size
    const panelsPerRow = Math.floor(width / (panelSize * 1.2));
    const rows = Math.floor(depth / (panelSize * 1.2));
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < panelsPerRow; col++) {
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.set(
          (col * panelSize * 1.2) - (width / 2) + (panelSize / 2),
          height + 0.025,
          (row * panelSize * 1.2) - (depth / 2) + (panelSize / 2)
        );
        panel.rotation.x = -Math.PI / 12; // Tilt panels slightly for better sun exposure
        panels.push(panel);
      }
    }
    
    return panels;
  }, [width, depth, height, efficiency]);
  
  return (
    <group ref={meshRef} position={position}>
      {/* Main building structure */}
      <mesh position={[0, height / 2, 0]} material={getBuildingMaterial()}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>
      
      {/* Windows */}
      {windows.map((window, index) => (
        <primitive key={`window-${index}`} object={window} />
      ))}
      
      {/* Roof details */}
      {roofDetails.map((detail, index) => (
        <primitive key={`detail-${index}`} object={detail} />
      ))}
      
      {/* Solar panels */}
      {solarPanels.map((panel, index) => (
        <primitive key={`panel-${index}`} object={panel} />
      ))}
      
      {/* Building lights */}
      {lights.map((light, index) => (
        <primitive key={`light-${index}`} object={light} />
      ))}
    </group>
  );
}