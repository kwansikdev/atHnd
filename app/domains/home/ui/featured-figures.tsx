"use client";

import { useState, useEffect } from "react";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Package,
  Plus,
  Sparkles,
} from "lucide-react";
import { cn } from "~/utils";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { motion } from "framer-motion";

interface FeaturedFigure {
  id: string;
  name: string;
  image: string;
  manufacturer: string;
  series: string;
  price: number;
  releaseDate: string;
  limited?: boolean;
}

interface FeaturedFiguresProps {
  title: string;
  description?: string;
  figures: FeaturedFigure[];
  viewAllLink: string;
}

export function FeaturedFigures({
  title,
  description,
  figures,
  viewAllLink,
}: FeaturedFiguresProps) {
  const [visibleItems, setVisibleItems] = useState(4);
  const [startIndex, setStartIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 데이터가 있는지 확인
  const hasData = figures && figures.length > 0;

  // 반응형으로 보여줄 아이템 수 조정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1);
      } else if (window.innerWidth < 768) {
        setVisibleItems(2);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(3);
      } else {
        setVisibleItems(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    if (!hasData) return;
    setStartIndex(
      (prev) => (prev + 1) % Math.max(1, figures.length - visibleItems + 1)
    );
  };

  const prevSlide = () => {
    if (!hasData) return;
    setStartIndex(
      (prev) =>
        (prev - 1 + Math.max(1, figures.length - visibleItems + 1)) %
        Math.max(1, figures.length - visibleItems + 1)
    );
  };

  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{title}</h2>
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </div>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-sm"
            onClick={prevSlide}
            disabled={!hasData || figures.length <= visibleItems}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-sm"
            onClick={nextSlide}
            disabled={!hasData || figures.length <= visibleItems}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="font-medium" asChild>
            <Link to={viewAllLink}>
              모두 보기
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {!hasData ? (
        // 데이터가 없는 경우 표시할 UI
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 text-center border border-dashed bg-muted/30">
            <div className="flex flex-col items-center justify-center gap-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="rounded-full bg-primary/10 p-4"
              >
                <Package className="h-8 w-8 text-primary" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-xl font-medium"
              >
                {title} 데이터가 없습니다
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-sm text-muted-foreground max-w-md"
              >
                아직 등록된 피규어가 없습니다. 새로운 피규어를 등록하여 컬렉션을
                시작해보세요.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Button
                  variant="default"
                  size="sm"
                  className="mt-2 shadow-sm"
                  asChild
                >
                  <Link to="/admin/database/add">
                    <Plus className="mr-2 h-4 w-4" />
                    피규어 등록하기
                  </Link>
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      ) : (
        // 데이터가 있는 경우 표시할 UI
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              width: `${(100 / visibleItems) * figures.length}%`,
              transform: `translateX(-${(startIndex * 100) / figures.length}%)`,
            }}
          >
            {figures.map((figure, index) => (
              <div
                key={figure.id}
                className={cn("px-2", `w-[${100 / figures.length}%]`)}
                style={{
                  width: `${100 / figures.length}%`,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link to={`/database/${figure.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card
                      className={cn(
                        "h-full transition-all duration-300 overflow-hidden",
                        hoveredIndex === index
                          ? "shadow-xl scale-[1.03] bg-background border-primary/20"
                          : "hover:shadow-md hover:border-primary/10"
                      )}
                    >
                      <div className="relative aspect-square w-full overflow-hidden">
                        <img
                          src={figure.image || "/placeholder.svg"}
                          alt={figure.name}
                          className={cn(
                            "object-cover transition-transform duration-500",
                            hoveredIndex === index ? "scale-110" : ""
                          )}
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        {figure.limited && (
                          <div className="absolute top-2 right-2 z-10">
                            <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 shadow-md">
                              한정판
                            </Badge>
                          </div>
                        )}
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300",
                            hoveredIndex === index ? "opacity-100" : ""
                          )}
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium line-clamp-1">
                          {figure.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {figure.series}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {figure.manufacturer}
                        </p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <p className="font-bold text-primary">
                          {formatPrice(figure.price)}
                        </p>
                        <div
                          className={cn(
                            "opacity-0 transition-opacity duration-300",
                            hoveredIndex === index ? "opacity-100" : ""
                          )}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
