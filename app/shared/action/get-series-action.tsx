import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function GetSeriesAction(
  supabase: SupabaseClient<Database>,
  query: string | null
) {
  const { data, error } = await supabase
    .from("figure_series")
    .select("*")
    .ilike("name", `%${query || ""}%`)
    .order("name", { ascending: true });

  if (error) throw error;

  return data;
}
