const fs = require('fs');
const path = require('path');

// Path to the file with the import error
const filePath = path.join(__dirname, '../src/app/api/auth/reset-password/route.ts');

// Read the file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }

  // Replace the default import with named import
  const result = data.replace(
    /import bcrypt from ['"]bcryptjs['"];/g, 
    `import * as bcryptjs from 'bcryptjs';`
  );

  // Replace all bcrypt. with bcryptjs.
  const finalResult = result.replace(/bcrypt\./g, 'bcryptjs.');

  // Write the file
  fs.writeFile(filePath, finalResult, 'utf8', (err) => {
    if (err) {
      console.error(`Error writing file: ${err}`);
      return;
    }
    console.log('Successfully fixed bcryptjs import in reset-password route');
  });
}); 