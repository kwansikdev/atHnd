import { Calendar, CreditCard, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { cn } from "~/utils";

export function FigureCard({ ...props }) {
  const {
    id,
    status,
    name,
    manufacturer,
    series,
    releaseDate,
    price,
    remainingPayment,
    paymentStatus,
    shop,
  } = props;

  const paymentProgress = Math.round(
    ((price - remainingPayment) / price) * 100
  );

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
      // className="overflow-hidden transition-all hover:shadow-lg hover:scale-100 duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-xl"
      className="group overflow-hidden transition-all duration-300 shadow-xl backdrop-blur-sm border-0 animate-in fade-in-50 slide-in-from-bottom-5 hover:shadow-xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          ref={imageRef}
          src={"/placeholder.svg"}
          alt={""}
          className={cn(
            "object-cover w-full h-full transition-transform hover:scale-110 duration-500",
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
            {status}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="p-4 pb-2">
        <h3
          className={cn(
            "font-bold text-lg line-clamp-1 bg-gradient-to-r bg-clip-text text-transparent",
            // "from-slate-900 to-slate-700",
            "from-blue-600 to-purple-600"
          )}
        >
          {name}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-1">{series}</p>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {manufacturer}
        </p>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {new Date(releaseDate).toLocaleDateString()}
            </span>
          </div>
          <Badge variant="outline" className="bg-white/50">
            {paymentStatus}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>결제 진행률</span>
            <span className="font-medium">
              {paymentProgress}% (₩
              {(price - remainingPayment).toLocaleString()})
            </span>
          </div>
          <Progress value={paymentProgress} className="h-2 bg-slate-200" />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{shop}</span>
          <span className="font-medium text-lg">₩{price.toLocaleString()}</span>
        </div>

        {remainingPayment > 0 && (
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-white"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            잔금 결제 (₩{remainingPayment.toLocaleString()})
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
