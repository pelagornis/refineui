import { Box, Container, Grid, Stack } from "@refineui/react";
import { DemoBlock } from "../layout/DemoBlock";
import { CatalogCard, CatalogGrid } from "./CatalogCard";

export default function LayoutCatalog() {
    return (
        <CatalogGrid>
            <CatalogCard
                href="/layout/stack/"
                name="Stack"
                preview={
                    <Stack gap="sizeSmall" className="w-full">
                        <DemoBlock tone={0}>One</DemoBlock>
                        <DemoBlock tone={1}>Two</DemoBlock>
                        <DemoBlock tone={2}>Three</DemoBlock>
                    </Stack>
                }
            />
            <CatalogCard
                href="/layout/grid/"
                name="Grid"
                preview={
                    <Grid columns={2} gap="sizeSmall" className="w-full">
                        <DemoBlock tone={0}>1</DemoBlock>
                        <DemoBlock tone={1}>2</DemoBlock>
                        <DemoBlock tone={2}>3</DemoBlock>
                        <DemoBlock tone={3}>4</DemoBlock>
                    </Grid>
                }
            />
            <CatalogCard
                href="/layout/container/"
                name="Container"
                preview={
                    <Box background="backgroundSurfaceHover" radius="roundedLarge" className="w-full">
                        <Container padding="sizeMedium">
                            <DemoBlock tone={0}>Padded column</DemoBlock>
                        </Container>
                    </Box>
                }
            />
            <CatalogCard
                href="/layout/box/"
                name="Box"
                preview={
                    <Box
                        padding="sizeLarge"
                        background="backgroundPrimary"
                        radius="roundedLarge"
                        border="strokeWidthThin"
                        borderColor="borderDefault"
                    >
                        <DemoBlock tone={1}>Inset</DemoBlock>
                    </Box>
                }
            />
        </CatalogGrid>
    );
}
