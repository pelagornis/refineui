import { Grid } from "@refineui/react";
import { Look, Looks } from "../PreviewFrame";
import { DemoBlock } from "./DemoBlock";

export default function GridPreview() {
    return (
        <Looks>
            <Look align="stretch">
                <Grid columns={3} gap="sizeMedium">
                    <DemoBlock tone={0}>1</DemoBlock>
                    <DemoBlock tone={1}>2</DemoBlock>
                    <DemoBlock tone={2}>3</DemoBlock>
                    <DemoBlock tone={3}>4</DemoBlock>
                    <DemoBlock tone={0}>5</DemoBlock>
                    <DemoBlock tone={1}>6</DemoBlock>
                </Grid>
            </Look>
        </Looks>
    );
}
