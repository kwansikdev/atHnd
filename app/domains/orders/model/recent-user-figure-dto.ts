import { Database } from "supabase/schema";

export type RecentUserFigureDto = Pick<
  Database["public"]["Tables"]["user_figure"]["Row"],
  | "id"
  | "status"
  | "total_price"
  | "deposit_price"
  | "balance_price"
  | "paid_at"
  | "deposit_paid_at"
  | "balance_paid_at"
  | "created_at"
  | "updated_at"
> & {
  figure: Pick<
    Database["public"]["Tables"]["figure"]["Row"],
    "name" | "price_kr" | "release_text"
  > & {
    manufacturer: Pick<
      Database["public"]["Tables"]["figure_manufacturer"]["Row"],
      "id" | "name_ko"
    >;
    series: Pick<
      Database["public"]["Tables"]["figure_series"]["Row"],
      "id" | "name_ko"
    >;
    image: Pick<
      Database["public"]["Tables"]["figure_image"]["Row"],
      "image_url" | "sort_order"
    >[];
  };
  purchase_site: Pick<
    Database["public"]["Tables"]["figure_shop"]["Row"],
    "id" | "name"
  > | null;
};
