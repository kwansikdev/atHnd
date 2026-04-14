import { useFormContext, useWatch } from "react-hook-form";
import { AddFormType } from "./sheet";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { useMyFigureAddFormStore } from "~/domains/calendar/store";
import { InsertForm } from "./insert-form";

// type InsertSectionProp = {
//   close: () => void;
//   toggleCurrentStep: (step: "search" | "detail") => void;
// };

export function InsertSection() {
  const methods = useFormContext<AddFormType>();

  const selected = useWatch({
    control: methods.control,
    name: "selected",
  });

  const { setFigureShop } = useMyFigureAddFormStore();

  // shop load
  const shopFetcher = useFetcher<{
    results: Array<{ value: string; label: string; parentId?: string }>;
  }>();

  useEffect(() => {
    if (shopFetcher.state === "idle" && !shopFetcher.data) {
      shopFetcher.load("/api/search?type=shop");
    }
  }, [shopFetcher]);

  useEffect(() => {
    if (shopFetcher.data) {
      setFigureShop(shopFetcher.data.results);
    }
  }, [setFigureShop, shopFetcher.data]);

  return (
    <>
      <div className="flex-1">
        {selected.map((f, index) => (
          <InsertForm key={f.id} figure={f} index={index} />
        ))}
      </div>
    </>
  );
}
