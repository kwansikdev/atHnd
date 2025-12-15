type CalendarTimelineContentsProps = {
  data: any;
  // Add props as needed
};

export function CalendarTimelineContents(props: CalendarTimelineContentsProps) {
  const { data } = props;
  console.log("🚀 ~ CalendarTimelineContents ~ data:", data);

  return <div>Calendar Timeline Contents</div>;
}
