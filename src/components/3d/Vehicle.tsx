import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Preload all models
useGLTF.preload('/models/car.glb');
useGLTF.preload('/models/bus.glb');
useGLTF.preload('/models/truck.glb');
useGLTF.preload('/models/bicycle.glb');

interface VehicleProps {
  position: [number, number, number];
  color: string;
  speed: number;
  direction: 'north' | 'south' | 'east' | 'west';
  type: 'car' | 'bus' | 'truck' | 'bicycle';
}

export default function Vehicle({ position, color, speed, direction, type }: VehicleProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pathRef = useRef<THREE.Vector3[]>([]);
  const pathIndexRef = useRef(0);
  
  // Load the appropriate 3D model based on vehicle type
  const { scene } = useGLTF(
    type === 'car' ? '/models/car.glb' : 
    type === 'bus' ? '/models/bus.glb' : 
    type === 'truck' ? '/models/truck.glb' : 
    '/models/bicycle.glb'
  );
  
  // Clone the model to avoid reference issues
  const model = scene.clone();
  
  // Set the color of the vehicle
  useEffect(() => {
    model.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // Apply color to the main body parts only
        if (child.name.includes('body') || child.name.includes('main')) {
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            metalness: 0.6,
            roughness: 0.2,
          });
        }
      }
    });
  }, [model, color]);
  
  // Set up the path for the vehicle to follow
  useEffect(() => {
    // Create a path based on the direction
    const createPath = () => {
      const path: THREE.Vector3[] = [];
      
      // Starting position
      const [x, y, z] = position;
      
      // Create a path based on direction
      if (direction === 'north') {
        for (let i = 0; i < 100; i++) {
          path.push(new THREE.Vector3(x, y, z - i * 0.5));
        }
      } else if (direction === 'south') {
        for (let i = 0; i < 100; i++) {
          path.push(new THREE.Vector3(x, y, z + i * 0.5));
        }
      } else if (direction === 'east') {
        for (let i = 0; i < 100; i++) {
          path.push(new THREE.Vector3(x + i * 0.5, y, z));
        }
      } else if (direction === 'west') {
        for (let i = 0; i < 100; i++) {
          path.push(new THREE.Vector3(x - i * 0.5, y, z));
        }
      }
      
      return path;
    };
    
    pathRef.current = createPath();
  }, [position, direction]);
  
  // Set the initial rotation based on direction
  useEffect(() => {
    if (!meshRef.current) return;
    
    if (direction === 'north') {
      meshRef.current.rotation.y = Math.PI;
    } else if (direction === 'south') {
      meshRef.current.rotation.y = 0;
    } else if (direction === 'east') {
      meshRef.current.rotation.y = Math.PI * 1.5;
    } else if (direction === 'west') {
      meshRef.current.rotation.y = Math.PI * 0.5;
    }
  }, [direction]);
  
  // Animate the vehicle along the path
  useFrame((_, delta) => {
    if (!meshRef.current || pathRef.current.length === 0) return;
    
    // Move along the path
    pathIndexRef.current += speed * delta;
    
    // Loop back to the beginning when reaching the end
    if (pathIndexRef.current >= pathRef.current.length - 1) {
      pathIndexRef.current = 0;
    }
    
    // Get the current position on the path
    const currentIndex = Math.floor(pathIndexRef.current);
    const nextIndex = (currentIndex + 1) % pathRef.current.length;
    
    // Interpolate between current and next position
    const t = pathIndexRef.current - currentIndex;
    const currentPos = pathRef.current[currentIndex];
    const nextPos = pathRef.current[nextIndex];
    
    // Update position
    meshRef.current.position.lerpVectors(currentPos, nextPos, t);
    
    // Add a slight bobbing motion for realism
    meshRef.current.position.y = position[1] + Math.sin(pathIndexRef.current * 0.5) * 0.02;
  });
  
  return (
    <group ref={meshRef} position={position} scale={[0.01, 0.01, 0.01]}>
      <primitive object={model} />
    </group>
  );
}