import { Stack, Text } from "@refineui/react";
import { DocSection } from "../../docs-ui/page/DocSection";
import { isSpecRendererSupported, loadComponentSpec } from "../../lib/component-spec";
import { AccessibilityTable } from "./AccessibilityTable";
import { AnatomyTable } from "./AnatomyTable";
import { FocusTable } from "./FocusTable";
import { KeyboardTable } from "./KeyboardTable";
import { LayoutTable } from "./LayoutTable";
import { StateTable } from "./StateTable";
import { VariantTable } from "./VariantTable";

export type SpecRendererProps = {
    component: string;
};

/**
 * Renders Component Spec contract tables — canonical source is packages/react/spec/.
 * Does not infer usage guidance; displays declared contract fields only.
 */
export function SpecRenderer({ component }: SpecRendererProps) {
    const spec = loadComponentSpec(component);

    if (!spec) {
        return (
            <Text variant="bodyMd" className="m-0 text-refineui-alias-foreground-error">
                Component spec not found: {component}
            </Text>
        );
    }

    if (!isSpecRendererSupported(component)) {
        return (
            <Text variant="bodyMd" className="m-0 text-refineui-alias-foreground-error">
                Component spec not registered: {component}
            </Text>
        );
    }

    const overviewRows = [
        spec.export ? `export: ${spec.export}` : null,
        `version: ${spec.version}`,
        spec.recipe ? `recipe: ${spec.recipe}` : null,
        spec.tokens?.visual ? `tokens.visual: ${spec.tokens.visual}` : null,
    ].filter(Boolean);

    return (
        <Stack gap="sizeNone" data-docs-ui="spec-renderer" className="w-full min-w-0">
            <DocSection
                id="spec-overview"
                title="Overview"
                description="Machine-readable contract from Component Spec."
            >
                <Stack gap="sizeXXSmall">
                    <Text variant="bodyMd" className="m-0 font-mono">
                        component: {spec.component}
                    </Text>
                    {overviewRows.map((line) => (
                        <Text key={line} variant="bodyMd" className="m-0 font-mono text-refineui-alias-foreground-secondary">
                            {line}
                        </Text>
                    ))}
                    {spec.attributes ? (
                        <Text variant="bodyMd" className="m-0 font-mono text-refineui-alias-foreground-secondary">
                            attributes:{" "}
                            {Object.entries(spec.attributes)
                                .map(([key, value]) => `${key}=${value}`)
                                .join(", ")}
                        </Text>
                    ) : null}
                </Stack>
            </DocSection>

            {spec.anatomy ? (
                <DocSection id="spec-anatomy" title="Anatomy">
                    <AnatomyTable anatomy={spec.anatomy} />
                </DocSection>
            ) : null}

            {spec.variants ? (
                <DocSection id="spec-variants" title="Variants">
                    <VariantTable variants={spec.variants} />
                </DocSection>
            ) : null}

            {spec.states || spec.dom ? (
                <DocSection id="spec-states" title="States">
                    <StateTable states={spec.states} dom={spec.dom} />
                </DocSection>
            ) : null}

            {spec.accessibility ? (
                <DocSection id="spec-accessibility" title="Accessibility">
                    <AccessibilityTable accessibility={spec.accessibility} />
                </DocSection>
            ) : null}

            {spec.keyboard ? (
                <DocSection id="spec-keyboard" title="Keyboard">
                    <KeyboardTable keyboard={spec.keyboard} />
                </DocSection>
            ) : null}

            {spec.focus ? (
                <DocSection id="spec-focus" title="Focus">
                    <FocusTable focus={spec.focus} />
                </DocSection>
            ) : null}

            {spec.layout ? (
                <DocSection id="spec-layout" title="Layout">
                    <LayoutTable layout={spec.layout} />
                </DocSection>
            ) : null}
        </Stack>
    );
}
