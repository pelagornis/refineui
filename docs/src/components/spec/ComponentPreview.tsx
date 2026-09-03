import { useState } from "react";
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
    Badge,
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SegmentedControl,
    SegmentedControlItem,
    Spinner,
    Switch,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Tag,
    Toaster,
    toast,
} from "@refineui/react";
import { Cluster, Look, Looks } from "../PreviewFrame";
import InputPreview from "../InputPreview";
import RadioPreview from "../RadioPreview";
import LinkPreview from "../LinkPreview";

const ALERT_VARIANTS = ["default", "info", "success", "warning", "danger", "custom"] as const;
const BUTTON_VARIANTS = ["primary", "secondary", "outline", "ghost"] as const;
const DIALOG_SIZES = ["sm", "lg"] as const;
const BADGE_VARIANTS = ["default", "neutral", "outline", "success", "warning", "danger"] as const;
const TOAST_VARIANTS = ["default", "success", "error", "warning"] as const;

export type AlertPreviewVariant = (typeof ALERT_VARIANTS)[number];
export type ButtonPreviewVariant = (typeof BUTTON_VARIANTS)[number];
export type DialogPreviewSize = (typeof DIALOG_SIZES)[number];
export type BadgePreviewVariant = (typeof BADGE_VARIANTS)[number];
export type ToastPreviewVariant = (typeof TOAST_VARIANTS)[number];

export type ComponentPreviewProps = {
    component: string;
    variant?: string;
};

function isAlertVariant(value: string | undefined): value is AlertPreviewVariant {
    return value !== undefined && (ALERT_VARIANTS as readonly string[]).includes(value);
}

function isButtonVariant(value: string | undefined): value is ButtonPreviewVariant {
    return value !== undefined && (BUTTON_VARIANTS as readonly string[]).includes(value);
}

function isDialogSize(value: string | undefined): value is DialogPreviewSize {
    return value !== undefined && (DIALOG_SIZES as readonly string[]).includes(value);
}

function isBadgeVariant(value: string | undefined): value is BadgePreviewVariant {
    return value !== undefined && (BADGE_VARIANTS as readonly string[]).includes(value);
}

function isToastVariant(value: string | undefined): value is ToastPreviewVariant {
    return value !== undefined && (TOAST_VARIANTS as readonly string[]).includes(value);
}

function AlertPreview({ variant }: { variant?: string }) {
    const resolvedVariant = isAlertVariant(variant) ? variant : "info";

    return (
        <Looks>
            <Look align="stretch">
                <Alert variant={resolvedVariant} className="w-full">
                    <AlertRow>
                        <AlertIcon />
                        <AlertBody>
                            <AlertTitle>Contract-aligned preview</AlertTitle>
                            <AlertDescription>
                                Live Alert ({resolvedVariant}) — visual layer via recipe + React.
                            </AlertDescription>
                        </AlertBody>
                        <AlertClose type="button" />
                    </AlertRow>
                    <AlertActions>
                        <AlertAction type="button">Action</AlertAction>
                    </AlertActions>
                </Alert>
            </Look>
        </Looks>
    );
}

function ButtonPreview({ variant }: { variant?: string }) {
    const resolvedVariant = isButtonVariant(variant) ? variant : "primary";

    return (
        <Looks>
            <Look>
                <Button variant={resolvedVariant}>Continue</Button>
            </Look>
        </Looks>
    );
}

function AccordionPreview() {
    return (
        <Looks>
            <Look align="stretch">
                <Accordion type="single" collapsible defaultValue="returns" className="w-full">
                    <AccordionItem value="shipping">
                        <AccordionTrigger>What are your shipping options?</AccordionTrigger>
                        <AccordionContent>
                            Standard (5–7 days), express (2–3 days), and overnight.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="returns">
                        <AccordionTrigger>What is your return policy?</AccordionTrigger>
                        <AccordionContent>
                            Returns within 30 days. Refunds in 5–7 business days.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="support">
                        <AccordionTrigger>How can I contact support?</AccordionTrigger>
                        <AccordionContent>Email, live chat, or phone within 24 hours.</AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Look>
        </Looks>
    );
}

function DialogPreview({ variant }: { variant?: string }) {
    const size = isDialogSize(variant) ? variant : "lg";

    return (
        <Looks>
            <Look>
                <Dialog size={size}>
                    <DialogTrigger type="button">Open dialog</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Dialog title</DialogTitle>
                            <DialogDescription>
                                Live Dialog ({size}) — recipe + React implementation.
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </Look>
        </Looks>
    );
}

