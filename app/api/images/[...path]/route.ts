import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Reconstruct the path from the array
    const imagePath = params.path.join('/')
    
    // Security: Only allow paths that start with "New Digital Product" or "optimized-products"
    if (!imagePath.startsWith('New Digital Product') && !imagePath.startsWith('optimized-products')) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 403 })
    }
    
    // Construct full file path
    const fullPath = path.join(process.cwd(), 'public', imagePath)
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(fullPath)
    
    // Determine content type based on extension
    const ext = path.extname(fullPath).toLowerCase()
    const contentType = 
      ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
      ext === '.png' ? 'image/png' :
      ext === '.webp' ? 'image/webp' :
      ext === '.gif' ? 'image/gif' :
      'application/octet-stream'
    
    // Return the image with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error: any) {
    console.error('Error serving image:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

