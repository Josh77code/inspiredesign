/**
 * Fix image URLs in Supabase to match actual Vercel Blob structure
 */

const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
const BLOB_STORE_URL = process.env.BLOB_STORE_URL || 'https://mr0u602ri2txkwqt.public.blob.vercel-storage.com'
const PRODUCTS_JSON_PATH = path.join(__dirname, '..', 'data', 'products.json')

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Map product titles to blob paths
function getBlobImagePath(productTitle, oldImagePath) {
  // Base path in blob storage
  const basePath = 'inspiredesignstudio'
  
  // Map product titles to blob folder names
  const titleMap = {
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
  
  const folderName = titleMap[productTitle] || productTitle
  
  // Extract filename from old path
  const filename = oldImagePath ? oldImagePath.split('/').pop() : null
  
  // Try to find the image in blob structure
  // Most images are in 300dpi, 30dpi, or 300JPG folders
  if (filename) {
    // Check common patterns
    if (filename.includes('.jpg') || filename.includes('.png')) {
      // Map specific products to their correct folder structure
      const folderMap = {
        'A wife of noble character': '30dpi',
        'Adonai': 'Adonai 300 dpi',
        'Be the one that came back': 'Be that one-300dpi JPG',
        'Believe in You': '300JPG',
        'Chosen': 'Chosen 300dpi JPEG',
        'Chosen Generation': '300dpi JPG',
        'Daughter of Zion': '300dp1 JPG',
        'Healed Delivered Restored': 'H.D.R 300dpi 12x12 prints',
        'Hope': 'Hope 300dpi',
        'I am saved': '300dpi JPG',
        'Jesus & Me': '300dpi',
        'Wonderfully made': '300dpi'
      }
      
      const subfolder = folderMap[folderName] || '300dpi'
      return `${basePath}/${folderName}/${subfolder}/${filename}`
    }
  }
  
  // Fallback: return null to keep using folder_path
  return null
}

async function fixImageUrls() {
  console.log('🔧 Fixing image URLs in Supabase...\n')
  
  // Read products from JSON to get original image paths
  if (!fs.existsSync(PRODUCTS_JSON_PATH)) {
    console.error(`❌ Products file not found: ${PRODUCTS_JSON_PATH}`)
    process.exit(1)
  }
  
  const productsJson = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8'))
  
  // Get products from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, image_url, folder_path')
    .order('id')
  
  if (error) {
    console.error('❌ Error fetching products:', error)
    return
  }
  
  console.log(`Found ${products.length} products to update\n`)
  
  let updated = 0
  let skipped = 0
  
  for (const product of products) {
    // Find matching product in JSON
    const jsonProduct = productsJson.find(p => p.title === product.title)
    
    if (!jsonProduct || !jsonProduct.image) {
      console.log(`⚠️  Skipping ${product.title} - no image in JSON`)
      skipped++
      continue
    }
    
    // Get blob path
    const blobPath = getBlobImagePath(product.title, jsonProduct.image)
    
    if (!blobPath) {
      console.log(`⚠️  Skipping ${product.title} - could not map to blob path`)
      skipped++
      continue
    }
    
    // Build proper blob URL with encoding
    const pathParts = blobPath.split('/')
    const encodedParts = pathParts.map(part => encodeURIComponent(part))
    const blobUrl = `${BLOB_STORE_URL}/${encodedParts.join('/')}`
    
    // Update in Supabase
    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: blobUrl })
      .eq('id', product.id)
    
    if (updateError) {
      console.error(`❌ Error updating ${product.title}:`, updateError.message)
    } else {
      console.log(`✅ Updated ${product.title}`)
      console.log(`   Old: ${product.image_url}`)
      console.log(`   New: ${blobUrl}`)
      updated++
    }
  }
  
  console.log(`\n📊 Summary:`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`\n✨ Done!`)
}

fixImageUrls().catch(console.error)

