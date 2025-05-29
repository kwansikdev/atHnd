import { LoaderFunctionArgs } from "@remix-run/node";
import {
  Link,
  redirect,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { TOutletContext } from "~/root";
import { getSupabaseServerClient } from "supabase";

export async function loader({ request }: LoaderFunctionArgs) {
  const { supabase, headers } = await getSupabaseServerClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/", { headers });
  }

  return null;
}

export default function Login() {
  const { supabase } = useOutletContext<TOutletContext>();

  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await singInWithEmail(email, password);
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });
    if (error) {
      console.error("Google Sign In Error:", error.message);
    } else {
      // OAuth는 외부 URL로 리디렉션 되기 때문에 여기선 redirect만 발생해
      console.log("Redirecting to Google login...");
    }
  };

  const singInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${redirectTo}`,
      },
    });
    if (error) {
      console.error("Email Sign In Error:", error.message);
    } else {
      console.log("Redirecting to email login...");
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-73px)]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              로그인
            </CardTitle>
            <CardDescription className="text-center">
              계정에 로그인하여 피규어 예약을 관리하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-white text-black border border-zinc-300 hover:bg-zinc-100 hover:text-black"
              onClick={signInWithGoogle}
              // disabled={loading}
            >
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Google로 로그인
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  또는
                </span>
              </div>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">로그인</TabsTrigger>
                <TabsTrigger value="register">회원가입</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">비밀번호</Label>
                      <Link
                        to="#"
                        className="text-sm text-zinc-500 hover:text-zinc-800"
                      >
                        비밀번호 찾기
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    // disabled={loading}
                  >
                    {/* {loading ? "로그인 중..." : "이메일로 로그인"} */}
                    이메일로 로그인
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">이메일</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">비밀번호</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">비밀번호 확인</Label>
                    <Input id="confirm-password" type="password" required />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    //  disabled={loading}
                  >
                    {/* {loading ? "가입 중..." : "회원가입"} */}
                    회원가입
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-xs text-center text-muted-foreground">
              로그인하면 서비스 이용약관 및 개인정보처리방침에 동의하게 됩니다.
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
