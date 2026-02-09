import {
  Archive,
  Bell,
  BookMarked,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  Shredder,
  User,
} from "lucide-react";

import { Button } from "../../components/ui/button";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";

import { cn, isWebView } from "~/utils";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";
import { SupabaseService } from "supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

export function loader() {
  return {
    envs: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
    },
  };
}

export function Navbar() {
  const { deviceInfo, isLoggedIn, user, profile } = useRootLoaderData();
  const { envs } = useLoaderData<typeof loader>();

  // const [notifications] = useState(0);

  const supabase = new SupabaseService(
    envs.SUPABASE_URL,
    envs.SUPABASE_ANON_KEY,
  );

  // const { isWebView } = useIsWebView();
  // const isMobile = useMobile(768);
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.client.auth.signOut();
    navigate("/auth/login");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mainNavItems = [
    // { to: "/", label: "홈", icon: <Home className="h-4 w-4" /> },
    {
      to: "/orders",
      label: "내 예약/구매",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    {
      to: "/collection",
      label: "컬렉션",
      icon: <BookMarked className="h-4 w-4" />,
    },
    // {
    //   to: "/statistics",
    //   label: "통계",
    //   icon: <BarChart3 className="h-4 w-4" />,
    // },
    {
      to: "/archive",
      label: "아카이브",
      icon: <Archive className="h-4 w-4" />,
    },
    // {
    //   to: "/wishlist",
    //   label: "위시리스트",
    //   icon: <Heart className="h-4 w-4" />,
    // },
  ];

  // const dbNavItems = [
  //   { to: "/database/manufacturers", label: "제조사별" },
  //   { to: "/database/series", label: "작품별" },
  //   {
  //     to: "/database/search",
  //     label: "검색",
  //     icon: <Search className="h-4 w-4" />,
  //   },
  // ];

  // const reservationNavItems = [
  //   { to: "/reservations/all", label: "전체 보기" },
  //   {
  //     to: "/reservations/filter",
  //     label: "필터",
  //     icon: <Filter className="h-4 w-4" />,
  //   },
  //   { to: "/reservations/status", label: "상태별 보기" },
  // ];

  const renderMobileHeader = () => (
    <div className="flex w-full h-12 items-center justify-between">
      {/* <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-primary flex items-center justify-center">
          <Package className="size-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg">Bishoujo Collection</h1>
          <p className="text-xs text-muted-foreground">Figure Manager</p>
        </div>
      </div> */}

      <div className="flex items-center gap-2">
        <img src="/athnd-logo.svg" alt="at·hand logo" className="h-8" />
        <h1 className="font-bold text-lg invisible">atHnd</h1>
      </div>
      {/* <div className="flex items-center gap-1 text-3xl">
        <span className={`font-light text-logo-at text-[0.7em]`}>at</span>
        <span className={`text-logo-dot text-[0.25em] mb-2`}>●</span>
        <span className={`font-bold text-logo-hnd tracking-tight`}>Hnd</span>
      </div> */}

      <div className="items-center gap-1 hidden">
        {isLoggedIn ? (
          <>
            {/* <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/search")}
            >
              <Search />
            </Button> */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/notifications")}
            >
              <Bell />
              {/* {notifications > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notifications}
                </Badge>
              )} */}
            </Button>
            {/* <Button
              variant="ghost"
              size="icon"
              className="relative h-10 rounded-full"
              onClick={() => navigate("/profile")}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={profile?.avatar_url || undefined}
                  alt={profile?.nickname || "사용자"}
                />
                <AvatarFallback>
                  {profile?.nickname?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button> */}
          </>
        ) : (
          // <Button
          //   variant="outline"
          //   size="sm"
          //   onClick={() => navigate("/auth/login")}
          // >
          //   로그인
          // </Button>
          <></>
        )}
      </div>
    </div>
  );

  // 데스크톱에서는 전체 헤더 표시
  const renderDesktopHeader = () => (
    <div className="flex h-[calc(100svh-var(--header-height))] w-full items-center justify-between">
      {/* 로고 및 데스크톱 네비게이션 */}
      <div className="flex items-center gap-6 md:gap-8 lg:gap-10">
        {/* <Link to="/" className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <span className="text-xl font-bold">미피챈</span>
        </Link> */}
        {/* <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-black flex items-center justify-center">
            <Package className="size-6 text-primary-foreground" />
          </div>
          <Link to="/">
            <h1 className="font-bold text-lg">Bishoujo Collection</h1>
            <p className="text-xs text-muted-foreground">Figure Manager</p>
          </Link>
        </div> */}
        <Link to="/" className="">
          <div className="flex items-center gap-2">
            <img src="/athnd-logo.svg" alt="at·hand logo" className="h-10" />
          </div>
          {/* <div className="flex items-center gap-1 text-3xl">
            <span className={`font-light text-logo-at text-[0.7em]`}>at</span>
            <span className={`text-logo-dot text-[0.25em] mb-2`}>●</span>
            <span className={`font-bold text-logo-hnd tracking-tight`}>
              Hnd
            </span>
          </div> */}
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="flex items-center gap-1">
          {/* {mainNavItems.slice(0, 4).map((item) => {
            if (item.to === "/archive" && !profile?.is_admin) return null;

            return (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                // active={pathname === item.to}
                isAdmin={!!profile?.is_admin}
              />
            );
          })} */}

          {/* 드롭다운 메뉴 - 피규어 DB */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-1 px-3 py-2 h-auto font-normal"
              >
                <Database className="h-4 w-4 mr-1" />
                피규어 DB
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {dbNavItems.map((item) => (
                <DropdownMenuItem key={item.to} asChild>
                  <Link
                    to={item.to}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu> */}

          {/* 추가 메뉴 아이템 */}
          {/* <NavItem
            to="/wishlist"
            label="위시리스트"
            icon={<Heart className="h-4 w-4" />}
            // active={pathname === "/wishlist"}
          /> */}
        </nav>
      </div>

      {/* 오른쪽 영역 - 사용자 관련 */}
      <div className="flex items-center gap-2">
        {/* 테마 토글 */}
        {/* <ThemeToggle /> */}

        {/* PWA 설치 버튼 */}
        {/* {showInstallButton && (
          <Button
            id="install-button"
            variant="outline"
            size="sm"
            onClick={() => {
              // PWA 설치 프롬프트 표시 (실제 구현은 pwa-register.tsx에서 처리)
              const event = new Event("install-pwa");
              window.dispatchEvent(event);
            }}
          >
            <Download className="mr-2 h-4 w-4" />앱 설치
          </Button>
        )} */}

        {/* 알림 아이콘 */}
        {/* {isLoggedIn && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-2">
                <span className="font-medium">알림</span>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  모두 읽음 표시
                </Button>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <div className="p-3 hover:bg-muted rounded-md cursor-pointer">
                  <div className="font-medium">새 피규어 출시 알림</div>
                  <p className="text-sm text-muted-foreground">
                    아스나 웨딩 드레스 Ver. 피규어가 출시되었습니다.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2시간 전</p>
                </div>
                <div className="p-3 hover:bg-muted rounded-md cursor-pointer">
                  <div className="font-medium">배송 상태 업데이트</div>
                  <p className="text-sm text-muted-foreground">
                    렘 바니 Ver. 피규어가 배송 중입니다.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">어제</p>
                </div>
                <div className="p-3 hover:bg-muted rounded-md cursor-pointer">
                  <div className="font-medium">위시리스트 할인 알림</div>
                  <p className="text-sm text-muted-foreground">
                    위시리스트에 있는 피규어의 가격이 10% 할인되었습니다.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">3일 전</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2 text-center">
                <Link
                  to="/notifications"
                  className="text-sm text-primary hover:underline"
                >
                  모든 알림 보기
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )} */}

        {/* 사용자 메뉴 */}
        {isLoggedIn ? (
          <>
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-2">
                  <span className="font-medium">알림</span>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    모두 읽음 표시
                  </Button>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  <div className="p-3 hover:bg-muted rounded-md cursor-pointer">
                    <div className="font-medium">새 피규어 출시 알림</div>
                    <p className="text-sm text-muted-foreground">
                      아스나 웨딩 드레스 Ver. 피규어가 출시되었습니다.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      2시간 전
                    </p>
                  </div>
                  <div className="p-3 hover:bg-muted rounded-md cursor-pointer">
                    <div className="font-medium">배송 상태 업데이트</div>
                    <p className="text-sm text-muted-foreground">
                      렘 바니 Ver. 피규어가 배송 중입니다.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">어제</p>
                  </div>
                  <div className="p-3 hover:bg-muted rounded-md cursor-pointer">
                    <div className="font-medium">위시리스트 할인 알림</div>
                    <p className="text-sm text-muted-foreground">
                      위시리스트에 있는 피규어의 가격이 10% 할인되었습니다.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">3일 전</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 text-center">
                  <Link
                    to="/notifications"
                    className="text-sm text-primary hover:underline"
                  >
                    모든 알림 보기
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage
                      src={profile?.avatar_url || undefined}
                      alt={profile?.nickname || "사용자"}
                    />
                    <AvatarFallback>
                      {profile?.nickname?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {/* <span className="ml-2 hidden md:inline-block">
                  {profile?.nickname}
                </span>
                <ChevronDown className="ml-1 h-4 w-4 hidden md:inline-block" /> */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{profile?.nickname}</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                {profile?.is_admin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Shredder className="mr-2 h-4 w-4" />
                        <span>데이터베이스</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin/figures/add"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>피규어 추가</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>프로필</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              navigate("/auth/login");
            }}
          >
            로그인
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <header
      className={cn(
        isWebView() && "hidden",
        "fixed top-0 z-50 w-full h-15 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        deviceInfo.isMobile && "border-0",
      )}
    >
      <div className="container flex items-center h-full mx-auto px-4">
        {deviceInfo.isMobile ? renderMobileHeader() : renderDesktopHeader()}
      </div>
    </header>
  );
}
