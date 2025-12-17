import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { CalendarTimelineGrid } from "./calendar-timeline-grid";
import { CalendarTimelineList } from "./calendar-timeline-list";

import { useNavigate, useRevalidator, useSearchParams } from "@remix-run/react";
import { UserFigureDto } from "../model/user-figure-dto";

import { FigureDetailSheet } from "./figure-detail-sheet";
import { useFigureDetailStore } from "../store/use-figure-detail-store";
import { useFetcherActionState } from "~/hooks/use-fetcher-action-state";

type CalendarTimelineProps = {
  figures: UserFigureDto[]; // Define the proper type based on your data structure
};

export default function CalendarTimeline({ figures }: CalendarTimelineProps) {
  // const { isLoggedIn } = useRootLoaderData();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const yearParam = useMemo(
    () => searchParams.get("y") ?? new Date().getFullYear().toString(),
    [searchParams]
  );

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

  const handleGeneralAddClick = () => {
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-3 px-2 backdrop-blur z-10 sticky top-[60px] rounded-b-md">
        {/* <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search figures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="purchased">Purchased</SelectItem>
              <SelectItem value="wishlist">Wishlist</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={manufacturerFilter}
            onValueChange={setManufacturerFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Manufacturer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Manufacturers</SelectItem>
              {manufacturers.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}

        <div className="flex items-center gap-4">
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
        </div>

        <Button
          className="gap-2 bg-sky-500 hover:bg-sky-600"
          onClick={handleGeneralAddClick}
        >
          <Plus className="size-4" />
          {/* Add Figure */}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        {figures.length} figures found ({yearParam})
      </div>

      {viewMode === "grid" && <CalendarTimelineGrid data={figures} />}
      {viewMode === "list" && <CalendarTimelineList data={figures} />}

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
