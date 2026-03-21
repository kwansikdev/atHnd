import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Params, ShouldRevalidateFunction } from "@remix-run/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "supabase";
import { Database } from "supabase/schema";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { supabase } = await getSupabaseServerClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const fId = params.id;
  if (!fId) return Response.json({ success: false }, { status: 400 });

  const data = await getFigureById(supabase, fId);

  return Response.json({ data });
}

async function getFigureById(supabase: SupabaseClient<Database>, fId: string) {
  const { data, error } = await supabase
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
      delivered_at,
      figure: release_id!inner(
        id,
        release_year,
        release_month,
        release_date,
        release_notice,
        release_no,
        is_reissue,
        price_kr,
        price_jp,
        price_cn,
        detail: figure_id!inner(
          id,
          name,
          manufacturer: manufacturer_id(id, name),
          series: series_id(id, name),
          character: character_id(id, name),
          image: figure_image(image_url, sort_order)
        )
      )`,
    )
    .eq("id", fId)
    .limit(1, { foreignTable: "figure.detail.figure_image" })
    .single();

  if (error) throw error;

  return data;
}

// action
export async function action({ request, params }: ActionFunctionArgs) {
  const method = request.method;
  const body = await request.text();

  switch (method) {
    case "PATCH":
      return patchFn(request, params, body);
    case "DELETE":
      return deleteFn(request, body);
    default:
      return Response.json({});
  }
}

async function patchFn(request: Request, params: Params<string>, body: string) {
  const { supabase } = await getSupabaseServerClient(request);
  const { id } = params;
  const data = JSON.parse(body);

  if (!id)
    return Response.json(
      { success: false, error: "user_figure_id is wrong" },
      { status: 400 },
    );

  const { error } = await supabase
    .from("user_figure")
    .update(data)
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

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  defaultShouldRevalidate,
}) => {
  // PATCH 요청 후 자동 revalidation 방지
  if (formMethod === "PATCH") return false;
  return defaultShouldRevalidate;
};
