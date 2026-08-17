import type { ReactNode } from "react";
import { Stack, Text } from "@refineui/react";

type LookAlign = "center" | "start" | "stretch" | "fill";
type LookTone = "sunken" | "surface" | "scrim";
type LookSize = "hero" | "compact";
type LookWidth = "default" | "wide";

/** A visual specimen. Caption sits under the stage. */
export function Look({
    children,
    caption,
    align = "center",
    tone = "sunken",
    size = "hero",
    width = "default",
}: {
    children: ReactNode;
    caption?: string;
    align?: LookAlign;
    tone?: LookTone;
    size?: LookSize;
    /** stretch child max-width. `wide` uses foundationSize5750 for page bars. */
    width?: LookWidth;
}) {
    return (
        <Stack gap="sizeSmall" data-refineui-look className="w-full min-w-0">
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

/** Vertical stack of looks on a component page. */
export function Looks({ children }: { children: ReactNode }) {
    return (
        <div data-refineui-looks className="w-full min-w-0">
            {children}
        </div>
    );
}

/** Two-up gallery of looks. */
export function LookGrid({ children }: { children: ReactNode }) {
    return <div data-refineui-look-grid>{children}</div>;
}

/** Cluster of live controls inside a look. */
export function Cluster({
    children,
    align = "center",
}: {
    children: ReactNode;
    align?: "center" | "start" | "stretch";
}) {
    return (
        <div data-refineui-cluster data-align={align}>
            {children}
        </div>
    );
}

interface PreviewFrameProps {
    children: ReactNode;
    title?: string;
    variant?: "light" | "dark";
    board?: boolean;
    minHeight?: string;
    minWidth?: string;
}

/** Compact look for foundation token tables. Prefer `Look` on component pages. */
export default function PreviewFrame({ children, title, variant }: PreviewFrameProps) {
    return (
        <Look
            caption={title}
            align="stretch"
            tone={variant === "dark" ? "scrim" : "sunken"}
            size="compact"
        >
            {children}
        </Look>
    );
}
