import { Brush, Zap, Shield, Headphones } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function AboutServices() {
  const services = [
    {
      icon: Brush,
      title: "Faith-Based Designs",
      description:
        "Unique digital and physical products inspired by the Spirit of God, designed to encourage faith and spark conversations about Jesus.",
    },
    {
      icon: Zap,
      title: "Instant Downloads",
      description:
        "Get immediate access to your purchased designs in PDF and JPEG formats, ready for home décor, printing, and personal use.",
    },
    {
      icon: Shield,
      title: "Custom Services",
      description:
        "Personalized Christian prints on T-shirts, hoodies, tote bags, custom business cards, and product stickers for your vision.",
    },
    {
      icon: Headphones,
      title: "Faith Community",
      description:
        "Join our community of believers who support our mission to make Jesus known through creative expression and design.",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            We specialize in inspired, one-of-a-kind designs that encourage faith and showcase how our Heavenly Father expresses Himself through design to touch hearts and inspire change.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="product-hover bg-card border-border">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">{service.title}</h3>
                <p className="text-muted-foreground text-pretty">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
