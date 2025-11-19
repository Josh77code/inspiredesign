/**
 * Add missing environment variables to .env.local
 * This will append the variables if they don't exist
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

async function addMissingVars() {
  console.log('📝 Adding Missing Environment Variables\n')
  console.log('Please provide the values (or press Enter to skip):\n')
  
  let envContent = ''
  if (fs.existsSync(envLocalPath)) {
    envContent = fs.readFileSync(envLocalPath, 'utf8')
  }
  
  const vars = []
  
  // Supabase URL
  const supabaseUrl = await question('NEXT_PUBLIC_SUPABASE_URL (e.g., https://xxxxx.supabase.co): ')
  if (supabaseUrl.trim()) {
    vars.push(`NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl.trim()}`)
  }
  
  // Supabase Anon Key
  const supabaseAnon = await question('NEXT_PUBLIC_SUPABASE_ANON_KEY: ')
  if (supabaseAnon.trim()) {
    vars.push(`NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnon.trim()}`)
  }
  
  // Supabase Service Role Key
  const supabaseService = await question('SUPABASE_SERVICE_ROLE_KEY: ')
  if (supabaseService.trim()) {
    vars.push(`SUPABASE_SERVICE_ROLE_KEY=${supabaseService.trim()}`)
  }
  
  // Blob Token
  const blobToken = await question('BLOB_READ_WRITE_TOKEN (starts with vercel_blob_rw_): ')
  if (blobToken.trim()) {
    vars.push(`BLOB_READ_WRITE_TOKEN=${blobToken.trim()}`)
  }
  
  // Blob URL (auto-set)
  vars.push(`BLOB_STORE_URL=https://mr0u602ri2txkwqt.public.blob.vercel-storage.com`)
  console.log('✅ BLOB_STORE_URL set automatically\n')
  
  if (vars.length > 0) {
    // Ensure file ends with newline
    const contentToAppend = envContent.endsWith('\n') ? '' : '\n'
    const newContent = contentToAppend + '\n# Supabase and Vercel Blob Configuration\n' + vars.join('\n') + '\n'
    
    fs.appendFileSync(envLocalPath, newContent)
    console.log('✅ Environment variables added to .env.local!\n')
    console.log('📝 Added variables:')
    vars.forEach(v => {
      const [name] = v.split('=')
      console.log(`   - ${name}`)
    })
  } else {
    console.log('⚠️  No variables were added')
  }
  
  rl.close()
  
  console.log('\n🔍 Verifying...')
  console.log('Run: node scripts/check-env.js')
}

addMissingVars().catch(console.error)

