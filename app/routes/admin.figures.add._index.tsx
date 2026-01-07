import { zodResolver } from "@hookform/resolvers/zod";
import { ActionFunctionArgs, data } from "@remix-run/node";
import { Form as RemixForm } from "@remix-run/react";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { getSupabaseServerClient } from "supabase/supabase-service";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";

import { AddFigureForm } from "~/domains/admin/ui/add-figure-form";
import { uploadFigureImages } from "~/domains/admin/utils/upload-figure-images";
import { useFetcherActionState } from "~/hooks/use-fetcher-action-state";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import { UploadProgress } from "~/utils/upload-batch";
// import { ImageItem } from "~/shared/ui/image-uploader";

export type TInitialFormData = z.infer<typeof figureSchema>;

export const figureSchema = z.object({
  p_name: z.string().min(1, "Name is required"),
  p_series_id: z.string().min(1, "Series is required"),
  p_character_id: z.string().min(1, "Character is required"),
  p_manufacturer_id: z.string().min(1, "Manufacturer is required"),
  p_category_id: z.string().min(1, "Category is required"),
  p_scale_id: z.string().min(1, "Scale is required"),
  p_price_kr: z.number().min(0, "Price is required"),
  p_release_date: z.date().nullable(),
  p_release_precision: z
    .enum(["year", "quarter", "month", "day", "unknown"])
    .default("unknown")
    .optional(),
  p_is_reissue: z.boolean().optional(),
  images: z.array(
    z.object({
      id: z.string(),
      url: z.string(),
      file: z.instanceof(File).optional(),
      isThumbnail: z.boolean(),
      sortOrder: z.number().optional(),
    })
  ),
});

const initialFormSchema = z.object({
  figures: z.array(figureSchema).min(1, "At least one figure required"),
});

export type TAdminFigureAddForm = z.infer<typeof initialFormSchema>;

export const initialFormData: TInitialFormData = {
  p_name: "",
  p_series_id: "",
  p_character_id: "",
  p_manufacturer_id: "",
  p_category_id: "",
  p_scale_id: "",
  p_price_kr: 0,
  p_release_date: null,
  p_release_precision: "unknown" as const,
  // optional
  images: [],
};

export async function action({ request }: ActionFunctionArgs) {
  const jsonData = await request.text();
  const { figures } = JSON.parse(jsonData) as TAdminFigureAddForm;
  const { supabase } = await getSupabaseServerClient(request);

  try {
    const results = await Promise.all(
      figures.map(async (figure) => {
        if (!figure.p_release_date) return;
        // const year = new Date(figure.p_release_date)?.getFullYear();
        // const month = new Date(figure.p_release_date)?.getMonth() + 1;

        const p_release_date = new Date(
          figure.p_release_date
        ).toLocaleDateString("sv-SE");

        const { data: figureId, error } = await supabase.rpc(
          "register_figure",
          {
            p_name: figure.p_name,
            p_series_id: figure.p_series_id,
            p_character_id: figure.p_character_id,
            p_manufacturer_id: figure.p_manufacturer_id,
            p_category_id: figure.p_category_id,
            p_scale_id: figure.p_scale_id,
            p_price_kr: figure.p_price_kr,
            // p_release_year: year,
            // p_release_month: month,
            p_release_date,
            p_release_precision: figure.p_release_precision ?? "unknown",
            p_is_reissue: figure.p_is_reissue,
            p_images: figure.images
              .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
              .map((img) => ({
                url: img.url,
                is_thumbnail: img.isThumbnail,
              })) as unknown as JSON,
          }
        );

        if (error) throw error;
        return figureId;
      })
    );

    return data({ success: true, figureIds: results });
  } catch (error) {
    console.error("Action error:", error);
    return data(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    );
  }
}

export default function AdminFigureAdd() {
  const { envs } = useRootLoaderData();
  const options = useMemo(
    () => ({
      showToast: true,
      successMessage: "Figure added successfully!",
      errorMessage: "Failed to add figure. Please try again.",
    }),
    []
  );
  const { fetcher, isSuccess } = useFetcherActionState(options);
  const [, setUploadProgress] = useState<UploadProgress>({});

  const form = useForm<TAdminFigureAddForm>({
    resolver: zodResolver(initialFormSchema),
    defaultValues: {
      figures: [initialFormData],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "figures",
  });

  const onSubmit = async (data: TAdminFigureAddForm) => {
    const { figures } = data;

    try {
      const updatedFigures = await uploadFigureImages(
        figures,
        "figures",
        setUploadProgress,
        envs.SUPABASE_URL
      );

      toast.success("All images uploaded successfully!");

      // DB 저장
      fetcher.submit(JSON.stringify({ figures: updatedFigures }), {
        method: "post",
        encType: "application/json",
      });
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      // ❌ 업로드 실패 시 여기로 와서 fetcher.submit은 실행 안 됨
      // toast.error("Upload failed. Please try again.");
      toast.error("Upload failed. Please try again.");
    } finally {
      // setIsUploading(false);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      form.reset(); // 모든 필드를 기본값으로 리셋
    }
  }, [form, isSuccess]);

  return (
    <>
      {/* {results.length > 0 && (
        <div className="mb-6 space-y-2">
          {results.map((result, index) => (
            <div
              key={index}
              className={`rounded-lg border p-3 text-sm ${
                result.success
                  ? "bg-green-500/10 border-green-500/20 text-green-600"
                  : "bg-destructive/10 border-destructive/20 text-destructive"
              }`}
            >
              {result.success
                ? `"${result.name}" registered successfully!`
                : `"${result.name}" failed: ${result.error}`}
            </div>
          ))}
        </div>
      )} */}

      {/* {error && (
          <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-destructive">
            {error}
          </div>
        )} */}
      {/* {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 rounded-xl border bg-card p-6 shadow-lg space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Loader2 className="h-6 w-6 text-primary animate-spin" />
              </div>
              <h3 className="text-lg font-semibold">Registering Figures...</h3>
              <p className="text-sm text-muted-foreground">
                {currentFigureName
                  ? `Processing "${currentFigureName}"`
                  : "Preparing..."}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {results.length} / {forms.length}
                </span>
              </div>
              <Progress value={currentProgress} className="h-2" />
            </div>

            {results.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                      result.success
                        ? "bg-green-500/10 text-green-600"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {result.success ? (
                      <Check className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <X className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="truncate">{result.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )} */}

      <div className="max-w-4xl w-full space-y-6">
        <Form {...form}>
          <RemixForm
            method="post"
            onSubmit={form.handleSubmit(
              onSubmit,
              (error) => {
                console.log("🚀 ~ AdminFigureAdd ~ error:", error);
              }
              //   fetcher.submit(jsonString, {
              //     method: "post",
              //     encType: "application/json", // 중요!
              //   });
              // }
            )}
            navigate={false}
            className="space-y-6"
          >
            {fields.map((field, index) => (
              <AddFigureForm
                key={field.id}
                figure={field}
                index={index}
                fields={fields}
                append={append}
                remove={remove}
              />
            ))}

            <div className="sticky bottom-4 flex justify-end gap-3 bg-background/50 backdrop-blur p-4 rounded-lg">
              <Button
                type="button"
                variant="outline"
                // onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={false}>
                {fetcher.state === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {/* Registering... */}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Register {fields.length} Figure
                    {fields.length > 1 ? "s" : ""}
                  </>
                )}
              </Button>
            </div>
          </RemixForm>
        </Form>
      </div>
    </>
  );
}
