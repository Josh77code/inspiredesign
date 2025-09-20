// Image optimization utilities
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Optimize product images
 * @param {string} inputPath - Path to original image
 * @param {string} outputDir - Directory to save optimized images
 * @param {Object} sizes - Different sizes to generate
 */
async function optimizeProductImages(inputPath, outputDir, sizes = {
  thumbnail: { width: 300, height: 300 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 }
}) {
  const filename = path.basename(inputPath, path.extname(inputPath));
  
  for (const [sizeName, dimensions] of Object.entries(sizes)) {
    const outputPath = path.join(outputDir, `${filename}_${sizeName}.webp`);
    
    await sharp(inputPath)
      .resize(dimensions.width, dimensions.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    console.log(`Generated ${sizeName} image: ${outputPath}`);
  }
}

/**
 * Batch optimize all product images
 */
async function batchOptimizeImages(productsDir) {
  const files = fs.readdirSync(productsDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );
  
  console.log(`Found ${imageFiles.length} images to optimize`);
  
  for (const file of imageFiles) {
    const inputPath = path.join(productsDir, file);
    const outputDir = path.join(productsDir, 'optimized');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    try {
      await optimizeProductImages(inputPath, outputDir);
    } catch (error) {
      console.error(`Error optimizing ${file}:`, error);
    }
  }
}

module.exports = {
  optimizeProductImages,
  batchOptimizeImages
};
