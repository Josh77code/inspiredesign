import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export function AboutTeam() {
  const teamMembers = [
    {
      name: "Grace Aribasoye",
      role: "Founder & CEO",
      image: "/Personal Picture.jpg",
      bio: "Grace is the visionary founder of Inspire Design, part of Inspire Change - a Christian business with a mission to make Jesus known in creative ways. Through revelation in prayer, Grace designs unique digital and physical products inspired by the Spirit of God.",
    },
  ]

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet Our Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Meet the passionate individual behind Inspire Design, working to make Jesus known through creative expression and inspire faith through beautiful designs.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="max-w-sm">
          {teamMembers.map((member, index) => (
            <Card key={index} className="product-hover bg-card border-border overflow-hidden">
              <div className="aspect-square relative">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <CardContent className="p-6 text-center space-y-3">
                <h3 className="text-xl font-semibold text-card-foreground">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
                <p className="text-sm text-muted-foreground text-pretty">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>
      </div>
    </section>
  )
}
