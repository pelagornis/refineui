import { Box, Divider, Stack, Text } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function DividerPreview() {
    return (
        <Looks>
            <Look align="stretch">
                <Stack>
                    <Box padding="sizeLarge">
                        <Text variant="bodyMd" className="m-0">
                            Section one
                        </Text>
                    </Box>
                    <Divider />
                    <Box padding="sizeLarge">
                        <Text variant="bodyMd" className="m-0">
                            Section two
                        </Text>
                    </Box>
                </Stack>
            </Look>
        </Looks>
    );
}
