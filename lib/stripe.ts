import Stripe from 'stripe'

// Server-side Stripe instance
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    })
  : null

// Client-side Stripe instance
export const getStripe = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return import('@stripe/stripe-js').then(({ loadStripe }) =>
      loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    )
  }
  return null
}

// Helper function to format amount for Stripe (convert to cents)
export const formatAmountForStripe = (amount: number, currency: string): number => {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(amount)
  let zeroDecimalCurrency = true
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? Math.round(amount) : Math.round(amount * 100)
}

// Helper function to format amount from Stripe (convert from cents)
export const formatAmountFromStripe = (amount: number, currency: string): number => {
  const numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  })
  const parts = numberFormat.formatToParts(100)
  let zeroDecimalCurrency = true
  for (const part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false
    }
  }
  return zeroDecimalCurrency ? amount : amount / 100
}

// Product metadata for Stripe
export const createProductMetadata = (product: any) => ({
  product_id: product.id.toString(),
  product_title: product.title,
  artist: product.artist,
  category: product.category,
  downloads: product.downloads?.toString() || '0',
  rating: product.rating?.toString() || '0',
})
