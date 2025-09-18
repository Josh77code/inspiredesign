import { NextRequest, NextResponse } from 'next/server'
import { FileUploadService } from '@/lib/file-upload'

// POST /api/upload - Handle file uploads
export async function POST(request: NextRequest) {
  try {
    const result = await FileUploadService.handleFileUpload(request)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          filename: result.filename,
          url: result.url
        }
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    )
  }
}

// GET /api/upload - List uploaded files
export async function GET() {
  try {
    const files = FileUploadService.listFiles()
    const fileInfos = files.map(filename => {
      const info = FileUploadService.getFileInfo(filename)
      return {
        filename,
        ...info
      }
    })

    return NextResponse.json({
      success: true,
      data: fileInfos
    })
  } catch (error) {
    console.error('List files error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to list files' },
      { status: 500 }
    )
  }
}





