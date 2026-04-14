import { ChevronRight, Truck } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { MyFigureDto } from "~/shared/model";

import { getImageTransformation } from "~/shared/ui";
import { formatDate } from "~/shared/util";
import { cn } from "~/utils";

type FigureItemCardProps = {
  idx: number;
  data: MyFigureDto;
  onTap: () => void;
};

export function FigureItemCard({ idx, data, onTap }: FigureItemCardProps) {
  function formatPrice(n: number) {
    if (!n) return "-";
    return n.toLocaleString("ko-KR");
  }

  return (
    <div
      key={idx}
      className={cn(
        "relative rounded-2xl bg-widget-color-bg-color-page1 overflow-hidden",
      )}
    >
      <div className="relative flex">
        <div className="relative size-28 flex-shrink-0 overflow-hidden bg-widget-color-bg-color-page0">
          <img
            src={
              getImageTransformation(
                data.figure.detail.image[0]?.image_url as string,
                {
                  width: 112,
                  height: 112,
                  quality: 80,
                },
              ) || "/placeholder.svg"
            }
            alt={data.figure.detail.name}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
          />
        </div>
        <div
          className={cn(
            "relative flex flex-col justify-between",
            "flex-1 pt-3 px-4 pb-4 border-b border-widget-color-border-default",
          )}
        >
          <div className="flex flex-col gap-1">
            <p className="text-[10px] text-widget-color-text-opacity-tertiary">
              {data.figure.detail.series?.name}
            </p>
            <p className="text-sm font-semibold text-widget-color-text-opacity-default line-clamp-1">
              {data.figure.detail.name}
            </p>
          </div>

          <Badge
            variant={"secondary"}
            className={cn(
              "absolute top-3 right-4 text-[10px]",
              getStatusBadgeWord(data.status)[1],
            )}
          >
            {getStatusBadgeWord(data.status)[0]}
          </Badge>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                ₩{formatPrice(data.total_price)}
              </span>
              <span className="text-[10px] text-widget-color-text-opacity-tertiary">
                | {data.purchase_site.name}
              </span>
            </div>

            <div className="flex justify-between items-end mt-auto">
              <div className="flex items-center gap-1 text-[10px] text-widget-color-text-opacity-tertiary">
                <span className="text-[10px]">
                  주문일 · {formatDate(data.deposit_paid_at || data.paid_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-2 px-3">
        <div className="flex flex-col">
          <span className="text-[14px] font-semibold">
            ₩{formatPrice(data.total_price)}
          </span>
          <div className="flex items-center gap-1 text-widget-color-text-opacity-tertiary">
            <Truck size={14} />
            <span className="text-[10px]">
              발매 예정 · {data.figure.release_date}
              {/* TODO: release_precision에 따라 발매일 표시 분기처리 (예: "2025-10-15" vs "2025 3분기") */}
            </span>
          </div>
        </div>

        <div>
          <Button
            variant={"ghost"}
            onClick={onTap}
            onKeyUp={onTap}
            size="xs"
            className="cursor-pointer text-widget-color-text-opacity-tertiary group hover:bg-widget-color-fill-opacity-5 hover:text-widget-color-text-opacity-highlight"
          >
            히스토리
            <ChevronRight
              className="group-hover:translate-x-0.5 transition-transform"
              size={14}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

// function getReleaseStatus(release_date: string) {
//   if (!release_date) return "";

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const year = new Date(release_date).getFullYear();
//   const month = new Date(release_date).getMonth() + 1;

//   // 날짜 없으면 월말 기준으로 — "그 달이 완전히 지나야 과거"
//   const day = new Date(year, month, 0).getDate();
//   const releaseDate = new Date(year, month - 1, day);

//   if (releaseDate < today) return release_date;
//   // if (releaseDate.getTime() === today.getTime()) return release_date + " 예정";
//   return release_date + " 예정";
// }

function getStatusBadgeWord(status: string) {
  switch (status) {
    case "reserved":
      return [
        "예약",
        "bg-widget-color-fill-opacity-5 text-widget-color-text-primary-highlight",
      ];
    case "ordered":
      return [
        "구매",
        "bg-widget-color-fill-opacity-10 text-widget-color-text-warning-warning3",
      ];
    case "owned":
      return [
        "소장",
        "bg-widget-color-fill-opacity-10 text-widget-color-text-opacity-secondary",
      ];
    default:
      return ["기타"];
  }
}
