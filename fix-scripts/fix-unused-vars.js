const fs = require('fs');
const path = require('path');

// Files with unused variables
const filesToFix = [
  {
    path: '../src/app/dashboard/page.bak.tsx',
    unusedVars: ['trafficData', 'airQualityData', 'resourceData', 'COLORS', 'stats']
  },
  {
    path: '../src/app/dashboard/page.old.tsx',
    unusedVars: ['AnimatePresence', 'Bell', 'Search', 'Settings', 'Menu', 'X', 'notifications']
  },
  {
    path: '../src/app/dashboard/simulation/page.tsx',
    unusedVars: ['useEffect', 'Sliders', 'ChevronDown', 'ChevronUp']
  },
  {
    path: '../src/app/reset-password/page.tsx',
    unusedVars: ['error']
  },
  {
    path: '../src/components/3d/Building.tsx',
    unusedVars: ['index']
  },
  {
    path: '../src/components/3d/CityGrid.tsx',
    unusedVars: ['THREE', '_']
  },
  {
    path: '../src/components/dashboard/AIAssistantWidget.tsx',
    unusedVars: ['ArrowUpCircle', 'Bot', 'X', 'Input', 'Button', 'isOpen', 'setIsOpen', 'input', 'setInput', 'messages', 'setMessages']
  },
  {
    path: '../src/components/dashboard/DashboardCard.tsx',
    unusedVars: ['TrendingUp', 'TrendingDown']
  },
  {
    path: '../src/components/dashboard/DashboardPager.tsx',
    unusedVars: ['Button', 'canGoPrevious', 'canGoNext']
  },
  {
    path: '../src/components/TrafficMap.tsx',
    unusedVars: ['Tooltip']
  },
  {
    path: '../src/components/social/FeedbackSystem.tsx',
    unusedVars: ['totalItems', 'setSelectedStatus']
  },
  {
    path: '../src/services/AnalyticsService.ts',
    unusedVars: ['fetchRealTimeTrafficData', 'apiService', 'uncertaintyFactor']
  },
  {
    path: '../src/services/apiService.ts',
    unusedVars: ['API_KEYS', 'getAuthHeaders']
  },
  {
    path: '../src/services/locationDataService.ts',
    unusedVars: ['axios', 'WeatherConditionMapping', 'cache', 'CACHE_DURATION', 'generateTrafficData']
  },
  {
    path: '../src/services/realTimeData.ts',
    unusedVars: ['getAuthHeaders']
  },
  {
    path: '../src/services/tomtomService.ts',
    unusedVars: ['radius']
  },
  {
    path: '../src/utils/exportData.ts',
    unusedVars: ['data', 'fileName']
  }
];

filesToFix.forEach(fileInfo => {
  const filePath = path.join(__dirname, fileInfo.path);
  
  // Read the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}: ${err}`);
      return;
    }

    // Comment out unused variables
    let result = data;
    fileInfo.unusedVars.forEach(varName => {
      // Find variable declarations
      const importRegex = new RegExp(`import\\s+{[^}]*\\b${varName}\\b[^}]*}\\s+from\\s+['"][^'"]+['"]`, 'g');
      const varRegex = new RegExp(`(const|let|var)\\s+{[^}]*\\b${varName}\\b[^}]*}\\s*=`, 'g');
      const directVarRegex = new RegExp(`(const|let|var)\\s+${varName}\\s*=`, 'g');
      
      // Comment out imports
      result = result.replace(importRegex, match => {
        // If the variable is the only import, comment out the entire line
        if (match.includes(`{ ${varName} }`)) {
          return `// ${match} // Unused import`;
        }
        
        // Otherwise, remove the variable from the import
        return match.replace(new RegExp(`\\b${varName}\\b,?\\s*`), '');
      });
      
      // Comment out destructured variables
      result = result.replace(varRegex, match => {
        // If the variable is the only one being destructured, comment out the line
        if (match.includes(`{ ${varName} }`)) {
          return `// ${match} // Unused variable`;
        }
        
        // Otherwise, remove the variable from the destructuring
        return match.replace(new RegExp(`\\b${varName}\\b,?\\s*`), '');
      });
      
      // Comment out direct variable declarations
      result = result.replace(directVarRegex, match => {
        return `// ${match} // Unused variable`;
      });
    });

    // Write the file
    fs.writeFile(filePath, result, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file ${filePath}: ${err}`);
        return;
      }
      console.log(`Successfully fixed unused variables in ${fileInfo.path}`);
    });
  });
}); 