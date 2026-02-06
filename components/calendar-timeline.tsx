"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { FigureCard } from "@/components/figure-card"
import { FigureDetailSheet } from "@/components/figure-detail-sheet"
import { EmptyState } from "@/components/empty-state"
import { ChevronLeft, ChevronRight, LayoutGrid, List, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const SHOW_DEMO_DATA = true

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
    name: "Hatsune Miku: Summer Version",
    manufacturer: "Good Smile Company",
    price: 18500,
    releaseDate: "2025-02-15",
    status: "reserved" as const,
    imageUrl: "/anime-figure-hatsune-miku.jpg",
    paymentType: "deposit" as const,
    shop: "amiami",
    depositPaid: true,
    fullPaid: true,
    shipped: false,
    delivered: false,
  },
  {
    id: "4",
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
  {
    id: "5",
    name: "Rem: Birthday Dress Ver.",
    manufacturer: "FuRyu",
    price: 16800,
    releaseDate: "2025-03-20",
    status: "reserved" as const,
    imageUrl: "/anime-figure-rem-birthday-dress.jpg",
  },
  {
    id: "6",
    name: "Miku: Racing 2025 Ver.",
    manufacturer: "Max Factory",
    price: 19800,
    releaseDate: "2025-03-30",
    status: "purchased" as const,
    imageUrl: "/anime-figure-hatsune-miku.jpg",
    depositPaid: true,
    fullPaid: true,
    shipped: true,
    delivered: false,
  },
  {
    id: "7",
    name: "Asuna: Ordinal Scale",
    manufacturer: "Aniplex",
    price: 21000,
    releaseDate: "2025-04-10",
    status: "purchased" as const,
    imageUrl: "/anime-figure-asuna-sword-art-online.jpg",
  },
  {
    id: "8",
    name: "Yor Forger: Party Dress",
    manufacturer: "Bandai Spirits",
    price: 17500,
    releaseDate: "2025-04-18",
    status: "reserved" as const,
    imageUrl: "/anime-figure-rem-birthday-dress.jpg",
  },
  {
    id: "9",
    name: "Violet Evergarden: Auto Memory Doll",
    manufacturer: "Good Smile Company",
    price: 20500,
    releaseDate: "2025-04-25",
    status: "reserved" as const,
    imageUrl: "/anime-figure-asuna-sword-art-online.jpg",
  },
  {
    id: "10",
    name: "Sakura Miku 2025",
    manufacturer: "Good Smile Company",
    price: 19500,
    releaseDate: "2025-05-25",
    status: "reserved" as const,
    imageUrl: "/anime-figure-sakura-miku-cherry-blossom.jpg",
  },
  {
    id: "11",
    name: "Mai Sakurajima: Bunny Ver.",
    manufacturer: "FREEing",
    price: 28000,
    releaseDate: "2025-05-30",
    status: "reserved" as const,
    imageUrl: "/anime-figure-rem-birthday-dress.jpg",
  },
  {
    id: "12",
    name: "Marin Kitagawa: School Uniform",
    manufacturer: "Aniplex",
    price: 16200,
    releaseDate: "2025-06-12",
    status: "purchased" as const,
    imageUrl: "/anime-figure-marin-kitagawa-swimsuit.jpg",
  },
  {
    id: "13",
    name: "Raphtalia: Kimono Ver.",
    manufacturer: "Kadokawa",
    price: 18900,
    releaseDate: "2025-06-28",
    status: "reserved" as const,
    imageUrl: "/anime-figure-asuna-sword-art-online.jpg",
  },
  {
    id: "14",
    name: "Zero Two: Wedding Dress",
    manufacturer: "Kotobukiya",
    price: 24000,
    releaseDate: "2025-07-15",
    status: "reserved" as const,
    imageUrl: "/anime-figure-zero-two-wedding-dress.jpg",
  },
  {
    id: "15",
    name: "Nami: Film Red Ver.",
    manufacturer: "Megahouse",
    price: 15800,
    releaseDate: "2025-07-22",
    status: "purchased" as const,
    imageUrl: "/anime-figure-marin-kitagawa-swimsuit.jpg",
  },
  {
    id: "16",
    name: "Nico Robin: Onigashima",
    manufacturer: "Megahouse",
    price: 18500,
    releaseDate: "2025-08-10",
    status: "reserved" as const,
    imageUrl: "/anime-figure-asuna-sword-art-online.jpg",
  },
  {
    id: "17",
    name: "Miku: Magical Mirai 2025",
    manufacturer: "Good Smile Company",
    price: 21000,
    releaseDate: "2025-08-31",
    status: "reserved" as const,
    imageUrl: "/anime-figure-hatsune-miku.jpg",
  },
  {
    id: "18",
    name: "Nezuko: Full Demon Form",
    manufacturer: "Aniplex",
    price: 32000,
    releaseDate: "2025-09-15",
    status: "reserved" as const,
    imageUrl: "/anime-figure-rem-birthday-dress.jpg",
  },
  {
    id: "19",
    name: "Shinobu Kocho: Butterfly Ver.",
    manufacturer: "Aniplex",
    price: 28500,
    releaseDate: "2025-09-28",
    status: "reserved" as const,
    imageUrl: "/anime-figure-sakura-miku-cherry-blossom.jpg",
  },
  {
    id: "20",
    name: "Frieren: Journey Ver.",
    manufacturer: "Good Smile Company",
    price: 19800,
    releaseDate: "2025-10-10",
    status: "reserved" as const,
    imageUrl: "/anime-figure-asuna-sword-art-online.jpg",
  },
  {
    id: "21",
    name: "Fern: Mage Robes",
    manufacturer: "Good Smile Company",
    price: 18500,
    releaseDate: "2025-10-25",
    status: "reserved" as const,
    imageUrl: "/anime-figure-rem-birthday-dress.jpg",
  },
  {
    id: "22",
    name: "Anya Forger: Elegant Ver.",
    manufacturer: "Bandai Spirits",
    price: 14500,
    releaseDate: "2025-11-11",
    status: "reserved" as const,
    imageUrl: "/anime-figure-marin-kitagawa-swimsuit.jpg",
  },
  {
    id: "23",
    name: "Power: Chainsaw Devil",
    manufacturer: "Kotobukiya",
    price: 22000,
    releaseDate: "2025-11-28",
    status: "reserved" as const,
    imageUrl: "/anime-figure-zero-two-wedding-dress.jpg",
  },
  {
    id: "24",
    name: "Makima: Control Devil",
    manufacturer: "FREEing",
    price: 35000,
    releaseDate: "2025-12-15",
    status: "reserved" as const,
    imageUrl: "/anime-figure-asuna-sword-art-online.jpg",
  },
  {
    id: "25",
    name: "Miku: Winter Wonderland",
    manufacturer: "Good Smile Company",
    price: 20500,
    releaseDate: "2025-12-20",
    status: "reserved" as const,
    imageUrl: "/anime-figure-hatsune-miku.jpg",
  },
  {
    id: "26",
    name: "Bocchi: Rock Star Ver.",
    manufacturer: "Aniplex",
    price: 17800,
    releaseDate: "2025-12-28",
    status: "reserved" as const,
    imageUrl: "/anime-figure-sakura-miku-cherry-blossom.jpg",
  },
  {
    id: "27",
    name: "Kita Ikuyo: Live Stage",
    manufacturer: "Aniplex",
    price: 16500,
    releaseDate: "2025-12-30",
    status: "purchased" as const,
    imageUrl: "/anime-figure-marin-kitagawa-swimsuit.jpg",
  },
]

