import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Stripe is not configured. Please add your Stripe API keys to environment variables.' 
        },
        { status: 500 }
      )
    }
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent'],
    })

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      )
    }

    // Extract order details from session
    const orderDetails = {
      sessionId: session.id,
      paymentStatus: session.payment_status,
      customerEmail: session.customer_email,
      customerDetails: session.customer_details,
      amountTotal: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
      lineItems: session.line_items?.data || [],
      createdAt: new Date(session.created * 1000).toISOString(),
    }

    return NextResponse.json({
      success: true,
      data: orderDetails,
    })

  } catch (error) {
    console.error('Error verifying session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify session' },
      { status: 500 }
    )
  }
}
