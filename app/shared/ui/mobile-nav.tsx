"use client";

import type React from "react";

import { CirclePlus, Home, User } from "lucide-react";
import { cn } from "~/utils";
import { Link, useLocation } from "@remix-run/react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function NavItem({ to, icon, label, active }: NavItemProps) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center gap-1 text-xs p-2 rounded-md transition-colors",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      <span className="text-[8px]">{label}</span>
    </Link>
  );
}

export function MobileNav() {
  const { isLoggedIn, profile } = useRootLoaderData();
  const { pathname } = useLocation();

  const navItems = [
    { to: "/", icon: <Home className="h-5 w-5" />, label: "홈", isShow: true },
    {
      to: "/auth/login",
      icon: <User className="h-5 w-5" />,
      label: "로그인",
      isShow: !isLoggedIn,
    },
    {
      to: "/profile",
      icon: (
        <Avatar className="h-5 w-5">
          <AvatarImage
            src={profile?.avatar_url || "/profile-placeholder.png"}
            alt={profile?.nickname || "사용자"}
          />
          <AvatarFallback>{profile?.nickname?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      ),
      label: "마이페이지",
      isShow: isLoggedIn,
    },
  ];

  if (profile?.is_admin) {
    navItems.splice(-1, 0, {
      to: "/admin/figure/add",
      icon: <CirclePlus className="h-5 w-5" />,
      label: "피규어",
      isShow: true,
    });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          if (!item.isShow) return null;
          return (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              active={
                pathname === item.to ||
                (item.to !== "/" && pathname.includes(item.to))
              }
            />
          );
        })}
      </div>
    </div>
  );
}
