import { SEMANTIC_TEXT, type SemanticTextName } from "@refineui/tokens";
import {
    foundationTypographyUtilityClass,
    isSemanticTextTokenRef,
    semanticTextToken,
    type SemanticTextTokenRef,
} from "@refineui/utilities";

/** Resolve a semantic text role → `refineui-typo-*` utility class. */
export function semanticTextClass(name: SemanticTextName): string {
    return foundationTypographyUtilityClass(SEMANTIC_TEXT[name]);
}

/** Resolve a component typography token ref → utility class. */
export function componentTextClass(ref: SemanticTextTokenRef<SemanticTextName>): string {
    if (!isSemanticTextTokenRef(ref)) {
        throw new Error("componentTextClass expects a semantic text token ref.");
    }
    return semanticTextClass(ref.name);
}

/** Size-keyed component token map → utility class (`formControl`, `label`, …). */
export function sizedComponentTextClass<TSize extends string>(
    map: Record<TSize, SemanticTextTokenRef<SemanticTextName>>,
    size: TSize,
): string {
    return componentTextClass(map[size]);
}

/** Materialize a size/role map of token refs into Tailwind utility class strings. */
export function buildSemanticTextClassMap<TKey extends string>(
    map: Record<TKey, SemanticTextTokenRef<SemanticTextName>>,
): Record<TKey, string> {
    return Object.fromEntries(
        Object.entries(map).map(([key, token]) => [
            key,
            componentTextClass(token as SemanticTextTokenRef<SemanticTextName>),
        ]),
    ) as Record<TKey, string>;
}
