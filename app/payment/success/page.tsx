"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Download, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

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

  const handleDownload = (item: any) => {
    // In a real app, this would generate secure download links
    alert(`Download link for "${item.description}" would be generated here!`)
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
                  <h3 className="font-semibold text-card-foreground mb-4">Purchased Items</h3>
                  <div className="space-y-3">
                    {paymentDetails.lineItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-background rounded-lg border border-border">
                        <div className="flex-1">
                          <h4 className="font-medium text-card-foreground">{item.description}</h4>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-card-foreground">
                            €{((item.amount_total || 0) / 100).toFixed(2)}
                          </span>
                          <Button
                            size="sm"
                            onClick={() => handleDownload(item)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
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
              <h3 className="font-semibold text-card-foreground mb-2">What's Next?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Your digital art files are ready for download</li>
                <li>• A confirmation email has been sent to your email address</li>
                <li>• You can download your files anytime from your account</li>
                <li>• Need help? Contact our support team</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

