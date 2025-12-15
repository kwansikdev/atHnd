import { CreditCard } from "lucide-react";
import { Database } from "supabase/schema";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useFetcherActionState } from "~/hooks/use-fetcher-action-state";
import { getStatusLabel } from "~/shared/action";

export function DialogUpdateStatus({
  figureId,
  status,
}: {
  figureId: string;
  status: Database["public"]["Enums"]["user_figure_status"];
}) {
  const { Form, isLoading } = useFetcherActionState();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="backdrop-blur-sm bg-card/90 hover:bg-muted/90 transition-all duration-200 text-card-foreground"
        >
          <CreditCard />
        </Button>
      </DialogTrigger>
      <Form method="post" action="/action/confirm-payment">
        <DialogContent>
          <DialogHeader>
            <DialogTitle>상태 업데이트</DialogTitle>
            <DialogDescription>
              {getStatusLabel(status)} 상태를 변경하시겠습니까?
            </DialogDescription>
          </DialogHeader>

          <input type="hidden" name="figure_id" value={figureId} />
          <input type="hidden" name="status" value={status} />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "처리 중..." : "확인"}
            </Button>
            {/* </div> */}
          </DialogFooter>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
