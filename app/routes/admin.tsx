import { Outlet, useOutletContext } from "@remix-run/react";
import { TOutletContext } from "~/root";

export function loader() {
  return {};
}

export default function Admin() {
  const { profile } = useOutletContext<TOutletContext>();

  if (!profile || !profile.is_admin) {
    return <div className="p-4">관리자만 접근 가능한 페이지입니다.</div>;
  }

  return <Outlet />;
}
