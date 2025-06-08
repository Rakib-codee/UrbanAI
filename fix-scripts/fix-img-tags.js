const fs = require('fs');
const path = require('path');

// Files with img tag warnings
const filesToFix = [
  '../src/app/(dashboard)/profile/page.tsx',
  '../src/components/dashboard/DashboardNavbar.tsx'
];

filesToFix.forEach(relativeFilePath => {
  const filePath = path.join(__dirname, relativeFilePath);
  
  // Read the file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}: ${err}`);
      return;
    }

    // Add Image import if not already present
    let result = data;
    if (!result.includes("import Image from 'next/image'")) {
      // Find the import section and add the Image import
      if (result.includes('import React')) {
        result = result.replace(
          /import React.*?;/,
          match => `${match}\nimport Image from 'next/image';`
        );
      } else {
        // Add at the top if no React import
        result = `import Image from 'next/image';\n${result}`;
      }
    }

    // Replace <img> tags with <Image> components
    result = result.replace(
      /<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/g,
      (match, beforeSrc, src, afterSrc) => {
        // Extract alt text if present
        const altMatch = match.match(/alt=["']([^"']*)["']/);
        const alt = altMatch ? altMatch[1] : 'Image';
        
        // Extract className if present
        const classMatch = match.match(/className=["']([^"']*)["']/);
        const className = classMatch ? classMatch[1] : '';
        
        return `<Image 
          src="${src}" 
          alt="${alt}" 
          ${className ? `className="${className}"` : ''} 
          width={500} 
          height={300} 
          style={{ objectFit: 'contain' }}
        />`;
      }
    );

    // Write the file
    fs.writeFile(filePath, result, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file ${filePath}: ${err}`);
        return;
      }
      console.log(`Successfully replaced img tags with Image components in ${relativeFilePath}`);
    });
  });
}); 