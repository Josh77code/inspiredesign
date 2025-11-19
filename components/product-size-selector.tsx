"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface SizePricing {
  "5x5": number
  "6x6": number
  "12x12": number
}

interface ProductSizeSelectorProps {
  sizePricing: SizePricing
  selectedSize?: string
  onSizeSelect?: (size: string, price: number) => void
  className?: string
}

export function ProductSizeSelector({
  sizePricing,
  selectedSize,
  onSizeSelect,
  className = ""
}: ProductSizeSelectorProps) {
  const [currentSelection, setCurrentSelection] = useState<string | undefined>(selectedSize)

  const sizes = [
    { key: "5x5" as const, label: "5\" × 5\"", price: sizePricing["5x5"] },
    { key: "6x6" as const, label: "6\" × 6\"", price: sizePricing["6x6"] },
    { key: "12x12" as const, label: "12\" × 12\"", price: sizePricing["12x12"] },
  ]

  const handleSizeClick = (size: string, price: number) => {
    setCurrentSelection(size)
    onSizeSelect?.(size, price)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-foreground">Select Size</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sizes.map((size) => {
          const isSelected = currentSelection === size.key
          return (
            <Card
              key={size.key}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? "border-primary border-2 shadow-md bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => handleSizeClick(size.key, size.price)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-foreground">{size.label}</div>
                    <div className="text-lg font-bold text-primary mt-1">
                      €{size.price.toFixed(2)}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      {currentSelection && (
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="text-sm text-foreground">
            <span className="font-semibold">Selected:</span> {sizes.find(s => s.key === currentSelection)?.label} - 
            <span className="font-bold text-primary ml-1">
              €{sizes.find(s => s.key === currentSelection)?.price.toFixed(2)}
            </span>
          </p>
        </div>
      )}
    </div>
  )
}

