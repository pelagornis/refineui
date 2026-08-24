import type { ReactNode } from "react";
import { Stack, Text } from "@refineui/react";

type LookAlign = "center" | "start" | "stretch" | "fill";
type LookTone = "sunken" | "surface" | "scrim";
type LookSize = "hero" | "compact";
type LookWidth = "default" | "wide";

/** Visual specimen stage — product components only, no simulated chrome. */
export function Look({
    children,
    caption,
    align = "center",
    tone = "surface",
    size = "hero",
    width = "default",
}: {
    children: ReactNode;
    caption?: string;
    align?: LookAlign;
    tone?: LookTone;
    size?: LookSize;
    width?: LookWidth;
}) {
    return (
        <Stack gap="sizeSmall" data-docs-ui="look" className="w-full min-w-0">
            <div
                data-refineui-look-stage
                data-align={align}
                data-tone={tone}
                data-size={size}
                data-width={width === "wide" ? "wide" : undefined}
            >
                {children}
            </div>
            {caption ? (
                <Text variant="captionMd" className="m-0 text-refineui-alias-foreground-secondary">
                    {caption}
                </Text>
            ) : null}
        </Stack>
    );
}

export function Looks({ children }: { children: ReactNode }) {
    return (
        <div data-refineui-looks data-docs-ui="looks" className="w-full min-w-0">
            {children}
        </div>
    );
}

export function LookGrid({ children }: { children: ReactNode }) {
    return <div data-refineui-look-grid data-docs-ui="look-grid">{children}</div>;
}

export function Cluster({
    children,
    align = "center",
}: {
    children: ReactNode;
    align?: "center" | "start" | "stretch";
}) {
    return (
        <div data-refineui-cluster data-docs-ui="cluster" data-align={align}>
            {children}
        </div>
    );
}
