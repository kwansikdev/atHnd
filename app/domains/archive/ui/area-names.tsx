import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

export function AreaNames() {
  const form = useFormContext();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>피규어 이름 (한글)</FormLabel>
            <FormControl>
              <Input placeholder="아스나 웨딩 드레스 Ver." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="name_jp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>피규어 이름 (일본어)</FormLabel>
            <FormControl>
              <Input placeholder="アスナ ウェディングドレスVer." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="name_en"
        render={({ field }) => (
          <FormItem>
            <FormLabel>피규어 이름 (영어)</FormLabel>
            <FormControl>
              <Input placeholder="Asuna Wedding Dress Ver." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
