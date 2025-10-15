import { NextRequest, NextResponse } from 'next/server'
import { productsDB } from '@/lib/database'
import fs from 'fs'
import path from 'path'
import archiver from 'archiver'
import { Readable } from 'stream'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    // Get product from database
    const product = productsDB.getById(productId)
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if product requires payment
    if (product.requiresPayment) {
      // TODO: Verify payment/order here
      // For now, we'll check for a session or order ID
      const orderId = request.nextUrl.searchParams.get('orderId')
      const sessionId = request.nextUrl.searchParams.get('sessionId')
      
      if (!orderId && !sessionId) {
        return NextResponse.json(
          { error: 'Payment required. Please complete purchase first.' },
          { status: 403 }
        )
      }
    }

    // Get the folder path - folderPath is relative to public folder
    const folderPath = product.folderPath 
      ? path.join(process.cwd(), 'public', product.folderPath.replace(/^\//, ''))
      : null

    if (!folderPath || !fs.existsSync(folderPath)) {
      return NextResponse.json(
        { error: 'Product files not found' },
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
    headers.set('Content-Disposition', `attachment; filename="${product.title.replace(/[^a-z0-9]/gi, '_')}.zip"`)

    // Add all files from the product folder
    if (product.allFiles && product.allFiles.length > 0) {
      product.allFiles.forEach((file: any) => {
        // File paths are already relative to root (without /public prefix)
        const filePath = path.join(process.cwd(), 'public', file.path.replace(/^\//, ''))
        if (fs.existsSync(filePath)) {
          const fileName = path.basename(file.path)
          archive.file(filePath, { name: fileName })
        }
      })
    } else {
      // Fallback: add all files in the folder
      const files = getAllFilesRecursively(folderPath)
      files.forEach(filePath => {
        const relativePath = path.relative(folderPath, filePath)
        archive.file(filePath, { name: relativePath })
      })
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
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Failed to create download' },
      { status: 500 }
    )
  }
}

// Helper function to get all files recursively
function getAllFilesRecursively(dir: string): string[] {
  const files: string[] = []
  
  const items = fs.readdirSync(dir)
  
  items.forEach(item => {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      files.push(...getAllFilesRecursively(fullPath))
    } else {
      files.push(fullPath)
    }
  })
  
  return files
}

