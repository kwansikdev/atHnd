import { Link, useNavigate } from "@remix-run/react";
import {
  LogIn,
  LogOut,
  Search,
  NotepadText,
  User,
  SunMoon,
  Settings,
  Sun,
  Moon,
  Bell,
  Plus,
  PencilLine,
  MessageSquareDot,
  DollarSign,
  SquarePen,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";

import { cn } from "~/utils";
import { useSupabase } from "~/shared/contexts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Theme, useTheme } from "remix-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import { Separator } from "~/components/ui/separator";
import { Database } from "supabase/schema";

export function Header() {
  const { isLoggedIn, profile } = useRootLoaderData();
  // const { deviceInfo } = useRootLoaderData();

  // const [position, setPosition] = useState(window?.pageYOffset);
  const [visible, setVisible] = useState(true);

  // useEffect(() => {
  //   // if (!deviceInfo.isMobile || deviceInfo.isWebView) return;
  //   const handleScroll = () => {
  //     const moving = window.pageYOffset;

  //     setVisible(position > moving);
  //     setPosition(moving);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [position]);

  return (
    <header
      className={cn(
        "bg-widget-color-bg-color-page1 relative z-10 w-full h-(--header-height) flex justify-between items-center",
        "sticky top-0 transition-[top] duration-300 ease-in-out",
        visible ? "top-0" : "-top-[--header-height]",
      )}
    >
      <div className="min-w-[248px]">logo</div>
      {/* {false ? (
        <Button></Button>
      ) : ( */}
      <div className="relative flex flex-1 h-full">
        <div className="flex-1 flex items-center w-full h-full">
          <div className="absolute px-4 w-full flex justify-center items-center">
            <div className="flex-2 basis-[604px] max-w-[692px] min-w-[332px] w-[692px]">
              <InputGroup className="bg-muted h-[41px] rounded-2xl border-none">
                <InputGroupInput placeholder="검색할 내용을 입력하세요." />
                <InputGroupAddon>
                  <Search className={cn("size-5", "focus-visible:ring-1")} />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div
              className="flex-1 basis-[296px] min-w-[296px] max-w-[340px] w-[340px]"
              aria-hidden="true"
            />
          </div>
        </div>
        <div className={cn("header_right", "flex items-center pr-5 space-x-4")}>
          <AlarmDropdown isLoggedIn={isLoggedIn} />
          <AddDropdown isLoggedIn={isLoggedIn} />
          <UserDropdown {...{ isLoggedIn, profile }} />
        </div>
      </div>
      {/* )} */}
    </header>
  );
}

function AlarmDropdown({ isLoggedIn }: { isLoggedIn: boolean }) {
  const navigate = useNavigate();
  const [count] = useState(0);
  return (
    <DropdownMenu
      open={isLoggedIn ? undefined : false}
      onOpenChange={(open) => {
        if (!isLoggedIn && open) {
          navigate("/auth/login");
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "relative p-2 rounded-2xl cursor-pointer",
            "bg-widget-color-fill-opacity-5 text-widget-color-text-opacity-secondary hover:bg-widget-color-fill-opacity-8 hover:text-widget-color-text-opacity-highlight",
          )}
        >
          <Bell className="size-6" strokeWidth={3} />
          {count > 0 && (
            <Badge
              className={cn(
                "absolute top-0 right-0",
                "h-3 w-3 flex items-center justify-center rounded-full p-0 text-[8px] bg-[#f56565]",
              )}
            />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[360px] h-[483px] p-0 rounded-[20px] space-y--2 border-none"
      >
        <Tabs
          defaultValue="notification"
          className="flex flex-col w-full h-full"
        >
          <TabsList className="flex items-center gap-10 w-full h-[68px] pt-4 pb-3 px-5 border-b-[1px] bg-transparent rounded-none">
            <TabsTrigger
              value="notification"
              className={cn(
                "relative size-10 p-2 rounded-2xl cursor-pointer",
                "bg-transparent text-widget-color-text-opacity-secondary hover:bg-widget-color-fill-opacity-10 hover:text-widget-color-text-opacity-highlight",
                "data-[state=active]:bg-widget-color-fill-color-primaryHighlight data-[state=active]:text-widget-color-text-primary-highlight",
              )}
            >
              <MessageSquareDot className="size-6" strokeWidth={2.5} />
            </TabsTrigger>
            <TabsTrigger
              value="balance"
              className={cn(
                "relative bg-background size-10 p-2 rounded-2xl cursor-pointer",
                "bg-transparent text-widget-color-text-opacity-secondary hover:bg-widget-color-fill-opacity-10 hover:text-widget-color-text-opacity-highlight",
                "data-[state=active]:bg-widget-color-fill-color-primaryHighlight data-[state=active]:text-widget-color-text-primary-highlight",
              )}
            >
              <DollarSign className="size-6" strokeWidth={2.5} />
            </TabsTrigger>
          </TabsList>
          <TabsContent value="notification" className="flex-1">
            <div className="h-full flex flex-col justify-center items-center">
              <p className="text-[16px] text-widget-color-text-opacity-tertiary">
                메세지 없음
              </p>
            </div>
          </TabsContent>
          <TabsContent value="balance" className="flex-1">
            <div className="h-full flex flex-col justify-center items-center">
              <p className="text-[16px] text-widget-color-text-opacity-tertiary">
                메세지 없음
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function AddDropdown({ isLoggedIn }: { isLoggedIn: boolean }) {
  const navigate = useNavigate();
  return (
    <DropdownMenu
      open={isLoggedIn ? undefined : false}
      onOpenChange={(open) => {
        if (!isLoggedIn && open) {
          navigate("/auth/login");
        }
      }}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "relative p-2 rounded-2xl cursor-pointer",
            "bg-widget-color-fill-opacity-5 text-widget-color-text-opacity-secondary hover:bg-widget-color-fill-opacity-8 hover:text-widget-color-text-opacity-highlight",
          )}
        >
          <Plus strokeWidth={3} absoluteStrokeWidth className="size-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[180px] p-3 rounded-[20px] space-y-2 border-none"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <DropdownMenuItem className="h-10" asChild>
          <Link
            to="/calendar/add"
            className={cn(
              "flex items-center cursor-pointer gap-2! font-semibold",
              "bg-widget-color-fill-opacity-3 hover:bg-widget-color-fill-opacity-8 text-widget-color-text-opacity-default [&>svg]:text-widget-color-fill-color-primaryNormal!",
            )}
          >
            <SquarePen className="size-6" />
            <span className="text-[16px]">추가하기</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// 유저
function UserDropdown({
  isLoggedIn,
  profile,
}: {
  isLoggedIn: boolean;
  profile: Database["public"]["Tables"]["profile"]["Row"] | null;
}) {
  const supabase = useSupabase();
  const navigate = useNavigate();
  const [theme, setTheme] = useTheme();

  const signOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    await supabase.signOut();
    navigate("/auth/login");
  };
  const signIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/auth/login");
  };

  function PublicMenu() {
    return (
      <>
        <button
          className="flex gap-2 w-full py-3 cursor-pointer"
          onClick={() => {
            navigate("/auth/login");
          }}
        >
          <div className="p-1.5">
            <Avatar size="lg">
              <AvatarImage src={"/character-silhouette.png"} alt={"G"} />
              <AvatarFallback>GUEST</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <span className="text-xs text-muted-foreground">로그인 필요</span>
          </div>
        </button>
      </>
    );
  }

  function AuthenticatedMenu() {
    return (
      <>
        <div className="flex gap-2 py-3 items-center">
          <div className="p-1.5">
            <Avatar size="lg">
              <AvatarImage
                src={profile?.avatar_url ?? undefined}
                alt={profile?.nickname || "사용자"}
              />
              <AvatarFallback>
                {profile?.nickname?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col gap-1 justify-center">
            <span className="text-sm text-foreground font-semibold">
              {profile?.nickname}
            </span>
            <span className="text-[8px] text-muted-foreground flex items-center gap-1">
              <NotepadText className="size-3" />
              {profile?.id}
            </span>
          </div>
        </div>
        <Separator />
        <div className="py-3 space-y-2">
          <DropdownMenuItem asChild className="h-10">
            <Link
              to="/profile"
              className="flex items-center cursor-pointer gap-1! text-foreground font-semibold"
            >
              <User className="text-foreground h-4 w-4" />
              <span>내 프로필</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="h-10">
            <Link
              to="/setting/profile"
              className="flex items-center cursor-pointer gap-1! text-foreground font-semibold"
            >
              <Settings className="text-foreground h-4 w-4" />
              <span>설정</span>
            </Link>
          </DropdownMenuItem>
        </div>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isLoggedIn ? (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative rounded-full cursor-pointer size-10",
              "before:absolute before:-inset-[1px] before:border before:border-black/20 before:rounded-[50%]",
            )}
          >
            <Avatar size="lg">
              <AvatarImage
                src={profile?.avatar_url ?? undefined}
                alt={profile?.nickname || "사용자"}
              />
              <AvatarFallback>
                {profile?.nickname?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Avatar size="lg">
              <AvatarImage src={"/character-silhouette.png"} alt={"게스트"} />
              <AvatarFallback>GUEST</AvatarFallback>
            </Avatar>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72 py-1 px-4 rounded-2xl border-none"
      >
        {isLoggedIn ? <AuthenticatedMenu /> : <PublicMenu />}

        <Separator />

        <div className="py-3 space-y-2">
          <DropdownMenuItem
            asChild
            className="h-10"
            onSelect={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-1 text-foreground font-semibold">
                <SunMoon className="text-foreground h-4 w-4" />
                <span>테마 변경</span>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon-sm"}
                      variant="secondary"
                      className={cn(
                        "bg-widget-color-fill-opacity-5 text-widget-color-text-opacity-default hover:bg-widget-color-fill-opacity-10",
                        theme === Theme.LIGHT &&
                          "bg-widget-color-fill-color-primaryHighlight ",
                      )}
                      onClick={() => setTheme(Theme.LIGHT)}
                    >
                      <Sun
                        strokeWidth={3}
                        className={cn(
                          "h-4 w-4 text-widget-color-text-opacity-default",
                          theme === Theme.LIGHT &&
                            "text-widget-color-fill-color-primaryNormal",
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>라이트 모드</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon-sm"}
                      variant="secondary"
                      className={cn(
                        "bg-widget-color-fill-opacity-5 text-widget-color-text-opacity-default hover:bg-widget-color-fill-opacity-10",
                        theme === Theme.DARK &&
                          "bg-widget-color-fill-color-primaryHighlight",
                      )}
                      onClick={() => setTheme(Theme.DARK)}
                    >
                      <Moon
                        strokeWidth={3}
                        className={cn(
                          "h-4 w-4 text-widget-color-text-opacity-default",
                          theme === Theme.DARK &&
                            "text-widget-color-fill-color-primaryNormal",
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>다크 모드</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </DropdownMenuItem>
        </div>
        <Separator />
        <div className="py-3 space-y-2">
          {isLoggedIn ? (
            <DropdownMenuItem
              onClick={signOut}
              className="h-10 text-foreground font-semibold gap-1 cursor-pointer"
            >
              <LogOut className="text-foreground h-4 w-4" />
              <span>로그아웃</span>
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="h-10 text-foreground font-semibold gap-1 cursor-pointer"
              onClick={signIn}
            >
              <LogIn className="text-foreground h-4 w-4" />
              <span>로그인</span>
            </DropdownMenuItem>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
