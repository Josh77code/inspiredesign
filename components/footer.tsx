import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <svg width="160" height="48" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
                {/* Background circle with gradient */}
                <defs>
                  <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:"#ecf95a",stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:"#b8c734",stopOpacity:1}} />
                  </linearGradient>
                </defs>
                
                {/* Main logo circle */}
                <circle cx="30" cy="30" r="25" fill="url(#footerLogoGradient)" stroke="#1a1a1a" strokeWidth="2"/>
                
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
                <line x1="70" y1="50" x2="180" y2="50" stroke="url(#footerLogoGradient)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-muted-foreground text-sm">
              A Christian business with a mission to make Jesus known in creative ways. We design unique digital and physical products inspired by the Spirit of God.
            </p>
            <div className="flex space-x-4">
              <Link href="https://www.instagram.com/_inspiredesigns/profilecard/?igsh=czh4ZHd2dDlqOHhz" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://www.tiktok.com/@_inspiretocreate?_t=ZN-8zizTccV4VS&_r=1" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Home Décor
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Digital Prints
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Faith-Based Designs
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Christian Faith Decor
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">idstudio.creation@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">Phone number</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground text-sm">Online</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">© 2024 Inspire Design. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
