const fs = require('fs');
const path = require('path');

// Define category mappings based on folder names
const categoryMappings = {
  'Adonai': 'faith-decor',
  'A wife of noble character': 'wedding-decor',
  'Be the one that came back': 'inspirational',
  'Believe in You': 'inspirational',
  'Brooding of the Holy Spirit': 'christian-faith',
  'Chosen': 'faith-decor',
  'Chosen Generation': 'christian-faith',
  'Daughters of Zion (Contains 6 different separate designs)': 'faith-decor',
  'Healed.Delivered.Restored': 'christian-faith',
  'Hope': 'home-decor',
  'I am enough': 'inspirational',
  'I am saved': 'digital-prints',
  'Jesus &Me': 'love-decor',
  'Rejoice-Pray-Give thanks (Contains 7 different separate designs)': 'christian-faith',
  'Wonderfully Made': 'faith-decor'
};

function analyzeProductFolder(folderPath, folderName) {
  const productPath = path.join(folderPath, folderName);
  
  if (!fs.existsSync(productPath) || !fs.statSync(productPath).isDirectory()) {
    return null;
  }

  const product = {
    name: folderName,
    category: categoryMappings[folderName] || 'uncategorized',
    folderPath: `Digital Products/${folderName}`,
    pdfs: [],
    mockups: [],
    images: [],
    sizes: []
  };

  // Scan folder contents
  const contents = fs.readdirSync(productPath);
  
  contents.forEach(item => {
    const itemPath = path.join(productPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Check for PDF folders
      if (item.toLowerCase().includes('pdf') || item === 'PDFs' || item === 'PDF' || item === 'All pdf sizes') {
        const pdfFiles = fs.readdirSync(itemPath).filter(file => file.endsWith('.pdf'));
        pdfFiles.forEach(pdf => {
          product.pdfs.push({
            name: pdf,
            path: `Digital Products/${folderName}/${item}/${pdf}`,
            size: getSizeFromFilename(pdf)
          });
        });
      }
      
      // Check for mockup folders
      if (item.toLowerCase().includes('mockup') || item === 'Mockups' || item === 'MockUps' || item === 'Mock Ups') {
        const mockupFiles = fs.readdirSync(itemPath).filter(file => 
          file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
        );
        mockupFiles.forEach(mockup => {
          product.mockups.push({
            name: mockup,
            path: `Digital Products/${folderName}/${item}/${mockup}`
          });
        });
      }
      
      // Check for image folders (300dpi, JPG, etc.)
      if (item.toLowerCase().includes('300dpi') || item.toLowerCase().includes('jpg') || item.toLowerCase().includes('jpeg')) {
        const imageFiles = fs.readdirSync(itemPath).filter(file => 
          file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
        );
        imageFiles.forEach(image => {
          if (!image.toLowerCase().includes('thank you')) {
            product.images.push({
              name: image,
              path: `Digital Products/${folderName}/${item}/${image}`,
              size: getSizeFromFilename(image)
            });
          }
        });
      }
    }
  });

  // Extract unique sizes
  const allSizes = [...product.pdfs, ...product.images].map(item => item.size).filter(Boolean);
  product.sizes = [...new Set(allSizes)];

  return product;
}

function getSizeFromFilename(filename) {
  // Extract size from filename patterns like "(12 × 12in)", "(16x20)", etc.
  const sizeMatch = filename.match(/\((\d+)\s*[×x]\s*(\d+)in?\)/i);
  if (sizeMatch) {
    return `${sizeMatch[1]}×${sizeMatch[2]}in`;
  }
  
  // Try other patterns
  const sizeMatch2 = filename.match(/\((\d+)x(\d+)\)/i);
  if (sizeMatch2) {
    return `${sizeMatch2[1]}×${sizeMatch2[2]}in`;
  }
  
  return null;
}

function analyzeDigitalProducts() {
  const digitalProductsPath = path.join(process.cwd(), 'public', 'Digital Products');
  
  if (!fs.existsSync(digitalProductsPath)) {
    console.log('Digital Products folder not found');
    return;
  }

  const folders = fs.readdirSync(digitalProductsPath);
  const products = [];
  const categories = {};

  folders.forEach(folder => {
    if (folder.endsWith('.xlsx') || folder.startsWith('~$')) {
      return; // Skip Excel files
    }
    
    const product = analyzeProductFolder(digitalProductsPath, folder);
    if (product) {
      products.push(product);
      
      // Group by category
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    }
  });

  // Generate report
  console.log('=== DIGITAL PRODUCTS ANALYSIS ===\n');
  
  console.log('📊 SUMMARY:');
  console.log(`Total Products: ${products.length}`);
  console.log(`Total Categories: ${Object.keys(categories).length}\n`);

  console.log('📁 CATEGORIES:');
  Object.entries(categories).forEach(([category, categoryProducts]) => {
    console.log(`\n🏷️  ${category.toUpperCase()} (${categoryProducts.length} products):`);
    categoryProducts.forEach(product => {
      console.log(`   • ${product.name}`);
      console.log(`     - PDFs: ${product.pdfs.length}`);
      console.log(`     - Mockups: ${product.mockups.length}`);
      console.log(`     - Images: ${product.images.length}`);
      console.log(`     - Sizes: ${product.sizes.join(', ') || 'Various'}`);
    });
  });

  // Save detailed analysis
  const analysisPath = path.join(process.cwd(), 'data', 'category-analysis.json');
  fs.writeFileSync(analysisPath, JSON.stringify({
    products,
    categories,
    summary: {
      totalProducts: products.length,
      totalCategories: Object.keys(categories).length,
      generatedAt: new Date().toISOString()
    }
  }, null, 2));

  console.log(`\n💾 Detailed analysis saved to: ${analysisPath}`);
  
  return { products, categories };
}

// Run the analysis
if (require.main === module) {
  analyzeDigitalProducts();
}

module.exports = { analyzeDigitalProducts, analyzeProductFolder };

