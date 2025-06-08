const fs = require('fs');
const path = require('path');

// Files with React hooks dependency warnings
const filesToFix = [
  {
    path: '../src/app/(dashboard)/projects/[id]/green-spaces/page.tsx',
    missingDeps: ['params']
  },
  {
    path: '../src/app/(dashboard)/projects/[id]/page.tsx',
    missingDeps: ['params']
  },
  {
    path: '../src/app/(dashboard)/projects/[id]/resources/page.tsx',
    missingDeps: ['params']
  },
  {
    path: '../src/app/(dashboard)/projects/[id]/traffic/page.tsx',
    missingDeps: ['params']
  },
  {
    path: '../src/app/dashboard/ai-predictions/page.tsx',
    missingDeps: ['generatePredictions']
  },
  {
    path: '../src/app/dashboard/data-transparency/page.tsx',
    missingDeps: ['mockDataSources']
  },
  {
    path: '../src/app/dashboard/greenspace/page.tsx',
    missingDeps: ['currentLocation']
  },
  {
    path: '../src/app/dashboard/greenspaces/page.tsx',
    missingDeps: ['performAnalysis']
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

    // Find useEffect hooks with dependency arrays
    let result = data;
    fileInfo.missingDeps.forEach(dep => {
      // Look for useEffect hooks with dependency arrays that are missing the dependency
      const regex = new RegExp(`useEffect\\(\\s*\\(\\s*\\)\\s*=>\\s*{[^}]*}\\s*,\\s*\\[([^\\]]*)\\]\\s*\\)`, 'g');
      
      result = result.replace(regex, (match, deps) => {
        // Check if the dependency is already in the array
        if (deps.includes(dep)) {
          return match;
        }
        
        // Add the dependency to the array
        const newDeps = deps ? `${deps}, ${dep}` : dep;
        return match.replace(/\[([^\]]*)\]/, `[${newDeps}]`);
      });
    });

    // Write the file
    fs.writeFile(filePath, result, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file ${filePath}: ${err}`);
        return;
      }
      console.log(`Successfully fixed React hooks dependencies in ${fileInfo.path}`);
    });
  });
}); 