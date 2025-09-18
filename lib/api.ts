// API utility functions for the digital marketplace

const API_BASE = '/api'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Generic API call function
async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error)
    return {
      success: false,
      error: 'Network error occurred'
    }
  }
}

// Products API
export const productsApi = {
  // Get all products with optional filtering
  getAll: (params?: {
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }
    const queryString = searchParams.toString()
    return apiCall(`/products${queryString ? `?${queryString}` : ''}`)
  },

  // Get a specific product
  getById: (id: number) => apiCall(`/products/${id}`),

  // Create a new product
  create: (productData: any) => 
    apiCall('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    }),

  // Update a product
  update: (id: number, productData: any) =>
    apiCall(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    }),

  // Delete a product
  delete: (id: number) =>
    apiCall(`/products/${id}`, {
      method: 'DELETE'
    })
}

// Orders API
export const ordersApi = {
  // Create a new order
  create: (orderData: {
    items: Array<{
      id: number
      title: string
      price: number
      quantity: number
      artist: string
      image: string
    }>
    customerInfo: {
      email: string
      name?: string
      phone?: string
    }
    totalAmount: number
  }) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  }),

  // Get orders with optional filtering
  getAll: (params?: {
    email?: string
    status?: string
    page?: number
    limit?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }
    const queryString = searchParams.toString()
    return apiCall(`/orders${queryString ? `?${queryString}` : ''}`)
  },

  // Get a specific order
  getById: (id: string) => apiCall(`/orders/${id}`),

  // Update order status
  update: (id: string, updateData: any) =>
    apiCall(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    }),

  // Cancel an order
  cancel: (id: string) =>
    apiCall(`/orders/${id}`, {
      method: 'DELETE'
    })
}

// Contact API
export const contactApi = {
  // Submit contact form
  submit: (contactData: {
    name: string
    email: string
    subject: string
    message: string
  }) => apiCall('/contact', {
    method: 'POST',
    body: JSON.stringify(contactData)
  }),

  // Get contact information
  getInfo: () => apiCall('/contact')
}

// Cart to Order conversion helper
export const convertCartToOrder = (cartItems: any[], customerInfo: any) => {
  const items = cartItems.map(item => ({
    id: item.id,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    artist: item.artist,
    image: item.image
  }))

  const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)

  return {
    items,
    customerInfo,
    totalAmount
  }
}

