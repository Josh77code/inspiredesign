import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Target, Users, Lightbulb } from "lucide-react"

export function AboutOwner() {
  const ownerInfo = {
    name: "Grace Aribasoye",
    role: "Founder & CEO",
    image: "/Personal Picture.jpg",
    bio: "Grace is the visionary founder of Inspire Design, part of Inspire Change - a Christian business with a mission to make Jesus known in creative ways. Through revelation in prayer, Grace founded this platform to design unique digital and physical products inspired by the Spirit of God. Each design carries a message that speaks to the heart and aims to encourage faith while sparking conversations about Jesus.",
    achievements: [
      {
        icon: Award,
        title: "Faith-Based Mission",
        description: "Creating designs that make Jesus known through creative expression"
      },
      {
        icon: Target,
        title: "Global Vision",
        description: "Establishing a worldwide business showcasing God's expression through design"
      },
      {
        icon: Users,
        title: "Community Impact",
        description: "Encouraging faith and inspiring change through artistic creations"
      },
      {
        icon: Lightbulb,
        title: "Divine Inspiration",
        description: "Designs birthed through prayer and spiritual revelation"
      }
    ]
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Owner Image */}
            <div className="relative">
              <Card className="product-hover bg-card border-border overflow-hidden">
                <div className="aspect-square relative">
                  <Image 
                    src={ownerInfo.image} 
                    alt={ownerInfo.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-card-foreground">{ownerInfo.name}</h3>
                  <p className="text-primary text-lg font-medium">{ownerInfo.role}</p>
                </CardContent>
              </Card>
            </div>

            {/* Owner Bio & Achievements */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet Our Founder</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {ownerInfo.bio}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {ownerInfo.achievements.map((achievement, index) => (
                  <Card key={index} className="bg-card border-border p-4">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <achievement.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-card-foreground mb-1">
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
