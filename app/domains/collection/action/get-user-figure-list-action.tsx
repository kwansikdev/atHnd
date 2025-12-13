import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export const getUserFigureListAction = async (
  supabase: SupabaseClient<Database>,
  options?: {
    view?: string;
    sort?: "created_at" | "paid_at";
    order?: "asc" | "desc";
  }
) => {
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
  `
    )
    .limit(1, { foreignTable: "figure.figure_image" });

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
};
