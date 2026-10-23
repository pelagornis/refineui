import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const kebab = (value) => value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
const title = (value) => value.replace(/([a-z])([A-Z])/g, "$1 $2");

const packageJson = readJson(join(root, "package.json"));
const spec = readJson(join(root, "spec/manifest.json"));
const index = readFileSync(join(root, "src/index.ts"), "utf8");

// This records module membership from explicit public-export declarations. It is
// deliberately not inferred from component-name prefixes.
const groups = [];
for (const match of index.matchAll(/export\s*\{([\s\S]*?)\}\s*from\s*"([^"]+)";/g)) {
    const names = match[1]
        .split(",")
        .map((item) => item.replace(/\/\/.*$/m, "").trim())
        .filter(Boolean)
        .filter((item) => !item.startsWith("type "))
        .map((item) => item.split(/\s+as\s+/)[0].trim())
        .filter((item) => /^[A-Z][A-Za-z0-9]*$/.test(item));
    if (names.length) groups.push({ source: match[2], names });
}

const officialRoots = new Map(spec.components.map((component) => [component.export, component]));
// The behavior catalog calls this family "Resizable" but the public React root
// is ResizablePanelGroup. Keeping the public export here makes manifests usable.
const rootAliases = new Map([["ResizablePanelGroup", { id: "resizable", name: "Resizable", spec: "./components/resizable.json" }]]);
const portalContracts = {
    Dialog: { strategy: "themed-overlay-root", inheritsTheme: true, containerComponent: "DialogContent", containerProp: "container" },
    Drawer: { strategy: "themed-overlay-root", inheritsTheme: true, containerComponent: "DrawerContent", containerProp: "container" },
    Select: { strategy: "themed-overlay-root", inheritsTheme: true, containerComponent: "SelectPortal", containerProp: "container" },
    Dropdown: { strategy: "document-body", inheritsTheme: false },
    ContextMenu: { strategy: "document-body", inheritsTheme: false },
    Toast: { strategy: "document-body", inheritsTheme: false },
};
const providerParts = new Set(["SidebarProvider", "SelectPortal", "DropdownPortal", "ContextMenuPortal", "Toaster"]);
const noText = new Set(["Input", "Textarea", "Checkbox", "Radio", "Switch", "Slider", "SpinButton", "Progress", "Spinner", "Skeleton", "Spacer", "Divider", "Calendar", "Slot"]);
// ReactNode-valued API is represented as a structural slot, never as a JSON
// prop. This lets any editor persist an ordinary component tree while still
// rendering APIs such as `startIcon` and Toast's `message` correctly.
const propSlots = {
    Toast: [
        { name: "message", prop: "message", accepts: ["Text"], allowText: true },
        { name: "icon", prop: "icon", accepts: ["WebIcon"] },
    ],
    CommandInput: [{ name: "startIcon", prop: "startIcon", accepts: ["WebIcon"] }],
    CommandItem: [
        { name: "startIcon", prop: "startIcon", accepts: ["WebIcon"] },
        { name: "endIcon", prop: "endIcon", accepts: ["WebIcon"] },
    ],
    MenuItem: [
        { name: "startIcon", prop: "startIcon", accepts: ["WebIcon"] },
        { name: "endIcon", prop: "endIcon", accepts: ["WebIcon"] },
        { name: "description", prop: "description", accepts: ["Text"], allowText: true },
        { name: "shortcut", prop: "shortcut", accepts: ["Text"], allowText: true },
    ],
    MenuSubTrigger: [
        { name: "startIcon", prop: "startIcon", accepts: ["WebIcon"] },
        { name: "description", prop: "description", accepts: ["Text"], allowText: true },
    ],
    ContextMenuItem: [
        { name: "startIcon", prop: "startIcon", accepts: ["WebIcon"] },
        { name: "endIcon", prop: "endIcon", accepts: ["WebIcon"] },
        { name: "description", prop: "description", accepts: ["Text"], allowText: true },
        { name: "shortcut", prop: "shortcut", accepts: ["Text"], allowText: true },
    ],
    ContextMenuSubTrigger: [
        { name: "startIcon", prop: "startIcon", accepts: ["WebIcon"] },
        { name: "description", prop: "description", accepts: ["Text"], allowText: true },
    ],
};

const stateBindings = {
    Accordion: [{ name: "value", valueProp: "value", defaultValueProp: "defaultValue", changeEvent: "onValueChange", valueType: "json" }],
    Command: [
        { name: "value", valueProp: "value", defaultValueProp: "defaultValue", changeEvent: "onValueChange", valueType: "string" },
        { name: "selected", valueProp: "selectedValue", defaultValueProp: "defaultSelectedValue", changeEvent: "onSelectedValueChange", valueType: "string" },
    ],
    Carousel: [{ name: "index", valueProp: "index", defaultValueProp: "defaultIndex", changeEvent: "onIndexChange", valueType: "number" }],
    Dialog: [{ name: "open", valueProp: "open", defaultValueProp: "defaultOpen", changeEvent: "onOpenChange", valueType: "boolean" }],
    Drawer: [{ name: "open", valueProp: "open", defaultValueProp: "defaultOpen", changeEvent: "onOpenChange", valueType: "boolean" }],
    Dropdown: [{ name: "open", valueProp: "open", defaultValueProp: "defaultOpen", changeEvent: "onOpenChange", valueType: "boolean" }],
    Collapsible: [{ name: "open", valueProp: "open", defaultValueProp: "defaultOpen", changeEvent: "onOpenChange", valueType: "boolean" }],
    ContextMenu: [{ name: "open", valueProp: "open", defaultValueProp: "defaultOpen", changeEvent: "onOpenChange", valueType: "boolean" }],
    Menu: [{ name: "open", valueProp: "open", defaultValueProp: "defaultOpen", changeEvent: "onOpenChange", valueType: "boolean" }],
    NavigationMenu: [{ name: "value", valueProp: "value", defaultValueProp: "defaultValue", changeEvent: "onValueChange", valueType: "string" }],
    Popover: [{ name: "open", valueProp: "open", defaultValueProp: "defaultOpen", changeEvent: "onOpenChange", valueType: "boolean" }],
    PopOver: [{ name: "open", valueProp: "open", defaultValueProp: "defaultOpen", changeEvent: "onOpenChange", valueType: "boolean" }],
    Select: [{ name: "value", valueProp: "value", defaultValueProp: "defaultValue", changeEvent: "onValueChange", valueType: "string" }],
    SearchField: [{ name: "value", valueProp: "value", defaultValueProp: "defaultValue", changeEvent: "onValueChange", valueType: "string" }],
    SegmentedControl: [{ name: "value", valueProp: "value", defaultValueProp: "defaultValue", changeEvent: "onValueChange", valueType: "string" }],
    ProgressStepper: [{ name: "value", valueProp: "value", defaultValueProp: "defaultValue", changeEvent: "onValueChange", valueType: "number" }],
    Tabs: [{ name: "value", valueProp: "value", defaultValueProp: "defaultValue", changeEvent: "onValueChange", valueType: "string" }],
    Tree: [
        { name: "expanded", valueProp: "expanded", defaultValueProp: "defaultExpanded", changeEvent: "onExpandedChange", valueType: "string-array" },
        { name: "selected", valueProp: "selected", defaultValueProp: "defaultSelected", changeEvent: "onSelectedChange", valueType: "string" },
    ],
    Stepper: [{ name: "value", valueProp: "value", defaultValueProp: "defaultValue", changeEvent: "onValueChange", valueType: "number" }],
    Slider: [{ name: "value", valueProp: "value", defaultValueProp: "defaultValue", changeEvent: "onValueChange", valueType: "number" }],
    SpinButton: [{ name: "value", valueProp: "value", changeEvent: "onChange", valueType: "number" }],
};

