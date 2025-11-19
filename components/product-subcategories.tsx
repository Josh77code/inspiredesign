"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Image, Download, Lock, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface FileItem {
  name: string
  path?: string
  url?: string
  size?: string
  price: number
}

interface Subcategory {
  name: string
  images: FileItem[]
  pdfs: FileItem[]
  files: FileItem[]
  totalFiles: number
  totalPrice: number
}

interface ProductSubcategoriesProps {
  subcategories: Subcategory[]
  productId: number
  productTitle: string
}

export function ProductSubcategories({ subcategories, productId, productTitle }: ProductSubcategoriesProps) {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const { addItem } = useCartStore()

  if (!subcategories || subcategories.length === 0) {
    return null
  }

  const handleDownload = (file: FileItem, subcategory: string) => {
    // Check if payment is required
    setSelectedFile(file)
    setShowPaymentDialog(true)
  }

  const handleAddToCart = (file: FileItem, subcategory: string) => {
    addItem({
      id: `${productId}-${subcategory}-${file.name}`,
      title: `${productTitle} - ${subcategory} - ${file.name}`,
      price: file.price,
      image: file.url || file.path || '/placeholder.svg',
      quantity: 1,
      category: subcategory
    })
  }

  const handlePurchase = () => {
    if (selectedFile) {
      handleAddToCart(selectedFile, '')
      setShowPaymentDialog(false)
      // Redirect to checkout or cart
      window.location.href = '/checkout'
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Available Files by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {subcategories.map((subcategory, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{subcategory.name}</h3>
                <Badge variant="secondary">
                  {subcategory.totalFiles} files • €{subcategory.totalPrice.toFixed(2)}
                </Badge>
              </div>

              {/* Images */}
              {subcategory.images.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Image className="h-4 w-4" />
                    Images ({subcategory.images.length})
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {subcategory.images.map((image, imgIndex) => (
                      <div key={imgIndex} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{image.name}</p>
                          {image.size && (
                            <p className="text-xs text-muted-foreground">{image.size}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <Badge variant="outline">€{image.price.toFixed(2)}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddToCart(image, subcategory.name)}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownload(image, subcategory.name)}
                          >
                            <Lock className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PDFs */}
              {subcategory.pdfs.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    PDFs ({subcategory.pdfs.length})
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {subcategory.pdfs.map((pdf, pdfIndex) => (
                      <div key={pdfIndex} className="flex items-center justify-between p-2 border rounded hover:bg-muted/50">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{pdf.name}</p>
                          {pdf.size && (
                            <p className="text-xs text-muted-foreground">{pdf.size}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <Badge variant="outline">€{pdf.price.toFixed(2)}</Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddToCart(pdf, subcategory.name)}
                          >
                            <ShoppingCart className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownload(pdf, subcategory.name)}
                          >
                            <Lock className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Required Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Required</DialogTitle>
            <DialogDescription>
              You need to purchase this file to download it.
            </DialogDescription>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded">
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  {selectedFile.size && (
                    <p className="text-sm text-muted-foreground">{selectedFile.size}</p>
                  )}
                </div>
                <Badge variant="outline" className="text-lg">
                  €{selectedFile.price.toFixed(2)}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePurchase}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart & Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

