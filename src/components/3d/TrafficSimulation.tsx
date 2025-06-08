'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function TrafficSimulation() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a202c);
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 15, 15);
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);
    
    // Create city grid
    const gridSize = 20;
    const gridHelper = new THREE.GridHelper(gridSize, 20, 0x555555, 0x333333);
    scene.add(gridHelper);
    
    // Create ground
    const groundGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    scene.add(ground);
    
    // Create roads
    createRoads(scene);
    
    // Create buildings
    createBuildings(scene);
    
    // Create vehicles
    const vehicles = createVehicles(scene);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Update vehicle positions
      updateVehicles(vehicles);
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  function createRoads(scene: THREE.Scene) {
    // Create horizontal roads
    for (let i = -8; i <= 8; i += 4) {
      const roadGeometry = new THREE.PlaneGeometry(20, 1);
      const roadMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        roughness: 0.7,
      });
      const road = new THREE.Mesh(roadGeometry, roadMaterial);
      road.rotation.x = -Math.PI / 2;
      road.position.set(0, 0.01, i);
      scene.add(road);
      
      // Add road markings
      const markingsGeometry = new THREE.PlaneGeometry(20, 0.05);
      const markingsMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.5,
      });
      const markings = new THREE.Mesh(markingsGeometry, markingsMaterial);
      markings.rotation.x = -Math.PI / 2;
      markings.position.set(0, 0.02, i);
      scene.add(markings);
    }
    
    // Create vertical roads
    for (let i = -8; i <= 8; i += 4) {
      const roadGeometry = new THREE.PlaneGeometry(1, 20);
      const roadMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444,
        roughness: 0.7,
      });
      const road = new THREE.Mesh(roadGeometry, roadMaterial);
      road.rotation.x = -Math.PI / 2;
      road.position.set(i, 0.01, 0);
      scene.add(road);
      
      // Add road markings
      const markingsGeometry = new THREE.PlaneGeometry(0.05, 20);
      const markingsMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.5,
      });
      const markings = new THREE.Mesh(markingsGeometry, markingsMaterial);
      markings.rotation.x = -Math.PI / 2;
      markings.position.set(i, 0.02, 0);
      scene.add(markings);
    }
    
    // Create intersections
    for (let x = -8; x <= 8; x += 4) {
      for (let z = -8; z <= 8; z += 4) {
        const intersectionGeometry = new THREE.PlaneGeometry(1, 1);
        const intersectionMaterial = new THREE.MeshStandardMaterial({ 
          color: 0x444444,
          roughness: 0.7,
        });
        const intersection = new THREE.Mesh(intersectionGeometry, intersectionMaterial);
        intersection.rotation.x = -Math.PI / 2;
        intersection.position.set(x, 0.01, z);
        scene.add(intersection);
      }
    }
  }
  
  function createBuildings(scene: THREE.Scene) {
    // Create buildings in each block
    for (let x = -10; x <= 10; x += 4) {
      for (let z = -10; z <= 10; z += 4) {
        // Skip road areas
        if (Math.abs(x) % 4 < 2 || Math.abs(z) % 4 < 2) continue;
        
        const buildingCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < buildingCount; i++) {
          const width = 0.5 + Math.random() * 1;
          const height = 0.5 + Math.random() * 3;
          const depth = 0.5 + Math.random() * 1;
          
          const offsetX = (Math.random() - 0.5) * 1.5;
          const offsetZ = (Math.random() - 0.5) * 1.5;
          
          const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
          const buildingMaterial = new THREE.MeshStandardMaterial({
            color: 0x808080,
            roughness: 0.7,
          });
          const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
          building.position.set(x + offsetX, height / 2, z + offsetZ);
          scene.add(building);
          
          // Add windows
          if (height > 1) {
            const windowsMaterial = new THREE.MeshStandardMaterial({
              color: 0xffff99,
              roughness: 0.5,
              emissive: 0x555500,
              emissiveIntensity: 0.5,
            });
            
            // Front windows
            const frontWindowsGeometry = new THREE.PlaneGeometry(width * 0.8, height * 0.8);
            const frontWindows = new THREE.Mesh(frontWindowsGeometry, windowsMaterial);
            frontWindows.position.set(0, 0, depth / 2 + 0.001);
            building.add(frontWindows);
            
            // Back windows
            const backWindows = frontWindows.clone();
            backWindows.rotation.y = Math.PI;
            backWindows.position.set(0, 0, -depth / 2 - 0.001);
            building.add(backWindows);
            
            // Left windows
            const leftWindowsGeometry = new THREE.PlaneGeometry(depth * 0.8, height * 0.8);
            const leftWindows = new THREE.Mesh(leftWindowsGeometry, windowsMaterial);
            leftWindows.rotation.y = -Math.PI / 2;
            leftWindows.position.set(-width / 2 - 0.001, 0, 0);
            building.add(leftWindows);
            
            // Right windows
            const rightWindows = leftWindows.clone();
            rightWindows.rotation.y = Math.PI / 2;
            rightWindows.position.set(width / 2 + 0.001, 0, 0);
            building.add(rightWindows);
          }
        }
      }
    }
  }
  
  function createVehicles(scene: THREE.Scene) {
    const vehicles = [];
    const vehicleCount = 20;
    
    for (let i = 0; i < vehicleCount; i++) {
      // Determine if vehicle is on horizontal or vertical road
      const isHorizontal = Math.random() > 0.5;
      
      // Determine which road the vehicle is on
      const roadIndex = Math.floor(Math.random() * 5) * 4 - 8;
      
      // Create vehicle
      const vehicleGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.5);
      const vehicleColor = new THREE.Color(
        Math.random(),
        Math.random(),
        Math.random()
      );
      const vehicleMaterial = new THREE.MeshStandardMaterial({
        color: vehicleColor,
        roughness: 0.5,
      });
      const vehicle = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
      
      // Position vehicle
      if (isHorizontal) {
        vehicle.position.set(Math.random() * 20 - 10, 0.1, roadIndex);
        vehicle.rotation.y = vehicle.position.x > 0 ? Math.PI : 0;
      } else {
        vehicle.position.set(roadIndex, 0.1, Math.random() * 20 - 10);
        vehicle.rotation.y = vehicle.position.z > 0 ? Math.PI / 2 : -Math.PI / 2;
      }
      
      // Add vehicle to scene and array
      scene.add(vehicle);
      vehicles.push({
        mesh: vehicle,
        speed: 0.05 + Math.random() * 0.05,
        isHorizontal,
        direction: isHorizontal ? 
          (vehicle.position.x > 0 ? -1 : 1) : 
          (vehicle.position.z > 0 ? -1 : 1),
        road: roadIndex,
      });
    }
    
    return vehicles;
  }
  
  function updateVehicles(vehicles: any[]) {
    vehicles.forEach(vehicle => {
      if (vehicle.isHorizontal) {
        // Move horizontally
        vehicle.mesh.position.x += vehicle.speed * vehicle.direction;
        
        // Check if vehicle reached the end of the road
        if (Math.abs(vehicle.mesh.position.x) > 10) {
          vehicle.mesh.position.x = -10 * vehicle.direction;
        }
        
        // Slow down near intersections
        const nearestIntersection = Math.round(vehicle.mesh.position.x / 4) * 4;
        const distanceToIntersection = Math.abs(vehicle.mesh.position.x - nearestIntersection);
        
        if (distanceToIntersection < 1) {
          vehicle.mesh.position.x += vehicle.speed * vehicle.direction * 0.5;
        }
      } else {
        // Move vertically
        vehicle.mesh.position.z += vehicle.speed * vehicle.direction;
        
        // Check if vehicle reached the end of the road
        if (Math.abs(vehicle.mesh.position.z) > 10) {
          vehicle.mesh.position.z = -10 * vehicle.direction;
        }
        
        // Slow down near intersections
        const nearestIntersection = Math.round(vehicle.mesh.position.z / 4) * 4;
        const distanceToIntersection = Math.abs(vehicle.mesh.position.z - nearestIntersection);
        
        if (distanceToIntersection < 1) {
          vehicle.mesh.position.z += vehicle.speed * vehicle.direction * 0.5;
        }
      }
    });
  }
  
  return <div ref={containerRef} className="h-full w-full" />;
}