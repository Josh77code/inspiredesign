import fs from 'fs'
import path from 'path'
import { NextRequest } from 'next/server'

// File upload configuration
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export interface UploadResult {
  success: boolean
  filename?: string
  url?: string
  error?: string
}

export class FileUploadService {
  // Handle file upload from form data
  static async handleFileUpload(request: NextRequest): Promise<UploadResult> {
    try {
      const formData = await request.formData()
      const file = formData.get('file') as File

      if (!file) {
        return { success: false, error: 'No file provided' }
      }

      // Validate file type
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { 
          success: false, 
          error: `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}` 
        }
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return { 
          success: false, 
          error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
        }
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = path.extname(file.name)
      const filename = `${timestamp}_${randomString}${extension}`
      const filepath = path.join(UPLOAD_DIR, filename)

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      fs.writeFileSync(filepath, buffer)

      // Return success with file info
      return {
        success: true,
        filename,
        url: `/uploads/${filename}`
      }

    } catch (error) {
      console.error('File upload error:', error)
      return { 
        success: false, 
        error: 'Failed to upload file' 
      }
    }
  }

  // Handle multiple file uploads
  static async handleMultipleFileUpload(request: NextRequest): Promise<UploadResult[]> {
    try {
      const formData = await request.formData()
      const files = formData.getAll('files') as File[]
      const results: UploadResult[] = []

      for (const file of files) {
        // Create a new form data with single file
        const singleFileFormData = new FormData()
        singleFileFormData.append('file', file)
        
        // Create a new request with single file
        const singleFileRequest = new NextRequest(request.url, {
          method: 'POST',
          body: singleFileFormData
        })

        const result = await this.handleFileUpload(singleFileRequest)
        results.push(result)
      }

      return results

    } catch (error) {
      console.error('Multiple file upload error:', error)
      return [{ success: false, error: 'Failed to upload files' }]
    }
  }

  // Delete uploaded file
  static deleteFile(filename: string): boolean {
    try {
      const filepath = path.join(UPLOAD_DIR, filename)
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
        return true
      }
      return false
    } catch (error) {
      console.error('File deletion error:', error)
      return false
    }
  }

  // Get file info
  static getFileInfo(filename: string) {
    try {
      const filepath = path.join(UPLOAD_DIR, filename)
      if (fs.existsSync(filepath)) {
        const stats = fs.statSync(filepath)
        return {
          exists: true,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          url: `/uploads/${filename}`
        }
      }
      return { exists: false }
    } catch (error) {
      console.error('Get file info error:', error)
      return { exists: false }
    }
  }

  // List all uploaded files
  static listFiles(): string[] {
    try {
      return fs.readdirSync(UPLOAD_DIR).filter(file => {
        const filepath = path.join(UPLOAD_DIR, file)
        return fs.statSync(filepath).isFile()
      })
    } catch (error) {
      console.error('List files error:', error)
      return []
    }
  }

  // Clean up old files (older than specified days)
  static cleanupOldFiles(daysOld: number = 30): number {
    try {
      const files = this.listFiles()
      let deletedCount = 0
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      for (const filename of files) {
        const filepath = path.join(UPLOAD_DIR, filename)
        const stats = fs.statSync(filepath)
        
        if (stats.mtime < cutoffDate) {
          fs.unlinkSync(filepath)
          deletedCount++
        }
      }

      return deletedCount
    } catch (error) {
      console.error('Cleanup files error:', error)
      return 0
    }
  }
}

// Utility functions for file validation
export const FileValidator = {
  // Check if file is an image
  isImage: (file: File): boolean => {
    return ALLOWED_IMAGE_TYPES.includes(file.type)
  },

  // Check file size
  isValidSize: (file: File): boolean => {
    return file.size <= MAX_FILE_SIZE
  },

  // Get file extension
  getExtension: (filename: string): string => {
    return path.extname(filename).toLowerCase()
  },

  // Generate safe filename
  generateSafeFilename: (originalFilename: string): string => {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = path.extname(originalFilename)
    return `${timestamp}_${randomString}${extension}`
  }
}

export default FileUploadService







