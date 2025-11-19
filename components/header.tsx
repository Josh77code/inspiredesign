"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react"
import { AnimatedSearch } from "./animated-search"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { toggleCart, getTotalItems } = useCartStore()
  const cartCount = getTotalItems()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
  ]

  const servicesItems = [
    { name: "Church flyers", href: "/services/church-flyers" },
    { name: "Photography", href: "/services/photography" },
    { name: "Logo design", href: "/services/logo-design" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start space-y-0.5 hover:opacity-90 transition-opacity min-w-0 flex-shrink-0">
            <div className="relative h-10 sm:h-12 md:h-14 w-auto max-w-[180px] sm:max-w-[200px]">
              <Image
                src="/Inspire Design-Business Logo.png"
                alt="Inspire Design Logo"
                width={200}
                height={56}
                className="h-full w-auto object-contain"
                priority
                unoptimized
              />
            </div>
            <p className="text-[10px] sm:text-xs font-medium text-primary tracking-wide whitespace-nowrap">
              Designs beyond Limits
            </p>
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
            {/* Services Dropdown */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="magic-nav text-foreground hover:text-primary transition-colors duration-300 font-medium bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[200px] gap-3 p-4">
                      {servicesItems.map((service) => (
                        <li key={service.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={service.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none text-foreground">
                                {service.name}
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
              {/* Services Dropdown for Mobile */}
              <div>
                <button
                  onClick={() => setIsServicesOpen(!isServicesOpen)}
                  className="magic-nav text-foreground hover:text-primary transition-colors duration-300 font-medium flex items-center w-full"
                >
                  Services
                  <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isServicesOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {servicesItems.map((service) => (
                      <Link
                        key={service.name}
                        href={service.href}
                        className="block text-muted-foreground hover:text-primary transition-colors duration-300"
                        onClick={() => {
                          setIsMenuOpen(false)
                          setIsServicesOpen(false)
                        }}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
