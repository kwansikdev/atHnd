import { Database } from "supabase/schema";

export interface UserFigureDto {
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
  release_id: string;
  delivered_at: string;
  figure: {
    id: string;
    release_year: string;
    release_month: string;
    release_text: string;
    release_no: number;
    is_reissue: boolean;
    price_kr: number;
    price_jp: number;
    price_cn: number;
    detail: {
      id: string;
      name: string;
      manufacturer: { id: string; name: string };
      series: { id: string; name: string };
      image: { image_url: string; sort_order: number }[];
      final_release_date: string;
    };
  };
}
