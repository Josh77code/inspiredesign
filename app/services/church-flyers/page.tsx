import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

export default function ChurchFlyersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Church Flyers
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional church flyer designs for your events, services, and special occasions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for church flyer images */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Church Flyer Image</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Church Flyer Image</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Church Flyer Image</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

