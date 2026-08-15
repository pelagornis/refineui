import { Box, Container, Stack } from "@refineui/react";
import PreviewFrame from "../PreviewFrame";
import { DemoBlock, DemoCanvas } from "./DemoBlock";

export default function ContainerPreview() {
    return (
        <>
            <PreviewFrame title="Default horizontal padding">
                <Box background="backgroundSurfaceHover" radius="roundedXLarge" className="w-full">
                    <Container padding="sizeXXLarge">
                        <Stack gap="sizeSmall">
                            <DemoBlock tone={0}>Full width, padded</DemoBlock>
                            <DemoBlock tone={1}>Centered column</DemoBlock>
                        </Stack>
                    </Container>
                </Box>
            </PreviewFrame>
            <PreviewFrame title="Tighter padding">
                <DemoCanvas>
                    <Container padding="sizeMedium">
                        <DemoBlock tone={2}>padding sizeMedium</DemoBlock>
                    </Container>
                </DemoCanvas>
            </PreviewFrame>
        </>
    );
}
