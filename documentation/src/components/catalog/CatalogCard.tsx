import type { ReactNode } from "react";
import { Box, Card, CardHeader, CardTitle, Grid } from "@refineui/react";

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
        <Card variant="outlined" interactive data-refineui-catalog-card className="relative">
            <div data-refineui-catalog-preview>
                <Box
                    padding="sizeLarge"
                    background="surfaceSunken"
                    className="flex h-refineui-foundation-size-2560 w-full items-center justify-center overflow-hidden"
                >
                    {preview}
                </Box>
            </div>
            <CardHeader data-refineui-catalog-label>
                <CardTitle>
                    <a href={href} data-refineui-catalog-link>
                        {name}
                    </a>
                </CardTitle>
            </CardHeader>
        </Card>
    );
}

export function CatalogGrid({ children }: { children: ReactNode }) {
    return (
        <Grid data-refineui-catalog minItem="foundationSize3200" gap="sizeLarge">
            {children}
        </Grid>
    );
}
