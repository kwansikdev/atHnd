/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
"use client";

import { useState, useEffect } from "react";

import {
  Check,
  CreditCard,
  Pencil,
  Trash2,
  X,
  Archive,
  ShoppingBag,
  CalendarClock,
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
import { cn } from "~/utils";
import { getImageTransformation } from "~/shared/ui";
import { useFetcherActionState } from "~/hooks/use-fetcher-action-state";
import { format } from "date-fns";

interface Figure extends UserFigureDto {}

interface FigureDetailSheetProps {
  figure: UserFigureDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
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
  const { fetcher } = useFetcherActionState();
  const [localFigure, setLocalFigure] = useState<Figure | null>(figure);
  const [editingField, setEditingField] = useState<
    "balanceAmount" | "depositAmount" | null
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

  const handleStartEdit = (field: "balanceAmount" | "depositAmount") => {
    if (!localFigure) return;
    setEditingField(field);

    if (field === "balanceAmount") {
      const balance =
        localFigure.total_price - (localFigure.deposit_price || 0);
      setEditValue(String(balance));
    } else {
      setEditValue(String(localFigure?.deposit_price || 0));
    }
  };

  const handleSaveEdit = () => {
    if (!localFigure) return;

    if (editingField && editValue) {
      const numValue =
        Number.parseInt(editValue.replace(/[^0-9]/g, ""), 10) || 0;
      const updated = { ...localFigure } as Figure;

      if (editingField === "balanceAmount") {
        // Balance amount updates total price
        updated.balance_price = numValue;
        updated.total_price = numValue + updated.deposit_price;
      } else {
        updated.deposit_price = numValue;
      }

      setLocalFigure(updated);
      // onUpdate?.();

      const submit = {
        id: localFigure.id,
      } as Record<string, unknown>;

      if (editingField === "balanceAmount") {
        submit.balance_price = numValue;
        submit.total_price = numValue + (localFigure.deposit_price || 0);
      } else {
        submit.deposit_price = numValue;
      }

      handleSubmit({
        ...submit,
      });
    }
    setEditingField(null);
    setEditValue("");
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const handleToggleProgress = (
    field: keyof Pick<
      Figure,
      "balance_paid_at" | "deposit_paid_at" | "paid_at" | "delivered_at"
    >
  ) => {
    const updated = {
      ...localFigure,
    } as Figure;

    const updataFieldValue = localFigure![field]
      ? ""
      : format(new Date(), "yyyy-MM-dd");
    updated[field] = updataFieldValue;

    setLocalFigure(updated);

    const data = { [field]: updataFieldValue ? updataFieldValue : null };
    if (field === "delivered_at") data["status"] = "owned";
    if (field === "balance_paid_at") data["paid_at"] = updataFieldValue;

    handleSubmit(data);
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (!localFigure) return;

    fetcher.submit(JSON.stringify({ id: localFigure?.id, ...data }), {
      method: "PATCH",
      encType: "application/json",
      action: "/api/user/figure",
    });

    onUpdate?.();
  };

  // useEffect(() => {
  //   if (isSuccess) {
  //     onOpenChange(false);
  //     setLocalFigure(null);
  //   }
  // }, [isSuccess, onOpenChange]);

  useEffect(() => {
    if (!open) setLocalFigure(null);
  }, [open]);

  /** content */
  const content = (
    <div className="flex flex-col gap-6 px-4">
      {/* Figure Info */}
      <div className="flex gap-4">
        <div className="relative size-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
          <img
            src={
              (localFigure &&
                getImageTransformation(
                  localFigure.figure.detail.image[0].image_url,
                  {
                    width: 96,
                    height: 96,
                    quality: 80,
                  }
                )) ||
              "/placeholder.svg"
            }
            alt={localFigure?.figure.detail.name}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base line-clamp-2 mb-1">
            {localFigure?.figure.detail.name}
          </h3>
          <div className="flex items-center gap-2 mb-2 h-5">
            <p className="text-sm text-muted-foreground">
              {localFigure?.figure.detail.manufacturer.name}
            </p>
            <Separator orientation="vertical" />
            {localFigure && (
              <>
                <p className="text-sm text-muted-foreground">
                  {new Date(localFigure.figure.release_text).toLocaleDateString(
                    "ko-KR",
                    {
                      year: "numeric",
                      month: "long",
                    }
                  )}{" "}
                  발매
                </p>
              </>
            )}
          </div>
          {localFigure && (
            <div className="flex items-center justify-between gap-2">
              <Badge className={statusColors[localFigure.status]}>
                {statusLabels[localFigure.status]}
              </Badge>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        {localFigure?.purchase_site && (
          <div>
            <p className="text-muted-foreground mb-1">구매처</p>
            <p className="font-medium">{localFigure.purchase_site.name}</p>
          </div>
        )}
        <div>
          <p className="text-muted-foreground mb-1">총 가격</p>
          <p className="font-medium">
            ₩{localFigure?.total_price.toLocaleString()}
          </p>
        </div>
      </div>

      <Separator />

      {/* Progress Tracking */}
      <div>
        <h4 className="font-semibold mb-4">진행 상태</h4>
        <div className="relative space-y-1">
          {/* Timeline line */}
          <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/20 via-primary/20 to-transparent" />

          {/* 예약금 */}
          {localFigure && localFigure.deposit_price !== 0 && (
            <div className="w-full group space-y-1">
              <div
                className={cn(
                  "flex items-center gap-3 py-2 px-2 rounded-lg transition-all ",
                  localFigure.deposit_paid_at
                    ? "bg-primary/10 border-primary"
                    : "bg-muted/30 border-transparent hover:border-muted-foreground/20 hover:bg-muted/50"
                )}
              >
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center transition-all",
                      "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    )}
                  >
                    <CalendarClock className="size-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 flex items-center text-left gap-2">
                  <p className={cn("font-medium", "text-foreground")}>예약</p>
                </div>
                <p className={cn("font-medium", "text-foreground")}>
                  ₩{(localFigure.deposit_price as number).toLocaleString()}
                </p>

                {localFigure.deposit_paid_at && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-0 text-xs px-2 py-0.5"
                  >
                    <Check className="size-3 mr-1" />
                    {localFigure.deposit_paid_at}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* 잔금 */}
          {localFigure && localFigure.balance_price !== 0 && (
            <button
              className="w-full group"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleToggleProgress("balance_paid_at");
              }}
            >
              <div
                className={cn(
                  "flex items-center gap-3 py-2 px-2 rounded-lg transition-all",
                  localFigure.balance_paid_at
                    ? "bg-primary/10 border-primary"
                    : "bg-muted/30 border-transparent hover:border-muted-foreground/20 hover:bg-muted/50"
                )}
              >
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center transition-all",
                      "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    )}
                  >
                    <CreditCard className="size-4 text-white" />
                  </div>
                </div>

                <div className="flex-1 flex items-center text-left gap-2">
                  <p className={cn("font-medium", "text-foreground")}>잔금</p>
                </div>
                {editingField === "balanceAmount" ? (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">₩</span>
                    <Input
                      type="text"
                      // value={editValue}
                      defaultValue={localFigure.balance_price}
                      onChange={(e) => {
                        setEditValue(e.target.value);
                      }}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === "Enter") handleSaveEdit();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="h-7 w-24 px-2 text-sm"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSaveEdit();
                      }}
                    >
                      <Check className="size-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-7"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelEdit();
                      }}
                    >
                      <X className="size-3" />
                    </Button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEdit("balanceAmount");
                    }}
                    className="font-medium flex items-center gap-1 hover:text-primary transition-colors group"
                  >
                    ₩
                    {(
                      localFigure.total_price - localFigure.deposit_price
                    ).toLocaleString()}
                    <Pencil className="size-3 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}

                {localFigure?.balance_paid_at && (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-0 text-xs px-2 py-0.5"
                  >
                    <Check className="size-3 mr-1" />
                    {localFigure.balance_paid_at}
                  </Badge>
                )}
              </div>
            </button>
          )}

          {/* 전액 */}
          <div className="w-full group">
            <div
              className={cn(
                "flex items-center gap-3 py-2 px-2 rounded-lg transition-all",
                localFigure?.paid_at
                  ? "bg-primary/10 border-primary"
                  : "bg-muted/30 border-transparent hover:border-muted-foreground/20 hover:bg-muted/50"
              )}
            >
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center transition-all",
                    "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  )}
                >
                  {localFigure?.status === "reserved" ? (
                    <CreditCard className="size-4 text-white" />
                  ) : (
                    <ShoppingBag className="size-4 text-white" />
                  )}
                </div>
              </div>

              <div className="flex-1 flex items-center text-left gap-2">
                <p className={cn("font-medium", "text-foreground")}>
                  {localFigure?.status === "ordered" ? "전액" : "구매"}
                </p>
                {/* <span className={cn("font-medium", "text-foreground")}>
                  ₩{(localFigure?.total_price as number).toLocaleString()}
                </span> */}
              </div>

              {localFigure?.paid_at && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-0 text-xs px-2 py-0.5"
                >
                  <Check className="size-3 mr-1" />
                  {localFigure?.paid_at}
                </Badge>
              )}
            </div>
          </div>

          {/* 소장 (완료) */}
          <div
            className="w-full group"
            onClick={() => handleToggleProgress("delivered_at")}
          >
            <div
              className={cn(
                "flex items-center gap-3 py-2 px-2 rounded-lg transition-all",
                localFigure?.delivered_at
                  ? "bg-primary/10 border-primary"
                  : "bg-muted/30 border-transparent hover:border-muted-foreground/20 hover:bg-muted/50"
              )}
            >
              <div className="relative z-10 flex-shrink-0">
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center transition-all",
                    "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  )}
                >
                  <Archive className="size-4 text-white" />
                </div>
              </div>

              <div className="flex-1 flex items-center text-left gap-2">
                <p className={cn("font-medium", "text-foreground")}>소장</p>
              </div>

              {localFigure?.delivered_at && (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-0 text-xs px-2 py-0.5"
                >
                  <Check className="size-3 mr-1" />
                  {localFigure?.delivered_at}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1 bg-transparent"
          onClick={() => {
            localFigure && onDelete?.(localFigure.id);
            onOpenChange(false);
            onUpdate?.();
          }}
        >
          <Trash2 className="size-4 mr-2" />
          삭제
        </Button>
        {/* <Button variant="default" className="flex-1 " onClick={handleSubmit}>
          <Pencil className="size-4 mr-2" />
          수정
        </Button> */}
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

const statusLabels = {
  reserved: "예약",
  ordered: "구매 완료",
  owned: "소장",
};

const statusColors = {
  reserved: "bg-primary text-white",
  ordered: "bg-chart-5 text-white",
  owned: "bg-muted text-muted-foreground",
};
