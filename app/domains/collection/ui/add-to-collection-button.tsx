import { Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { FigureSearchCommand } from "~/domains/common/ui/figure-search-command";

export function AddToCollectionButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm"
        >
          <Plus className="mr-2 h-4 w-4" />
          컬렉션 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>컬렉션에 피규어 추가</DialogTitle>
        </DialogHeader>

        <FigureSearchCommand
          onSelect={(figure) => {
            console.log("Selected figure:", figure);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
