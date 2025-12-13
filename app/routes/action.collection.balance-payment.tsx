import { ActionFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "supabase";
import { data } from "@remix-run/react";

export async function action({ request }: ActionFunctionArgs) {
  const { supabase } = await getSupabaseServerClient(request);

  const body = await request.formData();

  const figureId = body.get("figure_id") as string;
  const updatedAt = new Date().toISOString();

  const { error } = await supabase
    .from("user_figure")
    .update({
      balance_paid_at: updatedAt,
      paid_at: updatedAt,
      updated_at: updatedAt,
    })
    .eq("id", figureId);

  if (error) {
    return data({
      error: true,
    });
  }

  return data({
    success: true,
  });
}
