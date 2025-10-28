"use client"

import { CategoryCard } from "@/components/category-card"
import { useRouter } from "next/navigation"
import { usePurchaseStatus } from "@/hooks/use-purchase-status"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ShoppingCart, Lock } from "lucide-react"

const categories = [
  { 
    id: "faith-decor", 
    name: "Faith-Based Decor", 
    image: "/optimized-products/medium/Adonai (12 × 12in) - No Broader_medium.webp",
    productCount: 4
  },
  { 
    id: "wedding-decor", 
    name: "Wedding Decor", 
    image: "/optimized-products/medium/A wife of noble character (4.5 ratio)_medium.webp",
    productCount: 1
  },
  { 
    id: "love-decor", 
    name: "Love Decor", 
    image: "/optimized-products/medium/Jesus & Me  (12 × 12in)_medium.webp",
    productCount: 1
  },
  { 
    id: "home-decor", 
    name: "Home Décor", 
    image: "/optimized-products/medium/Hope -Black Background (24 × 32in)_medium.webp",
    productCount: 1
  },
  { 
    id: "digital-prints", 
    name: "Digital Prints", 
    image: "/optimized-products/medium/I AM saved  (11 × 14in)_medium.webp",
    productCount: 1
  },
  { 
    id: "christian-faith", 
    name: "Christian Faith", 
    image: "/optimized-products/medium/Chosen- Black Boarder_medium.webp",
    productCount: 3
  },
  { 
    id: "inspirational", 
    name: "Inspirational", 
    image: "/optimized-products/medium/Believe in You (16 × 20in)_medium.webp",
    productCount: 2
  },
]

export default function CategoriesPage() {
  const { hasPurchase } = usePurchaseStatus()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Product Categories</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of digital art and designs. Each category contains carefully curated products that you can download as complete packages.
        </p>
      </div>

      {/* Purchase Status Alert */}
      {!hasPurchase && (
        <Alert className="mb-8 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            <strong>Purchase Required:</strong> You need to complete a purchase before downloading products. 
            Add items to your cart and checkout to unlock downloads.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            showDownload={true}
            onCategoryClick={(categoryId) => {
              // Navigate to products page with category filter
              window.location.href = `/products?category=${categoryId}`
            }}
          />
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-semibold mb-2">Browse Categories</h3>
            <p className="text-muted-foreground">
              Explore our carefully organized categories to find the perfect designs for your needs.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🛒</span>
            </div>
            <h3 className="font-semibold mb-2">Purchase Products</h3>
            <p className="text-muted-foreground">
              Add individual products to your cart or download entire categories as complete packages.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <h3 className="font-semibold mb-2">Download Everything</h3>
            <p className="text-muted-foreground">
              Get all files in each category as organized ZIP packages for easy access and storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
