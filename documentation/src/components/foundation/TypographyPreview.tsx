import { SEMANTIC_TEXT, typographys, fontFamilies, fontWeights } from "@refineui/tokens";
import { Stack, Text } from "@refineui/react";
import type { SemanticTextName } from "@refineui/tokens";
import PreviewFrame from "../PreviewFrame";
import { TokenRow, TokenTable } from "./TokenMeta";

const SEMANTIC_GROUPS: { title: string; keys: SemanticTextName[] }[] = [
    { title: "Display", keys: ["displayLg", "displayMd", "displaySm"] },
    { title: "Heading", keys: ["headingLg", "headingMd", "headingSm"] },
    { title: "Title", keys: ["titleLg", "titleMd", "titleSm"] },
    { title: "Subtitle", keys: ["subtitleLg", "subtitleMd"] },
    { title: "Body", keys: ["bodyLg", "bodyMd", "bodySm", "bodyXs"] },
    { title: "Label", keys: ["labelLg", "labelMd", "labelSm"] },
    { title: "Caption", keys: ["captionLg", "captionMd", "captionSm"] },
];

export function TypographyPreview() {
    return (
        <PreviewFrame>
            <Stack gap="sizeXXLarge">
            <TokenTable>
                <TokenRow name="Family" value={fontFamilies.fontFamily} />
                <TokenRow name="Weights" value={Object.values(fontWeights).join(" · ")} />
            </TokenTable>
            {SEMANTIC_GROUPS.map((group) => (
                <Stack key={group.title} gap="sizeMedium">
                    <Text variant="captionMd" className="m-0 text-refineui-alias-foreground-secondary">
                        {group.title}
                    </Text>
                    {group.keys.map((role) => {
                        const foundation = SEMANTIC_TEXT[role];
                        const spec = typographys[foundation];
                        return (
                            <Stack
                                key={role}
                                direction="row"
                                gap="sizeLarge"
                                align="end"
                                data-refineui-type-row
                            >
                                <div className="min-w-0 flex-1">
                                    <Text variant={role} as="p" className="m-0">
                                        RefineUI
                                    </Text>
                                </div>
                                <Stack gap="sizeXXXSmall" className="w-refineui-foundation-size-2000 shrink-0">
                                    <Text variant="captionMd" className="m-0">
                                        {role}
                                    </Text>
                                    <Text
                                        variant="captionSm"
                                        className="m-0 text-refineui-alias-foreground-tertiary"
                                    >
                                        {`${foundation} · ${spec.fontSize} / ${spec.lineHeight}`}
                                    </Text>
                                </Stack>
                            </Stack>
                        );
                    })}
                </Stack>
            ))}
            </Stack>
        </PreviewFrame>
    );
}
