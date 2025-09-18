"use client"

import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function AnimatedSearch() {
  const [isFocused, setIsFocused] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      // Navigate to products page with search query
      router.push(`/products?search=${encodeURIComponent(searchValue.trim())}`)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  const clearSearch = () => {
    setSearchValue("")
  }

  return (
    <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
      <Search
        className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-all duration-300 ${
          isFocused ? "text-primary scale-110" : "text-muted-foreground"
        }`}
      />
      <Input
        type="search"
        placeholder="Search digital art..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyPress={handleKeyPress}
        className={`pl-10 search-expand bg-card text-card-foreground border-border focus:border-primary transition-all duration-300 ${
          isFocused ? "pr-12" : "pr-4"
        }`}
      />
      {searchValue && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  )
}
