import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const imagePath = searchParams.get('path')
  
  if (!imagePath) {
    return NextResponse.json({ error: 'No path provided' }, { status: 400 })
  }
  
  // Remove leading slash if present
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
  const fullPath = path.join(process.cwd(), 'public', cleanPath)
  
  try {
    // Check if file exists
    const exists = fs.existsSync(fullPath)
    const stats = exists ? fs.statSync(fullPath) : null
    
    return NextResponse.json({
      path: imagePath,
      cleanPath,
      fullPath,
      exists,
      isFile: stats?.isFile() || false,
      size: stats?.size || 0,
      message: exists ? 'File exists' : 'File not found'
    })
  } catch (error: any) {
    return NextResponse.json({
      path: imagePath,
      cleanPath,
      fullPath,
      exists: false,
      error: error.message
    }, { status: 500 })
  }
}

