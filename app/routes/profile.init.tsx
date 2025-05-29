import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { data, Form, redirect, useLoaderData } from "@remix-run/react";
import { Camera, X } from "lucide-react";
import { useState } from "react";
import { Uploader } from "~/components/template/uploader";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { getSupabaseServerClient } from "supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase, headers } = await getSupabaseServerClient(request);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return redirect("/auth/login", { headers });
  }

  const profile = await supabase
    .from("profile")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile.data?.is_updated) {
    return redirect("/", { headers });
  }

  return { user };
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const nickname = body.get("nickname");
  const avatar_url = body.get("avatar_url");

  const { supabase } = await getSupabaseServerClient(request);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return data({ error: authError?.message }, { status: authError?.status });
  }

  const { error } = await supabase
    .from("profile")
    .update({
      nickname: nickname as string,
      avatar_url: avatar_url as string,
      is_updated: true,
    })
    .eq("id", user.id);

  if (error) {
    return data({ error: "프로필 업데이트에 실패했습니다." }, { status: 500 });
  }

  return redirect("/");
}

export default function ProfileInit() {
  const { user } = useLoaderData<typeof loader>();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const removeImage = () => {
    setAvatarUrl(undefined);
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-73px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            프로필 설정
          </CardTitle>
          <CardDescription className="text-center">
            피규어 예약 관리 서비스를 이용하기 위한 프로필을 설정해주세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Uploader
                        bucket="profiles"
                        accept="image/*"
                        onFileChange={(value) => {
                          setAvatarUrl(value[0].url);
                        }}
                      >
                        <div className="relative h-24 w-24 rounded-full overflow-hidden cursor-pointer group">
                          <Avatar className="h-24 w-24">
                            <AvatarImage
                              src={avatarUrl || user?.user_metadata.avatar_url}
                              alt={user?.user_metadata.name || "사용자"}
                            />
                            <AvatarFallback className="text-2xl">
                              {user?.user_metadata.name?.charAt(0) ||
                                user?.email?.charAt(0) ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="absolute inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </Uploader>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>프로필 이미지 변경</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                {/* 파일 업로드를 위한 숨겨진 input */}
                <input
                  type="text"
                  name="avatar_url"
                  value={avatarUrl}
                  className="hidden"
                  readOnly
                />

                {/* 이미지가 변경되었을 때만 제거 버튼 표시 */}
                {avatarUrl && (
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-zinc-200 dark:bg-zinc-800 rounded-full p-1"
                    aria-label="이미지 제거"
                    onClick={removeImage}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                name="nickname"
                placeholder="사용할 닉네임을 입력하세요"
                defaultValue={user?.user_metadata.name || ""}
                required
              />
              <p className="text-xs text-muted-foreground">
                다른 사용자에게 표시될 이름입니다. 나중에 변경할 수 있습니다.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              // disabled={fetcher.state === "loading"}
            >
              {/* {loading ? "저장 중..." : "프로필 저장"} */}
              저장
            </Button>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-xs text-center text-muted-foreground">
            프로필을 설정하면 서비스 이용약관 및 개인정보처리방침에 동의하게
            됩니다.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
