"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react'

interface MockupFile {
  name: string
  path?: string
  url?: string
}

interface MockupGalleryProps {
  mockups: MockupFile[]
  productName: string
}

export function MockupGallery({ mockups, productName }: MockupGalleryProps) {
  const [selectedMockup, setSelectedMockup] = useState<MockupFile | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  if (!mockups || mockups.length === 0) {
    return null
  }

  const openGallery = (mockup: MockupFile, index: number) => {
    setSelectedMockup(mockup)
    setCurrentIndex(index)
    setIsGalleryOpen(true)
  }

  const closeGallery = () => {
    setIsGalleryOpen(false)
    setSelectedMockup(null)
    setCurrentIndex(0)
  }

  const nextMockup = () => {
    const nextIndex = (currentIndex + 1) % mockups.length
    setCurrentIndex(nextIndex)
    setSelectedMockup(mockups[nextIndex])
  }

  const prevMockup = () => {
    const prevIndex = (currentIndex - 1 + mockups.length) % mockups.length
    setCurrentIndex(prevIndex)
    setSelectedMockup(mockups[prevIndex])
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevMockup()
    if (e.key === 'ArrowRight') nextMockup()
    if (e.key === 'Escape') closeGallery()
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Maximize2 className="h-5 w-5" />
            Product Mockups
            <span className="text-sm font-normal text-muted-foreground">
              ({mockups.length} mockups)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mockups.map((mockup, index) => (
              <div
                key={index}
                className="relative group cursor-pointer rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-200"
                onClick={() => openGallery(mockup, index)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={mockup.url || (mockup.path ? (mockup.path.startsWith('/') ? mockup.path : `/${mockup.path}`) : '/placeholder.svg')}
                    alt={`${productName} - Mockup ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized={mockup.url?.includes('blob.vercel-storage.com')}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                    <Maximize2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-muted-foreground truncate">
                    {mockup.name.replace(/\.(png|jpg|jpeg)$/i, '')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fullscreen Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Maximize2 className="h-5 w-5" />
                {selectedMockup?.name.replace(/\.(png|jpg|jpeg)$/i, '')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeGallery}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div 
            className="relative flex-1 bg-black/5 flex items-center justify-center p-6"
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {selectedMockup && (
              <div className="relative max-w-full max-h-full">
                <Image
                  src={selectedMockup.url || (selectedMockup.path ? (selectedMockup.path.startsWith('/') ? selectedMockup.path : `/${selectedMockup.path}`) : '/placeholder.svg')}
                  alt={`${productName} - Mockup ${currentIndex + 1}`}
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  priority
                  unoptimized={selectedMockup.url?.includes('blob.vercel-storage.com')}
                />
              </div>
            )}
            
            {/* Navigation Buttons */}
            {mockups.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={prevMockup}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={nextMockup}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          
          {/* Gallery Thumbnails */}
          {mockups.length > 1 && (
            <div className="p-6 pt-0">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {mockups.map((mockup, index) => (
                  <div
                    key={index}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer flex-shrink-0 transition-all duration-200 ${
                      index === currentIndex 
                        ? 'border-primary shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      setCurrentIndex(index)
                      setSelectedMockup(mockup)
                    }}
                  >
                    <Image
                      src={mockup.url || (mockup.path ? (mockup.path.startsWith('/') ? mockup.path : `/${mockup.path}`) : '/placeholder.svg')}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      unoptimized={mockup.url?.includes('blob.vercel-storage.com')}
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ))}
              </div>
              <div className="text-center text-sm text-muted-foreground mt-2">
                {currentIndex + 1} of {mockups.length} • Use arrow keys to navigate
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

