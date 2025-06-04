import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";
import { FigureCard } from "./figure-card";
import { useToast } from "~/hooks/use-toast";
import { CollectionFigureDto } from "../model";

export function FigureGrid({ items }: { items: CollectionFigureDto[] }) {
  const { toast } = useToast();
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [editItem, setEditItem] = useState<any>(null);

  const handleDelete = async () => {
    if (!deleteItemId) return;

    try {
      // await removeFromCollection(deleteItemId);

      // 상태 업데이트
      const updatedItems = items.filter((item) => item.id !== deleteItemId);
      // onItemsChange(updatedItems);

      toast({
        title: "삭제 완료",
        description: "컬렉션에서 아이템이 삭제되었습니다.",
      });
    } catch (error) {
      console.error("아이템 삭제 중 오류:", error);
      toast({
        title: "오류",
        description: "아이템 삭제 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setDeleteItemId(null);
    }
  };

  // const handleEdit = (updatedItem: CollectionItem) => {
  //   // 상태 업데이트
  //   const updatedItems = items.map((item) =>
  //     item.id === updatedItem.id ? updatedItem : item
  //   );
  //   onItemsChange(updatedItems);
  //   setEditItem(null);
  // };

  // 피규어 데이터 찾기 함수
  const getFigureData = (figureId: string) => {
    return (
      sampleFigureData.find((fig) => fig.id === figureId) || sampleFigureData[0]
    );
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <p className="text-lg mb-2">컬렉션이 비어있습니다</p>
          <p className="text-sm">첫 번째 피규어를 추가해보세요!</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <FigureCard
            key={item.id}
            {...item}
            onEdit={() => setEditItem(item)}
            onDelete={() => setDeleteItemId(item.id)}
          />
        ))}
        {/* {items.map((item) => {
          const figureData = getFigureData(item.figureId);

          return (
            <FigureCard
              key={item.id}
              id={Number.parseInt(item.id.replace("col_", ""))}
              title={figureData.title}
              price={`₩${item.purchasePrice?.toLocaleString() || 0}`}
              deposit={
                item.depositAmount
                  ? `₩${item.depositAmount.toLocaleString()}`
                  : undefined
              }
              date={new Date(
                item.purchaseDate || item.createdAt
              ).toLocaleDateString("ko-KR")}
              releaseDate={
                item.releaseDate
                  ? new Date(item.releaseDate).toLocaleDateString("ko-KR")
                  : undefined
              }
              status={
                item.status === "wishlist"
                  ? "위시리스트"
                  : item.status === "preordered"
                  ? "예약"
                  : item.status === "ordered"
                  ? "주문"
                  : "소장"
              }
              manufacturer={figureData.manufacturer}
              series={figureData.series}
              image={figureData.image}
              images={figureData.images}
              remainingDays={
                item.status === "preordered"
                  ? Math.floor(Math.random() * 30)
                  : undefined
              }
              purchaseLocation={item.purchaseLocation || "온라인 스토어"}
              rating={
                item.rating ||
                (item.status === "owned"
                  ? Math.floor(Math.random() * 5) + 1
                  : 0)
              }
              description={figureData.description}
              condition={item.condition || "신품"}
              isOpened={item.isOpened}
              displayLocation={item.displayLocation}
              ownershipPeriod={
                item.status === "owned" && item.purchaseDate
                  ? `${Math.floor(
                      (Date.now() - new Date(item.purchaseDate).getTime()) /
                        (1000 * 60 * 60 * 24 * 30)
                    )}개월`
                  : undefined
              }
              lastCleaned={item.lastCleaned}
              onEdit={() => setEditItem(item)}
              onDelete={() => setDeleteItemId(item.id)}
            />
          );
        })} */}
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog
        open={!!deleteItemId}
        onOpenChange={(open) => !open && setDeleteItemId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>컬렉션 아이템 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 아이템을 컬렉션에서 삭제하시겠습니까? 이 작업은 되돌릴
              수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 편집 다이얼로그 */}
      {/* {editItem && (
        <EditCollectionDialog
          item={editItem}
          open={!!editItem}
          onOpenChange={(open) => !open && setEditItem(null)}
          onSave={handleEdit}
          userId={userId}
        />
      )} */}
    </>
  );
}

// 샘플 피규어 데이터 (실제 데이터베이스 연동 전까지 사용)
const sampleFigureData = [
  {
    id: "fig_1",
    title: "블랑: 백묘",
    manufacturer: "굿스마일컴퍼니",
    series: "블루 아카이브",
    image: "/placeholder.svg?height=400&width=300",
    images: [
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    description:
      "블루 아카이브의 인기 캐릭터 '블랑'의 백묘 의상 피규어입니다. 섬세한 디테일과 높은 퀄리티로 제작되었습니다.",
  },
  {
    id: "fig_2",
    title: "넨도로이드 라피",
    manufacturer: "굿스마일컴퍼니",
    series: "원신",
    image: "/placeholder.svg?height=400&width=300",
    images: [
      "/placeholder.svg?height=400&width=300",
      "/placeholder.svg?height=400&width=300",
    ],
    description:
      "원신의 인기 캐릭터 '라피'의 넨도로이드 피규어입니다. 다양한 표정과 포즈를 연출할 수 있습니다.",
  },
  {
    id: "fig_3",
    title: "호시노 PVC 피규어",
    manufacturer: "알터",
    series: "블루 아카이브",
    image: "/placeholder.svg?height=400&width=300",
    images: ["/placeholder.svg?height=400&width=300"],
    description:
      "블루 아카이브의 '호시노'의 1/7 스케일 PVC 피규어입니다. 캐릭터의 매력을 잘 살린 포즈와 표정이 특징입니다.",
  },
];
