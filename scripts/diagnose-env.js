/**
 * Diagnose .env.local file issues
 */

const fs = require('fs')
const path = require('path')

const envLocalPath = path.join(__dirname, '..', '.env.local')

console.log('🔍 Diagnosing .env.local file...\n')

if (!fs.existsSync(envLocalPath)) {
  console.log('❌ .env.local file not found!')
  console.log(`   Expected location: ${envLocalPath}`)
  process.exit(1)
}

console.log(`✅ .env.local found at: ${envLocalPath}\n`)

const content = fs.readFileSync(envLocalPath, 'utf8')
const lines = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'))

console.log(`📊 Found ${lines.length} non-comment lines\n`)

const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'BLOB_READ_WRITE_TOKEN',
  'BLOB_STORE_URL'
]

console.log('Checking for required variables:\n')

requiredVars.forEach(varName => {
  const found = lines.some(line => {
    const trimmed = line.trim()
    return trimmed.startsWith(varName + '=') || trimmed.startsWith(varName + ' =')
  })
  
  if (found) {
    const line = lines.find(l => l.includes(varName))
    const value = line ? line.split('=')[1]?.trim() : ''
    const masked = value && value.length > 10 
      ? `${value.substring(0, 10)}...${value.substring(value.length - 4)}`
      : value || 'empty'
    console.log(`✅ ${varName}`)
    console.log(`   Value: ${masked}`)
  } else {
    console.log(`❌ ${varName} - NOT FOUND`)
  }
  console.log('')
})

// Check for common issues
console.log('🔍 Checking for common issues:\n')

const issues = []

// Check for quotes
const hasQuotes = lines.some(line => {
  const match = line.match(/^[A-Z_]+=["']/)
  return match
})

if (hasQuotes) {
  console.log('⚠️  Found quoted values - this is OK')
} else {
  console.log('✅ No quotes found - this is OK')
}

// Check for spaces around =
const hasSpaces = lines.some(line => {
  return line.includes(' = ') || line.includes('= ')
})

if (hasSpaces) {
  console.log('⚠️  Found spaces around = - this is OK but no spaces is preferred')
} else {
  console.log('✅ No spaces around = - good!')
}

// Show sample of what's in the file (masked)
console.log('\n📄 Sample lines from .env.local (first 5 non-comment lines):\n')
lines.slice(0, 5).forEach((line, i) => {
  const parts = line.split('=')
  if (parts.length >= 2) {
    const varName = parts[0].trim()
    const value = parts.slice(1).join('=').trim()
    const masked = value.length > 20 
      ? `${value.substring(0, 15)}...`
      : value
    console.log(`${i + 1}. ${varName}=${masked}`)
  } else {
    console.log(`${i + 1}. ${line.substring(0, 50)}...`)
  }
})

console.log('\n💡 Tips:')
console.log('   - Variable names must match exactly (case-sensitive)')
console.log('   - Format: VARIABLE_NAME=value')
console.log('   - No spaces around = sign')
console.log('   - Values can be quoted or unquoted')
console.log('   - Each variable on its own line')

