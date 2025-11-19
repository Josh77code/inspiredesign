/**
 * Test the products API to see what URLs are being returned
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') })

async function testAPI() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  try {
    console.log('Testing products API...\n')
    const response = await fetch(`${baseUrl}/api/products?limit=3`)
    const data = await response.json()
    
    if (data.success && data.data.products) {
      console.log(`Found ${data.data.products.length} products:\n`)
      data.data.products.forEach((product, i) => {
        console.log(`${i + 1}. ${product.title}`)
        console.log(`   Image URL: ${product.image}`)
        console.log(`   Is Blob URL: ${product.image?.includes('blob.vercel-storage.com') ? 'Yes' : 'No'}`)
        console.log('')
      })
    } else {
      console.log('API Response:', JSON.stringify(data, null, 2))
    }
  } catch (error) {
    console.error('Error:', error.message)
    console.log('\n⚠️  Make sure your Next.js dev server is running (npm run dev)')
  }
}

testAPI()

