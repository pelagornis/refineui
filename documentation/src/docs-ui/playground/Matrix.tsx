import type { ReactNode } from "react";
import { Stack, Text } from "@refineui/react";
import { Cluster, Look, LookGrid } from "../specimen/Look";

export function VariantMatrix({
    label,
    children,
}: {
    label?: string;
    children: ReactNode;
}) {
    return (
        <Stack gap="sizeSmall" data-docs-ui="variant-matrix" className="w-full min-w-0">
            {label ? (
                <Text variant="captionMd" className="m-0 text-refineui-alias-foreground-tertiary">
                    {label}
                </Text>
            ) : null}
            <LookGrid>{children}</LookGrid>
        </Stack>
    );
}

export function StateRow({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div data-docs-ui="state-row">
            <Text variant="captionMd" className="m-0 text-refineui-alias-foreground-tertiary shrink-0">
                {label}
            </Text>
            <Look tone="surface" size="compact" align="start">
                <Cluster align="start">{children}</Cluster>
            </Look>
        </div>
    );
}
