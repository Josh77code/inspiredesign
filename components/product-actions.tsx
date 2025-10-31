"use client"

import { Button } from '@/components/ui/button'
import { MessageCircle, ShoppingCart, Download } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

interface ProductActionsProps {
  product: {
    id: number
    title: string
    price: number
    artist: string
    rating: number
    sizes?: string[]
    image: string
    category: string
  }
  priceRange: string
}

export function ProductActions({ product, priceRange }: ProductActionsProps) {
  const { addItem, toggleCart } = useCartStore()

  const handleWhatsApp = () => {
    const message = `Hello Inspire Design! 👋

I'm interested in ordering:
📦 *${product.title}*
💰 Price: ${priceRange}
🎨 By: ${product.artist}
⭐ Rating: ${product.rating}/5

Available sizes: ${product.sizes ? product.sizes.join(', ') : 'Multiple options'}

Please provide more details about:
• Available formats and sizes
• Delivery/download options
• Any current discounts

Thank you!`
    window.open(`https://wa.me/353899464758?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      artist: product.artist,
      category: product.category,
    })
    toggleCart()
  }

  return (
    <div className="flex flex-col gap-3">
      <Button 
        className="w-full bg-green-500 hover:bg-green-600 text-white" 
        size="lg"
        onClick={handleWhatsApp}
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Order via WhatsApp
      </Button>
      <div className="flex gap-3">
        <Button className="flex-1" size="lg" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
        <Button variant="outline" size="lg">
          <Download className="h-4 w-4 mr-2" />
          Buy Now
        </Button>
      </div>
    </div>
  )
}

