import { NextRequest, NextResponse } from 'next/server'
import { productsDB } from '@/lib/database'
import { getBlobImageUrl } from '@/lib/vercel-blob'

// GET /api/products - Fetch all products with optional filtering (Supabase version)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Get all products from Supabase
    let allProducts = await productsDB.getAll()

    // Filter by category
    if (category) {
      allProducts = await productsDB.getByCategory(category)
    }

    // Search products
    if (search) {
      const searchResults = await productsDB.search(search)
      allProducts = category 
        ? allProducts.filter(p => searchResults.some(s => s.id === p.id))
        : searchResults
    }

    // Filter by price range
    let filteredProducts = [...allProducts]
    if (minPrice) {
      filteredProducts = filteredProducts.filter(product => product.price >= parseFloat(minPrice))
    }
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(product => product.price <= parseFloat(maxPrice))
    }

    // Sort products
    filteredProducts.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a]
      let bValue: any = b[sortBy as keyof typeof b]

      if (sortBy === 'created_at' || sortBy === 'updated_at') {
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

    // Transform products to match expected format and use Vercel Blob URLs
    const publicProducts = paginatedProducts.map(product => {
      // Helper to get image URL - try blob first, then fallback to local path
      const getImageUrl = (blobPath: string | null, fallbackPath?: string | null): string => {
        if (blobPath) {
          // If it's already a full URL, return as-is
          if (blobPath.startsWith('http://') || blobPath.startsWith('https://')) {
            return blobPath
          }
          // Try blob URL
          const blobUrl = getBlobImageUrl(blobPath)
          return blobUrl
        }
        // Fallback to local path if available
        if (fallbackPath) {
          return fallbackPath.startsWith('/') ? fallbackPath : `/${fallbackPath}`
        }
        return '/placeholder.svg'
      }

      // Convert Supabase product to expected format
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        category: product.category,
        description: product.description,
        artist: product.artist,
        rating: product.rating,
        downloads: product.downloads,
        tags: product.tags,
        // Use Vercel Blob URLs for images, with fallback
        image: getImageUrl(product.image_url, product.folder_path ? `${product.folder_path}/main.jpg` : null),
        imageThumbnail: product.image_thumbnail_url ? getBlobImageUrl(product.image_thumbnail_url) : null,
        imageLarge: product.image_large_url ? getBlobImageUrl(product.image_large_url) : null,
        folderPath: product.folder_path,
        downloadType: product.download_type,
        downloadUrl: product.download_url,
        allFiles: product.all_files,
        pdfs: product.pdfs,
        images: product.images,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        downloadAvailable: true,
        requiresPayment: true
      }
    })

    // Get all categories for filters
    const allCategories = [...new Set(allProducts.map(p => p.category))]

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
          categories: allCategories,
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

// POST /api/products - Create a new product (admin only) - Supabase version
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

    // Create new product using Supabase
    const newProduct = await productsDB.create({
      title,
      price: parseFloat(price),
      category,
      description,
      artist,
      tags: tags || [],
      image_url: body.image_url || null,
      image_thumbnail_url: body.image_thumbnail_url || null,
      image_large_url: body.image_large_url || null,
      download_url: body.download_url || null,
      rating: 0,
      downloads: 0,
    })

    if (!newProduct) {
      return NextResponse.json(
        { success: false, error: 'Failed to create product' },
        { status: 500 }
      )
    }

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

