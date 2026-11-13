import { useState } from "react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    Text,
} from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

type PreviewMenu = {
    value: string;
    label: string;
    groups: Array<{
        heading: string;
        items: Array<{ title: string; description?: string }>;
    }>;
};

export type PreviewLayout = "dropdown" | "floating" | "overlay";

const previewMenus: PreviewMenu[] = [
    {
        value: "foundations",
        label: "Foundations",
        groups: [
            { heading: "Get started", items: [{ title: "Overview", description: "Token-driven foundations" }, { title: "Design tokens", description: "Semantic token model" }] },
            { heading: "Design language", items: [{ title: "Color", description: "Palette and aliases" }, { title: "Typography", description: "Type scale and roles" }, { title: "Iconography", description: "System icon set" }] },
            { heading: "Layout", items: [{ title: "Spacing", description: "Layout rhythm" }, { title: "Layout", description: "Grid and alignment" }] },
        ],
    },
    {
        value: "components",
        label: "Components",
        groups: [
            { heading: "Explore", items: [{ title: "Button", description: "Primary actions" }, { title: "Input", description: "Text entry" }] },
            { heading: "Navigation", items: [{ title: "Dialog", description: "Modal surfaces" }, { title: "Sidebar", description: "App navigation rail" }] },
            { heading: "Data and feedback", items: [{ title: "Table", description: "Structured data" }, { title: "Toast", description: "Transient feedback" }, { title: "Tree", description: "Hierarchical lists" }] },
        ],
    },
    {
        value: "development",
        label: "Development",
        groups: [
            { heading: "Build", items: [{ title: "Installation", description: "Packages and setup" }, { title: "Theming", description: "Light and dark modes" }] },
            { heading: "Integrate", items: [{ title: "MCP", description: "Agent integration" }, { title: "Doctor", description: "Workspace diagnostics" }] },
            { heading: "Reference", items: [{ title: "Migration", description: "Upgrade guidance" }, { title: "Changelog", description: "Release history" }] },
        ],
    },
];

function PreviewLinkContent({ title, description }: { title: string; description?: string }) {
    return (
        <span className="flex min-w-0 flex-1 flex-col gap-refineui-size-xxx-small px-refineui-size-xxx-small">
            <Text as="span" variant="bodyMd" className="break-words whitespace-normal">
                {title}
            </Text>
            {description ? (
                <Text as="span" variant="bodyXs" className="break-words whitespace-normal text-refineui-alias-foreground-tertiary">
                    {description}
                </Text>
            ) : null}
        </span>
    );
}

function PreviewMenuPanel({ menu, layout }: { menu: PreviewMenu; layout: PreviewLayout }) {
    if (layout === "dropdown") {
        return (
            <div className="flex min-w-refineui-dropdown-menu-width flex-col">
                {menu.groups.flatMap((group) => group.items).map((item) => (
                    <NavigationMenuLink
                        key={item.title}
                        href={`#${item.title.toLowerCase().replaceAll(" ", "-")}`}
                        className="items-start px-refineui-size-small py-refineui-size-xx-small"
                    >
                        <PreviewLinkContent title={item.title} description={item.description} />
                    </NavigationMenuLink>
                ))}
            </div>
        );
    }

    const panelClass = "grid w-full grid-cols-3 gap-refineui-size-x-large px-refineui-size-large py-refineui-size-medium max-md:grid-cols-1";

    return (
        <div className={panelClass}>
            {menu.groups.map((group) => (
                <section key={group.heading} className="flex min-w-0 flex-col gap-refineui-size-small">
                    <Text
                        as="span"
                        variant="labelSm"
                        className="px-refineui-size-medium text-refineui-alias-foreground-tertiary"
                    >
                        {group.heading}
                    </Text>
                    <div className="flex flex-col gap-refineui-size-xxx-small">
                        {group.items.map((item) => (
                            <NavigationMenuLink
                                key={item.title}
                                href={`#${item.title.toLowerCase().replaceAll(" ", "-")}`}
                                className="items-start px-refineui-size-small py-refineui-size-xx-small"
                            >
                                <PreviewLinkContent title={item.title} description={item.description} />
                            </NavigationMenuLink>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

export default function NavigationMenuPreview({ layout = "dropdown" }: { layout?: PreviewLayout }) {
    const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);
    const contentClass = layout === "floating" ? "w-refineui-foundation-size-6000 max-w-full" : undefined;

    return (
        <Looks>
            <Look align="fill">
                <div
                    ref={setPortalContainer}
                    className="relative isolate flex h-refineui-foundation-size-4500 w-full justify-center overflow-hidden"
                >
                    <NavigationMenu key={layout} defaultValue="components" aria-label="Navigation menu preview">
                        <NavigationMenuList>
                            {previewMenus.map((menu) => (
                                <NavigationMenuItem key={menu.value} value={menu.value}>
                                    <NavigationMenuTrigger>{menu.label}</NavigationMenuTrigger>
                                    <NavigationMenuContent
                                        layout={layout}
                                        portalContainer={portalContainer}
                                        className={contentClass}
                                    >
                                        <PreviewMenuPanel menu={menu} layout={layout} />
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                    </div>
            </Look>
        </Looks>
    );
}
