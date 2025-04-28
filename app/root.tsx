import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import "./tailwind.css";

import { getSupabaseServerClient, SupabaseService } from "./supabase";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/header";
import { useState } from "react";
import { User } from "@supabase/supabase-js";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
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
    console.log("🚀 ~ loader ~ data:", data);

    profile = data;
  }

  return {
    isLoggedIn: !!user,
    user,
    profile,
    envs: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster richColors position="top-center" />
        <script dangerouslySetInnerHTML={{ __html: getThemeScript() }} />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function getThemeScript() {
  return `
  (function() {
    try {
      const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      document.documentElement.classList.add(theme);
      } catch (_) {}
      })();
      `;
}

export default function App() {
  const { isLoggedIn, user, profile, envs } = useLoaderData<typeof loader>();
  const [supabase] = useState(
    () => new SupabaseService(envs.SUPABASE_URL, envs.SUPABASE_ANON_KEY)
  );

  return (
    <>
      <Header />
      <Outlet context={{ supabase, isLoggedIn, user, profile }} />
    </>
  );
}

export type TOutletContext = {
  supabase: SupabaseService;
  isLoggedIn: boolean;
  user: User | null;
  profile: {
    id: string;
    nickname: string | null;
    avatar_url: string | null;
    updated_at: string | null;
    is_updated: boolean;
  } | null;
};
