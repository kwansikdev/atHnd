import { create } from "zustand";
import { MyFigureDto } from "~/shared/model/my-figure-dto";

type FigureStoreType = {
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  //
  userFigureId: string | null;
  setUserFigureId: (id: string) => void;
  //
  selectedFigure: MyFigureDto | null;
  setSelectedFigure: (figure: MyFigureDto) => void;
  reset: () => void;
};

export const useFigureStore = create<FigureStoreType>((set) => ({
  sheetOpen: false,
  setSheetOpen: (open) => set(() => ({ sheetOpen: open })),
  userFigureId: null,
  setUserFigureId: (id) => set(() => ({ userFigureId: id })),
  selectedFigure: null,
  setSelectedFigure: (figure) =>
    set({
      selectedFigure: figure,
    }),
  reset: () => set({ selectedFigure: null, userFigureId: null }),
}));
