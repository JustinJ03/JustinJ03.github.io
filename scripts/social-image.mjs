import sharp from 'sharp';
await sharp('public/images/social-preview.svg').png().toFile('public/images/social-preview.png');
console.log('Generated 1200 × 630 social preview from the original SVG.');
