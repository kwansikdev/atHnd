import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { JSX } from "react";
import { getSupabaseServerClient } from "supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase, headers } = await getSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login", { headers });
  }

  return null;
}

export default function Profile(): JSX.Element {
  return <div>프로필</div>;
}
