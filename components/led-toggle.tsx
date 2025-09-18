"use client"

import { useState } from "react"

interface LedToggleProps {
  label: string
  defaultOn?: boolean
  onChange?: (isOn: boolean) => void
}

export function LedToggle({ label, defaultOn = false, onChange }: LedToggleProps) {
  const [isOn, setIsOn] = useState(defaultOn)

  const handleToggle = () => {
    const newState = !isOn
    setIsOn(newState)
    onChange?.(newState)
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleToggle}
        className="relative w-12 h-6 bg-secondary rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <div
          className={`absolute top-1 left-1 w-4 h-4 bg-card rounded-full transition-transform duration-300 ${
            isOn ? "transform translate-x-6" : ""
          }`}
        />
      </button>
      <div className={`led-indicator ${isOn ? "" : "off"}`} />
      <span className="text-sm text-foreground">{label}</span>
    </div>
  )
}
