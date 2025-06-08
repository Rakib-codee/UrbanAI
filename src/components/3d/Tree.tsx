import React, { useMemo } from 'react';
import * as THREE from 'three';

interface TreeProps {
  position: [number, number, number];
  height: number;
  type: 'deciduous' | 'coniferous';
}

export default function Tree({ position, height, type }: TreeProps) {
  // Create tree geometry based on type
  const treeGeometry = useMemo(() => {
    const treeGroup = new THREE.Group();
    
    // Create trunk
    const trunkHeight = height * 0.4;
    const trunkRadius = height * 0.05;
    const trunkGeometry = new THREE.CylinderGeometry(trunkRadius * 0.7, trunkRadius, trunkHeight, 8);
    const trunkMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8B4513,
      roughness: 0.9
    });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = trunkHeight / 2;
    treeGroup.add(trunk);
    
    // Create foliage based on tree type
    if (type === 'deciduous') {
      // Deciduous trees have round foliage
      const foliageRadius = height * 0.3;
      const foliageGeometry = new THREE.SphereGeometry(foliageRadius, 8, 8);
      const foliageMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x228B22,
        roughness: 0.8
      });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.y = trunkHeight + foliageRadius * 0.7;
      treeGroup.add(foliage);
      
      // Add some smaller foliage clusters for more detail
      const smallerFoliageCount = 3;
      for (let i = 0; i < smallerFoliageCount; i++) {
        const smallFoliageRadius = foliageRadius * (0.6 + Math.random() * 0.3);
        const smallFoliageGeometry = new THREE.SphereGeometry(smallFoliageRadius, 8, 8);
        const smallFoliage = new THREE.Mesh(smallFoliageGeometry, foliageMaterial);
        
        // Position around the main foliage
        const angle = (i / smallerFoliageCount) * Math.PI * 2;
        const distance = foliageRadius * 0.6;
        smallFoliage.position.x = Math.cos(angle) * distance;
        smallFoliage.position.z = Math.sin(angle) * distance;
        smallFoliage.position.y = trunkHeight + foliageRadius * (0.5 + Math.random() * 0.5);
        
        treeGroup.add(smallFoliage);
      }
    } else {
      // Coniferous trees have cone-shaped foliage
      const foliageHeight = height * 0.8;
      const foliageRadius = height * 0.2;
      const foliageGeometry = new THREE.ConeGeometry(foliageRadius, foliageHeight, 8);
      const foliageMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x006400,
        roughness: 0.8
      });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.y = trunkHeight + foliageHeight / 2;
      treeGroup.add(foliage);
      
      // Add some smaller cones for more detail
      const smallerConeCount = 2;
      for (let i = 0; i < smallerConeCount; i++) {
        const smallConeHeight = foliageHeight * (0.5 + Math.random() * 0.3);
        const smallConeRadius = foliageRadius * (0.6 + Math.random() * 0.3);
        const smallConeGeometry = new THREE.ConeGeometry(smallConeRadius, smallConeHeight, 8);
        const smallCone = new THREE.Mesh(smallConeGeometry, foliageMaterial);
        
        // Position above the main cone
        smallCone.position.y = trunkHeight + foliageHeight + smallConeHeight * 0.3 * i;
        
        treeGroup.add(smallCone);
      }
    }
    
    return treeGroup;
  }, [height, type]);
  
  return (
    <primitive object={treeGeometry} position={position} />
  );
}