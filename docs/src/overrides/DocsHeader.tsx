import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
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
    getDocsHeaderNav,
    getDocsSearchItems,
    type DocsHeaderNavSection,
    type DocsSearchItem,
} from "./docsHeaderConfig";
import { withBase } from "../lib/docs-path";
import { splitLocalePath } from "../lib/docs-locale";

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
    /** Starlight locale (`undefined` = root English). */
    locale?: string;
    /** Override default header navigation sections. */
    sections?: DocsHeaderNavSection[];
};

export type DocsHeaderSearchProps = {
    /** Starlight locale (`undefined` = root English). */
    locale?: string;
    /** Override command palette targets. */
    items?: DocsSearchItem[];
};

function normalizePath(path: string): string {
    const { path: withoutLocale } = splitLocalePath(path);
    if (withoutLocale === "/") return "/";
    return withoutLocale.replace(/\/$/, "") || "/";
}

function resolveHref(href: string, external?: boolean): string {
    return external ? href : withBase(href);
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
            <Text as="span" variant="bodyMd" className="break-words whitespace-normal">
                {title}
            </Text>
            {description ? (
                <Text as="span" variant="bodyXs" className="break-words whitespace-normal text-refineui-alias-foreground-tertiary">
                    {description}
                </Text>
            ) : null}
        </Stack>
    );
}

type MegaColumn = {
    title: string;
    linkIndexes: number[];
};

function getMegaColumns(section: DocsHeaderNavSection, localized: boolean): MegaColumn[] {
    const labels = localized
        ? {
            foundations: ["시작하기", "디자인 언어", "레이아웃"],
            components: ["컴포넌트 둘러보기", "입력과 액션", "오버레이와 내비게이션", "데이터와 피드백"],
            development: ["시작하기", "제품에 맞추기"],
            "ai-tools": ["AI 시작점", "문서 지식", "연결과 진단"],
        }
        : {
            foundations: ["Get started", "Design language", "Layout"],
            components: ["Explore components", "Input and actions", "Overlays and navigation", "Data and feedback"],
            development: ["Get started", "Adapt to your product"],
            "ai-tools": ["Start with AI", "Documentation knowledge", "Connect and diagnose"],
        };
    const titles = labels[section.value as keyof typeof labels] ?? labels.components;
    const structure: Record<string, number[][]> = {
        foundations: [[0, 1], [2, 3, 6], [4, 5]],
        components: [[0], [1, 2], [3, 4], [5, 6, 7]],
        development: [[0, 1], [2, 3]],
        "ai-tools": [[0, 1], [2, 3], [4, 5, 6]],
    };
    const groups = structure[section.value] ?? structure.components;
    return groups.map((linkIndexes, index) => ({
        title: titles[index] ?? titles[0],
        linkIndexes,
    }));
}

