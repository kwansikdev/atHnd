/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavLink } from "@remix-run/react";
import { Folders, HomeIcon, SquareChartGantt } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { useMobile } from "~/hooks/use-mobile";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import { cn } from "~/utils";

export function AppSidebar() {
  const { profile } = useRootLoaderData();
  const isSmallDesktop = useMobile(1324);

  return (
    <div
      className={cn(
        "bg-widget-color-bg-color-page1 relative top-0 bottom-0 min-w-[248px] max-w-[248px] pt-5 px-4 pb-6 transition-all duration-150",
        "flex flex-col justify-between",
        isSmallDesktop && "min-w-[76px]",
      )}
    >
      <div className={cn("space-y-4")}>
        {topNavItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            url={item.url}
            isHidden={isSmallDesktop}
          />
        ))}

        {profile?.is_admin && (
          <>
            <Separator />
            {adminNavItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                url={item.url}
                isHidden={isSmallDesktop}
              />
            ))}
          </>
        )}
      </div>
      <div>
        <small></small>
      </div>
    </div>
  );
}

type NavItemProps = {
  id?: string;

  icon: any;
  label: string;
  url: string;
  isHidden?: boolean;
};

const topNavItems = [{ id: "home", label: "홈으로", icon: HomeIcon, url: "/" }];

const adminNavItems: NavItemProps[] = [
  { id: "admin", label: "관리페이지", icon: SquareChartGantt, url: "/admin" },
  {
    id: "database",
    label: "데이터베이스",
    icon: Folders,
    url: "/admin/figures",
  },
];

function NavItem({ icon: Icon, label, url, isHidden }: NavItemProps) {
  return (
    <NavLink
      to={url}
      end
      className={({ isActive }) =>
        cn(
          "flex w-full items-center gap-3 rounded-2xl h-10 px-3 text-sm font-medium transition-all duration-150",
          "text-widget-color-text-opacity-secondary hover:bg-widget-color-fill-opacity-5 hover:text-widget-color-text-opacity-highlight",
          isActive &&
            "bg-widget-color-fill-opacity-8 text-widget-color-text-opacity-highlight",
          isHidden && "px-2 justify-center",
        )
      }
    >
      <span className={cn("flex-shrink-0")}>
        <Icon strokeWidth={2.5} />
      </span>
      <span className={cn(isHidden && "hidden opacity-0")}>{label}</span>
    </NavLink>
  );
}
