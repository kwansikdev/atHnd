"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { FigureCard } from "@/components/figure-card"
import { FigureDetailSheet } from "@/components/figure-detail-sheet"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Suspense } from "react"
import Loading from "./loading"

// Mock data - same as calendar timeline
const mockFiguresData = [
  {
    id: "1",
    name: "Hatsune Miku: Snow Princess",
    manufacturer: "Good Smile Company",
    price: 18500,
    releaseDate: "2025-01-15",
    status: "reserved" as const,
    imageUrl: "/anime-figure-hatsune-miku.jpg",
    paymentType: "deposit" as const,
    shop: "amiami",
    depositPaid: true,
    fullPaid: false,
    shipped: false,
    delivered: false,
  },
  {
    id: "2",
    name: "Emilia: Crystal Dress Ver.",
    manufacturer: "Kadokawa",
    price: 22000,
    releaseDate: "2025-01-28",
    status: "purchased" as const,
    imageUrl: "/anime-figure-rem-birthday-dress.jpg",
    paymentType: "full" as const,
    shop: "goodsmile",
    depositPaid: true,
    fullPaid: true,
    shipped: true,
    delivered: true,
  },
  {
    id: "3",
    name: "Asuna: Stacia the Goddess of Creation",
    manufacturer: "Aniplex",
    price: 26500,
    releaseDate: "2025-02-22",
    status: "reserved" as const,
    imageUrl: "/anime-figure-asuna-sword-art-online.jpg",
    paymentType: "full" as const,
    shop: "animate",
    depositPaid: false,
    fullPaid: false,
    shipped: false,
    delivered: false,
  },
]

type Figure = (typeof mockFiguresData)[0]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null)
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [manufacturerFilters, setManufacturerFilters] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)

  const manufacturers = useMemo(() => {
    return [...new Set(mockFiguresData.map((f) => f.manufacturer))]
  }, [])

  const filteredFigures = useMemo(() => {
    return mockFiguresData.filter((figure) => {
      const matchesSearch =
        searchQuery === "" ||
        figure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        figure.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(figure.status)

      const matchesManufacturer =
        manufacturerFilters.length === 0 ||
        manufacturerFilters.includes(figure.manufacturer)

      return matchesSearch && matchesStatus && matchesManufacturer
    })
  }, [searchQuery, statusFilters, manufacturerFilters])

  const activeFilterCount = statusFilters.length + manufacturerFilters.length

  const handleFigureUpdate = (updatedFigure: Figure) => {
    setSelectedFigure(updatedFigure)
  }

  const toggleStatusFilter = (status: string) => {
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    )
  }

  const toggleManufacturerFilter = (manufacturer: string) => {
    setManufacturerFilters((prev) =>
      prev.includes(manufacturer)
        ? prev.filter((m) => m !== manufacturer)
        : [...prev, manufacturer]
    )
  }

  const clearFilters = () => {
    setStatusFilters([])
    setManufacturerFilters([])
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-4 pb-24 md:pb-6">
        {/* Search Header */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search figures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11"
              autoFocus
            />
          </div>
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="size-11 relative touch-target bg-transparent">
                <SlidersHorizontal className="size-4" />
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 size-5 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
              <SheetHeader className="mb-4">
                <div className="flex items-center justify-between">
                  <SheetTitle>Filters</SheetTitle>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear all
                    </Button>
                  )}
                </div>
              </SheetHeader>
              <div className="space-y-6">
                {/* Status Filter */}
                <div>
                  <h3 className="font-semibold mb-3">Status</h3>
                  <div className="space-y-3">
                    {["reserved", "purchased", "wishlist"].map((status) => (
                      <div key={status} className="flex items-center space-x-3">
                        <Checkbox
                          id={status}
                          checked={statusFilters.includes(status)}
                          onCheckedChange={() => toggleStatusFilter(status)}
                        />
                        <Label htmlFor={status} className="capitalize">
                          {status}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manufacturer Filter */}
                <div>
                  <h3 className="font-semibold mb-3">Manufacturer</h3>
                  <div className="space-y-3">
                    {manufacturers.map((manufacturer) => (
                      <div key={manufacturer} className="flex items-center space-x-3">
                        <Checkbox
                          id={manufacturer}
                          checked={manufacturerFilters.includes(manufacturer)}
                          onCheckedChange={() => toggleManufacturerFilter(manufacturer)}
                        />
                        <Label htmlFor={manufacturer}>{manufacturer}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t safe-bottom">
                <Button className="w-full h-12" onClick={() => setFilterOpen(false)}>
                  Show {filteredFigures.length} results
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {statusFilters.map((status) => (
              <Badge
                key={status}
                variant="secondary"
                className="cursor-pointer capitalize"
                onClick={() => toggleStatusFilter(status)}
              >
                {status} ×
              </Badge>
            ))}
            {manufacturerFilters.map((manufacturer) => (
              <Badge
                key={manufacturer}
                variant="secondary"
                className="cursor-pointer"
                onClick={() => toggleManufacturerFilter(manufacturer)}
              >
                {manufacturer} ×
              </Badge>
            ))}
          </div>
        )}

        {/* Results */}
        <div className="text-sm text-muted-foreground mb-3">
          {filteredFigures.length} results
        </div>

        <div className="grid grid-cols-1 gap-2">
          {filteredFigures.map((figure) => (
            <div key={figure.id} className="border rounded-lg">
              <FigureCard
                figure={figure}
                onClick={() => setSelectedFigure(figure)}
              />
            </div>
          ))}
        </div>

        {filteredFigures.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="size-12 mx-auto mb-4 opacity-50" />
            <p>No figures found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
      <BottomNav />

      <FigureDetailSheet
        figure={selectedFigure}
        open={!!selectedFigure}
        onOpenChange={(open) => !open && setSelectedFigure(null)}
        onUpdate={handleFigureUpdate}
        onDelete={() => setSelectedFigure(null)}
      />
    </div>
  )
}

export function Loading() {
  return null
}
