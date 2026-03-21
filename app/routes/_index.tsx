import { type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSupabaseServerClient } from "supabase/supabase-service";

import { cn } from "~/utils";
import { TimeLine } from "~/domains/callendar/ui/time-line";
import { getMyFigure } from "./api.my.figure";
import { useState } from "react";
import { MyFigureDto } from "~/shared/model";

export const meta: MetaFunction = () => {
  return [
    { title: "엣헨드 | Everything you keep, at hand!" },
    {
      name: "description",
      content: "Your personal space for collecting, keeping, and sharing.",
    },
  ];
};

export async function loader({ request }: { request: Request }) {
  const { supabase } = await getSupabaseServerClient(request);

  const url = new URL(request.url);
  const pageParam = url.searchParams.get("p");
  const page = pageParam ? parseInt(pageParam, 10) : 0;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ figures: [], error: "Unauthorized", count: 0 });
  }

  const { data: result, count } = await getMyFigure(supabase, {
    userId: user.id,
    page,
    PAGE_SIZE: 30,
  });

  const lastId = result.length > 0 ? result[result.length - 1].id : "";
  const next = lastId ? page + 1 : 0;

  return Response.json({ figures: result, count, next });
}

export default function Index() {
  const { figures, ...rest } = useLoaderData<typeof loader>();

  const [allFigures, setAllFigures] = useState<MyFigureDto[]>(figures);

  return (
    <main className="container mx-auto w-full min-h-full flex flex-1 justify-center">
      <div className="flex-2 max-w-[692px] min-w-[332px] h-full">
        <TimeLine figures={allFigures} setFigures={setAllFigures} {...rest} />
      </div>
      <div
        className={cn(
          "max-w-[340px] min-w-[296px] w-full h-full ml-3",
          "sticky top-0",
        )}
      >
        <div className="w-full h-44 bg-widget-color-bg-color-page1 rounded-2xl"></div>
      </div>
    </main>
  );
}
