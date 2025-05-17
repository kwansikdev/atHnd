import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

export function AreaAddPrice() {
  const form = useFormContext();

  return (
    <>
      <FormField
        control={form.control}
        name="price_kr"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              가격 (원)<span className="text-red-500 ml-1">*</span>
            </FormLabel>
            <FormControl>
              <Input type="text" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="price_jp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>가격 (엔)</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price_cn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>가격 (위안)</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
