/* eslint-disable @typescript-eslint/no-explicit-any */
import { data as remixData, type LoaderFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "supabase/supabase-service";
import {
  GetCharacterAction,
  GetManufacturerAction,
  GetSeriesAction,
} from "~/shared/action";
import { GetShopAction } from "~/shared/action/get-shop-action";

export type SearchType =
  | "manufacturer"
  | "series"
  | "character"
  | "category"
  | "scale"
  | "shop";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const searchQuery = url.searchParams.get("q");
  const searchType = url.searchParams.get("type") as SearchType | null;
  const seriesId = url.searchParams.get("seriesId");

  if (!searchType) {
    return remixData({ results: [] });
  }

  const { supabase } = await getSupabaseServerClient(request);

  try {
    let data:
      | ({ id: string; name: string } & Record<string, unknown>)[]
      | null = null;

    switch (searchType) {
      case "manufacturer": {
        const manufacturers = await GetManufacturerAction(
          supabase,
          searchQuery
        );
        data = manufacturers;
        break;
      }

      case "series": {
        const series = await GetSeriesAction(supabase, searchQuery);
        data = series;
        break;
      }

      case "character": {
        if (!seriesId) {
          data = [];
          break;
        }

        const characters = await GetCharacterAction(
          supabase,
          seriesId,
          searchQuery
        );
        data = characters;
        break;
      }

      case "shop": {
        const shop = await GetShopAction(supabase, searchQuery);
        data = shop;
        break;
      }
    }

    return remixData({
      results:
        data?.map((item: any) => ({
          value: item.id,
          label: item.name,
          parentId:
            "manufacturer_id" in item ? item.manufacturer_id : undefined,
        })) ?? [],
    });
    // return remixData({ results: data });
  } catch (error) {
    console.error("Search error:", error);
    return remixData({ results: [] }, { status: 500 });
  }
}
