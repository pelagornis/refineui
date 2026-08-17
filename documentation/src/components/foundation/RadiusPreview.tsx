import { borderRadii, strokeWidths } from "@refineui/tokens";
import PreviewFrame from "../PreviewFrame";
import { TokenRow, TokenSwatch, TokenTable } from "./TokenMeta";

const RADIUS_KEYS = [
    "roundedNone",
    "roundedXSmall",
    "roundedSmall",
    "roundedMedium",
    "roundedLarge",
    "roundedXLarge",
    "roundedXXLarge",
    "roundedCircle",
] as const;

const STROKE_KEYS = [
    "strokeWidthNone",
    "strokeWidthHairline",
    "strokeWidthThin",
    "strokeWidthThick",
    "strokeWidthThicker",
    "strokeWidthThickest",
] as const;

export function RadiusPreview() {
    return (
        <PreviewFrame>
            <TokenTable>
            {RADIUS_KEYS.map((key) => (
                <TokenRow
                    key={key}
                    leading={
                        <TokenSwatch
                            style={{
                                background: "var(--refineui-color-alias-background-brand-subtle)",
                                borderRadius: borderRadii[key],
                            }}
                        />
                    }
                    name={key}
                    value={borderRadii[key]}
                />
            ))}
            </TokenTable>
        </PreviewFrame>
    );
}

export function StrokePreview() {
    return (
        <PreviewFrame>
            <TokenTable>
            {STROKE_KEYS.map((key) => (
                <TokenRow
                    key={key}
                    leading={
                        <TokenSwatch
                            style={{
                                background: "var(--refineui-color-alias-background-surface)",
                                borderStyle: "solid",
                                borderColor: "var(--refineui-color-alias-border-strong)",
                                borderWidth: strokeWidths[key],
                            }}
                        />
                    }
                    name={key}
                    value={strokeWidths[key]}
                />
            ))}
            </TokenTable>
        </PreviewFrame>
    );
}
