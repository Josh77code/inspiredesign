"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AnimatedSearch } from "./animated-search"

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || "all")

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "faith-decor", name: "Faith-Based Decor" },
    { id: "wedding-decor", name: "Wedding Decor" },
    { id: "love-decor", name: "Love Decor" },
    { id: "home-decor", name: "Home Décor" },
    { id: "digital-prints", name: "Digital Prints" },
    { id: "christian-faith", name: "Christian Faith" },
    { id: "inspirational", name: "Inspirational" },
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategoryChange(category.id)}
              className={
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground border-border hover:bg-primary hover:text-primary-foreground"
              }
            >
              {category.name}
            </Button>
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
