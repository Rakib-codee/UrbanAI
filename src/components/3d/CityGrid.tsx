import React, { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import Building from './Building';
import Vehicle from './Vehicle';
import Road from './Road';
import Tree from './Tree';

interface CityGridProps {
  scenario: string;
  size: number;
  density: number;
}

export default function CityGrid({ scenario, size, density }: CityGridProps) {
  const { scene } = useThree();
  
  // Function to create buildings in a block
  const createBuildings = (layout: any, posX: number, posZ: number, blockSize: number, scenario: string, density: number) => {
    // Determine number of buildings based on density
    const buildingCount = Math.max(1, Math.floor(Math.random() * 4 * density));
    
    for (let i = 0; i < buildingCount; i++) {
      // Calculate building size and position
      const buildingWidth = 1 + Math.random() * (blockSize / buildingCount / 1.5);
      const buildingDepth = 1 + Math.random() * (blockSize / buildingCount / 1.5);
      
      // Building height varies by scenario
      let maxHeight = 5;
      if (scenario === 'optimized') maxHeight = 8;
      if (scenario === 'sustainable') maxHeight = 6;
      if (scenario === 'future') maxHeight = 12;
      
      const buildingHeight = 2 + Math.random() * maxHeight;
      
      // Position within the block
      const offsetX = (Math.random() - 0.5) * (blockSize - buildingWidth);
      const offsetZ = (Math.random() - 0.5) * (blockSize - buildingDepth);
      
      // Building type
      const buildingTypes = ['residential', 'commercial', 'industrial', 'government'] as const;
      let typeWeights = [0.5, 0.3, 0.15, 0.05]; // Default weights
      
      // Adjust weights based on scenario
      if (scenario === 'optimized') {
        typeWeights = [0.4, 0.4, 0.15, 0.05]; // More commercial in optimized
      } else if (scenario === 'sustainable') {
        typeWeights = [0.6, 0.25, 0.05, 0.1]; // Less industrial in sustainable
      } else if (scenario === 'future') {
        typeWeights = [0.45, 0.35, 0.1, 0.1]; // Balanced in future
      }
      
      // Select building type based on weights
      const typeRandom = Math.random();
      let typeIndex = 0;
      let cumulativeWeight = 0;
      
      for (let j = 0; j < typeWeights.length; j++) {
        cumulativeWeight += typeWeights[j];
        if (typeRandom < cumulativeWeight) {
          typeIndex = j;
          break;
        }
      }
      
      const buildingType = buildingTypes[typeIndex];
      
      // Building color based on type and scenario
      let color = '#888888';
      
      if (buildingType === 'residential') {
        color = scenario === 'future' ? '#a0c8e0' : '#c8a080';
      } else if (buildingType === 'commercial') {
        color = scenario === 'future' ? '#80a0c0' : '#808080';
      } else if (buildingType === 'industrial') {
        color = scenario === 'future' ? '#a0a0b0' : '#a08060';
      } else if (buildingType === 'government') {
        color = scenario === 'future' ? '#90b0d0' : '#a0a0a0';
      }
      
      // Energy efficiency based on scenario
      let efficiency = 50; // Baseline
      if (scenario === 'optimized') efficiency = 70;
      if (scenario === 'sustainable') efficiency = 85;
      if (scenario === 'future') efficiency = 95;
      
      // Add building to layout
      layout.buildings.push({
        position: [posX + offsetX, 0, posZ + offsetZ],
        width: buildingWidth,
        depth: buildingDepth,
        height: buildingHeight,
        color,
        type: buildingType,
        hasLights: true,
        efficiency
      });
      
      // Add trees around buildings in sustainable and future scenarios
      if ((scenario === 'sustainable' || scenario === 'future') && Math.random() < 0.7) {
        const treeCount = scenario === 'future' ? 5 : 3;
        
        for (let t = 0; t < treeCount; t++) {
          const treeOffsetX = (Math.random() - 0.5) * (blockSize - 1);
          const treeOffsetZ = (Math.random() - 0.5) * (blockSize - 1);
          
          // Avoid placing trees inside buildings
          const treeX = posX + treeOffsetX;
          const treeZ = posZ + treeOffsetZ;
          
          const insideBuilding = layout.buildings.some((building: any) => {
            const [bx, _, bz] = building.position;
            const halfWidth = building.width / 2;
            const halfDepth = building.depth / 2;
            
            return (
              treeX >= bx - halfWidth && 
              treeX <= bx + halfWidth && 
              treeZ >= bz - halfDepth && 
              treeZ <= bz + halfDepth
            );
          });
          
          if (!insideBuilding) {
            layout.trees.push({
              position: [treeX, 0, treeZ],
              height: 0.5 + Math.random() * 1.5,
              type: Math.random() < 0.7 ? 'deciduous' : 'coniferous'
            });
          }
        }
      }
    }
  };
  
  // Function to create a park in a block
  const createPark = (layout: any, posX: number, posZ: number, blockSize: number, scenario: string) => {
    // Add park to layout
    layout.parks.push({
      position: [posX, 0, posZ],
      size: blockSize
    });
    
    // Add trees to park
    const treeCount = scenario === 'future' ? 15 : (scenario === 'sustainable' ? 12 : 8);
    
    for (let i = 0; i < treeCount; i++) {
      const treeOffsetX = (Math.random() - 0.5) * (blockSize - 1);
      const treeOffsetZ = (Math.random() - 0.5) * (blockSize - 1);
      
      layout.trees.push({
        position: [posX + treeOffsetX, 0, posZ + treeOffsetZ],
        height: 0.5 + Math.random() * 2,
        type: Math.random() < 0.7 ? 'deciduous' : 'coniferous'
      });
    }
    
    // Add small building (like a pavilion) in some parks
    if (Math.random() < 0.3) {
      layout.buildings.push({
        position: [posX, 0, posZ],
        width: 1 + Math.random(),
        depth: 1 + Math.random(),
        height: 1,
        color: '#a0a0a0',
        type: 'government',
        hasLights: true,
        efficiency: scenario === 'future' ? 95 : (scenario === 'sustainable' ? 85 : 60)
      });
    }
  };
  
  // Function to create mixed-use development in a block
  const createMixedUse = (layout: any, posX: number, posZ: number, blockSize: number, scenario: string, density: number) => {
    // Create a mix of buildings and green spaces
    const buildingCount = Math.max(1, Math.floor(Math.random() * 3 * density));
    
    // Smaller buildings with more space between them
    for (let i = 0; i < buildingCount; i++) {
      const buildingWidth = 1 + Math.random() * (blockSize / buildingCount / 2);
      const buildingDepth = 1 + Math.random() * (blockSize / buildingCount / 2);
      
      // Mixed-use buildings are generally taller
      let maxHeight = 6;
      if (scenario === 'optimized') maxHeight = 10;
      if (scenario === 'sustainable') maxHeight = 8;
      if (scenario === 'future') maxHeight = 15;
      
      const buildingHeight = 3 + Math.random() * maxHeight;
      
      // Position within the block - more organized layout
      const gridPositions = [
        [-blockSize/4, -blockSize/4],
        [-blockSize/4, blockSize/4],
        [blockSize/4, -blockSize/4],
        [blockSize/4, blockSize/4]
      ];
      
      const [gridX, gridZ] = gridPositions[i % gridPositions.length];
      const offsetX = gridX + (Math.random() - 0.5) * (blockSize/4);
      const offsetZ = gridZ + (Math.random() - 0.5) * (blockSize/4);
      
      // Mixed-use buildings are primarily residential + commercial
      const buildingType = Math.random() < 0.7 ? 'residential' : 'commercial';
      
      // Building color based on type and scenario
      const color = buildingType === 'residential' 
        ? (scenario === 'future' ? '#a0c8e0' : '#c8a080')
        : (scenario === 'future' ? '#80a0c0' : '#808080');
      
      // Energy efficiency based on scenario - mixed-use is generally more efficient
      let efficiency = 60; // Baseline
      if (scenario === 'optimized') efficiency = 80;
      if (scenario === 'sustainable') efficiency = 90;
      if (scenario === 'future') efficiency = 98;
      
      // Add building to layout
      layout.buildings.push({
        position: [posX + offsetX, 0, posZ + offsetZ],
        width: buildingWidth,
        depth: buildingDepth,
        height: buildingHeight,
        color,
        type: buildingType,
        hasLights: true,
        efficiency,
        mixedUse: true
      });
    }
    
    // Add trees and green spaces between buildings
    const treeCount = scenario === 'future' ? 10 : (scenario === 'sustainable' ? 8 : 5);
    
    for (let i = 0; i < treeCount; i++) {
      const treeOffsetX = (Math.random() - 0.5) * (blockSize - 1);
      const treeOffsetZ = (Math.random() - 0.5) * (blockSize - 1);
      
      // Avoid placing trees inside buildings
      const treeX = posX + treeOffsetX;
      const treeZ = posZ + treeOffsetZ;
      
      const insideBuilding = layout.buildings.some((building: any) => {
        const [bx, _, bz] = building.position;
        const halfWidth = building.width / 2;
        const halfDepth = building.depth / 2;
        
        return (
          treeX >= bx - halfWidth && 
          treeX <= bx + halfWidth && 
          treeZ >= bz - halfDepth && 
          treeZ <= bz + halfDepth
        );
      });
      
      if (!insideBuilding) {
        layout.trees.push({
          position: [treeX, 0, treeZ],
          height: 0.5 + Math.random() * 1.5,
          type: Math.random() < 0.7 ? 'deciduous' : 'coniferous'
        });
      }
    }
  };
  
  // Function to add vehicles to roads
  const addVehiclesToRoads = (layout: any, posX: number, posZ: number, blockSize: number, roadWidth: number, scenario: string) => {
    // Determine vehicle density based on scenario
    let vehicleDensity = 0.3; // Baseline
    if (scenario === 'optimized') vehicleDensity = 0.2; // Less traffic in optimized
    if (scenario === 'sustainable') vehicleDensity = 0.15; // Even less in sustainable
    if (scenario === 'future') vehicleDensity = 0.1; // Minimal in future
    
    // Only add vehicles to some road segments
    if (Math.random() < vehicleDensity) {
      // Horizontal road
      const vehicleCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < vehicleCount; i++) {
        const offsetX = (Math.random() - 0.5) * blockSize;
        const offsetZ = (Math.random() - 0.5) * (roadWidth * 0.8);
        
        // Vehicle type based on scenario
        let vehicleTypes = ['car', 'truck', 'bus'];
        let typeWeights = [0.7, 0.2, 0.1]; // Default weights
        
        if (scenario === 'optimized') {
          typeWeights = [0.6, 0.15, 0.25]; // More public transit
        } else if (scenario === 'sustainable') {
          typeWeights = [0.5, 0.1, 0.4]; // Even more public transit
        } else if (scenario === 'future') {
          vehicleTypes = ['car', 'truck', 'bus', 'autonomous'];
          typeWeights = [0.3, 0.05, 0.35, 0.3]; // Autonomous vehicles
        }
        
        // Select vehicle type based on weights
        const typeRandom = Math.random();
        let typeIndex = 0;
        let cumulativeWeight = 0;
        
        for (let j = 0; j < typeWeights.length; j++) {
          cumulativeWeight += typeWeights[j];
          if (typeRandom < cumulativeWeight) {
            typeIndex = j;
            break;
          }
        }
        
        const vehicleType = vehicleTypes[typeIndex];
        
        // Add vehicle to layout
        layout.vehicles.push({
          position: [posX + offsetX, 0.2, posZ - (roadWidth / 2) + offsetZ],
          direction: Math.random() < 0.5 ? 'left' : 'right',
          type: vehicleType,
          speed: 0.05 + Math.random() * 0.1
        });
      }
    }
    
    // Only add vehicles to some road segments
    if (Math.random() < vehicleDensity) {
      // Vertical road
      const vehicleCount = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < vehicleCount; i++) {
        const offsetX = (Math.random() - 0.5) * (roadWidth * 0.8);
        const offsetZ = (Math.random() - 0.5) * blockSize;
        
        // Vehicle type based on scenario
        let vehicleTypes = ['car', 'truck', 'bus'];
        let typeWeights = [0.7, 0.2, 0.1]; // Default weights
        
        if (scenario === 'optimized') {
          typeWeights = [0.6, 0.15, 0.25]; // More public transit
        } else if (scenario === 'sustainable') {
          typeWeights = [0.5, 0.1, 0.4]; // Even more public transit
        } else if (scenario === 'future') {
          vehicleTypes = ['car', 'truck', 'bus', 'autonomous'];
          typeWeights = [0.3, 0.05, 0.35, 0.3]; // Autonomous vehicles
        }
        
        // Select vehicle type based on weights
        const typeRandom = Math.random();
        let typeIndex = 0;
        let cumulativeWeight = 0;
        
        for (let j = 0; j < typeWeights.length; j++) {
          cumulativeWeight += typeWeights[j];
          if (typeRandom < cumulativeWeight) {
            typeIndex = j;
            break;
          }
        }
        
        const vehicleType = vehicleTypes[typeIndex];
        
        // Add vehicle to layout
        layout.vehicles.push({
          position: [posX - (roadWidth / 2) + offsetX, 0.2, posZ + offsetZ],
          direction: Math.random() < 0.5 ? 'up' : 'down',
          type: vehicleType,
          speed: 0.05 + Math.random() * 0.1
        });
      }
    }
  };
  
  // Generate city layout based on scenario
  const cityLayout = useMemo(() => {
    // Clear any existing city elements
    scene.children.forEach(child => {
      if (child.userData.cityElement) {
        scene.remove(child);
      }
    });
    
    const layout = {
      buildings: [] as any[],
      roads: [] as any[],
      vehicles: [] as any[],
      trees: [] as any[],
      parks: [] as any[]
    };
    
    // Grid size (number of blocks)
    const gridSize = size;
    const blockSize = 10;
    const roadWidth = 2;
    
    // Create grid of roads
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const posX = (x * (blockSize + roadWidth)) - ((gridSize * (blockSize + roadWidth)) / 2);
        const posZ = (z * (blockSize + roadWidth)) - ((gridSize * (blockSize + roadWidth)) / 2);
        
        // Horizontal road
        layout.roads.push({
          position: [posX + (blockSize / 2), 0, posZ - (roadWidth / 2)],
          width: blockSize + roadWidth,
          length: roadWidth,
          direction: 'horizontal'
        });
        
        // Vertical road
        layout.roads.push({
          position: [posX - (roadWidth / 2), 0, posZ + (blockSize / 2)],
          width: roadWidth,
          length: blockSize + roadWidth,
          direction: 'vertical'
        });
        
        // Determine block type based on position and scenario
        let blockType: 'building' | 'park' | 'mixed' = 'building';
        
        // More parks in sustainable scenario
        if (scenario === 'sustainable' && Math.random() < 0.3) {
          blockType = 'park';
        } 
        // Even more parks and green spaces in future scenario
        else if (scenario === 'future' && Math.random() < 0.4) {
          blockType = 'park';
        }
        // Mixed use in optimized scenario
        else if (scenario === 'optimized' && Math.random() < 0.2) {
          blockType = 'mixed';
        }
        
        // Create block content based on type
        if (blockType === 'building') {
          createBuildings(layout, posX, posZ, blockSize, scenario, density);
        } else if (blockType === 'park') {
          createPark(layout, posX, posZ, blockSize, scenario);
        } else if (blockType === 'mixed') {
          createMixedUse(layout, posX, posZ, blockSize, scenario, density);
        }
        
        // Add vehicles to roads
        addVehiclesToRoads(layout, posX, posZ, blockSize, roadWidth, scenario);
      }
    }
    
    return layout;
  }, [scenario, size, density, scene]);
  
  return (
    <group>
      {/* Render buildings */}
      {cityLayout.buildings.map((building, index) => (
        <Building
          key={`building-${index}`}
          position={building.position}
          width={building.width}
          depth={building.depth}
          height={building.height}
          color={building.color}
          type={building.type}
          hasLights={building.hasLights}
          efficiency={building.efficiency}
        />
      ))}
      
      {/* Render roads */}
      {cityLayout.roads.map((road, index) => (
        <Road
          key={`road-${index}`}
          position={road.position}
          width={road.width}
          length={road.length}
          direction={road.direction}
          scenario={scenario}
        />
      ))}
      
      {/* Render vehicles */}
      {cityLayout.vehicles.map((vehicle, index) => (
        <Vehicle
          key={`vehicle-${index}`}
          position={vehicle.position}
          color={vehicle.color}
          speed={vehicle.speed}
          direction={vehicle.direction}
          type={vehicle.type}
        />
      ))}
      
      {/* Render trees */}
      {cityLayout.trees.map((tree, index) => (
        <Tree
          key={`tree-${index}`}
          position={tree.position}
          height={tree.height}
          type={tree.type}
        />
      ))}
      
      {/* Render parks */}
      {cityLayout.parks.map((park, index) => (
        <mesh
          key={`park-${index}`}
          position={[park.position[0], -0.01, park.position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[park.size, park.size]} />
          <meshStandardMaterial color="#2a5e23" />
        </mesh>
      ))}
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[size * 20, size * 20]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
}