import {
  ChevronLeft,
  ChevronRight,
  ImageDown,
  LayoutGrid,
  List,
  Loader2,
  Plus,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { CalendarTimelineGrid } from "./calendar-timeline-grid";
import { CalendarTimelineList } from "./calendar-timeline-list";

import { useNavigate, useRevalidator, useSearchParams } from "@remix-run/react";
import { UserFigureDto } from "../model/user-figure-dto";

import { FigureDetailSheet } from "./figure-detail-sheet";
import { useFigureDetailStore } from "../store/use-figure-detail-store";
import { useFetcherActionState } from "~/hooks/use-fetcher-action-state";
import { cn } from "~/utils";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";

import { toJpeg } from "html-to-image";
import { useRootLoaderData } from "~/hooks/use-root-loader-data";

type CalendarTimelineProps = {
  figures: UserFigureDto[]; // Define the proper type based on your data structure
};

export default function CalendarTimeline({ figures }: CalendarTimelineProps) {
  const { isLoggedIn } = useRootLoaderData();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const yearParam = useMemo(
    () => searchParams.get("y") ?? new Date().getFullYear().toString(),
    [searchParams],
  );
  const filterParam = useMemo(
    () => searchParams.get("f") ?? "paid_at",
    [searchParams],
  );

  const [isExcluded, setIsExcluded] = useState(false);

  // const [searchQuery, setSearchQuery] = useState("");
  // const [statusFilter, setStatusFilter] = useState<string>("all");
  // const [manufacturerFilter, setManufacturerFilter] = useState<string>("all");
  // const [figures, setFigures] = useState(initialFigures);

  // const manufacturers = useMemo(() => {
  // const uniqueManufacturers = [
  //   ...new Set(figures.map((f) => f.manufacturer)),
  // ];
  // return uniqueManufacturers.sort();
  // return [];
  // }, []);

  const handleYearChange = (year: string, direction: "prev" | "next") => {
    const newYear =
      direction === "prev" ? parseInt(year, 10) - 1 : parseInt(year, 10) + 1;
    searchParams.set("y", newYear.toString());
    setSearchParams(searchParams);
  };

  const handleFilterChange = (filter: string) => {
    searchParams.set("f", filter);
    setSearchParams(searchParams);
  };

  const handleGeneralAddClick = () => {
    if (!isLoggedIn) {
      navigate("/auth/login?redirect_to=/calendar/add");
      return;
    }

    navigate("/calendar/add");
  };

  const { sheetOpen, setSheetOpen, selectedFigure, reset } =
    useFigureDetailStore();

  // delete
  const deleteFigure = useFetcherActionState();
  const handleFigureDelete = (figureId: string) => {
    deleteFigure.fetcher.submit(JSON.stringify({ id: figureId }), {
      method: "DELETE",
      encType: "application/json",
      action: "/api/user/figure",
    });
  };

  const revalidator = useRevalidator();

  const ref = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full space-y-4">
      <div className="sticky top-[60px] backdrop-blur rounded-b-md bg-background/80 z-10">
        <div
          className={cn(
            "relative container mx-auto flex flex-col md:flex-row gap-4 md:items-center py-3 px-4 ",
          )}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleYearChange(yearParam, "prev")}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-lg font-bold w-16 text-center">
              {yearParam}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleYearChange(yearParam, "next")}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-1 border border-border rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="size-8"
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="size-8"
                onClick={() => setViewMode("list")}
              >
                <List className="size-4" />
              </Button>
            </div>

            <RadioGroup
              value={filterParam}
              defaultValue={"paid_at"}
              onValueChange={handleFilterChange}
              className="flex flex-wrap gap-2"
            >
              {[
                { value: "paid_at", label: "구매일" },
                { value: "release_year", label: "발매일" },
              ].map((option) => (
                <Label
                  key={option.value}
                  htmlFor={`filter-${option.value}`}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer transition-colors",
                    filterParam === option.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:bg-muted",
                  )}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={`filter-${option.value}`}
                    className="sr-only"
                  />
                  <span className="font-medium text-sm">{option.label}</span>
                </Label>
              ))}
            </RadioGroup>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={isExcluded}
                onCheckedChange={(checked) => setIsExcluded(checked === true)}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                id="exclude-owned"
              />
              <Label htmlFor="exclude-owned" className="cursor-pointer">
                소장 제외하기
              </Label>
            </div>
          </div>
          {/* </div> */}

          <div className="flex items-center gap-2 absolute top-3 right-4 md:top-1/2 md:-translate-y-1/2 ">
            <Button
              className="gap-2 bg-sky-500 hover:bg-sky-600"
              onClick={handleGeneralAddClick}
            >
              <Plus className="size-4 text-white" />
            </Button>
            <Button
              variant={"link"}
              className="gap-2 bg-sky-500 hover:bg-sky-600"
              onClick={() => {
                if (ref.current === null) {
                  return;
                }
                if (isLoading) {
                  return;
                }

                setIsLoading(true);

                toJpeg(ref.current, {
                  cacheBust: true,
                  backgroundColor: "var(--background)",
                  quality: 1,
                }).then((dataUrl) => {
                  const link = document.createElement("a");
                  link.download = `${yearParam}-calendar.png`;
                  link.href = dataUrl;
                  link.click();
                  setIsLoading(false);
                });
              }}
            >
              {isLoading ? (
                <Loader2 className="size-4 text-white animate-spin" />
              ) : (
                <ImageDown className="size-4 text-white" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto ">
        <div ref={ref} className="px-4 py-6 space-y-4">
          <div className="text-sm text-muted-foreground">
            {figures.length} figures found ({yearParam})
          </div>

          {viewMode === "grid" && (
            <CalendarTimelineGrid data={figures} isExcluded={isExcluded} />
          )}
          {viewMode === "list" && <CalendarTimelineList data={figures} />}
        </div>
      </div>

      <FigureDetailSheet
        figure={selectedFigure}
        open={sheetOpen}
        onOpenChange={() => {
          setSheetOpen(!sheetOpen);

          if (sheetOpen) {
            reset();
          }
        }}
        onUpdate={revalidator.revalidate}
        onDelete={handleFigureDelete}
      />
    </div>
  );
}

// const SHOW_DEMO_DATA = false;
