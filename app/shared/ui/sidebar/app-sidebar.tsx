import { NavLink } from "@remix-run/react";
import { Folders, HomeIcon, SquareChartGantt } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import { cn } from "~/utils";

export function AppSidebar() {
  const { profile } = useRootLoaderData();

  return (
    <div
      className={cn(
        "bg-widget-color-bg-color-page1 relative top-0 bottom-0 min-w-[248px] max-w-[248px] pt-5 px-4 pb-6",
        "flex flex-col justify-between",
      )}
    >
      <div className="space-y-4">
        {topNavItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            url={item.url}
            // active={activeItem === item.id}
            // onClick={() => setActiveItem(item.id)}
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
                // active={activeItem === item.id}
                // onClick={() => setActiveItem(item.id)}
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  label: string;
  url: string;
};

const topNavItems = [
  { id: "home", label: "홈으로", icon: HomeIcon, url: "/" },
  // { id: "follow", label: "팔로우", icon: FollowIcon },
];

const adminNavItems: NavItemProps[] = [
  { id: "admin", label: "관리페이지", icon: SquareChartGantt, url: "/admin" },
  {
    id: "database",
    label: "데이터베이스",
    icon: Folders,
    url: "/admin/figures",
  },
];

function NavItem({ icon: Icon, label, url }: NavItemProps) {
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
        )
      }
    >
      <span className={cn("flex-shrink-0")}>
        <Icon strokeWidth={2.5} />
      </span>
      <span>{label}</span>
    </NavLink>
  );
}
