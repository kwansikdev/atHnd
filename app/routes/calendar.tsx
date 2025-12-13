import { Outlet, useOutletContext } from "@remix-run/react";
import { TOutletContext } from "~/root";

export default function Calendar() {
  const rootOutletContext = useOutletContext<TOutletContext>();

  return <Outlet context={{ ...rootOutletContext }} />;
}
