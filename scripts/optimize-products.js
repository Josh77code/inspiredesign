#!/usr/bin/env node

/**
 * Product Catalog Optimization Script
 * This script helps optimize a large product catalog (450MB+)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // Source directories
  PRODUCTS_DIR: path.join(__dirname, '../public/Digital Products'),
  DATA_DIR: path.join(__dirname, '../data'),
  
  // Output directories
  OPTIMIZED_DIR: path.join(__dirname, '../public/optimized-products'),
  CDN_DIR: path.join(__dirname, '../public/cdn-ready'),
  
  // Image optimization settings
  IMAGE_SIZES: {
    thumbnail: { width: 300, height: 300, quality: 70 },
    medium: { width: 600, height: 600, quality: 80 },
    large: { width: 1200, height: 1200, quality: 85 }
  },
  
  // Batch processing
  BATCH_SIZE: 50,
  MAX_CONCURRENT: 5
};

/**
 * Step 1: Analyze your product catalog
 */
function analyzeCatalog() {
  console.log('🔍 Analyzing product catalog...');
  
  const productsDir = CONFIG.PRODUCTS_DIR;
  if (!fs.existsSync(productsDir)) {
    console.error('❌ Products directory not found:', productsDir);
    return;
  }
  
  const files = fs.readdirSync(productsDir, { withFileTypes: true });
  const imageFiles = files.filter(file => 
    file.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(file.name)
  );
  
  let totalSize = 0;
  const fileSizes = [];
  
  imageFiles.forEach(file => {
    const filePath = path.join(productsDir, file.name);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
    fileSizes.push({
      name: file.name,
      size: stats.size,
      sizeMB: (stats.size / 1024 / 1024).toFixed(2)
    });
  });
  
  console.log(`📊 Catalog Analysis:`);
  console.log(`   Total files: ${imageFiles.length}`);
  console.log(`   Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   Average file size: ${(totalSize / imageFiles.length / 1024).toFixed(2)} KB`);
  
  // Show largest files
  const largestFiles = fileSizes
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);
  
  console.log(`\n📁 Largest files:`);
  largestFiles.forEach(file => {
    console.log(`   ${file.name}: ${file.sizeMB} MB`);
  });
  
  return {
    totalFiles: imageFiles.length,
    totalSize,
    fileSizes
  };
}

/**
 * Step 2: Create optimized product structure
 */
function createOptimizedStructure() {
  console.log('\n🏗️  Creating optimized structure...');
  
  // Create directories
  const dirs = [
    CONFIG.OPTIMIZED_DIR,
    CONFIG.CDN_DIR,
    path.join(CONFIG.OPTIMIZED_DIR, 'thumbnails'),
    path.join(CONFIG.OPTIMIZED_DIR, 'medium'),
    path.join(CONFIG.OPTIMIZED_DIR, 'large'),
    path.join(CONFIG.CDN_DIR, 'images')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`   ✅ Created: ${dir}`);
    }
  });
}

/**
 * Step 3: Generate product manifest
 */
function generateProductManifest() {
  console.log('\n📋 Generating product manifest...');
  
  const productsDir = CONFIG.PRODUCTS_DIR;
  const files = fs.readdirSync(productsDir, { withFileTypes: true });
  const imageFiles = files.filter(file => 
    file.isFile() && /\.(jpg|jpeg|png|webp)$/i.test(file.name)
  );
  
  const manifest = {
    generated: new Date().toISOString(),
    totalProducts: imageFiles.length,
    products: imageFiles.map(file => ({
      id: path.basename(file.name, path.extname(file.name)),
      originalName: file.name,
      originalPath: `Digital Products/${file.name}`,
      optimizedPath: `optimized-products/${file.name}`,
      cdnPath: `cdn-ready/images/${file.name}`,
      sizes: ['thumbnail', 'medium', 'large']
    }))
  };
  
  const manifestPath = path.join(CONFIG.DATA_DIR, 'product-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  console.log(`   ✅ Manifest created: ${manifestPath}`);
  console.log(`   📊 Products in manifest: ${manifest.products.length}`);
}

/**
 * Step 4: Create CDN-ready structure
 */
function createCDNStructure() {
  console.log('\n☁️  Creating CDN-ready structure...');
  
  const manifestPath = path.join(CONFIG.DATA_DIR, 'product-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ Product manifest not found. Run analysis first.');
    return;
  }
  
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  // Create CDN configuration
  const cdnConfig = {
    provider: 'vercel-blob', // or 'cloudinary', 'aws-s3'
    baseUrl: 'https://your-cdn-domain.com',
    fallbackUrl: '/api/images',
    optimization: {
      autoFormat: true,
      quality: 80,
      progressive: true
    }
  };
  
  const cdnConfigPath = path.join(CONFIG.CDN_DIR, 'cdn-config.json');
  fs.writeFileSync(cdnConfigPath, JSON.stringify(cdnConfig, null, 2));
  
  console.log(`   ✅ CDN config created: ${cdnConfigPath}`);
}

/**
 * Step 5: Generate optimization recommendations
 */
function generateRecommendations(analysis) {
  console.log('\n💡 Optimization Recommendations:');
  
  const recommendations = [];
  
  if (analysis.totalSize > 100 * 1024 * 1024) { // 100MB
    recommendations.push({
      priority: 'HIGH',
      action: 'Compress images',
      description: 'Use WebP format and reduce quality to 80%',
      estimatedSavings: '60-80% size reduction'
    });
  }
  
  if (analysis.totalFiles > 100) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Implement lazy loading',
      description: 'Load products in batches of 20-50',
      estimatedSavings: 'Faster initial page load'
    });
  }
  
  if (analysis.totalSize > 200 * 1024 * 1024) { // 200MB
    recommendations.push({
      priority: 'CRITICAL',
      action: 'Use CDN',
      description: 'Upload images to Cloudinary, AWS S3, or Vercel Blob',
      estimatedSavings: 'Global delivery, reduced server load'
    });
  }
  
  recommendations.push({
    priority: 'MEDIUM',
    action: 'Database migration',
    description: 'Move from JSON to PostgreSQL/Supabase',
    estimatedSavings: 'Better performance, easier management'
  });
  
  recommendations.forEach(rec => {
    const emoji = rec.priority === 'CRITICAL' ? '🚨' : 
                  rec.priority === 'HIGH' ? '⚠️' : '💡';
    console.log(`   ${emoji} [${rec.priority}] ${rec.action}`);
    console.log(`      ${rec.description}`);
    console.log(`      💰 ${rec.estimatedSavings}`);
  });
  
  return recommendations;
}

/**
 * Main execution
 */
function main() {
  console.log('🚀 Product Catalog Optimization Tool');
  console.log('=====================================\n');
  
  // Step 1: Analyze
  const analysis = analyzeCatalog();
  if (!analysis) return;
  
  // Step 2: Create structure
  createOptimizedStructure();
  
  // Step 3: Generate manifest
  generateProductManifest();
  
  // Step 4: CDN structure
  createCDNStructure();
  
  // Step 5: Recommendations
  const recommendations = generateRecommendations(analysis);
  
  console.log('\n✅ Optimization setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Install image optimization tools: npm install sharp');
  console.log('2. Run image optimization script');
  console.log('3. Set up CDN (Cloudinary/AWS S3/Vercel Blob)');
  console.log('4. Update product loading to use pagination');
  console.log('5. Test performance improvements');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  analyzeCatalog,
  createOptimizedStructure,
  generateProductManifest,
  createCDNStructure,
  generateRecommendations
};
