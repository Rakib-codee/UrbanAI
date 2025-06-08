'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface TrafficMap3DProps {
  city: string;
  congestionLevel: number;
}

export default function TrafficMap3D({ city, congestionLevel }: TrafficMap3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    try {
      // Create scene
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x111827); // Dark background
      
      // Camera
      const camera = new THREE.PerspectiveCamera(
        75, 
        containerRef.current.clientWidth / containerRef.current.clientHeight, 
        0.1, 
        1000
      );
      camera.position.set(15, 15, 15);
      
      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      containerRef.current.appendChild(renderer.domElement);
      
      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      
      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(10, 20, 15);
      scene.add(directionalLight);
      
      // Ground plane
      const groundGeometry = new THREE.PlaneGeometry(50, 50, 10, 10);
      const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        wireframe: false,
        roughness: 0.8,
      });
      const ground = new THREE.Mesh(groundGeometry, groundMaterial);
      ground.rotation.x = -Math.PI / 2;
      scene.add(ground);
      
      // Grid helper
      const gridHelper = new THREE.GridHelper(50, 50, 0x555555, 0x333333);
      scene.add(gridHelper);
      
      // City-specific layouts
      const buildingConfigs: { [key: string]: { buildings: number, maxHeight: number } } = {
        'Shanghai': { buildings: 100, maxHeight: 10 },
        'Beijing': { buildings: 90, maxHeight: 8 },
        'Guangzhou': { buildings: 80, maxHeight: 7 },
        'Shenzhen': { buildings: 85, maxHeight: 9 },
        'Chengdu': { buildings: 70, maxHeight: 6 }
      };
      
      const config = buildingConfigs[city] || { buildings: 75, maxHeight: 6 };
      
      // Create buildings
      const buildings: THREE.Mesh[] = [];
      const buildingGroup = new THREE.Group();
      
      for (let i = 0; i < config.buildings; i++) {
        const width = 0.5 + Math.random() * 2;
        const height = 0.5 + Math.random() * config.maxHeight;
        const depth = 0.5 + Math.random() * 2;
        
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        
        // Color based on height (taller buildings = more "important")
        const normalizedHeight = height / config.maxHeight;
        const colorHue = 0.6 - normalizedHeight * 0.6; // Blue to red gradient in HSL
        const buildingMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color().setHSL(colorHue, 0.8, 0.5),
          roughness: 0.7,
          metalness: 0.2
        });
        
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        
        // Position buildings in a grid-like pattern with some randomness
        const gridSize = Math.sqrt(config.buildings) * 1.5;
        const gridX = (Math.random() * 2 - 1) * gridSize;
        const gridZ = (Math.random() * 2 - 1) * gridSize;
        
        building.position.set(gridX, height / 2, gridZ);
        buildings.push(building);
        buildingGroup.position.y = 0.01; // Slightly above ground
        buildingGroup.add(building);
      }
      
      scene.add(buildingGroup);
      
      // Create roads
      const roadGroup = new THREE.Group();
      
      // Main roads
      const mainRoadCount = 5 + Math.floor(Math.random() * 3);
      for (let i = 0; i < mainRoadCount; i++) {
        const roadGeometry = new THREE.PlaneGeometry(50, 0.5);
        const roadMaterial = new THREE.MeshStandardMaterial({
          color: 0x333333,
          roughness: 0.9
        });
        
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        
        // Position roads
        const offset = (i - mainRoadCount / 2) * (50 / mainRoadCount);
        road.position.set(0, 0.02, offset); // Slightly above ground
        roadGroup.add(road);
        
        // Crossing roads
        const crossingRoad = new THREE.Mesh(roadGeometry, roadMaterial);
        crossingRoad.rotation.x = -Math.PI / 2;
        crossingRoad.rotation.z = Math.PI / 2;
        crossingRoad.position.set(offset, 0.02, 0);
        roadGroup.add(crossingRoad);
      }
      
      scene.add(roadGroup);
      
      // Traffic visualization
      const trafficGroup = new THREE.Group();
      const vehicleCount = 100 + Math.floor(congestionLevel * 2);
      const vehicles: THREE.Mesh[] = [];
      
      for (let i = 0; i < vehicleCount; i++) {
        // Vehicle size varies slightly
        const width = 0.2 + Math.random() * 0.1;
        const height = 0.1 + Math.random() * 0.1;
        const depth = 0.3 + Math.random() * 0.2;
        
        const vehicleGeometry = new THREE.BoxGeometry(width, height, depth);
        
        // Color based on congestion level
        // Higher congestion = more red vehicles
        let vehicleColor;
        if (Math.random() < congestionLevel / 100) {
          // Red vehicles for congested areas
          vehicleColor = new THREE.Color(0xff3b30);
        } else {
          // Normal vehicles with various colors
          const colors = [0x007aff, 0x34c759, 0xff9500, 0xffcc00, 0x5856d6];
          vehicleColor = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
        }
        
        const vehicleMaterial = new THREE.MeshStandardMaterial({
          color: vehicleColor,
          roughness: 0.5,
          metalness: 0.7
        });
        
        const vehicle = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
        
        // Position vehicles on roads
        const onMainRoad = Math.random() > 0.5;
        const roadIndex = Math.floor(Math.random() * mainRoadCount);
        const roadOffset = (roadIndex - mainRoadCount / 2) * (50 / mainRoadCount);
        
        if (onMainRoad) {
          const xPos = Math.random() * 49 - 24.5;
          vehicle.position.set(xPos, 0.15, roadOffset);
          vehicle.rotation.y = Math.PI / 2;
        } else {
          const zPos = Math.random() * 49 - 24.5;
          vehicle.position.set(roadOffset, 0.15, zPos);
        }
        
        vehicles.push(vehicle);
        trafficGroup.add(vehicle);
      }
      
      scene.add(trafficGroup);
      
      // Animation
      const animateVehicles = () => {
        vehicles.forEach((vehicle) => {
          // Speed based on congestion (higher congestion = slower movement)
          const speed = 0.05 * (1 - congestionLevel / 150); // Scale speed inversely with congestion
          
          // Determine direction based on rotation
          if (Math.abs(vehicle.rotation.y) > 0.1) {
            // Moving along X-axis
            vehicle.position.x += speed;
            
            // Wrap around when reaching edge
            if (vehicle.position.x > 25) {
              vehicle.position.x = -25;
            }
          } else {
            // Moving along Z-axis
            vehicle.position.z += speed;
            
            // Wrap around when reaching edge
            if (vehicle.position.z > 25) {
              vehicle.position.z = -25;
            }
          }
        });
      };
      
      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        // Update vehicles
        animateVehicles();
        
        // Update controls
        controls.update();
        
        // Render scene
        renderer.render(scene, camera);
      };
      
      // Start animation
      animate();
      
      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current) return;
        
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Set loaded state
      setIsLoaded(true);
      
      // Cleanup on unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        if (containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        
        // Dispose of geometries and materials
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            
            if (object.material instanceof THREE.Material) {
              object.material.dispose();
            } else if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            }
          }
        });
      };
    } catch (error) {
      console.error('Error initializing 3D visualization:', error);
      setErrorMessage('Failed to initialize 3D visualization. Please check if your browser supports WebGL.');
      setIsLoaded(false);
    }
  }, [city, congestionLevel]);
  
  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <div className="text-red-500 mb-2">⚠️ Error</div>
        <div className="text-center text-gray-700 dark:text-gray-300">{errorMessage}</div>
      </div>
    );
  }
  
  return (
    <div ref={containerRef} className="w-full h-full relative">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
} 