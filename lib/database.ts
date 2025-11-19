import { supabaseAdmin, Product, Order, Contact } from './supabase'

// Helper function to ensure Supabase client is available
function ensureSupabaseClient() {
  if (!supabaseAdmin) {
    throw new Error('Supabase client not initialized. Please check environment variables.')
  }
  return supabaseAdmin
}

// Products database operations using Supabase
export const productsDB = {
  /**
   * Get all products with optional filtering
   */
  getAll: async (): Promise<Product[]> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized. Returning empty array.')
        return []
      }
      
      const client = ensureSupabaseClient()
      const { data, error } = await client
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in productsDB.getAll:', error)
      return []
    }
  },

  /**
   * Get product by ID
   */
  getById: async (id: number): Promise<Product | null> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized.')
        return null
      }
      
      const client = ensureSupabaseClient()
      const { data, error } = await client
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in productsDB.getById:', error)
      return null
    }
  },

  /**
   * Create a new product
   */
  create: async (product: Partial<Product>): Promise<Product | null> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized.')
        return null
      }
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert({
          title: product.title,
          price: product.price,
          category: product.category,
          description: product.description || null,
          artist: product.artist || null,
          rating: product.rating || 0,
          downloads: product.downloads || 0,
          tags: product.tags || [],
          image_url: product.image_url || null,
          image_thumbnail_url: product.image_thumbnail_url || null,
          image_large_url: product.image_large_url || null,
          folder_path: product.folder_path || null,
          download_type: product.download_type || 'file',
          download_url: product.download_url || null,
          all_files: product.all_files || [],
          pdfs: product.pdfs || [],
          images: product.images || [],
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating product:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in productsDB.create:', error)
      return null
    }
  },

  /**
   * Update a product
   */
  update: async (id: number, updates: Partial<Product>): Promise<Product | null> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized.')
        return null
      }
      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating product:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in productsDB.update:', error)
      return null
    }
  },

  /**
   * Delete a product
   */
  delete: async (id: number): Promise<boolean> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized.')
        return false
      }
      const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting product:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in productsDB.delete:', error)
      return false
    }
  },

  /**
   * Search products by query
   */
  search: async (query: string): Promise<Product[]> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized. Returning empty array.')
        return []
      }
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,artist.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching products:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in productsDB.search:', error)
      return []
    }
  },

  /**
   * Get products by category
   */
  getByCategory: async (category: string): Promise<Product[]> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized. Returning empty array.')
        return []
      }
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products by category:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in productsDB.getByCategory:', error)
      return []
    }
  },
}

// Orders database operations using Supabase
export const ordersDB = {
  getAll: async (): Promise<Order[]> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized. Returning empty array.')
        return []
      }
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching orders:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in ordersDB.getAll:', error)
      return []
    }
  },

  getById: async (id: string): Promise<Order | null> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized.')
        return null
      }
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching order:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in ordersDB.getById:', error)
      return null
    }
  },

  getByStripeSessionId: async (sessionId: string): Promise<Order | null> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized.')
        return null
      }
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('stripe_session_id', sessionId)
        .single()

      if (error) {
        console.error('Error fetching order by session ID:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in ordersDB.getByStripeSessionId:', error)
      return null
    }
  },

  create: async (order: Partial<Order>): Promise<Order | null> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized.')
        return null
      }
      const { data, error } = await supabaseAdmin
        .from('orders')
        .insert({
          id: order.id!,
          stripe_session_id: order.stripe_session_id || null,
          customer_email: order.customer_email!,
          total_amount: order.total_amount!,
          currency: order.currency || 'EUR',
          status: order.status || 'pending',
          products: order.products || [],
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating order:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in ordersDB.create:', error)
      return null
    }
  },

  update: async (id: string, updates: Partial<Order>): Promise<Order | null> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized.')
        return null
      }
      const { data, error } = await supabaseAdmin
        .from('orders')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating order:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in ordersDB.update:', error)
      return null
    }
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized.')
        return false
      }
      const { error } = await supabaseAdmin
        .from('orders')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting order:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in ordersDB.delete:', error)
      return false
    }
  },
}

// Contacts database operations using Supabase
export const contactsDB = {
  getAll: async (): Promise<Contact[]> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized. Returning empty array.')
        return []
      }
      const { data, error } = await supabaseAdmin
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching contacts:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error in contactsDB.getAll:', error)
      return []
    }
  },

  create: async (contact: Partial<Contact>): Promise<Contact | null> => {
    try {
      if (!supabaseAdmin) {
        console.warn('Supabase client not initialized.')
        return null
      }
      const { data, error } = await supabaseAdmin
        .from('contacts')
        .insert({
          name: contact.name!,
          email: contact.email!,
          message: contact.message!,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating contact:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error in contactsDB.create:', error)
      return null
    }
  },
}

// Initialize database (no-op for Supabase, but kept for compatibility)
export function initializeDatabase() {
  console.log('Supabase database initialized')
}