function BadgePreview({ variant }: { variant?: string }) {
    const resolved = isBadgeVariant(variant) ? variant : "default";
    return (
        <Looks>
            <Look>
                <Cluster>
                    <Badge variant={resolved}>{resolved}</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning" layout="number">
                        12
                    </Badge>
                </Cluster>
            </Look>
        </Looks>
    );
}

function SwitchPreview({ variant }: { variant?: string }) {
    const checked = variant !== "off";
    return (
        <Looks>
            <Look>
                <Cluster>
                    <Switch checked={checked} onCheckedChange={() => {}} aria-label="Toggle" />
                    <Switch checked={false} disabled aria-label="Disabled" />
                </Cluster>
            </Look>
        </Looks>
    );
}

function CheckboxPreview({ variant }: { variant?: string }) {
    const circular = variant === "circular";
    return (
        <Looks>
            <Look>
                <Cluster>
                    <Checkbox
                        defaultChecked
                        label="Checked"
                        {...(circular ? { variant: "circular" as const } : {})}
                    />
                    <Checkbox
                        label="Unchecked"
                        {...(circular ? { variant: "circular" as const } : {})}
                    />
                </Cluster>
            </Look>
        </Looks>
    );
}

function TabsPreview() {
    return (
        <Looks>
            <Look align="stretch">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="specs">Specs</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">Overview panel</TabsContent>
                    <TabsContent value="specs">Specs panel</TabsContent>
                    <TabsContent value="activity">Activity panel</TabsContent>
                </Tabs>
            </Look>
        </Looks>
    );
}

function SelectPreview() {
    return (
        <Looks>
            <Look>
                <Select defaultValue="apple">
                    <SelectTrigger aria-label="Fruit">
                        <SelectValue placeholder="Pick a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="orange">Orange</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                    </SelectContent>
                </Select>
            </Look>
        </Looks>
    );
}

function ToastPreview({ variant }: { variant?: string }) {
    const resolvedVariant = isToastVariant(variant) ? variant : "success";
    const message =
        resolvedVariant === "error"
            ? "Upload failed"
            : resolvedVariant === "warning"
              ? "Check your connection"
              : resolvedVariant === "default"
                ? "New notification"
                : "Saved successfully";

    return (
        <Looks>
            <Look>
                <Toaster />
                <Button
                    type="button"
                    variant="primary"
                    onClick={() =>
                        toast(message, {
                            variant: resolvedVariant,
                        })
                    }
                >
                    Show toast
                </Button>
            </Look>
        </Looks>
    );
}

function SpinnerPreview() {
    return (
        <Looks>
            <Look>
                <Spinner size="md" aria-label="Loading" />
            </Look>
        </Looks>
    );
}

function ChipPreview({ variant }: { variant?: string }) {
    const resolved =
        variant === "outline" || variant === "filled" || variant === "default" ? variant : "default";
    return (
        <Looks>
            <Look>
                <Cluster>
                    <Tag variant={resolved}>{resolved}</Tag>
                    <Tag variant="outline">Outline</Tag>
                    <Tag variant="filled" onRemove={() => {}}>
                        Removable
                    </Tag>
                </Cluster>
            </Look>
        </Looks>
    );
}

function SegmentedControlPreview() {
    return (
        <Looks>
            <Look>
                <SegmentedControl aria-label="View" defaultValue="overview">
                    <SegmentedControlItem value="overview">Overview</SegmentedControlItem>
                    <SegmentedControlItem value="analytics">Analytics</SegmentedControlItem>
                    <SegmentedControlItem value="reports">Reports</SegmentedControlItem>
                </SegmentedControl>
            </Look>
        </Looks>
    );
}

/**
 * Live React preview — separate from SpecRenderer (contract tables).
 * Recipe + component implementation; not derived from spec JSON.
 */
export function ComponentPreview({ component, variant }: ComponentPreviewProps) {
    switch (component) {
        case "alert":
            return <AlertPreview variant={variant} />;
        case "button":
            return <ButtonPreview variant={variant} />;
        case "accordion":
            return <AccordionPreview />;
        case "dialog":
            return <DialogPreview variant={variant} />;
        case "badge":
            return <BadgePreview variant={variant} />;
        case "switch":
            return <SwitchPreview variant={variant} />;
        case "checkbox":
            return <CheckboxPreview variant={variant} />;
        case "tabs":
            return <TabsPreview />;
        case "select":
            return <SelectPreview />;
        case "toast":
            return <ToastPreview variant={variant} />;
        case "spinner":
            return <SpinnerPreview />;
        case "chip":
        case "tag":
            return <ChipPreview variant={variant} />;
        case "segmented-control":
            return <SegmentedControlPreview />;
        case "input":
            return <InputPreview />;
        case "radio":
            return <RadioPreview />;
        case "link":
            return <LinkPreview />;
        default:
            return null;
    }
}
