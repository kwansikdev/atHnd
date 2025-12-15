import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function GetCategoryAction(
  supabase: SupabaseClient<Database>,
  query: string | null
) {
  const { data, error } = await supabase
    .from("figure_category")
    .select("*")
    .ilike("name", `%${query || ""}%`)
    .order("name", { ascending: true });

  if (error) throw error;
  return data;
}
