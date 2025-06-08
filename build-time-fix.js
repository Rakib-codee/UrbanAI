#!/usr/bin/env node

/**
 * This script runs during the build process on Vercel to fix case sensitivity issues
 * It creates symbolic links between lowercase and uppercase versions of component files
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Running build-time fixes for case sensitivity issues...');

// Components that need case sensitivity fixes
const componentPaths = [
  { lower: 'src/components/ui/button.tsx', upper: 'src/components/ui/Button.tsx' },
  { lower: 'src/components/ui/input.tsx', upper: 'src/components/ui/Input.tsx' },
  { lower: 'src/components/ui/label.tsx', upper: 'src/components/ui/Label.tsx' },
  { lower: 'src/components/ui/textarea.tsx', upper: 'src/components/ui/Textarea.tsx' },
  { lower: 'src/components/ui/card.tsx', upper: 'src/components/ui/Card.tsx' },
  { lower: 'src/components/ui/tabs.tsx', upper: 'src/components/ui/Tabs.tsx' },
  { lower: 'src/components/ui/switch.tsx', upper: 'src/components/ui/Switch.tsx' },
  { lower: 'src/components/ui/slider.tsx', upper: 'src/components/ui/Slider.tsx' },
  { lower: 'src/components/ui/avatar.tsx', upper: 'src/components/ui/Avatar.tsx' },
  { lower: 'src/components/ui/dropdown-menu.tsx', upper: 'src/components/ui/DropdownMenu.tsx' },
  { lower: 'src/components/dashboard/charts/areaChart.tsx', upper: 'src/components/dashboard/charts/AreaChart.tsx' },
];

/**
 * Create a symbolic link or copy file from source to target
 */
function ensureFile(source, target) {
  try {
    // Check if source exists
    if (fs.existsSync(source)) {
      console.log(`✅ Source file exists: ${source}`);
      
      // Make sure the target directory exists
      const targetDir = path.dirname(target);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log(`📁 Created directory: ${targetDir}`);
      }
      
      // Copy the file instead of symlinking (more reliable on Vercel)
      fs.copyFileSync(source, target);
      console.log(`📄 Copied: ${source} → ${target}`);
    } else if (fs.existsSync(target)) {
      console.log(`✅ Target file exists: ${target}`);
      
      // Copy in the other direction
      const targetDir = path.dirname(source);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
        console.log(`📁 Created directory: ${targetDir}`);
      }
      
      fs.copyFileSync(target, source);
      console.log(`📄 Copied: ${target} → ${source}`);
    } else {
      console.log(`❌ Neither source nor target exists: ${source} / ${target}`);
    }
  } catch (error) {
    console.error(`Error processing ${source} → ${target}:`, error);
  }
}

// Process each component
componentPaths.forEach(({ lower, upper }) => {
  // Create a link from lowercase to uppercase (if uppercase exists)
  ensureFile(upper, lower);
  
  // Create a link from uppercase to lowercase (if lowercase exists)
  ensureFile(lower, upper);
});

console.log('✨ Build-time fixes completed!'); 