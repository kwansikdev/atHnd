import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { data, useNavigate } from "@remix-run/react";
import { AddStepSelect } from "~/domains/callendar/ui";
import { AddStepDetail } from "~/domains/callendar/ui/add-step-detail";
import { useCalendarAddFormStore } from "~/domains/callendar/store";
import { ActionFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "supabase/supabase-service";
import { UserFigureInsertDto } from "~/domains/callendar/model";
import { FetcherActionProvider } from "~/hooks/use-fetcher-action-state";

export type StepType = "select" | "details";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();

  const figures = body.get("figures");
  const parsed = JSON.parse(figures as string);

  const { supabase } = await getSupabaseServerClient(request);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return data({ error: authError?.message }, { status: authError?.status });
  }

  const _parsed = parsed.map((data: UserFigureInsertDto) => ({
    ...data,
    user_id: user.id,
  }));

  const response = await supabase.from("user_figure").insert(_parsed).select();

  if (response.error) {
    return data({ isError: true });
  }

  return data({ success: true });
}

export default function CalendarAdd() {
  const navigate = useNavigate();
  const { selectedFigures } = useCalendarAddFormStore();

  const [step, setStep] = useState<StepType>("select");

  return (
    <main>
      {/* header */}
      <div className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">Add Figures</h1>
              <p className="text-xs text-muted-foreground">
                {step === "select"
                  ? "Step 1: Select figures"
                  : "Step 2: Enter details"}
              </p>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2">
            <div
              className={`size-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "select"
                  ? "bg-white text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <div className="w-8 h-0.5 bg-border" />
            <div
              className={`size-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === "details"
                  ? "bg-white text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
          </div>
        </div>
      </div>

      {/* main contents */}
      <div className="container mx-auto px-4 py-6">
        {/* <FetcherActionProvider> */}
        <div className="space-y-2">
          <div className="max-w-2xl mx-auto space-y-6">
            {step === "select" ? (
              <AddStepSelect />
            ) : (
              <FetcherActionProvider
                options={{
                  successMessage: "캘린더에 잘 넣어뒀어요! ✨",
                  errorMessage:
                    "앗! 캘린더에 추가하지 못했어요 😢 다시 시도해 주세요.",
                }}
              >
                <AddStepDetail {...{ step, setStep }} />
              </FetcherActionProvider>
            )}
            {/* Next Button */}
            {step === "select" && (
              <div className="flex justify-end">
                <Button
                  size="lg"
                  disabled={selectedFigures.length === 0}
                  onClick={() => setStep("details")}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        {/* </FetcherActionProvider> */}
      </div>
    </main>
  );
}
