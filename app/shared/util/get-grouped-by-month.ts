export function getGroupedByMonth<
  T extends { figure: { release_year: number; release_month: number } }
>(figures: T[]): Record<string, T[]> {
  const groups: Record<string, typeof figures> = {};
  figures.forEach((item) => {
    const year = item.figure?.release_year;
    const month = item.figure?.release_month;
    if (!year || !month) return;
    const key = `${year}-${String(month).padStart(2, "0")}`;
    groups[key] ||= [];
    groups[key].push(item);
  });
  return groups;
}
