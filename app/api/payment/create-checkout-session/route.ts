import { NextRequest, NextResponse } from 'next/server'
import { stripe, formatAmountForStripe } from '@/lib/stripe'

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
    const { items, customerInfo, successUrl, cancelUrl } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Items are required' },
        { status: 400 }
      )
    }

    if (!customerInfo || !customerInfo.email) {
      return NextResponse.json(
        { success: false, error: 'Customer email is required' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.title,
          description: `Digital Art by ${item.artist}`,
          images: item.image ? [new URL(item.image, request.url).href] : [],
          metadata: {
            product_id: item.id.toString(),
            artist: item.artist,
            category: item.category,
          },
        },
        unit_amount: formatAmountForStripe(item.price, 'eur'),
      },
      quantity: item.quantity,
    }))

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${request.nextUrl.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.nextUrl.origin}/payment/cancelled`,
      customer_email: customerInfo.email,
      metadata: {
        customer_name: customerInfo.name || '',
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone || '',
        total_amount: totalAmount.toString(),
        item_count: items.length.toString(),
      },
      // Enable automatic tax calculation if available
      automatic_tax: { enabled: false },
      // Add shipping address collection if needed
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'IE', 'PT', 'FI', 'SE', 'NO', 'DK'], // European countries for Euro payments
      },
      // Customize the checkout experience
      custom_fields: [
        {
          key: 'purchase_type',
          label: {
            type: 'custom',
            custom: 'Purchase Type',
          },
          type: 'dropdown',
          dropdown: {
            options: [
              { label: 'Personal Use', value: 'personal' },
              { label: 'Commercial Use', value: 'commercial' },
            ],
          },
        },
      ],
    })

    return NextResponse.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url,
      },
    })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
