import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function LogoDesignPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Logo Design
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Custom logo designs for your business, church, or organization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for logo design images */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-square bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Logo Design</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-square bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Logo Design</p>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="aspect-square bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Logo Design</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

