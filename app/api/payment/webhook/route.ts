import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'

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
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'No signature provided' },
        { status: 400 }
      )
    }

    let event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        console.log('Payment successful:', session.id)
        
        // Here you would typically:
        // 1. Create order in your database
        // 2. Send confirmation email
        // 3. Generate download links
        // 4. Update inventory
        
        // For now, we'll just log it
        console.log('Order completed:', {
          sessionId: session.id,
          customerEmail: session.customer_email,
          amount: session.amount_total,
          metadata: session.metadata,
        })
        break

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object
        console.log('Payment succeeded:', paymentIntent.id)
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object
        console.log('Payment failed:', failedPayment.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
