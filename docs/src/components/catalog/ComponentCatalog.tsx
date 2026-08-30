import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Alert,
    AlertBody,
    AlertDescription,
    AlertIcon,
    AlertRow,
    AlertTitle,
    Avatar,
    AvatarGroup,
    AvatarIcon,
    AvatarImage,
    AvatarText,
    Badge,
    Box,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Bubble,
    BubbleContent,
    Button,
    Calendar,
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
    Carousel,
    CarouselContent,
    CarouselControls,
    CarouselIndicators,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    Chart,
    ChartBars,
    ChartBody,
    ChartContent,
    ChartGrid,
    ChartPlot,
    Checkbox,
    Command,
    CommandGroup,
    CommandGroupHeading,
    CommandInput,
    CommandItem,
    CommandList,
    Container,
    Dialog,
    DialogTrigger,
    Divider,
    Drawer,
    DrawerTrigger,
    Field,
    FieldHint,
    FieldLabel,
    Footer,
    FooterCopyright,
    FooterMeta,
    Grid,
    Input,
    InputOTP,
    InputOTPSlot,
    Label,
    Link,
    MenuDivider,
    MenuItem,
    MenuList,
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Progress,
    ProgressStepper,
    ProgressStepperItem,
    ProgressStepperLabel,
    ProgressStepperList,
    ProgressStepperMarker,
    Radio,
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
    ScrollArea,
    ScrollAreaScrollbar,
    ScrollAreaThumb,
    ScrollAreaViewport,
    SearchField,
    SearchFieldIcon,
    SearchFieldInput,
    SegmentedControl,
    SegmentedControlItem,
    Select,
    SelectTrigger,
    SelectValue,
    Sidebar,
    SidebarBrand,
    SidebarContent,
    SidebarHeader,
    SidebarLink,
    SidebarNav,
    Skeleton,
    Slider,
    SpinButton,
    Spinner,
    Stack,
    Stepper,
    StepperIndicator,
    StepperItem,
    StepperList,
    StepperSeparator,
    StepperTitle,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tabs,
    TabsList,
    TabsTrigger,
    Tag,
    Text,
    Textarea,
    Toast,
    Tree,
    TreeItem,
    TreeItemContent,
    TreeItemTrigger,
    Tooltip,
} from "@refineui/react";
import { DemoBlock } from "../layout/DemoBlock";
import { CatalogDropdownPreview, CatalogPopoverPreview } from "./catalogOverlayPreviews";
import { CatalogCard, CatalogGrid } from "./CatalogCard";
import { chartValues, noopDate, noopNumber, noopString, portraitSrc } from "./catalogConstants";

const scrollAreaItems = [
    "Accordion",
    "Alert",
    "Avatar",
    "Badge",
    "Button",
    "Calendar",
    "Card",
    "Carousel",
    "Chart",
    "Checkbox",
    "Command",
    "Dialog",
    "Divider",
    "Drawer",
    "Dropdown",
    "Field",
    "Footer",
    "Grid",
    "Input",
    "Link",
    "Menu",
    "Pagination",
    "Popover",
    "Progress",
    "Radio",
    "Select",
    "Sidebar",
    "Slider",
    "Stepper",
    "Switch",
    "Table",
    "Tabs",
    "Tag",
    "Toast",
    "Tooltip",
    "Tree",
] as const;

