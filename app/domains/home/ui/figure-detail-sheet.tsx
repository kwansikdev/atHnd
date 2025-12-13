"use client";

import { useState, useEffect } from "react";

import {
  Check,
  Package,
  CreditCard,
  Truck,
  CircleDollarSign,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useIsMobile } from "~/hooks/use-is-mobile";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { UserFigureDto } from "../model/user-figure-dto";

interface FigureDetailSheetProps {
  figure: UserFigureDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (figure: UserFigureDto) => void;
  onDelete?: (figureId: string) => void;
}

export function FigureDetailSheet({
  figure,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: FigureDetailSheetProps) {
  const isMobile = useIsMobile();
  const [localFigure, setLocalFigure] = useState<UserFigureDto | null>(figure);
  const [editingField, setEditingField] = useState<
    "price" | "depositAmount" | null
  >(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (figure?.id !== localFigure?.id) {
      setLocalFigure(figure);
    }
  }, [figure, localFigure?.id]);

  useEffect(() => {
    if (!open) {
      setEditingField(null);
      setEditValue("");
    }
  }, [open]);

  if (!localFigure) {
    return null;
  }

  const handleStartEdit = (field: "price" | "depositAmount") => {
    setEditingField(field);
    setEditValue(
      String(
        field === "price"
          ? localFigure.total_price
          : localFigure.deposit_price || 0
      )
    );
  };

  const handleSaveEdit = () => {
    if (editingField && editValue) {
      const numValue =
        Number.parseInt(editValue.replace(/[^0-9]/g, ""), 10) || 0;
      const updated = { ...localFigure, [editingField]: numValue };
      setLocalFigure(updated);
      onUpdate?.(updated);
    }
    setEditingField(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleToggleProgress = (field: keyof UserFigureDto) => {
    const updated = { ...localFigure, [field]: !localFigure[field] };
    setLocalFigure(updated);
    onUpdate?.(updated);
  };

  const progressSteps = [
    {
      key: "deposit" as const,
      label: "예약금 결제",
      icon: CircleDollarSign,
      show: !!figure?.deposit_price,
    },
    {
      key: "balance" as const,
      label: "잔금 결제",
      icon: CreditCard,
      show: true,
    },
    {
      key: "full" as const,
      label: "전액 결제",
      icon: CreditCard,
      show: true,
    },
    {
      key: "released" as const,
      label: "발매 완료",
      icon: Package,
      show: true,
    },
    {
      key: "delivered" as const,
      label: "배송 완료",
      icon: Truck,
      show: true,
    },
  ].filter((step) => step.show);

  function getPaymentStatus(uf: UserFigureDto) {
    if (uf.paid_at) return "full_paid";
    if (uf.deposit_paid_at && uf.balance_paid_at) return "deposit_and_balance";
    if (uf.deposit_paid_at) return "deposit_only";
    return "none";
  }

  const statusLabels = {
    reserved: "예약",
    ordered: "구매 완료",
    owned: "소장",
  };

  const statusColors = {
    reserved: "bg-primary text-primary-foreground",
    ordered: "bg-chart-5 text-white",
    owned: "bg-muted text-muted-foreground",
  };

  const content = (
    <div className="flex flex-col gap-6 px-4">
      {/* Figure Info */}
      <div className="flex gap-4">
        <div className="relative size-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
          <img
            src={
              localFigure.figure.detail.image[0].image_url || "/placeholder.svg"
            }
            alt={localFigure.figure.detail.name}
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base line-clamp-2 mb-1">
            {localFigure.figure.detail.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            {localFigure.figure.detail.manufacturer.name}
          </p>
          <Badge className={statusColors[localFigure.status]}>
            {statusLabels[localFigure.status]}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground mb-1">출시일</p>
          <p className="font-medium">
            {new Date(localFigure.figure.release_text).toLocaleDateString(
              "ko-KR",
              {
                year: "numeric",
                month: "long",
              }
            )}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1">가격</p>
          {editingField === "price" ? (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">₩</span>
              <Input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") handleCancelEdit();
                }}
                className="h-7 w-24 px-2 text-sm"
                // autoFocus
              />
              <Button
                size="icon"
                variant="ghost"
                className="size-7"
                onClick={handleSaveEdit}
              >
                <Check className="size-3" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="size-7"
                onClick={handleCancelEdit}
              >
                <X className="size-3" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => handleStartEdit("price")}
              className="font-medium flex items-center gap-1 hover:text-primary transition-colors group"
            >
              ₩{localFigure.total_price.toLocaleString()}
              <Pencil className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>
        {localFigure.purchase_site && (
          <div>
            <p className="text-muted-foreground mb-1">구매처</p>
            <p className="font-medium">{localFigure.purchase_site.name}</p>
          </div>
        )}
        {/* {localFigure.paymentType && (
          <div>
            <p className="text-muted-foreground mb-1">결제 방식</p>
            <p className="font-medium">
              {localFigure.paymentType === "deposit" && "예약금"}
              {localFigure.paymentType === "full" && "전액 결제"}
              {localFigure.paymentType === "partial" && "일부 결제"}
            </p>
          </div>
        )} */}
        {/* {(localFigure.paymentType === "deposit" ||
          localFigure.paymentType === "partial") &&
          localFigure.depositAmount && (
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
                      if (e.key === "Enter") handleSaveEdit();
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    className="h-7 w-24 px-2 text-sm"
                    // autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    onClick={handleSaveEdit}
                  >
                    <Check className="size-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-7"
                    onClick={handleCancelEdit}
                  >
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
          )} */}
      </div>

      <Separator />

      {/* Progress Tracking */}
      <div>
        <h4 className="font-semibold mb-4">진행 상태</h4>
        <div className="space-y-3">
          {/* {progressSteps.map((step, index) => {
            const isCompleted = localFigure[step.key] === true;
            const Icon = step.icon;

            return (
              <button
                key={step.key}
                onClick={() => handleToggleProgress(step.key)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isCompleted
                    ? "bg-primary/10 border-primary"
                    : "bg-muted/30 border-transparent hover:border-muted-foreground/20"
                }`}
              >
                <div
                  className={`size-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="size-4" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </div>
                <span
                  className={`flex-1 text-left ${
                    isCompleted ? "font-medium" : ""
                  }`}
                >
                  {step.label}
                </span>
                {isCompleted && (
                  <Badge variant="outline" className="text-xs">
                    완료
                  </Badge>
                )}
              </button>
            );
          })} */}
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 bg-transparent"
          onClick={() => onOpenChange(false)}
        >
          <Pencil className="size-4 mr-2" />
          수정
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={() => {
            onDelete?.(localFigure.id);
            onOpenChange(false);
          }}
        >
          <Trash2 className="size-4 mr-2" />
          삭제
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader className="text-left mb-4">
            <SheetTitle>피규어 상세</SheetTitle>
            <SheetDescription>
              진행 상태를 클릭하여 변경할 수 있습니다
            </SheetDescription>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>피규어 상세</DialogTitle>
          <DialogDescription>
            진행 상태를 클릭하여 변경할 수 있습니다
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}
