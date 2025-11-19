import { NextRequest, NextResponse } from 'next/server'
import { productsDB, initializeDatabase } from '@/lib/database'

// Initialize database on first load
initializeDatabase()

// GET /api/products - Fetch all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    // Get products from database
    const allProducts = productsDB.getAll()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    let filteredProducts = [...allProducts]

    // Filter by category
    if (category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category.toLowerCase() === category.toLowerCase()
      )
    }

    // Enhanced search by title, description, artist, or tags
    if (search) {
      const searchLower = search.toLowerCase()
      const searchTerms = searchLower.split(' ').filter(term => term.length > 0)
      
      filteredProducts = filteredProducts.filter(product => {
        const searchableText = [
          product.title,
          product.description,
          product.artist,
          ...product.tags
        ].join(' ').toLowerCase()
        
        // Match all search terms
        return searchTerms.every(term => searchableText.includes(term))
      })
    }

    // Filter by price range
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(minPrice))
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(maxPrice))
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a]
      let bValue = b[sortBy as keyof typeof b]

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue as string).getTime()
        bValue = new Date(bValue as string).getTime()
      }

      if (sortOrder === 'desc') {
        return (bValue as number) - (aValue as number)
      } else {
        return (aValue as number) - (bValue as number)
      }
    })

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    // Remove download URLs from public product listings
    const publicProducts = paginatedProducts.map(product => {
      const { downloadUrl, ...publicProduct } = product
      return {
        ...publicProduct,
        downloadAvailable: true,
        requiresPayment: true
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        products: publicProducts,
        pagination: {
          page,
          limit,
          total: filteredProducts.length,
          totalPages: Math.ceil(filteredProducts.length / limit)
        },
        filters: {
          categories: [...new Set(allProducts.map(p => p.category))],
          priceRange: {
            min: allProducts.length > 0 ? Math.min(...allProducts.map(p => p.price)) : 0,
            max: allProducts.length > 0 ? Math.max(...allProducts.map(p => p.price)) : 0
          }
        }
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { title, price, category, description, artist, tags } = body
    
    if (!title || !price || !category || !description || !artist) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create new product using database
    const newProduct = productsDB.create({
      title,
      price: parseFloat(price),
      category,
      image: body.image || "/placeholder.jpg",
      downloadUrl: body.downloadUrl || "#",
      artist,
      rating: 0,
      downloads: 0,
      description,
      tags: tags || []
    })

    return NextResponse.json({
      success: true,
      data: newProduct
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}