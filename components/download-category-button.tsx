"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2, CheckCircle, FolderOpen } from 'lucide-react'
import { toast } from 'sonner'

interface DownloadCategoryButtonProps {
  categoryId: string
  categoryName: string
  orderId?: string
  sessionId?: string
}

export function DownloadCategoryButton({ 
  categoryId, 
  categoryName,
  orderId,
  sessionId 
}: DownloadCategoryButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      // Build download URL with order/session ID
      const params = new URLSearchParams()
      if (orderId) params.append('orderId', orderId)
      if (sessionId) params.append('sessionId', sessionId)
      
      const downloadUrl = `/api/categories/${categoryId}/download?${params.toString()}`
      
      // Fetch the file
      const response = await fetch(downloadUrl)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Download failed')
      }
      
      // Get the blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${categoryName.replace(/[^a-z0-9]/gi, '_')}_all_files.zip`
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      setIsDownloaded(true)
      toast.success('Category download started!', {
        description: `All files from ${categoryName} are being downloaded as a ZIP package.`
      })
      
    } catch (error) {
      console.error('Category download error:', error)
      toast.error('Download failed', {
        description: error instanceof Error ? error.message : 'Please ensure you purchased a product from this category.'
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button 
      onClick={handleDownload} 
      disabled={isDownloading}
      size="lg"
      variant="outline"
      className="w-full sm:w-auto"
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Preparing Category Download...
        </>
      ) : isDownloaded ? (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          Download Again
        </>
      ) : (
        <>
          <FolderOpen className="mr-2 h-4 w-4" />
          Download All {categoryName} Files
        </>
      )}
    </Button>
  )
}

