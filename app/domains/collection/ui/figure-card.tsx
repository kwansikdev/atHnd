import { Card, CardContent } from "~/components/ui/card";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Calendar,
  Clock,
  Eye,
  MapPin,
  MoreHorizontal,
  Pencil,
  Sparkles,
  Star,
  StarHalf,
  Trash2,
} from "lucide-react";
import { Progress } from "~/components/ui/progress";
import { useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { CollectionFigureDto } from "../model";
import { cn } from "~/utils";
import { getStatusLabel } from "~/shared/action";
import { DialogBalancePay } from "./dialog-balance-pay";

interface CollectionFigureCardProps extends CollectionFigureDto {
  onEdit?: () => void;
  onDelete?: () => void;
}

export function FigureCard({
  onEdit,
  onDelete,
  ...data
}: CollectionFigureCardProps) {
  const {
    id,
    status,
    total_price,
    deposit_price,
    // balance_price,
    paid_at,
    deposit_paid_at,
    balance_paid_at,
    purchase_site,
    // created_at,
    // updated_at,
    figure,
  } = data;
  // const [isLiked] = useState(false);
  const [, setShowDetails] = useState(false);
  // const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // const [note, setNote] = useState("");

  // const allImages = images.length > 0 ? images : [image];

  // 가격 계산 함수
  // const extractNumber = (priceStr: string) =>
  //   Number(priceStr.replace(/[^\d]/g, ""));
  // const totalPrice = extractNumber(total_price);
  const depositAmount = deposit_price ? deposit_price : 0;
  const remainingAmount = total_price - depositAmount;
  const depositPercentage = deposit_price
    ? Math.round((depositAmount / total_price) * 100)
    : 0;

  const formatPrice = (amount: number) => `₩${amount.toLocaleString()}`;

  // 상태별 색상 설정
  const getStatusColor = (status: CollectionFigureDto["status"]) => {
    switch (status) {
      case "reserved":
        return "bg-blue-500 hover:bg-blue-600";
      case "ordered":
        return "bg-amber-500 hover:bg-amber-600";
      case "owned":
        return "bg-emerald-500 hover:bg-emerald-600";
      // case "wishlist":
      //   return "bg-rose-500 hover:bg-rose-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  // 별점 렌더링
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-500 text-yellow-500"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-500 text-yellow-500"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="h-3 w-3 sm:h-4 sm:w-4 text-gray-300"
        />
      );
    }

    return stars;
  };

  // const toggleLike = () => {
  //   setIsLiked(!isLiked);
  //   toast.info(
  //     isLiked ? "좋아요가 취소되었습니다" : "좋아요에 추가되었습니다",
  //     {
  //       duration: 2000,
  //     }
  //   );

  // toast.info("임시 저장 완료", {
  //                   description: "작성 중인 내용이 임시 저장되었습니다.",
  //                 });
  // };

  // const handleShare = () => {
  //   toast.info("공유 링크가 복사되었습니다", {
  //     duration: 2000,
  //   });
  // };

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
    <>
      <Card
        className={cn(
          "group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 animate-in fade-in-50 slide-in-from-bottom-5"
          // "hover:-translate-y-1"
        )}
      >
        <div className="relative">
          <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              ref={imageRef}
              src={figure.image[0].image_url}
              alt={figure.name}
              width={300}
              height={400}
              className={cn(
                "h-full w-full object-cover transition-all duration-500",
                isImageLoaded ? "opacity-100" : "opacity-0"
                // group-hover:scale-110
              )}
              onLoad={() => setIsImageLoaded(true)}
            />

            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            )}

            {/* 호버 오버레이 - 데스크톱만 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex items-end justify-center pb-4">
              <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <Button
                  size="sm"
                  variant="secondary"
                  className="backdrop-blur-sm bg-card hover:bg-muted/90 transition-all duration-200 hover:scale-105 text-card-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  상세보기
                </Button>
                {status === "reserved" && !balance_paid_at && (
                  <DialogBalancePay figureId={id} />
                )}
                {/* <Button
                  size="sm"
                  variant="secondary"
                  className="backdrop-blur-sm bg-background/90 hover:bg-background transition-all duration-200 hover:scale-105 text-foreground"
                >
                  <Heart
                    className={`h-4 w-4 transition-all duration-200 ${
                      isLiked ? "fill-rose-500 text-rose-500 scale-110" : ""
                    }`}
                  />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="backdrop-blur-sm bg-background/90 hover:bg-background transition-all duration-200 hover:scale-105 text-foreground"
                >
                  <Share2 className="h-4 w-4" />
                </Button> */}
              </div>
            </div>

            {/* 모바일 액션 버튼들 */}
            <div className="absolute bottom-2 left-2 right-2 flex gap-1 sm:hidden">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 text-xs backdrop-blur-sm bg-card/90 hover:bg-muted/90 transition-all duration-200 text-card-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(true);
                }}
              >
                <Eye className="h-3 w-3 mr-1" />
                상세
              </Button>

              {status === "reserved" && !balance_paid_at && (
                <DialogBalancePay figureId={id} />
              )}
              {/* <Button
                size="sm"
                variant="secondary"
                className="backdrop-blur-sm bg-card/90 hover:bg-muted/90 transition-all duration-200 text-card-foreground"
                // onClick={toggleLike}
              >
                <Heart
                  className={`h-3 w-3 transition-all duration-200 ${
                    isLiked ? "fill-rose-500 text-rose-500" : ""
                  }`}
                />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="backdrop-blur-sm bg-card/90 hover:bg-muted/90 transition-all duration-200 text-card-foreground"
                // onClick={handleShare}
              >
                <Share2 className="h-3 w-3" />
              </Button> */}
            </div>
          </div>

          {/* 상태 배지 */}
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <Badge
              className={cn(
                "text-white text-xs transition-all duration-200 hover:scale-105",
                getStatusColor(status)
              )}
            >
              {getStatusLabel(status)}
            </Badge>
            {status === "reserved" && (
              <Badge
                className={cn(
                  "text-white text-xs transition-all duration-200 hover:scale-105",
                  "bg-accent text-accent-foreground"
                )}
              >
                {balance_paid_at ? "결재 완료" : "예약금"}
              </Badge>
            )}
          </div>

          {/* 액션 메뉴 */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-card/50 hover:bg-card backdrop-blur-sm transition-all duration-200 hover:scale-105 text-card-foreground"
                >
                  <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="animate-in slide-in-from-top-2 duration-200"
              >
                <DropdownMenuItem
                  onClick={onEdit}
                  className="transition-colors hover:bg-primary/10"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  수정하기
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 transition-colors hover:bg-red-50"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제하기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* 새 아이템 표시 */}
          {/* {new Date().getTime() - new Date(date).getTime() <
            7 * 24 * 60 * 60 * 1000 && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs animate-pulse">
                NEW
              </Badge>
            </div>
          )} */}
        </div>

        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            {/* 제목과 가격 */}
            <div>
              <h3
                className={cn(
                  "font-semibold text-sm sm:text-lg line-clamp-2 transition-colors duration-200"
                  // "group-hover:text-primary"
                )}
              >
                {figure.name}
              </h3>
              <p className="text-lg sm:text-xl font-bold text-primary">
                ₩{figure.price_kr.toLocaleString()}
              </p>
            </div>

            {/* 메타 정보 */}
            <div className="flex flex-wrap gap-1">
              {figure.manufacturer && (
                <Badge
                  variant="outline"
                  className="text-xs transition-all duration-200 hover:bg-primary/10"
                >
                  {figure.manufacturer.name_ko}
                </Badge>
              )}
              {figure.series && (
                <Badge
                  variant="outline"
                  className="text-xs transition-all duration-200 hover:bg-primary/10"
                >
                  {figure.series.name_ko}
                </Badge>
              )}
            </div>

            {/* 상태별 정보 */}
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {status === "reserved" ? "예약일" : "구매일"}
                </span>
                <span>
                  {status === "reserved" ? deposit_paid_at : paid_at || "미정"}
                </span>
              </div>

              {status === "reserved" && (
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    발매일
                  </span>
                  <span>{figure.release_text || "미정"}</span>
                </div>
              )}

              {status === "owned" && (
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    구매처
                  </span>
                  <span className="truncate max-w-[200px]">
                    {purchase_site.name}
                  </span>
                </div>
              )}
            </div>

            {/* 소장 정보 */}
            {status === "owned" && (
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  평점
                </span>
                <div className="flex">{renderRating(5)}</div>
              </div>
            )}

            {/* 예약금 진행률 */}
            {status === "reserved" && deposit_price && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-600">
                    예약금: {formatPrice(deposit_price)}
                  </span>
                  <span className="text-red-600">
                    잔금: {formatPrice(remainingAmount)}
                  </span>
                </div>
                <Progress
                  value={balance_paid_at ? 100 : depositPercentage}
                  className="h-2 transition-all duration-300"
                />
                {/*
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{depositPercentage}% 완료</span>
                  {remainingDays !== undefined && (
                    <span
                      className={
                        remainingDays <= 7 ? "text-red-500 animate-pulse" : ""
                      }
                    >
                      D-{remainingDays}
                    </span>
                  )}
                </div> */}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// {/* 상세 정보 모달 - 개선된 애니메이션 */}
// <Dialog open={showDetails} onOpenChange={setShowDetails}>
//   <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden p-0 animate-in zoom-in-95 duration-300">
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 h-full">
//       {/* 이미지 섹션 */}
//       <div className="space-y-4 p-4 sm:p-6">
//         <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
//           <img
//             src={allImages[currentImageIndex] || "/placeholder.svg"}
//             alt={title}
//             className="object-cover transition-all duration-300"
//           />

//           {allImages.length > 1 && (
//             <>
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-8 w-8 p-0 transition-all duration-200 hover:scale-110"
//                 onClick={() =>
//                   setCurrentImageIndex(
//                     (prev) =>
//                       (prev - 1 + allImages.length) % allImages.length
//                   )
//                 }
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-8 w-8 p-0 transition-all duration-200 hover:scale-110"
//                 onClick={() =>
//                   setCurrentImageIndex(
//                     (prev) => (prev + 1) % allImages.length
//                   )
//                 }
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </>
//           )}
//         </div>

//         {allImages.length > 1 && (
//           <div className="flex gap-2 overflow-x-auto pb-2">
//             {allImages.map((img, index) => (
//               <button
//                 key={index}
//                 className={`flex-shrink-0 w-12 h-16 sm:w-16 sm:h-20 rounded border-2 overflow-hidden transition-all duration-200 hover:scale-105 ${
//                   index === currentImageIndex
//                     ? "border-primary ring-2 ring-primary/20"
//                     : "border-gray-200"
//                 }`}
//                 onClick={() => setCurrentImageIndex(index)}
//               >
//                 <img
//                   src={img || "/placeholder.svg"}
//                   alt=""
//                   width={64}
//                   height={80}
//                   className="w-full h-full object-cover"
//                 />
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* 정보 섹션 */}
//       <div className="space-y-4 sm:space-y-6 overflow-y-auto p-4 sm:p-6">
//         <DialogHeader>
//           <DialogTitle className="text-xl sm:text-2xl">
//             {title}
//           </DialogTitle>
//           <div className="flex items-center gap-2">
//             <Badge className={getStatusColor(status)}>{status}</Badge>
//             <span className="text-xl sm:text-2xl font-bold text-primary">
//               {price}
//             </span>
//           </div>
//         </DialogHeader>

//         <Tabs defaultValue="details" className="w-full">
//           <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
//             <TabsTrigger
//               value="details"
//               className="transition-all duration-200"
//             >
//               상세정보
//             </TabsTrigger>
//             <TabsTrigger
//               value="payment"
//               className="transition-all duration-200"
//             >
//               결제정보
//             </TabsTrigger>
//             <TabsTrigger
//               value="notes"
//               className="transition-all duration-200"
//             >
//               메모
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent
//             value="details"
//             className="space-y-4 mt-4 animate-in fade-in-50 duration-300"
//           >
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//               <div>
//                 <span className="text-muted-foreground">제조사</span>
//                 <p className="font-medium">{manufacturer}</p>
//               </div>
//               <div>
//                 <span className="text-muted-foreground">시리즈</span>
//                 <p className="font-medium">{series}</p>
//               </div>
//               <div>
//                 <span className="text-muted-foreground">
//                   {status === "예약" ? "예약일" : "구매일"}
//                 </span>
//                 <p className="font-medium">{date}</p>
//               </div>
//               {releaseDate && (
//                 <div>
//                   <span className="text-muted-foreground">발매일</span>
//                   <p className="font-medium">{releaseDate}</p>
//                 </div>
//               )}
//             </div>

//             {status === "소장" && (
//               <div className="space-y-3">
//                 <Separator />
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
//                   <div>
//                     <span className="text-muted-foreground">구매처</span>
//                     <p className="font-medium">{purchaseLocation}</p>
//                   </div>
//                   <div>
//                     <span className="text-muted-foreground">컨디션</span>
//                     <p className="font-medium">{condition}</p>
//                   </div>
//                   <div>
//                     <span className="text-muted-foreground">
//                       개봉상태
//                     </span>
//                     <p className="font-medium">
//                       {isOpened ? "개봉" : "미개봉"}
//                     </p>
//                   </div>
//                   <div>
//                     <span className="text-muted-foreground">평점</span>
//                     <div className="flex">{renderRating(rating)}</div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div>
//               <span className="text-muted-foreground">상세설명</span>
//               <p className="mt-1 text-sm leading-relaxed">
//                 {description}
//               </p>
//             </div>
//           </TabsContent>

//           <TabsContent
//             value="payment"
//             className="space-y-4 mt-4 animate-in fade-in-50 duration-300"
//           >
//             {status === "예약" && deposit ? (
//               <div className="space-y-4">
//                 <div className="text-center">
//                   <div className="text-2xl sm:text-3xl font-bold text-primary">
//                     {depositPercentage}%
//                   </div>
//                   <p className="text-muted-foreground">납부 완료</p>
//                 </div>

//                 <Progress value={depositPercentage} className="h-3" />

//                 <div className="grid grid-cols-2 gap-4 text-center">
//                   <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
//                     <p className="text-sm text-muted-foreground">
//                       예약금
//                     </p>
//                     <p className="font-bold text-emerald-600">
//                       {deposit}
//                     </p>
//                   </div>
//                   <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
//                     <p className="text-sm text-muted-foreground">잔금</p>
//                     <p className="font-bold text-red-600">
//                       {formatPrice(remainingAmount)}
//                     </p>
//                   </div>
//                 </div>

//                 <Button
//                   className="w-full transition-all duration-200 hover:scale-105"
//                   size="lg"
//                 >
//                   <CreditCard className="h-4 w-4 mr-2" />
//                   잔금 납부하기
//                 </Button>
//               </div>
//             ) : (
//               <div className="text-center py-8 text-muted-foreground">
//                 <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                 <p>결제 정보가 없습니다</p>
//               </div>
//             )}
//           </TabsContent>

//           <TabsContent
//             value="notes"
//             className="space-y-4 mt-4 animate-in fade-in-50 duration-300"
//           >
//             <div>
//               <label htmlFor="note" className="text-sm font-medium">
//                 메모
//               </label>
//               <Textarea
//                 id="note"
//                 placeholder="피규어에 대한 메모를 입력하세요..."
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//                 className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
//                 rows={4}
//               />
//             </div>
//             <Button className="w-full transition-all duration-200 hover:scale-105">
//               <MessageSquare className="h-4 w-4 mr-2" />
//               메모 저장
//             </Button>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   </DialogContent>
// </Dialog>
