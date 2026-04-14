import { uniqBy } from "es-toolkit";
import { create } from "zustand";
import { TFiguresWithQuery } from "~/routes/api.search.figures";

type CalendarAddFormStore = {
  figures: TFiguresWithQuery[];
  selectedFigures: TFiguresWithQuery[];
  // figureShop: Database["public"]["Tables"]["figure_shop"]["Row"][];
  figureShop: Array<{ value: string; label: string; parentId?: string }>;
  setFigures: (
    figures:
      | TFiguresWithQuery[]
      | ((prev: TFiguresWithQuery[]) => TFiguresWithQuery[])
  ) => void;
  setSelectedFigures: (figure: TFiguresWithQuery) => void;
  setFigureShop: (
    shop: Array<{ value: string; label: string; parentId?: string }>
  ) => void;
  addFigures: (newFigures: TFiguresWithQuery[]) => void;
  addSelectedFigure: (figure: TFiguresWithQuery) => void; // 추가
  removeSelectedFigure: (figureId: string) => void; // 추가
  toggleSelectedFigure: (figure: TFiguresWithQuery) => void; // 추가
  reset: () => void;
};

export const useCalendarAddFormStore = create<CalendarAddFormStore>((set) => ({
  figures: [],
  selectedFigures: [],
  figureShop: [],

  setFigures: (figures) =>
    set((state) => ({
      figures: typeof figures === "function" ? figures(state.figures) : figures,
    })),

  setSelectedFigures: (figure) =>
    set((state) => ({
      selectedFigures: uniqBy(
        [...state.selectedFigures, figure],
        (item) => item.id
      ),
    })),

  addFigures: (newFigures) =>
    set((state) => ({
      figures: [...state.figures, ...newFigures],
    })),

  // 선택한 피규어 추가
  addSelectedFigure: (figure) =>
    set((state) => ({
      selectedFigures: [...state.selectedFigures, figure],
    })),

  // 선택한 피규어 제거 (ID 기준)
  removeSelectedFigure: (figureId) =>
    set((state) => ({
      selectedFigures: state.selectedFigures.filter((f) => f.id !== figureId),
    })),

  // 토글 (이미 선택되어 있으면 제거, 없으면 추가)
  toggleSelectedFigure: (figure) =>
    set((state) => {
      const isSelected = state.selectedFigures.some((f) => f.id === figure.id);
      if (isSelected) {
        return {
          selectedFigures: state.selectedFigures.filter(
            (f) => f.id !== figure.id
          ),
        };
      } else {
        return {
          selectedFigures: [...state.selectedFigures, figure],
        };
      }
    }),

  setFigureShop: (shop) =>
    set({
      figureShop: shop,
    }),
  reset: () => set({ figures: [], selectedFigures: [] }),
}));
