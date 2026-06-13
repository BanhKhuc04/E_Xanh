import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, '../public/og-image.svg');
const pngPath = path.join(__dirname, '../public/og-image.png');

if (fs.existsSync(svgPath)) {
  sharp(svgPath)
    .resize(1200, 630)
    .png()
    .toFile(pngPath)
    .then(() => {
      console.log('Successfully generated og-image.png');
    })
    .catch((err) => {
      console.error('Error generating og-image.png:', err);
    });
} else {
  console.log('og-image.svg not found in public directory.');
}
