import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo - in production, use a database
let orders: any[] = []

// GET /api/orders/[id] - Get a specific order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    
    const order = orders.find(o => o.id === orderId)
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}

// PUT /api/orders/[id] - Update order status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    const body = await request.json()
    
    const orderIndex = orders.findIndex(o => o.id === orderId)
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    // In a real app, you would:
    // 1. Validate status transitions
    // 2. Send notifications
    // 3. Update database

    const updatedOrder = {
      ...orders[orderIndex],
      ...body,
      id: orderId, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    }

    orders[orderIndex] = updatedOrder

    return NextResponse.json({
      success: true,
      data: updatedOrder
    })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

// DELETE /api/orders/[id] - Cancel/delete an order
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id
    
    const orderIndex = orders.findIndex(o => o.id === orderId)
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      )
    }

    const order = orders[orderIndex]

    // In a real app, you would:
    // 1. Check if order can be cancelled
    // 2. Process refund if payment was made
    // 3. Send cancellation email

    // For demo, we'll just mark as cancelled
    orders[orderIndex].status = 'cancelled'
    orders[orderIndex].updatedAt = new Date().toISOString()

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      data: orders[orderIndex]
    })
  } catch (error) {
    console.error('Error cancelling order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to cancel order' },
      { status: 500 }
    )
  }
}
