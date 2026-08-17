import { SegmentedControl, SegmentedControlItem } from "@refineui/react";
import { Look, Looks } from "./PreviewFrame";

export default function SegmentedControlPreview() {
    return (
        <Looks>
            <Look>
                <SegmentedControl aria-label="View" defaultValue="overview">
                    <SegmentedControlItem value="overview">Overview</SegmentedControlItem>
                    <SegmentedControlItem value="analytics">Analytics</SegmentedControlItem>
                    <SegmentedControlItem value="reports">Reports</SegmentedControlItem>
                    <SegmentedControlItem value="settings">Settings</SegmentedControlItem>
                </SegmentedControl>
            </Look>
        </Looks>
    );
}
