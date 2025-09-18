"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GlowButton } from "./glow-button"
import { TubeLoader } from "./tube-loader"
import { useCartStore } from "@/lib/cart-store"
import { ordersApi, convertCartToOrder } from "@/lib/api"
import { getStripe } from "@/lib/stripe"

export function CheckoutForm() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: ""
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  const [orderId, setOrderId] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      alert("Your cart is empty!")
      return
    }

    if (!customerInfo.email) {
      alert("Please enter your email address")
      return
    }

    setIsProcessing(true)

    try {
      // Create Stripe checkout session
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerInfo,
          successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/payment/cancelled`,
        }),
      })

      const result = await response.json()

      if (result.success && result.data.url) {
        // Redirect to Stripe checkout
        const stripe = await getStripe()
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: result.data.sessionId,
          })

          if (error) {
            console.error('Stripe checkout error:', error)
            alert('Failed to redirect to checkout. Please try again.')
          }
        } else {
          alert('Stripe is not configured. Please contact support.')
        }
      } else {
        alert(result.error || "Failed to create checkout session. Please try again.")
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert("Failed to process payment. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (orderId) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">Order Placed Successfully!</h3>
            <p className="text-muted-foreground mb-4">Your order has been received and is being processed.</p>
            <div className="bg-background p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Order ID:</p>
              <p className="font-mono text-lg font-semibold text-card-foreground">{orderId}</p>
            </div>
          </div>
          <Button 
            onClick={() => setOrderId(null)}
            variant="outline"
            className="w-full"
          >
            Place Another Order
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-2xl text-card-foreground">Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Customer Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-card-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                className="bg-background text-foreground border-border focus:border-primary"
                placeholder="Your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                required
                className="bg-background text-foreground border-border focus:border-primary"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-card-foreground">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={customerInfo.phone}
                onChange={handleInputChange}
                className="bg-background text-foreground border-border focus:border-primary"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Order Summary</h3>
            
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-border">
                  <div>
                    <p className="font-medium text-card-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">by {item.artist}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-card-foreground">
                      {isMounted ? `€${item.price.toFixed(2)}` : '€0.00'} × {item.quantity}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {isMounted ? `€${(item.price * item.quantity).toFixed(2)}` : '€0.00'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              <span className="text-lg font-semibold text-card-foreground">Total:</span>
              <span className="text-xl font-bold text-primary">
                {isMounted ? `€${getTotalPrice().toFixed(2)}` : '€0.00'}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2">
                <TubeLoader size="lg" />
                <span className="text-sm text-muted-foreground">Processing your order...</span>
              </div>
            ) : (
              <GlowButton type="submit" className="w-full">
                Place Order - {isMounted ? `€${getTotalPrice().toFixed(2)}` : '€0.00'}
              </GlowButton>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
