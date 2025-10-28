"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Package, Lock } from "lucide-react"
import { toast } from "sonner"
import { usePurchaseStatus } from "@/hooks/use-purchase-status"

interface Category {
  id: string
  name: string
  image: string | null
  productCount?: number
}

interface CategoryCardProps {
  category: Category
  showDownload?: boolean
  onCategoryClick?: (categoryId: string) => void
}

export function CategoryCard({ 
  category, 
  showDownload = true, 
  onCategoryClick 
}: CategoryCardProps) {
  const [downloading, setDownloading] = useState(false)
  const { hasPurchase, checkPurchaseStatus } = usePurchaseStatus()

  const handleCategoryDownload = async (categoryId: string, categoryName: string) => {
    if (categoryId === "all") {
      toast.error("Cannot download all categories at once")
      return
    }

    // Check if user has made a purchase
    if (!checkPurchaseStatus()) {
      toast.error('Purchase Required', {
        description: 'Please complete a purchase before downloading products. Add items to cart and checkout first.'
      })
      return
    }

    setDownloading(true)
    
    try {
      const params = new URLSearchParams()
      if (orderId) params.append('orderId', orderId)
      if (sessionId) params.append('sessionId', sessionId)
      
      const response = await fetch(`/api/categories/${categoryId}/download?${params.toString()}`)
      
      if (!response.ok) {
        const error = await response.json()
        if (response.status === 403) {
          toast.error('Purchase Required', {
            description: 'Please complete a purchase before downloading products.'
          })
          return
        }
        throw new Error(error.error || 'Download failed')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${categoryName.replace(/[^a-z0-9]/gi, '_')}_category.zip`
      document.body.appendChild(a)
      a.click()
      
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      toast.success('Category download started!', {
        description: `Downloading all products from ${categoryName} category.`
      })
      
    } catch (error) {
      console.error('Category download error:', error)
      toast.error('Download failed', {
        description: error instanceof Error ? error.message : 'Please try again or contact support.'
      })
    } finally {
      setDownloading(false)
    }
  }

  const handleClick = () => {
    if (onCategoryClick) {
      onCategoryClick(category.id)
    }
  }

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative aspect-square">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
            <Package className="h-12 w-12 text-primary/60" />
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        
        {/* Download button */}
        {showDownload && category.id !== "all" && (
          <Button
            size="sm"
            variant={hasPurchase ? "secondary" : "destructive"}
            className={`absolute top-2 right-2 h-8 w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
              !hasPurchase ? "bg-red-500/20 hover:bg-red-500/30" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation()
              handleCategoryDownload(category.id, category.name)
            }}
            disabled={downloading}
            title={hasPurchase 
              ? "Download all products in this category" 
              : "Purchase required to download products"
            }
          >
            {downloading ? (
              <Package className="h-4 w-4 animate-spin" />
            ) : hasPurchase ? (
              <Download className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
          {category.productCount && (
            <p className="text-sm text-muted-foreground">
              {category.productCount} products
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Button 
            className="w-full h-10" 
            variant="outline"
            onClick={handleClick}
          >
            View Products
          </Button>
          
          {showDownload && category.id !== "all" && (
            <Button
              size="sm"
              variant={hasPurchase ? "default" : "secondary"}
              className={`w-full h-8 text-xs ${
                !hasPurchase ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/20 dark:text-amber-400" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation()
                handleCategoryDownload(category.id, category.name)
              }}
              disabled={downloading}
              title={hasPurchase 
                ? "Download all products in this category" 
                : "Purchase required to download products"
              }
            >
              {downloading ? (
                <>
                  <Package className="h-3 w-3 mr-1 animate-spin" />
                  Downloading...
                </>
              ) : hasPurchase ? (
                <>
                  <Download className="h-3 w-3 mr-1" />
                  Download All
                </>
              ) : (
                <>
                  <Lock className="h-3 w-3 mr-1" />
                  Purchase Required
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
