"use client";

import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

import { useFormContext, useWatch } from "react-hook-form";
import { cn } from "~/utils";
import { AddFigureFormType } from "./add-step-detail";
import { useMemo, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Database } from "supabase/schema";
import { useCalendarAddFormStore } from "../store";
import { ko } from "date-fns/locale";

type FigurePaymentType = "deposit" | "full";
interface FigureDetailsFormProps {
  figure: AddFigureFormType;
  index: number;
}

export function FigureDetailsForm({ figure, index }: FigureDetailsFormProps) {
  const { figureShop } = useCalendarAddFormStore();

  const form = useFormContext();
  const statusOptions: {
    value: Database["public"]["Enums"]["user_figure_status"];
    label: string;
    description: string;
  }[] = [
    { value: "reserved", label: "예약", description: "Pre-ordered" },
    { value: "ordered", label: "구매", description: "Paid in full" },
    { value: "owned", label: "소장", description: "In collection" },
  ];

  const paymentTypeLabels: {
    value: FigurePaymentType;
    label: string;
    description: string;
  }[] = [
    {
      value: "deposit",
      label: "예약금",
      description: "Partial upfront",
    },
    { value: "full", label: "전액", description: "Paid in full" },
  ];

  const paymentStatus = useWatch({
    control: form.control,
    name: `figures.${index}.status`,
  });

  const paymentType = useWatch({
    control: form.control,
    name: `figures.${index}.payment_type`,
  }) as FigurePaymentType;

  const priceLabel = useMemo(() => {
    if (paymentStatus === "reserved") {
      return paymentType === "deposit" ? "예약금" : "전액";
    } else {
      return "결제 금액";
    }
  }, [paymentType, paymentStatus]);

  const dateLabel = useMemo(() => {
    if (paymentStatus === "reserved") {
      return "예약일";
    } else if (paymentStatus === "ordered") {
      return "구매일";
    } else {
      return "소장일";
    }
  }, [paymentStatus]);

  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg bg-card/50 p-4">
      <div className="flex items-start gap-4">
        {/* Figure Info */}
        <div className="relative size-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
          <img
            src={figure.detail.images[0].image_url || "/placeholder.svg"}
            alt={figure.detail.name}
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              #{figure.id}
            </span>
          </div>
          <h3 className="font-semibold truncate">{figure.detail.name}</h3>
          <p className="text-sm text-muted-foreground">
            {figure.detail.manufacturer.name} · ₩
            {figure.price.kr?.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            발매일:{" "}
            {new Date(figure.release.text).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5 mt-4 pt-4 border-t border-border">
        <div className="flex flex-col gap-4 space-y-2">
          <FormField
            control={form.control}
            name={`figures.${index}.status`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>결제 상태</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    defaultValue={undefined}
                    onValueChange={field.onChange}
                    className="flex flex-wrap gap-2"
                  >
                    {statusOptions.map((option) => (
                      <Label
                        key={option.value}
                        htmlFor={`status-${figure.id}-${option.value}`}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors",
                          field.value === option.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background hover:bg-muted"
                        )}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`status-${figure.id}-${option.value}`}
                          className="sr-only"
                        />
                        <div>
                          <div className="font-medium text-sm">
                            {option.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {option.description}
                          </div>
                        </div>
                      </Label>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {paymentStatus === "reserved" && (
            <FormField
              control={form.control}
              name={`figures.${index}.payment_type`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel hidden>결제 상태</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-wrap gap-2"
                    >
                      {paymentTypeLabels.map((option) => (
                        <Label
                          key={option.value}
                          htmlFor={`payment-${figure.id}-${option.value}`}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors ${
                            field.value === option.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background hover:bg-muted"
                          }`}
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`payment-${figure.id}-${option.value}`}
                            className="sr-only"
                          />
                          <div>
                            <div className="font-medium text-sm">
                              {option.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {option.description}
                            </div>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Date and Amount */}
        <div className={cn("relative grid grid-cols-1 md:grid-cols-2 gap-4")}>
          <div
            className={cn(
              "absolute top-[-10px] left-[-10px] right-[-10px] bottom-[-10px] bg-muted/50 rounded-lg",
              ((paymentStatus === "reserved" && paymentType) ||
                paymentStatus !== "reserved") &&
                "hidden"
            )}
          />
          <div className="space-y-2">
            <FormField
              control={form.control}
              name={
                paymentStatus === "reserved"
                  ? paymentType === "deposit"
                    ? `figures.${index}.deposit_paid_at`
                    : `figures.${index}.paid_at`
                  : `figures.${index}.paid_at`
              }
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dateLabel}</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date-picker"
                          className="w-full justify-between font-normal"
                        >
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "날짜를 선택해 주세요."}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(selectedDate) => {
                            field.onChange(selectedDate);
                          }}
                          locale={ko}
                          className="rounded-md border shadow-sm"
                          captionLayout="dropdown"
                          startMonth={new Date(2000, 1)}
                          endMonth={new Date(2050, 12)}
                          defaultMonth={field.value || new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={form.control}
              name={
                paymentStatus === "reserved"
                  ? paymentType === "deposit"
                    ? `figures.${index}.deposit_price`
                    : `figures.${index}.total_price`
                  : `figures.${index}.total_price`
              }
              defaultValue={figure.price.kr?.toString() ?? "0"}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`figure_price_${figure.id}`}>
                    {priceLabel}(₩)
                  </FormLabel>
                  <FormControl>
                    <Input
                      id={`figure_price_${figure.id}`}
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.valueAsNumber || 0)
                      }
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="space-y-3">
          <FormField
            control={form.control}
            name={`figures.${index}.shop_id`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>구매처</FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    defaultValue={undefined}
                    onValueChange={field.onChange}
                    className="flex flex-wrap gap-2"
                  >
                    {figureShop?.map((option) => (
                      <Label
                        key={option.value}
                        htmlFor={`shop-${figure.id}-${option.value}`}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                          field.value === option.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-background hover:bg-muted"
                        }`}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`shop-${figure.id}-${option.value}`}
                          className="sr-only"
                        />
                        <span className="font-medium text-sm">
                          {option.label}
                        </span>
                      </Label>
                    ))}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
