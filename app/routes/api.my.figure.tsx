import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { data } from "@remix-run/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";
import { getSupabaseServerClient } from "supabase/supabase-service";

// loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = await getSupabaseServerClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const url = new URL(request.url);
  const pageParam = url.searchParams.get("p");
  const page = pageParam ? parseInt(pageParam, 10) : 1;

  const { data: result, count } = await getMyFigure(supabase, {
    userId: user.id,
    page,
    PAGE_SIZE: 30,
  });

  const lastId = result.length > 0 ? result[result.length - 1].id : "";
  const next = result.length === 30 ? page + 1 : 0;

  return data({ figures: result, count, lastId, next });
}

export async function getMyFigure(
  supabase: SupabaseClient<Database>,
  options: {
    userId?: string;
    order?: "asc" | "desc";
    page: number;
    PAGE_SIZE: number;
  },
) {
  const { userId, page, PAGE_SIZE } = options;
  const sb = supabase
    .from("user_figure_sorted")
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
      earliest_paid_at,
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
      )
    `,
      { count: "exact" },
    )
    .or("sort_order.eq.0,is_thumbnail.eq.true", {
      foreignTable: "figure.detail.figure_image",
    })
    .order("earliest_paid_at", { ascending: false })
    .limit(1, { foreignTable: "figure.detail.figure_image" });

  if (userId) {
    sb.eq("user_id", userId);
  }

  sb.range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

  const { data, error, count } = await sb;

  if (error) throw error;

  return { data, count };
}

// action
export async function action({ request }: ActionFunctionArgs) {
  const method = request.method;

  switch (method) {
    case "PATCH": {
      const body = await request.text();
      return await patchFn(request, body);
    }
    case "DELETE": {
      const body = await request.text();
      return await deleteFn(request, body);
    }
    default:
      return await postFn(request);
  }
}

async function postFn(request: Request) {
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

  const _parsed = parsed.map((data: any) => ({
    ...data,
    user_id: user.id,
  }));

  const response = await supabase.from("user_figure").insert(_parsed).select();

  if (response.error) {
    return Response.json({ success: false, error: response.error.message });
  }

  return data({ success: true });
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
