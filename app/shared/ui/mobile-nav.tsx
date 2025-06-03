"use client";

import type React from "react";

import { BookMarked, Archive, Home, ShoppingCart, User } from "lucide-react";
import { cn } from "~/utils";
import { Link } from "@remix-run/react";
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
      <span>{label}</span>
    </Link>
  );
}

export function MobileNav() {
  const { isLoggedIn, profile } = useRootLoaderData();

  const navItems = [
    { to: "/", icon: <Home className="h-5 w-5" />, label: "홈" },
    {
      to: "/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "예약/구매",
    },
    {
      to: "/collection",
      icon: <BookMarked className="h-5 w-5" />,
      label: "컬렉션",
    },
    {
      to: "/archive",
      icon: <Archive className="h-5 w-5" />,
      label: "아카이브",
    },
    {
      to: "/profile",
      icon: isLoggedIn ? (
        <Avatar className="h-7 w-7">
          <AvatarImage
            src={profile?.avatar_url || "/profile-placeholder.png"}
            alt={profile?.nickname || "사용자"}
          />
          <AvatarFallback>{profile?.nickname?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      ) : (
        <User className="h-5 w-5" />
      ),
      label: isLoggedIn ? "프로필" : "로그인",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            // active={pathname === item.to}
          />
        ))}
      </div>
    </div>
  );
}
