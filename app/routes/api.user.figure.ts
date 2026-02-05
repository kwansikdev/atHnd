import { ActionFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "supabase/supabase-service";

import { type LoaderFunctionArgs } from "@remix-run/node";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = await getSupabaseServerClient(request);

  const url = new URL(request.url);
  const view = url.searchParams.get("view") ?? "all";

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const userId = user?.id;
  const figures = await getUserFigures(supabase, userId, { view });

  return Response.json({ figures });
}

// 내부에서 직접 사용할 수 있는 함수
export async function getUserFigures(
  supabase: SupabaseClient<Database>,
  userId?: string,
  options?: {
    view?: string;
    sort?: "created_at" | "paid_at";
    order?: "asc" | "desc";
  },
) {
  let query = supabase
    .from("user_figure")
    .select(
      `
    id,
    status,
    total_price,
    deposit_price,
    balance_price,
    paid_at,
    deposit_paid_at,
    balance_paid_at,
    purchase_site: shop_id(id, name, url), 
    created_at,
    updated_at,
    figure: figure_id(
      name,
      price_kr,
      price_jp,
      price_cn,
      manufacturer: manufacturer_id(id, name),
      series: series_id(id, name),
      release_year,
      release_month,
      release_text,
      image: figure_image(image_url, sort_order)
    )
  `,
    )
    .limit(1, { foreignTable: "figure.figure_image" });

  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (options?.view === "monthly") {
    query = query.eq("status", "reserved");
  }

  const { data, error } = await query;

  let result = data;

  if (data) {
    result = data.sort((a, b) => {
      const aText = a.figure?.release_text ?? "";
      const bText = b.figure?.release_text ?? "";
      // 내림차순 => b - a 순서로 비교
      return bText.localeCompare(aText);
    });
  }

  if (error) throw error;

  return result;
}

// action
export async function action({ request }: ActionFunctionArgs) {
  const method = request.method;
  const body = await request.text();

  switch (method) {
    case "PATCH":
      return patchFn(request, body);
    case "DELETE":
      return deleteFn(request, body);
    default:
      return Response.json({});
  }
}

async function patchFn(request: Request, body: string) {
  const { supabase } = await getSupabaseServerClient(request);

  const data = JSON.parse(body);
  const { id, ...rest } = data;

  const { error } = await supabase
    .from("user_figure")
    .update(rest)
    .eq("id", id);

  if (error) {
    return Response.json(
      {
        error: "결제 정보 업데이트에 실패했습니다.",
        details:
          error instanceof Error
            ? error.message
            : "업데이트 중 알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }

  return Response.json(
    {
      success: true,
    },
    { status: 200 },
  );
}

async function deleteFn(request: Request, body: string) {
  const { supabase } = await getSupabaseServerClient(request);

  const data = JSON.parse(body);
  const { id } = data;

  const { error } = await supabase.from("user_figure").delete().eq("id", id);

  if (error) {
    return Response.json(
      {
        error: "결제 정보 삭제에 실패했습니다.",
        details:
          error instanceof Error
            ? error.message
            : "삭제 중 알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }

  return Response.json(
    {
      success: true,
    },
    { status: 200 },
  );
}
