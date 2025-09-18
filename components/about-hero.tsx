"use client"

import { useState, useEffect } from "react"
import { Palette, Users, Download, Award } from "lucide-react"

export function AboutHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className={`space-y-6 ${isVisible ? "text-reveal" : "opacity-0"}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance">
              About
              <span className="block text-primary">Inspire Design</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              Inspire Design is part of Inspire Change, a Christian business with a mission to make Jesus known in creative ways. 
              We design unique digital and physical products inspired by the Spirit of God, with each design carrying a message 
              that speaks to the heart and encourages faith.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Palette className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Divine Inspiration</h3>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Faith Community</h3>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Instant Access</h3>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Spiritual Impact</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
