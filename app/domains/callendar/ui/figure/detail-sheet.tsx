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
import { useOutletContext } from "@remix-run/react";
import type { TOutletContext } from "~/root";
import { getImageTransformation } from "~/shared/ui";

import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "~/utils";
import { Separator } from "~/components/ui/separator";

import { format } from "date-fns";
import { useFetcherActionState } from "~/hooks/use-fetcher-action-state";
import { MyFigureDto } from "~/shared/model";

import { FigureDetailSkeleton } from "./detail-skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { X } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { ko } from "date-fns/locale";
import { useForm, useFormContext, useWatch } from "react-hook-form";
import { Form, FormField } from "~/components/ui/form";
import { STATUS_DATE_STAGE, STATUS_STAGE, STATUS_TIMELINE } from "./contants";
import { useFigureStore } from "../../store";

interface Figure extends MyFigureDto {}

type TFigureDetailSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updated: TFormValues) => void;
};

type TFormValues = {
  total_price: number | null;
  paid_at: string | null;
  deposit_price: number | null;
  deposit_paid_at: string | null;
  balance_price: number | null;
  balance_paid_at: string | null;
  delivered_at: string | null;
};

export function FigureDetailSheet({
  open,
  onOpenChange,
  onUpdate,
}: TFigureDetailSheetProps) {
  const { deviceInfo } = useOutletContext() as TOutletContext;
  const isMobile = deviceInfo.isMobile;

  const { selectedFigure, setSelectedFigure, userFigureId, reset } =
    useFigureStore();

  const [fetchedId, setFetchedId] = useState<string | null>(null);
  const isDataValid = fetchedId === userFigureId;
  const isLoading = !isDataValid;
  const loadedFigure = isDataValid ? selectedFigure : null;

  const form = useForm<TFormValues>({
    defaultValues: {},
  });

  useEffect(() => {
    if (open && loadedFigure) {
      form.reset({
        deposit_price: loadedFigure.deposit_price,
        balance_price: loadedFigure.balance_price,
        total_price: loadedFigure.total_price,
        deposit_paid_at: loadedFigure.deposit_paid_at,
        balance_paid_at: loadedFigure.balance_paid_at,
        paid_at: loadedFigure.paid_at,
      });
    }
  }, [form, loadedFigure, open, reset]);

  // useEffect(() => {
  //   if (userFigureId && userFigureId !== fetchedId) {
  //     loaderFetcher.load(`/api/my/figure/${userFigureId}`);
  //   }
  // }, [userFigureId]);

  useEffect(() => {
    // if (loaderFetcher.state === "idle" && loaderFetcher.data) {
    //   setFetchedId(userFigureId);
    // }
    if (selectedFigure) {
      setFetchedId(userFigureId);
    }
  }, [selectedFigure, userFigureId]);

  useEffect(() => {
    if (!open) {
      reset();
      setFetchedId(null);
      form.reset();
    }
  }, [form, open, reset]);

  /* -------------------------------------------------------------------------- */
  const lastDoneIndex = useMemo(
    () =>
      STATUS_DATE_STAGE.reduce((acc, status, index) => {
        return loadedFigure?.[status as keyof Figure] ? index : acc;
      }, -1),
    [loadedFigure],
  );
  const currentIndex = lastDoneIndex + 1;
  const currentHistory = STATUS_TIMELINE[currentIndex];

  /* -------------------------------------------------------------------------- */
  // Update History
  const updateHistory = (data: TFormValues, stage: TStage) => {
    const filledData = fillDefaultValues(stage);
    const dirtyFields = form.formState.dirtyFields;
    const updated = (Object.keys(dirtyFields) as (keyof TFormValues)[]).reduce(
      (acc, key) => {
        if (key === "balance_paid_at") {
          acc["paid_at"] = data[key];
        }
        acc[key] = data[key] as never;

        if (key === "delivered_at") {
          acc["status"] = "owned";
        }
        return acc;
      },
      {} as TFormValues & Record<"status", MyFigureDto["status"]>,
    );
    handleSubmit({ ...filledData, ...updated });
  };

  const { fetcher: actionFetcher } = useFetcherActionState();
  const handleSubmit = async (updated: TFormValues) => {
    console.log("🚀 ~ handleSubmit ~ updated:", updated);

    return;
    if (!userFigureId) return;

    await actionFetcher.submit(JSON.stringify(updated), {
      method: "PATCH",
      encType: "application/json",
      action: `/api/my/figure/${userFigureId}`,
    });

    // onUpdate?.(updated);
    setSelectedFigure({ ...selectedFigure, ...updated } as MyFigureDto);
    onUpdate?.(updated);
  };

  // const validateRequiredFields = (stage: TStage): boolean => {
  //   const requiredKeys = REQUIRED_FIELDS[stage];
  //   const values = form.getValues();

  //   return requiredKeys.every((key) => {
  //     const value = values[key];
  //     return value !== null && value !== undefined && value !== "";
  //   });
  // };

  const fillDefaultValues = (stage: TStage) => {
    const today = format(new Date(), "yyyy-MM-dd");
    const requiredKeys = REQUIRED_FIELDS[stage];

    // requiredKeys.forEach((key) => {
    //   const value = form.getValues(key);
    //   if (!value && DATE_FIELDS.includes(key)) {
    //     form.setValue(key, today);
    //   }
    // });

    return requiredKeys.reduce((acc, key) => {
      const value = form.getValues(key);
      if (!value) acc[key] = today as never;
      return acc;
    }, {} as TFormValues);
  };

  const content = loadedFigure && (
    <>
      {/* 피규어 헤더 */}
      <div className="flex items-center gap-3 px-4 pt-4">
        <div className="relative size-16 flex-shrink-0 overflow-hidden bg-widget-color-bg-color-page0 rounded-2xl">
          <img
            src={
              getImageTransformation(
                loadedFigure.figure.detail.image[0]?.image_url as string,
                {
                  width: 96,
                  height: 96,
                  quality: 80,
                },
              ) || "/placeholder.svg"
            }
            alt={loadedFigure.figure.detail.name}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-[10px] text-widget-color-text-opacity-tertiary line-clamp-1">
            {loadedFigure.figure.detail.series?.name}
          </span>
          <span className="text-sm font-semibold line-clamp-1">
            {loadedFigure.figure.detail.name}
          </span>
          <span className="text-[10px] text-widget-color-text-opacity-tertiary line-clamp-1">
            {loadedFigure.figure.detail.manufacturer.name}
          </span>
        </div>
      </div>

      <Separator />

      {/* 타임라인 */}
      <div className="px-4 min-h-[236px]">
        <p className="text-xs font-bold tracking-widest uppercase mb-4">
          예약(구매) 히스토리
        </p>
        <div className="flex flex-col gap-0">
          {/* 예약금 */}
          {loadedFigure.deposit_paid_at && (
            <Step
              key={"step_deposit"}
              isDone={Boolean(loadedFigure.deposit_paid_at)}
              isCurrent={currentIndex === 0}
              label={"예약"}
              amount={
                <EditableAmount
                  name="deposit_price"
                  isDone={true}
                  isCurrent={false}
                />
              }
              dateNode={
                <EditableDate
                  name="deposit_paid_at"
                  isDone={true}
                  isCurrent={false}
                />
              }
            />
          )}

          {/* 잔금 */}
          {loadedFigure.deposit_paid_at && !loadedFigure.paid_at && (
            <Step
              key={"step_balance"}
              isDone={Boolean(loadedFigure.balance_paid_at)}
              isCurrent={currentIndex === 1}
              label={"잔금 결제"}
              amount={
                <EditableAmount
                  name="balance_price"
                  isDone={Boolean(loadedFigure.balance_paid_at)}
                  isCurrent={currentIndex === 1}
                />
              }
              dateNode={
                <EditableDate
                  name="balance_paid_at"
                  isCurrent={currentIndex === 1}
                  isDone={Boolean(loadedFigure.balance_paid_at)}
                />
              }
            />
          )}

          {/* 결제 */}
          <Step
            key={"step_payment"}
            isDone={Boolean(loadedFigure.paid_at)}
            isCurrent={currentIndex === 2}
            label={"결제"}
            amount={
              <EditableAmount
                name="total_price"
                isDone={Boolean(loadedFigure.paid_at)}
                isCurrent={currentIndex === 2}
              />
            }
            dateNode={
              <EditableDate
                name="paid_at"
                isCurrent={currentIndex === 2}
                isDone={Boolean(loadedFigure.paid_at)}
              />
            }
          />
          {/* 배송 */}
          <Step
            key={"step_delivery"}
            isDone={Boolean(loadedFigure.delivered_at)}
            isCurrent={currentIndex === 3}
            label={"소장"}
            dateNode={
              <EditableDate
                name="delivered_at"
                isCurrent={currentIndex === 3}
                isDone={Boolean(loadedFigure.delivered_at)}
              />
            }
            isLast={true}
          />
        </div>
      </div>

      <div className="text-center">
        <span className="text-[10px] text-widget-color-text-opacity-tertiary">
          📅 날짜를 설정하지 않으면 오늘({format(new Date(), "yyyy-MM-dd")})로
          자동 저장돼요
        </span>
        {/* 액션 버튼 */}
        <div className="p-4">
          {currentIndex !== STATUS_DATE_STAGE.length ? (
            <button
              type="submit"
              onClick={() => {
                const stage = STATUS_STAGE[currentIndex];
                form.handleSubmit((data) => updateHistory(data, stage))();
              }}
              className="w-full rounded-2xl text-[13px] font-semibold py-2 transition-all duration-200 bg-widget-color-fill-btn-default hover:bg-widget-color-fill-btn-hover active:bg-widget-color-fill-btn-pressed text-widget-color-ghost-black-95"
            >
              {currentHistory}
            </button>
          ) : (
            <div className="w-full rounded-2xl text-[13px] font-semibold py-2 text-center bg-widget-color-fill-btn-disabled text-widget-color-ghost-black-65">
              모든 단계 완료
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader hidden>
            <SheetTitle>피규어 예약 히스토리</SheetTitle>
            <SheetDescription>
              피규어 &apos;{loadedFigure?.figure.detail.name}&apos; 예약
              히스토리
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto p-0 min-h-[435px]">
        <DialogHeader hidden>
          <DialogTitle>피규어 예약 히스토리</DialogTitle>
          <DialogDescription>
            피규어 &apos;{loadedFigure?.figure.detail.name}&apos; 예약 히스토리
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>{isLoading ? <FigureDetailSkeleton /> : content}</Form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
const REQUIRED_FIELDS = {
  deposit: ["deposit_price", "deposit_paid_at"],
  balance: ["balance_price", "balance_paid_at"],
  ordered: ["total_price", "paid_at"],
  delivered: ["delivered_at"],
} as const satisfies Record<string, (keyof TFormValues)[]>;

type TStage = keyof typeof REQUIRED_FIELDS;

/* -------------------------------------------------------------------------- */
type StepProps = {
  key: string;
  isDone: boolean;
  isCurrent: boolean;
  label: string;
  dateNode: React.ReactNode;
  amount?: React.ReactNode;
  isLast?: boolean;
  active?: boolean;
};

function Step({
  key,
  isDone,
  isCurrent,
  label,
  amount,
  dateNode,
  isLast,
}: StepProps) {
  return (
    <div key={key} className="flex gap-3 mb-4">
      {/* 선 + 점 */}
      <div className="flex flex-col items-center w-5">
        <div
          className={cn(
            "rounded-full shrink-0 transition-all duration-300 w-2.5 h-2.5 mt-1 bg-widget-color-fill-opacity-3",
            isDone && "bg-widget-color-fill-opacity-65",
            isCurrent &&
              "ring-2 ring-widget-color-fill-color-primaryHighlight bg-widget-color-fill-color-primaryNormal",
          )}
        />
        {!isLast && (
          <div
            className={cn(
              "flex-1 w-px min-h-2 mt-1 bg-widget-color-fill-opacity-3",
              isDone && "bg-widget-color-fill-opacity-65",
              isCurrent && "bg-widget-color-fill-color-primaryNormal",
            )}
          />
        )}
      </div>

      {/* 텍스트 */}
      <div className="flex-1 flex justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1">
            <span
              className={cn(
                "text-xs text-widget-color-text-opacity-tertiary",
                isDone && "text-widget-color-text-opacity-secondary",
                isCurrent && "text-widget-color-text-primary-default",
              )}
            >
              {label}
            </span>
            <div
              className={cn(
                "text-[10px]",
                isDone && "text-widget-color-text-opacity-secondary",
                isCurrent && "text-widget-color-text-primary-default",
              )}
            >
              {dateNode}
            </div>
          </div>
        </div>

        {!isLast && (
          <div className="flex flex-col gap-1">
            <div className={cn("text-widget-color-text-opacity-tertiary")}>
              {amount}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type EditableType = {
  name: string;
  isDone: boolean;
  isCurrent: boolean;
};
//
function EditableDate({ name, isDone, isCurrent }: EditableType) {
  const { control } = useFormContext();
  const formDate = useWatch({ control, name });

  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <div className="relative flex items-center gap-4">
              <PopoverTrigger asChild>
                <button
                  id="date-picker"
                  className={cn(
                    "cursor-pointer border-b text-widget-color-text-opacity-secondary",
                    isCurrent &&
                      "text-[10px] text-widget-color-text-primary-default border-dashed border-widget-color-border-color-primary",
                    isDone && "border-transparent",
                  )}
                  disabled={!isCurrent}
                >
                  {isDone
                    ? field.value
                    : isCurrent
                      ? (field.value ?? "날짜 설정")
                      : "-"}
                </button>
              </PopoverTrigger>
              {isCurrent && field.value && (
                <button
                  onClick={() => {
                    field.onChange(null);
                  }}
                  className={cn(
                    "cursor-pointer rounded-[4px] p-0.5",
                    "bg-widget-color-fill-opacity-5 hover:bg-widget-color-fill-opacity-10 text-widget-color-ghost-black-95",
                  )}
                >
                  <X size={10} />
                </button>
              )}
            </div>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={formDate ? new Date(formDate) : undefined}
                onSelect={(selectedDate) => {
                  if (selectedDate) {
                    const dateString = format(selectedDate, "yyyy-MM-dd");
                    field.onChange(dateString);
                    setOpen(false);
                  }
                }}
                locale={ko}
                className="rounded-md border shadow-sm"
                captionLayout="dropdown"
                startMonth={new Date(2000, 1)}
                endMonth={new Date(2050, 12)}
                defaultMonth={new Date()}
              />
            </PopoverContent>
          </Popover>
        );
      }}
    />
  );
  // }
  // return (
  //   <button
  //     title={"클릭하여 날짜 수정"}
  //     className={cn(
  //       "text-[10px] shrink-0 text-widget-color-text-opacity-secondary border-b border-transparent",
  //     )}
  //     onClick={() => setEditing(true)}
  //     disabled={!isCurrent}
  //   >
  //     {isDone
  //       ? formDate
  //       : isCurrent
  //         ? formDate ||
  //           `📅 날짜를 설정하지 않으면 오늘(${format(new Date(), "yyyy-MM-dd")})로 자동 저장돼요.`
  //         : "-"}
  //   </button>
  // );
}

const formatKRW = (num: number) => "₩" + Number(num).toLocaleString("ko-KR");
const parseKRW = (str: string) => parseInt(str.replace(/[^0-9]/g, ""), 10) || 0;

function EditableAmount({ name, isDone, isCurrent }: EditableType) {
  const { control, getValues, setValue } = useFormContext();
  const amount = useWatch({ control, name: name });

  const [editing, setEditing] = useState(false);
  // const [raw, setRaw] = useState(String(amount));
  const inputRef = useRef<HTMLInputElement>(null);

  const commit = (onChange: void, price: number) => {
    setEditing(false);
    onChange;

    // const parsed = parseKRW(raw);
    // setRaw(String(parsed));
    if (name === "deposit_price" || name === "balance_price") {
      calculateTotalPrice(price);
    }
  };

  const calculateTotalPrice = (balance: number) => {
    const deposit = getValues("deposit_price");

    setValue("total_price", balance + deposit);
  };

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  if (!isCurrent) {
    return (
      <span
        className={cn(
          "text-xs",
          isDone && "text-widget-color-text-opacity-secondary",
        )}
      >
        {formatKRW(amount)}
      </span>
    );
  }

  if (editing) {
    return (
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <input
            ref={inputRef}
            value={field.value}
            onChange={(e) => {
              field.onChange(parseKRW(e.target.value));
            }}
            onBlur={(e) => {
              const price = parseKRW(e.target.value);
              commit(field.onChange(price), price);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commit(field.onChange(amount), amount);
              }
            }}
            className={cn(
              "w-28 bg-transparent text-sm text-right border-0 border-b-2 border-widget-color-border-color-primary outline-none py-0.5",
            )}
          />
        )}
      />
    );
  }

  return (
    <button
      onClick={() => setEditing((prev) => !prev)}
      onKeyUp={() => setEditing((prev) => !prev)}
      className={cn(
        "cursor-pointer",
        "text-xs text-widget-color-text-primary-default border-b border-dashed border-widget-color-border-color-primary",
      )}
    >
      {formatKRW(amount)}
    </button>
  );
}

// {visibleStatuses.map((s: string, idx: number) => {
//             const { label, dateKey, priceKey } = STATUS_TIMELINE[s];
//             const date = loadedFigure[
//               dateKey as keyof typeof loadedFigure
//             ] as string;
//             const price = loadedFigure[
//               priceKey as keyof typeof loadedFigure
//             ] as number;

//             const isDone = Boolean(date);
//             const isCurrent = idx === currentIndex;
//             const isLast = idx === visibleStatuses.length - 1;

//             return (
//               <div key={s} className="flex gap-3 mb-4">
//                 {/* 선 + 점 */}
//                 <div className="flex flex-col items-center w-5">
//                   <div
//                     className={cn(
//                       "rounded-full shrink-0 transition-all duration-300 w-2.5 h-2.5 mt-1 bg-widget-color-fill-opacity-3",
//                       isDone && "bg-widget-color-fill-opacity-65",
//                       isCurrent &&
//                         "ring-2 ring-widget-color-fill-color-primaryHighlight bg-widget-color-fill-color-primaryNormal",
//                     )}
//                   />
//                   {!isLast && (
//                     <div
//                       className={cn(
//                         "flex-1 w-px min-h-2 mt-1 bg-widget-color-fill-opacity-3",
//                         isDone && "bg-widget-color-fill-opacity-65",
//                         isCurrent && "bg-widget-color-fill-color-primaryNormal",
//                       )}
//                     />
//                   )}
//                 </div>

//                 {/* 텍스트 */}
//                 <div className="flex-1 flex justify-between">
//                   <div className="min-w-0 flex-1">
//                     <div className="flex flex-col gap-1">
//                       <span
//                         className={cn(
//                           "text-xs text-widget-color-text-opacity-tertiary",
//                           isDone && "text-widget-color-text-opacity-secondary",
//                           isCurrent && "text-widget-color-text-primary-default",
//                         )}
//                       >
//                         {label}
//                       </span>
//                       <span
//                         className={cn(
//                           "text-[10px] shrink-0 text-widget-color-text-opacity-secondary",
//                         )}
//                       >
//                         {isDone ? date : "-"}
//                       </span>
//                     </div>
//                   </div>

//                   {!isLast && (
//                     <div className="flex flex-col gap-1">
//                       <span
//                         className={cn(
//                           "text-xs text-widget-color-text-opacity-tertiary",
//                           isDone && "text-widget-color-text-opacity-secondary",
//                           isCurrent && "text-widget-color-text-primary-default",
//                         )}
//                       >
//                         {price ? `₩${price.toLocaleString()}` : "-"}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
