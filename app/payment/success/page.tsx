"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DownloadProductButton } from "@/components/download-product-button"
import { CheckCircle, Download, Mail, ArrowLeft, Package } from "lucide-react"
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
          {/* Success Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Thank you for your purchase
            </p>
            <p className="text-sm text-muted-foreground">
              Order ID: {paymentDetails?.sessionId}
            </p>
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
                <li>✅ Your digital files are ready for instant download</li>
                <li>📦 Click "Download All Files" to get everything as a ZIP package</li>
                <li>📧 A confirmation email with download links has been sent to {paymentDetails?.customerEmail}</li>
                <li>🔒 Your files are print-ready at 300 DPI resolution</li>
                <li>💾 Save the files to your computer for future access</li>
                <li>❓ Need help? Contact us via WhatsApp or email</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

