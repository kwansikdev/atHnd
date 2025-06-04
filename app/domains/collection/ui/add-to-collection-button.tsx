import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { FigureSearchCommand } from "~/domains/common/ui/figure-search-command";

export function AddToCollectionButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        컬렉션 추가
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>컬렉션에 피규어 추가</DialogTitle>
          </DialogHeader>

          <FigureSearchCommand
            onSelect={(figure) => {
              console.log("Selected figure:", figure);
              setOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
