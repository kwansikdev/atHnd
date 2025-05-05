import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function GetManufacturerAction(
  supabase: SupabaseClient<Database>
) {
  const { data, error } = await supabase
    .from("figure_manufacturer")
    .select("*")
    .order("name_en", { ascending: true });

  if (error) throw error;
  return data;
}
