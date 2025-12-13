import { ActionFunctionArgs } from "@remix-run/node";
import { data, useRouteLoaderData } from "@remix-run/react";
import { Loader2 } from "lucide-react";

import { ArchiveFigureForm } from "~/domains/archive/ui/archive-figure-form";
import { FetcherActionProvider } from "~/hooks/use-fetcher-action-state";
import { motion } from "framer-motion";

import { Skeleton } from "~/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { getSupabaseServerClient } from "supabase/supabase-service";
import { ArchiveFigureAddDto } from "~/domains/archive/model";
import { TLoaderData } from "./archive.add";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();

  // 기본 정보
  const name = body.get("name") as string;
  const character_id = body.get("character_id") as string;
  const series_id = body.get("series_id") as string;
  const manufacturer_id = body.get("manufacturer_id") as string;
  const category_id = body.get("category_id") as string;
  const price_kr = body.get("price_kr") as string;
  const price_jp = body.get("price_jp") as string;
  const price_cn = body.get("price_cn") as string;
  // 출시일
  const release_year = body.get("release_year") as string;
  const release_month = body.get("release_month") as string;
  const release_text = body.get("release_text") as string;

  // 상세 정보
  const name_jp = body.get("name_jp") as string;
  const name_en = body.get("name_en") as string;
  const paint_work = body.get("paint_work") as string;
  const sculptors = body.get("sculptors") as string;
  const scale_id = body.get("scale_id") as string;
  const size = body.get("size") as string;
  const material = body.get("material") as string;
  const adult = body.get("adult") as string;
  const limited = body.get("limited") as string;

  // 설명
  const description = body.get("description") as string;
  const specifications = body.get("specifications") as string;

  const { supabase } = await getSupabaseServerClient(request);

  const figureFormData = [
    {
      name,
      character_id,
      series_id,
      manufacturer_id,
      category_id,
      price_kr: parseInt(price_kr),
      price_jp: price_jp ? parseInt(price_jp) : null,
      price_cn: price_cn ? parseInt(price_cn) : null,
      release_year: release_year ? parseInt(release_year) : null,
      release_month: release_month ? parseInt(release_month) : null,
      release_text,

      name_jp,
      name_en,
      paint_work: paint_work.length > 0 ? paint_work.split(",") : null,
      sculptors: sculptors.length > 0 ? sculptors.split(",") : null,
      scale_id,
      size,
      material,
      adult: adult === "on" ? true : false,
      limited: limited === "on" ? true : false,

      description,
      specifications,
    },
  ] as ArchiveFigureAddDto[];

  const response = await supabase
    .from("figure")
    .insert(figureFormData)
    .select();

  if (response.error) {
    return data({ isError: true });
  }

  if (response.data.length !== 0) {
    // 이미지
    const images = body.get("images");

    const parsedImages = images ? JSON.parse(images as string) : [];

    if (parsedImages.length > 0) {
      const imagesDbData = parsedImages.map(
        (img: { url: string; sort_order: number; name: string }) => ({
          figure_id: response.data[0].id,
          image_url: img.url,
          sort_order: img.sort_order,
        })
      );

      const updateImages = await supabase
        .from("figure_image")
        .insert(imagesDbData)
        .select();

      if (updateImages.error) {
        return data({ isError: true });
      }

      return data({
        success: true,
      });
    }
  }

  return data({
    success: false,
  });
}

export default function ArchiveAdd() {
  const loaderData = useRouteLoaderData<TLoaderData>("routes/archive.add");

  if (!loaderData) return <ArchiveFigureAddSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-2"
      >
        <div className="relative">
          <h1 className="text-3xl font-bold">새 피규어 등록</h1>
          <div className="absolute -z-10 inset-0 bg-gradient-to-r from-primary/10 to-transparent blur-xl opacity-50 rounded-full"></div>
        </div>
        <p className="text-muted-foreground">
          데이터베이스에 새로운 피규어를 등록합니다. 모든 필수 정보를 정확하게
          입력해주세요.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <FetcherActionProvider
          options={{
            successMessage: "새 피규어가 성공적으로 등록됐어요! 🎉",
            errorMessage:
              "앗, 등록 중 문제가 생겼어요 😢 잠시 후 다시 시도해 주세요.",
          }}
        >
          <ArchiveFigureForm />
        </FetcherActionProvider>
      </motion.div>
    </div>
  );
}

function ArchiveFigureAddSkeleton() {
  // 로딩 화면 렌더링
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-2 w-full" />
      </div>

      <div className="flex justify-between items-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-16 h-4 mt-2" />
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>

      <div className="flex justify-center mt-8">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    </div>
  );
}
