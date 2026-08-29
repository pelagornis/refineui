import { Stack } from "@refineui/react";
import { Look, Looks } from "../PreviewFrame";
import { DemoBlock } from "./DemoBlock";

export default function StackPreview() {
    return (
        <Looks>
            <Look>
                <Stack gap="sizeMedium">
                    <DemoBlock tone={0}>One</DemoBlock>
                    <DemoBlock tone={1}>Two</DemoBlock>
                    <DemoBlock tone={2}>Three</DemoBlock>
                </Stack>
            </Look>
        </Looks>
    );
}
