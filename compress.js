
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const coversDir = './public/demo-posts/covers';
const files = fs.readdirSync(coversDir).filter(f => f.endsWith('.png'));

for (const file of files) {
  const filePath = path.join(coversDir, file);
  const webpPath = filePath.replace('.png', '.webp');
  await sharp(filePath)
    .resize(800) // resize width to max 800px
    .webp({ quality: 80 })
    .toFile(webpPath);
  fs.unlinkSync(filePath);
  console.log(`Compressed ${file} to .webp`);
}

const teamImg = './public/images/team/viet-anh.jpg';
const webpTeam = teamImg.replace('.jpg', '.webp');
await sharp(teamImg)
  .resize(400)
  .webp({ quality: 80 })
  .toFile(webpTeam);
fs.unlinkSync(teamImg);
console.log('Compressed viet-anh.jpg to webp');

