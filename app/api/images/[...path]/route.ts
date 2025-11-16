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
    // Handle both single and double encoding (some browsers encode twice)
    const decodedPath = resolvedParams.path.map(segment => {
      try {
        // Try decoding twice in case of double encoding
        let decoded = decodeURIComponent(segment)
        // If it still contains encoded characters, try decoding again
        if (decoded.includes('%')) {
          try {
            decoded = decodeURIComponent(decoded)
          } catch (e2) {
            // If second decode fails, use first decode
          }
        }
        return decoded
      } catch (e) {
        // If decoding fails, try to decode the raw segment
        try {
          return decodeURIComponent(segment.replace(/\+/g, ' '))
        } catch (e2) {
          // If all decoding fails, use the segment as-is
          return segment
        }
      }
    }).join('/')
    
    // Security: Only allow paths that start with "New Digital Product" or "optimized-products"
    if (!decodedPath.startsWith('New Digital Product') && !decodedPath.startsWith('optimized-products')) {
      return NextResponse.json({ error: 'Invalid path', received: decodedPath }, { status: 403 })
    }
    
    // Construct full file path
    const fullPath = path.join(process.cwd(), 'public', decodedPath)
    
    // Check if file exists (try exact match first)
    let actualFilePath = fullPath
    let fileFound = fs.existsSync(fullPath)
    
    // If exact match fails, try case-insensitive matching (for Linux/Vercel case sensitivity)
    if (!fileFound) {
      const dirPath = path.dirname(fullPath)
      const fileName = path.basename(fullPath)
      
      if (fs.existsSync(dirPath)) {
        try {
          const files = fs.readdirSync(dirPath)
          const foundFile = files.find(f => f.toLowerCase() === fileName.toLowerCase())
          
          if (foundFile) {
            // Use the actual file name (with correct case)
            actualFilePath = path.join(dirPath, foundFile)
            fileFound = true
            console.log('Found file with case-insensitive match:', {
              requested: fileName,
              found: foundFile,
              originalPath: decodedPath
            })
          }
        } catch (dirError) {
          console.error('Error reading directory:', dirError)
        }
      }
    }
    
    // If still not found, return 404
    if (!fileFound) {
      const dirPath = path.dirname(fullPath)
      console.error('File not found:', {
        decodedPath,
        fullPath,
        publicDir: path.join(process.cwd(), 'public'),
        segments: resolvedParams.path,
        dirExists: fs.existsSync(dirPath),
        dirContents: fs.existsSync(dirPath) ? fs.readdirSync(dirPath).slice(0, 10) : []
      })
      return NextResponse.json({ 
        error: 'File not found', 
        path: decodedPath, 
        fullPath,
        segments: resolvedParams.path
      }, { status: 404 })
    }
    
    // Read the file (using actualFilePath which may have been corrected for case)
    const fileBuffer = fs.readFileSync(actualFilePath)
    
    // Determine content type based on extension
    const ext = path.extname(actualFilePath).toLowerCase()
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

