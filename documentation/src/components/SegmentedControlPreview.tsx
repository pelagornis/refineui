import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    SegmentedControl,
    SegmentedControlItem,
} from "@refineui/react";
import PreviewFrame from "./PreviewFrame";

const views = {
    overview: {
        title: "Overview",
        description:
            "View your key metrics and recent project activity. Track progress across all your active projects.",
        body: "You have 12 active projects and 3 pending tasks.",
    },
    analytics: {
        title: "Analytics",
        description:
            "Track performance and user engagement metrics. Monitor trends and identify growth opportunities.",
        body: "Page views are up 25% compared to last month.",
    },
    reports: {
        title: "Reports",
        description:
            "Generate and download your detailed reports. Export data in multiple formats for analysis.",
        body: "You have 5 reports ready and available to export.",
    },
    settings: {
        title: "Settings",
        description: "Manage your account preferences and options. Customize your experience to fit your needs.",
        body: "Configure notifications, security, and themes.",
    },
} as const;

type View = keyof typeof views;

/**
 * Compact mutually exclusive choice — sliding brand indicator.
 */
export default function SegmentedControlPreview() {
    const [view, setView] = useState<View>("overview");
    const current = views[view];

    return (
        <PreviewFrame minHeight="420px">
            <div className="flex w-full max-w-[400px] flex-col gap-refineui-size-medium">
                <SegmentedControl
                    aria-label="View"
                    value={view}
                    onValueChange={(next) => {
                        if (next in views) setView(next as View);
                    }}
                >
                    <SegmentedControlItem value="overview">Overview</SegmentedControlItem>
                    <SegmentedControlItem value="analytics">Analytics</SegmentedControlItem>
                    <SegmentedControlItem value="reports">Reports</SegmentedControlItem>
                    <SegmentedControlItem value="settings">Settings</SegmentedControlItem>
                </SegmentedControl>
                <Card>
                    <CardHeader>
                        <CardTitle>{current.title}</CardTitle>
                        <CardDescription>{current.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="refineui-typo-body-4 text-refineui-alias-foreground-secondary">
                        {current.body}
                    </CardContent>
                </Card>
            </div>
        </PreviewFrame>
    );
}
