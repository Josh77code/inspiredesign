/**
 * Update product pricing with size-based options
 * 
 * Usage: node scripts/update-product-pricing.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') })
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const sizePricing = {
  "5x5": 6.50,
  "6x6": 7.70,
  "12x12": 10.00
}

async function updateProductPricing() {
  console.log('💰 Updating product pricing with size-based options...\n')
  console.log('Size Pricing:')
  console.log('  - 5x5: €6.50')
  console.log('  - 6x6: €7.70')
  console.log('  - 12x12: €10.00\n')
  
  try {
    // Update all products
    const { data, error } = await supabase
      .from('products')
      .update({ size_pricing: sizePricing })
      .select('id, title')
    
    if (error) {
      console.error('❌ Error updating products:', error)
      process.exit(1)
    }
    
    console.log(`✅ Updated ${data.length} product(s) with size-based pricing\n`)
    
    // Show sample
    if (data.length > 0) {
      console.log('📋 Sample updated products:')
      data.slice(0, 5).forEach(product => {
        console.log(`   - ${product.id}: ${product.title}`)
      })
      if (data.length > 5) {
        console.log(`   ... and ${data.length - 5} more`)
      }
    }
    
    console.log('\n✅ Pricing update complete!')
    console.log('\n💡 Products now have size-based pricing:')
    console.log('   - Customers can select 5x5, 6x6, or 12x12 sizes')
    console.log('   - Prices will be displayed based on selected size')
    
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

updateProductPricing()