interface Figure {
  id: string
  name: string
  manufacturer: string
  price: number
  releaseDate: string
  status: "reserved" | "purchased" | "wishlist"
  imageUrl: string
  paymentType?: "deposit" | "full" | "partial"
  depositAmount?: number
  shop?: string
  depositPaid?: boolean
  fullPaid?: boolean
  shipped?: boolean
  delivered?: boolean
}

export function CalendarTimeline() {
  const router = useRouter()
  const [currentYear, setCurrentYear] = useState(2025)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [manufacturerFilter, setManufacturerFilter] = useState<string>("all")
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)
  const [figures, setFigures] = useState<Figure[]>(SHOW_DEMO_DATA ? mockFiguresData : [])

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const manufacturers = useMemo(() => {
    const uniqueManufacturers = [...new Set(figures.map((f) => f.manufacturer))]
    return uniqueManufacturers.sort()
  }, [figures])

  const filteredFigures = useMemo(() => {
    return figures.filter((figure) => {
      const matchesSearch =
        figure.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        figure.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || figure.status === statusFilter
      const matchesManufacturer = manufacturerFilter === "all" || figure.manufacturer === manufacturerFilter
      return matchesSearch && matchesStatus && matchesManufacturer
    })
  }, [figures, searchQuery, statusFilter, manufacturerFilter])

  const figuresByMonth = useMemo(() => {
    const grouped: Record<number, Figure[]> = {}
    for (let i = 0; i < 12; i++) {
      grouped[i] = []
    }

    filteredFigures.forEach((figure) => {
      const date = new Date(figure.releaseDate)
      if (date.getFullYear() === currentYear) {
        const month = date.getMonth()
        grouped[month].push(figure)
      }
    })

    return grouped
  }, [filteredFigures, currentYear])

  const totalFigures = filteredFigures.filter((f) => new Date(f.releaseDate).getFullYear() === currentYear).length

  const totalValue = filteredFigures
    .filter((f) => new Date(f.releaseDate).getFullYear() === currentYear)
    .reduce((sum, f) => sum + f.price, 0)

  const handleFigureClick = (figure: Figure) => {
    setSelectedFigure(figure)
    setDetailSheetOpen(true)
  }

  const handleFigureUpdate = (updatedFigure: Figure) => {
    setFigures((prev) => prev.map((f) => (f.id === updatedFigure.id ? updatedFigure : f)))
    setSelectedFigure(updatedFigure)
  }

  const handleFigureDelete = (figureId: string) => {
    setFigures((prev) => prev.filter((f) => f.id !== figureId))
  }

  if (figures.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col gap-3 md:gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="outline" size="icon" className="size-9 md:size-10 touch-target bg-transparent" onClick={() => setCurrentYear((prev) => prev - 1)}>
              <ChevronLeft className="size-4" />
            </Button>
            <h2 className="text-xl md:text-2xl font-bold min-w-[80px] md:min-w-[100px] text-center">{currentYear}</h2>
            <Button variant="outline" size="icon" className="size-9 md:size-10 touch-target bg-transparent" onClick={() => setCurrentYear((prev) => prev + 1)}>
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/calendar/add")} className="hidden md:flex">
              <Plus className="size-4 mr-2" />
              Add Figure
            </Button>
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="touch-target"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="touch-target"
                onClick={() => setViewMode("list")}
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search figures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-11 md:h-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1 sm:w-[130px] h-11 md:h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="purchased">Purchased</SelectItem>
                <SelectItem value="wishlist">Wishlist</SelectItem>
              </SelectContent>
            </Select>
            <Select value={manufacturerFilter} onValueChange={setManufacturerFilter}>
              <SelectTrigger className="flex-1 sm:w-[160px] h-11 md:h-10">
                <SelectValue placeholder="Manufacturer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Manufacturers</SelectItem>
                {manufacturers.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
          <span>{totalFigures} figures</span>
          <span>•</span>
          <span>Total: ¥{totalValue.toLocaleString()}</span>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {months.map((month, index) => {
            const monthFigures = figuresByMonth[index]
            return (
              <div key={month} className="rounded-xl bg-muted/30 h-[280px] md:h-[500px] flex flex-col">
                <div className="p-2 md:p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-1 md:gap-2">
                    <h3 className="font-semibold text-sm md:text-base">{month}</h3>
                    {monthFigures.length > 0 && (
                      <Badge variant="secondary" className="text-[10px] md:text-xs px-1.5 md:px-2">
                        {monthFigures.length}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 md:size-8 touch-target"
                    onClick={() => router.push(`/calendar/add?month=${index + 1}&year=${currentYear}`)}
                  >
                    <Plus className="size-3.5 md:size-4" />
                  </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-1.5 md:p-2 space-y-1.5 md:space-y-2 scroll-smooth-ios scrollbar-hide">
                  {monthFigures.length === 0 ? (
                    <button
                      className="w-full h-full flex flex-col items-center justify-center text-muted-foreground active:text-foreground active:bg-accent/50 rounded-lg transition-colors touch-target"
                      onClick={() => router.push(`/calendar/add?month=${index + 1}&year=${currentYear}`)}
                    >
                      <Plus className="size-6 md:size-8 mb-1 md:mb-2 opacity-50" />
                      <span className="text-xs md:text-sm">Add figure</span>
                    </button>
                  ) : (
                    monthFigures.map((figure) => (
                      <FigureCard key={figure.id} figure={figure} onClick={() => handleFigureClick(figure)} />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold">Figure</th>
                <th className="text-left p-4 font-semibold hidden md:table-cell">Manufacturer</th>
                <th className="text-left p-4 font-semibold">Release</th>
                <th className="text-left p-4 font-semibold hidden sm:table-cell">Price</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold hidden lg:table-cell">Progress</th>
              </tr>
            </thead>
            <tbody>
              {filteredFigures
                .filter((f) => new Date(f.releaseDate).getFullYear() === currentYear)
                .sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime())
                .map((figure) => (
                  <tr
                    key={figure.id}
                    className="border-t hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => handleFigureClick(figure)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={figure.imageUrl || "/placeholder.svg"}
                            alt={figure.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium line-clamp-2">{figure.name}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground">{figure.manufacturer}</td>
                    <td className="p-4 text-sm">
                      {new Date(figure.releaseDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="p-4 hidden sm:table-cell">¥{figure.price.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge
                        variant="secondary"
                        className={
                          figure.status === "reserved"
                            ? "bg-primary text-primary-foreground"
                            : figure.status === "purchased"
                              ? "bg-chart-5 text-white"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {figure.status}
                      </Badge>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="flex gap-1">
                        {figure.depositPaid && (
                          <div
                            className="size-6 rounded-full bg-primary/20 flex items-center justify-center"
                            title="예약금 결제"
                          >
                            <span className="text-xs text-primary">1</span>
                          </div>
                        )}
                        {figure.fullPaid && (
                          <div
                            className="size-6 rounded-full bg-primary/20 flex items-center justify-center"
                            title="잔금 결제"
                          >
                            <span className="text-xs text-primary">2</span>
                          </div>
                        )}
                        {figure.shipped && (
                          <div
                            className="size-6 rounded-full bg-primary/20 flex items-center justify-center"
                            title="발송 완료"
                          >
                            <span className="text-xs text-primary">3</span>
                          </div>
                        )}
                        {figure.delivered && (
                          <div
                            className="size-6 rounded-full bg-chart-5/20 flex items-center justify-center"
                            title="배송 완료"
                          >
                            <span className="text-xs text-chart-5">✓</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      <FigureDetailSheet
        figure={selectedFigure}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onUpdate={handleFigureUpdate}
        onDelete={handleFigureDelete}
      />
    </div>
  )
}