const rootProps = {
    Text: [{ name: "variant", label: "Text style", valueType: "enum", control: "select", options: ["displayLg", "displayMd", "displaySm", "headingLg", "headingMd", "headingSm", "titleLg", "titleMd", "titleSm", "subtitleLg", "subtitleMd", "bodyLg", "bodyMd", "bodySm", "bodyXs", "labelLg", "labelMd", "labelSm", "captionLg", "captionMd", "captionSm"], defaultValue: "bodyMd", required: true, section: "variants" }],
    Bubble: [
        { name: "variant", label: "Variant", valueType: "enum", control: "select", options: ["default", "secondary", "muted", "tinted", "outline", "ghost", "destructive"], defaultValue: "default", section: "variants" },
        { name: "align", label: "Align", valueType: "enum", control: "segmented", options: ["start", "end"], defaultValue: "start", section: "variants" },
    ],
    Carousel: [
        { name: "defaultIndex", label: "Initial slide", valueType: "number", control: "number", defaultValue: 0, bindable: true, section: "state" },
        { name: "loop", label: "Loop", valueType: "boolean", control: "toggle", defaultValue: true, section: "state" },
    ],
    Tree: [
        { name: "size", label: "Size", valueType: "enum", control: "segmented", options: ["sm", "md", "lg"], defaultValue: "md", section: "variants" },
        { name: "defaultExpanded", label: "Initially expanded", valueType: "string-array", control: "collection", defaultValue: ["item-1"], section: "state" },
        { name: "defaultSelected", label: "Initially selected", valueType: "string", control: "text", defaultValue: "item-1", section: "state" },
    ],
};

// Additional persisted scalar props used by structural parts. These are kept
// separate from requiredProps so an editor can expose them without falsely
// claiming that the runtime requires a value.
const serializablePartProps = {
    SelectItem: [{ name: "textValue", valueType: "string", control: "text", section: "accessibility" }],
};

// Required props used by default presets. These are values, never React nodes,
// callback functions, refs, or DOM targets.
const presetProps = {
    Text: { variant: "bodyMd" },
    Progress: { value: 50 },
    Avatars: { avatars: [{ alt: "Avatar" }] },
    InputOTP: { maxLength: 4, "aria-label": "Verification code" },
    SpinButton: { value: 0 },
    SidebarPeek: { widthPercent: 35 },
};

// Runtime-required values are declared here instead of reverse-engineering
// TypeScript at runtime. They drive both editor controls and preset validation.
const requiredProps = {
    InputOTP: [{ name: "maxLength", valueType: "number", control: "number", defaultValue: 4 }],
    InputOTPSlot: [{ name: "index", valueType: "number", control: "number" }],
    Progress: [{ name: "value", valueType: "number", control: "number", defaultValue: 50 }],
    SpinButton: [{ name: "value", valueType: "number", control: "number", defaultValue: 0 }],
    SelectItem: [{ name: "value", valueType: "string", control: "text" }],
    CommandItem: [{ name: "value", valueType: "string", control: "text" }],
    TabsTrigger: [{ name: "value", valueType: "string", control: "text" }],
    TabsContent: [{ name: "value", valueType: "string", control: "text" }],
    SegmentedControlItem: [{ name: "value", valueType: "string", control: "text" }],
    AccordionItem: [{ name: "value", valueType: "string", control: "text" }],
    TreeItem: [{ name: "value", valueType: "string", control: "text" }],
    ProgressStepperItem: [{ name: "value", valueType: "number", control: "number" }],
    StepperItem: [{ name: "value", valueType: "number", control: "number" }],
    ChartBars: [{ name: "values", valueType: "number-array", control: "collection" }],
    ChartLine: [{ name: "values", valueType: "number-array", control: "collection" }],
    ChartAxisLabels: [{ name: "labels", valueType: "string-array", control: "collection" }],
    ChartLegendItem: [{ name: "seriesColor", valueType: "enum", control: "select" }],
    SidebarPeek: [{ name: "widthPercent", valueType: "number", control: "number", defaultValue: 35 }],
};

const corePresets = {
    Bubble: { id: "message", label: "Message", root: { component: "Bubble", props: { variant: "default", align: "start" }, slots: { children: [{ component: "BubbleContent", text: "Message" }, { component: "BubbleReactions", props: { side: "bottom", align: "end" }, text: "Reaction" }] } } },
    Carousel: { id: "slides", label: "Slides", root: { component: "Carousel", props: { defaultIndex: 0, loop: true }, slots: { children: [{ component: "CarouselContent", slots: { children: [{ component: "CarouselItem", text: "Slide 1" }, { component: "CarouselItem", text: "Slide 2" }, { component: "CarouselItem", text: "Slide 3" }] } }, { component: "CarouselControls", slots: { children: [{ component: "CarouselPrevious" }, { component: "CarouselNext" }] } }, { component: "CarouselIndicators" }] } } },
    Tree: { id: "nested", label: "Nested tree", root: { component: "Tree", props: { defaultExpanded: ["item-1"], defaultSelected: "item-1", size: "md" }, slots: { children: [{ component: "TreeItem", props: { value: "item-1" }, slots: { children: [{ component: "TreeItemTrigger", text: "Item 1" }, { component: "TreeItemContent", slots: { children: [{ component: "TreeItem", props: { value: "item-1-1" }, slots: { children: [{ component: "TreeItemTrigger", text: "Child item" }] } }] } }] } }] } } },
};

