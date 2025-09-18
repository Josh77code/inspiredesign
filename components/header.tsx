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
            <svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" className="h-10 w-auto">
              {/* Background circle with gradient */}
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{stopColor:"#ecf95a",stopOpacity:1}} />
                  <stop offset="100%" style={{stopColor:"#b8c734",stopOpacity:1}} />
                </linearGradient>
              </defs>
              
              {/* Main logo circle */}
              <circle cx="30" cy="30" r="25" fill="url(#logoGradient)" stroke="#1a1a1a" strokeWidth="2"/>
              
              {/* Creative design elements inside circle */}
              <path d="M20 20 L25 15 L30 20 L35 15 L40 20 L40 25 L35 30 L30 25 L25 30 L20 25 Z" fill="#1a1a1a" opacity="0.8"/>
              <circle cx="30" cy="30" r="3" fill="#1a1a1a"/>
              
              {/* Company name */}
              <text x="70" y="25" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" className="fill-foreground dark:fill-[#ecf95a]">
                Inspire
              </text>
              <text x="70" y="45" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="normal" className="fill-muted-foreground dark:fill-[#ecf95a]">
                Design
              </text>
              
              {/* Decorative line */}
              <line x1="70" y1="50" x2="180" y2="50" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round"/>
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
