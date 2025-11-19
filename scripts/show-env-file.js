/**
 * Show all lines from .env.local (including comments and blanks)
 */

const fs = require('fs')
const path = require('path')

const envLocalPath = path.join(__dirname, '..', '.env.local')

if (!fs.existsSync(envLocalPath)) {
  console.log('❌ .env.local not found!')
  process.exit(1)
}

const content = fs.readFileSync(envLocalPath, 'utf8')
const lines = content.split('\n')

console.log(`📄 .env.local file contents (${lines.length} total lines):\n`)
console.log('='.repeat(60))

lines.forEach((line, index) => {
  const lineNum = (index + 1).toString().padStart(3, ' ')
  
  if (line.trim() === '') {
    console.log(`${lineNum}: (empty line)`)
  } else if (line.trim().startsWith('#')) {
    console.log(`${lineNum}: ${line}`)
  } else {
    // Check if it's a variable
    const match = line.match(/^([A-Z_]+)\s*=\s*(.*)$/)
    if (match) {
      const [, varName, value] = match
      const masked = value && value.length > 30 
        ? `${value.substring(0, 20)}...${value.substring(value.length - 5)}`
        : value || '(empty)'
      console.log(`${lineNum}: ${varName}=${masked}`)
    } else {
      console.log(`${lineNum}: ${line.substring(0, 60)}${line.length > 60 ? '...' : ''}`)
    }
  }
})

console.log('='.repeat(60))

// Check for required variables
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'BLOB_READ_WRITE_TOKEN',
  'BLOB_STORE_URL'
]

console.log('\n🔍 Required Variables Status:\n')

requiredVars.forEach(varName => {
  const found = lines.some(line => {
    const trimmed = line.trim()
    return trimmed.startsWith(varName + '=') || 
           trimmed.startsWith(varName + ' =') ||
           trimmed.match(new RegExp(`^${varName}\\s*=`))
  })
  
  if (found) {
    const line = lines.find(l => l.includes(varName))
    console.log(`✅ ${varName} - FOUND`)
    if (line) {
      const lineNum = lines.indexOf(line) + 1
      console.log(`   Line ${lineNum}: ${line.substring(0, 60)}...`)
    }
  } else {
    console.log(`❌ ${varName} - NOT FOUND`)
  }
  console.log('')
})

