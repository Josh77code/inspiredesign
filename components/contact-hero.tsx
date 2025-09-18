"use client"

import { useState, useEffect } from "react"

export function ContactHero() {
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
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className={`space-y-6 ${isVisible ? "text-reveal" : "opacity-0"}`}>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-balance">
              Get In
              <span className="block text-primary">Touch</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Have questions about our digital art marketplace? Want to become a featured artist? We'd love to hear from
              you and help bring your creative vision to life.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
