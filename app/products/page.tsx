import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductsGallery } from "@/components/products-gallery"
import { ProductFilters } from "@/components/product-filters"

interface ProductsPageProps {
  searchParams: {
    search?: string
    category?: string
  }
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const { search, category } = searchParams

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground text-balance">
              {search ? `Search Results for "${search}"` : "Inspire Design Collection"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              {search 
                ? `Showing results for "${search}". Discover inspiring faith-based designs that match your search.`
                : "Discover inspiring faith-based digital designs and Christian artwork ready for instant download. Each design carries a message that speaks to the heart and encourages faith."
              }
            </p>
          </div>

          <ProductFilters />
          <ProductsGallery 
            searchQuery={search} 
            categoryFilter={category}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
