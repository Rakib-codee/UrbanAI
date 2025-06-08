'use client';

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Sky } from '@react-three/drei';
import * as THREE from 'three';

// Vehicle component with movement
function Vehicle({ position, color, speed, direction, type = 'car' }: { 
  position: [number, number, number], 
  color: string, 
  speed: number,
  direction: [number, number, number],
  type?: 'car' | 'bus' | 'truck'
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const dirVector = new THREE.Vector3(...direction).normalize();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Move vehicle along its direction
      meshRef.current.position.x += dirVector.x * speed * delta;
      meshRef.current.position.z += dirVector.z * speed * delta;
      
      // Rotate to face direction of travel
      meshRef.current.rotation.y = Math.atan2(dirVector.x, dirVector.z);
      
      // Reset position if it goes out of bounds
      if (Math.abs(meshRef.current.position.x) > 15 || Math.abs(meshRef.current.position.z) > 15) {
        meshRef.current.position.set(
          -dirVector.x * 15,
          position[1],
          -dirVector.z * 15
        );
      }
    }
  });

  // Different vehicle types
  if (type === 'bus') {
    return (
      <group position={position} ref={meshRef}>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[0.28, 0.2, 0.75]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  } else if (type === 'truck') {
    return (
      <group position={position} ref={meshRef}>
        <mesh position={[0, 0.25, -0.2]}>
          <boxGeometry args={[0.3, 0.5, 0.4]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
        <mesh position={[0, 0.15, 0.2]}>
          <boxGeometry args={[0.3, 0.3, 0.6]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  } else {
    return (
      <group position={position} ref={meshRef}>
        <mesh position={[0, 0.15, 0]}>
          <boxGeometry args={[0.25, 0.15, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <boxGeometry args={[0.2, 0.1, 0.3]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  }
}

// Building component
function Building({ position, scale, height, color, type = 'standard' }: { 
  position: [number, number, number], 
  scale: [number, number, number],
  height: number,
  color: string,
  type?: 'standard' | 'modern' | 'residential' | 'commercial'
}) {
  // Different building types
  if (type === 'modern') {
    return (
      <group position={position} scale={scale}>
        <mesh position={[0, height/2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, height, 1]} />
          <meshStandardMaterial color={color} metalness={0.5} roughness={0.2} />
        </mesh>
        
        {/* Glass panels */}
        {Array.from({ length: Math.floor(height) }).map((_, i) => (
          <group key={i} position={[0, i + 0.5, 0]}>
            <mesh position={[0, 0, 0.51]} receiveShadow>
              <planeGeometry args={[0.9, 0.8]} />
              <meshStandardMaterial color="#88CCEE" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, -0.51]} receiveShadow>
              <planeGeometry args={[0.9, 0.8]} />
              <meshStandardMaterial color="#88CCEE" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0.51, 0, 0]} receiveShadow rotation={[0, Math.PI/2, 0]}>
              <planeGeometry args={[0.9, 0.8]} />
              <meshStandardMaterial color="#88CCEE" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[-0.51, 0, 0]} receiveShadow rotation={[0, Math.PI/2, 0]}>
              <planeGeometry args={[0.9, 0.8]} />
              <meshStandardMaterial color="#88CCEE" metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        ))}
      </group>
    );
  } else if (type === 'residential') {
    return (
      <group position={position} scale={scale}>
        <mesh position={[0, height/2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, height, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        
        {/* Windows */}
        {Array.from({ length: Math.floor(height) }).map((_, i) => (
          <group key={i} position={[0, i + 0.5, 0]}>
            <mesh position={[0.3, 0, 0.51]} receiveShadow>
              <planeGeometry args={[0.3, 0.4]} />
              <meshStandardMaterial color="#FFDB58" emissive="#FFDB58" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[-0.3, 0, 0.51]} receiveShadow>
              <planeGeometry args={[0.3, 0.4]} />
              <meshStandardMaterial color="#FFDB58" emissive="#FFDB58" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0.3, 0, -0.51]} receiveShadow>
              <planeGeometry args={[0.3, 0.4]} />
              <meshStandardMaterial color="#FFDB58" emissive="#FFDB58" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[-0.3, 0, -0.51]} receiveShadow>
              <planeGeometry args={[0.3, 0.4]} />
              <meshStandardMaterial color="#FFDB58" emissive="#FFDB58" emissiveIntensity={0.2} />
            </mesh>
          </group>
        ))}
        
        {/* Roof */}
        <mesh position={[0, height + 0.25, 0]} castShadow>
          <coneGeometry args={[0.8, 0.5, 4]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>
    );
  } else if (type === 'commercial') {
    return (
      <group position={position} scale={scale}>
        <mesh position={[0, height/2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, height, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        
        {/* Store front */}
        <mesh position={[0, 0.5, 0.51]} receiveShadow>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial color="#ADD8E6" emissive="#ADD8E6" emissiveIntensity={0.3} />
        </mesh>
        
        {/* Windows for upper floors */}
        {Array.from({ length: Math.floor(height) - 1 }).map((_, i) => (
          <group key={i} position={[0, i + 1.5, 0]}>
            <mesh position={[0, 0, 0.51]} receiveShadow>
              <planeGeometry args={[0.7, 0.5]} />
              <meshStandardMaterial color="#B3E5FC" emissive="#B3E5FC" emissiveIntensity={0.2} />
            </mesh>
          </group>
        ))}
        
        {/* Sign */}
        <mesh position={[0, height - 0.3, 0.51]} receiveShadow>
          <planeGeometry args={[0.6, 0.3]} />
          <meshStandardMaterial color="#FF6B6B" emissive="#FF6B6B" emissiveIntensity={0.5} />
        </mesh>
      </group>
    );
  } else {
    // Standard building
    return (
      <group position={position} scale={scale}>
        <mesh position={[0, height/2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, height, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        
        {/* Windows */}
        {Array.from({ length: Math.floor(height) }).map((_, i) => (
          <group key={i} position={[0, i + 0.5, 0]}>
            <mesh position={[0, 0, 0.51]} receiveShadow>
              <planeGeometry args={[0.6, 0.4]} />
              <meshStandardMaterial color="#B3E5FC" emissive="#B3E5FC" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 0, -0.51]} receiveShadow>
              <planeGeometry args={[0.6, 0.4]} />
              <meshStandardMaterial color="#B3E5FC" emissive="#B3E5FC" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0.51, 0, 0]} receiveShadow rotation={[0, Math.PI/2, 0]}>
              <planeGeometry args={[0.6, 0.4]} />
              <meshStandardMaterial color="#B3E5FC" emissive="#B3E5FC" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[-0.51, 0, 0]} receiveShadow rotation={[0, Math.PI/2, 0]}>
              <planeGeometry args={[0.6, 0.4]} />
              <meshStandardMaterial color="#B3E5FC" emissive="#B3E5FC" emissiveIntensity={0.2} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }
}

// Park component
function Park({ position, scale }: { position: [number, number, number], scale: [number, number, number] }) {
  return (
    <group position={position} scale={scale}>
      {/* Base green area */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#4CAF50" />
      </mesh>
      
      {/* Trees */}
      <group position={[-0.3, 0, -0.3]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.07, 0.6, 8]} />
          <meshStandardMaterial color="#795548" />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow>
          <coneGeometry args={[0.2, 0.5, 8]} />
          <meshStandardMaterial color="#2E7D32" />
        </mesh>
      </group>
      
      <group position={[0.3, 0, 0.3]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.5, 8]} />
          <meshStandardMaterial color="#795548" />
        </mesh>
        <mesh position={[0, 0.6, 0]} castShadow>
          <coneGeometry args={[0.18, 0.45, 8]} />
          <meshStandardMaterial color="#2E7D32" />
        </mesh>
      </group>
      
      {/* Bench */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.4, 0.05, 0.1]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
    </group>
  );
}

// Solar Panel component
function SolarPanel({ position, scale }: { position: [number, number, number], scale: [number, number, number] }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial color="#424242" />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[Math.PI/6, 0, 0]} receiveShadow>
        <boxGeometry args={[0.9, 0.05, 0.9]} />
        <meshStandardMaterial color="#1E88E5" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Traffic Light component
function TrafficLight({ position, state }: { position: [number, number, number], state: 'red' | 'yellow' | 'green' }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.2, 0.5, 0.2]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      <mesh position={[0, 1.15, 0.11]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial 
          color={state === 'red' ? '#ff0000' : '#330000'} 
          emissive={state === 'red' ? '#ff0000' : '#000000'}
          emissiveIntensity={state === 'red' ? 0.5 : 0}
        />
      </mesh>
      <mesh position={[0, 1, 0.11]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial 
          color={state === 'yellow' ? '#ffff00' : '#333300'} 
          emissive={state === 'yellow' ? '#ffff00' : '#000000'}
          emissiveIntensity={state === 'yellow' ? 0.5 : 0}
        />
      </mesh>
      <mesh position={[0, 0.85, 0.11]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial 
          color={state === 'green' ? '#00ff00' : '#003300'} 
          emissive={state === 'green' ? '#00ff00' : '#000000'}
          emissiveIntensity={state === 'green' ? 0.5 : 0}
        />
      </mesh>
    </group>
  );
}

// Street Light component
function StreetLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 2, 8]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFEB3B" emissive="#FFEB3B" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// City Scene component
function CityScene({ scenario = 'baseline', time = '12:00', isPlaying = false }) {
  const [trafficLights, setTrafficLights] = useState<{ position: [number, number, number], state: 'red' | 'yellow' | 'green' }[]>([
    { position: [-4, 0, -4], state: 'green' },
    { position: [-4, 0, 4], state: 'red' },
    { position: [4, 0, -4], state: 'red' },
    { position: [4, 0, 4], state: 'green' },
  ]);
  
  // Change traffic lights every few seconds
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setTrafficLights(prev => {
        return prev.map(light => {
          if (light.state === 'green') return { ...light, state: 'yellow' };
          if (light.state === 'yellow') return { ...light, state: 'red' };
          if (light.state === 'red') return { ...light, state: 'green' };
          return light;
        });
      });
    }, scenario === 'optimized' || scenario === 'future' ? 3000 : 5000);
    
    return () => clearInterval(interval);
  }, [isPlaying, scenario]);

  // Parse time to determine lighting
  const [hours] = time.split(':').map(Number);
  const isDaytime = hours >= 6 && hours < 18;
  const isSunset = hours >= 18 && hours < 20;
  const isNight = hours >= 20 || hours < 6;

  // Generate vehicles based on scenario
  const generateVehicles = () => {
    const baseVehicles = [
      // East-West traffic
      { position: [-12, 0.1, -1], color: '#4285F4', speed: 1.5, direction: [1, 0, 0] as [number, number, number], type: 'car' },
      { position: [-9, 0.1, -1], color: '#EA4335', speed: 1.2, direction: [1, 0, 0] as [number, number, number], type: 'car' },
      { position: [-6, 0.1, -1], color: '#FBBC05', speed: 1.3, direction: [1, 0, 0] as [number, number, number], type: 'car' },
      { position: [-3, 0.1, -1], color: '#34A853', speed: 1.4, direction: [1, 0, 0] as [number, number, number], type: 'car' },
      
      { position: [12, 0.1, 1], color: '#EA4335', speed: 1.3, direction: [-1, 0, 0] as [number, number, number], type: 'car' },
      { position: [9, 0.1, 1], color: '#FBBC05', speed: 1.5, direction: [-1, 0, 0] as [number, number, number], type: 'car' },
      { position: [6, 0.1, 1], color: '#34A853', speed: 1.2, direction: [-1, 0, 0] as [number, number, number], type: 'car' },
      { position: [3, 0.1, 1], color: '#4285F4', speed: 1.4, direction: [-1, 0, 0] as [number, number, number], type: 'car' },
      
      // North-South traffic
      { position: [-1, 0.1, -12], color: '#FBBC05', speed: 1.4, direction: [0, 0, 1] as [number, number, number], type: 'car' },
      { position: [-1, 0.1, -9], color: '#34A853', speed: 1.2, direction: [0, 0, 1] as [number, number, number], type: 'car' },
      { position: [-1, 0.1, -6], color: '#4285F4', speed: 1.3, direction: [0, 0, 1] as [number, number, number], type: 'car' },
      { position: [-1, 0.1, -3], color: '#EA4335', speed: 1.5, direction: [0, 0, 1] as [number, number, number], type: 'car' },
      
      { position: [1, 0.1, 12], color: '#34A853', speed: 1.3, direction: [0, 0, -1] as [number, number, number], type: 'car' },
      { position: [1, 0.1, 9], color: '#4285F4', speed: 1.5, direction: [0, 0, -1] as [number, number, number], type: 'car' },
      { position: [1, 0.1, 6], color: '#EA4335', speed: 1.2, direction: [0, 0, -1] as [number, number, number], type: 'car' },
      { position: [1, 0.1, 3], color: '#FBBC05', speed: 1.4, direction: [0, 0, -1] as [number, number, number], type: 'car' },
    ];
    
    // Add public transport for sustainable and future scenarios
    if (scenario === 'sustainable' || scenario === 'future') {
      baseVehicles.push(
        { position: [-10, 0.2, -1], color: '#1976D2', speed: 1.0, direction: [1, 0, 0] as [number, number, number], type: 'bus' },
        { position: [10, 0.2, 1], color: '#1976D2', speed: 1.0, direction: [-1, 0, 0] as [number, number, number], type: 'bus' },
        { position: [-1, 0.2, -10], color: '#1976D2', speed: 1.0, direction: [0, 0, 1] as [number, number, number], type: 'bus' },
        { position: [1, 0.2, 10], color: '#1976D2', speed: 1.0, direction: [0, 0, -1] as [number, number, number], type: 'bus' }
      );
    }
    
    // Add delivery trucks
    baseVehicles.push(
      { position: [-8, 0.2, -1], color: '#FF9800', speed: 0.8, direction: [1, 0, 0] as [number, number, number], type: 'truck' },
      { position: [8, 0.2, 1], color: '#FF9800', speed: 0.8, direction: [-1, 0, 0] as [number, number, number], type: 'truck' }
    );
    
    // Adjust speeds based on scenario
    return baseVehicles.map(vehicle => {
      let adjustedSpeed = vehicle.speed;
      
      if (scenario === 'optimized' || scenario === 'future') {
        // Smoother traffic flow in optimized scenarios
        adjustedSpeed *= 1.3;
      } else if (scenario === 'sustainable') {
        // Slightly slower but more consistent in sustainable scenario
        adjustedSpeed *= 1.1;
      }
      
      return { ...vehicle, speed: adjustedSpeed };
    });
  };

  const vehicles = generateVehicles();

  return (
    <>
      {/* Sky */}
      <Sky 
        distance={450000} 
        sunPosition={[
          0, 
          isDaytime ? Math.sin((hours - 6) / 12 * Math.PI) : (isSunset ? -0.2 : -0.5), 
          isDaytime ? Math.cos((hours - 6) / 12 * Math.PI) : (isSunset ? -0.8 : -1)
        ]} 
        rayleigh={isDaytime ? 0.5 : (isSunset ? 2 : 0.1)}
        turbidity={isDaytime ? 8 : (isSunset ? 12 : 20)}
        mieCoefficient={isDaytime ? 0.005 : (isSunset ? 0.03 : 0.001)}
        mieDirectionalG={isDaytime ? 0.8 : (isSunset ? 0.9 : 0.7)}
      />
      
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#9E9E9E" />
      </mesh>
      
      {/* Roads */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[3, 40]} />
        <meshStandardMaterial color="#424242" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 3]} />
        <meshStandardMaterial color="#424242" />
      </mesh>
      
      {/* Road markings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.1, 40]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[40, 0.1]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Buildings */}
      <Building position={[-7, 0, -7]} scale={[2, 1, 2]} height={4} color="#546E7A" type="standard" />
      <Building position={[-12, 0, -5]} scale={[1.5, 1, 1.5]} height={3} color="#455A64" type="residential" />
      <Building position={[-5, 0, -12]} scale={[1.5, 1, 1.5]} height={5} color="#37474F" type="commercial" />
      <Building position={[7, 0, -7]} scale={[2, 1, 2]} height={6} color="#455A64" type="modern" />
      <Building position={[12, 0, -5]} scale={[1.5, 1, 1.5]} height={4} color="#546E7A" type="commercial" />
      <Building position={[5, 0, -12]} scale={[1.5, 1, 1.5]} height={3} color="#37474F" type="residential" />
      <Building position={[-7, 0, 7]} scale={[2, 1, 2]} height={5} color="#455A64" type="modern" />
      <Building position={[-12, 0, 5]} scale={[1.5, 1, 1.5]} height={3} color="#546E7A" type="commercial" />
      <Building position={[-5, 0, 12]} scale={[1.5, 1, 1.5]} height={4} color="#37474F" type="residential" />
      <Building position={[7, 0, 7]} scale={[2, 1, 2]} height={5} color="#546E7A" type="standard" />
      <Building position={[12, 0, 5]} scale={[1.5, 1, 1.5]} height={6} color="#455A64" type="modern" />
      <Building position={[5, 0, 12]} scale={[1.5, 1, 1.5]} height={4} color="#37474F" type="commercial" />
      
      {/* Parks */}
      <Park position={[-9, 0, -9]} scale={[3, 1, 3]} />
      <Park position={[9, 0, 9]} scale={[3, 1, 3]} />
      
      {/* Additional green spaces for sustainable and future scenarios */}
      {(scenario === 'sustainable' || scenario === 'future') && (
        <>
          <Park position={[9, 0, -9]} scale={[2, 1, 2]} />
          <Park position={[-9, 0, 9]} scale={[2, 1, 2]} />
          <Park position={[-5, 0, 5]} scale={[1.5, 1, 1.5]} />
          <Park position={[5, 0, -5]} scale={[1.5, 1, 1.5]} />
        </>
      )}
      
      {/* Solar panels for sustainable and future scenarios */}
      {(scenario === 'sustainable' || scenario === 'future') && (
        <>
          <SolarPanel position={[-7, 4, -7]} scale={[1.5, 1, 1.5]} />
          <SolarPanel position={[7, 6, -7]} scale={[1.5, 1, 1.5]} />
          <SolarPanel position={[-7, 5, 7]} scale={[1.5, 1, 1.5]} />
          <SolarPanel position={[7, 5, 7]} scale={[1.5, 1, 1.5]} />
          <SolarPanel position={[12, 4, 5]} scale={[1, 1, 1]} />
          <SolarPanel position={[-12, 3, 5]} scale={[1, 1, 1]} />
        </>
      )}
      
      {/* Even more solar panels and green infrastructure for future scenario */}
      {scenario === 'future' && (
        <>
          <SolarPanel position={[5, 4, 12]} scale={[1, 1, 1]} />
          <SolarPanel position={[-5, 4, 12]} scale={[1, 1, 1]} />
          <SolarPanel position={[5, 3, -12]} scale={[1, 1, 1]} />
          <SolarPanel position={[-5, 3, -12]} scale={[1, 1, 1]} />
          
          {/* Green roofs */}
          <mesh position={[-7, 4.1, -7]} rotation={[0, 0, 0]} receiveShadow>
            <boxGeometry args={[1.8, 0.1, 1.8]} />
            <meshStandardMaterial color="#4CAF50" />
          </mesh>
          <mesh position={[7, 6.1, -7]} rotation={[0, 0, 0]} receiveShadow>
            <boxGeometry args={[1.8, 0.1, 1.8]} />
            <meshStandardMaterial color="#4CAF50" />
          </mesh>
        </>
      )}
      
      {/* Traffic Lights */}
      {trafficLights.map((light, index) => (
        <TrafficLight key={index} position={light.position} state={light.state} />
      ))}
      
      {/* Street Lights - only visible at night */}
      {(isNight || isSunset) && (
        <>
          <StreetLight position={[-5, 0, -1.5]} />
          <StreetLight position={[-10, 0, -1.5]} />
          <StreetLight position={[-15, 0, -1.5]} />
          <StreetLight position={[5, 0, -1.5]} />
          <StreetLight position={[10, 0, -1.5]} />
          <StreetLight position={[15, 0, -1.5]} />
          
          <StreetLight position={[-5, 0, 1.5]} />
          <StreetLight position={[-10, 0, 1.5]} />
          <StreetLight position={[-15, 0, 1.5]} />
          <StreetLight position={[5, 0, 1.5]} />
          <StreetLight position={[10, 0, 1.5]} />
          <StreetLight position={[15, 0, 1.5]} />
          
          <StreetLight position={[-1.5, 0, -5]} />
          <StreetLight position={[-1.5, 0, -10]} />
          <StreetLight position={[-1.5, 0, -15]} />
          <StreetLight position={[-1.5, 0, 5]} />
          <StreetLight position={[-1.5, 0, 10]} />
          <StreetLight position={[-1.5, 0, 15]} />
          
          <StreetLight position={[1.5, 0, -5]} />
          <StreetLight position={[1.5, 0, -10]} />
          <StreetLight position={[1.5, 0, -15]} />
          <StreetLight position={[1.5, 0, 5]} />
          <StreetLight position={[1.5, 0, 10]} />
          <StreetLight position={[1.5, 0, 15]} />
        </>
      )}
      
      {/* Vehicles */}
      {vehicles.map((vehicle, index) => (
        <Vehicle 
          key={index} 
          position={vehicle.position as [number, number, number]} 
          color={vehicle.color} 
          speed={vehicle.speed * (isPlaying ? 1 : 0)} 
          direction={vehicle.direction}
          type={vehicle.type as 'car' | 'bus' | 'truck'}
        />
      ))}
    </>
  );
}

export default function CitySimulation({ scenario = 'baseline', time = '12:00', isPlaying = false }) {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={[15, 15, 15]} />
      <ambientLight intensity={parseInt(time.split(':')[0]) >= 18 || parseInt(time.split(':')[0]) < 6 ? 0.2 : 0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={parseInt(time.split(':')[0]) >= 18 || parseInt(time.split(':')[0]) < 6 ? 0.3 : 1} 
        castShadow 
        shadow-mapSize-width={1024} 
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <CityScene scenario={scenario} time={time} isPlaying={isPlaying} />
      <OrbitControls target={[0, 0, 0]} />
      <Environment preset={parseInt(time.split(':')[0]) >= 18 || parseInt(time.split(':')[0]) < 6 ? "night" : "city"} />
    </Canvas>
  );
}