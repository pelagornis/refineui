import { semanticInteraction } from "@refineui/tokens";
import { Stack } from "@refineui/react";
import PreviewFrame from "../PreviewFrame";
import { TokenRow, TokenTable } from "./TokenMeta";

const DURATION_ROLES = [
    "instant",
    "fast",
    "normal",
    "medium",
    "slow",
    "overlay",
    "panel",
    "accordionPanel",
    "accordionContent",
    "skeleton",
    "spinner",
] as const;

const EASING_ROLES = ["standard", "emphasized", "panel", "content", "linear", "easeOut", "easeInOut"] as const;

export function MotionPreview() {
    return (
        <PreviewFrame>
            <Stack gap="sizeXXLarge">
            <TokenTable label="Duration">
                {DURATION_ROLES.map((role) => (
                    <TokenRow
                        key={role}
                        name={role}
                        value={semanticInteraction.duration[role]}
                    />
                ))}
            </TokenTable>
            <TokenTable label="Easing">
                {EASING_ROLES.map((role) => (
                    <TokenRow
                        key={role}
                        name={role}
                        value={semanticInteraction.easing[role]}
                    />
                ))}
            </TokenTable>
            <TokenTable label="Scale and distance">
                <TokenRow name="enter" value={semanticInteraction.scale.enter} />
                <TokenRow name="press" value={semanticInteraction.scale.press} />
                <TokenRow name="hoverGrow" value={semanticInteraction.scale.hoverGrow} />
                <TokenRow name="float" value={semanticInteraction.distance.float} />
            </TokenTable>
            </Stack>
        </PreviewFrame>
    );
}
