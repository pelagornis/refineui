import { toDocsLocale, withLocalePath, type DocsLocaleCode } from "../lib/docs-locale";

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
    /** When empty, the label is a direct link to `href` (no dropdown). */
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

const HEADER_NAV_KO: Record<string, { label: string; links?: Record<string, { label: string; description?: string }> }> = {
    foundations: {
        label: "파운데이션",
        links: {
            Overview: { label: "개요", description: "토큰 기반 파운데이션" },
            "Design tokens": { label: "디자인 토큰", description: "시맨틱 토큰 모델" },
            Color: { label: "컬러", description: "팔레트와 별칭" },
            Typography: { label: "타이포그래피", description: "타입 스케일과 역할" },
            Spacing: { label: "스페이싱", description: "레이아웃 리듬" },
            Layout: { label: "레이아웃", description: "그리드, 컨테이너, 정렬" },
            Iconography: { label: "아이코노그래피", description: "시스템 아이콘 저장소" },
        },
    },
    components: {
        label: "컴포넌트",
        links: {
            Overview: { label: "개요", description: "카탈로그와 프리뷰" },
            Button: { label: "Button", description: "주요 액션" },
            Input: { label: "Input", description: "텍스트 입력" },
            Dialog: { label: "Dialog", description: "모달 서피스" },
            Sidebar: { label: "Sidebar", description: "앱 내비게이션 레일" },
            Table: { label: "Table", description: "구조화된 데이터" },
            Toast: { label: "Toast", description: "일시적 피드백" },
            Tree: { label: "Tree", description: "계층형 목록" },
        },
    },
    development: {
        label: "개발",
        links: {
            Overview: { label: "개요", description: "RefineUI로 구축하기" },
            Installation: { label: "설치", description: "패키지와 설정" },
            Theming: { label: "테마", description: "라이트/다크 모드" },
            Motion: { label: "모션", description: "duration과 easing" },
        },
    },
    "ai-tools": {
        label: "AI & 도구",
        links: {
            Overview: { label: "개요", description: "LLM 인덱스와 에이전트 도구" },
            "DESIGN.md": { label: "DESIGN.md", description: "디자인 아이덴티티" },
            "llms.txt": { label: "llms.txt", description: "문서 인덱스" },
            "llm.txt": { label: "llm.txt", description: "확장 평문 레퍼런스" },
            Skill: { label: "Skill", description: "refineui 에이전트 스킬" },
            Doctor: { label: "Doctor", description: "워크스페이스 진단" },
            MCP: { label: "MCP", description: "@refineui/mcp 서버" },
        },
    },
};

const SEARCH_GROUP_KO: Record<string, string> = {
    Guides: "가이드",
    Foundations: "파운데이션",
    Components: "컴포넌트",
    Development: "개발",
    "AI & Tools": "AI & 도구",
};

const SEARCH_LABEL_KO: Record<string, string> = {
    "Getting started": "시작하기",
    "Foundations overview": "파운데이션 개요",
    "Design tokens": "디자인 토큰",
    Color: "컬러",
    Typography: "타이포그래피",
    Spacing: "스페이싱",
    Sizing: "사이징",
    Radius: "라디우스",
    Border: "보더",
    Elevation: "엘리베이션",
    Opacity: "투명도",
    Motion: "모션",
    Layout: "레이아웃",
    "Components overview": "컴포넌트 개요",
    "Development overview": "개발 개요",
    Installation: "설치",
    Theming: "테마",
    "AI & Tools overview": "AI & 도구 개요",
    "DESIGN.md": "DESIGN.md",
    "llms.txt": "llms.txt",
    "llm.txt": "llm.txt",
    "Z-index": "Z-index",
    Skill: "Skill",
    Doctor: "Doctor",
    MCP: "MCP",
};

function localizeHref(href: string, locale: DocsLocaleCode, external?: boolean): string {
    if (external) return href;
    return withLocalePath(href, locale);
}

/** Header nav sections for the active docs locale. */
export function getDocsHeaderNav(locale: string | undefined | null): DocsHeaderNavSection[] {
    const docsLocale = toDocsLocale(locale);
    return DOCS_HEADER_NAV.map((section) => {
        const koSection = docsLocale === "ko" ? HEADER_NAV_KO[section.value] : undefined;
        return {
            ...section,
            label: koSection?.label ?? section.label,
            href: localizeHref(section.href, docsLocale),
            links: section.links.map((link) => {
                const koLink = koSection?.links?.[link.label];
                return {
                    ...link,
                    label: koLink?.label ?? link.label,
                    description: koLink?.description ?? link.description,
                    href: localizeHref(link.href, docsLocale, link.external),
                };
            }),
        };
    });
}

/** Command palette items for the active docs locale. */
export function getDocsSearchItems(locale: string | undefined | null): DocsSearchItem[] {
    const docsLocale = toDocsLocale(locale);
    return DOCS_SEARCH_ITEMS.map((item) => ({
        ...item,
        label: docsLocale === "ko" ? (SEARCH_LABEL_KO[item.label] ?? item.label) : item.label,
        group: docsLocale === "ko" ? (SEARCH_GROUP_KO[item.group] ?? item.group) : item.group,
        href: localizeHref(item.href, docsLocale, item.external),
    }));
}

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
    {
        value: "ai-tools",
        label: "AI & Tools",
        href: "/ai-tools/",
        links: [
            { label: "Overview", href: "/ai-tools/", description: "LLM indexes and agent tooling" },
            { label: "DESIGN.md", href: "/DESIGN.md", description: "Stitch design identity for agents" },
            { label: "llms.txt", href: "/llms.txt", description: "Curated documentation index" },
            { label: "llm.txt", href: "/llm.txt", description: "Expanded plain-text reference" },
            { label: "Skill", href: "/ai-tools/skill/", description: "refineui agent skill" },
            { label: "Doctor", href: "/ai-tools/doctor/", description: "RefineUI workspace diagnostics" },
            { label: "MCP", href: "/ai-tools/mcp/", description: "@refineui/mcp server" },
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
    { value: "ai-tools", label: "AI & Tools overview", href: "/ai-tools/", group: "AI & Tools" },
    { value: "design-md", label: "DESIGN.md", href: "/DESIGN.md", group: "AI & Tools" },
    { value: "llms-txt", label: "llms.txt", href: "/llms.txt", group: "AI & Tools" },
    { value: "llm-txt", label: "llm.txt", href: "/llm.txt", group: "AI & Tools" },
    { value: "refineui-skill", label: "Skill", href: "/ai-tools/skill/", group: "AI & Tools" },
    { value: "refineui-doctor", label: "Doctor", href: "/ai-tools/doctor/", group: "AI & Tools" },
    { value: "refineui-mcp", label: "MCP", href: "/ai-tools/mcp/", group: "AI & Tools" },
];
