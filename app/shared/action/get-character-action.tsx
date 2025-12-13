import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function GetCharacterAction(
  supabase: SupabaseClient<Database>,
  seriesId: string,
  query: string | null
) {
  const { data, error } = await supabase
    .from("figure_character")
    .select("*")
    .eq("series_id", seriesId)
    .ilike("name", `%${query || ""}%`)
    // // .ilike("name_en", `%${query || ""}%`)
    .order("name", { ascending: true });

  if (error) throw error;

  const result = [...data].sort((a, b) => {
    return a.name.localeCompare(b.name, "ko-KR");
  });
  return result;
}
