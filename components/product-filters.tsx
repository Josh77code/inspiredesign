"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatedSearch } from "./animated-search"
import { Download, Package, Lock } from "lucide-react"
import { toast } from "sonner"
import { usePurchaseStatus } from "@/hooks/use-purchase-status"

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || "all")
  const [downloadingCategory, setDownloadingCategory] = useState<string | null>(null)
  const { hasPurchase, checkPurchaseStatus } = usePurchaseStatus()

  const categories = [
    { id: "all", name: "All Categories", image: null },
    { id: "faith-decor", name: "Faith-Based Decor", image: "/New Digital Product/Adonai/Mockup 1.png" },
    { id: "wedding-decor", name: "Wedding Decor", image: "/New Digital Product/A wife of noble character/Mockup 1.jpg" },
    { id: "love-decor", name: "Love Decor", image: "/New Digital Product/Jesus&Me/Jesus & Me  (12 × 12in).jpg" },
    { id: "home-decor", name: "Home Décor", image: "/New Digital Product/Hope/Hope -Black Background (24 × 32in).jpg" },
    { id: "digital-prints", name: "Digital Prints", image: "/New Digital Product/I am saved/I AM saved  (11 × 14in).jpg" },
    { id: "christian-faith", name: "Christian Faith", image: "/New Digital Product/Chosen/Chosen- Black Boarder.jpg" },
    { id: "inspirational", name: "Inspirational", image: "/New Digital Product/Beleive in You/Mockup 1- Believe in you.png" },
  ]

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
    const params = new URLSearchParams(searchParams.toString())
    
    if (categoryId === "all") {
      params.delete('category')
    } else {
      params.set('category', categoryId)
    }
    
    router.push(`/products?${params.toString()}`)
  }

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

    setDownloadingCategory(categoryId)
    
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
      setDownloadingCategory(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 w-full">
          {categories.map((category) => (
            <div key={category.id} className="relative group">
              <Button
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => handleCategoryChange(category.id)}
                className={`w-full h-20 flex flex-col items-center justify-center gap-2 p-2 ${
                  activeCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground border-border hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                {category.image && (
                  <div className="relative w-8 h-8 rounded overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="text-xs text-center leading-tight">{category.name}</span>
              </Button>
              
              {/* Download button for categories (except "all") */}
              {category.id !== "all" && (
                <Button
                  size="sm"
                  variant={hasPurchase ? "secondary" : "destructive"}
                  className={`absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                    !hasPurchase ? "bg-red-500/20 hover:bg-red-500/30" : ""
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCategoryDownload(category.id, category.name)
                  }}
                  disabled={downloadingCategory === category.id}
                  title={hasPurchase 
                    ? "Download all products in this category" 
                    : "Purchase required to download products"
                  }
                >
                  {downloadingCategory === category.id ? (
                    <Package className="h-3 w-3 animate-spin" />
                  ) : hasPurchase ? (
                    <Download className="h-3 w-3" />
                  ) : (
                    <Lock className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4 items-center">
          <Select defaultValue="newest">
            <SelectTrigger className="w-40 bg-card text-card-foreground border-border">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <AnimatedSearch />
        </div>
      </div>
    </div>
  )
}
