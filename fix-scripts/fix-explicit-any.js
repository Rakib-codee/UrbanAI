const fs = require('fs');
const path = require('path');

// Files with explicit any type warnings
const filesToFix = [
  {
    path: '../src/app/dashboard/simulation/page.tsx',
    anyTypes: [
      { line: 34, replacement: 'unknown' },
      { line: 35, replacement: 'unknown' },
      { line: 179, replacement: 'unknown' }
    ]
  },
  {
    path: '../src/app/dashboard/social/advanced-filters/page.tsx',
    anyTypes: [
      { line: 61, replacement: 'unknown' },
      { line: 216, replacement: 'unknown' },
      { line: 233, replacement: 'unknown' },
      { line: 292, replacement: 'unknown' },
      { line: 308, replacement: 'unknown' },
      { line: 326, replacement: 'unknown' },
      { line: 344, replacement: 'unknown' },
      { line: 359, replacement: 'unknown' }
    ]
  },
  {
    path: '../src/components/3d/CityGrid.tsx',
    anyTypes: [
      { line: 19, replacement: 'unknown' },
      { line: 111, replacement: 'unknown' },
      { line: 137, replacement: 'unknown' },
      { line: 174, replacement: 'unknown' },
      { line: 242, replacement: 'unknown' },
      { line: 266, replacement: 'unknown' },
      { line: 378, replacement: 'unknown' },
      { line: 379, replacement: 'unknown' },
      { line: 380, replacement: 'unknown' },
      { line: 381, replacement: 'unknown' },
      { line: 382, replacement: 'unknown' }
    ]
  },
  {
    path: '../src/components/3d/TrafficSimulation.tsx',
    anyTypes: [
      { line: 280, replacement: 'unknown' }
    ]
  },
  {
    path: '../src/components/ui/ExportButton.tsx',
    anyTypes: [
      { line: 12, replacement: 'unknown' }
    ]
  },
  {
    path: '../src/services/locationDataService.ts',
    anyTypes: [
      { line: 352, replacement: 'unknown' },
      { line: 554, replacement: 'unknown' },
      { line: 753, replacement: 'unknown' }
    ]
  },
  {
    path: '../src/services/tomtomService.ts',
    anyTypes: [
      { line: 139, replacement: 'unknown' }
    ]
  },
  {
    path: '../src/services/uscgWaterService.ts',
    anyTypes: [
      { line: 31, replacement: 'unknown' }
    ]
  },
  {
    path: '../src/utils/deepseek-reasoner.ts',
    anyTypes: [
      { line: 10, replacement: 'unknown' },
      { line: 50, replacement: 'unknown' },
      { line: 63, replacement: 'unknown' }
    ]
  },
  {
    path: '../src/utils/exportData.ts',
    anyTypes: [
      { line: 17, replacement: 'unknown' },
      { line: 54, replacement: 'unknown' },
      { line: 90, replacement: 'unknown' },
      { line: 111, replacement: 'unknown' },
      { line: 125, replacement: 'unknown' }
    ]
  },
  {
    path: '../src/utils/openai-client.ts',
    anyTypes: [
      { line: 10, replacement: 'unknown' },
      { line: 36, replacement: 'unknown' },
      { line: 50, replacement: 'unknown' }
    ]
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

    // Split the file into lines
    const lines = data.split('\n');
    
    // Replace 'any' with 'unknown'
    fileInfo.anyTypes.forEach(typeInfo => {
      const lineIndex = typeInfo.line - 1; // Convert to 0-based index
      if (lineIndex >= 0 && lineIndex < lines.length) {
        lines[lineIndex] = lines[lineIndex].replace(/: any/g, `: ${typeInfo.replacement}`);
        lines[lineIndex] = lines[lineIndex].replace(/as any/g, `as ${typeInfo.replacement}`);
        lines[lineIndex] = lines[lineIndex].replace(/<any>/g, `<${typeInfo.replacement}>`);
        lines[lineIndex] = lines[lineIndex].replace(/: Array<any>/g, `: Array<${typeInfo.replacement}>`);
        lines[lineIndex] = lines[lineIndex].replace(/: any\[\]/g, `: ${typeInfo.replacement}[]`);
      }
    });
    
    // Join the lines back together
    const result = lines.join('\n');

    // Write the file
    fs.writeFile(filePath, result, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file ${filePath}: ${err}`);
        return;
      }
      console.log(`Successfully fixed explicit any types in ${fileInfo.path}`);
    });
  });
}); 