import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export const getUserFigureListAction = async (
  supabase: SupabaseClient<Database>,
  options: {
    year: string;
    filter?: "paid_at" | "release_year";
    // sort?: "created_at" | "paid_at";
    // order?: "asc" | "desc";
  }
) => {
  const query = supabase
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
      release_text,
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
  `
    )
    .limit(1, { foreignTable: "figure.detail.figure_image" });

  if (options.filter === "release_year") {
    query
      .eq("figure.release_year", Number(options.year))
      .order("created_at", { ascending: true, nullsFirst: false });
  } else if (options.filter === "paid_at") {
    query
      .or(
        `paid_at.gte.${options.year}-01-01,deposit_paid_at.gte.${options.year}-01-01,delivered_at.gte.${options.year}-01-01`
      )
      .or(
        `paid_at.lte.${options.year}-12-31,deposit_paid_at.lte.${options.year}-12-31,delivered_at.lte.${options.year}-12-31`
      )
      .order("paid_at", { ascending: true, nullsFirst: false });
  }

  const { data, error } = await query;

  if (error) throw error;

  const result = data;

  // if (data) {
  // result = data.sort((a, b) => {
  //   const aText = a.figure?.release_text ?? "";
  //   const bText = b.figure?.release_text ?? "";
  //   // 내림차순 => b - a 순서로 비교
  //   return bText.localeCompare(aText);
  // });
  // result = data.filter(
  //   (a) =>
  //     a.status === "reserved" &&
  //     a.figure?.release_year === parseInt(options.year)
  // );
  // }

  if (error) throw error;

  return result;
};
