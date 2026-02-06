"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Check, Package, CreditCard, Truck, CircleDollarSign, Pencil, Trash2, X } from "lucide-react"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-mobile"
import { Input } from "@/components/ui/input"

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
  // Progress tracking
  depositPaid?: boolean
  fullPaid?: boolean
  shipped?: boolean
  delivered?: boolean
}

interface FigureDetailSheetProps {
  figure: Figure | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: (figure: Figure) => void
  onDelete?: (figureId: string) => void
}

const shops: Record<string, string> = {
  amiami: "AmiAmi",
  goodsmile: "Good Smile Online",
  hobbystock: "HobbyStock",
  animate: "Animate",
  hobbyjapan: "Hobby Japan",
  amazonjp: "Amazon JP",
  other: "Other",
}

export function FigureDetailSheet({ figure, open, onOpenChange, onUpdate, onDelete }: FigureDetailSheetProps) {
  const isMobile = useIsMobile()
  const [localFigure, setLocalFigure] = useState<Figure | null>(figure)
  const [editingField, setEditingField] = useState<"balanceAmount" | "depositAmount" | null>(null)
  const [editValue, setEditValue] = useState("")

  useEffect(() => {
    if (figure?.id !== localFigure?.id) {
      setLocalFigure(figure)
    }
  }, [figure, localFigure?.id])

  useEffect(() => {
    if (!open) {
      setEditingField(null)
      setEditValue("")
    }
  }, [open])

  if (!localFigure) {
    return null
  }

  const handleStartEdit = (field: "balanceAmount" | "depositAmount") => {
    setEditingField(field)
    if (field === "balanceAmount") {
      const balance = localFigure.price - (localFigure.depositAmount || 0)
      setEditValue(String(balance))
    } else {
      setEditValue(String(localFigure.depositAmount || 0))
    }
  }

  const handleSaveEdit = () => {
    if (editingField && editValue) {
      const numValue = Number.parseInt(editValue.replace(/[^0-9]/g, ""), 10) || 0
      const updated = { ...localFigure }

      if (editingField === "balanceAmount") {
        // Balance amount updates total price
        updated.price = (localFigure.depositAmount || 0) + numValue
      } else {
        updated.depositAmount = numValue
      }

      setLocalFigure(updated)
      onUpdate?.(updated)
    }
    setEditingField(null)
    setEditValue("")
  }

  const handleCancelEdit = () => {
    setEditingField(null)
    setEditValue("")
  }

  const handleToggleProgress = (field: keyof Figure) => {
    const updated = { ...localFigure, [field]: !localFigure[field] }
    setLocalFigure(updated)
    onUpdate?.(updated)
  }

  const progressSteps = [
    {
      key: "depositPaid" as const,
      label: "예약금 결제",
      icon: CircleDollarSign,
      show: localFigure.paymentType === "deposit" || localFigure.paymentType === "partial",
    },
    {
      key: "fullPaid" as const,
      label: "잔금 결제",
      icon: CreditCard,
      show: true,
    },
    {
      key: "shipped" as const,
      label: "발송 완료",
      icon: Package,
      show: true,
    },
    {
      key: "delivered" as const,
      label: "배송 완료",
      icon: Truck,
      show: true,
    },
  ].filter((step) => step.show)

  const statusLabels = {
    reserved: "예약",
    purchased: "구매 완료",
    wishlist: "위시리스트",
  }

  const statusColors = {
    reserved: "bg-primary text-primary-foreground",
    purchased: "bg-chart-5 text-white",
    wishlist: "bg-muted text-muted-foreground",
  }

  const content = (
    <div className="flex flex-col gap-6">
      {/* Figure Info */}
      <div className="flex gap-4">
        <div className="relative size-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
          <Image
            src={localFigure.imageUrl || "/placeholder.svg"}
            alt={localFigure.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base line-clamp-2 mb-1">{localFigure.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{localFigure.manufacturer}</p>
          <Badge className={statusColors[localFigure.status]}>{statusLabels[localFigure.status]}</Badge>
        </div>
      </div>

      <Separator />

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground mb-1">출시일</p>
          <p className="font-medium">
            {new Date(localFigure.releaseDate).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">총 가격</p>
          <p className="font-medium">¥{localFigure.price.toLocaleString()}</p>
        </div>
        {localFigure.shop && (
          <div>
            <p className="text-muted-foreground mb-1">구매처</p>
            <p className="font-medium">{shops[localFigure.shop] || localFigure.shop}</p>
          </div>
        )}
        {localFigure.paymentType && (
          <div>
            <p className="text-muted-foreground mb-1">결제 방식</p>
            <p className="font-medium">
              {localFigure.paymentType === "deposit" && "예약금"}
              {localFigure.paymentType === "full" && "전액 결제"}
              {localFigure.paymentType === "partial" && "일부 결제"}
            </p>
          </div>
        )}
        {(localFigure.paymentType === "deposit" || localFigure.paymentType === "partial") &&
          localFigure.depositAmount && (
            <>
              <div>
                <p className="text-muted-foreground mb-1">예약금</p>
                {editingField === "depositAmount" ? (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">¥</span>
                    <Input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit()
                        if (e.key === "Escape") handleCancelEdit()
                      }}
                      className="h-7 w-24 px-2 text-sm"
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" className="size-7" onClick={handleSaveEdit}>
                      <Check className="size-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-7" onClick={handleCancelEdit}>
                      <X className="size-3" />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit("depositAmount")}
                    className="font-medium flex items-center gap-1 hover:text-primary transition-colors group"
                  >
                    ¥{localFigure.depositAmount.toLocaleString()}
                    <Pencil className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
              </div>
              <div>
                <p className="text-muted-foreground mb-1">잔금</p>
                {editingField === "balanceAmount" ? (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">¥</span>
                    <Input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit()
                        if (e.key === "Escape") handleCancelEdit()
                      }}
                      className="h-7 w-24 px-2 text-sm"
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" className="size-7" onClick={handleSaveEdit}>
                      <Check className="size-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-7" onClick={handleCancelEdit}>
                      <X className="size-3" />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit("balanceAmount")}
                    className="font-medium flex items-center gap-1 hover:text-primary transition-colors group"
                  >
                    ¥{(localFigure.price - localFigure.depositAmount).toLocaleString()}
                    <Pencil className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
              </div>
            </>
          )}
      </div>

      <Separator />

      <div>
        <h4 className="font-semibold mb-4">진행 상태</h4>
        <div className="relative space-y-1">
          {/* Timeline line */}
          <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/20 via-primary/20 to-transparent" />

          {progressSteps.map((step, index) => {
            const isCompleted = localFigure[step.key] === true
            const Icon = step.icon
            const isLast = index === progressSteps.length - 1

            return (
              <button key={step.key} onClick={() => handleToggleProgress(step.key)} className="w-full group">
                <div className="flex items-center gap-3 py-2 px-2 rounded-lg transition-all hover:bg-muted/50">
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className={`size-8 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "bg-background border-2 border-muted-foreground/30 text-muted-foreground group-hover:border-primary/50"
                      }`}
                    >
                      {isCompleted ? <Check className="size-4" /> : <Icon className="size-4" />}
                    </div>
                  </div>

                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    {isCompleted && <p className="text-xs text-primary mt-0.5">완료됨</p>}
                  </div>

                  {isCompleted && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-xs px-2 py-0.5">
                      <Check className="size-3 mr-1" />
                      완료
                    </Badge>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1 bg-transparent" onClick={() => onOpenChange(false)}>
          <Pencil className="size-4 mr-2" />
          수정
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={() => {
            onDelete?.(localFigure.id)
            onOpenChange(false)
          }}
        >
          <Trash2 className="size-4 mr-2" />
          삭제
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader className="text-left mb-4">
            <SheetTitle>피규어 상세</SheetTitle>
            <SheetDescription>진행 상태를 클릭하여 변경할 수 있습니다</SheetDescription>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>피규어 상세</DialogTitle>
          <DialogDescription>진행 상태를 클릭하여 변경할 수 있습니다</DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  )
}
