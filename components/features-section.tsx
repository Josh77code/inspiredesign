"use client"

import { Church, Camera, Palette, Sparkles, CheckCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  {
    icon: Church,
    title: "Church Flyers",
    description: "Beautiful, faith-inspired flyers designed to spread your message with elegance and impact.",
    href: "/services/church-flyers",
    color: "text-blue-500"
  },
  {
    icon: Camera,
    title: "Photography",
    description: "Professional photography services capturing moments of faith, celebration, and inspiration.",
    href: "/services/photography",
    color: "text-purple-500"
  },
  {
    icon: Palette,
    title: "Logo Design",
    description: "Custom logo designs that reflect your brand's values and mission with creative excellence.",
    href: "/services/logo-design",
    color: "text-pink-500"
  },
  {
    icon: Sparkles,
    title: "Digital Prints",
    description: "Premium digital art prints in various sizes, perfect for home decor and gifting.",
    href: "/products",
    color: "text-orange-500"
  }
]

const benefits = [
  "High-quality designs",
  "Affordable pricing",
  "Fast delivery",
  "Multiple formats available",
  "Customizable options",
  "24/7 customer support"
]

export function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-card/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 md:mb-6">
            Our Services & Products
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Discover our comprehensive range of faith-based design services and premium digital products
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative bg-card border border-border rounded-2xl p-6 md:p-8 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-7 w-7 md:h-8 md:w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-card-foreground mb-3 md:mb-4 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4 md:mb-6">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-primary font-semibold text-sm md:text-base group-hover:gap-2 transition-all">
                    Learn more
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Benefits Section */}
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 lg:p-16">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-card-foreground mb-4 md:mb-6">
                Why Choose Us?
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed">
                We're committed to providing you with exceptional quality, affordable prices, and outstanding service. 
                Every design is crafted with care and attention to detail.
              </p>
              <Link href="/products">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg md:text-xl font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Explore Our Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3 p-4 bg-background/50 rounded-xl border border-border hover:border-primary/50 transition-colors"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base md:text-lg font-medium text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

