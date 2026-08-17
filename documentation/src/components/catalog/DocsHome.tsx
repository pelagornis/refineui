import { Badge, Box, Button, Grid, Input, Stack, Text } from "@refineui/react";
import { DemoBlock } from "../layout/DemoBlock";
import { CatalogCard, CatalogGrid } from "./CatalogCard";
import ComponentCatalog from "./ComponentCatalog";

export default function DocsHome() {
    return (
        <Stack gap="sizeXXXLarge" data-refineui-home>
            <CatalogGrid>
                <CatalogCard
                    href="/foundations/"
                    name="Foundations"
                    preview={
                        <Grid columns={4} gap="sizeXSmall">
                            <Box background="backgroundBrand" radius="roundedSmall" className="size-refineui-foundation-size-400" />
                            <Box background="backgroundInfo" radius="roundedSmall" className="size-refineui-foundation-size-400" />
                            <Box background="backgroundSuccess" radius="roundedSmall" className="size-refineui-foundation-size-400" />
                            <Box background="backgroundError" radius="roundedSmall" className="size-refineui-foundation-size-400" />
                        </Grid>
                    }
                />
                <CatalogCard
                    href="/components/"
                    name="Components"
                    preview={
                        <Stack direction="row" gap="sizeSmall" align="center">
                            <Button type="button" variant="primary">
                                Primary
                            </Button>
                            <Badge variant="success">Ready</Badge>
                        </Stack>
                    }
                />
                <CatalogCard
                    href="/layout/"
                    name="Layout"
                    preview={
                        <Stack gap="sizeSmall" className="w-full">
                            <DemoBlock tone={0}>Stack</DemoBlock>
                            <DemoBlock tone={1}>Grid</DemoBlock>
                        </Stack>
                    }
                />
                <CatalogCard
                    href="/intro/"
                    name="Get started"
                    preview={<Input placeholder="bun add @refineui/react" fullWidth />}
                />
            </CatalogGrid>
            <Stack gap="sizeLarge">
                <Text as="h2" variant="headingSm" className="m-0">
                    Components
                </Text>
                <ComponentCatalog />
            </Stack>
        </Stack>
    );
}
