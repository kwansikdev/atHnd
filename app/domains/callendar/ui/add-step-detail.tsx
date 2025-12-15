import { ArrowLeft, Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import { FigureDetailsForm } from "./figure-details-form";
import { useCalendarAddFormStore } from "../store";
import { useFieldArray, useForm } from "react-hook-form";

import { TFiguresWithQuery } from "~/routes/api.search.figures";
import { Database } from "supabase/schema";
import { StepType } from "~/routes/calendar.add";

import { Form as FormComponent } from "~/components/ui/form";
import { Form, useFetcher, useNavigate } from "@remix-run/react";
import { UserFigureInsertDto } from "../model";
import { useFetcherActionContext } from "~/hooks/use-fetcher-action-state";
import { useEffect } from "react";

export type AddFigureFormType = TFiguresWithQuery & {
  status: Database["public"]["Enums"]["user_figure_status"];
  shop_id: string;
  total_price: number;
  deposit_price?: number;
  deposit_paid_at?: string | null;
  balance_price?: number;
  paid_at?: string | null;
  payment_type?: string;
};

export function AddStepDetail({
  setStep,
}: {
  step: StepType;
  setStep: React.Dispatch<React.SetStateAction<StepType>>;
}) {
  const navigate = useNavigate();
  const { fetcher: fetcherAction, data: dataAction } = useFetcherActionContext<{
    isError?: boolean;
    success?: boolean;
  }>();
  const shopFetcher = useFetcher<{
    results: Array<{ value: string; label: string; parentId?: string }>;
  }>();
  const fetcher = useFetcher<
    {
      created_at: string | null;
      id: string;
      is_active: boolean | null;
      is_official: boolean | null;
      logo_url: string | null;
      name: string;
      name_en: string | null;
      region: string | null;
      url: string | null;
    }[]
  >();

  const { selectedFigures, setFigureShop, reset } = useCalendarAddFormStore();

  const form = useForm<{
    figures: AddFigureFormType[];
  }>({
    defaultValues: {
      figures: selectedFigures,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "figures",
  });

  const onSubmit = (data: { figures: AddFigureFormType[] }) => {
    const { figures } = data;

    const parsed = figures.map((figure) => ({
      deposit_paid_at: figure.deposit_paid_at,
      deposit_price: figure.deposit_price,
      paid_at: figure.paid_at,
      release_id: figure.id,
      shop_id: figure.shop_id,
      status: figure.status,
      total_price: figure.total_price,
      balance_price: figure.deposit_price
        ? figure.total_price - figure.deposit_price
        : undefined,
      figure_id: figure.detail.id,
    })) as UserFigureInsertDto[];

    const formData = new FormData();
    formData.append("figures", JSON.stringify(parsed));

    fetcherAction.submit(formData, {
      method: "post",
    });
  };

  useEffect(() => {
    if (shopFetcher.state === "idle" && !shopFetcher.data) {
      shopFetcher.load("/api/search?type=shop");
    }
  }, [shopFetcher]);

  useEffect(() => {
    if (shopFetcher.data) {
      setFigureShop(shopFetcher.data.results);
    }
  }, [fetcher.data, setFigureShop, shopFetcher.data]);

  useEffect(() => {
    if (dataAction?.success) {
      navigate("/");
      reset();
    }
  }, [dataAction?.success, navigate, reset]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">Enter Details for Each Figure</h2>
        <Button
          variant="outline"
          onClick={() => setStep("select")}
          className="gap-2"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>
      </div>

      <FormComponent {...form}>
        <Form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          navigate={false}
        >
          <div className="space-y-4">
            {fields.map((figure, index) => (
              <FigureDetailsForm
                key={figure.id}
                figure={figure}
                index={index}
                // details={figureDetails[figure.id]}
                // onUpdate={(details) => handleUpdateDetails(figure.id, details)}
              />
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setStep("select")}>
              Back
            </Button>
            <Button size="lg" type="submit" className="gap-2">
              <Check className="size-4" />
              등록({selectedFigures.length})
            </Button>
          </div>
        </Form>
      </FormComponent>
    </div>
  );
}
