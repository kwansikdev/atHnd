import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function GetShopAction(
  supabase: SupabaseClient<Database>,
  query: string | null
) {
  const { data, error } = await supabase
    .from("figure_shop")
    .select("*")
    .ilike("name", `%${query || ""}%`);

  if (error) throw error;

  const result = [...data].sort((a, b) => {
    return a.name.localeCompare(b.name, "ko-KR");
  });
  return result;
}
