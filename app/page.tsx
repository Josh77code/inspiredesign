import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { VideoSection } from "@/components/video-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <VideoSection />
      </main>
      <Footer />
    </div>
  )
}
