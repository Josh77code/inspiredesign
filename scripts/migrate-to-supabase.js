/**
 * Migration script to move products from JSON file to Supabase
 * 
 * Usage: node scripts/migrate-to-supabase.js
 * 
 * Prerequisites:
 * 1. Supabase project created and schema set up
 * 2. Environment variables configured (.env.local)
 * 3. Images already uploaded to Vercel Blob
 */

const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

// Import Supabase client
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const PRODUCTS_JSON_PATH = path.join(__dirname, '..', 'data', 'products.json')

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

/**
 * Convert old product format to Supabase format
 */
function convertProduct(oldProduct) {
  // Handle both artist and artist_name fields for compatibility
  const artistValue = oldProduct.artist || oldProduct.artist_name || null
  
  return {
    id: oldProduct.id, // Keep same ID if possible, or let Supabase generate
    title: oldProduct.title || oldProduct.name || 'Untitled',
    price: parseFloat(oldProduct.price) || 0,
    category: oldProduct.category || 'Uncategorized',
    description: oldProduct.description || null,
    artist: artistValue,
    artist_name: artistValue, // Keep both for compatibility with existing schema
    rating: parseFloat(oldProduct.rating) || 0,
    downloads: parseInt(oldProduct.downloads) || 0,
    tags: Array.isArray(oldProduct.tags) ? oldProduct.tags : [],
    
    // Image URLs - these should point to Vercel Blob
    // You'll need to update these based on your actual blob structure
    image_url: convertImagePath(oldProduct.image, oldProduct.id),
    image_thumbnail_url: convertImagePath(oldProduct.imageThumbnail || oldProduct.imageThumbnail, oldProduct.id, 'thumbnail'),
    image_large_url: convertImagePath(oldProduct.imageLarge || oldProduct.imageLarge, oldProduct.id, 'large'),
    
    folder_path: oldProduct.folderPath || null,
    download_type: oldProduct.downloadType || 'file',
    download_url: oldProduct.downloadUrl || null,
    
    // File arrays stored as JSONB
    all_files: oldProduct.allFiles || [],
    pdfs: oldProduct.pdfs || [],
    images: oldProduct.images || [],
    
    // Size-based pricing
    size_pricing: {
      "5x5": 6.50,
      "6x6": 7.70,
      "12x12": 10.00
    },
    
    // Timestamps
    created_at: oldProduct.createdAt || new Date().toISOString(),
    updated_at: oldProduct.updatedAt || new Date().toISOString(),
  }
}

/**
 * Convert old image path to Vercel Blob URL
 * Update this function based on your actual blob structure
 */
function convertImagePath(oldPath, productId, size = 'main') {
  if (!oldPath) return null
  
  // If it's already a blob URL, return as-is
  if (oldPath.includes('blob.vercel-storage.com') || oldPath.startsWith('http')) {
    return oldPath
  }
  
  // Example blob structure: products/{id}/{size}.jpg
  // Adjust this based on your actual blob structure
  const blobStoreUrl = process.env.BLOB_STORE_URL || 'https://mr0u602ri2txkwqt.public.blob.vercel-storage.com'
  const filename = oldPath.split('/').pop() || 'image.jpg'
  
  // You can customize this mapping based on your blob structure
  return `${blobStoreUrl}/products/${productId}/${size}.jpg`
}

/**
 * Migrate products to Supabase
 */
async function migrateProducts() {
  console.log('🚀 Starting migration to Supabase...\n')
  
  // Read products from JSON file
  if (!fs.existsSync(PRODUCTS_JSON_PATH)) {
    console.error(`❌ Products file not found: ${PRODUCTS_JSON_PATH}`)
    process.exit(1)
  }
  
  const products = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8'))
  console.log(`📦 Found ${products.length} products to migrate\n`)
  
  // Convert and insert products
  let successCount = 0
  let errorCount = 0
  const errors = []
  
  // Process in batches to avoid overwhelming Supabase
  const batchSize = 10
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize)
    console.log(`📤 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(products.length / batchSize)}...`)
    
    for (const oldProduct of batch) {
      try {
        const newProduct = convertProduct(oldProduct)
        
        // Insert into Supabase
        const { data, error } = await supabase
          .from('products')
          .insert(newProduct)
          .select()
          .single()
        
        if (error) {
          // If product with same ID exists, try update instead
          if (error.code === '23505') { // Unique violation
            console.log(`  ⚠️  Product ${oldProduct.id} already exists, updating...`)
            const { data: updated, error: updateError } = await supabase
              .from('products')
              .update(newProduct)
              .eq('id', oldProduct.id)
              .select()
              .single()
            
            if (updateError) {
              throw updateError
            }
            console.log(`  ✅ Updated product ${oldProduct.id}: ${newProduct.title}`)
            successCount++
          } else {
            throw error
          }
        } else {
          console.log(`  ✅ Migrated product ${oldProduct.id}: ${newProduct.title}`)
          successCount++
        }
      } catch (error) {
        console.error(`  ❌ Error migrating product ${oldProduct.id}:`, error.message)
        errors.push({ productId: oldProduct.id, error: error.message })
        errorCount++
      }
    }
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('📊 Migration Summary:')
  console.log(`  ✅ Successfully migrated: ${successCount}`)
  console.log(`  ❌ Errors: ${errorCount}`)
  
  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:')
    errors.forEach(({ productId, error }) => {
      console.log(`  Product ${productId}: ${error}`)
    })
  }
  
  console.log('\n✨ Migration complete!')
  console.log('\n📝 Next steps:')
  console.log('  1. Verify products in Supabase dashboard')
  console.log('  2. Check image URLs point to Vercel Blob')
  console.log('  3. Update your code to use lib/database-supabase.ts')
  console.log('  4. Test the product pages')
}

// Run migration
migrateProducts().catch(error => {
  console.error('❌ Migration failed:', error)
  process.exit(1)
})

