import { Database } from "supabase/schema";

export type UserFigureDto = Omit<
  Database["public"]["Tables"]["user_figure"]["Row"],
  "figure_id" | "user_id"
> & {
  figure: Omit<
    Database["public"]["Tables"]["figure"]["Row"],
    | "category_id"
    | "character_id"
    | "manufacturer_id"
    | "scale_id"
    | "series_id"
  >;
};