Object.assign(corePresets, {
    Radio: { id: "choice", label: "Radio choice", root: { component: "Radio", props: { label: "Choose this option" } } },
    Avatar: { id: "initials", label: "Initials avatar", root: { component: "Avatar", slots: { children: [{ component: "AvatarText", text: "AB" }] } } },
    Footer: { id: "site-footer", label: "Site footer", root: { component: "Footer", slots: { children: [{ component: "FooterContent", slots: { children: [{ component: "FooterBrand", slots: { children: [{ component: "FooterBrandName", text: "Company" }, { component: "FooterBrandDescription", text: "A short description." }] } }, { component: "FooterExplore", slots: { children: [{ component: "FooterGroup", slots: { children: [{ component: "FooterGroupLabel", text: "Explore" }, { component: "FooterLink", props: { href: "#" }, text: "Documentation" }] } }] } }] } }, { component: "FooterBottom", slots: { children: [{ component: "FooterCopyright", text: "© Company" }] } }] } } },
    Box: { id: "box", label: "Box", root: { component: "Box", props: { padding: "sizeMedium", background: "backgroundPrimary", radius: "roundedMedium" }, text: "Box content" } },
    Container: { id: "container", label: "Container", root: { component: "Container", text: "Container content" } },
    Spacer: { id: "spacer", label: "Spacer", root: { component: "Spacer" } },
    Stack: { id: "stack", label: "Stack", root: { component: "Stack", props: { gap: "sizeMedium" }, text: "Stack content" } },
    Label: { id: "label", label: "Label", root: { component: "Label", text: "Label" } },
    Toast: { id: "toast", label: "Toast", root: { component: "Toast", props: { variant: "default" }, slots: { message: [{ component: "Text", props: { variant: "bodyMd" }, text: "Changes saved" }] } } },
    InputOTP: { id: "code", label: "Verification code", root: { component: "InputOTP", props: { maxLength: 4, "aria-label": "Verification code" }, slots: { children: [{ component: "InputOTPSlot", props: { index: 0 } }, { component: "InputOTPSlot", props: { index: 1 } }, { component: "InputOTPSlot", props: { index: 2 } }, { component: "InputOTPSlot", props: { index: 3 } }] } } },
    SearchField: { id: "search", label: "Search field", root: { component: "SearchField", props: { "aria-label": "Search" }, slots: { children: [{ component: "SearchFieldIcon" }, { component: "SearchFieldInput", props: { placeholder: "Search" } }, { component: "SearchFieldClear" }] } } },
    Card: { id: "content", label: "Content card", root: { component: "Card", slots: { children: [{ component: "CardHeader", slots: { children: [{ component: "CardHeaderMain", slots: { children: [{ component: "CardTitle", text: "Card title" }, { component: "CardDescription", text: "A concise description." }] } }] } }, { component: "CardContent", text: "Card content" }, { component: "CardFooter", text: "Footer" }] } } },
    Select: { id: "options", label: "Options", root: { component: "Select", props: { defaultValue: "option-1", placeholder: "Select an option" }, slots: { children: [{ component: "SelectTrigger", slots: { children: [{ component: "SelectValue", props: { placeholder: "Select an option" } }, { component: "SelectIcon" }] } }, { component: "SelectPortal", slots: { children: [{ component: "SelectContent", slots: { children: [{ component: "SelectViewport", slots: { children: [{ component: "SelectItem", props: { value: "option-1", textValue: "Option 1" }, slots: { children: [{ component: "SelectItemText", text: "Option 1" }] } }, { component: "SelectItem", props: { value: "option-2", textValue: "Option 2" }, slots: { children: [{ component: "SelectItemText", text: "Option 2" }] } }] } }] } }] } }] } } },
    Command: { id: "commands", label: "Command menu", root: { component: "Command", props: { label: "Commands" }, slots: { children: [{ component: "CommandInput", props: { placeholder: "Search commands" } }, { component: "CommandList", slots: { children: [{ component: "CommandGroup", slots: { children: [{ component: "CommandGroupHeading", text: "Actions" }, { component: "CommandItem", props: { value: "new" }, text: "New item" }, { component: "CommandItem", props: { value: "open" }, text: "Open" }] } }] } }] } } },
    Alert: { id: "notice", label: "Notice", root: { component: "Alert", props: { variant: "info" }, slots: { children: [{ component: "AlertRow", slots: { children: [{ component: "AlertContent", slots: { children: [{ component: "AlertTitle", text: "Heads up" }, { component: "AlertDescription", text: "This is a helpful message." }] } }] } }] } } },
    ProgressStepper: { id: "steps", label: "Progress steps", root: { component: "ProgressStepper", props: { defaultValue: 0 }, slots: { children: [{ component: "ProgressStepperList", slots: { children: [{ component: "ProgressStepperItem", props: { value: 0 }, slots: { children: [{ component: "ProgressStepperMarker" }, { component: "ProgressStepperLabel", text: "Start" }] } }, { component: "ProgressStepperItem", props: { value: 1 }, slots: { children: [{ component: "ProgressStepperMarker" }, { component: "ProgressStepperLabel", text: "Finish" }] } }] } }] } } },
    Tabs: { id: "tabs", label: "Tabs", root: { component: "Tabs", props: { defaultValue: "tab-1" }, slots: { children: [{ component: "TabsList", slots: { children: [{ component: "TabsTrigger", props: { value: "tab-1" }, text: "First" }, { component: "TabsTrigger", props: { value: "tab-2" }, text: "Second" }] } }, { component: "TabsContent", props: { value: "tab-1" }, text: "First tab content" }, { component: "TabsContent", props: { value: "tab-2" }, text: "Second tab content" }] } } },
    SegmentedControl: { id: "choices", label: "Choices", root: { component: "SegmentedControl", props: { defaultValue: "first" }, slots: { children: [{ component: "SegmentedControlItem", props: { value: "first" }, text: "First" }, { component: "SegmentedControlItem", props: { value: "second" }, text: "Second" }] } } },
    Table: { id: "data", label: "Data table", root: { component: "Table", slots: { children: [{ component: "TableHeader", slots: { children: [{ component: "TableRow", slots: { children: [{ component: "TableHead", text: "Name" }, { component: "TableHead", text: "Status" }] } }] } }, { component: "TableBody", slots: { children: [{ component: "TableRow", slots: { children: [{ component: "TableCell", text: "Example" }, { component: "TableCell", text: "Active" }] } }] } }] } } },
    Accordion: { id: "items", label: "Accordion", root: { component: "Accordion", props: { type: "single", defaultValue: "item-1" }, slots: { children: [{ component: "AccordionItem", props: { value: "item-1" }, slots: { children: [{ component: "AccordionTrigger", text: "What is RefineUI?" }, { component: "AccordionContent", text: "A composable component library." }] } }] } } },
    Breadcrumb: { id: "trail", label: "Breadcrumb", root: { component: "Breadcrumb", slots: { children: [{ component: "BreadcrumbList", slots: { children: [{ component: "BreadcrumbItem", slots: { children: [{ component: "BreadcrumbLink", props: { href: "#" }, text: "Home" }] } }, { component: "BreadcrumbSeparator", text: "/" }, { component: "BreadcrumbItem", slots: { children: [{ component: "BreadcrumbPage", text: "Current page" }] } }] } }] } } },
    Dialog: { id: "dialog", label: "Dialog", root: { component: "Dialog", props: { defaultOpen: false }, slots: { children: [{ component: "DialogTrigger", text: "Open dialog" }, { component: "DialogContent", slots: { children: [{ component: "DialogHeader", slots: { children: [{ component: "DialogTitle", text: "Dialog title" }, { component: "DialogDescription", text: "Dialog description" }] } }] } }] } } },
    Drawer: { id: "drawer", label: "Drawer", root: { component: "Drawer", props: { defaultOpen: false, placement: "right" }, slots: { children: [{ component: "DrawerTrigger", text: "Open drawer" }, { component: "DrawerContent", slots: { children: [{ component: "DrawerHeader", slots: { children: [{ component: "DrawerTitle", text: "Drawer title" }, { component: "DrawerDescription", text: "Drawer description" }] } }, { component: "DrawerBody", text: "Drawer content" }] } }] } } },
    Dropdown: { id: "menu", label: "Dropdown menu", root: { component: "Dropdown", slots: { children: [{ component: "DropdownTrigger", text: "Open menu" }, { component: "DropdownPortal", slots: { children: [{ component: "DropdownContent", slots: { children: [{ component: "DropdownItem", text: "First action" }, { component: "DropdownItem", text: "Second action" }] } }] } }] } } },
    Field: { id: "field", label: "Field", root: { component: "Field", slots: { children: [{ component: "FieldLabel", text: "Label" }, { component: "FieldHint", text: "Helpful hint" }] } } },
    Grid: { id: "grid", label: "Grid", root: { component: "Grid", slots: { children: [{ component: "GridItem", text: "Item 1" }, { component: "GridItem", text: "Item 2" }] } } },
    Menu: { id: "menu", label: "Menu", root: { component: "Menu", slots: { children: [{ component: "MenuTrigger", text: "Open menu" }, { component: "MenuPopover", slots: { children: [{ component: "MenuList", slots: { children: [{ component: "MenuItem", text: "First item" }, { component: "MenuItem", text: "Second item" }] } }] } }] } } },
    NavigationMenu: { id: "navigation", label: "Navigation", root: { component: "NavigationMenu", slots: { children: [{ component: "NavigationMenuList", slots: { children: [{ component: "NavigationMenuItem", props: { value: "products" }, slots: { children: [{ component: "NavigationMenuTrigger", text: "Products" }, { component: "NavigationMenuContent", slots: { children: [{ component: "NavigationMenuLink", props: { href: "#" }, text: "Overview" }] } }] } }] } }] } } },
    Pagination: { id: "pages", label: "Pagination", root: { component: "Pagination", slots: { children: [{ component: "PaginationContent", slots: { children: [{ component: "PaginationItem", slots: { children: [{ component: "PaginationLink", props: { href: "#", isActive: true }, text: "1" }] } }, { component: "PaginationItem", slots: { children: [{ component: "PaginationLink", props: { href: "#" }, text: "2" }] } }, { component: "PaginationNext", text: "Next" }] } }] } } },
    PopOver: { id: "popover", label: "Popover", root: { component: "PopOver", props: { defaultOpen: false }, slots: { children: [{ component: "PopoverTrigger", text: "Open popover" }, { component: "PopoverContent", text: "Popover content" }] } } },
    ResizablePanelGroup: { id: "panels", label: "Resizable panels", root: { component: "ResizablePanelGroup", slots: { children: [{ component: "ResizablePanel", props: { defaultSize: 50 }, text: "First panel" }, { component: "ResizableHandle", props: { withHandle: true } }, { component: "ResizablePanel", props: { defaultSize: 50 }, text: "Second panel" }] } } },
    ScrollArea: { id: "scroll", label: "Scrollable content", root: { component: "ScrollArea", slots: { children: [{ component: "ScrollAreaViewport", text: "Scrollable content" }, { component: "ScrollAreaScrollbar", props: { orientation: "vertical" }, slots: { children: [{ component: "ScrollAreaThumb" }] } }] } } },
    Sidebar: { id: "sidebar", label: "Sidebar", root: { component: "Sidebar", slots: { children: [{ component: "SidebarHeader", slots: { children: [{ component: "SidebarBrand", text: "Workspace" }] } }, { component: "SidebarContent", slots: { children: [{ component: "SidebarNav", slots: { children: [{ component: "SidebarLink", props: { href: "#", active: true }, text: "Overview" }, { component: "SidebarLink", props: { href: "#" }, text: "Settings" }] } }] } }] } } },
    Stepper: { id: "steps", label: "Stepper", root: { component: "Stepper", props: { defaultValue: 0 }, slots: { children: [{ component: "StepperList", slots: { children: [{ component: "StepperItem", props: { value: 0 }, slots: { children: [{ component: "StepperIndicator", text: "1" }, { component: "StepperContent", slots: { children: [{ component: "StepperTitle", text: "Start" }] } }] } }, { component: "StepperItem", props: { value: 1 }, slots: { children: [{ component: "StepperIndicator", text: "2" }, { component: "StepperContent", slots: { children: [{ component: "StepperTitle", text: "Finish" }] } }] } }] } }] } } },
    Chart: { id: "bar-chart", label: "Bar chart", root: { component: "Chart", slots: { children: [{ component: "ChartBody", slots: { children: [{ component: "ChartContent", slots: { children: [{ component: "ChartPlot", props: { "aria-label": "Example chart" }, slots: { children: [{ component: "ChartGrid", props: { values: [12, 24, 18] } }, { component: "ChartBars", props: { values: [12, 24, 18] } }] } }] } }] } }] } } },
    Collapsible: { id: "collapsible", label: "Collapsible", root: { component: "Collapsible", props: { defaultOpen: true }, slots: { children: [{ component: "CollapsibleTrigger", text: "Toggle details" }, { component: "CollapsibleContent", text: "Additional details" }] } } },
    ContextMenu: { id: "context-menu", label: "Context menu", root: { component: "ContextMenu", slots: { children: [{ component: "ContextMenuTrigger", text: "Right-click target" }, { component: "ContextMenuPortal", slots: { children: [{ component: "ContextMenuContent", slots: { children: [{ component: "ContextMenuItem", text: "Copy" }, { component: "ContextMenuItem", text: "Paste" }] } }] } }] } } },
});

