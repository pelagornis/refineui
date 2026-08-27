import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Alert,
    AlertAction,
    AlertActions,
    AlertBody,
    AlertClose,
    AlertDescription,
    AlertIcon,
    AlertRow,
    AlertTitle,
    Avatar,
    AvatarGroup,
    AvatarIcon,
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
    Dialog,
    DialogTrigger,
    Divider,
    Drawer,
    DrawerTrigger,
    Dropdown,
    DropdownTrigger,
    Field,
    FieldHint,
    FieldLabel,
    Footer,
    FooterCopyright,
    FooterMeta,
    Input,
    InputOTP,
    InputOTPSlot,
    Label,
    Link,
    Menu,
    MenuItem,
    MenuList,
    MenuPopover,
    MenuTrigger,
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
    Popover,
    PopoverTrigger,
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
    Tooltip,
} from "@refineui/react";
import { CatalogCard, CatalogGrid } from "./CatalogCard";

const noopNumber = (_value: number) => undefined;
const noopString = (_value: string) => undefined;
const noopDate = (_date: Date) => undefined;
const chartValues = [186, 305, 237, 273, 209, 214];

export default function ComponentCatalog() {
    return (
        <CatalogGrid>
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
                                <AlertTitle>New version available</AlertTitle>
                                <AlertDescription>Update to get the latest components.</AlertDescription>
                            </AlertBody>
                            <AlertClose type="button" />
                        </AlertRow>
                        <AlertActions>
                            <AlertAction type="button">Update</AlertAction>
                        </AlertActions>
                    </Alert>
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
                preview={
                    <div data-refineui-catalog-calendar>
                        <Calendar value={new Date(2026, 7, 15)} onChange={noopDate} />
                    </div>
                }
            />
            <CatalogCard
                href="/components/card/"
                name="Card"
                preview={
                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Project</CardTitle>
                            <CardDescription>Surface for grouped content.</CardDescription>
                        </CardHeader>
                    </Card>
                }
            />
            <CatalogCard
                href="/components/carousel/"
                name="Carousel"
                preview={
                    <Carousel className="w-full">
                        <CarouselContent>
                            <CarouselItem>
                                <Box
                                    padding="sizeLarge"
                                    background="backgroundBrand"
                                    className="flex min-h-refineui-foundation-size-2000 flex-col justify-end"
                                >
                                    <Text as="strong" variant="titleSm" className="text-refineui-alias-foreground-on-brand">
                                        Overview
                                    </Text>
                                </Box>
                            </CarouselItem>
                            <CarouselItem>
                                <Box
                                    padding="sizeLarge"
                                    background="backgroundBrand"
                                    className="flex min-h-refineui-foundation-size-2000 flex-col justify-end"
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
                }
            />
            <CatalogCard
                href="/components/chart/"
                name="Chart"
                preview={
                    <Chart className="h-refineui-foundation-size-2000 w-full">
                        <ChartBody>
                            <ChartContent>
                                <ChartPlot aria-label="Revenue">
                                    <ChartGrid lines={4} values={chartValues} />
                                    <ChartBars values={chartValues} seriesColor="brand" />
                                </ChartPlot>
                            </ChartContent>
                        </ChartBody>
                    </Chart>
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
                    <Command className="w-full">
                        <CommandInput placeholder="Search commands…" />
                        <CommandList>
                            <CommandGroup>
                                <CommandGroupHeading>Suggestions</CommandGroupHeading>
                                <CommandItem value="calendar">Calendar</CommandItem>
                                <CommandItem value="search">Search</CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
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
                preview={
                    <Dropdown>
                        <DropdownTrigger>
                            <Button type="button" variant="secondary">
                                Account
                            </Button>
                        </DropdownTrigger>
                    </Dropdown>
                }
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
                    <Menu>
                        <MenuTrigger>
                            <Button type="button" variant="secondary">
                                Open menu
                            </Button>
                        </MenuTrigger>
                        <MenuPopover>
                            <MenuList>
                                <MenuItem>New</MenuItem>
                                <MenuItem>Open…</MenuItem>
                            </MenuList>
                        </MenuPopover>
                    </Menu>
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
            <CatalogCard
                href="/components/popover/"
                name="PopOver"
                preview={
                    <Popover>
                        <PopoverTrigger>
                            <Button type="button" variant="secondary">
                                Dimensions
                            </Button>
                        </PopoverTrigger>
                    </Popover>
                }
            />
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
                preview={
                    <ResizablePanelGroup
                        orientation="horizontal"
                        className="h-refineui-foundation-size-2000 w-full overflow-hidden rounded-refineui-large border-refineui-thin border-refineui-alias-border-default"
                    >
                        <ResizablePanel defaultSize={40}>
                            <Stack align="center" justify="center" className="h-full">
                                <Text variant="captionMd">A</Text>
                            </Stack>
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={60}>
                            <Stack align="center" justify="center" className="h-full">
                                <Text variant="captionMd">B</Text>
                            </Stack>
                        </ResizablePanel>
                    </ResizablePanelGroup>
                }
            />
            <CatalogCard
                href="/components/scroll-area/"
                name="Scroll Area"
                preview={
                    <ScrollArea className="h-refineui-foundation-size-2000 w-full">
                        <ScrollAreaViewport>
                            <Stack gap="sizeSmall" className="p-refineui-size-small">
                                <Text variant="bodySm">Accordion</Text>
                                <Text variant="bodySm">Alert</Text>
                                <Text variant="bodySm">Avatar</Text>
                                <Text variant="bodySm">Badge</Text>
                                <Text variant="bodySm">Button</Text>
                                <Text variant="bodySm">Card</Text>
                            </Stack>
                        </ScrollAreaViewport>
                        <ScrollAreaScrollbar orientation="vertical">
                            <ScrollAreaThumb />
                        </ScrollAreaScrollbar>
                    </ScrollArea>
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
                preview={
                    <Sidebar className="h-full">
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
                name="SpinButton"
                preview={<SpinButton value={5} onChange={noopNumber} min={0} max={10} />}
            />
            <CatalogCard href="/components/spinner/" name="Spinner" preview={<Spinner size="lg" />} />
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
                            <StepperItem value={1}>
                                <StepperIndicator>2</StepperIndicator>
                                <StepperTitle>Plan</StepperTitle>
                            </StepperItem>
                        </StepperList>
                    </Stepper>
                }
            />
            <CatalogCard href="/components/switch/" name="Switch" preview={<Switch defaultChecked />} />
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
        </CatalogGrid>
    );
}
