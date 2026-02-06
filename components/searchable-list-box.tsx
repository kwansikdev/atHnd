"use client"

import { useState, useMemo } from "react"
import { Search, Star, Plus, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export type ListBoxOption = {
  value: string
  label: string
  parentId?: string
}

type SearchableListBoxProps = {
  options: ListBoxOption[]
  value: string
  onChange: (value: string) => void
  onCreateNew?: (name: string) => void
  placeholder?: string
  filterByParentId?: string
  disabled?: boolean
  recentValues?: string[]
  className?: string
}

export function SearchableListBox({
  options,
  value,
  onChange,
  onCreateNew,
  placeholder = "Search...",
  filterByParentId,
  disabled = false,
  recentValues = [],
  className,
}: SearchableListBoxProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOptions = useMemo(() => {
    let filtered = options

    // Filter by parent if specified
    if (filterByParentId) {
      filtered = filtered.filter((opt) => opt.parentId === filterByParentId)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    return filtered
  }, [options, filterByParentId, searchQuery])

  const recentOptions = useMemo(() => {
    if (!recentValues.length) return []
    return options.filter((opt) => recentValues.includes(opt.value))
  }, [options, recentValues])

  const showCreateOption =
    searchQuery && onCreateNew && !filteredOptions.some((opt) => opt.label.toLowerCase() === searchQuery.toLowerCase())

  const handleSelect = (optionValue: string, optionLabel: string) => {
    if (disabled) return
    onChange(optionLabel)
    setSearchQuery("")
  }

  const handleCreate = () => {
    if (disabled || !searchQuery || !onCreateNew) return
    onCreateNew(searchQuery)
    onChange(searchQuery)
    setSearchQuery("")
  }

  const selectedOption = options.find((opt) => opt.label.toLowerCase() === value.toLowerCase())

  return (
    <div
      className={cn(
        "rounded-lg border bg-background overflow-hidden",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {/* Search Input */}
      <div className="relative border-b">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="border-0 pl-9 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
        />
      </div>

      {/* Options List */}
      <div className="max-h-48 overflow-y-auto">
        {disabled ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Select series first...</div>
        ) : (
          <>
            {/* Recent Section */}
            {recentOptions.length > 0 && !searchQuery && (
              <>
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground flex items-center gap-1 bg-muted/30">
                  <Star className="h-3 w-3" />
                  Recent
                </div>
                {recentOptions.map((option) => (
                  <button
                    key={`recent-${option.value}`}
                    type="button"
                    onClick={() => handleSelect(option.value, option.label)}
                    className={cn(
                      "w-full px-3 py-2 text-sm text-left flex items-center justify-between hover:bg-muted/50 transition-colors",
                      selectedOption?.value === option.value && "bg-primary/10 text-primary",
                    )}
                  >
                    <span>{option.label}</span>
                    {selectedOption?.value === option.value && <Check className="h-4 w-4" />}
                  </button>
                ))}
                <div className="border-b" />
              </>
            )}

            {/* All Options */}
            {filteredOptions.length > 0
              ? filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value, option.label)}
                    className={cn(
                      "w-full px-3 py-2 text-sm text-left flex items-center justify-between hover:bg-muted/50 transition-colors",
                      selectedOption?.value === option.value && "bg-primary/10 text-primary",
                    )}
                  >
                    <span>{option.label}</span>
                    {selectedOption?.value === option.value && <Check className="h-4 w-4" />}
                  </button>
                ))
              : !showCreateOption && (
                  <div className="p-4 text-center text-sm text-muted-foreground">No results found</div>
                )}

            {/* Create New Option */}
            {showCreateOption && (
              <button
                type="button"
                onClick={handleCreate}
                className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-muted/50 transition-colors text-primary"
              >
                <Plus className="h-4 w-4" />
                <span>Create "{searchQuery}"</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
