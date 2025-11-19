/**
 * Verify that image URLs in Supabase are accessible
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

async function verifyUrls() {
  console.log('🔍 Verifying image URLs...\n')
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, title, image_url')
    .limit(5)
  
  if (error) {
    console.error('❌ Error:', error)
    return
  }
  
  for (const product of products) {
    if (!product.image_url) {
      console.log(`⚠️  ${product.title}: No image URL`)
      continue
    }
    
    console.log(`Testing: ${product.title}`)
    console.log(`URL: ${product.image_url}`)
    
    try {
      const response = await fetch(product.image_url, { method: 'HEAD' })
      if (response.ok) {
        console.log(`✅ Status: ${response.status} - Image accessible\n`)
      } else {
        console.log(`❌ Status: ${response.status} - Image not accessible\n`)
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`)
    }
  }
}

verifyUrls().catch(console.error)

