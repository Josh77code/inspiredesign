import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client (uses anon key)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Server-side Supabase client (uses service role key for admin operations)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

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

