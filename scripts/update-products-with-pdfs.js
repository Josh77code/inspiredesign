const fs = require('fs');
const path = require('path');
const { analyzeDigitalProducts } = require('./analyze-categories');

function updateProductsWithPDFsAndMockups() {
  // Load current products
  const productsPath = path.join(process.cwd(), 'data', 'products.json');
  const currentProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
  
  // Analyze folder structure
  const { products: folderProducts } = analyzeDigitalProducts();
  
  console.log('🔄 Updating products with PDF and mockup information...\n');
  
  // Create a mapping from folder name to folder data
  const folderMap = {};
  folderProducts.forEach(folder => {
    folderMap[folder.name] = folder;
  });
  
  // Update each product with PDF and mockup data
  const updatedProducts = currentProducts.map(product => {
    // Try to match product with folder
    let matchedFolder = null;
    
    // Direct name match
    if (folderMap[product.name]) {
      matchedFolder = folderMap[product.name];
    } else {
      // Try partial matches
      for (const [folderName, folderData] of Object.entries(folderMap)) {
        if (product.name.toLowerCase().includes(folderName.toLowerCase()) ||
            folderName.toLowerCase().includes(product.name.toLowerCase())) {
          matchedFolder = folderData;
          break;
        }
      }
    }
    
    if (matchedFolder) {
      console.log(`✅ Updated: ${product.name}`);
      console.log(`   📄 PDFs: ${matchedFolder.pdfs.length}`);
      console.log(`   🖼️  Mockups: ${matchedFolder.mockups.length}`);
      console.log(`   📏 Sizes: ${matchedFolder.sizes.join(', ') || 'Various'}`);
      
      return {
        ...product,
        pdfs: matchedFolder.pdfs,
        mockups: matchedFolder.mockups,
        folderPath: matchedFolder.folderPath,
        sizes: matchedFolder.sizes
      };
    } else {
      console.log(`⚠️  No folder match found for: ${product.name}`);
      return product;
    }
  });
  
  // Save updated products
  fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));
  
  console.log(`\n💾 Updated ${updatedProducts.length} products in products.json`);
  
  // Generate summary
  const productsWithPDFs = updatedProducts.filter(p => p.pdfs && p.pdfs.length > 0);
  const productsWithMockups = updatedProducts.filter(p => p.mockups && p.mockups.length > 0);
  
  console.log(`\n📊 SUMMARY:`);
  console.log(`   Products with PDFs: ${productsWithPDFs.length}`);
  console.log(`   Products with Mockups: ${productsWithMockups.length}`);
  console.log(`   Total PDFs: ${productsWithPDFs.reduce((sum, p) => sum + p.pdfs.length, 0)}`);
  console.log(`   Total Mockups: ${productsWithMockups.reduce((sum, p) => sum + p.mockups.length, 0)}`);
  
  // Category breakdown
  const categoryStats = {};
  updatedProducts.forEach(product => {
    if (!categoryStats[product.category]) {
      categoryStats[product.category] = {
        total: 0,
        withPDFs: 0,
        withMockups: 0,
        totalPDFs: 0,
        totalMockups: 0
      };
    }
    
    categoryStats[product.category].total++;
    if (product.pdfs && product.pdfs.length > 0) {
      categoryStats[product.category].withPDFs++;
      categoryStats[product.category].totalPDFs += product.pdfs.length;
    }
    if (product.mockups && product.mockups.length > 0) {
      categoryStats[product.category].withMockups++;
      categoryStats[product.category].totalMockups += product.mockups.length;
    }
  });
  
  console.log(`\n📁 CATEGORY BREAKDOWN:`);
  Object.entries(categoryStats).forEach(([category, stats]) => {
    console.log(`   ${category.toUpperCase()}:`);
    console.log(`     Products: ${stats.total}`);
    console.log(`     With PDFs: ${stats.withPDFs} (${stats.totalPDFs} total PDFs)`);
    console.log(`     With Mockups: ${stats.withMockups} (${stats.totalMockups} total mockups)`);
  });
  
  return updatedProducts;
}

// Run the update
if (require.main === module) {
  updateProductsWithPDFsAndMockups();
}

module.exports = { updateProductsWithPDFsAndMockups };

