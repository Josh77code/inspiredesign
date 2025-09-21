"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Eye, FileText, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface PDFFile {
  name: string
  path: string
  size?: string
}

interface SimplePDFViewerProps {
  pdfs: PDFFile[]
  productName: string
}

export function SimplePDFViewer({ pdfs, productName }: SimplePDFViewerProps) {
  const [selectedPDF, setSelectedPDF] = useState<PDFFile | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  if (!pdfs || pdfs.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Available PDF Downloads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No PDFs available for this product.</p>
        </CardContent>
      </Card>
    )
  }

  const openPDFViewer = (pdf: PDFFile) => {
    setSelectedPDF(pdf)
    setIsViewerOpen(true)
  }

  const closePDFViewer = () => {
    setIsViewerOpen(false)
    setSelectedPDF(null)
  }

  const downloadPDF = (pdf: PDFFile) => {
    const link = document.createElement('a')
    link.href = `/${pdf.path}`
    link.download = pdf.name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Available PDF Downloads ({pdfs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pdfs.map((pdf, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1 line-clamp-2">
                      {pdf.name.replace('.pdf', '')}
                    </h4>
                    {pdf.size && (
                      <Badge variant="secondary" className="text-xs">
                        {pdf.size}
                      </Badge>
                    )}
                  </div>
                  <FileText className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openPDFViewer(pdf)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => downloadPDF(pdf)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PDF Viewer Modal */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedPDF?.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={closePDFViewer}
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            {selectedPDF && (
              <div className="w-full h-[70vh] border rounded-lg overflow-hidden">
                <iframe
                  src={`/${selectedPDF.path}#toolbar=1&navpanes=1&scrollbar=1`}
                  className="w-full h-full"
                  title={`PDF Preview: ${selectedPDF.name}`}
                  style={{ border: 'none' }}
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex gap-2">
              {selectedPDF?.size && (
                <Badge variant="outline">{selectedPDF.size}</Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => selectedPDF && downloadPDF(selectedPDF)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={closePDFViewer}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

