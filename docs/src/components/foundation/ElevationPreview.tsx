import { Stack, Text } from "@refineui/react";

const LEVELS = [2, 4, 8, 16, 24, 32, 64] as const;

function ElevationLane({ mode }: { mode: "light" | "dark" }) {
    const suffix = mode === "light" ? "light" : "dark";
    return (
        <div data-refineui-elevation-lane>
            <Text variant="captionMd" className="m-0">
                {mode === "light" ? "Light" : "Dark"}
            </Text>
            <div data-refineui-elevation-row>
                {LEVELS.map((n) => (
                    <div key={n} data-refineui-elevation-cell>
                        <div
                            data-refineui-elevation-card
                            style={{ boxShadow: `var(--refineui-elevation-${n}${suffix})` }}
                        />
                        <Text variant="captionSm" className="m-0">
                            {`shadow${n}`}
                        </Text>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ElevationPreview() {
    return (
        <Stack gap="sizeSmall" data-refineui-elevation-docs>
            <div data-refineui-elevation-stage>
                <ElevationLane mode="light" />
                <ElevationLane mode="dark" />
            </div>
        </Stack>
    );
}
