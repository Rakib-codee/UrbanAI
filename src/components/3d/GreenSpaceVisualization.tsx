'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
// @ts-expect-error - OrbitControls import issue
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface GreenSpaceVisualizationProps {
  mode: string;
}

export default function GreenSpaceVisualization({ mode }: GreenSpaceVisualizationProps) {
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
    
    // Add green spaces based on mode
    const greenSpaces = [];
    
    if (mode === 'current') {
      // Current green spaces - fewer and smaller
      greenSpaces.push(createPark(-5, 0, -5, 3, 2));
      greenSpaces.push(createPark(4, 0, -3, 2, 2));
      greenSpaces.push(createPark(-2, 0, 6, 2, 1.5));
      greenSpaces.push(createForest(6, 0, 5, 2));
    } else if (mode === 'planned') {
      // Planned green spaces - more and larger
      greenSpaces.push(createPark(-5, 0, -5, 4, 3));
      greenSpaces.push(createPark(4, 0, -3, 3, 2.5));
      greenSpaces.push(createPark(-2, 0, 6, 3, 2));
      greenSpaces.push(createForest(6, 0, 5, 3));
      greenSpaces.push(createPark(0, 0, 0, 2, 2));
      greenSpaces.push(createGreenRoof(-6, 1, 2, 1.5, 1.5));
    } else if (mode === 'recommended') {
      // AI recommended - comprehensive green network
      greenSpaces.push(createPark(-5, 0, -5, 4, 3));
      greenSpaces.push(createPark(4, 0, -3, 3, 2.5));
      greenSpaces.push(createPark(-2, 0, 6, 3, 2));
      greenSpaces.push(createForest(6, 0, 5, 4));
      greenSpaces.push(createPark(0, 0, 0, 3, 3));
      greenSpaces.push(createGreenRoof(-6, 1, 2, 2, 2));
      greenSpaces.push(createGreenRoof(2, 1, -7, 1.5, 1.5));
      greenSpaces.push(createGreenRoof(-4, 1, -2, 1, 1));
      greenSpaces.push(createGreenCorridor(-8, 0, 0, 16, 1));
      greenSpaces.push(createGreenCorridor(0, 0, -8, 1, 16));
    }
    
    greenSpaces.forEach(space => scene.add(space));
    
    // Add buildings
    const buildings = [];
    
    // Create some buildings
    for (let i = 0; i < 15; i++) {
      const x = Math.random() * gridSize - gridSize / 2;
      const z = Math.random() * gridSize - gridSize / 2;
      
      // Skip if too close to green spaces
      const tooClose = greenSpaces.some(space => {
        const position = new THREE.Vector3();
        space.getWorldPosition(position);
        const distance = Math.sqrt(
          Math.pow(position.x - x, 2) + Math.pow(position.z - z, 2)
        );
        return distance < 2;
      });
      
      if (!tooClose) {
        const height = 0.5 + Math.random() * 2;
        const width = 0.5 + Math.random() * 1;
        const depth = 0.5 + Math.random() * 1;
        
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const buildingMaterial = new THREE.MeshStandardMaterial({
          color: 0x808080,
          roughness: 0.7,
        });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(x, height / 2, z);
        buildings.push(building);
        scene.add(building);
      }
    }
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
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
    
    // Clean up function
    return () => {
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [mode]);
  
  // Helper functions to create green spaces
  function createPark(x: number, y: number, z: number, width: number, depth: number) {
    const group = new THREE.Group();
    
    // Create park ground
    const parkGeometry = new THREE.PlaneGeometry(width, depth);
    const parkMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x4caf50,
      roughness: 0.8,
    });
    const park = new THREE.Mesh(parkGeometry, parkMaterial);
    park.rotation.x = -Math.PI / 2;
    park.position.set(x, y, z);
    group.add(park);
    
    // Add trees
    const treeCount = Math.floor(width * depth);
    for (let i = 0; i < treeCount; i++) {
      const treeX = x + (Math.random() - 0.5) * (width - 0.5);
      const treeZ = z + (Math.random() - 0.5) * (depth - 0.5);
      
      // Tree trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(treeX, y + 0.15, treeZ);
      
      // Tree foliage
      const foliageGeometry = new THREE.SphereGeometry(0.2, 8, 8);
      const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x2e7d32 });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.set(treeX, y + 0.4, treeZ);
      
      group.add(trunk);
      group.add(foliage);
    }
    
    return group;
  }
  
  function createForest(x: number, y: number, z: number, radius: number) {
    const group = new THREE.Group();
    
    // Create forest ground
    const forestGeometry = new THREE.CircleGeometry(radius, 32);
    const forestMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x33691e,
      roughness: 0.8,
    });
    const forest = new THREE.Mesh(forestGeometry, forestMaterial);
    forest.rotation.x = -Math.PI / 2;
    forest.position.set(x, y, z);
    group.add(forest);
    
    // Add trees
    const treeCount = Math.floor(radius * 10);
    for (let i = 0; i < treeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius * 0.9;
      const treeX = x + Math.cos(angle) * distance;
      const treeZ = z + Math.sin(angle) * distance;
      
      // Tree trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8);
      const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(treeX, y + 0.2, treeZ);
      
      // Tree foliage
      const foliageGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
      const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x1b5e20 });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.set(treeX, y + 0.55, treeZ);
      
      group.add(trunk);
      group.add(foliage);
    }
    
    return group;
  }
  
  function createGreenRoof(x: number, y: number, z: number, width: number, depth: number) {
    const group = new THREE.Group();
    
    // Create building
    const buildingGeometry = new THREE.BoxGeometry(width, 1, depth);
    const buildingMaterial = new THREE.MeshStandardMaterial({ color: 0x9e9e9e });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(x, y - 0.5, z);
    group.add(building);
    
    // Create green roof
    const roofGeometry = new THREE.PlaneGeometry(width, depth);
    const roofMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x7cb342,
      roughness: 0.8,
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.rotation.x = -Math.PI / 2;
    roof.position.set(x, y, z);
    group.add(roof);
    
    // Add small plants
    const plantCount = Math.floor(width * depth * 2);
    for (let i = 0; i < plantCount; i++) {
      const plantX = x + (Math.random() - 0.5) * (width - 0.1);
      const plantZ = z + (Math.random() - 0.5) * (depth - 0.1);
      
      const plantGeometry = new THREE.SphereGeometry(0.05, 8, 8);
      const plantMaterial = new THREE.MeshStandardMaterial({ color: 0x8bc34a });
      const plant = new THREE.Mesh(plantGeometry, plantMaterial);
      plant.position.set(plantX, y + 0.05, plantZ);
      group.add(plant);
    }
    
    return group;
  }
  
  function createGreenCorridor(x: number, y: number, z: number, width: number, depth: number) {
    const group = new THREE.Group();
    
    // Create corridor ground
    const corridorGeometry = new THREE.PlaneGeometry(width, depth);
    const corridorMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x81c784,
      roughness: 0.8,
    });
    const corridor = new THREE.Mesh(corridorGeometry, corridorMaterial);
    corridor.rotation.x = -Math.PI / 2;
    corridor.position.set(x, y, z);
    group.add(corridor);
    
    // Add trees along the corridor
    const isHorizontal = width > depth;
    const treeCount = Math.floor(isHorizontal ? width : depth) * 2;
    
    for (let i = 0; i < treeCount; i++) {
      let treeX, treeZ;
      
      if (isHorizontal) {
        treeX = x - width/2 + i * (width / treeCount) + (width / treeCount / 2);
        treeZ = z + (Math.random() - 0.5) * (depth - 0.2);
      } else {
        treeX = x + (Math.random() - 0.5) * (width - 0.2);
        treeZ = z - depth/2 + i * (depth / treeCount) + (depth / treeCount / 2);
      }
      
      // Only place trees at the edges of the corridor
      if ((isHorizontal && Math.abs(treeZ - z) > depth * 0.3) ||
          (!isHorizontal && Math.abs(treeX - x) > width * 0.3)) {
        
        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(treeX, y + 0.1, treeZ);
        
        // Tree foliage
        const foliageGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x8bc34a });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(treeX, y + 0.4, treeZ);
        
        group.add(trunk);
        group.add(foliage);
      }
    }
    
    return group;
  }

  return <div ref={containerRef} className="w-full h-full" />;
}