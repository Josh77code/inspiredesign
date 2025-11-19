import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function PhotographyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Photography
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional photography services for your special moments and events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for photography images */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Photography Image</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Photography Image</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-[4/3] bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Photography Image</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

