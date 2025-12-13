import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function GetManufacturerAction(
  supabase: SupabaseClient<Database>,
  query: string | null
) {
  const { data, error } = await supabase
    .from("figure_manufacturer")
    .select("*")
    .ilike("name", `%${query || ""}%`)
    .order("name", { ascending: true });

  if (error) throw error;

  const result = [...data].sort((a, b) => {
    return a.name.localeCompare(b.name, "ko-KR");
  });
  return result;
}
