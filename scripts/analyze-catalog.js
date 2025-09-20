#!/usr/bin/env node

/**
 * Enhanced Product Catalog Analysis
 * Scans all subdirectories for image files
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PRODUCTS_DIR = path.join(__dirname, '../public/Digital Products');

/**
 * Recursively scan directory for image files
 */
function scanDirectory(dir, results = []) {
  if (!fs.existsSync(dir)) {
    console.error('❌ Directory not found:', dir);
    return results;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      // Recursively scan subdirectories
      scanDirectory(fullPath, results);
    } else if (item.isFile()) {
      // Check if it's an image file
      const ext = path.extname(item.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff'].includes(ext)) {
        const stats = fs.statSync(fullPath);
        const relativePath = path.relative(PRODUCTS_DIR, fullPath);
        
        results.push({
          name: item.name,
          path: relativePath,
          fullPath: fullPath,
          size: stats.size,
          sizeMB: (stats.size / 1024 / 1024).toFixed(2),
          extension: ext,
          directory: path.dirname(relativePath)
        });
      }
    }
  }
  
  return results;
}

/**
 * Analyze the catalog
 */
function analyzeCatalog() {
  console.log('🔍 Analyzing product catalog...');
  console.log(`📁 Scanning: ${PRODUCTS_DIR}\n`);
  
  const imageFiles = scanDirectory(PRODUCTS_DIR);
  
  if (imageFiles.length === 0) {
    console.log('❌ No image files found in the Digital Products directory');
    return;
  }
  
  // Calculate statistics
  const totalSize = imageFiles.reduce((sum, file) => sum + file.size, 0);
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  const averageSizeKB = (totalSize / imageFiles.length / 1024).toFixed(2);
  
  console.log('📊 Catalog Analysis:');
  console.log(`   Total image files: ${imageFiles.length}`);
  console.log(`   Total size: ${totalSizeMB} MB`);
  console.log(`   Average file size: ${averageSizeKB} KB`);
  
  // Group by directory
  const byDirectory = {};
  imageFiles.forEach(file => {
    const dir = file.directory || 'root';
    if (!byDirectory[dir]) byDirectory[dir] = [];
    byDirectory[dir].push(file);
  });
  
  console.log(`\n📁 Files by directory:`);
  Object.entries(byDirectory).forEach(([dir, files]) => {
    const dirSize = files.reduce((sum, file) => sum + file.size, 0);
    console.log(`   ${dir}: ${files.length} files (${(dirSize / 1024 / 1024).toFixed(2)} MB)`);
  });
  
  // Show largest files
  const largestFiles = imageFiles
    .sort((a, b) => b.size - a.size)
    .slice(0, 10);
  
  console.log(`\n📁 Largest files:`);
  largestFiles.forEach(file => {
    console.log(`   ${file.name}: ${file.sizeMB} MB (${file.directory})`);
  });
  
  // Show file extensions
  const byExtension = {};
  imageFiles.forEach(file => {
    const ext = file.extension;
    if (!byExtension[ext]) byExtension[ext] = { count: 0, size: 0 };
    byExtension[ext].count++;
    byExtension[ext].size += file.size;
  });
  
  console.log(`\n📊 Files by extension:`);
  Object.entries(byExtension).forEach(([ext, data]) => {
    console.log(`   ${ext}: ${data.count} files (${(data.size / 1024 / 1024).toFixed(2)} MB)`);
  });
  
  // Generate recommendations
  console.log(`\n💡 Optimization Recommendations:`);
  
  if (totalSize > 100 * 1024 * 1024) { // 100MB
    console.log(`   🚨 [CRITICAL] Total size is ${totalSizeMB} MB - needs optimization`);
    console.log(`      → Compress images to reduce size by 60-80%`);
    console.log(`      → Use WebP format for better compression`);
  }
  
  if (imageFiles.length > 100) {
    console.log(`   ⚠️  [HIGH] ${imageFiles.length} files - implement lazy loading`);
    console.log(`      → Load images in batches of 20-50`);
    console.log(`      → Use infinite scroll or pagination`);
  }
  
  if (totalSize > 200 * 1024 * 1024) { // 200MB
    console.log(`   🚨 [CRITICAL] ${totalSizeMB} MB - use CDN`);
    console.log(`      → Upload to Vercel Blob, Cloudinary, or AWS S3`);
    console.log(`      → Serve images from CDN instead of local storage`);
  }
  
  // Check for optimization opportunities
  const largeFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024); // 5MB
  if (largeFiles.length > 0) {
    console.log(`   ⚠️  [HIGH] ${largeFiles.length} files over 5MB need compression`);
    largeFiles.forEach(file => {
      console.log(`      → ${file.name}: ${file.sizeMB} MB`);
    });
  }
  
  console.log(`\n✅ Analysis complete!`);
  console.log(`\n📋 Next steps:`);
  console.log(`1. Install Sharp: npm install sharp`);
  console.log(`2. Run optimization: npm run optimize-products`);
  console.log(`3. Set up CDN for large catalogs`);
  console.log(`4. Implement pagination for better performance`);
  
  return {
    totalFiles: imageFiles.length,
    totalSize,
    totalSizeMB,
    averageSizeKB,
    byDirectory,
    largestFiles,
    byExtension
  };
}

// Run if called directly
if (require.main === module) {
  analyzeCatalog();
}

module.exports = { analyzeCatalog, scanDirectory };
