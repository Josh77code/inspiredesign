"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GlowButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: "default" | "secondary" | "outline"
}

export function GlowButton({ children, className, onClick, variant = "default" }: GlowButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className={cn("glow-button bg-primary text-primary-foreground hover:bg-primary/90", className)}
    >
      {children}
    </Button>
  )
}
