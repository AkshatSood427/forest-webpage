const fs = require('fs');
const path = require('path');

const dirs = [
  './images/gallery',
  './images/team',
  './images/alumni',
  './images/beyond'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(file => {
    const oldPath = path.join(dir, file);
    const newPath = path.join(dir, file.toLowerCase());
    if (oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
      console.log(`✓ ${dir}/${file} → ${file.toLowerCase()}`);
    }
  });
});

console.log('All done!');
