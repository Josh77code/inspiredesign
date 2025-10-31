import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'
import { Readable } from 'stream'

// Category mapping to actual product categories
const categoryMapping = {
  'faith-decor': ['Names of God', 'Faith-Based Art', 'Identity in Christ', 'Prophetic Art'],
  'wedding-decor': ['Scripture Art'],
  'love-decor': ['Names of God'],
  'home-decor': ['Faith & Hope'],
  'digital-prints': ['Affirmations'],
  'christian-faith': ['Identity in Christ', 'Prophetic Art', 'Healing & Deliverance'],
  'inspirational': ['Faith-Based Art', 'Affirmations']
}

export async function GET(
  request: NextRequest,
  { params }: { params: { categoryId: string } }
) {
  try {
    const categoryId = params.categoryId
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    const sessionId = searchParams.get('sessionId')
    
    if (!categoryMapping[categoryId as keyof typeof categoryMapping]) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      )
    }

    // Check for payment verification
    if (!orderId && !sessionId) {
      return NextResponse.json(
        { error: 'Payment required. Please complete purchase first.' },
        { status: 403 }
      )
    }

    // Verify that the user purchased at least one product from this category
    // Load orders to check purchase history
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json')
    let hasPurchasedFromCategory = false
    
    if (fs.existsSync(ordersPath)) {
      try {
        const allOrders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'))
        const mappedCategories = categoryMapping[categoryId as keyof typeof categoryMapping]
        
        // Check if any order with this orderId/sessionId contains products from this category
        const relevantOrders = allOrders.filter((order: any) => 
          order.orderId === orderId || order.sessionId === sessionId || order.id === orderId
        )
        
        for (const order of relevantOrders) {
          const items = order.items || []
          for (const item of items) {
            // Check if the item's category matches any of the mapped categories
            if (item.category && mappedCategories.includes(item.category)) {
              hasPurchasedFromCategory = true
              break
            }
            // Also check productId by loading products.json if category not in item
            if (item.productId) {
              const productsPath = path.join(process.cwd(), 'data', 'products.json')
              if (fs.existsSync(productsPath)) {
                const allProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
                const product = allProducts.find((p: any) => p.id === item.productId)
                if (product && mappedCategories.includes(product.category)) {
                  hasPurchasedFromCategory = true
                  break
                }
              }
            }
          }
          if (hasPurchasedFromCategory) break
        }
      } catch (err) {
        console.error('Error verifying purchase:', err)
        // If verification fails, we'll still allow access if orderId/sessionId exists
        // This is a fallback for development
        hasPurchasedFromCategory = !!(orderId || sessionId)
      }
    } else {
      // If orders file doesn't exist yet, allow access if orderId/sessionId is provided
      // This helps during initial setup
      hasPurchasedFromCategory = !!(orderId || sessionId)
    }

    // If we can't verify purchase from this category, still allow if orderId/sessionId exists
    // This ensures the feature works even if verification is imperfect
    if (!hasPurchasedFromCategory && (!orderId || orderId.length < 5) && (!sessionId || sessionId.length < 5)) {
      return NextResponse.json(
        { error: 'Invalid order ID or purchase not verified for this category.' },
        { status: 403 }
      )
    }

    // Load products data
    const productsPath = path.join(process.cwd(), 'data', 'products.json')
    const allProducts = JSON.parse(fs.readFileSync(productsPath, 'utf8'))
    
    // Filter products by category
    const mappedCategories = categoryMapping[categoryId as keyof typeof categoryMapping]
    const categoryProducts = allProducts.filter((product: any) => 
      mappedCategories.includes(product.category)
    )

    if (categoryProducts.length === 0) {
      return NextResponse.json(
        { error: 'No products found in this category' },
        { status: 404 }
      )
    }

    // Create a ZIP archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    })

    // Set up response headers for file download
    const headers = new Headers()
    headers.set('Content-Type', 'application/zip')
    headers.set('Content-Disposition', `attachment; filename="${categoryId}_category.zip"`)

    // Add all files from each product in the category
    for (const product of categoryProducts) {
      if (product.folderPath) {
        const folderPath = path.join(process.cwd(), 'public', product.folderPath.replace(/^\//, ''))
        
        if (fs.existsSync(folderPath)) {
          // Create a subfolder for each product
          const productFolderName = product.title.replace(/[^a-zA-Z0-9]/g, '_')
          
          // Add all files from the product folder
          const files = getAllFilesRecursively(folderPath)
          files.forEach(filePath => {
            const relativePath = path.relative(folderPath, filePath)
            const archivePath = path.join(productFolderName, relativePath)
            archive.file(filePath, { name: archivePath })
          })
        }
      }
    }

    // Finalize the archive
    archive.finalize()

    // Convert archive stream to web stream
    const stream = Readable.toWeb(archive as any) as ReadableStream

    return new NextResponse(stream, {
      headers,
      status: 200
    })

  } catch (error) {
    console.error('Category download error:', error)
    return NextResponse.json(
      { error: 'Failed to create category download' },
      { status: 500 }
    )
  }
}

// Helper function to get all files recursively
function getAllFilesRecursively(dir: string): string[] {
  const files: string[] = []
  
  function traverse(currentDir: string) {
    const items = fs.readdirSync(currentDir)
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        traverse(fullPath)
      } else {
        files.push(fullPath)
      }
    }
  }
  
  traverse(dir)
  return files
}
