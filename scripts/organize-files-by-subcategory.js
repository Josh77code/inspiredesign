/**
 * Organize files by subcategory and add pricing information
 */

const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const { createClient } = require('@supabase/supabase-js')
const { list } = require('@vercel/blob')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !BLOB_READ_WRITE_TOKEN) {
  console.error('❌ Missing required credentials')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Map product titles to blob folder names
const titleToBlobFolder = {
  'A wife of noble character': 'A wife of noble character',
  'Adonai': 'Adonai',
  'Be the one that come back': 'Be the one that came back',
  'Beleive in You': 'Believe in You',
  'Chosen': 'Chosen',
  'Chosen Generation': 'Chosen Generation',
  'Daughters of Zion': 'Daughter of Zion',
  'Healed Delevered Restored': 'Healed Delivered Restored',
  'Hope': 'Hope',
  'I am enough': 'I am enough',
  'I am saved': 'I am saved',
  'Jesus&Me': 'Jesus & Me',
  'Wonderfully made': 'Wonderfully made'
}

// Pricing structure based on size
const sizePricing = {
  '5x5': 6.50,
  '5x7': 6.50,
  '6x6': 7.70,
  '8x10': 7.70,
  '11x14': 8.50,
  '12x12': 10.00,
  '16x20': 12.00,
  '18x24': 15.00,
  '24x32': 18.00,
  '24x36': 20.00
}

// Extract size from filename
function extractSize(filename) {
  const sizePatterns = [
    /(\d+)x(\d+)/i,
    /(\d+)\s*×\s*(\d+)/i,
    /(\d+)\s*×\s*(\d+)\s*in/i
  ]
  
  for (const pattern of sizePatterns) {
    const match = filename.match(pattern)
    if (match) {
      const size = `${match[1]}x${match[2]}`
      return size
    }
  }
  return null
}

// Get price for a file based on its size
function getFilePrice(filename, fileType) {
  const size = extractSize(filename)
  if (size && sizePricing[size]) {
    return sizePricing[size]
  }
  
  // Default pricing
  if (fileType === 'pdf') {
    return 8.00
  }
  if (fileType === 'image') {
    return 6.50
  }
  return 5.00
}

async function organizeFiles() {
  console.log('📁 Organizing files by subcategory with pricing...\n')
  
  // Get all products from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title')
    .order('id')
  
  if (error) {
    console.error('❌ Error fetching products:', error)
    return
  }
  
  for (const product of products) {
    const blobFolder = titleToBlobFolder[product.title] || product.title
    const prefix = `inspiredesignstudio/${blobFolder}/`
    
    console.log(`📦 Processing: ${product.title}`)
    
    try {
      // List all files for this product
      const { blobs } = await list({
        prefix,
        token: BLOB_READ_WRITE_TOKEN,
      })
      
      if (blobs.length === 0) {
        console.log(`   ⚠️  No files found\n`)
        continue
      }
      
      // Organize by subcategory (folder structure)
      const subcategories = {}
      
      blobs.forEach(blob => {
        const pathParts = blob.pathname.split('/')
        // Get subcategory (folder name after product name)
        const subcategory = pathParts.length > 2 ? pathParts[2] : 'Other'
        
        if (!subcategories[subcategory]) {
          subcategories[subcategory] = {
            name: subcategory,
            images: [],
            pdfs: [],
            files: []
          }
        }
        
        const fileInfo = {
          name: blob.pathname.split('/').pop(),
          path: blob.pathname,
          url: blob.url,
          size: `${(blob.size / 1024 / 1024).toFixed(2)} MB`,
          price: getFilePrice(blob.pathname.split('/').pop() || '', 
            blob.pathname.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image')
        }
        
        subcategories[subcategory].files.push(fileInfo)
        
        if (blob.pathname.toLowerCase().endsWith('.pdf')) {
          subcategories[subcategory].pdfs.push(fileInfo)
        } else if (blob.pathname.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          subcategories[subcategory].images.push(fileInfo)
        }
      })
      
      // Convert to array format
      const subcategoriesArray = Object.values(subcategories).map((subcat) => ({
        name: subcat.name,
        images: subcat.images,
        pdfs: subcat.pdfs,
        files: subcat.files,
        totalFiles: subcat.files.length,
        totalPrice: subcat.files.reduce((sum, f) => sum + f.price, 0)
      }))
      
      console.log(`   ✅ Found ${blobs.length} files in ${subcategoriesArray.length} subcategories`)
      
      // Update product in Supabase
      const { error: updateError } = await supabase
        .from('products')
        .update({
          images: subcategoriesArray.flatMap((s) => s.images),
          pdfs: subcategoriesArray.flatMap((s) => s.pdfs),
          all_files: subcategoriesArray.flatMap((s) => s.files),
          subcategories: subcategoriesArray
        })
        .eq('id', product.id)
      
      if (updateError) {
        console.error(`   ❌ Error updating: ${updateError.message}\n`)
      } else {
        console.log(`   ✅ Updated with ${subcategoriesArray.length} subcategories\n`)
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}\n`)
    }
  }
  
  console.log('✨ Done!')
}

organizeFiles().catch(console.error)

