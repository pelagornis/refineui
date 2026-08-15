import type { ReactNode } from "react";
import { Box, Text } from "@refineui/react";

const tones = [
    "bg-refineui-alias-background-info-subtle text-refineui-alias-foreground-info",
    "bg-refineui-alias-background-brand-subtle text-refineui-alias-foreground-brand",
    "bg-refineui-alias-background-discovery-subtle text-refineui-alias-foreground-discovery",
    "bg-refineui-alias-background-success-subtle text-refineui-alias-foreground-success",
] as const;

export function DemoBlock({
    children,
    tone = 0,
    className,
}: {
    children: ReactNode;
    tone?: 0 | 1 | 2 | 3;
    className?: string;
}) {
    return (
        <div
            className={[
                "box-border flex min-h-refineui-foundation-size-800 items-center justify-center rounded-refineui-medium px-refineui-size-medium py-refineui-size-small",
                tones[tone],
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <Text variant="labelMd">{children}</Text>
        </div>
    );
}

export function DemoCanvas({ children }: { children: ReactNode }) {
    return (
        <Box
            padding="sizeXLarge"
            background="surfaceSunken"
            radius="roundedXLarge"
            className="w-full"
        >
            {children}
        </Box>
    );
}
