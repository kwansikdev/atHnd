import { Calendar, CreditCard, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { cn } from "~/utils";
import { RecentUserFigureDto } from "../model";
import { getStatusLabel } from "~/shared/action";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "~/components/ui/tooltip";

export function FigureCard({ ...props }: RecentUserFigureDto) {
  const {
    id,
    status,
    total_price,
    deposit_paid_at,
    balance_price,
    paid_at,
    figure,
    purchase_site,
  } = props;

  const paymentProgress = paid_at
    ? 100
    : Math.round(((total_price - balance_price) / total_price) * 100);

  // 이미지 로드 상태 관리
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (imageRef.current) {
      if (imageRef.current.complete) {
        setIsImageLoaded(true);
      }
    }
  }, [imageRef]);

  return (
    <Card
      key={id}
      className="group overflow-hidden transition-all duration-300 shadow-xl backdrop-blur-sm border-0 animate-in fade-in-50 slide-in-from-bottom-5 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[5/4]  overflow-hidden">
        <img
          ref={imageRef}
          src={figure.image[0].image_url}
          alt={`${figure.name} Thumbnail`}
          className={cn(
            "object-cover object-center w-full h-full transition-transform hover:scale-110 duration-500",
            isImageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsImageLoaded(true)}
        />

        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        )}

        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-card backdrop-blur-sm">
            {getStatusLabel(status)}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="p-4 pb-2">
        <h3
          className={cn(
            "font-bold text-lg line-clamp-1 bg-gradient-to-r bg-clip-text text-transparent",
            "from-blue-600 to-purple-600"
          )}
        >
          {figure.name}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-1">
          {figure.series.name_ko}
        </p>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {figure.manufacturer.name_ko}
        </p>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-3">
        <div className="flex justify-between items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {deposit_paid_at ?? paid_at ?? "-"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">구매일</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{figure.release_text ?? "-"}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">발매 예정일</TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>결제 진행률</span>
            <span className="font-medium">
              {paymentProgress}% (₩
              {(paid_at
                ? total_price
                : total_price - balance_price
              ).toLocaleString()}
              )
            </span>
          </div>
          <Progress value={paymentProgress} className="h-2 bg-slate-200" />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {purchase_site?.name}
          </span>
          <span className="font-medium text-lg">
            ₩{total_price.toLocaleString()}
          </span>
        </div>

        {!paid_at && balance_price && (
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-white"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            잔금 결제 (₩{balance_price.toLocaleString()})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
