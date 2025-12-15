import { ShoppingCart } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { FigureSearchCommand } from "~/domains/common/ui/figure-search-command";

export function AddToOrdersButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm"
          // className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          예약/구매 등록
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 예약/구매 추가</DialogTitle>
          <DialogDescription>
            피규어 데이터베이스에서 선택하여 예약/구매 정보를 추가하세요.
          </DialogDescription>
        </DialogHeader>

        <FigureSearchCommand onSelect={(figure) => console.log(figure)} />
      </DialogContent>
    </Dialog>
  );
}
