import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserFigureListAction } from "~/domains/collection/action";
import { FigureGrid } from "~/domains/collection/ui/figure-grid";
import { getUserFromRequest } from "~/shared/action/get-user-from-request";

// 피규어 데이터 가져오기
export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase } = await getUserFromRequest(request);

  const url = new URL(request.url);
  const view = url.searchParams.get("view") ?? "all";

  const figures = await getUserFigureListAction(supabase, { view });

  return Response.json({ figures });
}

export default function Collection() {
  const { figures } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-10 mt-6 animate-in fade-in-50 duration-500">
      {figures && <FigureGrid items={figures} />}
    </div>
  );
}
