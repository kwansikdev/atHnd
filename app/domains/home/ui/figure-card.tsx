"use client";

import { Badge } from "~/components/ui/badge";
import { UserFigureDto } from "../model/user-figure-dto";
import { cn } from "~/utils";
import { getStatusLabel } from "~/shared/action";
import { getStatusColor } from "~/shared/util";

interface FigureCardProps {
  data: UserFigureDto;
  onClick: () => void;
}

export function FigureCard({ data, onClick }: FigureCardProps) {
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
            src={data.figure.detail.image[0]?.image_url || "/placeholder.svg"}
            alt={data.figure.detail.name}
            // fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm line-clamp-2 text-balance mb-1">
            {data.figure.detail.name}
          </h4>
          <p className="text-xs text-muted-foreground mb-2">
            {data.figure.detail.manufacturer?.name}
          </p>
          <div className="flex items-center justify-between">
            <Badge
              variant="secondary"
              className={cn("text-white text-xs", getStatusColor(data.status))}
            >
              {getStatusLabel(data.status)}
            </Badge>
            <span className="text-xs font-semibold">
              ₩{data.total_price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
