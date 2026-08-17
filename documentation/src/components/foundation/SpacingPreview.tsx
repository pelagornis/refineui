import { iconSizes, spacings } from "@refineui/tokens";
import PreviewFrame from "../PreviewFrame";
import { TokenRow, TokenSwatch, TokenTable } from "./TokenMeta";

const SPACE_KEYS = [
    "sizeNone",
    "sizeXXXSmall",
    "sizeXXSmall",
    "sizeXSmall",
    "sizeSmall",
    "sizeMedium",
    "sizeLarge",
    "sizeXLarge",
    "sizeXXLarge",
    "sizeXXXLarge",
] as const;

export function SpacingPreview() {
    return (
        <PreviewFrame>
            <TokenTable>
            {SPACE_KEYS.map((key) => (
                <TokenRow
                    key={key}
                    leading={
                        <div data-refineui-space-bar>
                            <div
                                className="h-full rounded-refineui-small bg-refineui-alias-background-brand"
                                style={{
                                    width: spacings[key] === "0" ? spacings.sizeXXXSmall : spacings[key],
                                }}
                            />
                        </div>
                    }
                    name={key}
                    value={spacings[key]}
                />
            ))}
            </TokenTable>
        </PreviewFrame>
    );
}

export function IconSizePreview() {
    return (
        <PreviewFrame>
            <TokenTable>
            {(Object.keys(iconSizes) as (keyof typeof iconSizes)[]).map((key) => {
                const px = `${iconSizes[key]}px`;
                return (
                    <TokenRow
                        key={key}
                        leading={
                            <TokenSwatch
                                style={{
                                    width: px,
                                    height: px,
                                    background: "var(--refineui-color-alias-background-brand-subtle)",
                                }}
                            />
                        }
                        name={key}
                        value={px}
                    />
                );
            })}
            </TokenTable>
        </PreviewFrame>
    );
}
