import { NextRequest, NextResponse } from 'next/server'
import { productsDB } from '@/lib/database'
import { getBlobImageUrl } from '@/lib/vercel-blob'

// GET /api/products/[id] - Fetch a specific product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const product = await productsDB.getById(productId)
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // Helper to get image URL
    const getImageUrl = (blobPath: string | null, fallbackPath?: string | null): string => {
      if (blobPath) {
        if (blobPath.startsWith('http://') || blobPath.startsWith('https://')) {
          return blobPath
        }
        return getBlobImageUrl(blobPath)
      }
      if (fallbackPath) {
        return fallbackPath.startsWith('/') ? fallbackPath : `/${fallbackPath}`
      }
      return '/placeholder.svg'
    }

    // Transform product to include blob URLs for images and PDFs
    const transformedProduct = {
      ...product,
      image: getImageUrl(product.image_url, product.folder_path ? `${product.folder_path}/main.jpg` : null),
      imageThumbnail: product.image_thumbnail_url ? getBlobImageUrl(product.image_thumbnail_url) : null,
      imageLarge: product.image_large_url ? getBlobImageUrl(product.image_large_url) : null,
      // Files from blob storage - already have URLs
      allFiles: product.all_files || [],
      pdfs: (product.pdfs || []).map((pdf: any) => ({
        name: pdf.name,
        path: pdf.path,
        url: pdf.url || (pdf.path && pdf.path.includes('blob.vercel-storage.com') ? pdf.path : null),
        size: pdf.size
      })),
      images: (product.images || []).map((img: any) => ({
        name: img.name,
        path: img.path,
        url: img.url || (img.path && img.path.includes('blob.vercel-storage.com') ? img.path : null),
        size: img.size
      })),
    }

    return NextResponse.json({
      success: true,
      data: transformedProduct
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update a specific product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Validate input data
    const { title, price, category, description, artist, tags } = body
    
    if (!title || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Update in database
    const updatedProduct = productsDB.update(productId, {
      title,
      price: parseFloat(price),
      category,
      description,
      artist,
      tags: tags || [],
      updatedAt: new Date().toISOString()
    })
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete a specific product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = parseInt(params.id)
    
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      )
    }

    const deleted = productsDB.delete(productId)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
