import { Database } from "supabase/schema";

export type MyFigureDto = Omit<
  Database["public"]["Tables"]["user_figure"]["Row"],
  "figure_id" | "user_id" | "rating"
> & {
  purchase_site: { id: string; name: string; url: string };
  figure: Omit<
    Database["public"]["Tables"]["figure_release"]["Row"],
    "updated_at" | "created_at" | "price_cn" | "price_jp"
  > & {
    detail: Pick<
      Database["public"]["Tables"]["figure"]["Row"],
      "id" | "name"
    > & {
      manufacturer: { id: string; name: string };
      series: { id: string; name: string };
      character: { id: string; name: string };
      image: { image_url: string; sort_order: number }[];
    };
  };
};
