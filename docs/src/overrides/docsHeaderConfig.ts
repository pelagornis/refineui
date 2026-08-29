export type DocsHeaderNavLink = {
    label: string;
    href: string;
    description?: string;
    external?: boolean;
};

export type DocsHeaderNavSection = {
    value: string;
    label: string;
    href: string;
    links: DocsHeaderNavLink[];
};

export type DocsSearchItem = {
    value: string;
    label: string;
    href: string;
    group: string;
    keywords?: string[];
    external?: boolean;
};

/** Override sections or links to customize the header navigation menu. */
export const DOCS_HEADER_NAV: DocsHeaderNavSection[] = [
    {
        value: "foundations",
        label: "Foundations",
        href: "/foundations/",
        links: [
            { label: "Overview", href: "/foundations/", description: "Token-driven foundations" },
            { label: "Design tokens", href: "/foundations/design-tokens/", description: "Semantic token model" },
            { label: "Color", href: "/foundations/color/", description: "Palette and aliases" },
            { label: "Typography", href: "/foundations/typography/", description: "Type scale and roles" },
            { label: "Spacing", href: "/foundations/spacing/", description: "Layout rhythm" },
            { label: "Layout", href: "/foundations/layout/", description: "Grid, container, alignment" },
            {
                label: "Iconography",
                href: "https://github.com/pelagornis/refineui-system-icons",
                description: "System icons repository",
                external: true,
            },
        ],
    },
    {
        value: "components",
        label: "Components",
        href: "/components/",
        links: [
            { label: "Overview", href: "/components/", description: "Catalog and previews" },
            { label: "Button", href: "/components/button/", description: "Primary actions" },
            { label: "Input", href: "/components/input/", description: "Text entry" },
            { label: "Dialog", href: "/components/dialog/", description: "Modal surfaces" },
            { label: "Sidebar", href: "/components/sidebar/", description: "App navigation rail" },
            { label: "Table", href: "/components/table/", description: "Structured data" },
            { label: "Toast", href: "/components/toast/", description: "Transient feedback" },
            { label: "Tree", href: "/components/tree/", description: "Hierarchical lists" },
        ],
    },
    {
        value: "development",
        label: "Development",
        href: "/development/",
        links: [
            { label: "Overview", href: "/development/", description: "Build with RefineUI" },
            { label: "Installation", href: "/development/installation/", description: "Packages and setup" },
            { label: "Theming", href: "/development/theming/", description: "Light and dark modes" },
            { label: "Motion", href: "/development/motion/", description: "Duration and easing" },
        ],
    },
];

