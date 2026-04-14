import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { useFetcherActionState } from "~/hooks/use-fetcher-action-state";
import { useUIScope } from "~/shared/contexts";

import { Form as FormProvider } from "~/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { SearchSection } from "./search-section";
import { SearchFigureDto, UserFigureInsertDto } from "~/domains/calendar/model";
import { useEffect, useState } from "react";
import { InsertSection } from "./insert-section";
import { useRevalidator } from "@remix-run/react";
import { cn } from "~/utils";
import { ArrowLeft } from "lucide-react";
import { Database } from "supabase/schema";
import { toast } from "sonner";

export type AddFormType = {
  selected: SearchFigureDto[];
  insert: Partial<UserFigureInsertDto & { payment_type: "deposit" | "full" }>[];
};

export function SheetSearchAdd() {
  const { isOpen, toggle, close } = useUIScope();

  // form
  const methods = useForm<AddFormType>({
    defaultValues: {
      selected: [],
      insert: [],
    },
  });

  const selected = useWatch({
    control: methods.control,
    name: "selected",
  });

  const [currentStep, setCurrentStep] = useState<"search" | "detail">("search");
  const toggleCurrentStep = (step: "search" | "detail") => setCurrentStep(step);

  // submit
  const { fetcher, isSuccess } = useFetcherActionState<{
    success: boolean;
    error?: string;
  }>();

  const revalidator = useRevalidator();
  const [wasSubmitting, setWasSubmitting] = useState(false);

  const onSubmit = async (data: AddFormType) => {
    const { insert } = data;

    const parsed = insert.map((data) => {
      const result = {
        paid_at: data.deposit_price ? undefined : data.paid_at,
        release_id: data.release_id,
        shop_id: data.shop_id,
        status: data.status,
        balance_price: data.deposit_price
          ? data.total_price! - data.deposit_price
          : undefined,
        deposit_paid_at: data.deposit_paid_at,
        deposit_price: data.deposit_price,
        total_price: data.total_price,
      } as Omit<
        Database["public"]["Tables"]["user_figure"]["Insert"],
        "figure_id" | "user_id"
      >;

      return result;
    });

    const formData = new FormData();
    formData.append("figures", JSON.stringify(parsed));

    setWasSubmitting(true);

    fetcher.submit(formData, {
      method: "POST",
      action: "/api/my/figure",
    });
  };

  useEffect(() => {
    if (isSuccess && wasSubmitting) {
      setWasSubmitting(false);
      toast.success("기록되었습니다 🥳");
      close();

      setTimeout(() => {
        revalidator.revalidate();
        setCurrentStep("search");
        methods.reset();
      }, 100);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, wasSubmitting]);

  return (
    <Sheet open={isOpen} onOpenChange={toggle}>
      <SheetContent className="w-2xl gap-0 transition-all">
        {isOpen && fetcher.state === "loading" && (
          <div className="absolute inset-0 bg-widget-color-bg-color-page0/50 z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-widget-color-border-color-primary" />
          </div>
        )}

        <SheetHeader className="border-b-[1px]">
          <SheetTitle>📝 내 피규어 기록하기</SheetTitle>
        </SheetHeader>

        <FormProvider {...methods}>
          <div className="flex-1 flex flex-col overflow-hidden py-4 space-y-4">
            {currentStep === "search" && <SearchSection />}
            {currentStep === "detail" && <InsertSection />}

            <div className="flex items-center gap-2 px-3">
              {currentStep === "search" ? (
                <button
                  type="button"
                  className={cn(
                    "w-full rounded-2xl text-[13px] font-semibold py-2 transition-all duration-200 cursor-pointer bg-widget-color-fill-btn-default hover:bg-widget-color-fill-btn-hover active:bg-widget-color-fill-btn-pressed text-widget-color-ghost-black-95",
                    "disabled:cursor-not-allowed disabled:text-widget-color-ghost-black-65 disabled:bg-widget-color-fill-btn-disabled",
                  )}
                  disabled={selected.length === 0}
                  onClick={() => {
                    const insert = selected.map((f) => ({
                      release_id: f.id,
                      figure_id: f.detail.id,
                      total_price: f.price.kr,
                    }));

                    methods.setValue("insert", insert);
                    toggleCurrentStep("detail");
                  }}
                >
                  다음 단계로 ({selected.length}개 선택)
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center p-2 rounded-2xl font-semibold cursor-pointer",
                      "bg-widget-color-fill-opacity-5 text-widget-color-text-opacity-secondary hover:bg-widget-color-fill-opacity-8 hover:text-widget-color-text-opacity-highlight",
                    )}
                    onClick={() => toggleCurrentStep("search")}
                  >
                    <ArrowLeft size={19} strokeWidth={3} />
                  </button>
                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-2xl text-[14px] font-semibold py-[7px] transition-all duration-200 bg-widget-color-fill-btn-default hover:bg-widget-color-fill-btn-hover active:bg-widget-color-fill-btn-pressed text-widget-color-ghost-black-95 cursor-pointer",
                      "disabled:cursor-not-allowed disabled:text-widget-color-ghost-black-65 disabled:bg-widget-color-fill-btn-disabled",
                    )}
                    // disabled={selected.length === 0}
                    // onClick={() => {
                    //   setCurrentStep("detail");
                    // }}
                    onClick={methods.handleSubmit(onSubmit)}
                  >
                    기록 완료
                  </button>
                </>
              )}
            </div>
          </div>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
