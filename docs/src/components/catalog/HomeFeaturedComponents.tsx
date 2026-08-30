import {
    Button,
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Stack,
    Switch,
} from "@refineui/react";
import { CatalogCard, CatalogGrid } from "./CatalogCard";

const FEATURED = [
    {
        href: "/components/button/",
        name: "Button",
        preview: (
            <Stack direction="row" gap="sizeSmall" align="center" justify="center">
                <Button type="button" variant="primary" size="sm" tabIndex={-1}>
                    Primary
                </Button>
                <Button type="button" variant="secondary" size="sm" tabIndex={-1}>
                    Secondary
                </Button>
            </Stack>
        ),
    },
    {
        href: "/components/input/",
        name: "Input",
        preview: (
            <Input size="sm" placeholder="Search components…" defaultValue="" tabIndex={-1} aria-hidden readOnly />
        ),
    },
    {
        href: "/components/card/",
        name: "Card",
        preview: (
            <div data-refineui-catalog-card-specimen className="flex h-full w-full items-center justify-center">
                <Card variant="outlined" className="h-auto w-full">
                    <CardHeader>
                        <CardTitle>Project</CardTitle>
                        <CardDescription>Grouped content surface.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        ),
    },
    {
        href: "/components/switch/",
        name: "Switch",
        preview: <Switch defaultChecked tabIndex={-1} aria-hidden />,
    },
] as const;

export function HomeFeaturedComponents() {
    return (
        <CatalogGrid>
            {FEATURED.map((item) => (
                <CatalogCard key={item.href} href={item.href} name={item.name} preview={item.preview} />
            ))}
        </CatalogGrid>
    );
}
