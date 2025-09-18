"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const isDark = theme === "dark"

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="relative w-14 h-7 bg-secondary rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary glow-button"
        aria-label="Toggle theme"
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 bg-card rounded-full transition-transform duration-300 flex items-center justify-center ${
            isDark ? "transform translate-x-7" : ""
          }`}
        >
          {isDark ? (
            <Moon className="h-3 w-3 text-card-foreground" />
          ) : (
            <Sun className="h-3 w-3 text-card-foreground" />
          )}
        </div>
      </button>
      <div className={`led-indicator ${isDark ? "" : "off"}`} />
      <span className="text-sm text-foreground hidden sm:inline">{isDark ? "Dark" : "Light"}</span>
    </div>
  )
}
