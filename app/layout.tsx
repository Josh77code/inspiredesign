import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { CartOverlay } from "@/components/cart-overlay"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Inspire Design - Premium Digital Art & Creative Solutions",
  description:
    "Discover and purchase inspiring digital art designs, illustrations, and creative assets from talented artists worldwide. Transform your projects with premium quality designs.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange={false}>
          <Suspense fallback={null}>
            {children}
            <CartOverlay />
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
