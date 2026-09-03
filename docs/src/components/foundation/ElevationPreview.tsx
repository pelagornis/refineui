import { Text } from "@refineui/react";

const LEVELS = [2, 4, 8, 16, 24, 32, 64] as const;

export function ElevationPreview() {
    return (
        <div data-refineui-elevation-stage>
            <div data-refineui-elevation-row>
                {LEVELS.map((n) => (
                    <div key={n} data-refineui-elevation-cell>
                        <div
                            data-refineui-elevation-card
                            style={{ boxShadow: `var(--refineui-elevation-${n})` }}
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
