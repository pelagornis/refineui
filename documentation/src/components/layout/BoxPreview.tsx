import { Box, Stack } from "@refineui/react";
import PreviewFrame from "../PreviewFrame";
import { DemoBlock, DemoCanvas } from "./DemoBlock";

export default function BoxPreview() {
    return (
        <>
            <PreviewFrame title="Surface + padding + radius">
                <DemoCanvas>
                    <Box
                        padding="sizeXLarge"
                        background="backgroundPrimary"
                        radius="roundedXLarge"
                        border="strokeWidthThin"
                        borderColor="borderDefault"
                    >
                        <DemoBlock tone={0}>Inset content</DemoBlock>
                    </Box>
                </DemoCanvas>
            </PreviewFrame>
            <PreviewFrame title="Semantic fills">
                <Stack direction="row" gap="sizeMedium" wrap>
                    <Box padding="sizeLarge" background="backgroundInfoSubtle" radius="roundedLarge">
                        <DemoBlock tone={0}>info</DemoBlock>
                    </Box>
                    <Box padding="sizeLarge" background="backgroundBrandSubtle" radius="roundedLarge">
                        <DemoBlock tone={1}>brand</DemoBlock>
                    </Box>
                    <Box padding="sizeLarge" background="backgroundDiscoverySubtle" radius="roundedLarge">
                        <DemoBlock tone={2}>discovery</DemoBlock>
                    </Box>
                </Stack>
            </PreviewFrame>
        </>
    );
}
