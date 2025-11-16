"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, ShoppingCart, MessageCircle, Star, Heart, Lock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GlowButton } from "./glow-button"
import { TubeLoader } from "./tube-loader"
import { useCartStore } from "@/lib/cart-store"

// Helper function to get image path - use API route for paths with spaces
const getImagePath = (path: string): string => {
  if (!path) return "/placeholder.svg"
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // If path contains "New Digital Product" or has spaces, use API route
  if (cleanPath.includes('New Digital Product') || cleanPath.includes(' ')) {
    // Encode each path segment for the API route URL
    const encodedSegments = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/')
    return `/api/images/${encodedSegments}`
  }
  
  // For other paths, use direct public folder access
  return path.startsWith('/') ? path : `/${path}`
}

interface Product {
  id: number
  title: string
  price: number
  category: string
  image: string
  artist: string
  rating: number
  downloads: number
  downloadAvailable?: boolean
  requiresPayment?: boolean
  pricing?: Record<string, number>
  pdfPricing?: Record<string, number>
  bundlePricing?: Record<string, number>
  comboPricing?: Record<string, number>
  sizes?: string[]
  formats?: string[]
  variations?: number
  pdfs?: Array<{
    name: string
    path: string
    size?: string
  }>
  mockups?: Array<{
    name: string
    path: string
  }>
  images?: Array<{
    name: string
    path: string
    size?: string
  }>
  videos?: Array<{
    name: string
    path: string
    size?: string
  }>
  allFiles?: Array<{
    name: string
    path: string
    size?: string
  }>
  folderPath?: string
  totalFiles?: number
  totalSize?: string
  downloadType?: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showDownloadDialog, setShowDownloadDialog] = useState(false)
  const { addItem, toggleCart } = useCartStore()

  const handleAddToCart = () => {
    setIsLoading(true)
    setTimeout(() => {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        artist: product.artist,
        category: product.category,
      })
      setIsLoading(false)
      toggleCart()
    }, 1000)
  }

  const handleMessageArtist = () => {
    const message = `Hello Inspire Design! 👋

I'm interested in purchasing this product:
📦 *${product.title}*
💰 Price: €${product.price.toFixed(2)}
🎨 Category: ${product.category}

I would like to:
• Get more information
• Discuss pricing/sizes
• Place an order

Looking forward to hearing from you!`
    // Direct WhatsApp link - opens the chat directly with pre-filled message
    const whatsappUrl = `https://wa.me/353899464758?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const handleDownloadClick = () => {
    setShowDownloadDialog(true)
  }

  const handlePurchaseAndDownload = () => {
    setShowDownloadDialog(false)
    handleAddToCart()
  }

  const handleMessageForDownload = () => {
    setShowDownloadDialog(false)
    handleMessageArtist()
  }

  return (
    <Card
      className={`product-glow product-float bg-card border-border overflow-hidden transition-all duration-300 ${
        isHovered ? "shadow-lg shadow-primary/20" : "shadow-md"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={getImagePath(product.image || "/placeholder.svg")}
          alt={product.title || "Product image"}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            const originalPath = product.image || ""
            const attemptedPath = getImagePath(originalPath)
            
            // Prevent infinite loop
            if (target.src.includes('/placeholder.svg')) {
              return
            }
            
            const errorDetails = {
              productId: product.id,
              productTitle: product.title,
              originalPath: originalPath,
              attemptedPath: attemptedPath,
              attemptedSrc: target?.src,
              fullUrl: typeof window !== 'undefined' ? window.location.origin + attemptedPath : attemptedPath,
              errorEvent: e.type
            }
            
            console.error('❌ Image failed to load:', JSON.stringify(errorDetails, null, 2))
            
            // If API route failed, check if it's a 404 and try alternative
            if (target && target.src.includes('/api/images/') && originalPath) {
              // The API route should work, but if it doesn't, the file might not exist
              // Check Network tab for actual error code
              console.log('🔍 API route failed, check Network tab for status code')
              // Don't try direct path as it will also fail on Vercel
            }
            
            // Final fallback to placeholder
            if (target && target.src !== "/placeholder.svg" && !target.src.includes('/placeholder.svg')) {
              console.log('⚠️ Falling back to placeholder')
              target.src = "/placeholder.svg"
            }
          }}
          onLoad={() => {
            console.log('✅ Image loaded successfully:', product.title, product.image)
          }}
          loading="lazy"
        />

        {/* Overlay with actions */}
        <div
          className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            size="icon"
            variant="secondary"
            onClick={handleDownloadClick}
            className="bg-card/90 text-card-foreground hover:bg-orange-500 hover:text-white"
            title="Download (Payment Required)"
          >
            <Lock className="h-4 w-4" />
          </Button>

          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <TubeLoader size="sm" />
              <span className="text-xs text-white">Adding...</span>
            </div>
          ) : (
            <GlowButton onClick={handleAddToCart} className="px-4">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </GlowButton>
          )}

          <Button
            size="icon"
            variant="secondary"
            onClick={handleMessageArtist}
            className="bg-green-500 text-white hover:bg-green-600"
            title="Order via WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>

        {/* Like button */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-black/20 hover:bg-black/40"
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : "text-white"}`} />
        </Button>

        {/* Category badge */}
        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">{product.category}</Badge>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-card-foreground line-clamp-2">{product.title}</h3>
          <p className="text-sm text-muted-foreground">by {product.artist}</p>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground">{product.downloads} downloads</span>
          </div>

          {/* File info for folder-based products */}
          {product.totalFiles && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <Badge variant="secondary" className="text-xs">
                📦 {product.totalFiles} files
              </Badge>
              {product.pdfs && product.pdfs.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  📄 {product.pdfs.length} PDFs
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 space-y-3">
        <div className="text-2xl font-bold text-primary text-center">
          {product.pricing && Object.keys(product.pricing).length > 1 
            ? `€${Math.min(...Object.values(product.pricing))} - €${Math.max(...Object.values(product.pricing))}`
            : `€${product.price}`
          }
        </div>

        <div className="grid grid-cols-1 gap-2">
          <Link href={`/products/${product.id}`} className="w-full">
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-card text-card-foreground border-border hover:bg-blue-500 hover:text-white hover:border-blue-500 h-10"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              onClick={handleMessageArtist}
              className="bg-green-500 text-white hover:bg-green-600 border-0 h-10"
              title="Order via WhatsApp"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Order
            </Button>

            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 rounded-md">
                <TubeLoader size="sm" />
              </div>
            ) : (
              <GlowButton onClick={handleAddToCart} className="text-sm h-10">
                <ShoppingCart className="h-4 w-4 mr-1" />
                Cart
              </GlowButton>
            )}
          </div>
        </div>
      </CardFooter>

      {/* Download Restriction Dialog */}
      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-orange-500" />
              Download Requires Purchase
            </DialogTitle>
            <DialogDescription>
              To download "{product.title}", you need to either purchase it or contact us for a custom quote.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <h4 className="font-semibold text-primary mb-1">Purchase Option</h4>
                <p className="text-sm text-muted-foreground">
                  Add to cart and complete purchase to get instant download access.
                </p>
                <div className="text-lg font-bold text-primary mt-2">
                  {product.pricing && Object.keys(product.pricing).length > 1 
                    ? `€${Math.min(...Object.values(product.pricing))} - €${Math.max(...Object.values(product.pricing))}`
                    : `€${product.price}`
                  }
                </div>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-semibold text-green-700 dark:text-green-400 mb-1">Contact Option</h4>
                <p className="text-sm text-muted-foreground">
                  Message us for custom pricing, licensing, or bulk discounts.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDownloadDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleMessageForDownload}
              className="w-full sm:w-auto border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Us
            </Button>
            <Button
              onClick={handlePurchaseAndDownload}
              className="w-full sm:w-auto"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
