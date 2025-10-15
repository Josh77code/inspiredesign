"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download, Loader2, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface DownloadProductButtonProps {
  productId: number
  productTitle: string
  orderId?: string
  sessionId?: string
}

export function DownloadProductButton({ 
  productId, 
  productTitle,
  orderId,
  sessionId 
}: DownloadProductButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    
    try {
      // Build download URL with order/session ID
      const params = new URLSearchParams()
      if (orderId) params.append('orderId', orderId)
      if (sessionId) params.append('sessionId', sessionId)
      
      const downloadUrl = `/api/products/${productId}/download-all?${params.toString()}`
      
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
      a.download = `${productTitle.replace(/[^a-z0-9]/gi, '_')}.zip`
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      setIsDownloaded(true)
      toast.success('Download started!', {
        description: 'Your files are being downloaded as a ZIP package.'
      })
      
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Download failed', {
        description: error instanceof Error ? error.message : 'Please try again or contact support.'
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
      className="w-full sm:w-auto"
    >
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Preparing Download...
        </>
      ) : isDownloaded ? (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          Download Again
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download All Files (ZIP)
        </>
      )}
    </Button>
  )
}

