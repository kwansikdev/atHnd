import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Link } from "@remix-run/react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Edit,
  MessageSquare,
  Package,
  Star,
  StarHalf,
  Trash2,
} from "lucide-react";
import { UserFigureDto } from "~/shared/model/user-figure-dto";
import { FigureImageDto } from "~/shared/model/figure-image-dto";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Progress } from "~/components/ui/progress";
import { Textarea } from "~/components/ui/textarea";

interface CollectionFigureCardProps {
  id: number;
  title: string;
  price: string;
  deposit?: string;
  date: string;
  releaseDate?: string;
  status: string;
  manufacturer?: string;
  series?: string;
  image: string;
  images?: string[];
  remainingDays?: number;
  purchaseLocation?: string;
  rating?: number;
  description?: string;
  condition?: string;
  isOpened?: boolean;
  displayLocation?: string;
  ownershipPeriod?: string;
  lastCleaned?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function FigureCard({
  id,
  title,
  price,
  deposit,
  date,
  releaseDate,
  status,
  manufacturer,
  series,
  image,
  images = [],
  remainingDays,
  purchaseLocation = "온라인 스토어",
  rating = 0,
  description = "상세 설명이 없습니다.",
  condition = "신품",
  isOpened = true,
  displayLocation = "",
  ownershipPeriod = "",
  lastCleaned = "",
  onEdit,
  onDelete,
}: CollectionFigureCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [note, setNote] = useState("");
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { toast } = useToast();

  const allImages = images.length > 0 ? images : [image];

  // 가격 계산 함수
  const extractNumber = (priceStr: string) =>
    Number(priceStr.replace(/[^\d]/g, ""));
  const totalPrice = extractNumber(price);
  const depositAmount = deposit ? extractNumber(deposit) : 0;
  const remainingAmount = totalPrice - depositAmount;
  const depositPercentage = deposit
    ? Math.round((depositAmount / totalPrice) * 100)
    : 0;

  const formatPrice = (amount: number) => `₩${amount.toLocaleString()}`;

  // 상태별 색상 설정
  const getStatusColor = (status: string) => {
    switch (status) {
      case "예약":
        return "bg-blue-500 hover:bg-blue-600";
      case "주문":
        return "bg-amber-500 hover:bg-amber-600";
      case "소장":
        return "bg-emerald-500 hover:bg-emerald-600";
      case "위시리스트":
        return "bg-rose-500 hover:bg-rose-600";
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

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "좋아요가 취소되었습니다" : "좋아요에 추가되었습니다",
      duration: 2000,
    });
  };

  const handleShare = () => {
    toast({
      title: "공유 링크가 복사되었습니다",
      duration: 2000,
    });
  };

