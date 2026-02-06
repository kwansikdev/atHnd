"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { SearchableFigure, FigureStatus, PaymentType } from "@/lib/figure-data"
import Image from "next/image"

export type Shop = "amiami" | "goodsmile" | "hobbystock" | "animate" | "kotobukiya" | "surugaya" | "mandarake" | "other"

const shopOptions: { value: Shop; label: string }[] = [
  { value: "amiami", label: "AmiAmi" },
  { value: "goodsmile", label: "Good Smile" },
  { value: "hobbystock", label: "HobbyStock" },
  { value: "animate", label: "Animate" },
  { value: "kotobukiya", label: "Kotobukiya" },
  { value: "surugaya", label: "Suruga-ya" },
  { value: "mandarake", label: "Mandarake" },
  { value: "other", label: "Other" },
]

interface FigureDetailsFormProps {
  figure: SearchableFigure
  index: number
  details: {
    status: FigureStatus
    paymentType: PaymentType
    paidAmount: number
    date: string
    shop: Shop
  }
  onUpdate: (details: {
    status: FigureStatus
    paymentType: PaymentType
    paidAmount: number
    date: string
    shop: Shop
  }) => void
}

export function FigureDetailsForm({ figure, index, details, onUpdate }: FigureDetailsFormProps) {
  const statusOptions: { value: FigureStatus; label: string; description: string }[] = [
    { value: "reserved", label: "Reserved", description: "Pre-ordered" },
    { value: "purchased", label: "Purchased", description: "Paid in full" },
    { value: "owned", label: "Owned", description: "In collection" },
  ]

  const paymentTypeOptions: { value: PaymentType; label: string; description: string }[] = [
    { value: "deposit", label: "Deposit", description: "Partial upfront" },
    { value: "full", label: "Full", description: "Paid in full" },
    { value: "partial", label: "Partial", description: "Installment" },
  ]

  const getDateLabel = () => {
    switch (details.status) {
      case "reserved":
        return "Reservation Date"
      case "purchased":
        return "Purchase Date"
      case "owned":
        return "Acquisition Date"
    }
  }

  const getPaymentLabel = () => {
    switch (details.paymentType) {
      case "deposit":
        return "Deposit Amount"
      case "full":
        return "Total Paid"
      case "partial":
        return "Amount Paid"
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-4">
        {/* Figure Info */}
        <div className="relative size-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
          <Image src={figure.imageUrl || "/placeholder.svg"} alt={figure.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground">#{index}</span>
          </div>
          <h3 className="font-semibold truncate">{figure.name}</h3>
          <p className="text-sm text-muted-foreground">
            {figure.manufacturer} · ¥{figure.price.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Release:{" "}
            {new Date(figure.releaseDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5 mt-4 pt-4 border-t border-border">
        <div className="space-y-3">
          <Label>Status</Label>
          <RadioGroup
            value={details.status}
            onValueChange={(value: FigureStatus) => onUpdate({ ...details, status: value })}
            className="flex flex-wrap gap-2"
          >
            {statusOptions.map((option) => (
              <Label
                key={option.value}
                htmlFor={`status-${figure.id}-${option.value}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                  details.status === option.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                <RadioGroupItem value={option.value} id={`status-${figure.id}-${option.value}`} className="sr-only" />
                <div>
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Shop</Label>
          <RadioGroup
            value={details.shop}
            onValueChange={(value: Shop) => onUpdate({ ...details, shop: value })}
            className="flex flex-wrap gap-2"
          >
            {shopOptions.map((option) => (
              <Label
                key={option.value}
                htmlFor={`shop-${figure.id}-${option.value}`}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                  details.shop === option.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                <RadioGroupItem value={option.value} id={`shop-${figure.id}-${option.value}`} className="sr-only" />
                <span className="font-medium text-sm">{option.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label>Payment Type</Label>
          <RadioGroup
            value={details.paymentType}
            onValueChange={(value: PaymentType) => onUpdate({ ...details, paymentType: value })}
            className="flex flex-wrap gap-2"
          >
            {paymentTypeOptions.map((option) => (
              <Label
                key={option.value}
                htmlFor={`payment-${figure.id}-${option.value}`}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                  details.paymentType === option.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                <RadioGroupItem value={option.value} id={`payment-${figure.id}-${option.value}`} className="sr-only" />
                <div>
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Date and Amount - 기존 Input 유지 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`date-${figure.id}`}>{getDateLabel()}</Label>
            <Input
              id={`date-${figure.id}`}
              type="date"
              value={details.date}
              onChange={(e) => onUpdate({ ...details, date: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`amount-${figure.id}`}>{getPaymentLabel()} (¥)</Label>
            <Input
              id={`amount-${figure.id}`}
              type="number"
              value={details.paidAmount || ""}
              onChange={(e) => onUpdate({ ...details, paidAmount: Number.parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
