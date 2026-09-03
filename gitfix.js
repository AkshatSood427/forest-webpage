const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dirs = ['images/gallery', 'images/team', 'images/alumni', 'images/beyond'];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    if (file !== file.toLowerCase()) {
      const oldPath = path.join(dir, file).replace(/\\/g, '/');
      const tmpPath = oldPath + '_TEMP';
      const newPath = path.join(dir, file.toLowerCase()).replace(/\\/g, '/');
      try {
        execSync(`git mv "${oldPath}" "${tmpPath}"`);
        execSync(`git mv "${tmpPath}" "${newPath}"`);
        console.log(`✓ ${file} → ${file.toLowerCase()}`);
      } catch(e) {
        console.log(`skipped: ${file} - ${e.message}`);
      }
    }
  });
});

console.log('Done! Now commit and push.');
