import { type ReactNode, useEffect, useMemo, useState } from "react";
import { iconSizes } from "@refineui/tokens";
import {
    Button,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandGroupHeading,
    CommandInput,
    CommandItem,
    CommandList,
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    Stack,
    Text,
    WebIcon,
} from "@refineui/react";
import { DocsThemeSelect } from "./DocsThemeSelect";
import { RefineUILogo } from "../resources/logo";
import {
    DOCS_HEADER_NAV,
    DOCS_SEARCH_ITEMS,
    type DocsHeaderNavSection,
    type DocsSearchItem,
} from "./docsHeaderConfig";

export type DocsHeaderBrandProps = {
    title: string;
    titleHref: string;
    /** Replace the default RefineUI mark. */
    logo?: ReactNode;
    /** Hide the wordmark next to the logo. */
    hideTitle?: boolean;
};

export type DocsHeaderNavProps = {
    currentPath?: string;
    /** Override default header navigation sections. */
    sections?: DocsHeaderNavSection[];
};

export type DocsHeaderSearchProps = {
    /** Override command palette targets. */
    items?: DocsSearchItem[];
};

function normalizePath(path: string): string {
    if (path === "/") return "/";
    return path.replace(/\/$/, "");
}

function isPathActive(href: string, currentPath: string): boolean {
    const target = normalizePath(href);
    const current = normalizePath(currentPath);
    if (target === "/") return current === "/";
    return current === target || current.startsWith(`${target}/`);
}

function sectionIsActive(section: DocsHeaderNavSection, currentPath: string): boolean {
    return isPathActive(section.href, currentPath);
}

function NavLinkStack({ title, description }: { title: string; description?: string }) {
    return (
        <Stack as="span" gap="sizeXXXSmall" className="min-w-0 flex-1 px-refineui-size-xxx-small">
            <span className="truncate">{title}</span>
            {description ? (
                <span className="truncate text-refineui-alias-foreground-tertiary refineui-typo-body-4">
                    {description}
                </span>
            ) : null}
        </Stack>
    );
}

function NavContentGrid({ children }: { children: ReactNode }) {
    return (
        <div className="grid w-full min-w-refineui-menu-panel-width grid-cols-2 gap-refineui-size-x-small">
            {children}
        </div>
    );
}

export function DocsHeaderBrand({ title, titleHref, logo, hideTitle = false }: DocsHeaderBrandProps) {
    return (
        <a href={titleHref} data-refineui-docs-brand className="flex items-center gap-refineui-size-x-small min-w-0 no-underline">
            <span data-refineui-docs-logo className="text-refineui-alias-foreground-primary">
                {logo ?? <RefineUILogo />}
            </span>
            {hideTitle ? null : (
                <Text as="span" variant="subtitleMd" className="text-refineui-alias-foreground-primary">
                    {title}
                </Text>
            )}
        </a>
    );
}

export function DocsHeaderNav({ currentPath = "/", sections = DOCS_HEADER_NAV }: DocsHeaderNavProps) {
    return (
        <div data-refineui-docs-nav>
            <NavigationMenu aria-label="Documentation">
                <NavigationMenuList>
                    {sections.map((section) => {
                        const sectionActive = sectionIsActive(section, currentPath);

                        if (section.links.length === 0) {
                            return (
                                <NavigationMenuItem key={section.value} value={section.value}>
                                    <NavigationMenuLink href={section.href} active={sectionActive}>
                                        {section.label}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            );
                        }

                        return (
                            <NavigationMenuItem key={section.value} value={section.value}>
                                <NavigationMenuTrigger data-active={sectionActive || undefined}>
                                    {section.label}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavContentGrid>
                                        {section.links.map((link) => (
                                            <NavigationMenuLink
                                                key={link.href}
                                                href={link.href}
                                                active={!link.external && isPathActive(link.href, currentPath)}
                                                {...(link.external
                                                    ? { target: "_blank", rel: "noreferrer" }
                                                    : undefined)}
                                            >
                                                <NavLinkStack title={link.label} description={link.description} />
                                            </NavigationMenuLink>
                                        ))}
                                    </NavContentGrid>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        );
                    })}
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}

function navigateTo(href: string, external?: boolean) {
    if (external) {
        window.open(href, "_blank", "noreferrer");
        return;
    }
    window.location.assign(href);
}

export function DocsHeaderSearch({ items = DOCS_SEARCH_ITEMS }: DocsHeaderSearchProps) {
    const [open, setOpen] = useState(false);

    const groups = useMemo(() => {
        const map = new Map<string, DocsSearchItem[]>();
        for (const item of items) {
            const list = map.get(item.group) ?? [];
            list.push(item);
            map.set(item.group, list);
        }
        return Array.from(map.entries());
    }, [items]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "k" || !(event.metaKey || event.ctrlKey)) return;
            event.preventDefault();
            setOpen(true);
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    return (
        <>
            <Button
                type="button"
                layout="icon"
                variant="ghost"
                size="sm"
                data-refineui-docs-search-trigger
                aria-label="Search documentation (⌘K)"
                onClick={() => setOpen(true)}
            >
                <WebIcon name="search" size={iconSizes.xsmall} color="currentColor" aria-hidden />
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen} commandProps={{ label: "Search documentation" }}>
                <CommandInput placeholder="Search pages…" />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {groups.map(([group, groupItems]) => (
                        <CommandGroup key={group}>
                            <CommandGroupHeading>{group}</CommandGroupHeading>
                            {groupItems.map((item) => (
                                <CommandItem
                                    key={item.value}
                                    value={item.value}
                                    keywords={[item.label, item.group, ...(item.keywords ?? [])]}
                                    onSelect={() => {
                                        setOpen(false);
                                        navigateTo(item.href, item.external);
                                    }}
                                >
                                    {item.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ))}
                </CommandList>
            </CommandDialog>
        </>
    );
}

export function DocsHeaderTools() {
    return (
        <div data-refineui-docs-tools className="flex shrink-0 items-center gap-refineui-size-xx-small">
            <div data-refineui-docs-theme>
                <DocsThemeSelect />
            </div>
        </div>
    );
}