const slot = (name, accepts, options = {}) => ({ name, accepts, ...options });
const propSlot = (name, prop, accepts, options = {}) => ({ name, prop, target: "prop", accepts, max: 1, ...options });
const parent = (component, slotName = "children") => ({ component, slot: slotName });

// These are authoring definitions, not naming conventions.  They intentionally
// encode every composite family’s valid child graph in one reviewable place.
const composition = {
    Avatar: { slots: [slot("children", ["AvatarImage", "AvatarFallback", "AvatarText", "AvatarIcon", "AvatarBadge"], { repeatable: true })], parents: { AvatarImage: [parent("Avatar")], AvatarFallback: [parent("Avatar")], AvatarText: [parent("Avatar")], AvatarIcon: [parent("Avatar")], AvatarBadge: [parent("Avatar")] } },
    InputOTP: { slots: [slot("children", ["InputOTPSlot"], { repeatable: true, min: 1 })], parents: { InputOTPSlot: [parent("InputOTP")] } },
    SearchField: { slots: [slot("children", ["SearchFieldIcon", "SearchFieldInput", "SearchFieldClear"], { repeatable: true })], parents: { SearchFieldIcon: [parent("SearchField")], SearchFieldInput: [parent("SearchField")], SearchFieldClear: [parent("SearchField")] } },
    Card: { slots: [slot("children", ["CardHeader", "CardContent", "CardFooter"], { repeatable: true })], parents: { CardHeader: [parent("Card")], CardContent: [parent("Card")], CardFooter: [parent("Card")], CardHeaderMain: [parent("CardHeader")], CardAction: [parent("CardHeader")], CardTitle: [parent("CardHeader"), parent("CardHeaderMain")], CardDescription: [parent("CardHeader"), parent("CardHeaderMain")] }, partSlots: { CardHeader: [slot("children", ["CardHeaderMain", "CardAction", "CardTitle", "CardDescription"], { repeatable: true })], CardHeaderMain: [slot("children", ["CardTitle", "CardDescription"], { repeatable: true })] } },
    Select: { slots: [slot("children", ["SelectTrigger", "SelectPortal"], { repeatable: true })], parents: { SelectTrigger: [parent("Select")], SelectValue: [parent("SelectTrigger")], SelectIcon: [parent("SelectTrigger")], SelectArrow: [parent("SelectTrigger")], SelectPortal: [parent("Select")], SelectContent: [parent("SelectPortal")], SelectViewport: [parent("SelectContent")], SelectScrollUpButton: [parent("SelectContent")], SelectScrollDownButton: [parent("SelectContent")], SelectGroup: [parent("SelectViewport")], SelectItem: [parent("SelectViewport"), parent("SelectGroup")], SelectLabel: [parent("SelectGroup")], SelectSeparator: [parent("SelectViewport"), parent("SelectGroup")], SelectItemIndicator: [parent("SelectItem")], SelectItemText: [parent("SelectItem")] }, partSlots: { SelectTrigger: [slot("children", ["SelectValue", "SelectIcon", "SelectArrow"], { repeatable: true })], SelectPortal: [slot("children", ["SelectContent"], { max: 1 })], SelectContent: [slot("children", ["SelectScrollUpButton", "SelectViewport", "SelectScrollDownButton"], { repeatable: true })], SelectViewport: [slot("children", ["SelectGroup", "SelectItem", "SelectSeparator"], { repeatable: true })], SelectGroup: [slot("children", ["SelectLabel", "SelectItem", "SelectSeparator"], { repeatable: true })], SelectItem: [slot("children", ["SelectItemIndicator", "SelectItemText"], { repeatable: true })] } },
    Command: { slots: [slot("children", ["CommandInput", "CommandList"], { repeatable: true })], parents: { CommandInput: [parent("Command")], CommandList: [parent("Command")], CommandEmpty: [parent("CommandList")], CommandGroup: [parent("CommandList")], CommandSeparator: [parent("CommandList")], CommandGroupHeading: [parent("CommandGroup")], CommandItem: [parent("CommandGroup"), parent("CommandList")], CommandShortcut: [parent("CommandItem")] }, partSlots: { CommandList: [slot("children", ["CommandEmpty", "CommandGroup", "CommandItem", "CommandSeparator"], { repeatable: true })], CommandGroup: [slot("children", ["CommandGroupHeading", "CommandItem"], { repeatable: true })], CommandItem: [slot("children", ["CommandShortcut"], { repeatable: true, allowText: true })] } },
    Alert: { slots: [slot("children", ["AlertRow", "AlertContent", "AlertActions"], { repeatable: true })], parents: { AlertRow: [parent("Alert")], AlertContent: [parent("Alert"), parent("AlertRow")], AlertIcon: [parent("AlertRow")], AlertBody: [parent("AlertContent")], AlertTitle: [parent("AlertBody"), parent("AlertContent")], AlertDescription: [parent("AlertBody"), parent("AlertContent")], AlertActions: [parent("Alert")], AlertAction: [parent("AlertActions")], AlertClose: [parent("AlertActions"), parent("Alert")] }, partSlots: { AlertRow: [slot("children", ["AlertIcon", "AlertContent"], { repeatable: true })], AlertContent: [slot("children", ["AlertBody", "AlertTitle", "AlertDescription"], { repeatable: true })], AlertBody: [slot("children", ["AlertTitle", "AlertDescription"], { repeatable: true })], AlertActions: [slot("children", ["AlertAction", "AlertClose"], { repeatable: true })] } },
    ProgressStepper: { slots: [slot("children", ["ProgressStepperList"], { max: 1 })], parents: { ProgressStepperList: [parent("ProgressStepper")], ProgressStepperItem: [parent("ProgressStepperList")], ProgressStepperMarker: [parent("ProgressStepperItem")], ProgressStepperLabel: [parent("ProgressStepperItem")] }, partSlots: { ProgressStepperList: [slot("children", ["ProgressStepperItem"], { repeatable: true, min: 1 })], ProgressStepperItem: [slot("children", ["ProgressStepperMarker", "ProgressStepperLabel"], { repeatable: true })] } },
    Tabs: { slots: [slot("children", ["TabsList", "TabsContent"], { repeatable: true })], parents: { TabsList: [parent("Tabs")], TabsTrigger: [parent("TabsList")], TabsContent: [parent("Tabs")] }, partSlots: { TabsList: [slot("children", ["TabsTrigger"], { repeatable: true, min: 1 })] } },
    SegmentedControl: { slots: [slot("children", ["SegmentedControlItem"], { repeatable: true, min: 1 })], parents: { SegmentedControlItem: [parent("SegmentedControl")] } },
    Table: { slots: [slot("children", ["TableCaption", "TableHeader", "TableBody", "TableFooter"], { repeatable: true })], parents: { TableCaption: [parent("Table")], TableHeader: [parent("Table")], TableBody: [parent("Table")], TableFooter: [parent("Table")], TableRow: [parent("TableHeader"), parent("TableBody"), parent("TableFooter")], TableHead: [parent("TableRow")], TableCell: [parent("TableRow")] }, partSlots: { TableHeader: [slot("children", ["TableRow"], { repeatable: true })], TableBody: [slot("children", ["TableRow"], { repeatable: true })], TableFooter: [slot("children", ["TableRow"], { repeatable: true })], TableRow: [slot("children", ["TableHead", "TableCell"], { repeatable: true, min: 1 })] } },
    Accordion: { slots: [slot("children", ["AccordionItem"], { repeatable: true, min: 1 })], parents: { AccordionItem: [parent("Accordion")], AccordionTrigger: [parent("AccordionItem")], AccordionContent: [parent("AccordionItem")] }, partSlots: { AccordionItem: [slot("children", ["AccordionTrigger", "AccordionContent"], { repeatable: true })] } },
    Breadcrumb: { slots: [slot("children", ["BreadcrumbList"], { max: 1 })], parents: { BreadcrumbList: [parent("Breadcrumb")], BreadcrumbItem: [parent("BreadcrumbList")], BreadcrumbSeparator: [parent("BreadcrumbList")], BreadcrumbLink: [parent("BreadcrumbItem")], BreadcrumbPage: [parent("BreadcrumbItem")], BreadcrumbEllipsis: [parent("BreadcrumbItem")], BreadcrumbEllipsisTrigger: [parent("BreadcrumbEllipsis")] }, partSlots: { BreadcrumbList: [slot("children", ["BreadcrumbItem", "BreadcrumbSeparator"], { repeatable: true })], BreadcrumbItem: [slot("children", ["BreadcrumbLink", "BreadcrumbPage", "BreadcrumbEllipsis"], { repeatable: true })] } },
    Footer: { slots: [slot("children", ["FooterContent", "FooterBottom"], { repeatable: true })], parents: { FooterContent: [parent("Footer")], FooterBottom: [parent("Footer")], FooterBrand: [parent("FooterContent")], FooterExplore: [parent("FooterContent")], FooterNav: [parent("FooterContent")], FooterSocial: [parent("FooterContent")], FooterBrandName: [parent("FooterBrand")], FooterBrandDescription: [parent("FooterBrand")], FooterLogo: [parent("FooterBrand")], FooterGroup: [parent("FooterExplore")], FooterGroupLabel: [parent("FooterGroup")], FooterLink: [parent("FooterGroup"), parent("FooterNav")], FooterCopyright: [parent("FooterBottom")], FooterMeta: [parent("FooterBottom")], FooterMetaEnd: [parent("FooterBottom")], FooterLocale: [parent("FooterMeta"), parent("FooterMetaEnd")] }, partSlots: { FooterContent: [slot("children", ["FooterBrand", "FooterExplore", "FooterNav", "FooterSocial"], { repeatable: true })], FooterBrand: [slot("children", ["FooterLogo", "FooterBrandName", "FooterBrandDescription"], { repeatable: true })], FooterExplore: [slot("children", ["FooterGroup"], { repeatable: true })], FooterGroup: [slot("children", ["FooterGroupLabel", "FooterLink"], { repeatable: true })], FooterBottom: [slot("children", ["FooterCopyright", "FooterMeta", "FooterMetaEnd"], { repeatable: true })], FooterMeta: [slot("children", ["FooterLocale"], { repeatable: true })], FooterMetaEnd: [slot("children", ["FooterLocale"], { repeatable: true })] } },
    Dialog: { slots: [slot("children", ["DialogTrigger", "DialogContent"], { repeatable: true })], parents: { DialogTrigger: [parent("Dialog")], DialogContent: [parent("Dialog")], DialogHeader: [parent("DialogContent")], DialogTitle: [parent("DialogHeader"), parent("DialogContent")], DialogDescription: [parent("DialogHeader"), parent("DialogContent")], DialogClose: [parent("DialogContent")] }, partSlots: { DialogContent: [slot("children", ["DialogHeader", "DialogTitle", "DialogDescription", "DialogClose"], { repeatable: true })], DialogHeader: [slot("children", ["DialogTitle", "DialogDescription"], { repeatable: true })] } },
    Drawer: { slots: [slot("children", ["DrawerTrigger", "DrawerContent"], { repeatable: true })], parents: { DrawerTrigger: [parent("Drawer")], DrawerContent: [parent("Drawer")], DrawerHeader: [parent("DrawerContent")], DrawerTitle: [parent("DrawerHeader"), parent("DrawerContent")], DrawerDescription: [parent("DrawerHeader"), parent("DrawerContent")], DrawerBody: [parent("DrawerContent")], DrawerFooter: [parent("DrawerContent")] }, partSlots: { DrawerContent: [slot("children", ["DrawerHeader", "DrawerBody", "DrawerFooter"], { repeatable: true })], DrawerHeader: [slot("children", ["DrawerTitle", "DrawerDescription"], { repeatable: true })] } },
    Grid: { slots: [slot("children", ["GridItem"], { repeatable: true })], parents: { GridItem: [parent("Grid")] } },
    Dropdown: { slots: [slot("children", ["DropdownTrigger", "DropdownPortal"], { repeatable: true })], parents: { DropdownTrigger: [parent("Dropdown")], DropdownPortal: [parent("Dropdown")], DropdownContent: [parent("DropdownPortal")], DropdownGroup: [parent("DropdownContent")], DropdownItem: [parent("DropdownContent"), parent("DropdownGroup")], DropdownLabel: [parent("DropdownContent"), parent("DropdownGroup")], DropdownSeparator: [parent("DropdownContent"), parent("DropdownGroup")], DropdownShortcut: [parent("DropdownItem")], DropdownSub: [parent("DropdownContent"), parent("DropdownGroup")], DropdownSubTrigger: [parent("DropdownSub")], DropdownSubContent: [parent("DropdownSub")] }, partSlots: { DropdownPortal: [slot("children", ["DropdownContent"], { max: 1 })], DropdownContent: [slot("children", ["DropdownGroup", "DropdownItem", "DropdownLabel", "DropdownSeparator", "DropdownSub"], { repeatable: true })], DropdownGroup: [slot("children", ["DropdownItem", "DropdownLabel", "DropdownSeparator", "DropdownSub"], { repeatable: true })], DropdownItem: [slot("children", ["DropdownShortcut"], { repeatable: true, allowText: true })], DropdownSub: [slot("children", ["DropdownSubTrigger", "DropdownSubContent"], { repeatable: true })] } },
    Field: { slots: [slot("children", ["FieldLabel", "FieldHint", "FieldError", "FieldRequired"], { repeatable: true, allowText: true })], parents: { FieldLabel: [parent("Field")], FieldHint: [parent("Field")], FieldError: [parent("Field")], FieldRequired: [parent("Field"), parent("FieldLabel")] } },
    Menu: { slots: [slot("children", ["MenuTrigger", "MenuPopover"], { repeatable: true })], parents: { MenuTrigger: [parent("Menu")], MenuPopover: [parent("Menu")], MenuList: [parent("MenuPopover")], MenuLabel: [parent("MenuList")], MenuDivider: [parent("MenuList")], MenuItem: [parent("MenuList")], MenuSub: [parent("MenuList")], MenuSubTrigger: [parent("MenuSub")], MenuSubContent: [parent("MenuSub")] }, partSlots: { MenuPopover: [slot("children", ["MenuList"], { max: 1 })], MenuList: [slot("children", ["MenuLabel", "MenuDivider", "MenuItem", "MenuSub"], { repeatable: true })], MenuSub: [slot("children", ["MenuSubTrigger", "MenuSubContent"], { repeatable: true })] } },
    NavigationMenu: { slots: [slot("children", ["NavigationMenuList", "NavigationMenuIndicator"], { repeatable: true })], parents: { NavigationMenuList: [parent("NavigationMenu")], NavigationMenuItem: [parent("NavigationMenuList")], NavigationMenuTrigger: [parent("NavigationMenuItem")], NavigationMenuContent: [parent("NavigationMenuItem")], NavigationMenuLink: [parent("NavigationMenuItem"), parent("NavigationMenuContent")], NavigationMenuIndicator: [parent("NavigationMenu")] }, partSlots: { NavigationMenuList: [slot("children", ["NavigationMenuItem"], { repeatable: true })], NavigationMenuItem: [slot("children", ["NavigationMenuTrigger", "NavigationMenuContent", "NavigationMenuLink"], { repeatable: true })] } },
    Pagination: { slots: [slot("children", ["PaginationContent"], { max: 1 })], parents: { PaginationContent: [parent("Pagination")], PaginationItem: [parent("PaginationContent")], PaginationPrevious: [parent("PaginationContent")], PaginationNext: [parent("PaginationContent")], PaginationEllipsis: [parent("PaginationContent")], PaginationLink: [parent("PaginationItem")] }, partSlots: { PaginationContent: [slot("children", ["PaginationItem", "PaginationPrevious", "PaginationNext", "PaginationEllipsis"], { repeatable: true })], PaginationItem: [slot("children", ["PaginationLink"], { max: 1 })] } },
    PopOver: { slots: [slot("children", ["PopoverTrigger", "PopoverContent"], { repeatable: true })], parents: { PopoverTrigger: [parent("PopOver")], PopoverContent: [parent("PopOver")] } },
    Carousel: { slots: [slot("children", ["CarouselContent", "CarouselControls", "CarouselIndicators"], { repeatable: true })], parents: { CarouselContent: [parent("Carousel")], CarouselItem: [parent("CarouselContent")], CarouselControls: [parent("Carousel")], CarouselPrevious: [parent("CarouselControls")], CarouselNext: [parent("CarouselControls")], CarouselIndicators: [parent("Carousel")] }, partSlots: { CarouselContent: [slot("children", ["CarouselItem"], { repeatable: true, min: 1 })], CarouselControls: [slot("children", ["CarouselPrevious", "CarouselNext"], { repeatable: true })] } },
    Bubble: { slots: [slot("children", ["BubbleContent", "BubbleReactions"], { repeatable: true })], parents: { BubbleContent: [parent("Bubble")], BubbleReactions: [parent("Bubble")], BubbleGroup: [parent("BubbleGroup")] }, partSlots: { BubbleGroup: [slot("children", ["Bubble", "BubbleGroup"], { repeatable: true, recursive: true })] } },
    Stepper: { slots: [slot("children", ["StepperList"], { max: 1 })], parents: { StepperList: [parent("Stepper")], StepperItem: [parent("StepperList")], StepperIndicator: [parent("StepperItem")], StepperContent: [parent("StepperItem")], StepperTitle: [parent("StepperContent")], StepperDescription: [parent("StepperContent")], StepperSeparator: [parent("StepperList")] }, partSlots: { StepperList: [slot("children", ["StepperItem", "StepperSeparator"], { repeatable: true })], StepperItem: [slot("children", ["StepperIndicator", "StepperContent"], { repeatable: true })], StepperContent: [slot("children", ["StepperTitle", "StepperDescription"], { repeatable: true })] } },
    ResizablePanelGroup: { slots: [slot("children", ["ResizablePanel", "ResizableHandle"], { repeatable: true, min: 2 })], parents: { ResizablePanel: [parent("ResizablePanelGroup")], ResizableHandle: [parent("ResizablePanelGroup")] } },
    ScrollArea: { slots: [slot("children", ["ScrollAreaViewport", "ScrollAreaScrollbar"], { repeatable: true })], parents: { ScrollAreaViewport: [parent("ScrollArea")], ScrollAreaScrollbar: [parent("ScrollArea")], ScrollAreaThumb: [parent("ScrollAreaScrollbar")] }, partSlots: { ScrollAreaScrollbar: [slot("children", ["ScrollAreaThumb"], { max: 1 })] } },
    Sidebar: { slots: [slot("children", ["SidebarHeader", "SidebarContent", "SidebarFooter", "SidebarPeek"], { repeatable: true })], parents: { SidebarHeader: [parent("Sidebar")], SidebarContent: [parent("Sidebar")], SidebarFooter: [parent("Sidebar")], SidebarBrand: [parent("SidebarHeader")], SidebarNav: [parent("SidebarContent")], SidebarGroup: [parent("SidebarContent")], SidebarGroupLabel: [parent("SidebarGroup")], SidebarLink: [parent("SidebarNav"), parent("SidebarGroup")], SidebarTrigger: [parent("Sidebar")], SidebarPeek: [parent("Sidebar")], SidebarPeekEdge: [parent("SidebarPeek")], SidebarPeekInset: [parent("SidebarPeek")], SidebarPeekPanel: [parent("SidebarPeek")], SidebarPeekPin: [parent("SidebarPeek")] }, partSlots: { SidebarHeader: [slot("children", ["SidebarBrand"], { repeatable: true })], SidebarContent: [slot("children", ["SidebarNav", "SidebarGroup"], { repeatable: true })], SidebarNav: [slot("children", ["SidebarLink"], { repeatable: true })], SidebarGroup: [slot("children", ["SidebarGroupLabel", "SidebarLink"], { repeatable: true })], SidebarPeek: [slot("children", ["SidebarPeekEdge", "SidebarPeekInset", "SidebarPeekPanel", "SidebarPeekPin"], { repeatable: true })] } },
    Tree: { slots: [slot("children", ["TreeItem"], { repeatable: true, min: 1 })], parents: { TreeItem: [parent("Tree"), parent("TreeItemContent")], TreeItemTrigger: [parent("TreeItem")], TreeItemContent: [parent("TreeItem")] }, partSlots: { TreeItem: [slot("children", ["TreeItemTrigger", "TreeItemContent"], { repeatable: true })], TreeItemContent: [slot("children", ["TreeItem"], { repeatable: true, recursive: true, min: 1 })] } },
    Chart: { slots: [slot("children", ["ChartBody", "ChartLegend", "ChartTooltip"], { repeatable: true })], parents: { ChartBody: [parent("Chart")], ChartContent: [parent("ChartBody")], ChartPlot: [parent("ChartContent"), parent("ChartBody")], ChartGrid: [parent("ChartPlot")], ChartBars: [parent("ChartPlot")], ChartLine: [parent("ChartPlot")], ChartAxisLabels: [parent("ChartPlot")], ChartYAxisLabels: [parent("ChartPlot")], ChartLegend: [parent("Chart")], ChartLegendItem: [parent("ChartLegend")], ChartTooltip: [parent("Chart")] }, partSlots: { ChartBody: [slot("children", ["ChartContent", "ChartPlot"], { repeatable: true })], ChartContent: [slot("children", ["ChartPlot"], { max: 1 })], ChartPlot: [slot("children", ["ChartGrid", "ChartBars", "ChartLine", "ChartAxisLabels", "ChartYAxisLabels"], { repeatable: true })], ChartLegend: [slot("children", ["ChartLegendItem"], { repeatable: true })] } },
    Collapsible: { slots: [slot("children", ["CollapsibleTrigger", "CollapsibleContent"], { repeatable: true })], parents: { CollapsibleTrigger: [parent("Collapsible")], CollapsibleContent: [parent("Collapsible")] } },
    ContextMenu: { slots: [slot("children", ["ContextMenuTrigger", "ContextMenuPortal"], { repeatable: true })], parents: { ContextMenuTrigger: [parent("ContextMenu")], ContextMenuPortal: [parent("ContextMenu")], ContextMenuContent: [parent("ContextMenuPortal")], ContextMenuItem: [parent("ContextMenuContent"), parent("ContextMenuSubContent")], ContextMenuLabel: [parent("ContextMenuContent"), parent("ContextMenuSubContent")], ContextMenuSeparator: [parent("ContextMenuContent"), parent("ContextMenuSubContent")], ContextMenuSub: [parent("ContextMenuContent"), parent("ContextMenuSubContent")], ContextMenuSubTrigger: [parent("ContextMenuSub")], ContextMenuSubContent: [parent("ContextMenuSub")] }, partSlots: { ContextMenuPortal: [slot("children", ["ContextMenuContent"], { max: 1 })], ContextMenuContent: [slot("children", ["ContextMenuItem", "ContextMenuLabel", "ContextMenuSeparator", "ContextMenuSub"], { repeatable: true })], ContextMenuSub: [slot("children", ["ContextMenuSubTrigger", "ContextMenuSubContent"], { repeatable: true })], ContextMenuSubContent: [slot("children", ["ContextMenuItem", "ContextMenuLabel", "ContextMenuSeparator", "ContextMenuSub"], { repeatable: true })] } },
};

