import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Helper function to get Supabase URL
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    // Return a placeholder URL during build if env var is not set
    // This prevents build failures
    return 'https://placeholder.supabase.co'
  }
  return url
}

// Helper function to get Supabase anon key
function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    // Return a placeholder key during build if env var is not set
    return 'placeholder-anon-key'
  }
  return key
}

// Helper function to get Supabase service role key
function getSupabaseServiceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    // Return a placeholder key during build if env var is not set
    return 'placeholder-service-key'
  }
  return key
}

// Client-side Supabase client (uses anon key)
// Only create client if URL and key are available and not placeholders
let supabaseInstance: SupabaseClient | null = null
try {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-anon-key') {
    supabaseInstance = createClient(url, key)
  }
} catch (error) {
  // Silently fail during build if env vars aren't set
  console.warn('Supabase client initialization skipped:', error)
}
export const supabase = supabaseInstance

// Server-side Supabase client (uses service role key for admin operations)
// Only create client if URL and key are available and not placeholders
// Note: Check both SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY for compatibility
let supabaseAdminInstance: SupabaseClient | null = null
try {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  // Check both variable names (prefer SUPABASE_SERVICE_ROLE_KEY without NEXT_PUBLIC_)
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  if (url && key && url !== 'https://placeholder.supabase.co' && key !== 'placeholder-service-key') {
    supabaseAdminInstance = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
} catch (error) {
  // Silently fail during build if env vars aren't set
  console.warn('Supabase admin client initialization skipped:', error)
}
export const supabaseAdmin = supabaseAdminInstance

// Database types (you can generate these with Supabase CLI later)
export interface Product {
  id: number
  title: string
  price: number
  category: string
  description: string | null
  artist: string | null
  rating: number
  downloads: number
  tags: string[]
  image_url: string | null
  image_thumbnail_url: string | null
  image_large_url: string | null
  folder_path: string | null
  download_type: string
  download_url: string | null
  all_files: any[]
  pdfs: any[]
  images: any[]
  size_pricing?: {
    "5x5": number
    "6x6": number
    "12x12": number
  } | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  stripe_session_id: string | null
  customer_email: string
  total_amount: number
  currency: string
  status: string
  products: any[]
  created_at: string
  updated_at: string
}

export interface Contact {
  id: number
  name: string
  email: string
  message: string
  created_at: string
}

