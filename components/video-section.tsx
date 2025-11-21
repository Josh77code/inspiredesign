"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Sparkles, Palette, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Placeholder digital art images - using placeholder services
const digitalArtShowcase = [
  {
    id: 1,
    title: "Faith-Inspired Designs",
    description: "Beautiful digital art that speaks to the heart",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
    color: "from-blue-500/20 to-purple-500/20"
  },
  {
    id: 2,
    title: "Premium Quality Prints",
    description: "High-resolution designs perfect for any project",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=600&fit=crop",
    color: "from-pink-500/20 to-orange-500/20"
  },
  {
    id: 3,
    title: "Customizable Artwork",
    description: "Personalize your designs to match your style",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
    color: "from-green-500/20 to-teal-500/20"
  },
  {
    id: 4,
    title: "Inspirational Messages",
    description: "Words of faith and encouragement in beautiful designs",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop",
    color: "from-purple-500/20 to-pink-500/20"
  }
]

export function VideoSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % digitalArtShowcase.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-32 md:py-40 bg-gradient-to-b from-background via-card/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 md:mb-8">
            Welcome to Our Marketplace
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto text-pretty leading-relaxed">
            Discover amazing digital art and shop with us for premium creative assets that bring your projects to life.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Main Showcase Gallery */}
          <div className="relative bg-card border border-border rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl mb-8 md:mb-12">
            <div className="aspect-[16/9] relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
              {/* Slideshow of Digital Art */}
              {digitalArtShowcase.map((art, index) => (
                <div
                  key={art.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${art.color} opacity-80`} />
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      // Fallback to a solid color gradient if image fails
                      target.style.display = 'none'
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                    <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-2xl">
                      <div className="flex justify-center mb-4">
                        <Sparkles className="h-12 w-12 md:h-16 md:w-16 text-primary animate-pulse" />
                      </div>
                      <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                        {art.title}
                      </h3>
                      <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-6 md:mb-8">
                        {art.description}
                      </p>
                      <Link href="/products">
                        <Button
                          size="lg"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg md:text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          Explore Collection
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Slide Indicators */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {digitalArtShowcase.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 md:h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-8 md:w-12 bg-primary'
                        : 'w-2 md:w-3 bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
            {digitalArtShowcase.map((art, index) => (
              <div
                key={art.id}
                className={`relative aspect-square rounded-xl overflow-hidden border border-border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  index === currentSlide ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setCurrentSlide(index)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${art.color} opacity-60`} />
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                  <Palette className="h-8 w-8 text-white" />
                </div>
              </div>
            ))}
          </div>

          {/* Info Section */}
          <div className="bg-card border border-border rounded-2xl md:rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8 md:mb-12">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-card-foreground mb-4 md:mb-6">
                You Are Welcome to Our Page - Shop With Us!
              </h3>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground text-pretty mb-6 md:mb-8 leading-relaxed max-w-4xl mx-auto">
                Welcome to our digital marketplace! We're thrilled to have you here. Browse our collection of premium digital art, 
                illustrations, and creative assets. Start shopping now and discover the perfect pieces for your next project.
              </p>
            </div>
            
            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
              <div className="text-center p-6 bg-background/50 rounded-xl border border-border">
                <Sparkles className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-bold text-foreground mb-2">Premium Quality</h4>
                <p className="text-muted-foreground">High-resolution designs for all your needs</p>
              </div>
              <div className="text-center p-6 bg-background/50 rounded-xl border border-border">
                <Palette className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-bold text-foreground mb-2">Faith-Based</h4>
                <p className="text-muted-foreground">Inspiring designs with meaningful messages</p>
              </div>
              <div className="text-center p-6 bg-background/50 rounded-xl border border-border">
                <Heart className="h-10 w-10 md:h-12 md:w-12 text-primary mx-auto mb-4" />
                <h4 className="text-xl font-bold text-foreground mb-2">Affordable</h4>
                <p className="text-muted-foreground">Great prices for everyone</p>
              </div>
            </div>
            
            {/* Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <Link href="/products">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg md:text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
                >
                  Start Shopping Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg md:text-xl font-semibold rounded-lg transition-all duration-300 w-full sm:w-auto"
                >
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
