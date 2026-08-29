import { useState } from "react";
import { Calendar } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function CalendarPreview() {
  const [value, setValue] = useState<Date | undefined>(new Date());

  return (
    <Looks>
      <Look>
        <Calendar value={value} onChange={(d) => setValue(d)} />
      </Look>
    </Looks>
  );
}
