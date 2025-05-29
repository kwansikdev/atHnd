// routes/logout.tsx
import { ActionFunction, redirect } from "@remix-run/node";
import { getSupabaseServerClient } from "supabase";

export const action: ActionFunction = async ({ request }) => {
  const { supabase, headers } = await getSupabaseServerClient(request);

  await supabase.auth.signOut(); // 세션 삭제

  return redirect("/auth/login", {
    headers,
  });
};
