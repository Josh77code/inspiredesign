#!/usr/bin/env node

/**
 * Image Optimization Script for Inspire Design Catalog
 * Optimizes 182 image files from 223.68 MB to ~50-80 MB
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  sourceDir: path.join(__dirname, '../public/Digital Products'),
  outputDir: path.join(__dirname, '../public/optimized-products'),
  
  // Image optimization settings
  sizes: {
    thumbnail: { width: 300, height: 300, quality: 70 },
    medium: { width: 600, height: 600, quality: 80 },
    large: { width: 1200, height: 1200, quality: 85 }
  },
  
  // Batch processing
  batchSize: 10,
  maxConcurrent: 3
};

/**
 * Recursively find all image files
 */
function findImageFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      findImageFiles(fullPath, files);
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        files.push({
          name: item.name,
          path: fullPath,
          relativePath: path.relative(CONFIG.sourceDir, fullPath),
          size: fs.statSync(fullPath).size
        });
      }
    }
  }
  
  return files;
}

/**
 * Optimize a single image
 */
async function optimizeImage(file, outputDir) {
  const filename = path.basename(file.name, path.extname(file.name));
  const results = [];
  
  try {
    for (const [sizeName, settings] of Object.entries(CONFIG.sizes)) {
      const outputPath = path.join(outputDir, sizeName, `${filename}_${sizeName}.webp`);
      
      // Ensure output directory exists
      const outputDirPath = path.dirname(outputPath);
      if (!fs.existsSync(outputDirPath)) {
        fs.mkdirSync(outputDirPath, { recursive: true });
      }
      
      await sharp(file.path)
        .resize(settings.width, settings.height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: settings.quality })
        .toFile(outputPath);
      
      const optimizedSize = fs.statSync(outputPath).size;
      const compressionRatio = ((file.size - optimizedSize) / file.size * 100).toFixed(1);
      
      results.push({
        size: sizeName,
        originalSize: file.size,
        optimizedSize,
        compressionRatio: `${compressionRatio}%`,
        path: outputPath
      });
    }
    
    return results;
  } catch (error) {
    console.error(`❌ Error optimizing ${file.name}:`, error.message);
    return [];
  }
}

/**
 * Process images in batches
 */
async function processBatch(files, batchIndex, totalBatches) {
  console.log(`\n🔄 Processing batch ${batchIndex + 1}/${totalBatches} (${files.length} files)`);
  
  const results = [];
  
  for (const file of files) {
    console.log(`   📸 Optimizing: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    
    const fileResults = await optimizeImage(file, CONFIG.outputDir);
    results.push({
      file: file.name,
      originalSize: file.size,
      results: fileResults
    });
  }
  
  return results;
}

/**
 * Main optimization function
 */
async function optimizeImages() {
  console.log('🚀 Starting Image Optimization');
  console.log('================================\n');
  
  // Find all image files
  console.log('🔍 Scanning for image files...');
  const imageFiles = findImageFiles(CONFIG.sourceDir);
  
  if (imageFiles.length === 0) {
    console.log('❌ No image files found');
    return;
  }
  
  const totalOriginalSize = imageFiles.reduce((sum, file) => sum + file.size, 0);
  console.log(`📊 Found ${imageFiles.length} image files`);
  console.log(`📊 Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB\n`);
  
  // Create output directories
  Object.keys(CONFIG.sizes).forEach(size => {
    const dir = path.join(CONFIG.outputDir, size);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Process in batches
  const batches = [];
  for (let i = 0; i < imageFiles.length; i += CONFIG.batchSize) {
    batches.push(imageFiles.slice(i, i + CONFIG.batchSize));
  }
  
  console.log(`📦 Processing ${batches.length} batches of ${CONFIG.batchSize} files each\n`);
  
  const allResults = [];
  
  for (let i = 0; i < batches.length; i++) {
    const batchResults = await processBatch(batches[i], i, batches.length);
    allResults.push(...batchResults);
  }
  
  // Calculate final statistics
  console.log('\n📊 Optimization Results:');
  console.log('========================\n');
  
  let totalOptimizedSize = 0;
  let totalCompression = 0;
  
  allResults.forEach(result => {
    result.results.forEach(res => {
      totalOptimizedSize += res.optimizedSize;
      totalCompression += parseFloat(res.compressionRatio);
    });
  });
  
  const totalCompressionRatio = (totalCompression / (allResults.length * Object.keys(CONFIG.sizes).length)).toFixed(1);
  const sizeReduction = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
  
  console.log(`✅ Optimization complete!`);
  console.log(`📊 Original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📊 Optimized size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📊 Size reduction: ${sizeReduction}%`);
  console.log(`📊 Average compression: ${totalCompressionRatio}%`);
  
  // Show some examples
  console.log('\n📁 Sample optimized files:');
  allResults.slice(0, 3).forEach(result => {
    console.log(`   ${result.file}:`);
    result.results.forEach(res => {
      console.log(`     ${res.size}: ${(res.optimizedSize / 1024).toFixed(1)} KB (${res.compressionRatio} smaller)`);
    });
  });
  
  console.log('\n🎯 Next steps:');
  console.log('1. Update your products.json to use optimized images');
  console.log('2. Implement lazy loading for better performance');
  console.log('3. Consider CDN for global delivery');
  console.log('4. Test the optimized images in your application');
  
  return {
    totalFiles: imageFiles.length,
    originalSize: totalOriginalSize,
    optimizedSize: totalOptimizedSize,
    compressionRatio: sizeReduction,
    results: allResults
  };
}

// Run if called directly
if (require.main === module) {
  optimizeImages().catch(console.error);
}

module.exports = { optimizeImages, findImageFiles };
