import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function getRecentOrderBySupabase(
  supabase: SupabaseClient<Database>,
  options: {
    limit?: number;
  } = {}
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
      purchase_site: shop_id(id, name), 
      created_at,
      updated_at,
      figure: figure_id(
        name,
        price_kr,
        manufacturer: manufacturer_id(id, name),
        series: series_id(id, name),
        release_text,
        image: figure_image(image_url, sort_order)
      )
    `,
      { count: "exact" }
    )
    .neq("status", "owned")
    .order("created_at", { ascending: false })
    .limit(1, { foreignTable: "figure.figure_image" })
    .limit(6);

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { error, data, count } = await query;

  let result = data;

  if (data) {
    result = data.sort((a, b) => {
      const aText = a.deposit_paid_at ?? a.paid_at ?? "";
      const bText = b.deposit_paid_at ?? b.paid_at ?? "";
      // 내림차순 => b - a 순서로 비교
      return bText.localeCompare(aText);
    });
  }

  if (error) throw error;

  return { data: result ?? [], count };
}
