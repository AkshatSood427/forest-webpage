const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './images/gallery';
const outputDir = './images/gallery-compressed';

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const files = fs.readdirSync(inputDir).filter(f => f.toLowerCase().endsWith('.jpg'));

console.log(`Found ${files.length} images. Processing...`);

Promise.all(files.map(file => {
  return sharp(path.join(inputDir, file))
    .resize(1200, 800, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 75 })
    .toFile(path.join(outputDir, file))
    .then(() => console.log(`✓ ${file}`));
})).then(() => {
  console.log('All done! Compressed images are in gallery-compressed/');
}).catch(err => console.error(err));