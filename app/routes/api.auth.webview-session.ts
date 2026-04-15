import { ActionFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "../../supabase";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const { access_token, refresh_token } = await request.json().catch(() => {});

  if (!access_token || !refresh_token) {
    return Response.json({ error: "Invaild payload" });
  }

  const { supabase, headers } = await getSupabaseServerClient(request);

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error)
    return Response.json({ error: error.message }, { status: 401, headers });

  return Response.json(
    {
      ok: true,
      session: data?.session,
    },
    {
      status: 200,
      headers,
    }
  );
}
