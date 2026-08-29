import type { ReactNode } from "react";
import { Stack, Text } from "@refineui/react";
import { Look } from "../specimen/Look";

/** Live product stage + optional control rail. */
export function LiveStage({
    children,
    controls,
    caption,
}: {
    children: ReactNode;
    controls?: ReactNode;
    caption?: string;
}) {
    return (
        <div data-docs-ui="live-stage" className="w-full min-w-0">
            <Look tone="surface" size="hero" caption={caption}>
                {children}
            </Look>
            {controls ? (
                <aside data-docs-ui="control-rail" aria-label="Interactive controls">
                    <Text variant="captionMd" className="m-0 text-refineui-alias-foreground-tertiary">
                        Controls
                    </Text>
                    <Stack gap="sizeMedium">{controls}</Stack>
                </aside>
            ) : null}
        </div>
    );
}