function NavContentGrid({
    section,
    currentPath,
    locale,
}: {
    section: DocsHeaderNavSection;
    currentPath: string;
    locale?: string;
}) {
    if (section.links.length === 0) return null;

    const localized = locale === "ko";
    const columns = getMegaColumns(section, localized);
    const gridClass = columns.length === 4 ? "grid-cols-4" : columns.length === 2 ? "grid-cols-2" : "grid-cols-3";

    return (
        <div className={`grid w-full max-w-refineui-navigation-menu-mega-width ${gridClass} gap-refineui-size-xx-large px-refineui-size-x-large py-refineui-size-large max-md:grid-cols-1`}>
            {columns.map((column, columnIndex) => (
                <section
                    key={column.title}
                    className={columnIndex === 0 ? "flex min-w-0 flex-col gap-refineui-size-small" : "flex min-w-0 flex-col gap-refineui-size-small pl-refineui-size-x-large max-md:pl-0"}
                >
                    <Text
                        as="span"
                        variant="labelSm"
                        className="px-refineui-size-medium text-refineui-alias-foreground-tertiary"
                    >
                        {column.title}
                    </Text>
                    <div className="flex flex-col gap-refineui-size-xxx-small">
                        {column.linkIndexes.map((linkIndex) => {
                            const link = section.links[linkIndex];
                            if (!link) return null;
                            return (
                                <NavigationMenuLink
                                    key={link.href}
                                    href={resolveHref(link.href, link.external)}
                                    active={!link.external && isPathActive(link.href, currentPath)}
                                    className="items-start px-refineui-size-small py-refineui-size-xx-small"
                                    {...(link.external ? { target: "_blank", rel: "noreferrer" } : undefined)}
                                >
                                    <NavLinkStack title={link.label} description={link.description} />
                                </NavigationMenuLink>
                            );
                        })}
                    </div>
                </section>
            ))}
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

export function DocsHeaderNav({ currentPath = "/", locale, sections }: DocsHeaderNavProps) {
    const resolvedSections = sections ?? getDocsHeaderNav(locale);
    return (
        <div data-refineui-docs-nav>
            <NavigationMenu aria-label="Documentation">
                <NavigationMenuList>
                    {resolvedSections.map((section) => {
                        const sectionActive = sectionIsActive(section, currentPath);

                        if (section.links.length === 0) {
                            return (
                                <NavigationMenuItem key={section.value} value={section.value}>
                                    <NavigationMenuLink href={resolveHref(section.href)} active={sectionActive}>
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
                                <NavigationMenuContent
                                    layout="overlay"
                                >
                                    <NavContentGrid
                                        section={section}
                                        currentPath={currentPath}
                                        locale={locale}
                                    />
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

export function DocsHeaderSearch({ locale, items }: DocsHeaderSearchProps) {
    const [open, setOpen] = useState(false);
    const resolvedItems = useMemo(() => items ?? getDocsSearchItems(locale), [items, locale]);

    const groups = useMemo(() => {
        const map = new Map<string, DocsSearchItem[]>();
        for (const item of resolvedItems) {
            const list = map.get(item.group) ?? [];
            list.push(item);
            map.set(item.group, list);
        }
        return Array.from(map.entries());
    }, [resolvedItems]);

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
                size="md"
                data-refineui-docs-search-trigger
                aria-label="Search documentation (⌘K)"
                onClick={() => setOpen(true)}
            >
                <WebIcon name="search" size={iconSizes.small} color="currentColor" aria-hidden />
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
                                        navigateTo(resolveHref(item.href, item.external), item.external);
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

const MOBILE_MENU_MQ = "(max-width: 49.99rem)";

export function DocsMobileMenuToggle() {
    const [expanded, setExpanded] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        document.body.toggleAttribute("data-mobile-menu-expanded", expanded);
        return () => document.body.removeAttribute("data-mobile-menu-expanded");
    }, [expanded]);

    useEffect(() => {
        const media = window.matchMedia(MOBILE_MENU_MQ);
        const onChange = () => {
            if (!media.matches) setExpanded(false);
        };
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, []);

    useEffect(() => {
        const nav = document.querySelector("[data-docs-mobile-sidebar]");
        const onKeyUp = (event: KeyboardEvent) => {
            if (event.code !== "Escape") return;
            setExpanded(false);
            buttonRef.current?.focus();
        };
        nav?.addEventListener("keyup", onKeyUp);
        return () => nav?.removeEventListener("keyup", onKeyUp);
    }, []);

    useEffect(() => {
        const close = () => setExpanded(false);
        document.addEventListener("astro:page-load", close);
        return () => document.removeEventListener("astro:page-load", close);
    }, []);

    return (
        <Button
            ref={buttonRef}
            type="button"
            layout="icon"
            variant="ghost"
            size="md"
            data-refineui-docs-menu-toggle
            aria-expanded={expanded}
            aria-controls="starlight__sidebar"
            aria-label={expanded ? "Close menu" : "Menu"}
            onClick={() => setExpanded((open) => !open)}
        >
            <WebIcon
                name={expanded ? "dismiss" : "text-align-justify"}
                size={iconSizes.small}
                color="currentColor"
                aria-hidden
            />
        </Button>
    );
}
