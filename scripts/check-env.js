/**
 * Check if all required environment variables are set
 * 
 * Usage: node scripts/check-env.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') })

const requiredVars = {
  // Supabase
  'NEXT_PUBLIC_SUPABASE_URL': 'Supabase Project URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Supabase Anon Key',
  'SUPABASE_SERVICE_ROLE_KEY': 'Supabase Service Role Key',
  
  // Vercel Blob
  'BLOB_READ_WRITE_TOKEN': 'Vercel Blob Token',
  'BLOB_STORE_URL': 'Vercel Blob Store URL',
  
  // Stripe (existing)
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': 'Stripe Publishable Key',
  'STRIPE_SECRET_KEY': 'Stripe Secret Key',
  'STRIPE_WEBHOOK_SECRET': 'Stripe Webhook Secret',
}

console.log('🔍 Checking Environment Variables...\n')
console.log('='.repeat(60))

let allSet = true
const missing = []
const set = []

Object.entries(requiredVars).forEach(([key, description]) => {
  const value = process.env[key]
  if (!value || value === '' || value.includes('your-')) {
    console.log(`❌ ${key}`)
    console.log(`   Description: ${description}`)
    console.log(`   Status: MISSING or not configured\n`)
    missing.push(key)
    allSet = false
  } else {
    // Show first/last few characters for security
    const masked = value.length > 20 
      ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}`
      : `${value.substring(0, Math.min(10, value.length))}...`
    console.log(`✅ ${key}`)
    console.log(`   Description: ${description}`)
    console.log(`   Value: ${masked}\n`)
    set.push(key)
  }
})

console.log('='.repeat(60))
console.log(`\n📊 Summary:`)
console.log(`   ✅ Configured: ${set.length}/${Object.keys(requiredVars).length}`)
console.log(`   ❌ Missing: ${missing.length}/${Object.keys(requiredVars).length}`)

if (missing.length > 0) {
  console.log(`\n⚠️  Missing Variables:`)
  missing.forEach(key => {
    console.log(`   - ${key}`)
  })
  
  console.log(`\n📝 To fix:`)
  console.log(`   1. Open .env.local`)
  console.log(`   2. Add the missing variables`)
  console.log(`   3. Get values from:`)
  console.log(`      - Supabase: Dashboard → Settings → API`)
  console.log(`      - Vercel Blob: Dashboard → Storage → Blob`)
  console.log(`      - Stripe: Dashboard → Developers → API keys`)
} else {
  console.log(`\n✅ All required environment variables are configured!`)
  console.log(`\n🚀 Next steps:`)
  console.log(`   1. Verify blob structure: node scripts/verify-blob-setup.js`)
  console.log(`   2. Create Supabase schema (see SUPABASE_VERCEL_BLOB_MIGRATION.md)`)
  console.log(`   3. Run migration: node scripts/migrate-to-supabase.js`)
}

console.log('')

// Check specific values
if (process.env.BLOB_STORE_URL) {
  const blobUrl = process.env.BLOB_STORE_URL
  if (blobUrl.includes('mr0u602ri2txkwqt')) {
    console.log('✅ Blob Store URL matches your configured store')
  } else {
    console.log('⚠️  Blob Store URL might be different from expected')
    console.log(`   Current: ${blobUrl}`)
    console.log(`   Expected: https://mr0u602ri2txkwqt.public.blob.vercel-storage.com`)
  }
}

process.exit(allSet ? 0 : 1)

