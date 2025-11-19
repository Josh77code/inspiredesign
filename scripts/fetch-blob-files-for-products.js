/**
 * Fetch all images and PDFs from Vercel Blob for each product and update Supabase
 */

const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const { createClient } = require('@supabase/supabase-js')
const { list } = require('@vercel/blob')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
const BLOB_STORE_URL = process.env.BLOB_STORE_URL || 'https://mr0u602ri2txkwqt.public.blob.vercel-storage.com'
const PRODUCTS_JSON_PATH = path.join(__dirname, '..', 'data', 'products.json')

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

async function fetchBlobFiles() {
  console.log('🔍 Fetching files from Vercel Blob for all products...\n')
  
  // Get all products from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title')
    .order('id')
  
  if (error) {
    console.error('❌ Error fetching products:', error)
    return
  }
  
  console.log(`Found ${products.length} products\n`)
  
  for (const product of products) {
    const blobFolder = titleToBlobFolder[product.title] || product.title
    const prefix = `inspiredesignstudio/${blobFolder}/`
    
    console.log(`📦 Processing: ${product.title}`)
    console.log(`   Blob prefix: ${prefix}`)
    
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
      
      // Separate images, PDFs, and other files
      const images = []
      const pdfs = []
      const allFiles = []
      
      blobs.forEach(blob => {
        const fileInfo = {
          name: blob.pathname.split('/').pop(),
          path: blob.pathname,
          url: blob.url,
          size: `${(blob.size / 1024 / 1024).toFixed(2)} MB`
        }
        
        allFiles.push(fileInfo)
        
        if (blob.pathname.toLowerCase().endsWith('.pdf')) {
          pdfs.push(fileInfo)
        } else if (blob.pathname.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          images.push(fileInfo)
        }
      })
      
      console.log(`   ✅ Found ${allFiles.length} files (${images.length} images, ${pdfs.length} PDFs)`)
      
      // Update product in Supabase
      const { error: updateError } = await supabase
        .from('products')
        .update({
          images: images,
          pdfs: pdfs,
          all_files: allFiles
        })
        .eq('id', product.id)
      
      if (updateError) {
        console.error(`   ❌ Error updating: ${updateError.message}\n`)
      } else {
        console.log(`   ✅ Updated successfully\n`)
      }
    } catch (error) {
      console.error(`   ❌ Error fetching files: ${error.message}\n`)
    }
  }
  
  console.log('✨ Done!')
}

fetchBlobFiles().catch(console.error)

