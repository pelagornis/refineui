import type { ReactNode } from "react";
import { Box, Grid, Text } from "@refineui/react";

export function CatalogCard({
    href,
    name,
    preview,
}: {
    href: string;
    name: string;
    preview: ReactNode;
}) {
    return (
        <Box
            as="article"
            data-refineui-catalog-card
            background="backgroundSurface"
            radius="roundedXLarge"
            border="strokeWidthThin"
            borderColor="borderDefault"
            className="relative h-full overflow-hidden"
        >
            <div data-refineui-catalog-preview>
                <Box
                    padding="sizeLarge"
                    background="surfaceSunken"
                    className="flex min-h-refineui-foundation-size-2560 w-full items-center justify-center overflow-hidden"
                >
                    {preview}
                </Box>
            </div>
            <Box paddingX="sizeLarge" paddingY="sizeMedium" data-refineui-catalog-label>
                <Text as="h3" variant="subtitleMd" className="m-0">
                    <a href={href} data-refineui-catalog-link>
                        {name}
                    </a>
                </Text>
            </Box>
        </Box>
    );
}

export function CatalogGrid({ children }: { children: ReactNode }) {
    return (
        <Grid data-refineui-catalog minItem="foundationSize3200" gap="sizeLarge">
            {children}
        </Grid>
    );
}
