"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DownloadProductButton } from "@/components/download-product-button"
import { CheckCircle, Download, Mail, ArrowLeft, Package, Heart, Sparkles, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/lib/cart-store"
import { useOrderStore } from "@/lib/order-store"

interface PaymentDetails {
  sessionId: string
  paymentStatus: string
  customerEmail: string
  amountTotal: number
  currency: string
  lineItems: any[]
  createdAt: string
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { completeOrder, items: cartItems } = useCartStore()
  const { addOrder } = useOrderStore()

  useEffect(() => {
    if (sessionId) {
      verifyPayment()
    } else {
      setError('No session ID provided')
      setLoading(false)
    }
  }, [sessionId])

  const verifyPayment = async () => {
    try {
      const response = await fetch('/api/payment/verify-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      })

      const result = await response.json()

      if (result.success) {
        setPaymentDetails(result.data)
        
        // Create order record
        const order = {
          orderId: sessionId,
          sessionId: sessionId,
          customerEmail: result.data.customerEmail,
          amountTotal: result.data.amountTotal,
          items: cartItems, // Items from cart
          purchasedAt: new Date().toISOString(),
          status: 'completed' as const
        }
        
        // Add order to order store
        addOrder(order)
        
        // Complete the order in cart store (clears cart and stores order ID)
        completeOrder(sessionId)
        
        // Store payment details for future reference
        localStorage.setItem('paymentDetails', JSON.stringify({
          sessionId,
          customerEmail: result.data.customerEmail,
          amountTotal: result.data.amountTotal,
          purchasedAt: new Date().toISOString()
        }))
        
        console.log('Payment verified and order completed:', sessionId)
      } else {
        setError(result.error || 'Failed to verify payment')
      }
    } catch (err) {
      console.error('Error verifying payment:', err)
      setError('Failed to verify payment')
    } finally {
      setLoading(false)
    }
  }

  const getProductIdFromMetadata = (item: any) => {
    // Try to extract product ID from metadata or price metadata
    if (item.price?.product?.metadata?.productId) {
      return parseInt(item.price.product.metadata.productId)
    }
    // Fallback: try to match by description/title
    return null
  }

  // Get category ID from product category name
  const getCategoryIdFromCategory = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Names of God': 'faith-decor',
      'Faith-Based Art': 'faith-decor',
      'Identity in Christ': 'faith-decor',
      'Prophetic Art': 'faith-decor',
      'Scripture Art': 'wedding-decor',
      'Faith & Hope': 'home-decor',
      'Affirmations': 'digital-prints',
      'Healing & Deliverance': 'christian-faith'
    }
    return categoryMap[category] || null
  }

  // Get category name for display
  const getCategoryDisplayName = (categoryId: string) => {
    const nameMap: Record<string, string> = {
      'faith-decor': 'Faith Decor',
      'wedding-decor': 'Wedding Decor',
      'love-decor': 'Love Decor',
      'home-decor': 'Home Decor',
      'digital-prints': 'Digital Prints',
      'christian-faith': 'Christian Faith',
      'inspirational': 'Inspirational'
    }
    return nameMap[categoryId] || categoryId
  }

  // Extract unique categories from purchased items
  const getPurchasedCategories = () => {
    if (!paymentDetails || !cartItems.length) return []
    
    const categories = new Set<string>()
    cartItems.forEach(item => {
      if (item.category) {
        const categoryId = getCategoryIdFromCategory(item.category)
        if (categoryId) {
          categories.add(categoryId)
        }
      }
    })
    
    return Array.from(categories)
  }

  const handleEmailReceipt = () => {
    // In a real app, this would send an email receipt
    alert('Receipt email would be sent here!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verifying your payment...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6">
              <h1 className="text-2xl font-bold text-destructive mb-4">Payment Verification Failed</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Link href="/">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Thank You Header - Enhanced with Animation */}
          <div className="text-center relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            {/* Main Thank You Content */}
            <div className="relative z-10">
              {/* Animated Check Icon */}
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                <CheckCircle className="w-14 h-14 text-white" strokeWidth={3} />
              </div>
              
              {/* Thank You Message */}
              <div className="space-y-4 mb-6">
                <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary animate-pulse">
                  Thank You! 🎉
                </h1>
                <div className="flex items-center justify-center gap-2 text-2xl font-semibold text-foreground">
                  <Heart className="w-7 h-7 text-red-500 animate-pulse" fill="currentColor" />
                  <span>We Appreciate Your Purchase</span>
                  <Heart className="w-7 h-7 text-red-500 animate-pulse" fill="currentColor" />
                </div>
                <p className="text-xl text-muted-foreground max-w-md mx-auto">
                  Your support means the world to us! We hope you love your digital products.
                </p>
              </div>
              
              {/* Order Details */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Package className="w-4 h-4 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  Order ID: <span className="font-mono text-primary">{paymentDetails?.sessionId}</span>
                </p>
              </div>
              
              {/* Decorative Sparkles */}
              <div className="flex items-center justify-center gap-1 mt-6 opacity-60">
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse delay-75" />
                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse delay-150" />
              </div>
              
              {/* Contact Button */}
              <div className="mt-8">
                <Button
                  onClick={() => {
                    const message = `Hello Inspire Design! 👋

I just made a purchase and I have a question about my order.

Order ID: ${paymentDetails?.sessionId || 'N/A'}

Thank you!`
                    window.open(`https://wa.me/353899464758?text=${encodeURIComponent(message)}`, '_blank')
                  }}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Us via WhatsApp
                </Button>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          {paymentDetails && (
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold text-card-foreground mb-2">Customer Information</h3>
                  <p className="text-muted-foreground">
                    <Mail className="inline w-4 h-4 mr-2" />
                    {paymentDetails.customerEmail}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-card-foreground mb-4">
                    <Package className="inline w-5 h-5 mr-2" />
                    Purchased Items - Download Your Files
                  </h3>
                  <div className="space-y-4">
                    {paymentDetails.lineItems.map((item, index) => {
                      const productId = getProductIdFromMetadata(item)
                      
                      return (
                        <div key={index} className="p-4 bg-background rounded-lg border border-border space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-card-foreground text-lg">{item.description}</h4>
                              <p className="text-sm text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                            </div>
                            <span className="font-semibold text-card-foreground text-lg">
                              €{((item.amount_total || 0) / 100).toFixed(2)}
                            </span>
                          </div>
                          
                          {productId ? (
                            <DownloadProductButton
                              productId={productId}
                              productTitle={item.description}
                              sessionId={paymentDetails.sessionId}
                            />
                          ) : (
                            <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                              <p className="text-sm text-muted-foreground">
                                📧 Download link will be sent to your email: {paymentDetails.customerEmail}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-card-foreground">Total Paid:</span>
                    <span className="text-2xl font-bold text-primary">
                      €{((paymentDetails.amountTotal || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleEmailReceipt}
                    variant="outline"
                    className="flex-1"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email Receipt
                  </Button>
                  <Link href="/products" className="flex-1">
                    <Button className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <Card className="bg-primary/10 border border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-card-foreground mb-2">📥 Download Instructions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span>Your digital files are ready for instant download</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-500">📦</span>
                  <span>Click "Download All Product Files" for each product to get individual ZIP packages</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-500">📁</span>
                  <span>Each product includes ALL files from that product's folder - PDFs, images, mockups, and more!</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-500">📧</span>
                  <span>A confirmation email with download links has been sent to <strong>{paymentDetails?.customerEmail}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-500">🔒</span>
                  <span>Your files are print-ready at 300 DPI resolution</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-500">💾</span>
                  <span>Save the files to your computer for future access</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-500">❓</span>
                  <span>Need help? Contact us via WhatsApp or email</span>
                </li>
              </ul>
              
              {/* Additional Thank You Note */}
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
                <p className="text-sm text-center text-foreground">
                  <Heart className="inline w-4 h-4 text-red-500 mr-1" fill="currentColor" />
                  <strong>Thank you again for choosing Inspire Design!</strong> We're thrilled to have you as a customer and hope you enjoy your digital products.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

