"use client"

import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ContactInfo() {
  const handleWhatsApp = () => {
    // Direct WhatsApp link with business number
    const whatsappUrl = "https://wa.me/qr/C6TRYNUZNSCQI1"
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-6">
          <h3 className="text-xl font-semibold text-card-foreground">Contact Information</h3>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">Email</p>
                <p className="text-muted-foreground">idstudio.creation@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">WhatsApp</p>
                <p className="text-muted-foreground">Click below to chat with us</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">Address</p>
                <p className="text-muted-foreground">Online Business</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-card-foreground">Business Hours</p>
                <p className="text-muted-foreground">Mon - Fri: 9:00 AM - 6:00 PM EST</p>
              </div>
            </div>
          </div>

          <Button onClick={handleWhatsApp} className="w-full bg-green-500 hover:bg-green-600 text-white">
            <MessageCircle className="mr-2 h-5 w-5" />
            Message us on WhatsApp
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-card-foreground mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-card-foreground">How do I become a featured artist?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Send us your portfolio and we'll review your work for potential partnership opportunities.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-card-foreground">What file formats do you support?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                We support PNG, JPG, SVG, AI, PSD, and other common design file formats.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-card-foreground">Do you offer custom design services?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Yes! Contact us to discuss custom design projects with our featured artists.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
