import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "@remix-run/react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Database,
  Package,
  Plus,
} from "lucide-react";
import { cn } from "~/utils";
import { Button } from "~/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useMobile } from "~/hooks/use-mobile";

interface HeroFigure {
  id: string;
  name: string;
  image: string;
  series: string;
  manufacturer: string;
  releaseDate: string;
}

const heroFigures: HeroFigure[] = [
  {
    id: "db1",
    name: "아스나 웨딩 드레스 Ver.",
    image: "https://link.bighard.co.kr/lnex.aspx?lkey=e404ae5b",
    series: "소드 아트 온라인",
    manufacturer: "알터",
    releaseDate: "2023-12-15",
  },
  {
    id: "db3",
    name: "미쿠 매지컬 미라이 2023 Ver.",
    image: "https://link.bighard.co.kr/lnex.aspx?lkey=0845dd34",
    series: "하츠네 미쿠",
    manufacturer: "굿스마일컴퍼니",
    releaseDate: "2024-06-15",
  },
  {
    id: "db5",
    name: "제로투 드레스 Ver.",
    image: "https://www.bighard.co.kr/lnex.aspx?lkey=cc6a42e0",
    series: "다링 인 더 프랑키스",
    manufacturer: "코토부키야",
    releaseDate: "2024-04-25",
  },
];

export function HomeHero({
  figures = heroFigures,
}: {
  figures?: HeroFigure[];
}) {
  const isMobile = useMobile(768);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 데이터가 없는 경우 처리
  const hasData = figures && figures.length > 0;

  // 사용자 상호작용 시 자동 재생 일시 중지
  const pauseAutoplay = () => {
    setAutoplayEnabled(false);
    // 10초 후 자동 재생 다시 활성화
    setTimeout(() => setAutoplayEnabled(true), 10000);
  };

  const nextSlide = useCallback(() => {
    if (!hasData) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % figures.length);
  }, [hasData, figures.length]);

  const prevSlide = () => {
    if (!hasData) return;
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + figures.length) % figures.length
    );
  };

  const goToSlide = (index: number) => {
    if (index === currentIndex || !hasData) return;
    setCurrentIndex(index);
    pauseAutoplay();
  };

  // 자동 슬라이드 기능 (데이터가 있을 때만 활성화)
  useEffect(() => {
    if (!hasData || !autoplayEnabled) return;

    const startAutoplay = () => {
      autoplayTimeoutRef.current = setTimeout(() => {
        nextSlide();
      }, 6000);
    };

    startAutoplay();

    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, [currentIndex, hasData, autoplayEnabled, nextSlide]);

  if (!hasData) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-xl bg-gradient-to-r from-gray-900 via-purple-900 to-gray-800">
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] z-10" />

        {/* 움직이는 배경 요소 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] opacity-50">
            <svg
              className="absolute top-0 left-0 w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="goo">
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="10"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                    result="goo"
                  />
                </filter>
              </defs>
            </svg>
            <motion.div
              className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-purple-600/30 blur-xl"
              animate={{
                x: [0, 30, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute top-3/4 left-1/2 w-80 h-80 rounded-full bg-blue-600/20 blur-xl"
              animate={{
                x: [0, -40, 0],
                y: [0, 20, 0],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-pink-600/20 blur-xl"
              animate={{
                x: [0, 50, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 12,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </div>
        </div>

        <div className="relative z-20 h-full container mx-auto px-4 py-8 flex flex-col justify-center items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-background/10 backdrop-blur-lg p-8 rounded-xl border border-white/10 max-w-2xl"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="rounded-full bg-primary/10 w-20 h-20 flex items-center justify-center mx-auto mb-6"
            >
              <Package className="h-10 w-10 text-primary" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white"
            >
              피규어 컬렉션을 시작하세요
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="text-xl text-white/80 mb-8"
            >
              아직 등록된 피규어가 없습니다. 첫 번째 피규어를 등록하거나
              데이터베이스를 둘러보세요.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
                asChild
              >
                <Link to="/admin/database/add">
                  <Plus className="mr-2 h-4 w-4" />
                  피규어 등록하기
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                asChild
              >
                <Link to="/database">
                  <Database className="mr-2 h-4 w-4" />
                  데이터베이스 둘러보기
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* 검색바 */}
        {/* <div className="absolute bottom-0 left-0 right-0 z-30 transform translate-y-1/2">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="bg-background/90 backdrop-blur-md shadow-xl rounded-xl p-4 border border-white/10"
            >
              <SearchBar />
            </motion.div>
          </div>
        </div> */}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-xl">
      {/* 배경 이미지 슬라이더 */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent z-10" />
            <img
              src={figures[currentIndex].image || "/placeholder.svg"}
              alt={figures[currentIndex].name}
              className="object-cover object-center w-full"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-20 h-full container mx-auto px-4 py-8 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className={cn(isMobile ? "h-full" : "max-w-2xl ml-16")}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className={cn(
                isMobile && "h-full flex flex-col justify-between py-5"
              )}
            >
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                  {figures[currentIndex].name}
                </h1>
                <p className="text-xl md:text-2xl text-white/80 mb-2">
                  {figures[currentIndex].series}
                </p>
                <p className="text-lg text-white/70 mb-6">
                  {figures[currentIndex].manufacturer} | 출시일:{" "}
                  {formatDate(figures[currentIndex].releaseDate)}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg"
                  asChild
                >
                  <Link to={`/database/${figures[currentIndex].id}`}>
                    자세히 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10"
                  asChild
                >
                  <Link to="/database">모든 피규어 보기</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 슬라이드 컨트롤 */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {figures.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all",
              index === currentIndex
                ? "bg-white w-8 shadow-lg shadow-white/20"
                : "bg-white/30 hover:bg-white/50"
            )}
            onClick={() => goToSlide(index)}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>

      {/* 슬라이드 화살표 */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-30">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12 shadow-lg backdrop-blur-sm"
          onClick={() => {
            prevSlide();
            pauseAutoplay();
          }}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">이전 슬라이드</span>
        </Button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-30">
        <Button
          variant="ghost"
          size="icon"
          className="bg-black/30 text-white hover:bg-black/50 rounded-full h-12 w-12 shadow-lg backdrop-blur-sm"
          onClick={() => {
            nextSlide();
            pauseAutoplay();
          }}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">다음 슬라이드</span>
        </Button>
      </div>

      {/* 검색바 */}
      {/* <div className="absolute bottom-0 left-0 right-0 z-30 transform translate-y-1/2">
      <div className="container mx-auto px-4">
        <div className="bg-background/90 backdrop-blur-md shadow-xl rounded-xl p-4 border border-white/10">
          <SearchBar />
        </div>
      </div>
    </div> */}
    </div>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
  }).format(date);
}
