import type { ReactNode } from "react";
import { Box, Card, CardHeader, CardTitle, Grid } from "@refineui/react";

export function CatalogCard({
    href,
    name,
    preview,
    external = false,
}: {
    href: string;
    name: string;
    preview: ReactNode;
    external?: boolean;
}) {
    return (
        <Card variant="outlined" interactive data-refineui-catalog-card className="relative">
            <div data-refineui-catalog-preview>
                <Box
                    data-refineui-catalog-preview-canvas
                    padding="sizeLarge"
                    className="flex h-refineui-foundation-size-2560 w-full flex-col items-stretch justify-center overflow-hidden"
                >
                    {preview}
                </Box>
            </div>
            <CardHeader data-refineui-catalog-label>
                <CardTitle>
                    <a
                        href={href}
                        data-refineui-catalog-link
                        {...(external ? { target: "_blank", rel: "noreferrer" } : undefined)}
                    >
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
