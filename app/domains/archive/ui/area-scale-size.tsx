import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

export function AreaScaleSize() {
  const form = useFormContext();
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="scale"
        render={({ field }) => (
          <FormItem>
            <FormLabel>스케일</FormLabel>
            <FormControl>
              <Input placeholder="1/7" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>크기</FormLabel>
            <FormControl>
              <Input placeholder="약 230mm" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
