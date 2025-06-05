import { data, LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { JSX } from "react";
import { getUserFromRequest } from "~/shared/action";

export async function loader({ request }: LoaderFunctionArgs) {
  const { headers } = await getUserFromRequest(request);

  return data({}, { headers });
}

export default function Profile(): JSX.Element {
  return <Outlet />;
}
