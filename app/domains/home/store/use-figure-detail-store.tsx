import { create } from "zustand";
import { UserFigureDto } from "../model/user-figure-dto";

type FigureDetailStoreType = {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  selectedFigure: UserFigureDto | null;
  setSelectedFigure: (figure: UserFigureDto) => void;
  reset: () => void;
};

export const useFigureDetailStore = create<FigureDetailStoreType>((set) => ({
  sheetOpen: false,
  setSheetOpen: (open) => set(() => ({ sheetOpen: open })),
  selectedFigure: null,
  setSelectedFigure: (figure) =>
    set({
      selectedFigure: figure,
    }),
  reset: () => set({ selectedFigure: null }),
}));
