import sharp from 'sharp';
const SIZE = 512;
const logo = await sharp('public/images/logo.jpg')
  .resize(SIZE, SIZE, { fit: 'cover' })
  .composite([{
    input: Buffer.from(`<svg><circle cx="${SIZE/2}" cy="${SIZE/2}" r="${SIZE/2}" fill="white"/></svg>`),
    blend: 'dest-in'
  }])
  .png()
  .toFile('public/favicon.png');
await sharp('public/favicon.png').resize(192, 192).toFile('public/favicon-192.png');
await sharp('public/favicon.png').resize(180, 180).toFile('public/apple-icon.png');
await sharp('public/favicon.png').resize(32, 32).toFile('public/favicon-32.png');
console.log('Done! All icons created.');
