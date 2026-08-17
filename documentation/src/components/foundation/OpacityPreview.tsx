import { opacities, overlays } from "@refineui/tokens";
import { Stack } from "@refineui/react";
import PreviewFrame from "../PreviewFrame";
import { TokenRow, TokenSwatch, TokenTable } from "./TokenMeta";

export function OpacityPreview() {
    return (
        <PreviewFrame>
            <Stack gap="sizeXXLarge">
            <TokenTable>
                {(Object.keys(opacities) as (keyof typeof opacities)[]).map((key) => (
                    <TokenRow
                        key={key}
                        leading={
                            <TokenSwatch
                                style={{
                                    background: "var(--refineui-color-alias-background-brand)",
                                    opacity: opacities[key],
                                }}
                            />
                        }
                        name={key}
                        value={opacities[key]}
                    />
                ))}
            </TokenTable>
            <TokenTable label="Overlay">
                <TokenRow name="backdrop" value={overlays.backdrop} />
                <TokenRow
                    name="ghostButtonHoverDark"
                    value={overlays.ghostButtonHoverDark}
                />
            </TokenTable>
            </Stack>
        </PreviewFrame>
    );
}
