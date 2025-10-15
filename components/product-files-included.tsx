"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Image, Video, Package } from 'lucide-react'

interface ProductFile {
  name: string
  path: string
  size?: string
}

interface ProductFilesIncludedProps {
  allFiles?: ProductFile[]
  pdfs?: ProductFile[]
  images?: ProductFile[]
  videos?: ProductFile[]
  mockups?: ProductFile[]
  totalFiles?: number
  totalSize?: string
}

export function ProductFilesIncluded({
  allFiles = [],
  pdfs = [],
  images = [],
  videos = [],
  mockups = [],
  totalFiles = 0,
  totalSize = '0 MB'
}: ProductFilesIncludedProps) {
  if (allFiles.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          What's Included
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {totalFiles} Total Files
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              📦 {totalSize}
            </Badge>
          </div>

          {/* File Categories */}
          <div className="space-y-3">
            {/* PDFs */}
            {pdfs.length > 0 && (
              <div className="border rounded-lg p-3 bg-red-50 dark:bg-red-900/10">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="font-semibold text-sm text-red-900 dark:text-red-100">
                    PDF Files ({pdfs.length})
                  </span>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground ml-6">
                  {pdfs.map((file, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {file.name}
                      {file.size && <span className="text-xs opacity-60">({file.size})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Images */}
            {images.length > 0 && (
              <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-900/10">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-sm text-blue-900 dark:text-blue-100">
                    High-Resolution Images ({images.length})
                  </span>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground ml-6">
                  {images.map((file, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      {file.name}
                      {file.size && <span className="text-xs opacity-60">({file.size})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mockups */}
            {mockups.length > 0 && (
              <div className="border rounded-lg p-3 bg-purple-50 dark:bg-purple-900/10">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="font-semibold text-sm text-purple-900 dark:text-purple-100">
                    Mockup Images ({mockups.length})
                  </span>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground ml-6">
                  {mockups.map((file, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Videos */}
            {videos.length > 0 && (
              <div className="border rounded-lg p-3 bg-green-50 dark:bg-green-900/10">
                <div className="flex items-center gap-2 mb-2">
                  <Video className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-sm text-green-900 dark:text-green-100">
                    Video Files ({videos.length})
                  </span>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground ml-6">
                  {videos.map((file, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {file.name}
                      {file.size && <span className="text-xs opacity-60">({file.size})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="pt-3 border-t">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Instant Download</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>300 DPI Quality</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Multiple Formats</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Lifetime Access</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground italic pt-2 border-t">
            💡 After purchase, you'll receive a download link to get all files as a single ZIP package.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

