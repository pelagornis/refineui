import { Spacer, Stack } from "@refineui/react";
import PreviewFrame from "../PreviewFrame";
import { DemoBlock, DemoCanvas } from "./DemoBlock";

export default function StackPreview() {
    return (
        <>
            <PreviewFrame title="Column — default">
                <DemoCanvas>
                    <Stack gap="sizeMedium">
                        <DemoBlock tone={0}>One</DemoBlock>
                        <DemoBlock tone={1}>Two</DemoBlock>
                        <DemoBlock tone={2}>Three</DemoBlock>
                    </Stack>
                </DemoCanvas>
            </PreviewFrame>
            <PreviewFrame title="Row + Spacer">
                <DemoCanvas>
                    <Stack direction="row" gap="sizeSmall" align="center">
                        <DemoBlock tone={0}>Start</DemoBlock>
                        <Spacer />
                        <DemoBlock tone={2}>End</DemoBlock>
                    </Stack>
                </DemoCanvas>
            </PreviewFrame>
            <PreviewFrame title="Wrap">
                <DemoCanvas>
                    <Stack direction="row" gap="sizeSmall" wrap>
                        <DemoBlock tone={0}>Alpha</DemoBlock>
                        <DemoBlock tone={1}>Beta</DemoBlock>
                        <DemoBlock tone={2}>Gamma</DemoBlock>
                        <DemoBlock tone={3}>Delta</DemoBlock>
                        <DemoBlock tone={0}>Epsilon</DemoBlock>
                        <DemoBlock tone={1}>Zeta</DemoBlock>
                    </Stack>
                </DemoCanvas>
            </PreviewFrame>
        </>
    );
}
