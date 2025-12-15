import { Badge } from "~/components/ui/badge";
import { cn } from "~/utils";
import { getStatusColor, getStatusLabel } from "~/shared/util";
import { UserFigureDto } from "../model/user-figure-dto";
import { getImageTransformation } from "~/shared/ui";

type CalendarTimelineListProps = {
  data: UserFigureDto[];
};

export function CalendarTimelineList(props: CalendarTimelineListProps) {
  const { data: sortedFigures } = props;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr className="text-left text-sm font-medium text-muted-foreground">
            <th className="p-4">Figure</th>
            <th className="p-4 hidden md:table-cell">Manufacturer</th>
            <th className="p-4 hidden sm:table-cell">Release Date</th>
            <th className="p-4">Status</th>
            <th className="p-4 text-right">Price</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sortedFigures.map((item) => (
            <tr key={item.id} className="hover:bg-muted/30 transition-colors">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={
                        getImageTransformation(
                          item.figure.detail.image[0].image_url,
                          {
                            width: 48,
                            height: 48,
                            quality: 80,
                          }
                        ) || "/placeholder.svg"
                      }
                      alt={item.figure.detail.name}
                      // fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-medium text-sm line-clamp-2">
                    {item.figure.detail.name}
                  </span>
                </div>
              </td>
              <td className="p-4 hidden md:table-cell text-sm text-muted-foreground">
                {item.figure?.detail.manufacturer?.name}
              </td>
              <td className="p-4 hidden sm:table-cell text-sm text-muted-foreground">
                {new Date(item.figure.release_text).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}
              </td>
              <td className="p-4">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-white text-xs",
                    getStatusColor(item.status)
                  )}
                >
                  {getStatusLabel(item.status)}
                </Badge>
              </td>
              <td className="p-4 text-right font-semibold text-sm">
                ₩{item.total_price.toLocaleString()}
              </td>
            </tr>
          ))}
          {sortedFigures.length === 0 && (
            <tr>
              <td colSpan={5} className="p-8 text-center text-muted-foreground">
                No figures found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
