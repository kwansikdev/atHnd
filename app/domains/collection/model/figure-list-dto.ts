import { Database } from "supabase/schema";

export interface CollectionFigureDto {
  id: string;
  status: Database["public"]["Enums"]["user_figure_status"];
  total_price: number;
  deposit_price: number;
  balance_price: number;
  paid_at: string;
  deposit_paid_at: string;
  balance_paid_at: string;
  purchase_site: { id: string; name: string; url: string };
  created_at: string;
  updated_at: string;
  figure: {
    name: string;
    price_kr: number;
    price_jp: number;
    price_cn: number;
    manufacturer: { id: string; name: string };
    series: { id: string; name: string };
    release_year: number;
    release_month: number;
    release_text: string;
    image: { image_url: string; sort_order: number }[];
  };
}
