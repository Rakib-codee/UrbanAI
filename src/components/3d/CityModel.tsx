'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Building({ position, scale, color }: { position: [number, number, number], scale: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh position={position} ref={meshRef}>
      <boxGeometry args={scale} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Road({ start, end, width = 0.5 }: { start: [number, number, number], end: [number, number, number], width?: number }) {
  const direction = new THREE.Vector3(
    end[0] - start[0],
    end[1] - start[1],
    end[2] - start[2]
  );
  const length = direction.length();
  direction.normalize();
  
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 0, 1),
    direction
  );
  
  return (
    <mesh 
      position={[
        (start[0] + end[0]) / 2,
        (start[1] + end[1]) / 2 + 0.01,
        (start[2] + end[2]) / 2
      ]}
      quaternion={quaternion}
    >
      <boxGeometry args={[width, 0.02, length]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
  );
}

function City() {
  const buildings = [
    { position: [-5, 0, -5], scale: [1, 4, 1], color: '#4285F4' },
    { position: [-3, 0, -5], scale: [1, 2, 1], color: '#EA4335' },
    { position: [-1, 0, -5], scale: [1, 3, 1], color: '#FBBC05' },
    { position: [1, 0, -5], scale: [1, 5, 1], color: '#34A853' },
    { position: [3, 0, -5], scale: [1, 2, 1], color: '#4285F4' },
    { position: [5, 0, -5], scale: [1, 3, 1], color: '#EA4335' },
    
    { position: [-5, 0, -3], scale: [1, 2, 1], color: '#FBBC05' },
    { position: [-3, 0, -3], scale: [1, 4, 1], color: '#34A853' },
    { position: [-1, 0, -3], scale: [1, 3, 1], color: '#4285F4' },
    { position: [1, 0, -3], scale: [1, 2, 1], color: '#EA4335' },
    { position: [3, 0, -3], scale: [1, 5, 1], color: '#FBBC05' },
    { position: [5, 0, -3], scale: [1, 3, 1], color: '#34A853' },
    
    { position: [-5, 0, -1], scale: [1, 3, 1], color: '#4285F4' },
    { position: [-3, 0, -1], scale: [1, 2, 1], color: '#EA4335' },
    { position: [-1, 0, -1], scale: [1, 4, 1], color: '#FBBC05' },
    { position: [1, 0, -1], scale: [1, 3, 1], color: '#34A853' },
    { position: [3, 0, -1], scale: [1, 2, 1], color: '#4285F4' },
    { position: [5, 0, -1], scale: [1, 5, 1], color: '#EA4335' },
    
    { position: [-5, 0, 1], scale: [1, 5, 1], color: '#FBBC05' },
    { position: [-3, 0, 1], scale: [1, 3, 1], color: '#34A853' },
    { position: [-1, 0, 1], scale: [1, 2, 1], color: '#4285F4' },
    { position: [1, 0, 1], scale: [1, 4, 1], color: '#EA4335' },
    { position: [3, 0, 1], scale: [1, 3, 1], color: '#FBBC05' },
    { position: [5, 0, 1], scale: [1, 2, 1], color: '#34A853' },
    
    { position: [-5, 0, 3], scale: [1, 2, 1], color: '#4285F4' },
    { position: [-3, 0, 3], scale: [1, 5, 1], color: '#EA4335' },
    { position: [-1, 0, 3], scale: [1, 3, 1], color: '#FBBC05' },
    { position: [1, 0, 3], scale: [1, 2, 1], color: '#34A853' },
    { position: [3, 0, 3], scale: [1, 4, 1], color: '#4285F4' },
    { position: [5, 0, 3], scale: [1, 3, 1], color: '#EA4335' },
    
    { position: [-5, 0, 5], scale: [1, 3, 1], color: '#FBBC05' },
    { position: [-3, 0, 5], scale: [1, 2, 1], color: '#34A853' },
    { position: [-1, 0, 5], scale: [1, 5, 1], color: '#4285F4' },
    { position: [1, 0, 5], scale: [1, 3, 1], color: '#EA4335' },
    { position: [3, 0, 5], scale: [1, 2, 1], color: '#FBBC05' },
    { position: [5, 0, 5], scale: [1, 4, 1], color: '#34A853' },
  ];

  const roads = [
    // Horizontal roads
    { start: [-6, 0, -4], end: [6, 0, -4] },
    { start: [-6, 0, -2], end: [6, 0, -2] },
    { start: [-6, 0, 0], end: [6, 0, 0] },
    { start: [-6, 0, 2], end: [6, 0, 2] },
    { start: [-6, 0, 4], end: [6, 0, 4] },
    
    // Vertical roads
    { start: [-4, 0, -6], end: [-4, 0, 6] },
    { start: [-2, 0, -6], end: [-2, 0, 6] },
    { start: [0, 0, -6], end: [0, 0, 6] },
    { start: [2, 0, -6], end: [2, 0, 6] },
    { start: [4, 0, -6], end: [4, 0, 6] },
  ];

  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#8BC34A" />
      </mesh>
      
      {/* Buildings */}
      {buildings.map((building, index) => (
        <Building 
          key={index} 
          position={building.position as [number, number, number]} 
          scale={building.scale as [number, number, number]} 
          color={building.color} 
        />
      ))}
      
      {/* Roads */}
      {roads.map((road, index) => (
        <Road
          key={index}
          start={road.start as [number, number, number]}
          end={road.end as [number, number, number]}
        />
      ))}
    </>
  );
}

export default function CityModel() {
  return (
    <div className="w-full h-full">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[10, 10, 10]} />
        <OrbitControls enableDamping dampingFactor={0.05} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <City />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}