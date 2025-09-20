import { NextRequest, NextResponse } from 'next/server'
import { productsDB } from '@/lib/database'

// POST /api/products/[id]/download - Download product after payment verification
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)
    const body = await request.json()
    
    // Verify payment or order status
    const { orderId, paymentStatus } = body
    
    if (!orderId || !paymentStatus) {
      return NextResponse.json(
        { success: false, error: 'Order ID and payment status are required' },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Verify the order exists and is paid
    // 2. Check if the user has permission to download this product
    // 3. Log the download for analytics
    // 4. Generate secure download links with expiration
    
    const product = productsDB.getById(productId)
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Simulate payment verification
    if (paymentStatus !== 'paid') {
      return NextResponse.json(
        { success: false, error: 'Payment not completed' },
        { status: 402 }
      )
    }

    // Return download information
    return NextResponse.json({
      success: true,
      data: {
        downloadUrl: product.downloadUrl || '/downloads/placeholder.zip',
        filename: `${product.title.replace(/[^a-zA-Z0-9]/g, '_')}.zip`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        productTitle: product.title,
        productId: product.id
      }
    })

  } catch (error) {
    console.error('Error processing download request:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process download request' },
      { status: 500 }
    )
  }
}

// GET /api/products/[id]/download - Check download eligibility
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('orderId')
    
    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      )
    }

    const product = productsDB.getById(productId)
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // In a real application, you would verify the order and payment status
    // For now, we'll return that download is not available without payment
    return NextResponse.json({
      success: false,
      error: 'Payment required for download',
      data: {
        productTitle: product.title,
        price: product.price,
        requiresPayment: true
      }
    })

  } catch (error) {
    console.error('Error checking download eligibility:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check download eligibility' },
      { status: 500 }
    )
  }
}






