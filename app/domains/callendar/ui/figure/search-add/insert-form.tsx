import { useFormContext, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { SearchFigureDto } from "~/domains/callendar/model";
import { getImageTransformation } from "~/shared/ui";
import { AddFormType } from "./sheet";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { cn } from "~/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Input } from "~/components/ui/input";
import { Database } from "supabase/schema";
import { useMemo, useState } from "react";
import { useMyFigureAddFormStore } from "~/domains/callendar/store";

type InsertFormProps = {
  figure: SearchFigureDto;
  index: number;
};

export function InsertForm({ figure, index }: InsertFormProps) {
  const { figureShop } = useMyFigureAddFormStore();
  const form = useFormContext<AddFormType>();

  const paymentStatus = useWatch({
    control: form.control,
    name: `insert.${index}.status`,
  });

  const paymentType = useWatch({
    control: form.control,
    name: `insert.${index}.payment_type`,
  }) as FigurePaymentType;

  const dateLabel = useMemo(() => {
    if (paymentStatus === "reserved") {
      return "예약일";
    } else if (paymentStatus === "ordered") {
      return "구매일";
    } else {
      return "소장일";
    }
  }, [paymentStatus]);

  const priceLabel = useMemo(() => {
    if (paymentStatus === "reserved") {
      return paymentType === "deposit" ? "예약금" : "전액";
    } else {
      return "결제 금액";
    }
  }, [paymentType, paymentStatus]);

  // Popover
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg bg-card/50 p-4">
      <div className="flex items-start gap-4">
        {/* Figure Info */}
        <div className="relative size-20 flex-shrink-0 overflow-hidden bg-widget-color-bg-color-page0">
          <img
            src={
              getImageTransformation(figure.detail.images[0].image_url, {
                width: 112,
                height: 112,
                quality: 80,
              }) || "/placeholder.svg"
            }
            alt={figure.detail.name}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform rounded-2xl"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-medium text-widget-color-text-opacity-tertiary">
              #{figure.id}
            </span>
          </div>
          <p className="text-sm font-semibold truncate text-widget-color-text-opacity-default">
            {figure.detail.name}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-widget-color-text-opacity-default">
              ₩ {figure.price.kr?.toLocaleString()}
            </span>
            <span className="text-[10px] text-widget-color-text-opacity-tertiary">
              {/* · */}|
            </span>
            <span className="text-[10px] text-widget-color-text-opacity-tertiary">
              {figure.detail.manufacturer.name}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
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
            name={`insert.${index}.status`}
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
                            ? "border-widget-color-border-color-primary bg-widget-color-fill-btn-default/10 text-widget-color-text-brand-default"
                            : "border-widget-color-border-opacity-default bg-widget-color-bg-color-page1 hover:bg-widget-color-fill-opacity-5",
                        )}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`status-${figure.id}-${option.value}`}
                          className="sr-only"
                        />
                        <div>
                          <div className="font-medium text-xs">
                            {option.label}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
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
              name={`insert.${index}.payment_type`}
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
                              ? "border-widget-color-border-color-primary bg-widget-color-fill-btn-default/10 text-widget-color-text-brand-default"
                              : "border-widget-color-border-opacity-default bg-widget-color-bg-color-page1 hover:bg-widget-color-fill-opacity-5"
                          }`}
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`payment-${figure.id}-${option.value}`}
                            className="sr-only"
                          />
                          <div>
                            <div className="font-medium text-xs">
                              {option.label}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
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
                "hidden",
            )}
          />
          <div className="space-y-2">
            <FormField
              control={form.control}
              name={
                paymentStatus === "reserved"
                  ? paymentType === "deposit"
                    ? `insert.${index}.deposit_paid_at`
                    : `insert.${index}.paid_at`
                  : `insert.${index}.paid_at`
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
                          className="w-full justify-between font-normal text-xs"
                        >
                          {field.value ? field.value : "날짜를 선택해 주세요."}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(selectedDate) => {
                            if (selectedDate) {
                              const dateString = format(
                                selectedDate,
                                "yyyy-MM-dd",
                              );
                              field.onChange(dateString);
                            }
                          }}
                          locale={ko}
                          className="rounded-md border shadow-sm"
                          captionLayout="dropdown"
                          startMonth={new Date(2000, 1)}
                          endMonth={new Date(2050, 12)}
                          defaultMonth={
                            field.value ? new Date(field.value) : new Date()
                          }
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
                    ? `insert.${index}.deposit_price`
                    : `insert.${index}.total_price`
                  : `insert.${index}.total_price`
              }
              defaultValue={figure.price.kr ?? 0}
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
                      className="text-xs!"
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
            name={`insert.${index}.shop_id`}
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
                            ? "border-widget-color-border-color-primary bg-widget-color-fill-btn-default/10 text-widget-color-text-brand-default"
                            : "border-widget-color-border-opacity-default bg-widget-color-bg-color-page1 hover:bg-widget-color-fill-opacity-5"
                        }`}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`shop-${figure.id}-${option.value}`}
                          className="sr-only"
                        />
                        <span className="font-medium text-xs">
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

const statusOptions: {
  value: Database["public"]["Enums"]["user_figure_status"];
  label: string;
  description: string;
}[] = [
  { value: "reserved", label: "예약", description: "Pre-ordered" },
  { value: "ordered", label: "구매", description: "Paid in full" },
  { value: "owned", label: "소장", description: "In collection" },
];

type FigurePaymentType = "deposit" | "full";
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
