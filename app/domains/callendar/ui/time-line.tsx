import { format, parse } from "date-fns";
import { ko } from "date-fns/locale";
import { orderBy } from "es-toolkit";
import { useMemo } from "react";

import { FigureDetailSheet, FigureItemCard } from "./figure";

import { MyFigureDto } from "~/shared/model/my-figure-dto";
import { useFigureStore } from "../store";

type TimeLineProps = {
  figures: MyFigureDto[];
  setFigures: React.Dispatch<React.SetStateAction<MyFigureDto[]>>;
};

export function TimeLine({ figures, setFigures }: TimeLineProps) {
  // const { fetcher } = useFetcherActionState<typeof loader>();

  const figuresByYearMonth = useMemo(() => {
    const grouped: Record<string, MyFigureDto[]> = {};

    figures.forEach((figure) => {
      // 소장 제외 필터링
      // if (isExcluded && figure.status === "owned") {
      //   return;
      // }
      const date = new Date((figure.deposit_paid_at ?? figure.paid_at)!);

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
            [(item) => item.deposit_paid_at || item.paid_at],
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

  return (
    <div className="space-y-3">
      <div className="bg-widget-color-bg-color-page1 rounded-2xl py-3 px-4">
        <div className="mb-3">
          <p className="text-sm text-widget-color-text-opacity-tertiary">
            나누고 싶은 얘기가 있으신가요?
          </p>
        </div>
        <div></div>
      </div>

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
    <div className="flex items-baseline gap-2 mt-7 mb-1">
      <span className="text-sm font-semibold tracking-tight text-widget-color-text-opacity-secondary">
        {formatMonthHeader(label)}
      </span>
      <span className="text-xs font-medium text-widget-color-text-opacity-tertiary">
        ({count})
      </span>
    </div>
  );
}
