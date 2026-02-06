"use client"

import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Check, Package, CreditCard, Truck } from "lucide-react"

interface Figure {
  id: string
  name: string
  manufacturer: string
  price: number
  releaseDate: string
  status: "reserved" | "purchased" | "wishlist"
  imageUrl: string
  depositPaid?: boolean
  fullPaid?: boolean
  shipped?: boolean
  delivered?: boolean
}

interface FigureCardProps {
  figure: Figure
  onClick?: () => void
}

export function FigureCard({ figure, onClick }: FigureCardProps) {
  const statusColors = {
    reserved: "bg-primary text-primary-foreground",
    purchased: "bg-chart-5 text-white",
    wishlist: "bg-muted text-muted-foreground",
  }

  const progressCount = [figure.depositPaid, figure.fullPaid, figure.shipped, figure.delivered].filter(Boolean).length
  const hasProgress = progressCount > 0

  return (
    <div
      className="p-2 md:p-3 rounded-lg bg-background active:bg-accent/50 md:hover:bg-accent/50 transition-colors cursor-pointer group touch-target"
      onClick={onClick}
    >
      <div className="flex gap-2 md:gap-3">
        <div className="relative size-14 md:size-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
          <Image
            src={figure.imageUrl || "/placeholder.svg"}
            alt={figure.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
          {figure.delivered && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="bg-chart-5 rounded-full p-1 md:p-1.5">
                <Check className="size-3 md:size-4 text-white" />
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-xs md:text-sm line-clamp-2 text-balance mb-0.5 md:mb-1">{figure.name}</h4>
          <p className="text-[10px] md:text-xs text-muted-foreground mb-1 md:mb-2 hidden md:block">{figure.manufacturer}</p>
          <div className="flex items-center justify-between gap-1">
            <Badge variant="secondary" className={`text-[10px] md:text-xs px-1.5 md:px-2 ${statusColors[figure.status]}`}>
              {figure.status}
            </Badge>
            <span className="text-[10px] md:text-xs font-semibold">¥{figure.price.toLocaleString()}</span>
          </div>
          {hasProgress && (
            <div className="flex gap-1 md:gap-1.5 mt-1 md:mt-2">
              {figure.depositPaid && (
                <div className="size-4 md:size-5 rounded-full bg-primary/20 flex items-center justify-center" title="예약금 결제">
                  <CreditCard className="size-2.5 md:size-3 text-primary" />
                </div>
              )}
              {figure.fullPaid && (
                <div className="size-4 md:size-5 rounded-full bg-primary/20 flex items-center justify-center" title="잔금 결제">
                  <Check className="size-2.5 md:size-3 text-primary" />
                </div>
              )}
              {figure.shipped && (
                <div className="size-4 md:size-5 rounded-full bg-primary/20 flex items-center justify-center" title="발송 완료">
                  <Package className="size-2.5 md:size-3 text-primary" />
                </div>
              )}
              {figure.delivered && (
                <div className="size-4 md:size-5 rounded-full bg-chart-5/20 flex items-center justify-center" title="배송 완료">
                  <Truck className="size-2.5 md:size-3 text-chart-5" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
