/**
 * Helper script to add environment variables to .env.local
 * 
 * Usage: node scripts/add-env-vars.js
 * 
 * This will prompt you to add the missing variables
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const envLocalPath = path.join(__dirname, '..', '.env.local')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function addEnvVars() {
  console.log('📝 Adding Environment Variables to .env.local\n')
  console.log('💡 Tip: You can copy these from Vercel Dashboard → Settings → Environment Variables\n')
  
  // Read existing .env.local
  let envContent = ''
  if (fs.existsSync(envLocalPath)) {
    envContent = fs.readFileSync(envLocalPath, 'utf8')
  }
  
  const vars = []
  
  // Check what's missing
  const missingVars = []
  if (!envContent.includes('NEXT_PUBLIC_SUPABASE_URL')) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  if (!envContent.includes('SUPABASE_SERVICE_ROLE_KEY')) missingVars.push('SUPABASE_SERVICE_ROLE_KEY')
  if (!envContent.includes('BLOB_READ_WRITE_TOKEN')) missingVars.push('BLOB_READ_WRITE_TOKEN')
  if (!envContent.includes('BLOB_STORE_URL')) missingVars.push('BLOB_STORE_URL')
  
  if (missingVars.length === 0) {
    console.log('✅ All environment variables are already set!')
    rl.close()
    return
  }
  
  console.log(`Found ${missingVars.length} missing variable(s)\n`)
  
  // Add Supabase variables
  if (missingVars.includes('NEXT_PUBLIC_SUPABASE_URL')) {
    const url = await question('Enter NEXT_PUBLIC_SUPABASE_URL (e.g., https://xxxxx.supabase.co): ')
    vars.push(`NEXT_PUBLIC_SUPABASE_URL=${url}`)
  }
  
  if (missingVars.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')) {
    const key = await question('Enter NEXT_PUBLIC_SUPABASE_ANON_KEY: ')
    vars.push(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${key}`)
  }
  
  if (missingVars.includes('SUPABASE_SERVICE_ROLE_KEY')) {
    const key = await question('Enter SUPABASE_SERVICE_ROLE_KEY: ')
    vars.push(`SUPABASE_SERVICE_ROLE_KEY=${key}`)
  }
  
  // Add Blob variables
  if (missingVars.includes('BLOB_READ_WRITE_TOKEN')) {
    const token = await question('Enter BLOB_READ_WRITE_TOKEN (starts with vercel_blob_rw_): ')
    vars.push(`BLOB_READ_WRITE_TOKEN=${token}`)
  }
  
  if (missingVars.includes('BLOB_STORE_URL')) {
    vars.push(`BLOB_STORE_URL=https://mr0u602ri2txkwqt.public.blob.vercel-storage.com`)
    console.log('✅ BLOB_STORE_URL set automatically')
  }
  
  // Append to .env.local
  const newContent = vars.length > 0 ? '\n\n# Added by migration script\n' + vars.join('\n') + '\n' : ''
  fs.appendFileSync(envLocalPath, newContent)
  
  console.log('\n✅ Environment variables added to .env.local!')
  console.log('\n📝 Next steps:')
  console.log('   1. Verify: node scripts/check-env.js')
  console.log('   2. Check blob: node scripts/verify-blob-setup.js')
  console.log('   3. Run migration: node scripts/migrate-to-supabase.js')
  
  rl.close()
}

addEnvVars().catch(console.error)

