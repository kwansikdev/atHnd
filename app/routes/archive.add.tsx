import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { data, Link, useLoaderData } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import { getSupabaseServerClient } from "supabase";
import { Button } from "~/components/ui/button";
import { GetManufacturerAction } from "~/domains/archive/action";

import { ArchiveFigureAdd } from "~/domains/archive/ui/archive-figure-add";
import { useFetcherActionState } from "~/hooks/use-fetcher-action-state";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = await getSupabaseServerClient(request);

  const manufacturer = await GetManufacturerAction(supabase);

  return data({ manufacturer });
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();

  const adult = body.get("adult") as string;
  const category = body.get("category") as string;
  const character = body.get("character") as string;
  const description = body.get("description") as string;
  const limited = body.get("limited") as string;
  const manufacturer = body.get("manufacturer") as string;
  const material = body.get("material") as string;
  const name = body.get("name") as string;
  const name_jp = body.get("name_jp") as string;
  const name_en = body.get("name_en") as string;
  // const paint_work = body.get("paint_work") as string;
  const price = body.get("price") as string;
  const price_jp = body.get("price_jp") as string;
  const release_date = body.get("release_date") as string;
  const scale = body.get("scale") as string;
  // const sculptors = body.get("sculptors") as string;
  const series = body.get("series") as string;
  const size = body.get("size") as string;
  const specifications = body.get("specifications") as string;

  const { supabase } = await getSupabaseServerClient(request);

  const response = await supabase
    .from("figure")
    .insert([
      {
        adult: adult === "on" ? true : false,
        category,
        character,
        description,
        limited: limited === "on" ? true : false,
        manufacturer,
        material,
        name,
        name_jp,
        name_en,
        paint_work: null,
        price: parseInt(price),
        price_jp: parseInt(price_jp),
        release_date,
        scale: scale || null,
        sculptors: null,
        series,
        size,
        specifications,
      },
    ])
    .select();

  if (response.error) {
    return data({ error: true });
  }

  if (response.data.length !== 0) {
    const images = body.getAll("images") as string[];
    const imagesDbData = images.map((url, idx) => ({
      figure_id: response.data[0].id,
      image_url: url,
      sort_order: idx,
    }));

    const updateImages = await supabase
      .from("figure_images")
      .insert(imagesDbData)
      .select();

    if (updateImages.error) {
      return data({ error: true });
    }
  }

  return data({
    success: true,
  });
}

export default function DatabaseAdd() {
  const { manufacturer } = useLoaderData<typeof loader>();
  const { fetcher } = useFetcherActionState({
    successMessage: "새 피규어가 성공적으로 등록됐어요! 🎉",
    errorMessage: "앗, 등록 중 문제가 생겼어요 😢 잠시 후 다시 시도해 주세요.",
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/archive">
            <ArrowLeft className="mr-2 h-4 w-4" />
            피규어 데이터베이스로 돌아가기
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">새 피규어 등록</h1>
          <p className="text-muted-foreground">
            데이터베이스에 새로운 피규어를 등록합니다. 모든 필수 정보를 정확하게
            입력해주세요.
          </p>
        </div>

        <fetcher.Form method="post">
          <ArchiveFigureAdd manufacturer={manufacturer} />
        </fetcher.Form>
      </div>
    </main>
  );
}
