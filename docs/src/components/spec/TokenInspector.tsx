import { useState } from "react";
import { Stack, Text } from "@refineui/react";
import { ControlGroup, ControlSelect } from "../../docs-ui/playground/Controls";
import { DocSection } from "../../docs-ui/page/DocSection";
import {
    defaultTokenInspectorVariant,
    filterRecipeBindings,
    isTokenInspectorSupported,
    recipeSourceLabel,
    tokenInspectorVisualPrefix,
} from "../../lib/recipe-token-bindings";
import { loadComponentSpec } from "../../lib/component-spec";
import {
    loadComponentTokenTrace,
    resolveComponentTokenPaths,
    resolveTokenTrace,
} from "../../lib/token-trace";
import { ComponentPreview } from "./ComponentPreview";
import { RecipeTokenTable, TokenTraceTable } from "./TokenTraceTable";

export type TokenInspectorProps = {
    component: string;
    /** Initial variant — filters recipe slot bindings when applicable. */
    variant?: string;
};

/**
 * Visual token trace — recipe slot bindings + componentColorTokens trace v2.
 * Separate from SpecRenderer; references build output, not inferred guidance.
 */
export function TokenInspector({ component, variant: variantProp }: TokenInspectorProps) {
    const defaultVariant = defaultTokenInspectorVariant(component);
    const [variant, setVariant] = useState(variantProp ?? defaultVariant);

    if (!isTokenInspectorSupported(component)) {
        return (
            <Text variant="bodyMd" className="m-0 text-refineui-alias-foreground-error">
                TokenInspector does not include `{component}` yet.
            </Text>
        );
    }

    const spec = loadComponentSpec(component);
    const visualPrefix = tokenInspectorVisualPrefix(component, spec?.tokens?.visual);
    const componentTrace = loadComponentTokenTrace();

    const variantOptions =
        (spec?.variants?.variant as readonly string[] | undefined) ??
        (component === "tabs" || component === "segmented-control"
            ? ["selected"]
            : component === "switch"
              ? ["on", "off"]
              : [defaultVariant]);

    if (!componentTrace) {
        return (
            <Text variant="bodyMd" className="m-0 text-refineui-alias-foreground-secondary">
                Token trace not found. Run `bun run build:react` to generate{" "}
                <code className="font-mono">packages/react/dist/spec/token-trace-v2.json</code>.
            </Text>
        );
    }

    const allComponentTraces = resolveComponentTokenPaths(visualPrefix);

    const recipeRows = filterRecipeBindings(component, variant)
        .map((binding) => {
            const resolved = resolveTokenTrace(binding.trace);
            if (!resolved) return null;
            return {
                slot: binding.slot,
                variant: binding.variant ?? "—",
                property: binding.property,
                traceKey: resolved.traceKey,
                semantic: resolved.semantic,
                lightFoundation: resolved.lightFoundation,
                darkFoundation: resolved.darkFoundation,
                recipeClass: binding.recipeClass,
            };
        })
        .filter((row): row is NonNullable<typeof row> => row !== null);

    const showVariantControl = variantOptions.length > 1 || Boolean(spec?.variants?.variant);

    return (
        <Stack gap="sizeNone" data-docs-ui="token-inspector" className="w-full min-w-0">
            <DocSection
                id="token-variant"
                title="Variant"
                description="Select a recipe variant — preview and Recipe → Tokens update together."
            >
                <Stack gap="sizeLarge">
                    {showVariantControl ? (
                        <ControlGroup>
                            <ControlSelect
                                label="Variant"
                                value={variant}
                                options={[...variantOptions]}
                                onChange={setVariant}
                            />
                        </ControlGroup>
                    ) : null}
                    <div data-docs-ui="token-inspector-preview">
                        <ComponentPreview component={component} variant={variant} />
                    </div>
                </Stack>
            </DocSection>

            <DocSection
                id="token-recipe-trace"
                title="Recipe → Tokens"
                description={`Slot bindings for variant="${variant}" — declared in ${recipeSourceLabel(component)}.`}
            >
                <RecipeTokenTable rows={recipeRows} />
            </DocSection>

            <DocSection
                id="token-component-trace"
                title="Component token trace"
                description={`All paths in token-trace-v2.json prefixed with ${visualPrefix}.`}
            >
                <TokenTraceTable rows={allComponentTraces} aria-label="Component token trace" />
            </DocSection>
        </Stack>
    );
}
