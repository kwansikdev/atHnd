import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRevalidator,
  useRouteLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";

import { getSupabaseServerClient, SupabaseService } from "../supabase";
import { Toaster } from "./components/ui/sonner";
import { useEffect, useRef, useState } from "react";
import { User } from "@supabase/supabase-js";
import { MobileNav } from "./shared/ui/mobile-nav";
import { cn, detectDevice, TDeviceInfo } from "./utils";
import { AppSidebar } from "./shared/ui/sidebar/app-sidebar";
import { Header } from "./shared/ui/header";
import { ScrollArea } from "./components/ui/scroll-area";
import { SupabaseProvider, UIScopeProvider } from "./shared/contexts";
import { TooltipProvider } from "./components/ui/tooltip";
import { themeSessionResolver } from "./sessions.server";
import {
  PreventFlashOnWrongTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from "remix-themes";
import clsx from "clsx";

import fontStyles from "./font.css?url";

export const links: LinksFunction = () => [
  // 가장 많이 쓰는 weight만 preload (모두 하면 오히려 느려짐)
  {
    rel: "preload",
    href: "/fonts/A2z-4Regular.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "/fonts/A2z-7Bold.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  {
    rel: "preload",
    href: "/fonts/A2z-6SemiBold.woff2",
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  { rel: "stylesheet", href: fontStyles },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const userAgent = request.headers.get("user-agent") || "";
  const isWebView = request.headers.get("x-app-webview") === "true";
  const platform = request.headers.get("x-app-platform");
  const deviceInfo = detectDevice(userAgent);

  const { getTheme } = await themeSessionResolver(request);

  const { supabase } = await getSupabaseServerClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from("profile")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = data;
  }

  return {
    deviceInfo,
    isWebView,
    platform,
    isLoggedIn: !!user,
    user,
    profile,
    envs: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
    theme: process.env.NODE_ENV === "development" ? Theme.LIGHT : getTheme(),
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useRouteLoaderData<typeof loader>("root");

  return (
    <ThemeProvider
      specifiedTheme={data?.theme || null}
      themeAction="/api/set-theme"
      disableTransitionOnThemeChange={true}
    >
      <InnerLayout ssrTheme={Boolean(data?.theme)}>{children}</InnerLayout>
    </ThemeProvider>
  );
}

function InnerLayout({
  ssrTheme,
  children,
}: {
  ssrTheme: boolean;
  children: React.ReactNode;
}) {
  const [theme] = useTheme();

  return (
    <html lang="ko" className={clsx(theme, "bg-widget-color-bg-color-page1")}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-dvh">
        <UIScopeProvider scopeId="search-add-figure">
          <TooltipProvider>
            {children}
            <Toaster richColors position="bottom-center" />
          </TooltipProvider>
        </UIScopeProvider>
        <ScrollRestoration />
        <PreventFlashOnWrongTheme ssrTheme={ssrTheme} />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { deviceInfo, isLoggedIn, user, profile, envs } =
    useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const [supabase] = useState(
    () => new SupabaseService(envs.SUPABASE_URL, envs.SUPABASE_ANON_KEY),
  );
  const [theme] = useTheme();

  // READY 메시지를 이미 보냈는지 추적 (무한 호출 방지)
  const readySentRef = useRef(false);

  useEffect(() => {
    // 1) RN WebView 가 아닌 환경이면 아무 것도 안 함
    if (!deviceInfo.isWebView) {
      return;
    }

    async function syncSessionWithServer(
      access_token: string,
      refresh_token: string,
    ) {
      try {
        const res = await fetch("/api/auth/webview-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token,
            refresh_token,
          }),
        });

        if (!res.ok) {
          console.error(
            "Failed to sync session with server",
            await res.json().catch(() => ({})),
          );
          return;
        }

        // 성공 시 브라우저 쿠키에 Supabase 세션이 세팅됨
        window.ReactNativeWebView?.postMessage(
          JSON.stringify({
            type: "SESSION_SET_SUCCESS",
          }),
        );
        // 세션 동기화 성공 후 loader를 다시 실행하여 로그인 상태 반영
        // 약간의 딜레이를 주어 쿠키가 확실히 설정되도록 함
        setTimeout(() => {
          revalidator.revalidate();
        }, 100);
      } catch (error) {
        console.error("Error calling api.auth.webview-session:", error);
      }
    }

    function handleMessage(event: MessageEvent) {
      let data: {
        type: string;
        payload: { access_token: string; refresh_token: string };
      };

      try {
        data =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch (error) {
        return;
      }

      if (data?.type !== "WEBVIEW_SET_SESSION") return;

      const { access_token, refresh_token } = data.payload ?? {};
      if (!access_token || !refresh_token) return;

      // 1) 브라우저 Supabase 클라이언트 세션 설정
      supabase.client.auth
        .setSession({ access_token, refresh_token })
        .then(({ error }) => {
          if (error) {
            console.error("Failed to set browser supabase session:", error);
          }
        });

      // 2) 서버 세션/쿠키 동기화
      void syncSessionWithServer(access_token, refresh_token);
    }

    // document 이벤트 리스너 (React Native WebView용)
    const handleDocumentMessage = (event: Event) => {
      const messageEvent = event as MessageEvent;
      // console.log("Document message received:", messageEvent.data);
      handleMessage(messageEvent);
    };

    window.addEventListener("message", handleMessage);
    document.addEventListener(
      "message",
      handleDocumentMessage as EventListener,
    );

    // WebView에 준비 완료 신호 보내기 (한 번만!)
    if (!readySentRef.current) {
      readySentRef.current = true;
      window.ReactNativeWebView?.postMessage?.(
        JSON.stringify({ type: "READY" }),
      );
    }

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener(
        "message",
        handleDocumentMessage as EventListener,
      );
    };
  }, [supabase, revalidator, deviceInfo.isWebView]);

  return (
    <SupabaseProvider supabase={supabase}>
      <div className="relative bg-widget-color-bg-color-page1 w-full h-screen box-border flex flex-col [--header-height:calc(--spacing(17))]">
        <Header />
        <div className="relative flex flex-1">
          <div className="absolute top-0 left-0 w-full h-full flex">
            <AppSidebar />
            {/* main contents */}
            <div
              className={cn(
                "relative flex-1 rounded-tl-3xl",
                "bg-center bg-cover bg-no-repeat",

                theme && theme === Theme.DARK
                  ? "bg-[url(/dot-grid-dark.png)]"
                  : "bg-[url(/dot-grid-light.png)]",
              )}
            >
              <ScrollArea className="absolute inset-0 bg-transparent w-full h-full p-4 flex justify-center items-start">
                <Outlet
                  context={{ supabase, isLoggedIn, user, profile, deviceInfo }}
                />
              </ScrollArea>
            </div>
          </div>
        </div>
        {!deviceInfo.isWebView && <MobileNav />}
      </div>
    </SupabaseProvider>
  );
}

export type TOutletContext = {
  supabase: SupabaseService;
  isLoggedIn: boolean;
  user: User | null;
  profile: {
    avatar_url: string | null;
    id: string;
    is_admin: boolean;
    is_updated: boolean;
    nickname: string | null;
    updated_at: string | null;
  } | null;
  deviceInfo: TDeviceInfo;
};
