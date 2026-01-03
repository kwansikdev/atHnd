import {
  FetcherWithComponents,
  useFetcher,
  useOutletContext,
} from "@remix-run/react";
import { ChevronDownIcon, Copy, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Switch } from "~/components/ui/switch";
import { TAddFigureContext } from "~/routes/admin.figures.add";
import ImageUploader from "~/shared/ui/image-uploader";
import { SearchableListBox } from "~/shared/ui/searchable-list-box";
import { cn } from "~/utils";

import { ko } from "date-fns/locale";
import {
  initialFormData,
  TAdminFigureAddForm,
  TInitialFormData,
} from "~/routes/admin.figures.add._index";
import { SearchType } from "~/routes/api.search";
import { format } from "date-fns";

type AddFigureFormProps = {
  figure: FieldArrayWithId<TAdminFigureAddForm, "figures", "id">;
  index: number;
  fields: TInitialFormData[];
  append: UseFieldArrayAppend<TAdminFigureAddForm, "figures">;
  remove: UseFieldArrayRemove;
};

export function AddFigureForm({
  figure,
  index,
  fields,
  append,
  remove,
}: AddFigureFormProps) {
  const { category, scale } = useOutletContext<TAddFigureContext>();
  const { control } = useFormContext<TAdminFigureAddForm>();
  const seriesId = useWatch({
    control,
    name: `figures.${index}.p_series_id`,
  });
  const [open, setOpen] = useState(false);

  function duplicateForm() {
    append(initialFormData);
  }

  const seriesFetcher = useFetcher<{
    results: Array<{ value: string; label: string; parentId?: string }>;
  }>();
  const characterFetcher = useFetcher<{
    results: Array<{ value: string; label: string }>;
  }>();
  const manufacturerFetcher = useFetcher<{
    results: Array<{ value: string; label: string }>;
  }>();

  useEffect(() => {
    seriesFetcher.load(`/api/search?type=series`);
    manufacturerFetcher.load(`/api/search?type=manufacturer`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch =
    (
      fetcher: FetcherWithComponents<{
        results: Array<{
          value: string;
          label: string;
          parentId?: string;
        }>;
      }>,
      type: SearchType,
      parentId?: string
    ) =>
    (query: string) => {
      const params = new URLSearchParams({
        q: query,
        type,
      });

      if (parentId) {
        params.append("seriesId", parentId);
      }

      fetcher.load(`/api/search?${params.toString()}`);
    };

  return (
    <div
      key={figure.id}
      className="relative rounded-xl border bg-card p-6 space-y-6"
    >
      <div className="flex items-center justify-between pb-4 border-b">
        <h2 className="text-lg font-semibold">Figure #{index + 1}</h2>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={duplicateForm}
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
          {fields.length > 1 && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              className="text-destructive hover:text-destructive"
              title="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Basic Information
        </h3>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> */}
        <div className="space-y-2 sm:col-span-2">
          <FormField
            control={control}
            name={`figures.${index}.p_name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={`name-${figure.id}`}>
                  Figure Name *
                </FormLabel>
                <FormControl>
                  <Input
                    id={`name-${figure.id}`}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Hatsune Miku: Birthday 2024 Ver."
                    required
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        {/* </div> */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="space-y-2">
            <FormField
              control={control}
              name={`figures.${index}.p_series_id`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`series-${figure.id}`}>
                    시리즈 *
                  </FormLabel>
                  <FormControl>
                    <SearchableListBox
                      options={seriesFetcher.data?.results ?? []}
                      value={field.value}
                      onSearch={handleSearch(seriesFetcher, "series")}
                      onChange={(value: string) => {
                        field.onChange(value);

                        const params = new URLSearchParams({
                          // q: query,
                          type: "character",
                          seriesId: value,
                        });

                        characterFetcher.load(
                          `/api/search?${params.toString()}`
                        );
                      }}
                      onCreateNew={() => {
                        // handleCreateSeries
                      }}
                      placeholder="Search series..."
                      recentValues={[]}
                      isHiddenInput
                      isLoading={seriesFetcher.state === "loading"}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </section>

          <section className="space-y-2">
            <FormField
              control={control}
              name={`figures.${index}.p_character_id`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`manufacturer-${figure.id}`}>
                    캐릭터 *
                  </FormLabel>
                  <FormControl>
                    <SearchableListBox
                      options={
                        characterFetcher.state === "loading"
                          ? []
                          : characterFetcher.data?.results ?? []
                      }
                      value={field.value}
                      onSearch={handleSearch(
                        characterFetcher,
                        "character",
                        seriesId
                      )}
                      onChange={field.onChange}
                      onCreateNew={() => {
                        // handleCreateCharacter
                      }}
                      placeholder="Search character..."
                      recentValues={[]}
                      isLoading={characterFetcher.state === "loading"}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </section>
        </div>

        <div className="space-y-2">
          <FormField
            control={control}
            name={`figures.${index}.p_manufacturer_id`}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={`manufacturer-${figure.id}`}>
                  제조사 *
                </FormLabel>
                <FormControl>
                  <SearchableListBox
                    options={manufacturerFetcher.data?.results ?? []}
                    value={field.value}
                    onChange={field.onChange}
                    onCreateNew={() => {
                      // handleCreateManufacturer
                    }}
                    placeholder="Search manufacturer..."
                    recentValues={[]}
                    isHiddenInput
                    isLoading={manufacturerFetcher.state === "loading"}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </section>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Category & Scale
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <section className="space-y-2">
            <FormField
              control={control}
              name={`figures.${index}.p_category_id`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>카테고리 *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-wrap gap-2"
                    >
                      {category.map((cat) => (
                        <Label
                          key={cat.id}
                          htmlFor={`category-${figure.id}-${cat.id}`}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors",
                            field.value === cat.id
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background hover:bg-muted"
                          )}
                        >
                          <RadioGroupItem
                            value={cat.id}
                            id={`category-${figure.id}-${cat.id}`}
                            className="sr-only"
                          />
                          <div>
                            <div className="font-medium text-sm">
                              {cat.name}
                            </div>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <section className="space-y-3">
            <FormField
              control={control}
              name={`figures.${index}.p_scale_id`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>스케일</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-wrap gap-2"
                    >
                      {scale.map((s) => (
                        <Label
                          key={s.id}
                          htmlFor={`scale-${figure.id}-${s.id}`}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors",
                            field.value === s.id
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background hover:bg-muted"
                          )}
                        >
                          <RadioGroupItem
                            value={s.id}
                            id={`scale-${figure.id}-${s.id}`}
                            className="sr-only"
                          />
                          <div>
                            <div className="font-medium text-sm">{s.name}</div>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Price
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
          <div className="space-y-2">
            <FormField
              control={control}
              name={`figures.${index}.p_price_kr`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>가격 (KRW) *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        ₩
                      </span>
                      <Input
                        id={`price-${figure.id}`}
                        type="number"
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                        className="pl-8"
                        placeholder="19,800"
                        required
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Release
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <FormField
              control={control}
              name={`figures.${index}.p_release_precision`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>발매 일정 기준 *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex flex-wrap gap-2"
                    >
                      {[
                        { label: "년", value: "year" },
                        { label: "분기", value: "quarter" },
                        { label: "월", value: "month" },
                        { label: "일", value: "day" },
                        { label: "미정", value: "unknown" },
                      ].map((s, idx) => (
                        <Label
                          key={`precision_${idx}`}
                          htmlFor={`precision_-${figure.id}-${s.value}`}
                          className={cn(
                            "flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-colors",
                            field.value === s.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-background hover:bg-muted"
                          )}
                        >
                          <RadioGroupItem
                            value={s.value}
                            id={`precision_-${figure.id}-${s.value}`}
                            className="sr-only"
                          />
                          <div>
                            <div className="font-medium text-sm">{s.label}</div>
                          </div>
                        </Label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2">
            <FormField
              control={control}
              name={`figures.${index}.p_release_date`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor={`releaseDate-${figure.id}`}>
                    발매일 *
                  </FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date-picker"
                          className="w-full justify-between font-normal"
                        >
                          {field.value
                            ? format(field.value, "yyyy-MM-dd")
                            : "날짜를 선택해 주세요."}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          locale={ko}
                          className="rounded-md border shadow-sm"
                          captionLayout="dropdown"
                          startMonth={new Date(2000, 1)}
                          endMonth={new Date(2050, 12)}
                          defaultMonth={field.value || new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={control}
          name={`figures.${index}.p_is_reissue`}
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel htmlFor={`is_reissue-${figure.id}`}>
                  재판 여부
                </FormLabel>
                <p className="text-xs text-muted-foreground">
                  이미 발매된 적이 있는 피규어면 눌러주세요.
                </p>
              </div>

              <FormControl>
                <Switch
                  id={`is_reissue-${figure.id}`}
                  checked={figure.p_is_reissue}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Images
        </h3>
        <FormField
          control={control}
          name={`figures.${index}.images`}
          render={({ field }) => (
            <FormControl>
              <ImageUploader images={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />
      </section>

      {/* <section className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Source Link
        </h3>
        <div className="space-y-2">
          <FormField
            control={control}
            name={`figures.${index}.source_url`}
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor={`sourceUrl-${figure.id}`}>
                  Source URL
                </FormLabel>
                <Input
                  id={`sourceUrl-${figure.id}`}
                  type="url"
                  value={figure.source_url || ""}
                  onChange={field.onChange}
                  placeholder="https:goodsmile.info/..."
                />
              </FormItem>
            )}
          />
        </div>
      </section> */}
    </div>
  );
}
