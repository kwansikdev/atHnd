import { debounce } from "es-toolkit";
import { Check, Search, X } from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import { SearchFigureDto } from "~/domains/callendar/model";
import { useFetcherActionState } from "~/hooks/use-fetcher-action-state";
import { getImageTransformation } from "~/shared/ui";
import { cn } from "~/utils";
import { AddFormType } from "./sheet";
import { Checkbox } from "~/components/ui/checkbox";

export function SearchSection() {
  const [loadData, setLoadData] = useState<SearchFigureDto[]>([]);

  const { fetcher, data, isLoading } = useFetcherActionState<{
    data: SearchFigureDto[];
    query?: string;
    lastId?: string;
    next?: number;
  }>();

  // const [hasFetched, setHasFetched] = useState(false);
  const searchQuery = useRef<string>("");
  const isSearchStart = useRef<boolean>(false);
  const hasMore = useMemo(
    () => searchQuery.current && data?.data?.length === 30,
    [data?.data?.length],
  ); // 30개면 더 있을 가능성

  // useEffect(() => {
  //   if (sheetOpen && !hasFetched) {
  //     fetcher.load(
  //       `/ap/figure?q=${encodeURIComponent("")}&lId="&page=0`,
  //     );
  //     setHasFetched(true);
  //   }
  // }, [hasFetched, fetcher, sheetOpen]);

  useEffect(() => {
    if (data?.data) {
      if (data.query === searchQuery.current && data.next !== 0) {
        if (data.lastId) {
          // 추가 로드인 경우 기존 데이터에 추가
          setLoadData((prev) => [...prev, ...data.data]);
        }
      } else {
        // 새로운 검색인 경우 교체
        setLoadData(data.data);
      }

      searchQuery.current = data.query || "";
    }
  }, [data]);

  const handleSearchChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    isSearchStart.current = true;

    const value = e.target.value;

    if (!value) {
      setLoadData([]);
      return;
    }

    fetcher.load(`/api/figure?q=${encodeURIComponent(value)}`);
  }, 1000);

  const handleLoadMore = () => {
    const query = data?.query || "";
    const lastId = data?.lastId || "";
    const page = Number(data?.next || 0);
    fetcher.load(
      `/api/figure?q=${encodeURIComponent(query)}&lId=${lastId}&page=${page}`,
    );
  };

  useEffect(() => {
    return () => {
      setLoadData([]);
      searchQuery.current = "";
      isSearchStart.current = false;
    };
  }, [setLoadData]);

  const { control } = useFormContext<AddFormType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "selected",
    keyName: "fieldId",
  });

  return (
    <>
      <div className="max-w-[692px] min-w-[332px] w-full px-3">
        <InputGroup
          className={cn(
            "bg-widget-color-fill-opacity-5 h-[41px] rounded-2xl border-none",
            "has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-widget-color-border-color-primary",
          )}
        >
          <InputGroupInput
            placeholder="검색할 내용을 입력하세요."
            onChange={handleSearchChange}
          />
          <InputGroupAddon>
            <Search className={cn("size-5", "focus-visible:ring-1")} />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div
        className={cn(
          fields.length === 0 && "opacity-0 -mt-[75px] z-[-1]",
          "p-3 bg-widget-color-fill-color-primaryHighlight rounded-2xl mx-3 transition-all",
        )}
        aria-hidden={fields.length === 0}
      >
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-widget-color-fill-color-primaryNormal" />
          <span className="text-sm font-medium text-widget-color-text-primary-default">
            {fields.length}개 선택됨
          </span>
          <button
            onClick={() => remove()}
            className="ml-auto text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
          >
            <X className="h-3 w-3" />
            초기화
          </button>
        </div>
        <ul className="flex items-center gap-1 flex-wrap mt-2 max-h-[102px] overflow-y-auto transition-all">
          {fields.map((f, idx) => (
            <li
              key={f.fieldId}
              className="flex items-center gap-2 bg-widget-color-bg-color-page1 border-widget-color-border-opacity-default rounded-full px-2 py-1"
            >
              <span className="text-[10px] font-medium max-w-24 w-full truncate line-clamp-1">
                {f.detail.name}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(idx);
                }}
                className="hover:text-widget-color-text-primary-default cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex-1 flex flex-col gap-2 overflow-y-auto px-3">
        {fetcher.state === "loading" && (
          <div className="absolute inset-0 bg-widget-color-bg-color-page0/50 z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-widget-color-border-color-primary" />
          </div>
        )}
        <div className="flex-1">
          {loadData.map((item) => {
            const isSelected = fields.some((f) => f.id === item.id);

            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-center p-3 rounded-xl cursor-pointer transition-all border-2",
                  isSelected
                    ? "border-widget-color-border-color-primary"
                    : "border-transparent",
                )}
                role="button"
                tabIndex={0}
                onKeyUp={() => {}}
                onClick={() => {
                  if (isSelected) {
                    remove(fields.findIndex((f) => f.id === item.id));
                  } else {
                    console.log("append item:", item);
                    append(item);
                  }
                }}
              >
                <div className="relative size-20 flex-shrink-0 overflow-hidden bg-widget-color-bg-color-page0">
                  <img
                    src={
                      getImageTransformation(item.detail.images[0].image_url, {
                        width: 112,
                        height: 112,
                        quality: 80,
                      }) || "/placeholder.svg"
                    }
                    alt={item.detail.name}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform rounded-2xl"
                  />
                </div>
                <div
                  className={cn(
                    "relative flex flex-col justify-between",
                    "flex-1 px-4",
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-widget-color-text-opacity-tertiary">
                      {item.detail.manufacturer.name}
                    </span>
                    <p className="text-sm font-semibold line-clamp-1">
                      {item.detail.name}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold">
                        ₩{formatPrice(item.price.kr)}
                      </span>
                    </div>

                    <div className="flex justify-between items-end mt-auto">
                      <div className="flex items-center gap-1 text-[10px] text-widget-color-text-opacity-tertiary">
                        <span className="text-[10px]">
                          발매일 · {item.release.text}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <Checkbox
                  checked={isSelected}
                  className="data-[state=checked]:bg-widget-color-fill-color-primaryNormal data-[state=checked]:border-widget-color-fill-color-primaryNormal"
                />
              </div>
            );
          })}
        </div>
        {hasMore && (
          <div className="p-2">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              onClick={handleLoadMore}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-widget-color-border-color-primary" />
              ) : (
                "Load more"
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

function formatPrice(n: number) {
  if (!n) return "-";
  return n.toLocaleString("ko-KR");
}
