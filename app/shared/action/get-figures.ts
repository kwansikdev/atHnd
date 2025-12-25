import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function getFigures(
  supabase: SupabaseClient<Database>,
  search?: string,
  lastId?: string
) {
  let sb = supabase
    .from("figure_release")
    .select(
      `
    id,
    release_date,
    release_no,
    price_kr,
    price_jp,
    is_reissue,
    figure: figure_id!inner(
      name,
      manufacturer: manufacturer_id(id, name),
      images: figure_image(image_url, sort_order)
    )
  `
    )
    .ilike("figure.name", `%${search}%`)
    .order("id", { ascending: false })
    .limit(30);

  if (lastId) sb = sb.lt("id", lastId);

  const { data, error } = await sb;

  if (error) {
    throw error;
  }

  if (!data) return [];

  const result = data.map((item) => ({
    id: item.id,
    release: {
      text: item.release_date,
      no: item.release_no,
    },
    price: {
      kr: item.price_kr,
      jp: item.price_jp,
    },
    figure: {
      ...item.figure,
    },
  }));

  return result;
}
