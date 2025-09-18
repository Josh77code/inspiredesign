"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "./product-card"
import { TubeLoader } from "./tube-loader"

interface Product {
  id: number
  title: string
  price: number
  category: string
  image: string
  artist: string
  rating: number
  downloads: number
  description: string
  tags: string[]
  createdAt: string
  updatedAt: string
  downloadAvailable?: boolean
  requiresPayment?: boolean
}

interface ProductsResponse {
  success: boolean
  data: {
    products: Product[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
    filters: {
      categories: string[]
      priceRange: {
        min: number
        max: number
      }
    }
  }
}

interface ProductsGalleryProps {
  searchQuery?: string
  categoryFilter?: string
}

export function ProductsGallery({ searchQuery, categoryFilter }: ProductsGalleryProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        
        // Build query parameters
        const params = new URLSearchParams()
        if (searchQuery) params.append('search', searchQuery)
        if (categoryFilter) params.append('category', categoryFilter)
        
        const response = await fetch(`/api/products?${params.toString()}`)
        const data: ProductsResponse = await response.json()
        
        if (data.success) {
          setProducts(data.data.products)
        } else {
          setError('Failed to fetch products')
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchQuery, categoryFilter])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <TubeLoader size="lg" />
        <p className="text-muted-foreground mt-4">Loading inspiring faith-based designs...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground mb-4">No products found</p>
        <p className="text-sm text-muted-foreground">Check back later for new faith-based designs!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
