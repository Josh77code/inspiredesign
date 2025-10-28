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
    image: "/New Digital Product/Adonai/Mockup 1.png",
    productCount: 4
  },
  { 
    id: "wedding-decor", 
    name: "Wedding Decor", 
    image: "/New Digital Product/A wife of noble character/Mockup 1.jpg",
    productCount: 1
  },
  { 
    id: "love-decor", 
    name: "Love Decor", 
    image: "/New Digital Product/Jesus&Me/Jesus & Me  (12 × 12in).jpg",
    productCount: 1
  },
  { 
    id: "home-decor", 
    name: "Home Décor", 
    image: "/New Digital Product/Hope/Hope -Black Background (24 × 32in).jpg",
    productCount: 1
  },
  { 
    id: "digital-prints", 
    name: "Digital Prints", 
    image: "/New Digital Product/I am saved/I AM saved  (11 × 14in).jpg",
    productCount: 1
  },
  { 
    id: "christian-faith", 
    name: "Christian Faith", 
    image: "/New Digital Product/Chosen/Chosen- Black Boarder.jpg",
    productCount: 3
  },
  { 
    id: "inspirational", 
    name: "Inspirational", 
    image: "/New Digital Product/Beleive in You/Mockup 1- Believe in you.png",
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
