import { Home, Plus, User } from "lucide-react";
import { cn } from "~/utils";
import { Link, useLocation } from "@remix-run/react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";

export function MobileNav() {
  const { isLoggedIn, profile } = useRootLoaderData();
  const { pathname } = useLocation();

  const navItems = [
    { to: "/", icon: <Home className="h-5 w-5" />, label: "홈" },
    {
      to: "/calendar/add",
      icon: <Plus className="h-5 w-5" />,
      label: "Add",
      isMain: true,
    },
    {
      to: isLoggedIn ? "/profile" : "/auth/login",
      icon: isLoggedIn ? (
        <Avatar className="h-5 w-5">
          <AvatarImage
            src={profile?.avatar_url || "/profile-placeholder.png"}
            alt={profile?.nickname || "사용자"}
          />
          <AvatarFallback>{profile?.nickname?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      ) : (
        <User className="h-5 w-5" />
      ),
      label: isLoggedIn ? "마이" : "로그인",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border md:hidden safe-x rounded-t-3xl">
      <div className="flex items-center justify-around h-16 pb-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.to ||
            (item.to !== "/" && pathname.startsWith(item.to));

          if (item.isMain) {
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center justify-center -mt-4"
              >
                <div className="size-14 rounded-full bg-primary flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                  {item.icon}
                </div>
              </Link>
            );
          }

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full touch-target transition-colors",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