  return (
    <>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 animate-in fade-in-50 slide-in-from-bottom-5">
        <div className="relative">
          <div className="aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              width={300}
              height={400}
              className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-110 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
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
                  className="backdrop-blur-sm bg-white/90 hover:bg-white transition-all duration-200 hover:scale-105"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDetails(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  상세보기
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="backdrop-blur-sm bg-white/90 hover:bg-white transition-all duration-200 hover:scale-105"
                  onClick={toggleLike}
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
                  className="backdrop-blur-sm bg-white/90 hover:bg-white transition-all duration-200 hover:scale-105"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* 모바일 액션 버튼들 */}
            <div className="absolute bottom-2 left-2 right-2 flex gap-1 sm:hidden">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 text-xs backdrop-blur-sm bg-white/90 hover:bg-white transition-all duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(true);
                }}
              >
                <Eye className="h-3 w-3 mr-1" />
                상세
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="backdrop-blur-sm bg-white/90 hover:bg-white transition-all duration-200"
                onClick={toggleLike}
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
                className="backdrop-blur-sm bg-white/90 hover:bg-white transition-all duration-200"
                onClick={handleShare}
              >
                <Share2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* 상태 배지 */}
          <Badge
            className={`absolute top-2 left-2 ${getStatusColor(
              status
            )} text-white text-xs transition-all duration-200 hover:scale-105`}
          >
            {status}
          </Badge>

          {/* 액션 메뉴 */}
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm transition-all duration-200 hover:scale-105"
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
          {new Date().getTime() - new Date(date).getTime() <
            7 * 24 * 60 * 60 * 1000 && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs animate-pulse">
                NEW
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            {/* 제목과 가격 */}
            <div>
              <h3 className="font-semibold text-sm sm:text-lg line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {title}
              </h3>
              <p className="text-lg sm:text-xl font-bold text-primary">
                {price}
              </p>
            </div>

            {/* 메타 정보 */}
            <div className="flex flex-wrap gap-1">
              {manufacturer && (
                <Badge
                  variant="outline"
                  className="text-xs transition-all duration-200 hover:bg-primary/10"
                >
                  {manufacturer}
                </Badge>
              )}
              {series && (
                <Badge
                  variant="outline"
                  className="text-xs transition-all duration-200 hover:bg-primary/10"
                >
                  {series}
                </Badge>
              )}
            </div>

            {/* 상태별 정보 */}
            <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {status === "예약" ? "예약일" : "구매일"}
                </span>
                <span>{date}</span>
              </div>

              {status === "예약" && (
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    발매일
                  </span>
                  <span>{releaseDate || "미정"}</span>
                </div>
              )}

              {status === "소장" && (
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    구매처
                  </span>
                  <span className="truncate max-w-[100px]">
                    {purchaseLocation}
                  </span>
                </div>
              )}
            </div>

            {/* 예약금 진행률 */}
            {status === "예약" && deposit && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-600">예약금: {deposit}</span>
                  <span className="text-red-600">
                    잔금: {formatPrice(remainingAmount)}
                  </span>
                </div>
                <Progress
                  value={depositPercentage}
                  className="h-2 transition-all duration-300"
                />
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
                </div>
              </div>
            )}

            {/* 소장 정보 */}
            {status === "소장" && (
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  평점
                </span>
                <div className="flex">{renderRating(rating)}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 상세 정보 모달 - 개선된 애니메이션 */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden p-0 animate-in zoom-in-95 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-6 h-full">
            {/* 이미지 섹션 */}
            <div className="space-y-4 p-4 sm:p-6">
              <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={allImages[currentImageIndex] || "/placeholder.svg"}
                  alt={title}
                  className="object-cover transition-all duration-300"
                />

                {allImages.length > 1 && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-8 w-8 p-0 transition-all duration-200 hover:scale-110"
                      onClick={() =>
                        setCurrentImageIndex(
                          (prev) =>
                            (prev - 1 + allImages.length) % allImages.length
                        )
                      }
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-8 w-8 p-0 transition-all duration-200 hover:scale-110"
                      onClick={() =>
                        setCurrentImageIndex(
                          (prev) => (prev + 1) % allImages.length
                        )
                      }
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 w-12 h-16 sm:w-16 sm:h-20 rounded border-2 overflow-hidden transition-all duration-200 hover:scale-105 ${
                        index === currentImageIndex
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-gray-200"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt=""
                        width={64}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 정보 섹션 */}
            <div className="space-y-4 sm:space-y-6 overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl">
                  {title}
                </DialogTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(status)}>{status}</Badge>
                  <span className="text-xl sm:text-2xl font-bold text-primary">
                    {price}
                  </span>
                </div>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3 text-xs sm:text-sm">
                  <TabsTrigger
                    value="details"
                    className="transition-all duration-200"
                  >
                    상세정보
                  </TabsTrigger>
                  <TabsTrigger
                    value="payment"
                    className="transition-all duration-200"
                  >
                    결제정보
                  </TabsTrigger>
                  <TabsTrigger
                    value="notes"
                    className="transition-all duration-200"
                  >
                    메모
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="details"
                  className="space-y-4 mt-4 animate-in fade-in-50 duration-300"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">제조사</span>
                      <p className="font-medium">{manufacturer}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">시리즈</span>
                      <p className="font-medium">{series}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {status === "예약" ? "예약일" : "구매일"}
                      </span>
                      <p className="font-medium">{date}</p>
                    </div>
                    {releaseDate && (
                      <div>
                        <span className="text-muted-foreground">발매일</span>
                        <p className="font-medium">{releaseDate}</p>
                      </div>
                    )}
                  </div>

                  {status === "소장" && (
                    <div className="space-y-3">
                      <Separator />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">구매처</span>
                          <p className="font-medium">{purchaseLocation}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">컨디션</span>
                          <p className="font-medium">{condition}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            개봉상태
                          </span>
                          <p className="font-medium">
                            {isOpened ? "개봉" : "미개봉"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">평점</span>
                          <div className="flex">{renderRating(rating)}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-muted-foreground">상세설명</span>
                    <p className="mt-1 text-sm leading-relaxed">
                      {description}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent
                  value="payment"
                  className="space-y-4 mt-4 animate-in fade-in-50 duration-300"
                >
                  {status === "예약" && deposit ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-primary">
                          {depositPercentage}%
                        </div>
                        <p className="text-muted-foreground">납부 완료</p>
                      </div>

                      <Progress value={depositPercentage} className="h-3" />

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            예약금
                          </p>
                          <p className="font-bold text-emerald-600">
                            {deposit}
                          </p>
                        </div>
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm text-muted-foreground">잔금</p>
                          <p className="font-bold text-red-600">
                            {formatPrice(remainingAmount)}
                          </p>
                        </div>
                      </div>

                      <Button
                        className="w-full transition-all duration-200 hover:scale-105"
                        size="lg"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        잔금 납부하기
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>결제 정보가 없습니다</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent
                  value="notes"
                  className="space-y-4 mt-4 animate-in fade-in-50 duration-300"
                >
                  <div>
                    <label className="text-sm font-medium">메모</label>
                    <Textarea
                      placeholder="피규어에 대한 메모를 입력하세요..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="mt-1 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      rows={4}
                    />
                  </div>
                  <Button className="w-full transition-all duration-200 hover:scale-105">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    메모 저장
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// <Card className="overflow-hidden transition-all hover:shadow-md">
//   <div className="relative aspect-[3/4] overflow-hidden">
//     <Link to={`/collection/${item.id}`}>
//       <img
//         src={item.figure.figure_image[0].image_url}
//         alt={item.figure.figure_image[0].id}
//         className="object-cover transition-transform hover:scale-105"
//       />
//       <Badge className={`absolute top-2 right-2 ${status.color}`}>
//         {status.text}
//       </Badge>
//     </Link>
//   </div>

//   <CardContent className="p-4">
//     <Link to={`/collection/${item.id}`} className="hover:underline">
//       <h3 className="font-semibold line-clamp-2">{item.figure.name}</h3>
//     </Link>
//     {item.total_price && (
//       <p className="mt-2 font-medium">
//         ₩{new Intl.NumberFormat("ko-KR").format(item.total_price)}
//       </p>
//     )}

//     <p className="text-sm text-muted-foreground mt-1">
//       {/* {item.figure.manufacturer} */}
//     </p>

//     {item.status === "reserved" && (
//       <p className="text-xs text-muted-foreground mt-1">
//         예약일:{" "}
//         {new Date(
//           item.deposit_paid_at ?? item.paid_at
//         ).toLocaleDateString()}
//       </p>
//     )}
//     {item.status !== "reserved" && (
//       <p className="text-xs text-muted-foreground mt-1">
//         구매일: {new Date(item.paid_at).toLocaleDateString()}
//       </p>
//     )}

//     {/* <p className="text-xs text-muted-foreground mt-1">
//       {item.status === "reserved" ? "예약일" : "구매일"}:{" "}
//       {new Date(item.paid_at).toLocaleDateString()}
//     </p> */}

//     {/* {item.figure.status === "upcoming" && (
//       <p className="text-xs text-muted-foreground mt-1">
//         발매 예정: {format(new Date(item.figure.release_text), "yyyy냔 MM월")}
//       </p>
//     )} */}
//   </CardContent>

//   <CardFooter className="p-4 pt-0 flex justify-between">
//     <Button variant="outline" size="sm" onClick={onEdit}>
//       <Edit className="h-4 w-4 mr-1" />
//       편집
//     </Button>
//     <Button
//       variant="outline"
//       size="sm"
//       className="text-red-500"
//       onClick={onDelete}
//     >
//       <Trash2 className="h-4 w-4 mr-1" />
//       삭제
//     </Button>
//   </CardFooter>
// </Card>
