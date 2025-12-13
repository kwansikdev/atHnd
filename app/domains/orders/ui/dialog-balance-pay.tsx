import { useRevalidator } from "@remix-run/react";
import { useEffect } from "react";
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

export function DialogBalancePay({
  figureId,
  children,
}: {
  figureId: string;
  children: React.ReactNode;
}) {
  const { Form, isLoading, isSuccess } = useFetcherActionState();
  const { revalidate } = useRevalidator();

  useEffect(() => {
    if (isSuccess) {
      revalidate();
    }
  }, [isSuccess, revalidate]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form method="post" action="/action/collection/balance-payment">
          <DialogHeader>
            <DialogTitle>잔금 결제 확인</DialogTitle>
            <DialogDescription>
              잔금 결제를 완료 처리하시겠습니까?
            </DialogDescription>
          </DialogHeader>

          <input type="hidden" name="figure_id" value={figureId} />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button type="submit">{isLoading ? "처리 중..." : "확인"}</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
