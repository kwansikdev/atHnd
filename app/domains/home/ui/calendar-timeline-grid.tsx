import { useMemo } from "react";
import { UserFigureDto } from "../model/user-figure-dto";
import { FigureCard } from "./figure-card";
import { useSearchParams } from "@remix-run/react";
import { useFigureDetailStore } from "../store/use-figure-detail-store";
import { orderBy } from "es-toolkit";

type CalendarTimelineGridProps = {
  data: UserFigureDto[];
  isExcluded: boolean;
};

export function CalendarTimelineGrid(props: CalendarTimelineGridProps) {
  const { data, isExcluded = false } = props;
  const [searchParams] = useSearchParams();
  const yearParam = useMemo(
    () => searchParams.get("y") ?? new Date().getFullYear().toString(),
    [searchParams]
  );
  const filterParam = useMemo(
    () => searchParams.get("f") ?? "paid_at",
    [searchParams]
  );

  const figuresByMonth = useMemo(() => {
    const grouped: Record<number, UserFigureDto[]> = {};

    data.forEach((figure) => {
      // 소장 제외 필터링
      if (isExcluded && figure.status === "owned") {
        return;
      }

      const date =
        filterParam === "paid_at"
          ? new Date(figure.deposit_paid_at ?? figure.paid_at)
          : new Date(figure.figure.release_date);

      const month = date.getMonth();

      if (!grouped[month]) {
        grouped[month] = [];
      }
      if (date.getFullYear() === parseInt(yearParam))
        grouped[month].push(figure);
    });

    // 정렬
    Object.keys(grouped).forEach((key) => {
      const month = parseInt(key);
      grouped[month] = orderBy(
        grouped[month],
        [(obj) => obj.deposit_paid_at || obj.paid_at, "created_at"],
        ["desc"]
      );
    });

    return grouped;
  }, [data, filterParam, isExcluded, yearParam]);

  const { setSheetOpen, setSelectedFigure } = useFigureDetailStore();

  const handleFigureClick = (figure: UserFigureDto) => {
    setSheetOpen(true);
    setSelectedFigure(figure);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {MONTHS.map((month, index) => {
        const figures = figuresByMonth[index] || [];

        return (
          <div
            key={month}
            className="flex flex-col h-[509px] bg-muted/30 rounded-lg"
          >
            <div className="flex items-center gap-1 mb-2 shrink-0 border-b border-border p-4">
              <h3 className="font-bold text-lg">{month}</h3>
              <span className="text-sm text-muted-foreground ml-2">
                ({figures.length})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 px-1">
              {figures.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {index + 1}월은 조용하네요! 등록된 피규어가 없어요😭
                </p>
              ) : (
                figures.map((figure) => (
                  <FigureCard
                    key={figure.id}
                    data={figure}
                    onClick={() => handleFigureClick(figure)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
