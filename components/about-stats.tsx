"use client"

import { useState, useEffect } from "react"

export function AboutStats() {
  const [counters, setCounters] = useState({
    artists: 0,
    designs: 0,
    downloads: 0,
    customers: 0,
  })

  const finalValues = {
    artists: 500,
    designs: 10000,
    downloads: 50000,
    customers: 25000,
  }

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setCounters({
        artists: Math.floor(finalValues.artists * progress),
        designs: Math.floor(finalValues.designs * progress),
        downloads: Math.floor(finalValues.downloads * progress),
        customers: Math.floor(finalValues.customers * progress),
      })

      if (step >= steps) {
        clearInterval(timer)
        setCounters(finalValues)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-16 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{counters.artists.toLocaleString()}+</div>
            <div className="text-muted-foreground">Talented Artists</div>
          </div>

          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{counters.designs.toLocaleString()}+</div>
            <div className="text-muted-foreground">Digital Designs</div>
          </div>

          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
              {counters.downloads.toLocaleString()}+
            </div>
            <div className="text-muted-foreground">Happy Downloads</div>
          </div>

          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
              {counters.customers.toLocaleString()}+
            </div>
            <div className="text-muted-foreground">Satisfied Customers</div>
          </div>
        </div>
      </div>
    </section>
  )
}
