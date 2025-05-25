import { redirect } from "@remix-run/react";
import { getSupabaseServerClient } from "supabase";
import { getRedirectToFromRequest } from "../util/get-redirect-to-form-request";

export async function getUserFromRequest(
  request: Request,
  options?: { redirectTo?: string }
) {
  const { supabase, headers } = await getSupabaseServerClient(request);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || error) {
    const redirectTo = getRedirectToFromRequest(request);
    const encodedRedirectTo = encodeURIComponent(
      options?.redirectTo || redirectTo
    );

    throw redirect(`/login?redirectTo=${encodedRedirectTo}`, { headers });
  }

  return { user, supabase, headers };
}
