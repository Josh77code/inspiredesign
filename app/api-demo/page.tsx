import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CheckoutForm } from "@/components/checkout-form"

export default function ApiDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              API Integration Demo
            </h1>
            <p className="text-xl text-muted-foreground">
              Test the checkout functionality with your cart
            </p>
          </div>

          <div className="space-y-8">
            {/* API Status */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">
                API Endpoints Status
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-card-foreground">Products API - Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-card-foreground">Orders API - Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-card-foreground">Contact API - Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-card-foreground">Stripe Payments - Needs Setup</span>
                </div>
              </div>
            </div>

            {/* Stripe Setup Notice */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                ⚠️ Stripe Payment Setup Required
              </h3>
              <p className="text-orange-700 mb-4">
                To enable payment processing, you need to configure your Stripe API keys:
              </p>
              <div className="space-y-2 text-sm text-orange-600">
                <p>1. Create a <a href="https://stripe.com" target="_blank" className="underline">Stripe account</a></p>
                <p>2. Get your API keys from the Stripe Dashboard</p>
                <p>3. Create a <code className="bg-orange-100 px-1 rounded">.env.local</code> file with:</p>
                <pre className="bg-orange-100 p-2 rounded text-xs mt-2">
{`STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here`}
                </pre>
                <p>4. Restart your development server</p>
              </div>
            </div>

            {/* Checkout Form */}
            <CheckoutForm />

            {/* API Usage Examples */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">
                API Usage Examples
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-card-foreground mb-2">Fetch Products:</h3>
                  <code className="block bg-background p-3 rounded text-sm text-foreground">
                    fetch('/api/products')
                  </code>
                </div>
                <div>
                  <h3 className="font-medium text-card-foreground mb-2">Create Order:</h3>
                  <code className="block bg-background p-3 rounded text-sm text-foreground">
                    fetch('/api/orders', {'{'}
                      <br />
                      &nbsp;&nbsp;method: 'POST',
                      <br />
                      &nbsp;&nbsp;headers: {'{'} 'Content-Type': 'application/json' {'}'},
                      <br />
                      &nbsp;&nbsp;body: JSON.stringify(orderData)
                      <br />
                    {'}'})
                  </code>
                </div>
                <div>
                  <h3 className="font-medium text-card-foreground mb-2">Submit Contact Form:</h3>
                  <code className="block bg-background p-3 rounded text-sm text-foreground">
                    fetch('/api/contact', {'{'}
                      <br />
                      &nbsp;&nbsp;method: 'POST',
                      <br />
                      &nbsp;&nbsp;headers: {'{'} 'Content-Type': 'application/json' {'}'},
                      <br />
                      &nbsp;&nbsp;body: JSON.stringify(contactData)
                      <br />
                    {'}'})
                  </code>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-card-foreground mb-4">
                How to Test
              </h2>
              <ol className="space-y-2 text-card-foreground">
                <li>1. Add some products to your cart from the main page</li>
                <li>2. Open the cart (shopping bag icon in header)</li>
                <li>3. Fill out the checkout form above</li>
                <li>4. Click "Place Order" to test the API integration</li>
                <li>5. Check the browser console for API responses</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
