import { Box, Container, Stack } from "@refineui/react";
import { Look, Looks } from "../PreviewFrame";
import { DemoBlock } from "./DemoBlock";

export default function ContainerPreview() {
    return (
        <Looks>
            <Look align="stretch">
                <Box background="backgroundSurfaceHover" radius="roundedXLarge" className="w-full">
                    <Container padding="sizeXXLarge">
                        <Stack gap="sizeSmall">
                            <DemoBlock tone={0}>Full width, padded</DemoBlock>
                            <DemoBlock tone={1}>Centered column</DemoBlock>
                        </Stack>
                    </Container>
                </Box>
            </Look>
        </Looks>
    );
}
