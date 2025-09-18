"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Download, Palette, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlowButton } from "./glow-button"
import { CounterAnimation } from "./counter-animation"

export function HeroSection() {
  const [currentText, setCurrentText] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const animatedTexts = ["Faith-Based Designs", "Christian Art", "Spiritual Inspiration", "Divine Creations"]

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % animatedTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleBrowseCollection = () => {
    console.log("Browse Collection button clicked!")
    // Test navigation - try about page first
    window.location.href = "/about"
    // If that works, change back to "/products"
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            <div className={`space-y-6 ${isVisible ? "text-reveal" : "opacity-0"}`}>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance">
                You are at the right place for a
                <span className="block text-primary">faith based digital print</span>
              </h1>

              {/* Typing Animation */}
              <div className="text-2xl md:text-3xl font-semibold text-primary min-h-[2.5rem] flex items-center">
                <span className="typing-animation">
                  {animatedTexts[currentText]}
                </span>
                <span className="animate-pulse ml-1">|</span>
              </div>

              <p className="text-lg md:text-xl text-muted-foreground max-w-lg text-pretty">
                Inspire Design is part of Inspire Change, a Christian business with a mission to make Jesus known in creative ways. 
                Discover unique digital and physical products inspired by the Spirit of God.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleBrowseCollection}
                className="text-lg px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 glow-button"
              >
                Browse Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                className="text-lg px-8 py-3 bg-card text-card-foreground border-border hover:bg-primary hover:text-primary-foreground"
              >
                <Download className="mr-2 h-5 w-5" />
                Free Samples
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center">
                <CounterAnimation
                  end={30}
                  duration={2000}
                  suffix="+"
                  className="text-2xl font-bold text-primary"
                  startOnView={true}
                  delay={0}
                  easing="easeOut"
                />
                <div className="text-sm text-muted-foreground">Faith-Based Designs</div>
              </div>
              <div className="text-center">
                <CounterAnimation
                  end={4}
                  duration={2000}
                  suffix=""
                  className="text-2xl font-bold text-primary"
                  startOnView={true}
                  delay={200}
                  easing="bounce"
                />
                <div className="text-sm text-muted-foreground">Product Categories</div>
              </div>
              <div className="text-center">
                <CounterAnimation
                  end={160}
                  duration={2000}
                  suffix="€"
                  className="text-2xl font-bold text-primary"
                  startOnView={true}
                  delay={400}
                  easing="easeInOut"
                />
                <div className="text-sm text-muted-foreground">Price Range</div>
              </div>
            </div>
          </div>

          {/* Right Side - Animated Cart and Visual Elements */}
          <div className="relative">
            {/* Animated Digital Art Background */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Geometric Shapes Animation */}
              <div className="absolute top-20 left-10 w-20 h-20 border-2 border-primary/30 rotate-45 animate-spin-slow" />
              <div className="absolute top-32 right-16 w-16 h-16 bg-primary/20 rounded-full animate-bounce-slow" />
              <div className="absolute bottom-32 left-8 w-24 h-24 border-4 border-primary/20 rounded-full animate-pulse" />
              <div className="absolute bottom-20 right-12 w-12 h-12 bg-gradient-to-br from-primary/40 to-primary/20 transform rotate-12 animate-ping-slow" />
              
              {/* Floating Design Elements */}
              <div className="absolute top-16 right-20 w-8 h-8 bg-primary/30 rounded-full animate-float" />
              <div className="absolute top-40 left-20 w-6 h-6 bg-primary/40 transform rotate-45 animate-float-delayed" />
              <div className="absolute bottom-40 right-8 w-10 h-10 border-2 border-primary/30 rounded-full animate-float" />
              <div className="absolute bottom-16 left-16 w-14 h-14 bg-gradient-to-tr from-primary/20 to-transparent rounded-lg animate-rotate-slow" />
              
              {/* Abstract Lines and Patterns */}
              <div className="absolute top-24 left-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-pulse" />
              <div className="absolute bottom-24 right-1/4 w-1 h-24 bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-pulse" />
              <div className="absolute top-1/2 left-8 w-20 h-20 border border-primary/20 rounded-full animate-spin-reverse" />
              
              {/* Creative Dots Pattern */}
              <div className="absolute top-12 left-12 w-2 h-2 bg-primary/50 rounded-full animate-ping" />
              <div className="absolute top-28 right-24 w-3 h-3 bg-primary/40 rounded-full animate-ping" style={{animationDelay: '0.5s'}} />
              <div className="absolute bottom-28 left-24 w-2 h-2 bg-primary/60 rounded-full animate-ping" style={{animationDelay: '1s'}} />
              <div className="absolute bottom-12 right-16 w-3 h-3 bg-primary/30 rounded-full animate-ping" style={{animationDelay: '1.5s'}} />
              
              {/* Artistic Triangles */}
              <div className="absolute top-36 left-24 w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-primary/30 animate-bounce" />
              <div className="absolute bottom-36 right-20 w-0 h-0 border-l-6 border-r-6 border-t-10 border-l-transparent border-r-transparent border-t-primary/40 animate-bounce" style={{animationDelay: '0.3s'}} />
            </div>

            <div className="relative z-10 flex items-center justify-center">
              {/* Main Cart Animation */}
              <div className="cart-bounce bg-card rounded-2xl p-8 shadow-2xl border border-border backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-card-foreground">Your Cart</h3>
                    <div className="led-indicator" />
                  </div>

                  {/* Sample Cart Items */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Palette className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Adonai Faith Art</div>
                        <div className="text-sm text-gray-600">€10.50</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">I Am Enough Print</div>
                        <div className="text-sm text-gray-600">€7.00</div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-card-foreground">Total:</span>
                      <span className="text-xl font-bold text-gray-900">€17.50</span>
                    </div>
                    <div className="space-y-3">
                      <GlowButton className="w-full">Checkout Now</GlowButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Floating Elements */}
            <div className="absolute top-10 right-10 w-16 h-16 bg-primary/20 rounded-full blur-sm animate-pulse" />
            <div className="absolute bottom-20 left-10 w-12 h-12 bg-primary/30 rounded-full blur-sm animate-bounce" />
            <div className="absolute top-1/2 -right-5 w-8 h-8 bg-primary/40 rounded-full blur-sm animate-ping" />
          </div>
        </div>
      </div>
    </section>
  )
}
