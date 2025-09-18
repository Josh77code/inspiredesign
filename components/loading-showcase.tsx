"use client"

import { TubeLoader } from "./tube-loader"

export function LoadingShowcase() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Loading Animations</h2>
          <p className="text-muted-foreground">Experience our custom glowing tube loaders</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Small Loader</h3>
            <TubeLoader size="sm" className="mx-auto" />
            <p className="text-sm text-muted-foreground">Perfect for buttons and small components</p>
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Medium Loader</h3>
            <TubeLoader className="mx-auto" />
            <p className="text-sm text-muted-foreground">Great for general loading states</p>
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Large Loader</h3>
            <TubeLoader size="lg" className="mx-auto" />
            <p className="text-sm text-muted-foreground">Ideal for page transitions and major actions</p>
          </div>
        </div>
      </div>
    </section>
  )
}
