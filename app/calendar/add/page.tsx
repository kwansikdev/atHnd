"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, X, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { figureDatabase, type SearchableFigure, type FigureStatus, type PaymentType } from "@/lib/figure-data"
import { FigureDetailsForm, type Shop } from "@/components/figure-details-form"
import Image from "next/image"

function getEditionBadge(edition: SearchableFigure["edition"]) {
  switch (edition) {
    case "first":
      return { label: "초판", variant: "default" as const }
    case "reprint":
      return { label: "재판", variant: "secondary" as const }
    case "2nd-reprint":
      return { label: "2차 재판", variant: "secondary" as const }
    case "3rd-reprint":
      return { label: "3차 재판", variant: "secondary" as const }
    default:
      return { label: "초판", variant: "default" as const }
  }
}

function formatReleaseInfo(figure: SearchableFigure) {
  const releaseDate = new Date(figure.releaseDate).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
  })

  if (figure.edition !== "first" && figure.originalReleaseDate) {
    const originalDate = new Date(figure.originalReleaseDate).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
    })
    return `${releaseDate} 출시 예정 · 초판 ${originalDate}`
  }

  return `${releaseDate} 출시 예정`
}

type Step = "select" | "details"

export default function AddFigurePage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("select")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFigures, setSelectedFigures] = useState<SearchableFigure[]>([])
  const [displayCount, setDisplayCount] = useState(5)
  const [figureDetails, setFigureDetails] = useState<
    Record<
      string,
      {
        status: FigureStatus
        paymentType: PaymentType
        paidAmount: number
        date: string
        shop: Shop
      }
    >
  >({})

  const allFilteredFigures = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return figureDatabase
      .filter(
        (figure) => figure.name.toLowerCase().includes(query) || figure.manufacturer.toLowerCase().includes(query),
      )
      .filter((figure) => !selectedFigures.some((s) => s.id === figure.id))
  }, [searchQuery, selectedFigures])

  const displayedFigures = useMemo(() => {
    return allFilteredFigures.slice(0, displayCount)
  }, [allFilteredFigures, displayCount])

  const hasMore = allFilteredFigures.length > displayCount

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 5)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setDisplayCount(5)
  }

  const handleSelectFigure = (figure: SearchableFigure) => {
    setSelectedFigures((prev) => [...prev, figure])
    setFigureDetails((prev) => ({
      ...prev,
      [figure.id]: {
        status: "reserved",
        paymentType: "deposit",
        paidAmount: 0,
        date: new Date().toISOString().split("T")[0],
        shop: "amiami",
      },
    }))
    setSearchQuery("")
  }

  const handleRemoveFigure = (figureId: string) => {
    setSelectedFigures((prev) => prev.filter((f) => f.id !== figureId))
    setFigureDetails((prev) => {
      const updated = { ...prev }
      delete updated[figureId]
      return updated
    })
  }

  const handleUpdateDetails = (
    figureId: string,
    details: {
      status: FigureStatus
      paymentType: PaymentType
      paidAmount: number
      date: string
      shop: Shop
    },
  ) => {
    setFigureDetails((prev) => ({
      ...prev,
      [figureId]: details,
    }))
  }

  const handleSubmit = () => {
    // Here you would save to database
    console.log(
      "Submitting figures:",
      selectedFigures.map((f) => ({
        ...f,
        ...figureDetails[f.id],
      })),
    )
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">Add Figures</h1>
              <p className="text-xs text-muted-foreground">
                {step === "select" ? "Step 1: Select figures" : "Step 2: Enter details"}
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`size-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "select" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <div className="w-8 h-0.5 bg-border" />
            <div
              className={`size-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "details" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {step === "select" ? (
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Search Command */}
            <div className="rounded-lg border border-border bg-card">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search figures by name or manufacturer..."
                  value={searchQuery}
                  onValueChange={handleSearchChange}
                />
                <CommandList>
                  {searchQuery.trim() && allFilteredFigures.length === 0 && (
                    <CommandEmpty>No figures found.</CommandEmpty>
                  )}
                  {displayedFigures.length > 0 && (
                    <CommandGroup heading={`Search Results (${allFilteredFigures.length} found)`}>
                      {displayedFigures.map((figure) => {
                        const editionBadge = getEditionBadge(figure.edition)
                        return (
                          <CommandItem
                            key={figure.id}
                            value={figure.id}
                            onSelect={() => handleSelectFigure(figure)}
                            className="flex items-center gap-3 py-3 cursor-pointer"
                          >
                            <div className="relative size-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                              <Image
                                src={figure.imageUrl || "/placeholder.svg"}
                                alt={figure.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">{figure.name}</p>
                                <Badge variant={editionBadge.variant} className="flex-shrink-0 text-xs">
                                  {editionBadge.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {figure.manufacturer} · ¥{figure.price.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">{formatReleaseInfo(figure)}</p>
                            </div>
                            <Check className="size-4 text-muted-foreground" />
                          </CommandItem>
                        )
                      })}
                      {hasMore && (
                        <div className="p-2">
                          <Button
                            variant="ghost"
                            className="w-full text-muted-foreground hover:text-foreground"
                            onClick={handleLoadMore}
                          >
                            Load more ({allFilteredFigures.length - displayCount} remaining)
                          </Button>
                        </div>
                      )}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </div>

            {/* Selected Figures List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Selected Figures</h2>
                <Badge variant="secondary">{selectedFigures.length} selected</Badge>
              </div>

              {selectedFigures.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <Package className="size-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Search and select figures to add to your collection</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedFigures.map((figure) => {
                    const editionBadge = getEditionBadge(figure.edition)
                    return (
                      <div
                        key={figure.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
                      >
                        <div className="relative size-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={figure.imageUrl || "/placeholder.svg"}
                            alt={figure.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium truncate">{figure.name}</p>
                            <Badge variant={editionBadge.variant} className="flex-shrink-0 text-xs">
                              {editionBadge.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {figure.manufacturer} · ¥{figure.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatReleaseInfo(figure)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveFigure(figure.id)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-4">
              <Button
                size="lg"
                disabled={selectedFigures.length === 0}
                onClick={() => setStep("details")}
                className="gap-2"
              >
                Next
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Enter Details for Each Figure</h2>
              <Button variant="outline" onClick={() => setStep("select")} className="gap-2">
                <ArrowLeft className="size-4" />
                Back
              </Button>
            </div>

            <div className="space-y-4">
              {selectedFigures.map((figure, index) => (
                <FigureDetailsForm
                  key={figure.id}
                  figure={figure}
                  index={index + 1}
                  details={figureDetails[figure.id]}
                  onUpdate={(details) => handleUpdateDetails(figure.id, details)}
                />
              ))}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep("select")}>
                Back
              </Button>
              <Button size="lg" onClick={handleSubmit} className="gap-2">
                <Check className="size-4" />
                Register {selectedFigures.length} {selectedFigures.length === 1 ? "Figure" : "Figures"}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
