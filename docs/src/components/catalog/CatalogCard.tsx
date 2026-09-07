import { createContext, useContext, type ReactNode } from "react";
import { Box, Card, CardHeader, CardTitle, Grid } from "@refineui/react";
import { withLocalePath, type DocsLocaleCode } from "../../lib/docs-locale";

const CatalogLocaleContext = createContext<DocsLocaleCode>(undefined);

export function CatalogLocaleProvider({
    locale,
    children,
}: {
    locale?: DocsLocaleCode;
    children: ReactNode;
}) {
    return <CatalogLocaleContext.Provider value={locale}>{children}</CatalogLocaleContext.Provider>;
}

export function CatalogCard({
    href,
    name,
    preview,
    external = false,
    fill = false,
}: {
    href: string;
    name: string;
    preview: ReactNode;
    external?: boolean;
    /** Stretch preview to the full canvas (sidebar, carousel, chart, …). */
    fill?: boolean;
}) {
    const locale = useContext(CatalogLocaleContext);

    return (
        <Card variant="outlined" interactive data-refineui-catalog-card className="relative flex h-full min-h-0 flex-col">
            <div data-refineui-catalog-preview className="flex min-h-0 flex-1 flex-col">
                <Box
                    data-refineui-catalog-preview-canvas
                    padding="sizeMedium"
                    background="backgroundPrimary"
                    className="flex h-refineui-foundation-size-3000 w-full shrink-0 items-center justify-center overflow-hidden"
                >
                    <div
                        data-refineui-catalog-preview-stage
                        data-fill={fill ? "" : undefined}
                        className="w-full max-w-full min-w-0"
                    >
                        {preview}
                    </div>
                </Box>
            </div>
            <CardHeader data-refineui-catalog-label className="shrink-0">
                <CardTitle>
                    <a
                        href={external ? href : withLocalePath(href, locale)}
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

export function CatalogGrid({
    children,
    ...props
}: {
    children: ReactNode;
} & React.ComponentProps<typeof Grid>) {
    return (
        <Grid data-refineui-catalog minItem="foundationSize3200" gap="sizeLarge" {...props}>
            {children}
        </Grid>
    );
}
