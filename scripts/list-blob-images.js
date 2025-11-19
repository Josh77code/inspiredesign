/**
 * List all images in Vercel Blob storage
 * 
 * Usage: node scripts/list-blob-images.js [prefix]
 * 
 * Example: node scripts/list-blob-images.js products/
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') })
const { list } = require('@vercel/blob')

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
const prefix = process.argv[2] || ''

if (!BLOB_READ_WRITE_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN not found in .env.local')
  process.exit(1)
}

async function listBlobImages() {
  try {
    console.log('🔍 Listing images from Vercel Blob...\n')
    
    if (prefix) {
      console.log(`📁 Filtering by prefix: "${prefix}"\n`)
    }
    
    const { blobs } = await list({
      prefix,
      token: BLOB_READ_WRITE_TOKEN,
    })
    
    if (blobs.length === 0) {
      console.log('⚠️  No images found')
      if (prefix) {
        console.log(`   Try without prefix or check if "${prefix}" is correct`)
      }
      return
    }
    
    console.log(`✅ Found ${blobs.length} image(s):\n`)
    
    // Group by directory structure
    const grouped = {}
    blobs.forEach(blob => {
      const parts = blob.pathname.split('/')
      const dir = parts.slice(0, -1).join('/') || 'root'
      if (!grouped[dir]) {
        grouped[dir] = []
      }
      grouped[dir].push({
        name: parts[parts.length - 1],
        path: blob.pathname,
        url: blob.url,
        size: blob.size,
      })
    })
    
    // Display grouped
    Object.keys(grouped).sort().forEach(dir => {
      console.log(`📂 ${dir === 'root' ? '/' : dir}/`)
      grouped[dir].forEach(file => {
        const sizeKB = (file.size / 1024).toFixed(2)
        console.log(`   📄 ${file.name} (${sizeKB} KB)`)
        console.log(`      URL: ${file.url}`)
      })
      console.log('')
    })
    
    // Summary
    console.log('='.repeat(50))
    console.log('📊 Summary:')
    console.log(`   Total images: ${blobs.length}`)
    console.log(`   Directories: ${Object.keys(grouped).length}`)
    
    // Show structure pattern
    if (blobs.length > 0) {
      const firstBlob = blobs[0]
      const parts = firstBlob.pathname.split('/')
      console.log('\n📋 Structure pattern:')
      console.log(`   ${parts.join(' → ')}`)
      
      if (parts.length >= 2) {
        console.log('\n💡 Suggested mapping:')
        console.log(`   Product ID: ${parts[0]}`)
        console.log(`   Image type: ${parts[parts.length - 1]}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Error listing blobs:', error.message)
    if (error.message.includes('401') || error.message.includes('403')) {
      console.error('   Check your BLOB_READ_WRITE_TOKEN')
    }
    process.exit(1)
  }
}

listBlobImages()

