"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Menu, X } from "lucide-react"
import { AnimatedSearch } from "./animated-search"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { toggleCart, getTotalItems } = useCartStore()
  const cartCount = getTotalItems()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto">
              <defs>
                {/* Golden gradient for the circle and text */}
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:"#FFD700",stopOpacity:1}} />
                  <stop offset="50%" style={{stopColor:"#FFA500",stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:"#B8860B",stopOpacity:1}} />
                </linearGradient>
                {/* Dark teal for the dot */}
                <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:"#008B8B",stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:"#2F4F4F",stopOpacity:1}} />
                </linearGradient>
              </defs>
              
              {/* Main golden circle */}
              <circle cx="30" cy="30" r="25" fill="none" stroke="url(#goldGradient)" strokeWidth="3"/>
              
              {/* Script "id" text */}
              <g transform="translate(30, 30)">
                {/* Letter "i" */}
                <path d="M-8 -8 Q-8 -12 -4 -12 Q0 -12 0 -8 Q0 -4 -4 -4 Q-8 -4 -8 -8" 
                      fill="url(#goldGradient)" 
                      stroke="url(#goldGradient)" 
                      strokeWidth="1.5"/>
                {/* Dot above "i" */}
                <circle cx="0" cy="-15" r="2.5" fill="url(#tealGradient)"/>
                {/* Letter "d" */}
                <path d="M0 -8 Q0 -12 4 -12 Q8 -12 8 -8 Q8 -4 4 -4 Q0 -4 0 -8 M0 -8 L0 8 Q0 12 4 12 Q8 12 8 8" 
                      fill="none" 
                      stroke="url(#goldGradient)" 
                      strokeWidth="1.5"/>
              </g>
              
              {/* "INSPIRE DESIGNS" text */}
              <text x="70" y="25" fontSize="14" fontWeight="600" fill="url(#goldGradient)" letterSpacing="1px">
                INSPIRE DESIGNS
              </text>
              <text x="70" y="45" fontSize="10" fill="currentColor" className="text-muted-foreground">
                Faith-Based Digital Prints
              </text>
            </svg>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="magic-nav text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search, Theme Toggle and Cart */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block">
              <AnimatedSearch />
            </div>

            <ThemeToggle />

            {/* Cart Icon */}
            <Button
              variant="outline"
              size="icon"
              className="relative cart-bounce bg-card text-card-foreground border-border hover:bg-primary hover:text-primary-foreground"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {isMounted && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="icon"
              className="md:hidden bg-card text-card-foreground border-border"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col space-y-4">
              <div className="sm:hidden mb-4">
                <AnimatedSearch />
              </div>
              <div className="flex justify-center mb-4">
                <ThemeToggle />
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="magic-nav text-foreground hover:text-primary transition-colors duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
