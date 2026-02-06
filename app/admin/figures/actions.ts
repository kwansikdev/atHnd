"use server"

import { getSupabaseServerClient } from "@/lib/supabase-server"

export type RegisterFigureInput = {
  name: string
  series: string
  manufacturer: string
  category: string
  scale: string | null
  price: number
  releaseDate: string
  announcementDate: string | null
  isRerelease: boolean
  originalReleaseDate: string | null
  imageUrl: string | null
  sourceUrl: string | null
}

export async function registerFigure(input: RegisterFigureInput) {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase.rpc("register_figure", {
    p_name: input.name,
    p_series: input.series,
    p_manufacturer: input.manufacturer,
    p_category: input.category,
    p_scale: input.scale,
    p_price: input.price,
    p_release_date: input.releaseDate,
    p_announcement_date: input.announcementDate,
    p_is_rerelease: input.isRerelease,
    p_original_release_date: input.originalReleaseDate,
    p_image_url: input.imageUrl,
    p_source_url: input.sourceUrl,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
