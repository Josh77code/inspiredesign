"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCartStore } from "@/lib/cart-store"
import { useOrderStore } from "@/lib/order-store"
import { usePurchaseStatus } from "@/hooks/use-purchase-status"
import { Download, ShoppingCart, CheckCircle } from "lucide-react"

export default function TestPaymentPage() {
  const [testOrderId, setTestOrderId] = useState("")
  const { addItem, items, clearCart } = useCartStore()
  const { addOrder, hasValidOrder, getCurrentOrderId } = useOrderStore()
  const { hasPurchase, checkPurchaseStatus } = usePurchaseStatus()

  const handleAddTestItem = () => {
    addItem({
      id: 1,
      title: "Test Product",
      price: 12.99,
      image: "/placeholder.svg",
      artist: "Test Artist",
      category: "Test Category"
    })
  }

  const handleSimulatePayment = () => {
    const orderId = `test_order_${Date.now()}`
    setTestOrderId(orderId)
    
    // Create test order
    const order = {
      orderId,
      sessionId: orderId,
      customerEmail: "test@example.com",
      amountTotal: items.reduce((total, item) => total + (item.price * item.quantity), 0) * 100, // Convert to cents
      items: items,
      purchasedAt: new Date().toISOString(),
      status: 'completed' as const
    }
    
    // Add order
    addOrder(order)
    
    // Clear cart
    clearCart()
    
    console.log('Test payment completed:', orderId)
  }

  const handleTestDownload = async () => {
    const orderId = getCurrentOrderId()
    if (!orderId) {
      alert('No order found!')
      return
    }

    try {
      const response = await fetch(`/api/categories/faith-decor/download?orderId=${orderId}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Download failed')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'test_category_download.zip'
      document.body.appendChild(a)
      a.click()
      
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      alert('Download started!')
      
    } catch (error) {
      console.error('Download error:', error)
      alert('Download failed: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payment Flow Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cart Section */}
        <Card>
          <CardHeader>
            <CardTitle>Cart ({items.length} items)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.length === 0 ? (
              <p className="text-muted-foreground">Cart is empty</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                  <span>{item.title} - €{item.price}</span>
                </div>
              ))
            )}
            
            <div className="flex gap-2">
              <Button onClick={handleAddTestItem} variant="outline">
                Add Test Item
              </Button>
              <Button onClick={clearCart} variant="destructive">
                Clear Cart
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment Section */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded">
              <p className="text-sm">
                <strong>Purchase Status:</strong> {hasPurchase ? '✅ Has Purchase' : '❌ No Purchase'}
              </p>
              <p className="text-sm">
                <strong>Order ID:</strong> {getCurrentOrderId() || 'None'}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleSimulatePayment} 
                disabled={items.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Simulate Payment
              </Button>
              
              <Button 
                onClick={checkPurchaseStatus} 
                variant="outline"
              >
                Check Status
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Download Test */}
        <Card>
          <CardHeader>
            <CardTitle>Download Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Test downloading a category after payment
            </p>
            
            <Button 
              onClick={handleTestDownload}
              disabled={!hasPurchase}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              Test Category Download
            </Button>
          </CardContent>
        </Card>

        {/* Debug Info */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-2 rounded overflow-auto">
              {JSON.stringify({
                hasPurchase,
                orderId: getCurrentOrderId(),
                localStorage: {
                  orderId: localStorage.getItem('orderId'),
                  sessionId: localStorage.getItem('sessionId')
                },
                cartItems: items.length
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
