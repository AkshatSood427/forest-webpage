const { execSync } = require('child_process');
const fs = require('fs');

const files = execSync('git ls-files images/gallery/').toString().trim().split('\n');

files.forEach(file => {
  if (file.includes('_temp')) {
    const newFile = file.replace('_temp_temp', '').replace('_temp', '');
    try {
      execSync(`git mv "${file}" "${newFile}"`);
      console.log(`✓ ${file} → ${newFile}`);
    } catch(e) {
      console.log(`skipped: ${file}`);
    }
  }
});

console.log('Done! Now commit and push.');