import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SimplePDFViewer } from '@/components/simple-pdf-viewer'
import { MockupGallery } from '@/components/mockup-gallery'
import { ProductFilesIncluded } from '@/components/product-files-included'
import { ProductImageCarousel } from '@/components/product-image-carousel'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Download, ShoppingCart, Star, Heart, Share2, ArrowLeft, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { productsDB } from '@/lib/database'
import { ProductActions } from '@/components/product-actions'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const productId = parseInt(params.id)
    
    if (isNaN(productId)) {
      notFound()
    }

    const product = await productsDB.getById(productId)
    
    if (!product) {
      notFound()
    }

    // Ensure product has required fields with defaults
    const safeProduct = {
      ...product,
      image: product.image_url || product.image || '/placeholder.svg',
      images: product.images || [],
      allFiles: product.all_files || [],
      pdfs: product.pdfs || [],
      mockups: product.mockups || [],
      videos: product.videos || [],
      sizes: product.sizes || [],
      price: product.price || 0,
      rating: product.rating || 0,
      downloads: product.downloads || 0,
    }

    // Calculate price range if multiple pricing options exist
    const getPriceRange = () => {
      if (safeProduct.pricing) {
        const prices = Object.values(safeProduct.pricing)
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)
        return minPrice === maxPrice ? `€${minPrice.toFixed(2)}` : `€${minPrice.toFixed(2)} - €${maxPrice.toFixed(2)}`
      }
      return `€${(safeProduct.price || 0).toFixed(2)}`
    }

    return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">Products</Link>
          <span>/</span>
          <span className="text-foreground">{safeProduct.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image Carousel */}
          <div className="space-y-4">
            {safeProduct.images && safeProduct.images.length > 0 ? (
              <ProductImageCarousel
                images={safeProduct.images}
                productTitle={safeProduct.title}
                fallbackImage={safeProduct.image}
              />
            ) : (
              <div className="relative aspect-square rounded-lg overflow-hidden border bg-white">
                <img
                  src={(() => {
                    const imgPath = safeProduct.image || '/placeholder.svg'
                    // Use API route for paths with spaces
                    if (imgPath.includes('New Digital Product') || imgPath.includes(' ')) {
                      const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath
                      const encodedSegments = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/')
                      return `/api/images/${encodedSegments}`
                    }
                    return imgPath
                  })()}
                  alt={safeProduct.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    if (target && target.src !== '/placeholder.svg') {
                      target.src = '/placeholder.svg'
                    }
                  }}
                />
              </div>
            )}
            
            {/* Product Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{safeProduct.title}</CardTitle>
                    <p className="text-muted-foreground">by {safeProduct.artist || 'Unknown Artist'}</p>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {(safeProduct.category || '').replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{safeProduct.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>{safeProduct.downloads} downloads</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{getPriceRange()}</div>
                    <div className="text-sm text-muted-foreground">
                      {safeProduct.sizes && safeProduct.sizes.length > 0 
                        ? `Available in ${safeProduct.sizes.length} sizes`
                        : 'Multiple formats available'
                      }
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <ProductActions 
                  product={safeProduct}
                  priceRange={getPriceRange()}
                />
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {safeProduct.description || `Discover this beautiful ${(safeProduct.category || '').replace('-', ' ')} design by ${safeProduct.artist || 'our artist'}. Perfect for your home, office, or as a gift. This high-quality digital print is ready for instant download and printing.`}
                </p>
              </CardContent>
            </Card>

            {/* Files Included */}
            {safeProduct.allFiles && safeProduct.allFiles.length > 0 && (
              <ProductFilesIncluded 
                allFiles={safeProduct.allFiles}
                pdfs={safeProduct.pdfs}
                images={safeProduct.images}
                videos={safeProduct.videos}
                mockups={safeProduct.mockups}
                totalFiles={safeProduct.totalFiles}
                totalSize={safeProduct.totalSize}
              />
            )}

            {/* Available Sizes */}
            {safeProduct.sizes && safeProduct.sizes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Sizes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {safeProduct.sizes.map((size, index) => (
                      <Badge key={index} variant="outline" className="justify-center py-2">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PDF Downloads */}
            {safeProduct.pdfs && safeProduct.pdfs.length > 0 && (
              <SimplePDFViewer pdfs={safeProduct.pdfs} productName={safeProduct.title} />
            )}

            {/* Mockup Gallery */}
            {safeProduct.mockups && safeProduct.mockups.length > 0 && (
              <MockupGallery mockups={safeProduct.mockups} productName={safeProduct.title} />
            )}
          </div>
        </div>

        {/* Back to Products */}
        <div className="mt-8">
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Products
            </Button>
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
    )
  } catch (error) {
    console.error('Error loading product:', error)
    notFound()
  }
}
