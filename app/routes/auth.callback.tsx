import { redirect, type LoaderFunctionArgs } from "@remix-run/node";

import { getSupabaseServerClient } from "~/supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") || "/";

  if (code) {
    const { supabase, headers } = await getSupabaseServerClient(request);

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );

    if (exchangeError) {
      return redirect("/auth/auth-code-error", { headers });
    }

    // 세션 가져오기
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user?.id;
    if (!userId) {
      return redirect("/auth/auth-code-error", { headers });
    }

    // 프로필 존재 여뷰 확인
    const { data: profile, error: profileError } = await supabase
      .from("profile")
      .select("id")
      .eq("id", userId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      // PGRST116: row not found
      return redirect("/auth/auth-code-error", { headers });
    }

    if (!profile) {
      await supabase.from("profile").insert({ id: userId });
      return redirect("/setup-profile", { headers });
    }

    // 프로필이 있으면 홈으로
    return redirect(next, { headers });
  }

  // return the user to an error page with instructions
  return redirect("/auth/auth-code-error", { headers: new Headers() });
}
