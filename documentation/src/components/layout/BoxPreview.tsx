import { Box } from "@refineui/react";
import { Look, Looks } from "../PreviewFrame";
import { DemoBlock } from "./DemoBlock";

export default function BoxPreview() {
    return (
        <Looks>
            <Look>
                <Box
                    padding="sizeXLarge"
                    background="backgroundPrimary"
                    radius="roundedXLarge"
                    border="strokeWidthThin"
                    borderColor="borderDefault"
                >
                    <DemoBlock tone={0}>Inset content</DemoBlock>
                </Box>
            </Look>
        </Looks>
    );
}
