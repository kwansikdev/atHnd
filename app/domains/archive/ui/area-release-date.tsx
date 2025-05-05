import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Switch } from "~/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { useState } from "react";

export function AreaReleaseDate() {
  const form = useFormContext();

  const [showDayPicker, setShowDayPicker] = useState(false);

  return (
    <FormField
      control={form.control}
      name="releaseDate"
      render={({ field }) => {
        // 날짜 문자열을 Date 객체로 변환
        const date = field.value ? new Date(field.value) : undefined;

        // 년월 또는 년월일 형식으로 포맷팅
        const formatDate = (date?: Date) => {
          if (!date) return "";
          if (showDayPicker) {
            return format(date, "yyyy년 MM월 dd일", { locale: ko });
          } else {
            return format(date, "yyyy년 MM월", { locale: ko });
          }
        };

        return (
          <FormItem className="flex flex-col">
            <div className="flex items-start justify-between">
              <FormLabel>출시일</FormLabel>
              <div className="flex items-center gap-2">
                <Switch
                  checked={showDayPicker}
                  onCheckedChange={setShowDayPicker}
                  id="day-picker"
                />
                <label
                  htmlFor="day-picker"
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  일자까지 선택
                </label>
              </div>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? formatDate(date) : "날짜 선택"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    if (selectedDate) {
                      // 년월만 선택하는 경우와 년월일 모두 선택하는 경우 처리
                      if (showDayPicker) {
                        // 년월일 모두 선택
                        field.onChange(format(selectedDate, "yyyy-MM-dd"));
                      } else {
                        // 년월만 선택 - 해당 월의 1일로 설정하고 yyyy-MM 형식으로 저장
                        const yearMonth = format(selectedDate, "yyyy-MM");
                        field.onChange(`${yearMonth}-01`); // DB에는 yyyy-MM-dd 형식으로 저장
                      }
                    }
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              {showDayPicker
                ? "년, 월, 일을 모두 선택합니다."
                : "년과 월만 선택합니다."}
            </FormDescription>
            <FormMessage />

            <input
              type="text"
              className="hidden"
              name="release_date"
              value={formatDate(date).trim()}
            />
          </FormItem>
        );
      }}
    />
  );
}
