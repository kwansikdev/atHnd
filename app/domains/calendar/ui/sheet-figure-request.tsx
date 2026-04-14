import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/utils";

type SheetFigureRequestProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SheetFigureRequest({
  open,
  onOpenChange,
}: SheetFigureRequestProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn("w-2xl overflow-y-auto gap-0 transition-all")}
      >
        <SheetHeader className="border-b-[1px]">
          <SheetTitle>Request Figures</SheetTitle>
        </SheetHeader>

        <div className="space-y-2">
          <div>
            <div className="space-y-10 py-6 px-4 sm:px-6">
              <div className="text-sm grid gap-2 md:grid md:grid-cols-12">
                <div className="flex flex-col space-y-2 col-span-4">
                  <Label
                    className="block text-foreground text-sm break-all"
                    htmlFor="name"
                  >
                    name
                  </Label>
                  <span className="text-foreground/60 text-sm" id="-optional">
                    text
                  </span>
                </div>

                <div className="col-span-8">
                  <Input
                    id="category-id"
                    // value={selectedFigure.detail.category?.id ?? ""}

                    className="w-full"
                  />
                  {/* <Textarea id="name" className="w-full" /> */}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-10 py-6 px-4 sm:px-6">
              <div className="text-sm grid gap-2 md:grid md:grid-cols-12">
                <div className="flex flex-col space-y-2 col-span-4">
                  <Label
                    className="block text-foreground text-sm break-all"
                    htmlFor="manufacturer"
                  >
                    manufacturer
                  </Label>
                  <span className="text-foreground/60 text-sm" id="-optional">
                    text
                  </span>
                </div>

                <div className="col-span-8">
                  <Input
                    id="manufacturer-id"
                    // value={selectedFigure.detail.manufacturer?.id ?? ""}
                    readOnly
                    className="w-full"
                  />
                  <Textarea
                    id="manufacturer"
                    // value={selectedFigure.detail.manufacturer?.name ?? ""}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-10 py-6 px-4 sm:px-6">
              <div className="text-sm grid gap-2 md:grid md:grid-cols-12">
                <div className="flex flex-col space-y-2 col-span-4">
                  <Label
                    className="block text-foreground text-sm break-all"
                    htmlFor="scale"
                  >
                    scale
                  </Label>
                  <span className="text-foreground/60 text-sm" id="-optional">
                    text
                  </span>
                </div>

                <div className="col-span-8">
                  <Input
                    id="scale-id"
                    // value={selectedFigure.detail.scale?.id ?? ""}
                    readOnly
                    className="w-full"
                  />
                  <Textarea
                    id="scale"
                    // value={selectedFigure.detail.scale?.name ?? ""}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <Separator />
            <div>
              <div className="space-y-10 py-6 px-4 sm:px-6">
                <div className="text-sm grid gap-2 md:grid md:grid-cols-12">
                  <div className="flex flex-col space-y-2 col-span-4">
                    <Label
                      className="block text-foreground text-sm break-all"
                      htmlFor="series"
                    >
                      Series
                    </Label>
                    <span className="text-foreground/60 text-sm" id="-optional">
                      text
                    </span>
                  </div>

                  <div className="col-span-8">
                    <Input
                      id="series-id"
                      // value={selectedFigure.detail.series?.id ?? ""}
                      readOnly
                      className="w-full"
                    />
                    <Textarea
                      id="series"
                      // value={selectedFigure.detail.series?.name ?? ""}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-10 py-6 px-4 sm:px-6">
                <div className="text-sm grid gap-2 md:grid md:grid-cols-12">
                  <div className="flex flex-col space-y-2 col-span-4">
                    <Label
                      className="block text-foreground text-sm break-all"
                      htmlFor="character"
                    >
                      Character
                    </Label>
                    <span className="text-foreground/60 text-sm" id="-optional">
                      text
                    </span>
                  </div>

                  <div className="col-span-8">
                    <Input
                      id="character-id"
                      // value={selectedFigure.detail.character?.id ?? ""}
                      readOnly
                      className="w-full"
                    />
                    <Textarea
                      id="character"
                      // value={selectedFigure.detail.character?.name ?? ""}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
