#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the current directory
const currentDir = __dirname;

// Log the current directory for debugging
console.log('Current directory:', currentDir);

// Function to fix a single file
function fixFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(`File does not exist: ${filePath}`);
      return;
    }
    
    console.log(`Processing file: ${filePath}`);
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Fix bcrypt import
    if (filePath.includes('reset-password/route.ts')) {
      const updatedContent = fileContent
        .replace(/import bcrypt from ['"]bcryptjs['"];/g, `import * as bcryptjs from 'bcryptjs';`)
        .replace(/bcrypt\./g, 'bcryptjs.');
      
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log('Fixed bcrypt import in', filePath);
    }
    
    // Fix img tags
    if (filePath.includes('profile/page.tsx') || filePath.includes('DashboardNavbar.tsx')) {
      let updatedContent = fileContent;
      
      // Add Image import if not already present
      if (!updatedContent.includes("import Image from 'next/image'")) {
        if (updatedContent.includes('import React')) {
          updatedContent = updatedContent.replace(
            /import React.*?;/,
            match => `${match}\nimport Image from 'next/image';`
          );
        } else {
          updatedContent = `import Image from 'next/image';\n${updatedContent}`;
        }
      }
      
      // Replace img tags with Image components
      updatedContent = updatedContent.replace(
        /<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)>/g,
        (match, beforeSrc, src, afterSrc) => {
          const altMatch = match.match(/alt=["']([^"']*)["']/);
          const alt = altMatch ? altMatch[1] : 'Image';
          
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
      
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log('Fixed img tags in', filePath);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Main function to fix all issues
function fixAllIssues() {
  try {
    // Get the project root directory (one level up from fix-scripts)
    const projectRoot = path.resolve(currentDir, '..');
    console.log('Project root:', projectRoot);
    
    // Fix bcrypt import
    const resetPasswordPath = path.join(projectRoot, 'src/app/api/auth/reset-password/route.ts');
    fixFile(resetPasswordPath);
    
    // Fix img tags
    const profilePagePath = path.join(projectRoot, 'src/app/(dashboard)/profile/page.tsx');
    const navbarPath = path.join(projectRoot, 'src/components/dashboard/DashboardNavbar.tsx');
    fixFile(profilePagePath);
    fixFile(navbarPath);
    
    console.log('All fixes completed successfully');
  } catch (error) {
    console.error('Error fixing issues:', error);
  }
}

// Run the main function
fixAllIssues(); 