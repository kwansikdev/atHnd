"use client"

import { Button } from "@/components/ui/button"
import { Package, Sparkles } from "lucide-react"

interface EmptyStateProps {
  onAddClick: () => void
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="relative">
      {/* Faded 12-month grid background */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 opacity-40 pointer-events-none">
        {Array.from({ length: 12 }).map((_, index) => {
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
          return (
            <div key={index} className="flex flex-col h-[300px] bg-muted/30 rounded-lg p-4">
              <div className="mb-4 shrink-0 border-b border-border pb-3">
                <h3 className="font-bold text-lg">{months[index]}</h3>
                <p className="text-sm text-muted-foreground">0 releases</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Centered welcome message overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-2xl p-8 md:p-12 max-w-md mx-4 text-center shadow-lg">
          <div className="size-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <Package className="size-10 text-primary" />
          </div>

          <h2 className="text-2xl font-bold mb-3">Welcome to Figure Collection</h2>
          <p className="text-muted-foreground mb-6">
            Start tracking your figure reservations and purchases. Add your first figure to see it on the timeline!
          </p>

          <Button size="lg" className="gap-2" onClick={onAddClick}>
            <Sparkles className="size-4" />
            Add Your First Figure
          </Button>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Track release dates, manage your wishlist, and never miss a pre-order again.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