const components = [];
const seen = new Set();
const componentIds = new Set();
for (const group of groups) {
    const roots = group.names.filter((name) => officialRoots.has(name) || rootAliases.has(name));
    // A component module's first runtime export is its declared root when it is
    // not represented in the legacy behavior catalog (for example Collapsible).
    const canonicalRoot = roots[0] ?? group.names[0];
    for (const exportName of group.names) {
        if (seen.has(exportName)) continue;
        seen.add(exportName);
        const official = officialRoots.get(exportName) ?? rootAliases.get(exportName);
        const isRoot = Boolean(official) || exportName === canonicalRoot;
        const id = official?.id ?? kebab(exportName);
        const component = {
            id,
            exportPath: "@refineui/react",
            exportName,
            kind: providerParts.has(exportName) ? "provider" : isRoot ? "root" : "part",
            category: official ? "components" : isRoot ? "utilities" : "parts",
            label: title(exportName),
            props: rootProps[exportName] ?? [],
            preview: { mode: "full" },
        };
        // Existing behavior specs remain authoritative for visual variants. The
        // generated control is deliberately data-only and never parses TS types.
        if (official?.spec) {
            const behaviorSpec = readJson(join(root, "spec", official.spec.replace(/^\.\//, "")));
            for (const [name, options] of Object.entries(behaviorSpec.variants ?? {})) {
                if (!component.props.some((prop) => prop.name === name)) {
                    component.props.push({
                        name,
                        label: title(name),
                        valueType: "enum",
                        control: options.length <= 3 ? "segmented" : "select",
                        options,
                        defaultValue: options[0],
                        section: "variants",
                    });
                }
            }
        }
        if (componentIds.has(component.id)) component.id = `${kebab(exportName)}-part`;
        componentIds.add(component.id);
        if (portalContracts[exportName]) component.portal = portalContracts[exportName];
        if (!isRoot && canonicalRoot) component.parents = [{ component: canonicalRoot, slot: "children" }];
        if (isRoot) {
            const childParts = group.names.filter((name) => name !== exportName && !roots.includes(name));
            component.slots = [{ name: "children", accepts: childParts, repeatable: true, allowText: !noText.has(exportName), allowAnyComponent: childParts.length === 0, defaultChildren: [] }];
            const preset = corePresets[exportName] ?? {
                id: "default",
                label: "Default",
                root: {
                    component: exportName,
                    props: presetProps[exportName],
                    // Only leaf roots may use the neutral text default. Structural
                    // roots must start empty until their composition preset is set.
                    slots: !noText.has(exportName) && component.slots?.some((slot) => slot.name === "children" && (slot.allowAnyComponent || slot.accepts.includes("Text")))
                        ? { children: [{ component: "Text", props: presetProps.Text, text: title(exportName) }] }
                        : {},
                },
            };
            component.presets = [preset];
            if (stateBindings[exportName]) component.stateBindings = stateBindings[exportName];
            component.events = [
                { name: "click", payload: "void" },
                ...(stateBindings[exportName] ?? []).map((binding) => ({ name: binding.changeEvent, payload: binding.valueType === "string-array" ? "string-array" : binding.valueType === "number" ? "number" : binding.valueType === "boolean" ? "boolean" : binding.valueType === "string" ? "string" : "object" })),
            ];
        }
        components.push(component);
    }
}

// Explicitly document recursive composition rather than relying on TreeItem's name.
for (const component of components) {
    if (component.exportName === "TreeItem") {
        component.slots = [{ name: "children", accepts: ["TreeItemTrigger", "TreeItemContent"], required: true, repeatable: true }];
        component.parents = [{ component: "Tree", slot: "children" }, { component: "TreeItemContent", slot: "children" }];
    }
    if (component.exportName === "TreeItemContent") component.slots = [{ name: "children", accepts: ["TreeItem"], repeatable: true, recursive: true, min: 1 }];
    if (component.exportName === "BubbleReactions") component.props = [
        { name: "side", label: "Side", valueType: "enum", control: "segmented", options: ["top", "bottom"], defaultValue: "bottom", section: "variants" },
        { name: "align", label: "Align", valueType: "enum", control: "segmented", options: ["start", "end"], defaultValue: "end", section: "variants" },
    ];
}

for (const component of components) {
    for (const prop of serializablePartProps[component.exportName] ?? []) {
        if (component.props.some((existing) => existing.name === prop.name)) continue;
        component.props.push({ ...prop, label: title(prop.name) });
    }
    for (const required of requiredProps[component.exportName] ?? []) {
        if (component.props.some((prop) => prop.name === required.name)) continue;
        component.props.push({
            name: required.name,
            label: title(required.name),
            valueType: required.valueType,
            control: required.control,
            defaultValue: required.defaultValue,
            required: true,
            section: "properties",
        });
    }
}

for (const [rootName, definition] of Object.entries(composition)) {
    const rootComponent = components.find((component) => component.exportName === rootName);
    if (!rootComponent) throw new Error(`Authoring definition references missing root ${rootName}`);
    rootComponent.slots = definition.slots;
    for (const [partName, constraints] of Object.entries(definition.parents ?? {})) {
        const part = components.find((component) => component.exportName === partName);
        if (!part) throw new Error(`Authoring definition references missing part ${partName}`);
        part.parents = constraints;
    }
    for (const [partName, slots] of Object.entries(definition.partSlots ?? {})) {
        const part = components.find((component) => component.exportName === partName);
        if (!part) throw new Error(`Authoring definition references missing part ${partName}`);
        part.slots = slots;
    }
}

// Append ReactNode prop slots after composition has established ordinary
// child slots, so components can expose both at once.
for (const component of components) {
    const definitions = propSlots[component.exportName] ?? [];
    if (!definitions.length) continue;
    component.slots = [
        ...(component.slots ?? []),
        ...definitions.map((definition) => propSlot(definition.name, definition.prop, definition.accepts, {
            allowText: definition.allowText,
        })),
    ];
    const icons = definitions.filter((definition) => definition.accepts.includes("WebIcon"));
    if (icons.length) {
        component.iconSlots = icons.map((definition) => ({
            name: definition.name,
            optional: true,
            accepts: ["refineui-icon", "svg", "image"],
        }));
    }
}

const componentFor = (name) => components.find((component) => component.exportName === name);
const slotsFor = (name, slots) => { componentFor(name).slots = slots; };
const parentsFor = (name, parents) => { componentFor(name).parents = parents; };

// Cross-family roots and compatibility exports have no one-to-one module root;
// make their authoring role explicit rather than leaving a generic fallback.
slotsFor("Alert", [slot("children", ["AlertRow", "AlertContent", "AlertActions", "AlertClose"], { repeatable: true })]);
slotsFor("BreadcrumbEllipsis", [slot("children", ["BreadcrumbEllipsisTrigger"], { max: 1 })]);
parentsFor("DrawerTitle", [parent("DrawerHeader")]);
parentsFor("DrawerDescription", [parent("DrawerHeader")]);
slotsFor("FieldLabel", [slot("children", ["FieldRequired"], { repeatable: true, allowText: true })]);
slotsFor("FooterNav", [slot("children", ["FooterLink"], { repeatable: true })]);
slotsFor("NavigationMenuContent", [slot("children", ["NavigationMenuLink"], { repeatable: true })]);
slotsFor("Sidebar", [slot("children", ["SidebarHeader", "SidebarContent", "SidebarFooter", "SidebarPeek", "SidebarTrigger"], { repeatable: true })]);

const commandDialog = componentFor("CommandDialog");
commandDialog.kind = "root";
commandDialog.category = "components";
commandDialog.parents = undefined;
commandDialog.slots = [slot("children", ["Command"], { max: 1 })];
commandDialog.presets = [{ id: "default", label: "Command dialog", root: { component: "CommandDialog", slots: { children: [{ component: "Command" }] } } }];

const avatarGroup = componentFor("AvatarGroup");
avatarGroup.kind = "root";
avatarGroup.category = "components";
avatarGroup.parents = undefined;
avatarGroup.slots = [slot("children", ["Avatar", "AvatarGroupCount"], { repeatable: true })];
avatarGroup.presets = [{ id: "group", label: "Avatar group", root: { component: "AvatarGroup", slots: { children: [{ component: "Avatar", slots: { children: [{ component: "AvatarText", text: "A" }] } }, { component: "Avatar", slots: { children: [{ component: "AvatarText", text: "B" }] } }] } } }];
parentsFor("AvatarGroupCount", [parent("AvatarGroup")]);

const popoverAlias = componentFor("Popover");
popoverAlias.kind = "root";
popoverAlias.category = "components";
popoverAlias.parents = undefined;
popoverAlias.slots = [slot("children", ["PopoverTrigger", "PopoverContent"], { repeatable: true })];
popoverAlias.presets = [{ id: "default", label: "Popover", root: { component: "Popover", slots: { children: [{ component: "PopoverTrigger", text: "Open" }, { component: "PopoverContent", text: "Content" }] } } }];

const sidebarProvider = componentFor("SidebarProvider");
sidebarProvider.kind = "root";
sidebarProvider.category = "components";
sidebarProvider.parents = undefined;
sidebarProvider.slots = [slot("children", ["Sidebar", "SidebarTrigger"], { repeatable: true })];
sidebarProvider.presets = [{ id: "layout", label: "Sidebar layout", root: { component: "SidebarProvider", slots: { children: [{ component: "Sidebar" }] } } }];

// BubbleGroup is intentionally insertable as a conversation container while
// Bubble remains available as an item in its explicit recursive collection.
const bubbleGroup = components.find((component) => component.exportName === "BubbleGroup");
if (bubbleGroup) {
    bubbleGroup.kind = "root";
    bubbleGroup.category = "components";
    bubbleGroup.parents = undefined;
    bubbleGroup.presets = [{ id: "conversation", label: "Conversation", root: { component: "BubbleGroup", slots: { children: [corePresets.Bubble.root] } } }];
}

const manifest = {
    schema: "refineui.authoring/1",
    packageName: "@refineui/react",
    packageVersion: packageJson.version,
    css: ["@refineui/react/refineui.css"],
    components,
};
const destination = join(root, "spec/authoring");
rmSync(join(destination, "components"), { recursive: true, force: true });
mkdirSync(join(destination, "components"), { recursive: true });
writeFileSync(join(destination, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
for (const component of components) writeFileSync(join(destination, "components", `${component.id}.json`), `${JSON.stringify(component, null, 2)}\n`);
console.log(`Generated authoring manifest: ${components.length} public components (${components.filter((component) => component.kind === "root").length} roots)`);
