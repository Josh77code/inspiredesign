#!/usr/bin/env node

/**
 * Update ALL products with correct optimized image paths
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PRODUCTS_JSON_PATH = path.join(__dirname, '../data/products.json');
const OPTIMIZED_DIR = path.join(__dirname, '../public/optimized-products/medium');

/**
 * Get all available optimized images
 */
function getAvailableImages() {
  if (!fs.existsSync(OPTIMIZED_DIR)) {
    console.log('❌ Optimized images directory not found');
    return [];
  }
  
  const files = fs.readdirSync(OPTIMIZED_DIR);
  return files.filter(file => file.endsWith('_medium.webp'));
}

/**
 * Update all products with correct images
 */
function updateAllProducts() {
  console.log('🔄 Updating ALL products with correct image paths...\n');
  
  const availableImages = getAvailableImages();
  console.log(`📁 Found ${availableImages.length} optimized images`);
  
  // Define specific image mappings for each product
  const productImageMappings = {
    1: "Adonai (12 × 12in) - No Broader_medium.webp",
    2: "Believe in You (11 × 14in)_medium.webp", 
    3: "Hope -Black Background (24 × 32in)_medium.webp",
    4: "Healed.Delivered.Restored - 1_medium.webp",
    5: "Healed.Delivered.Restored - 2_medium.webp",
    6: "Healed.Delivered.Restored - 3_medium.webp",
    7: "Jesus & Me  (12 × 12in)_medium.webp"
  };
  
  // Read current products.json
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8'));
  console.log(`📊 Found ${products.length} products to update\n`);
  
  // Update each product with specific images
  products.forEach((product, index) => {
    const imageName = productImageMappings[product.id];
    
    if (imageName && availableImages.includes(imageName)) {
      console.log(`✅ Product ${product.id}: ${product.name}`);
      console.log(`   Image: ${imageName}`);
      
      product.image = `/optimized-products/medium/${imageName}`;
      product.imageThumbnail = `/optimized-products/thumbnail/${imageName.replace('_medium', '_thumbnail')}`;
      product.imageLarge = `/optimized-products/large/${imageName.replace('_medium', '_large')}`;
    } else {
      console.log(`❌ Product ${product.id}: ${product.name} - Image not found`);
      console.log(`   Looking for: ${imageName}`);
      console.log(`   Available: ${availableImages.slice(0, 5).join(', ')}...`);
      
      // Fallback to first available image
      if (availableImages.length > 0) {
        const fallbackImage = availableImages[0];
        product.image = `/optimized-products/medium/${fallbackImage}`;
        product.imageThumbnail = `/optimized-products/thumbnail/${fallbackImage.replace('_medium', '_thumbnail')}`;
        product.imageLarge = `/optimized-products/large/${fallbackImage.replace('_medium', '_large')}`;
        console.log(`   Using fallback: ${fallbackImage}`);
      }
    }
    
    console.log('');
  });
  
  // Create backup
  const backupPath = PRODUCTS_JSON_PATH + '.backup.' + Date.now();
  fs.copyFileSync(PRODUCTS_JSON_PATH, backupPath);
  console.log(`💾 Backup created: ${backupPath}`);
  
  // Write updated products.json
  fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(products, null, 2));
  
  console.log(`✅ Updated ${products.length} products with correct image paths`);
  console.log(`📁 All images are in: /public/optimized-products/`);
  
  return products;
}

// Run if called directly
if (require.main === module) {
  updateAllProducts();
}

module.exports = { updateAllProducts, getAvailableImages };
