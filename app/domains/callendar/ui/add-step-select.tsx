import { debounce } from "es-toolkit";
import { Package, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { useFetcherActionState } from "~/hooks/use-fetcher-action-state";
import { TFiguresWithQuery } from "~/routes/api.search.figures";

import { useCalendarAddFormStore } from "../store";
import { cn } from "~/utils";
import { getImageTransformation } from "~/shared/ui";

export function AddStepSelect() {
  const {
    figures,
    setFigures,
    addFigures,
    selectedFigures,
    setSelectedFigures,
    removeSelectedFigure,
  } = useCalendarAddFormStore();

  const { fetcher, data, isSuccess } = useFetcherActionState<{
    data: TFiguresWithQuery[];
    query?: string;
    lastId?: string;
  }>();

  const searchQuery = useRef<string>("");
  const hasMore = data?.data?.length === 30; // 30개면 더 있을 가능성

  useEffect(() => {
    if (data?.data) {
      if (data.query === searchQuery.current) {
        if (data.lastId) {
          // 추가 로드인 경우 기존 데이터에 추가
          addFigures(data.data);
        }
      } else {
        // 새로운 검색인 경우 교체
        setFigures(data.data);
      }

      searchQuery.current = data.query || "";
    }
  }, [addFigures, data, setFigures]);

  const handleLoadMore = () => {
    const query = data?.query || "";
    const lastId = data?.lastId || "";
    fetcher.load(
      `/api/search/figures?q=${encodeURIComponent(query)}&lId=${lastId}`
    );
  };

  const handleSearchChange = debounce((value: string) => {
    if (!value) {
      // setFigures([]);
      return;
    }
    fetcher.load(`/api/search/figures?q=${encodeURIComponent(value)}`);
  }, 1000);

  const handleSelectFigure = (figure: TFiguresWithQuery) => {
    setSelectedFigures(figure);
  };

  const handleRemoveFigure = (id: string) => {
    removeSelectedFigure(id);
  };

  // useEffect(() => {
  //   if (isSuccessFetch) {
  //     setFigures([]);
  //     searchQuery.current = "";
  //   }
  // }, [isSuccessFetch, setFigures]);
  useEffect(() => {
    return () => {
      setFigures([]);
      searchQuery.current = "";
    };
  }, [setFigures]);

  return (
    <>
      {/* <div> */}
      <div className="rounded-lg border border-border bg-card">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search figures by name..."
            onValueChange={handleSearchChange}
          />
          <CommandList className={cn("max-h-[500px]")}>
            {isSuccess && figures.length === 0 && (
              <CommandEmpty>No figures found.</CommandEmpty>
            )}
            {figures.length > 0 && (
              <CommandGroup heading="검색 결과">
                {figures.map((item) => (
                  <CommandItem
                    key={item.id}
                    // value={figure.id}
                    onSelect={() => handleSelectFigure(item)}
                    className="flex items-center gap-3 py-3 cursor-pointer"
                  >
                    <div className="relative size-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={
                          getImageTransformation(
                            item.detail.images[0].image_url,
                            {
                              width: 48,
                              height: 48,
                              quality: 80,
                            }
                          ) || "/placeholder.svg"
                        }
                        alt={item.detail.name}
                        // fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">
                          {item.detail.name}
                        </p>
                        {item.release.no > 1 && (
                          <Badge
                            variant={"default"}
                            className="flex-shrink-0 text-xs"
                          >
                            {item.release.no}차 재판
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.detail.manufacturer.name} · ₩
                        {item.price.kr?.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Release:{" "}
                        {new Date(item.release.text).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "short",
                          }
                        )}
                      </p>
                    </div>
                    {/* <Check className="size-4 text-muted-foreground" /> */}
                  </CommandItem>
                ))}
                {hasMore && (
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground hover:text-foreground"
                      onClick={handleLoadMore}
                    >
                      Load more
                    </Button>
                  </div>
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </div>

      {/* Selected Figures List */}

      <div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Selected Figures</h2>
            <Badge variant="secondary">{selectedFigures.length} selected</Badge>
          </div>
          {selectedFigures.length === 0 && (
            <div className="rounded-lg border border-dashed border-border p-8 text-center">
              <Package className="size-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                {/* 예약한 피규어, 캘린더에 쏙 추가해봐요! */}
                예약한 피규어를 찾아 캘린더에 추가해요!
              </p>
            </div>
          )}
          {selectedFigures.length > 0 && (
            <div>
              {selectedFigures.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center">
                  <Package className="size-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">
                    Search and select figures to add to your collection
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedFigures.map((figure) => (
                    <div
                      key={figure.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border"
                    >
                      <div className="relative size-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={
                            getImageTransformation(
                              figure.detail.images[0].image_url,
                              {
                                width: 48,
                                height: 48,
                                quality: 80,
                              }
                            ) || "/placeholder.svg"
                          }
                          alt={figure.detail.name}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">
                            {figure.detail.name}
                          </p>
                          {figure.release.no > 1 && (
                            <Badge
                              variant={"default"}
                              className="flex-shrink-0 text-xs"
                            >
                              {figure.release.no}차 재판
                            </Badge>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {figure.detail.manufacturer.name} · ₩
                          {figure.price.kr?.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Release:{" "}
                          {new Date(figure.release.text).toLocaleDateString(
                            "ko-KR",
                            {
                              year: "numeric",
                              month: "short",
                            }
                          )}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveFigure(figure.id)}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
