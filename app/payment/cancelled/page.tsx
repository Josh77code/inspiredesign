import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react"
import Link from "next/link"

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Cancelled Header */}
          <div>
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Payment Cancelled
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Your payment was cancelled
            </p>
            <p className="text-sm text-muted-foreground">
              No charges have been made to your account
            </p>
          </div>

          {/* Info Card */}
          <Card className="bg-card border-border">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">
                What happened?
              </h2>
              <p className="text-muted-foreground mb-6">
                You cancelled the payment process before completing your purchase. 
                Your items are still in your cart and ready to checkout whenever you're ready.
              </p>
              
              <div className="space-y-4">
                <Link href="/products">
                  <Button className="w-full">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="bg-primary/10 border border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold text-card-foreground mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you encountered any issues during checkout, we're here to help!
              </p>
              <Link href="/contact">
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

