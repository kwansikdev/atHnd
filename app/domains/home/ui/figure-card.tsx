"use client";

import { Badge } from "~/components/ui/badge";
import { UserFigureDto } from "../model/user-figure-dto";
import { cn } from "~/utils";
import { getStatusLabel } from "~/shared/action";
import { getStatusColor } from "~/shared/util";
import { getImageTransformation } from "~/shared/ui";
import { useMemo } from "react";

interface FigureCardProps {
  data: UserFigureDto;
  onClick: () => void;
}

export function FigureCard({ data, onClick }: FigureCardProps) {
  const updatedAt = useMemo(() => {
    return data.deposit_paid_at ?? data.paid_at;
  }, [data]);
  return (
    <div
      className="p-3 rounded-lg bg-background hover:bg-accent/50 transition-colors cursor-pointer group"
      onClick={onClick}
      onKeyUp={onClick}
      tabIndex={0}
      role="button"
    >
      <div className="flex gap-3">
        <div className="relative size-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
          <img
            src={
              getImageTransformation(
                data.figure.detail.image[0]?.image_url as string,
                {
                  width: 96,
                  height: 96,
                  quality: 80,
                }
              ) || "/placeholder.svg"
            }
            alt={data.figure.detail.name}
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm line-clamp-2 text-balance mb-1">
            {data.figure.detail.name}
          </h4>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground mb-2">
              {data.figure.detail.manufacturer?.name}
            </p>
            <p className="text-xs text-muted-foreground mb-2">{updatedAt}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className={cn(
                  "text-white text-xs",
                  getStatusColor(data.status)
                )}
              >
                {getStatusLabel(data.status)}
              </Badge>
              {data.status === "reserved" && (
                <Badge
                  className={cn(
                    "text-white text-xs transition-all duration-200 hover:scale-105",
                    "bg-accent text-accent-foreground"
                  )}
                >
                  {data.balance_paid_at
                    ? "결재 완료"
                    : data.deposit_paid_at
                    ? "예약금"
                    : "결제 완료"}
                </Badge>
              )}
            </div>
            <span className="text-xs font-semibold">
              ₩{data.total_price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
