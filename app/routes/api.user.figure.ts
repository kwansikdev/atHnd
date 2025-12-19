import { ActionFunctionArgs } from "@remix-run/node";
import { getSupabaseServerClient } from "supabase/supabase-service";

export async function action({ request }: ActionFunctionArgs) {
  const method = request.method;
  const body = await request.text();

  switch (method) {
    case "PATCH":
      return patchFn(request, body);
    case "DELETE":
      return deleteFn(request, body);
    default:
      return Response.json({});
  }
}

async function patchFn(request: Request, body: string) {
  const { supabase } = await getSupabaseServerClient(request);

  const data = JSON.parse(body);
  const { id, ...rest } = data;

  const { error } = await supabase
    .from("user_figure")
    .update(rest)
    .eq("id", id);

  if (error) {
    return Response.json(
      {
        error: "결제 정보 업데이트에 실패했습니다.",
        details:
          error instanceof Error
            ? error.message
            : "업데이트 중 알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }

  return Response.json(
    {
      success: true,
    },
    { status: 200 }
  );
}

async function deleteFn(request: Request, body: string) {
  const { supabase } = await getSupabaseServerClient(request);

  const data = JSON.parse(body);
  const { id } = data;

  const { error } = await supabase.from("user_figure").delete().eq("id", id);

  if (error) {
    return Response.json(
      {
        error: "결제 정보 삭제에 실패했습니다.",
        details:
          error instanceof Error
            ? error.message
            : "삭제 중 알 수 없는 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }

  return Response.json(
    {
      success: true,
    },
    { status: 200 }
  );
}
