import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AboutHero } from "@/components/about-hero"
import { AboutServices } from "@/components/about-services"
import { AboutTeam } from "@/components/about-team"
import { AboutStats } from "@/components/about-stats"
import { AboutOwner } from "@/components/about-owner"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <AboutHero />
        <AboutOwner />
        <AboutStats />
        <AboutServices />
        <AboutTeam />
      </main>
      <Footer />
    </div>
  )
}
