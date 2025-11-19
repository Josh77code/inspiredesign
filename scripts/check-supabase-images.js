/**
 * Check what image URLs are stored in Supabase products
 */

const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function checkImages() {
  console.log('🔍 Checking image URLs in Supabase products...\n')
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, image_url, image_thumbnail_url, image_large_url, folder_path')
    .order('id')
  
  if (error) {
    console.error('❌ Error fetching products:', error)
    return
  }
  
  console.log(`Found ${products.length} products:\n`)
  
  products.forEach((product, index) => {
    console.log(`${index + 1}. ${product.title} (ID: ${product.id})`)
    console.log(`   Main Image: ${product.image_url || 'NULL'}`)
    console.log(`   Thumbnail: ${product.image_thumbnail_url || 'NULL'}`)
    console.log(`   Large: ${product.image_large_url || 'NULL'}`)
    console.log(`   Folder Path: ${product.folder_path || 'NULL'}`)
    console.log('')
  })
  
  // Count blob URLs vs local paths
  const blobUrls = products.filter(p => 
    p.image_url && p.image_url.includes('blob.vercel-storage.com')
  ).length
  
  const localPaths = products.filter(p => 
    p.image_url && !p.image_url.includes('blob.vercel-storage.com') && !p.image_url.startsWith('http')
  ).length
  
  console.log(`\n📊 Summary:`)
  console.log(`   Blob URLs: ${blobUrls}`)
  console.log(`   Local paths: ${localPaths}`)
  console.log(`   Null/Empty: ${products.length - blobUrls - localPaths}`)
}

checkImages().catch(console.error)

