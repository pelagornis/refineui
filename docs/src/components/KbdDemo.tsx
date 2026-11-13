import { Kbd, Stack, Text } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function KbdDemo() {
    return (
        <Looks>
            <Look align="center">
                <Stack direction="row" gap="sizeXSmall" align="center">
                    <Text variant="bodySm" color="foregroundSecondary">Open search</Text>
                    <Kbd>⌘</Kbd>
                    <Kbd>K</Kbd>
                </Stack>
            </Look>
        </Looks>
    );
}
