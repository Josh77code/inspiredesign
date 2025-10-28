const fs = require('fs');
const path = require('path');

const PRODUCTS_JSON_PATH = path.join(__dirname, '..', 'data', 'products.json');

// Get available optimized images
function getOptimizedImages() {
  const mediumDir = path.join(__dirname, '..', 'public', 'optimized-products', 'medium');
  const files = fs.readdirSync(mediumDir);
  return files.filter(file => file.endsWith('_medium.webp'));
}

// Map product titles to optimized images
const productImageMappings = {
  "A wife of noble character": "A wife of noble character (4.5 ratio)_medium.webp",
  "Adonai": "Adonai (12 × 12in) - No Broader_medium.webp",
  "Be the one that came back": "Be that one that came back (8x10)_medium.webp",
  "Believe in You": "Believe in You (16 × 20in)_medium.webp",
  "Chosen": "Chosen- Black Boarder_medium.webp",
  "Chosen Generation": "Chosen generation- Black Background_medium.webp",
  "Daughters of Zion (Contains 6 different separate designs)": "16x20_medium.webp",
  "Healed.Delivered.Restored": "Healed.Delivered.Restored - 1_medium.webp",
  "Hope": "Hope -Black Background (24 × 32in)_medium.webp",
  "I am enough": "I am enough (16x20)_medium.webp",
  "I am saved": "I AM saved  (11 × 14in)_medium.webp",
  "Jesus &Me": "Jesus & Me  (12 × 12in)_medium.webp",
  "Wonderfully Made": "Wonderfully Made (11 × 14in)_medium.webp"
};

function fixProductImages() {
  console.log('🖼️ Fixing product images...\n');
  
  // Read current products.json
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8'));
  console.log(`📊 Found ${products.length} products to update\n`);
  
  // Get available optimized images
  const availableImages = getOptimizedImages();
  console.log(`📁 Found ${availableImages.length} optimized images\n`);
  
  let updatedCount = 0;
  
  // Update each product
  products.forEach((product, index) => {
    console.log(`📸 Updating product ${index + 1}: ${product.title}`);
    
    const imageName = productImageMappings[product.title];
    
    if (imageName && availableImages.includes(imageName)) {
      const oldImage = product.image;
      product.image = `/optimized-products/medium/${imageName}`;
      
      console.log(`   ✅ Updated: ${oldImage} → ${product.image}`);
      updatedCount++;
    } else {
      console.log(`   ❌ No optimized image found for: ${product.title}`);
      console.log(`   Looking for: ${imageName}`);
      
      // Use fallback image
      if (availableImages.length > 0) {
        const fallbackImage = availableImages[0];
        product.image = `/optimized-products/medium/${fallbackImage}`;
        console.log(`   🔄 Using fallback: ${fallbackImage}`);
        updatedCount++;
      }
    }
    
    console.log('');
  });
  
  // Create backup
  const backupPath = PRODUCTS_JSON_PATH + '.backup.' + Date.now();
  fs.copyFileSync(PRODUCTS_JSON_PATH, backupPath);
  console.log(`💾 Backup created: ${backupPath}\n`);
  
  // Write updated products.json
  fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(products, null, 2));
  
  console.log(`✅ Updated ${updatedCount} products with optimized images`);
  console.log(`📁 Images are in: /public/optimized-products/medium/`);
  
  return products;
}

// Run if called directly
if (require.main === module) {
  fixProductImages();
}

module.exports = { fixProductImages };
