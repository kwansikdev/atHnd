import { format, parse } from "date-fns";
import { ko } from "date-fns/locale";
import { orderBy } from "es-toolkit";
import { useEffect, useMemo } from "react";

import { FigureDetailSheet, FigureItemCard } from "./figure";

import { MyFigureDto } from "~/shared/model/my-figure-dto";
import { useFigureStore } from "../store";
import { Button } from "~/components/ui/button";

import { useFetcherActionState } from "~/hooks/use-fetcher-action-state";

type TimeLineProps = {
  figures: MyFigureDto[];
  setFigures: React.Dispatch<React.SetStateAction<MyFigureDto[]>>;
  count: number;
  next: number;
};

export function TimeLine({ figures, setFigures, next }: TimeLineProps) {
  const { fetcher, data, isLoading } = useFetcherActionState<{
    figures: MyFigureDto[];
    count: number;
    lastId: string;
    next: number;
  }>();
  const hasMore = useMemo(() => data?.next !== 0, [data?.next]); // 30개면 더 있을 가능성

  const figuresByYearMonth = useMemo(() => {
    const grouped: Record<string, MyFigureDto[]> = {};

    figures.forEach((figure) => {
      // 소장 제외 필터링
      // if (isExcluded && figure.status === "owned") {
      //   return;
      // }
      const date = new Date(figure.earliest_paid_at);

      const yearMonth = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!grouped[yearMonth]) {
        grouped[yearMonth] = [];
      }
      grouped[yearMonth].push(figure);
    });

    // 정렬
    const sorted = Object.fromEntries(
      orderBy(
        Object.entries(grouped).map(([key, items]) => [
          key,
          orderBy(
            items,
            [(item) => item.deposit_paid_at ?? item.paid_at],
            ["desc"],
          ),
        ]),
        [
          ([key]) => {
            const [year, month] = key.split("-").map(Number);
            return year * 100 + month;
          },
        ],
        ["desc"],
      ),
    );

    return sorted;
  }, [figures]);

  const {
    sheetOpen,
    setSheetOpen,
    userFigureId,
    setUserFigureId,
    setSelectedFigure,
    reset,
  } = useFigureStore();

  const handleLoadMore = () => {
    let nextPage = 0;

    if (!data?.next) nextPage = next;
    else nextPage = data?.next;

    if (nextPage === 0) return;
    fetcher.load(`/api/my/figure?p=${nextPage}`);
  };

  useEffect(() => {
    if (data?.figures) {
      setFigures((prev) => [...prev, ...data!.figures]);
    }
  }, [data, setFigures]);

  return (
    <div className="space-y-4">
      {Object.entries(figuresByYearMonth).map(([yearMonth, figures]) => (
        <section key={yearMonth}>
          <MonthHeader label={yearMonth} count={figures.length} />
          <div className="flex flex-col gap-3">
            {figures.map((data, index) => (
              <FigureItemCard
                key={index}
                idx={index}
                data={data}
                onTap={() => {
                  setSheetOpen(true);
                  setSelectedFigure(data);
                  setUserFigureId(data.id);
                }}
              />
            ))}
          </div>
        </section>
      ))}

      {hasMore ? (
        <div className="py-0">
          <Button
            variant="ghost"
            className="w-full bg-widget-color-fill-opacity-5 text-widget-color-text-opacity-secondary hover:bg-widget-color-fill-opacity-8 hover:text-widget-color-text-opacity-highlight cursor-pointer"
            onClick={handleLoadMore}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-widget-color-border-color-primary" />
            ) : (
              "더보기"
            )}
          </Button>
        </div>
      ) : (
        <div className="p-4 text-center text-widget-color-text-opacity-disabled">
          <span className="text-sm">No More</span>
        </div>
      )}

      <FigureDetailSheet
        open={sheetOpen}
        onOpenChange={() => {
          setSheetOpen(!sheetOpen);
          if (sheetOpen) reset();
        }}
        onUpdate={(updated: Record<string, unknown>) => {
          setFigures((prev) =>
            prev.map((figure) =>
              figure.id === userFigureId ? { ...figure, ...updated } : figure,
            ),
          );
        }}
        // onDelete={handleFigureDelete}
      />
    </div>
  );
}

function MonthHeader({ label, count }: { label: string; count: number }) {
  const formatMonthHeader = (yearMonth: string) => {
    // 1. 문자열 → Date 객체로 파싱
    const date = parse(yearMonth, "yyyy-MM", new Date());

    // 2. 원하는 포맷으로 출력 (한국어 로케일 적용)
    const result = format(date, "yyyy년 MM월", { locale: ko });

    return result;
  };

  return (
    <div className="flex items-baseline gap-2 mb-1">
      <span className="text-sm font-semibold tracking-tight text-widget-color-text-opacity-secondary">
        {formatMonthHeader(label)}
      </span>
      <span className="text-xs font-medium text-widget-color-text-opacity-tertiary">
        ({count})
      </span>
    </div>
  );
}
