import { useState } from "react";
import { DateInput, Stack, Text } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function DateInputDemo() {
    const [value, setValue] = useState<Date | undefined>(new Date(2026, 10, 13));

    return (
        <Looks>
            <Look align="stretch">
                <Stack gap="sizeSmall" className="w-full">
                    <DateInput value={value} onValueChange={setValue} locale="en-US" fullWidth />
                    <Text variant="captionMd" className="m-0 text-refineui-alias-foreground-secondary">
                        {value ? `Selected: ${value.toLocaleDateString("en-US")}` : "No date selected"}
                    </Text>
                </Stack>
            </Look>
        </Looks>
    );
}
