"use client"

import { X, Plus, Minus, ShoppingBag, CreditCard } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GlowButton } from "./glow-button"
import { useCartStore } from "@/lib/cart-store"

export function CartOverlay() {
  const { items, isOpen, toggleCart, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isOpen) return null

  const total = getTotalPrice()

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleCart} />

      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-card-foreground">Shopping Cart</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCart}
              className="text-card-foreground hover:bg-background"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-card-foreground mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">Add some digital art to get started!</p>
                <Button onClick={toggleCart} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-background rounded-lg border border-border">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />

                    <div className="flex-1 space-y-2">
                      <h3 className="font-medium text-card-foreground line-clamp-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">by {item.artist}</p>
                      <p className="text-sm font-medium text-primary">€{item.price}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 bg-background text-card-foreground border-border"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium text-card-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 bg-background text-card-foreground border-border"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-card-foreground">Total:</span>
                  <span className="text-2xl font-bold text-primary">
                    {isMounted ? `€${total.toFixed(2)}` : '€0.00'}
                  </span>
                </div>

              <div className="space-y-2">
                <GlowButton 
                  className="w-full text-lg py-3"
                  onClick={async () => {
                    try {
                      // Create Stripe checkout session
                      const response = await fetch('/api/payment/create-checkout-session', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          items: items,
                          customerInfo: {
                            email: 'customer@example.com', // You can make this dynamic
                            name: 'Customer'
                          },
                          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                          cancelUrl: `${window.location.origin}/payment/cancelled`,
                        }),
                      })

                      const result = await response.json()

                      if (result.success && result.data.url) {
                        // Redirect to Stripe checkout
                        window.location.href = result.data.url
                      } else {
                        alert(result.error || "Failed to create checkout session. Please try again.")
                      }
                    } catch (error) {
                      console.error('Checkout error:', error)
                      alert('Failed to process checkout. Please try again.')
                    }
                  }}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Checkout with Stripe - {isMounted ? `€${total.toFixed(2)}` : '€0.00'}
                </GlowButton>

                <Button
                  variant="outline"
                  className="w-full bg-background text-card-foreground border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
