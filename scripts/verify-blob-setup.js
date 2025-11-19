/**
 * Verify Vercel Blob setup and show image structure
 * 
 * Usage: node scripts/verify-blob-setup.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') })
const { list } = require('@vercel/blob')

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN
const BLOB_STORE_URL = process.env.BLOB_STORE_URL || 'https://mr0u602ri2txkwqt.public.blob.vercel-storage.com'

console.log('🔍 Verifying Vercel Blob Setup...\n')
console.log(`📦 Blob Store URL: ${BLOB_STORE_URL}\n`)

if (!BLOB_READ_WRITE_TOKEN) {
  console.error('❌ BLOB_READ_WRITE_TOKEN not found in .env.local')
  console.error('   Please add it to your .env.local file')
  process.exit(1)
}

console.log('✅ BLOB_READ_WRITE_TOKEN found\n')

async function verifySetup() {
  try {
    console.log('📋 Listing all images in blob storage...\n')
    
    const { blobs } = await list({
      token: BLOB_READ_WRITE_TOKEN,
    })
    
    if (blobs.length === 0) {
      console.log('⚠️  No images found in blob storage')
      console.log('   Make sure you have uploaded images to Vercel Blob')
      return
    }
    
    console.log(`✅ Found ${blobs.length} image(s)\n`)
    
    // Show first few images to understand structure
    console.log('📸 Sample images (first 10):\n')
    blobs.slice(0, 10).forEach((blob, index) => {
      console.log(`${index + 1}. ${blob.pathname}`)
      console.log(`   URL: ${blob.url}`)
      console.log(`   Size: ${(blob.size / 1024).toFixed(2)} KB`)
      console.log('')
    })
    
    // Analyze structure
    console.log('='.repeat(50))
    console.log('📊 Structure Analysis:\n')
    
    const paths = blobs.map(b => b.pathname)
    const pathParts = paths.map(p => p.split('/'))
    
    // Find common patterns
    const firstLevel = [...new Set(pathParts.map(p => p[0]))]
    const secondLevel = [...new Set(pathParts.filter(p => p.length > 1).map(p => p[1]))]
    
    console.log(`   First level directories: ${firstLevel.length}`)
    if (firstLevel.length <= 5) {
      console.log(`   ${firstLevel.join(', ')}`)
    } else {
      console.log(`   ${firstLevel.slice(0, 5).join(', ')}... (and ${firstLevel.length - 5} more)`)
    }
    
    if (secondLevel.length > 0) {
      console.log(`\n   Second level directories: ${secondLevel.length}`)
      if (secondLevel.length <= 5) {
        console.log(`   ${secondLevel.join(', ')}`)
      } else {
        console.log(`   ${secondLevel.slice(0, 5).join(', ')}... (and ${secondLevel.length - 5} more)`)
      }
    }
    
    // Show structure pattern
    if (paths.length > 0) {
      const samplePath = paths[0]
      const parts = samplePath.split('/')
      console.log(`\n   Example structure: ${parts.join(' → ')}`)
      
      // Suggest mapping
      console.log('\n💡 Suggested mapping for migration:')
      if (parts.length >= 2) {
        console.log(`   Product ID: ${parts[0]}`)
        console.log(`   Image file: ${parts[parts.length - 1]}`)
      }
      
      // Check if structure matches expected pattern
      const hasProductIdPattern = /^\d+$/.test(parts[0])
      if (hasProductIdPattern) {
        console.log('\n   ✅ Structure looks good! Product IDs are numeric.')
      } else {
        console.log('\n   ⚠️  Product IDs might not be numeric. Check your structure.')
      }
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('✅ Setup verified!')
    console.log('\n📝 Next steps:')
    console.log('   1. Review the structure above')
    console.log('   2. Update convertImagePath() in migrate-to-supabase.js if needed')
    console.log('   3. Run: node scripts/migrate-to-supabase.js')
    
  } catch (error) {
    console.error('❌ Error verifying setup:', error.message)
    if (error.message.includes('401') || error.message.includes('403')) {
      console.error('\n   Check your BLOB_READ_WRITE_TOKEN is correct')
    }
    process.exit(1)
  }
}

verifySetup()

