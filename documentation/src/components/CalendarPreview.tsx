import { useState } from "react";
import { Calendar } from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

export default function CalendarPreview() {
  const [value, setValue] = useState<Date | undefined>(new Date());
  const [rangeStart, setRangeStart] = useState<Date | undefined>(
    new Date(2025, 9, 14),
  );
  const [rangeEnd, setRangeEnd] = useState<Date | undefined>(new Date(2025, 9, 22));

  return (
    <PreviewFrame>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <Calendar value={value} onChange={(d) => setValue(d)} locale="en" />
        <Calendar
          mode="range"
          defaultMonth={new Date(2025, 9, 1)}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          onRangeChange={(s, e) => {
            setRangeStart(s);
            setRangeEnd(e);
          }}
          locale="en"
        />
      </div>
    </PreviewFrame>
  );
}
