#!/usr/bin/env node

/**
 * Fix image paths in products.json to match actual optimized image filenames
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PRODUCTS_JSON_PATH = path.join(__dirname, '../data/products.json');
const OPTIMIZED_DIR = path.join(__dirname, '../public/optimized-products/medium');

/**
 * Get actual optimized image filenames
 */
function getOptimizedImages() {
  if (!fs.existsSync(OPTIMIZED_DIR)) {
    console.log('❌ Optimized images directory not found');
    return [];
  }
  
  const files = fs.readdirSync(OPTIMIZED_DIR);
  return files.filter(file => file.endsWith('_medium.webp'));
}

/**
 * Find best matching image for a product
 */
function findBestImage(productName, availableImages) {
  // Simple matching logic - you can improve this
  const productLower = productName.toLowerCase();
  
  // Try to find exact matches first
  for (const image of availableImages) {
    const imageLower = image.toLowerCase();
    if (imageLower.includes('adonai') && productLower.includes('adonai')) {
      return image;
    }
    if (imageLower.includes('believe') && productLower.includes('believe')) {
      return image;
    }
    if (imageLower.includes('hope') && productLower.includes('hope')) {
      return image;
    }
    if (imageLower.includes('healed') && productLower.includes('healed')) {
      return image;
    }
    if (imageLower.includes('jesus') && productLower.includes('jesus')) {
      return image;
    }
  }
  
  // Fallback to first available image
  return availableImages[0] || 'placeholder.jpg';
}

/**
 * Fix image paths in products.json
 */
function fixImagePaths() {
  console.log('🔧 Fixing image paths in products.json...\n');
  
  // Get available optimized images
  const availableImages = getOptimizedImages();
  console.log(`📁 Found ${availableImages.length} optimized images`);
  
  if (availableImages.length === 0) {
    console.log('❌ No optimized images found');
    return;
  }
  
  // Read current products.json
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8'));
  console.log(`📊 Found ${products.length} products to update\n`);
  
  // Update each product
  let updatedCount = 0;
  
  products.forEach((product, index) => {
    console.log(`📸 Updating product ${index + 1}: ${product.name}`);
    
    const bestImage = findBestImage(product.name, availableImages);
    const oldImage = product.image;
    product.image = `/optimized-products/medium/${bestImage}`;
    product.imageThumbnail = `/optimized-products/thumbnail/${bestImage.replace('_medium', '_thumbnail')}`;
    product.imageLarge = `/optimized-products/large/${bestImage.replace('_medium', '_large')}`;
    
    console.log(`   Old: ${oldImage}`);
    console.log(`   New: ${product.image}`);
    updatedCount++;
  });
  
  // Create backup
  const backupPath = PRODUCTS_JSON_PATH + '.backup.' + Date.now();
  fs.copyFileSync(PRODUCTS_JSON_PATH, backupPath);
  console.log(`\n💾 Backup created: ${backupPath}`);
  
  // Write updated products.json
  fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(products, null, 2));
  
  console.log(`\n✅ Updated ${updatedCount} products with correct image paths`);
  console.log(`📁 Images are in: /public/optimized-products/`);
  
  return products;
}

// Run if called directly
if (require.main === module) {
  fixImagePaths();
}

module.exports = { fixImagePaths, getOptimizedImages, findBestImage };
