import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SimplePDFViewer } from '@/components/simple-pdf-viewer'
import { MockupGallery } from '@/components/mockup-gallery'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Download, ShoppingCart, Star, Heart, Share2, ArrowLeft, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { productsDB } from '@/lib/database'

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = parseInt(params.id)
  
  if (isNaN(productId)) {
    notFound()
  }

  const product = productsDB.getById(productId)
  
  if (!product) {
    notFound()
  }

  // Calculate price range if multiple pricing options exist
  const getPriceRange = () => {
    if (product.pricing) {
      const prices = Object.values(product.pricing)
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      return minPrice === maxPrice ? `€${minPrice.toFixed(2)}` : `€${minPrice.toFixed(2)} - €${maxPrice.toFixed(2)}`
    }
    return `€${product.price.toFixed(2)}`
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
          <span className="text-foreground">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden border bg-white">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            
            {/* Product Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{product.title}</CardTitle>
                    <p className="text-muted-foreground">by {product.artist}</p>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {product.category.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Download className="h-4 w-4" />
                    <span>{product.downloads} downloads</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{getPriceRange()}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.sizes && product.sizes.length > 0 
                        ? `Available in ${product.sizes.length} sizes`
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
                
                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full bg-green-500 hover:bg-green-600 text-white" 
                    size="lg"
                    onClick={() => {
                      const message = `Hello Inspire Design! 👋

I'm interested in ordering:
📦 *${product.title}*
💰 Price: ${getPriceRange()}
🎨 By: ${product.artist}
⭐ Rating: ${product.rating}/5

Available sizes: ${product.sizes ? product.sizes.join(', ') : 'Multiple options'}

Please provide more details about:
• Available formats and sizes
• Delivery/download options
• Any current discounts

Thank you!`
                      window.open(`https://wa.me/353899464758?text=${encodeURIComponent(message)}`, '_blank')
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Order via WhatsApp
                  </Button>
                  <div className="flex gap-3">
                    <Button className="flex-1" size="lg">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="lg">
                      <Download className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </div>
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
                  {product.description || `Discover this beautiful ${product.category.replace('-', ' ')} design by ${product.artist}. Perfect for your home, office, or as a gift. This high-quality digital print is ready for instant download and printing.`}
                </p>
              </CardContent>
            </Card>

            {/* Available Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Sizes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {product.sizes.map((size, index) => (
                      <Badge key={index} variant="outline" className="justify-center py-2">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PDF Downloads */}
            {product.pdfs && product.pdfs.length > 0 && (
              <SimplePDFViewer pdfs={product.pdfs} productName={product.title} />
            )}

            {/* Mockup Gallery */}
            {product.mockups && product.mockups.length > 0 && (
              <MockupGallery mockups={product.mockups} productName={product.title} />
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
}