export default function ComponentCatalog() {
    return (
        <CatalogGrid data-refineui-catalog-overview>
            <CatalogCard
                href="/components/accordion/"
                name="Accordion"
                preview={
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="one">
                            <AccordionTrigger>Shipping</AccordionTrigger>
                            <AccordionContent>Standard and express.</AccordionContent>
                        </AccordionItem>
                    </Accordion>
                }
            />
            <CatalogCard
                href="/components/alert/"
                name="Alert"
                preview={
                    <Alert variant="info" className="w-full">
                        <AlertRow>
                            <AlertIcon />
                            <AlertBody>
                                <AlertTitle>Update available</AlertTitle>
                                <AlertDescription>Get the latest components.</AlertDescription>
                            </AlertBody>
                        </AlertRow>
                    </Alert>
                }
            />
            <CatalogCard
                href="/components/avatar/"
                name="Avatar"
                preview={
                    <Avatar size="lg">
                        <AvatarImage src={portraitSrc} alt="User" />
                    </Avatar>
                }
            />
            <CatalogCard
                href="/components/avatars/"
                name="Avatars"
                preview={
                    <AvatarGroup size="lg" layout="stack">
                        <Avatar size="lg">
                            <AvatarText>PL</AvatarText>
                        </Avatar>
                        <Avatar size="lg" color="neutral">
                            <AvatarIcon name="person" />
                        </Avatar>
                        <Avatar size="lg" color="orange">
                            <AvatarText>RU</AvatarText>
                        </Avatar>
                    </AvatarGroup>
                }
            />
            <CatalogCard
                href="/components/badge/"
                name="Badge"
                preview={
                    <Stack direction="row" gap="sizeSmall" align="center">
                        <Badge>Default</Badge>
                        <Badge variant="success">Success</Badge>
                        <Badge layout="number" variant="danger">
                            3
                        </Badge>
                    </Stack>
                }
            />
            <CatalogCard
                href="/components/box/"
                name="Box"
                preview={
                    <Box
                        padding="sizeMedium"
                        background="backgroundPrimary"
                        radius="roundedLarge"
                        border="strokeWidthThin"
                        borderColor="borderDefault"
                        className="w-refineui-foundation-size-3250 max-w-full"
                    >
                        <DemoBlock tone={0}>Inset content</DemoBlock>
                    </Box>
                }
            />
            <CatalogCard
                href="/components/breadcrumb/"
                name="Breadcrumb"
                preview={
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">Home</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="#">Docs</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Button</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                }
            />
            <CatalogCard
                href="/components/bubble/"
                name="Bubble"
                preview={
                    <Bubble variant="muted" align="start">
                        <BubbleContent>Want to see chat bubbles?</BubbleContent>
                    </Bubble>
                }
            />
            <CatalogCard
                href="/components/button/"
                name="Button"
                preview={
                    <Stack direction="row" gap="sizeSmall" align="center">
                        <Button type="button" variant="primary">
                            Primary
                        </Button>
                        <Button type="button" variant="secondary">
                            Secondary
                        </Button>
                    </Stack>
                }
            />
            <CatalogCard
                href="/components/calendar/"
                name="Calendar"
                fill
                preview={
                    <div data-refineui-catalog-frame data-refineui-catalog-calendar>
                        <Calendar value={new Date(2026, 7, 15)} onChange={noopDate} />
                    </div>
                }
            />
            <CatalogCard
                href="/components/card/"
                name="Card"
                preview={
                    <div data-refineui-catalog-card-specimen>
                        <Card variant="outlined">
                            <CardHeader>
                                <CardTitle>Project</CardTitle>
                                <CardDescription>Surface for grouped content.</CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                }
            />
            <CatalogCard
                href="/components/carousel/"
                name="Carousel"
                fill
                preview={
                    <div data-refineui-catalog-frame data-refineui-catalog-carousel>
                        <Carousel className="h-full min-h-0 w-full">
                            <CarouselContent>
                                <CarouselItem>
                                    <Box
                                        padding="sizeMedium"
                                        background="backgroundBrand"
                                        className="flex h-full min-h-0 w-full flex-col justify-end"
                                    >
                                        <Text as="strong" variant="titleSm" className="text-refineui-alias-foreground-on-brand">
                                            Overview
                                        </Text>
                                    </Box>
                                </CarouselItem>
                                <CarouselItem>
                                    <Box
                                        padding="sizeMedium"
                                        background="backgroundBrand"
                                        className="flex h-full min-h-0 w-full flex-col justify-end"
                                    >
                                        <Text as="strong" variant="titleSm" className="text-refineui-alias-foreground-on-brand">
                                            Motion
                                        </Text>
                                    </Box>
                                </CarouselItem>
                            </CarouselContent>
                            <CarouselControls>
                                <CarouselPrevious type="button" />
                                <CarouselIndicators />
                                <CarouselNext type="button" />
                            </CarouselControls>
                        </Carousel>
                    </div>
                }
            />
            <CatalogCard
                href="/components/chart/"
                name="Chart"
                fill
                preview={
                    <div data-refineui-catalog-frame className="w-full">
                        <Chart className="h-full min-h-0 w-full">
                        <ChartBody>
                            <ChartContent>
                                <ChartPlot aria-label="Revenue">
                                    <ChartGrid lines={4} values={chartValues} />
                                    <ChartBars values={chartValues} seriesColor="brand" />
                                </ChartPlot>
                            </ChartContent>
                        </ChartBody>
                    </Chart>
                    </div>
                }
            />
            <CatalogCard
                href="/components/checkbox/"
                name="Checkbox"
                preview={
                    <Stack gap="sizeSmall">
                        <Checkbox defaultChecked label="Selected" />
                        <Checkbox label="Available" />
                    </Stack>
                }
            />
            <CatalogCard
                href="/components/command/"
                name="Command"
                preview={
                    <div data-refineui-catalog-command className="w-refineui-foundation-size-3250 max-w-full">
                        <Command className="w-full">
                            <CommandInput placeholder="Search commands…" />
                            <CommandList>
                                <CommandGroup>
                                    <CommandGroupHeading>Suggestions</CommandGroupHeading>
                                    <CommandItem value="calendar">Calendar</CommandItem>
                                    <CommandItem value="search">Search</CommandItem>
                                    <CommandItem value="settings">Settings</CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </div>
                }
            />
            <CatalogCard
                href="/components/container/"
                name="Container"
                preview={
                    <div data-refineui-catalog-layout>
                        <Box background="backgroundSurfaceHover" radius="roundedLarge" className="w-full">
                            <Container padding="sizeMedium">
                                <Stack gap="sizeSmall">
                                    <DemoBlock tone={0}>Full width</DemoBlock>
                                    <DemoBlock tone={1}>Centered column</DemoBlock>
                                </Stack>
                            </Container>
                        </Box>
                    </div>
                }
            />
            <CatalogCard
                href="/components/dialog/"
                name="Dialog"
                preview={
                    <Dialog>
                        <DialogTrigger type="button">Open dialog</DialogTrigger>
                    </Dialog>
                }
            />
            <CatalogCard
                href="/components/divider/"
                name="Divider"
                preview={
                    <Stack gap="sizeSmall" className="w-full">
                        <Text variant="bodySm">Content</Text>
                        <Divider />
                        <Text variant="bodySm">Content</Text>
                    </Stack>
                }
            />
            <CatalogCard
                href="/components/drawer/"
                name="Drawer"
                preview={
                    <Drawer>
                        <DrawerTrigger type="button">Open drawer</DrawerTrigger>
                    </Drawer>
                }
            />
            <CatalogCard
                href="/components/dropdown/"
                name="Dropdown"
                preview={<CatalogDropdownPreview />}
            />
            <CatalogCard
                href="/components/field/"
                name="Field"
                preview={
                    <Field className="w-full">
                        <FieldLabel>Email</FieldLabel>
                        <Input type="email" placeholder="email@example.com" fullWidth />
                        <FieldHint>We’ll never share this.</FieldHint>
                    </Field>
                }
            />
            <CatalogCard
                href="/components/footer/"
                name="Footer"
                preview={
                    <Footer>
                        <FooterMeta>
                            <FooterCopyright>© RefineUI</FooterCopyright>
                        </FooterMeta>
                    </Footer>
                }
            />
            <CatalogCard
                href="/components/grid/"
                name="Grid"
                preview={
                    <div data-refineui-catalog-layout>
                        <Grid columns={3} gap="sizeSmall" className="w-full">
                            <DemoBlock tone={0}>1</DemoBlock>
                            <DemoBlock tone={1}>2</DemoBlock>
                            <DemoBlock tone={2}>3</DemoBlock>
                            <DemoBlock tone={3}>4</DemoBlock>
                            <DemoBlock tone={0}>5</DemoBlock>
                            <DemoBlock tone={1}>6</DemoBlock>
                        </Grid>
                    </div>
                }
            />
            <CatalogCard
                href="/components/input/"
                name="Input"
                preview={<Input placeholder="Enter text" fullWidth />}
            />
            <CatalogCard
                href="/components/input-otp/"
                name="Input OTP"
                preview={
                    <InputOTP maxLength={6} value="847291" onValueChange={noopString} disabled aria-label="Code">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTP>
                }
            />
            <CatalogCard
                href="/components/label/"
                name="Label"
                preview={
                    <Stack gap="sizeXXSmall" className="w-full">
                        <Label htmlFor="catalog-label">Email</Label>
                        <Input id="catalog-label" placeholder="name@studio.com" fullWidth />
                    </Stack>
                }
            />
            <CatalogCard href="/components/link/" name="Link" preview={<Link href="#">Open docs</Link>} />
            <CatalogCard
                href="/components/menu/"
                name="Menu"
                preview={
                    <div data-refineui-catalog-overlay data-refineui-catalog-overlay-centered className="w-full">
                        <Stack gap="sizeSmall" className="w-refineui-foundation-size-3250 max-w-full items-center">
                            <Button type="button" variant="secondary" size="sm">
                                Open menu
                            </Button>
                            <MenuList className="w-full">
                                <MenuItem>New</MenuItem>
                                <MenuItem state="active">Open…</MenuItem>
                                <MenuDivider />
                                <MenuItem>Copy</MenuItem>
                            </MenuList>
                        </Stack>
                    </div>
                }
            />
            <CatalogCard
                href="/components/navigation-menu/"
                name="Navigation Menu"
                preview={
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem value="products">
                                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                            </NavigationMenuItem>
                            <NavigationMenuItem value="docs">
                                <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                }
            />
            <CatalogCard
                href="/components/pagination/"
                name="Pagination"
                preview={
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious type="button" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive>
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext type="button" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                }
            />
            <CatalogCard href="/components/popover/" name="PopOver" preview={<CatalogPopoverPreview />} />
            <CatalogCard href="/components/progress/" name="Progress" preview={<Progress value={60} className="w-full" />} />
            <CatalogCard
                href="/components/progress-stepper/"
                name="ProgressStepper"
                preview={
                    <ProgressStepper defaultValue={1} className="w-full">
                        <ProgressStepperList>
                            <ProgressStepperItem value={0}>
                                <ProgressStepperMarker />
                                <ProgressStepperLabel>Cart</ProgressStepperLabel>
                            </ProgressStepperItem>
                            <ProgressStepperItem value={1}>
                                <ProgressStepperMarker />
                                <ProgressStepperLabel>Ship</ProgressStepperLabel>
                            </ProgressStepperItem>
                            <ProgressStepperItem value={2}>
                                <ProgressStepperMarker />
                                <ProgressStepperLabel>Pay</ProgressStepperLabel>
                            </ProgressStepperItem>
                        </ProgressStepperList>
                    </ProgressStepper>
                }
            />
            <CatalogCard
                href="/components/radio/"
                name="Radio"
                preview={
                    <Stack gap="sizeSmall">
                        <Radio name="catalog-radio" value="a" defaultChecked label="Option A" />
                        <Radio name="catalog-radio" value="b" label="Option B" />
                    </Stack>
                }
            />
            <CatalogCard
                href="/components/resizable/"
                name="Resizable"
                fill
                preview={
                    <div data-refineui-catalog-frame>
                        <ResizablePanelGroup
                            orientation="horizontal"
                            className="h-full min-h-0 w-full overflow-hidden rounded-refineui-large border-refineui-thin border-refineui-alias-border-default"
                        >
                        <ResizablePanel defaultSize={40}>
                            <DemoBlock tone={0} className="h-full">
                                A
                            </DemoBlock>
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={60}>
                            <DemoBlock tone={1} className="h-full">
                                B
                            </DemoBlock>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                    </div>
                }
            />
            <CatalogCard
                href="/components/scroll-area/"
                name="Scroll Area"
                fill
                preview={
                    <div data-refineui-catalog-frame data-refineui-catalog-scroll-area>
                        <ScrollArea type="always" className="h-full min-h-0 w-full">
                            <ScrollAreaViewport>
                                <Stack as="ul" className="m-0 list-none p-0">
                                    {scrollAreaItems.map((name) => (
                                        <Box
                                            key={name}
                                            as="li"
                                            paddingX="sizeMedium"
                                            paddingY="sizeSmall"
                                            className="border-b-refineui-thin border-refineui-alias-border-default"
                                        >
                                            <Text variant="bodySm">{name}</Text>
                                        </Box>
                                    ))}
                                </Stack>
                            </ScrollAreaViewport>
                            <ScrollAreaScrollbar orientation="vertical">
                                <ScrollAreaThumb />
                            </ScrollAreaScrollbar>
                        </ScrollArea>
                    </div>
                }
            />
            <CatalogCard
                href="/components/search-field/"
                name="Search Field"
                preview={
                    <SearchField value="RefineUI" onValueChange={noopString} className="w-full">
                        <SearchFieldIcon />
                        <SearchFieldInput placeholder="Search" />
                    </SearchField>
                }
            />
            <CatalogCard
                href="/components/segmented-control/"
                name="Segmented Control"
                preview={
                    <SegmentedControl defaultValue="overview" aria-label="View">
                        <SegmentedControlItem value="overview">Overview</SegmentedControlItem>
                        <SegmentedControlItem value="analytics">Analytics</SegmentedControlItem>
                    </SegmentedControl>
                }
            />
            <CatalogCard
                href="/components/select/"
                name="Select"
                preview={
                    <Select aria-label="Region" fullWidth>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                    </Select>
                }
            />
            <CatalogCard
                href="/components/sidebar/"
                name="Sidebar"
                fill
                preview={
                    <div
                        data-refineui-catalog-frame
                        data-refineui-catalog-sidebar
                        className="overflow-hidden rounded-refineui-large border-refineui-thin border-refineui-alias-border-default"
                    >
                        <Sidebar className="h-full min-h-0">
                            <SidebarHeader>
                                <SidebarBrand>RefineUI</SidebarBrand>
                            </SidebarHeader>
                            <SidebarContent>
                                <SidebarNav>
                                    <SidebarLink href="#overview" active>
                                        Overview
                                    </SidebarLink>
                                    <SidebarLink href="#components">Components</SidebarLink>
                                    <SidebarLink href="#tokens">Tokens</SidebarLink>
                                </SidebarNav>
                            </SidebarContent>
                        </Sidebar>
                    </div>
                }
            />
            <CatalogCard
                href="/components/skeleton/"
                name="Skeleton"
                preview={
                    <Stack direction="row" gap="sizeSmall" align="center" className="w-full">
                        <Skeleton
                            shape="circle"
                            width="var(--refineui-size-foundation-size-400)"
                            height="var(--refineui-size-foundation-size-400)"
                        />
                        <Stack gap="sizeXXSmall" className="min-w-0 flex-1">
                            <Skeleton height="var(--refineui-size-foundation-size-160)" />
                            <Skeleton
                                width="80%"
                                height="var(--refineui-size-foundation-size-120)"
                            />
                        </Stack>
                    </Stack>
                }
            />
            <CatalogCard
                href="/components/slider/"
                name="Slider"
                preview={<Slider value={60} onChange={noopNumber} className="w-full" />}
            />
            <CatalogCard
                href="/components/spin-button/"
                name="Spin Button"
                preview={<SpinButton value={5} onChange={noopNumber} min={0} max={10} />}
            />
            <CatalogCard href="/components/spinner/" name="Spinner" preview={<Spinner size="lg" />} />
            <CatalogCard
                href="/components/stack/"
                name="Stack"
                preview={
                    <div data-refineui-catalog-layout className="w-refineui-foundation-size-3250 max-w-full">
                        <Stack gap="sizeSmall" className="w-full">
                            <DemoBlock tone={0}>One</DemoBlock>
                            <DemoBlock tone={1}>Two</DemoBlock>
                            <DemoBlock tone={2}>Three</DemoBlock>
                        </Stack>
                    </div>
                }
            />
            <CatalogCard
                href="/components/stepper/"
                name="Stepper"
                preview={
                    <Stepper defaultValue={1} className="w-full">
                        <StepperList>
                            <StepperItem value={0}>
                                <StepperIndicator>1</StepperIndicator>
                                <StepperTitle>Account</StepperTitle>
                            </StepperItem>
                            <StepperSeparator />
                            <StepperItem value={1}>
                                <StepperIndicator>2</StepperIndicator>
                                <StepperTitle>Plan</StepperTitle>
                            </StepperItem>
                            <StepperSeparator />
                            <StepperItem value={2}>
                                <StepperIndicator>3</StepperIndicator>
                                <StepperTitle>Pay</StepperTitle>
                            </StepperItem>
                        </StepperList>
                    </Stepper>
                }
            />
            <CatalogCard
                href="/components/switch/"
                name="Switch"
                preview={
                    <Stack direction="row" gap="sizeSmall" align="center">
                        <Switch checked aria-label="Notifications" />
                        <Text variant="bodySm">On</Text>
                    </Stack>
                }
            />
            <CatalogCard
                href="/components/table/"
                name="Table"
                preview={
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice</TableHead>
                                <TableHead>Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>INV-001</TableCell>
                                <TableCell>$1,250</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>INV-002</TableCell>
                                <TableCell>$890</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                }
            />
            <CatalogCard
                href="/components/tabs/"
                name="Tabs"
                preview={
                    <Tabs defaultValue="overview" className="w-full">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="reports">Reports</TabsTrigger>
                        </TabsList>
                    </Tabs>
                }
            />
            <CatalogCard
                href="/components/tag/"
                name="Tag"
                preview={
                    <Stack direction="row" gap="sizeSmall">
                        <Tag>Default</Tag>
                        <Tag variant="outline">Outline</Tag>
                    </Stack>
                }
            />
            <CatalogCard
                href="/components/textarea/"
                name="Textarea"
                preview={<Textarea placeholder="Write a note" fullWidth rows={3} />}
            />
            <CatalogCard
                href="/components/toast/"
                name="Toast"
                preview={
                    <div data-refineui-catalog-toast>
                        <Toast variant="success" message="Done" />
                    </div>
                }
            />
            <CatalogCard
                href="/components/tooltip/"
                name="Tooltip"
                preview={
                    <div data-refineui-catalog-tooltip>
                        <Tooltip
                            defaultOpen
                            delayMs={0}
                            align="Center"
                            trigger={
                                <Button type="button" variant="secondary">
                                    Label
                                </Button>
                            }
                            content="Tooltip"
                        />
                    </div>
                }
            />
            <CatalogCard
                href="/components/tree/"
                name="Tree"
                preview={
                    <Tree className="w-full" defaultExpanded={["app"]} defaultSelected="page">
                        <TreeItem value="app">
                            <TreeItemTrigger>app</TreeItemTrigger>
                            <TreeItemContent>
                                <TreeItem value="page">
                                    <TreeItemTrigger>page.tsx</TreeItemTrigger>
                                </TreeItem>
                            </TreeItemContent>
                        </TreeItem>
                    </Tree>
                }
            />
        </CatalogGrid>
    );
}
