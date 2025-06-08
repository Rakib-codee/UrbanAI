const { execSync } = require('child_process');
const path = require('path');

console.log('Running all code fixes for TypeScript and ESLint issues...');

const scripts = [
  'fix-bcrypt-import.js',
  'fix-img-tags.js',
  'fix-react-hooks.js',
  'fix-unused-vars.js',
  'fix-explicit-any.js'
];

scripts.forEach(script => {
  try {
    console.log(`\nRunning ${script}...`);
    execSync(`node ${path.join(__dirname, script)}`, { stdio: 'inherit' });
    console.log(`Successfully executed ${script}`);
  } catch (error) {
    console.error(`Error executing ${script}: ${error.message}`);
  }
});

console.log('\nRunning ESLint to fix remaining issues...');
try {
  execSync('npm run lint -- --fix', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('Successfully ran ESLint fixes');
} catch (error) {
  console.error(`Error running ESLint: ${error.message}`);
}

console.log('\nAll fix scripts completed. Please check the output for any errors.'); 