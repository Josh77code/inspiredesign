import { NextRequest, NextResponse } from 'next/server'

// This would typically come from a database
const sampleProducts = [
  {
    id: 1,
    title: "Abstract Geometric Patterns",
    price: 29.99,
    category: "patterns",
    image: "/colorful-geometric-abstract.png",
    downloadUrl: "#",
    artist: "Sarah Johnson",
    rating: 4.8,
    downloads: 1250,
    description: "Modern geometric patterns perfect for backgrounds and design projects.",
    tags: ["geometric", "abstract", "patterns", "modern"],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  // ... other products would be here
]

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

    const product = sampleProducts.find(p => p.id === productId)
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: product
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
    const productIndex = sampleProducts.findIndex(p => p.id === productId)
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // In a real app, you would:
    // 1. Validate input data
    // 2. Update in database

    const updatedProduct = {
      ...sampleProducts[productIndex],
      ...body,
      id: productId, // Ensure ID doesn't change
      updatedAt: new Date()
    }

    sampleProducts[productIndex] = updatedProduct

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

    const productIndex = sampleProducts.findIndex(p => p.id === productId)
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    // In a real app, you would:
    // 1. Handle file cleanup
    // 2. Soft delete or hard delete from database

    sampleProducts.splice(productIndex, 1)

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
