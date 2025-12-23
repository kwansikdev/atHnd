import { LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "supabase";
import { data } from "@remix-run/react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "supabase/schema";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = await getSupabaseServerClient(request);

  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const lId = url.searchParams.get("lId") ?? "";
  const page = url.searchParams.get("page") ?? 0;

  const figures = await getFiguresWithQuery(supabase, q, lId, Number(page));
  const lastId = figures.length > 0 ? figures[figures.length - 1].id : "";

  return data({
    data: figures,
    query: q,
    lastId,
    next: lastId ? Number(page) + 1 : 0,
  });
}

async function getFiguresWithQuery(
  supabase: SupabaseClient<Database>,
  query?: string,
  lastId?: string,
  page: number = 0,
  PAGE_SIZE: number = 30
) {
  let sb = supabase
    .from("figure_release")
    .select(
      `
      id,
      release_date,
      release_no,
      price_kr,
      price_jp,
      is_reissue,
      figure: figure_id!inner(id,name,
      manufacturer: manufacturer_id!inner(id,name),
      images: figure_image!inner(image_url, sort_order)
    )`
    )
    .order("created_at", { ascending: false })
    .limit(30)
    .limit(1, { foreignTable: "figure.figure_image" })
    .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

  // if (lastId) sb = sb.lt("id", lastId);
  if (query) sb = sb.ilike("figure.name", `%${query}%`);

  const { data, error } = await sb;

  if (error) {
    throw error;
  }

  if (!data) return [];

  const result = data
    // .sort((a, b) => a.figure.name.localeCompare(b.figure.name))
    .map((item) => ({
      id: item.id,
      release: {
        text: item.release_date,
        no: item.release_no,
      },
      price: {
        kr: item.price_kr,
        jp: item.price_jp,
      },
      detail: {
        ...item.figure,
      },
    }));

  return result;
}

export interface TFiguresWithQuery {
  id: string;
  release: {
    text: string;
    no: number;
  };
  price: {
    kr: number | null;
    jp: number | null;
  };
  detail: {
    id: string;
    name: string;
    manufacturer: {
      id: number;
      name: string;
    };
    images: Array<{
      image_url: string;
      sort_order: number;
    }>;
  };
}
