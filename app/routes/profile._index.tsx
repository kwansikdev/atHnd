import { data, LoaderFunctionArgs } from "@remix-run/node";
import { JSX } from "react";
import { getSupabaseServerClient } from "supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const { headers } = await getSupabaseServerClient(request);

  return data({}, { headers });
}

export default function Profile(): JSX.Element {
  return <div>프로필</div>;
}
