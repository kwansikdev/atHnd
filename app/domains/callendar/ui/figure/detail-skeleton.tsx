import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

const STEP_COUNT = 4;

export function FigureDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xl overflow-hidden h-[435px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between pt-4 px-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-16 h-16 rounded-xl flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="w-44 h-4" />
            <Skeleton className="w-24 h-3" />
          </div>
        </div>
        {/* <Skeleton className="w-5 h-5 rounded-full" /> */}
      </div>

      <Separator />

      {/* 바디 */}
      <div className="min-h-[236px] px-4">
        <Skeleton className="w-28 h-3.5 mb-5" />

        {/* 타임라인 스텝 */}
        {Array.from({ length: STEP_COUNT }).map((_, i) => {
          const isLast = i === STEP_COUNT - 1;
          return (
            <div key={i} className="flex gap-3 mb-4">
              <div className="flex flex-col items-center flex-shrink-0">
                <Skeleton className="w-2.5 h-2.5 rounded-full mt-1" />
                {!isLast && (
                  <div className="w-px flex-1 min-h-2 bg-border mt-1" />
                )}
              </div>
              <div
                className={`flex flex-1 justify-between ${!isLast ? "pb-5" : "pb-0"}`}
              >
                <Skeleton className="w-16 h-3.5" />
                {!isLast && <Skeleton className="w-16 h-3.5" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA 버튼 */}
      <div className="p-5">
        <Skeleton className="w-full h-9 rounded-full" />
      </div>
    </div>
  );
}
