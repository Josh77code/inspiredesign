const fs = require('fs');
const path = require('path');

// Path to the New Digital Product folder
const NEW_PRODUCTS_DIR = path.join(process.cwd(), 'public', 'New Digital Product');
const OUTPUT_FILE = path.join(process.cwd(), 'data', 'products.json');

// Helper function to get all files in a directory recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Helper function to categorize files
function categorizeFiles(files, productFolder) {
  const categorized = {
    mockups: [],
    pdfs: [],
    images: [],
    videos: [],
    all: []
  };

  files.forEach((file) => {
    const relativePath = file.replace(process.cwd(), '').replace(/\\/g, '/');
    const fileName = path.basename(file);
    const ext = path.extname(file).toLowerCase();

    const fileObj = {
      name: fileName,
      path: relativePath,
      size: getFileSizeInMB(file)
    };

    categorized.all.push(fileObj);

    // Categorize by type
    if (fileName.toLowerCase().includes('mockup') || fileName.toLowerCase().includes('mock')) {
      categorized.mockups.push(fileObj);
    } else if (ext === '.pdf') {
      categorized.pdfs.push(fileObj);
    } else if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
      categorized.images.push(fileObj);
    } else if (['.mp4', '.mov', '.avi'].includes(ext)) {
      categorized.videos.push(fileObj);
    }
  });

  return categorized;
}

// Helper to get file size in MB
function getFileSizeInMB(filePath) {
  const stats = fs.statSync(filePath);
  return (stats.size / (1024 * 1024)).toFixed(2) + ' MB';
}

// Helper to find the best thumbnail/preview image
function findPreviewImage(files) {
  // Priority: mockups > jpg/png images > first image
  const mockup = files.find(f => 
    path.basename(f).toLowerCase().includes('mockup') && 
    ['.jpg', '.jpeg', '.png'].includes(path.extname(f).toLowerCase())
  );
  
  if (mockup) return mockup.replace(process.cwd(), '').replace(/\\/g, '/');

  const image = files.find(f => 
    ['.jpg', '.jpeg', '.png'].includes(path.extname(f).toLowerCase())
  );
  
  if (image) return image.replace(process.cwd(), '').replace(/\\/g, '/');

  return '/placeholder.svg';
}

// Category mapping for better organization
function getCategoryFromName(name) {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('wife') || nameLower.includes('character')) return 'Scripture Art';
  if (nameLower.includes('adonai') || nameLower.includes('jesus')) return 'Names of God';
  if (nameLower.includes('chosen') || nameLower.includes('saved')) return 'Identity in Christ';
  if (nameLower.includes('healed') || nameLower.includes('delivered')) return 'Healing & Deliverance';
  if (nameLower.includes('hope') || nameLower.includes('believe')) return 'Faith & Hope';
  if (nameLower.includes('daughter') || nameLower.includes('zion')) return 'Prophetic Art';
  if (nameLower.includes('wonderfully') || nameLower.includes('enough')) return 'Affirmations';
  
  return 'Faith-Based Art';
}

// Generate product data
function generateProducts() {
  console.log('🔍 Scanning New Digital Product folder...\n');

  if (!fs.existsSync(NEW_PRODUCTS_DIR)) {
    console.error('❌ New Digital Product folder not found!');
    return;
  }

  const productFolders = fs.readdirSync(NEW_PRODUCTS_DIR).filter((item) => {
    return fs.statSync(path.join(NEW_PRODUCTS_DIR, item)).isDirectory();
  });

  console.log(`📁 Found ${productFolders.length} product folders\n`);

  const products = [];
  let productId = 1;

  productFolders.forEach((folderName) => {
    console.log(`Processing: ${folderName}`);
    
    const folderPath = path.join(NEW_PRODUCTS_DIR, folderName);
    const files = getAllFiles(folderPath);
    const categorized = categorizeFiles(files, folderName);
    
    // Calculate base price based on content
    const pdfCount = categorized.pdfs.length;
    const imageCount = categorized.images.length;
    const hasVideo = categorized.videos.length > 0;
    
    let basePrice = 5.99;
    if (pdfCount > 3) basePrice = 9.99;
    if (pdfCount > 5 || hasVideo) basePrice = 12.99;
    if (imageCount > 5 && pdfCount > 5) basePrice = 14.99;

    const product = {
      id: productId++,
      title: folderName,
      price: basePrice,
      category: getCategoryFromName(folderName),
      image: findPreviewImage(files),
      artist: 'Inspire Design',
      rating: 5.0,
      downloads: 0,
      description: `Complete digital download package for "${folderName}". Includes all files: ${pdfCount} PDF(s), ${imageCount} high-resolution image(s), ${categorized.mockups.length} mockup(s)${hasVideo ? ', and video content' : ''}. Perfect for printing, framing, or digital use.`,
      
      // Folder-based download system
      folderPath: `/New Digital Product/${folderName}`,
      downloadType: 'folder', // Indicates this is a folder-based product
      
      // All files included
      allFiles: categorized.all,
      pdfs: categorized.pdfs,
      images: categorized.images,
      mockups: categorized.mockups,
      videos: categorized.videos,
      
      // Metadata
      totalFiles: categorized.all.length,
      totalSize: categorized.all.reduce((sum, file) => {
        return sum + parseFloat(file.size);
      }, 0).toFixed(2) + ' MB',
      
      // Pricing tiers (optional for different package sizes)
      pricing: {
        'Basic (Digital Files)': basePrice,
        'Premium (All Files + Commercial License)': (basePrice * 1.5).toFixed(2)
      },
      
      // Product features
      features: [
        `${pdfCount} Print-Ready PDF Files`,
        `${imageCount} High-Resolution Images (300 DPI)`,
        `${categorized.mockups.length} Professional Mockups`,
        hasVideo ? 'Video Preview Included' : 'Instant Digital Download',
        'Multiple Size Options',
        'Lifetime Access',
        'Commercial Use Available'
      ],
      
      // Available formats
      formats: [...new Set(categorized.all.map(f => path.extname(f.path).toUpperCase().replace('.', '')))],
      
      // Tags for search
      tags: [
        folderName.toLowerCase(),
        getCategoryFromName(folderName).toLowerCase(),
        'christian',
        'faith-based',
        'digital print',
        'wall art',
        'instant download'
      ],
      
      // Payment required
      requiresPayment: true,
      downloadAvailable: true,
      
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    products.push(product);
    
    console.log(`  ✅ ${categorized.all.length} files | ${pdfCount} PDFs | ${imageCount} images | €${basePrice}`);
  });

  console.log(`\n📦 Generated ${products.length} products\n`);

  // Save to products.json
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2));
  console.log(`✅ Products saved to: ${OUTPUT_FILE}\n`);

  // Print summary
  console.log('📊 Summary:');
  console.log(`   Total Products: ${products.length}`);
  console.log(`   Categories: ${[...new Set(products.map(p => p.category))].join(', ')}`);
  console.log(`   Total Files: ${products.reduce((sum, p) => sum + p.totalFiles, 0)}`);
  console.log('\n✨ Done! Run your app to see the new products.\n');
}

// Run the script
generateProducts();

