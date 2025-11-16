import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> | { path: string[] } }
) {
  try {
    // Handle both Promise and direct params (Next.js 13+ vs 14+)
    const resolvedParams = params instanceof Promise ? await params : params
    
    // Decode each path segment and reconstruct the path
    const decodedPath = resolvedParams.path.map(segment => {
      try {
        return decodeURIComponent(segment)
      } catch (e) {
        // If decoding fails, use the segment as-is
        return segment
      }
    }).join('/')
    
    // Security: Only allow paths that start with "New Digital Product" or "optimized-products"
    if (!decodedPath.startsWith('New Digital Product') && !decodedPath.startsWith('optimized-products')) {
      return NextResponse.json({ error: 'Invalid path', received: decodedPath }, { status: 403 })
    }
    
    // Construct full file path
    const fullPath = path.join(process.cwd(), 'public', decodedPath)
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.error('File not found:', {
        decodedPath,
        fullPath,
        exists: fs.existsSync(fullPath),
        publicDir: path.join(process.cwd(), 'public'),
        segments: params.path
      })
      return NextResponse.json({ 
        error: 'File not found', 
        path: decodedPath, 
        fullPath,
        segments: params.path
      }, { status: 404 })
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
    return NextResponse.json({ error: 'Internal server error', message: error.message }, { status: 500 })
  }
}

