import { NextRequest, NextResponse } from 'next/server'
import { ordersDB } from '@/lib/database'
import { EmailService } from '@/lib/email'

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { items, customerInfo, totalAmount } = body
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    if (!customerInfo || !customerInfo.email) {
      return NextResponse.json(
        { success: false, error: 'Customer information is required' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const calculatedTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
      return NextResponse.json(
        { success: false, error: 'Total amount mismatch' },
        { status: 400 }
      )
    }

    // Create order
    const order = {
      id: `ORD-${Date.now()}`,
      items: items.map((item: any) => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        artist: item.artist,
        image: item.image
      })),
      customerInfo: {
        email: customerInfo.email,
        name: customerInfo.name || '',
        phone: customerInfo.phone || ''
      },
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save to database
    const savedOrder = ordersDB.create(order)

    // Send order confirmation email
    const emailSent = await EmailService.sendOrderConfirmation({
      customerName: customerInfo.name || 'Customer',
      customerEmail: customerInfo.email,
      orderId: order.id,
      items: order.items,
      totalAmount: order.totalAmount
    })

    if (!emailSent) {
      console.warn('Failed to send order confirmation email')
    }

    // Simulate payment processing (in real app, integrate with Stripe/PayPal)
    setTimeout(() => {
      const updatedOrder = ordersDB.update(order.id, {
        status: 'completed',
        paymentStatus: 'paid'
      })
      
      if (updatedOrder) {
        // Send status update email
        EmailService.sendOrderStatusUpdate(customerInfo.email, order.id, 'completed')
      }
    }, 2000)

    return NextResponse.json({
      success: true,
      data: order
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// GET /api/orders - Get orders (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get orders from database
    let filteredOrders = ordersDB.getAll()

    // Filter by email (customer orders)
    if (email) {
      filteredOrders = filteredOrders.filter(order => 
        order.customerInfo.email.toLowerCase() === email.toLowerCase()
      )
    }

    // Filter by status
    if (status) {
      filteredOrders = filteredOrders.filter(order => 
        order.status.toLowerCase() === status.toLowerCase()
      )
    }

    // Sort by creation date (newest first)
    filteredOrders.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        orders: paginatedOrders,
        pagination: {
          page,
          limit,
          total: filteredOrders.length,
          totalPages: Math.ceil(filteredOrders.length / limit)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
