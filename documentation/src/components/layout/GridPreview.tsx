import { Grid, GridItem } from "@refineui/react";
import PreviewFrame from "../PreviewFrame";
import { DemoBlock, DemoCanvas } from "./DemoBlock";

export default function GridPreview() {
    return (
        <>
            <PreviewFrame title="3 equal columns">
                <DemoCanvas>
                    <Grid columns={3} gap="sizeMedium">
                        <DemoBlock tone={0}>1</DemoBlock>
                        <DemoBlock tone={1}>2</DemoBlock>
                        <DemoBlock tone={2}>3</DemoBlock>
                        <DemoBlock tone={3}>4</DemoBlock>
                        <DemoBlock tone={0}>5</DemoBlock>
                        <DemoBlock tone={1}>6</DemoBlock>
                    </Grid>
                </DemoCanvas>
            </PreviewFrame>
            <PreviewFrame title="GridItem span">
                <DemoCanvas>
                    <Grid columns={4} gap="sizeSmall">
                        <GridItem span={2}>
                            <DemoBlock tone={0}>span 2</DemoBlock>
                        </GridItem>
                        <DemoBlock tone={1}>3</DemoBlock>
                        <DemoBlock tone={2}>4</DemoBlock>
                        <DemoBlock tone={3}>5</DemoBlock>
                        <GridItem span={3}>
                            <DemoBlock tone={0}>span 3</DemoBlock>
                        </GridItem>
                    </Grid>
                </DemoCanvas>
            </PreviewFrame>
            <PreviewFrame title="Auto-fit — minItem foundationSize2000">
                <DemoCanvas>
                    <Grid minItem="foundationSize2000" gap="sizeMedium">
                        <DemoBlock tone={0}>Card</DemoBlock>
                        <DemoBlock tone={1}>Card</DemoBlock>
                        <DemoBlock tone={2}>Card</DemoBlock>
                        <DemoBlock tone={3}>Card</DemoBlock>
                    </Grid>
                </DemoCanvas>
            </PreviewFrame>
        </>
    );
}
