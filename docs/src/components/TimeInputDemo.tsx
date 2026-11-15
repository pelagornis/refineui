import { useState } from "react";
import { Stack, Text, TimeInput } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function TimeInputDemo() {
    const [value, setValue] = useState("09:30");

    return (
        <Looks>
            <Look align="stretch">
                <Stack gap="sizeSmall" className="w-full">
                    <TimeInput value={value} onValueChange={setValue} hourCycle="12h" fullWidth />
                    <Text variant="captionMd" className="m-0 text-refineui-alias-foreground-secondary">Selected: {value}</Text>
                </Stack>
            </Look>
        </Looks>
    );
}