/** Override to customize command palette search targets. */
export const DOCS_SEARCH_ITEMS: DocsSearchItem[] = [
    { value: "getting-started", label: "Getting started", href: "/getting-started/", group: "Guides" },
    { value: "foundations", label: "Foundations overview", href: "/foundations/", group: "Foundations" },
    { value: "design-tokens", label: "Design tokens", href: "/foundations/design-tokens/", group: "Foundations" },
    { value: "color", label: "Color", href: "/foundations/color/", group: "Foundations" },
    { value: "typography", label: "Typography", href: "/foundations/typography/", group: "Foundations" },
    { value: "spacing", label: "Spacing", href: "/foundations/spacing/", group: "Foundations" },
    { value: "sizing", label: "Sizing", href: "/foundations/sizing/", group: "Foundations" },
    { value: "radius", label: "Radius", href: "/foundations/radius/", group: "Foundations" },
    { value: "border", label: "Border", href: "/foundations/border/", group: "Foundations" },
    { value: "elevation", label: "Elevation", href: "/foundations/elevation/", group: "Foundations" },
    { value: "opacity", label: "Opacity", href: "/foundations/opacity/", group: "Foundations" },
    { value: "motion-foundations", label: "Motion", href: "/foundations/motion/", group: "Foundations" },
    { value: "z-index", label: "Z-index", href: "/foundations/z-index/", group: "Foundations" },
    { value: "layout", label: "Layout", href: "/foundations/layout/", group: "Foundations" },
    { value: "components", label: "Components overview", href: "/components/", group: "Components" },
    { value: "accordion", label: "Accordion", href: "/components/accordion/", group: "Components" },
    { value: "alert", label: "Alert", href: "/components/alert/", group: "Components" },
    { value: "avatar", label: "Avatar", href: "/components/avatar/", group: "Components" },
    { value: "avatars", label: "Avatars", href: "/components/avatars/", group: "Components" },
    { value: "badge", label: "Badge", href: "/components/badge/", group: "Components" },
    { value: "box", label: "Box", href: "/components/box/", group: "Components" },
    { value: "breadcrumb", label: "Breadcrumb", href: "/components/breadcrumb/", group: "Components" },
    { value: "bubble", label: "Bubble", href: "/components/bubble/", group: "Components" },
    { value: "button", label: "Button", href: "/components/button/", group: "Components" },
    { value: "button-group", label: "Button Group", href: "/components/button-group/", group: "Components" },
    { value: "calendar", label: "Calendar", href: "/components/calendar/", group: "Components" },
    { value: "card", label: "Card", href: "/components/card/", group: "Components" },
    { value: "carousel", label: "Carousel", href: "/components/carousel/", group: "Components" },
    { value: "chart", label: "Chart", href: "/components/chart/", group: "Components" },
    { value: "checkbox", label: "Checkbox", href: "/components/checkbox/", group: "Components" },
    { value: "command", label: "Command", href: "/components/command/", group: "Components" },
    { value: "container", label: "Container", href: "/components/container/", group: "Components" },
    { value: "dialog", label: "Dialog", href: "/components/dialog/", group: "Components" },
    { value: "divider", label: "Divider", href: "/components/divider/", group: "Components" },
    { value: "drawer", label: "Drawer", href: "/components/drawer/", group: "Components" },
    { value: "dropdown", label: "Dropdown", href: "/components/dropdown/", group: "Components" },
    { value: "field", label: "Field", href: "/components/field/", group: "Components" },
    { value: "footer", label: "Footer", href: "/components/footer/", group: "Components" },
    { value: "grid", label: "Grid", href: "/components/grid/", group: "Components" },
    { value: "input", label: "Input", href: "/components/input/", group: "Components" },
    { value: "input-otp", label: "Input OTP", href: "/components/input-otp/", group: "Components" },
    { value: "label", label: "Label", href: "/components/label/", group: "Components" },
    { value: "link", label: "Link", href: "/components/link/", group: "Components" },
    { value: "menu", label: "Menu", href: "/components/menu/", group: "Components" },
    { value: "navigation-menu", label: "Navigation Menu", href: "/components/navigation-menu/", group: "Components" },
    { value: "pagination", label: "Pagination", href: "/components/pagination/", group: "Components" },
    { value: "popover", label: "Popover", href: "/components/popover/", group: "Components" },
    { value: "progress", label: "Progress", href: "/components/progress/", group: "Components" },
    { value: "progress-stepper", label: "Progress Stepper", href: "/components/progress-stepper/", group: "Components" },
    { value: "radio", label: "Radio", href: "/components/radio/", group: "Components" },
    { value: "resizable", label: "Resizable", href: "/components/resizable/", group: "Components" },
    { value: "scroll-area", label: "Scroll Area", href: "/components/scroll-area/", group: "Components" },
    { value: "search-field", label: "Search Field", href: "/components/search-field/", group: "Components" },
    { value: "segmented-control", label: "Segmented Control", href: "/components/segmented-control/", group: "Components" },
    { value: "select", label: "Select", href: "/components/select/", group: "Components" },
    { value: "sidebar", label: "Sidebar", href: "/components/sidebar/", group: "Components" },
    { value: "skeleton", label: "Skeleton", href: "/components/skeleton/", group: "Components" },
    { value: "slider", label: "Slider", href: "/components/slider/", group: "Components" },
    { value: "spin-button", label: "Spin Button", href: "/components/spin-button/", group: "Components" },
    { value: "spinner", label: "Spinner", href: "/components/spinner/", group: "Components" },
    { value: "stack", label: "Stack", href: "/components/stack/", group: "Components" },
    { value: "stepper", label: "Stepper", href: "/components/stepper/", group: "Components" },
    { value: "switch", label: "Switch", href: "/components/switch/", group: "Components" },
    { value: "table", label: "Table", href: "/components/table/", group: "Components" },
    { value: "tabs", label: "Tabs", href: "/components/tabs/", group: "Components" },
    { value: "tag", label: "Tag", href: "/components/tag/", group: "Components" },
    { value: "textarea", label: "Textarea", href: "/components/textarea/", group: "Components" },
    { value: "toast", label: "Toast", href: "/components/toast/", group: "Components" },
    { value: "tooltip", label: "Tooltip", href: "/components/tooltip/", group: "Components" },
    { value: "tree", label: "Tree", href: "/components/tree/", group: "Components" },
    { value: "development", label: "Development overview", href: "/development/", group: "Development" },
    { value: "installation", label: "Installation", href: "/development/installation/", group: "Development" },
    { value: "theming", label: "Theming", href: "/development/theming/", group: "Development" },
    { value: "motion-dev", label: "Motion", href: "/development/motion/", group: "Development" },
    { value: "ai-integration", label: "AI integration", href: "/ai-integration/", group: "Guides" },
];
