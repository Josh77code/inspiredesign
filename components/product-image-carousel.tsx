"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductImage {
  name: string
  path: string
}

interface ProductImageCarouselProps {
  images: ProductImage[]
  productTitle: string
  fallbackImage?: string
}

export function ProductImageCarousel({
  images,
  productTitle,
  fallbackImage
}: ProductImageCarouselProps) {
  const [api, setApi] = useState<any>(null)
  const [current, setCurrent] = useState(0)

  // Combine all images - include fallback as first if no images exist
  const allImages = images && images.length > 0 
    ? images 
    : fallbackImage 
      ? [{ name: productTitle, path: fallbackImage }]
      : []

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  if (allImages.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Main Carousel */}
      <div className="relative">
        <Carousel setApi={setApi} className="w-full">
          <CarouselContent>
            {allImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-square rounded-lg overflow-hidden border bg-white">
                  <Image
                    src={image.path.startsWith('/') ? image.path : `/${image.path}`}
                    alt={`${productTitle} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {allImages.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-2 shadow-lg z-10" />
              <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-2 shadow-lg z-10" />
            </>
          )}
        </Carousel>

        {/* Image Counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
            {current} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all duration-200 ${
                current === index + 1
                  ? 'border-primary shadow-md scale-105 ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-gray-300 opacity-75 hover:opacity-100'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.path.startsWith('/') ? image.path : `/${image.path}`}
                alt={`${productTitle} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Count Badge */}
      {allImages.length > 1 && (
        <div className="text-center text-sm text-muted-foreground">
          <p>
            📸 Showing {allImages.length} image{allImages.length > 1 ? 's' : ''} - Swipe or click to view all
          </p>
        </div>
      )}
    </div>
  )
}

