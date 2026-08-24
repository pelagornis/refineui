import { useState } from "react";
import {
    Button,
    Stack,
    Text,
    WebIcon,
    type ButtonLayout,
    type ButtonSize,
    type ButtonVariant,
} from "@refineui/react";
import { iconSizes } from "@refineui/tokens";
import {
    A11ySpec,
    Anatomy,
    Cluster,
    ControlGroup,
    ControlSelect,
    ControlSwitch,
    DocSection,
    DoDont,
    LiveStage,
    Look,
    MotionSpec,
    StateRow,
    TokenSpec,
    VariantMatrix,
} from "../docs-ui";

const VARIANTS = ["primary", "secondary", "outline", "ghost"] as const satisfies readonly ButtonVariant[];
const SIZES = ["sm", "md", "lg"] as const satisfies readonly ButtonSize[];
const LAYOUTS = ["label", "icon"] as const satisfies readonly ButtonLayout[];

/**
 * Canonical component page — real `@refineui/react` Button only.
 * Template for other component docs.
 */
export default function ButtonDocs() {
    const [variant, setVariant] = useState<ButtonVariant>("primary");
    const [size, setSize] = useState<ButtonSize>("md");
    const [layout, setLayout] = useState<ButtonLayout>("label");
    const [disabled, setDisabled] = useState(false);
    const [fullWidth, setFullWidth] = useState(false);

    return (
        <Stack gap="sizeNone" data-docs-ui="component-page" className="w-full min-w-0">
            <DocSection
                id="live-preview"
                title="Live Preview"
                description="Product Button with interactive controls. Same implementation as runtime."
            >
                <LiveStage
                    controls={
                        <ControlGroup>
                            <ControlSelect
                                label="Variant"
                                value={variant}
                                options={VARIANTS}
                                onChange={setVariant}
                            />
                            <ControlSelect label="Size" value={size} options={SIZES} onChange={setSize} />
                            <ControlSelect
                                label="Layout"
                                value={layout}
                                options={LAYOUTS}
                                onChange={setLayout}
                            />
                            <ControlSwitch label="Disabled" checked={disabled} onCheckedChange={setDisabled} />
                            <ControlSwitch
                                label="Full width"
                                checked={fullWidth}
                                onCheckedChange={setFullWidth}
                            />
                        </ControlGroup>
                    }
                >
                    <div className={fullWidth ? "w-full max-w-refineui-foundation-size-3250" : undefined}>
                        <Button
                            variant={variant}
                            size={size}
                            layout={layout}
                            disabled={disabled}
                            fullWidth={fullWidth}
                            aria-label={layout === "icon" ? "Add" : undefined}
                        >
                            {layout === "icon" ? (
                                <WebIcon name="add" size={iconSizes.medium} color="currentColor" fallback="+" />
                            ) : (
                                "Continue"
                            )}
                        </Button>
                    </div>
                </LiveStage>
            </DocSection>

            <DocSection id="variants" title="Variants" description="Visual styles from Web Kit Style.">
                <VariantMatrix>
                    {VARIANTS.map((item) => (
                        <Look key={item} caption={item} size="compact">
                            <Button variant={item}>Continue</Button>
                        </Look>
                    ))}
                </VariantMatrix>
            </DocSection>

            <DocSection id="states" title="States" description="Enabled, hover/active via CSS, disabled.">
                <Stack gap="sizeMedium">
                    <StateRow label="Enabled">
                        {VARIANTS.map((item) => (
                            <Button key={item} variant={item}>
                                {item}
                            </Button>
                        ))}
                    </StateRow>
                    <StateRow label="Disabled">
                        {VARIANTS.map((item) => (
                            <Button key={item} variant={item} disabled>
                                {item}
                            </Button>
                        ))}
                    </StateRow>
                    <StateRow label="Icon">
                        {VARIANTS.map((item) => (
                            <Button key={item} variant={item} layout="icon" aria-label={item}>
                                <WebIcon name="add" size={iconSizes.medium} color="currentColor" fallback="+" />
                            </Button>
                        ))}
                    </StateRow>
                </Stack>
            </DocSection>

            <DocSection id="anatomy" title="Anatomy">
                <Anatomy
                    preview={
                        <Look size="compact">
                            <Cluster>
                                <Button variant="primary">Label</Button>
                                <Button variant="primary" layout="icon" aria-label="Icon">
                                    <WebIcon
                                        name="add"
                                        size={iconSizes.medium}
                                        color="currentColor"
                                        fallback="+"
                                    />
                                </Button>
                            </Cluster>
                        </Look>
                    }
                    parts={[
                        {
                            name: "Root",
                            description: "Native button. Carries variant, size, layout, inactive.",
                        },
                        {
                            name: "Label",
                            description: "Text content when layout=label. Typography from button size tokens.",
                        },
                        {
                            name: "Icon",
                            description: "Optional glyph when layout=icon. Square hit target per size.",
                        },
                    ]}
                />
            </DocSection>

            <DocSection
                id="tokens"
                title="Tokens"
                description="Resolved through Foundation → semantic aliases. No hard-coded px or hex in the component."
            >
                <TokenSpec
                    rows={[
                        {
                            token: "--refineui-size-button-min-height-sm|md|lg",
                            role: "Min height / icon square",
                            value: "componentSizes → foundationSizes",
                        },
                        {
                            token: "--refineui-radius-rounded-large|x-large|xx-large",
                            role: "Corner radius by size",
                            value: "borderRadii",
                        },
                        {
                            token: "--refineui-color-alias-background-brand",
                            role: "Primary fill",
                            value: "semantic color alias",
                        },
                        {
                            token: "--refineui-color-alias-border-default",
                            role: "Secondary / outline stroke",
                            value: "semantic color alias",
                        },
                        {
                            token: "--refineui-spacing-size-*",
                            role: "Padding & gap",
                            value: "spacings",
                        },
                    ]}
                />
            </DocSection>

            <DocSection
                id="motion"
                title="Motion Specification"
                description="CSS transitions only. Duration and scale from semantic motion roles."
            >
                <MotionSpec
                    rows={[
                        {
                            property: "opacity, background, border, color",
                            duration: "motion.duration.fast",
                            easing: "motion.easing.easeOut",
                            notes: "Hover / focus color shifts",
                        },
                        {
                            property: "transform (active)",
                            duration: "motion.duration.fast",
                            easing: "motion.easing.easeOut",
                            notes: "scale(motion.scale.press)",
                        },
                    ]}
                />
                <Text variant="captionMd" className="m-0 text-refineui-alias-foreground-tertiary">
                    CSS:{" "}
                    <code className="font-mono">
                        --refineui-motion-duration-fast · --refineui-motion-easing-ease-out ·
                        --refineui-motion-scale-press
                    </code>
                </Text>
            </DocSection>

            <DocSection id="accessibility" title="Accessibility">
                <A11ySpec
                    rows={[
                        {
                            concern: "Role",
                            implementation: "Native <button>; type defaults to button.",
                        },
                        {
                            concern: "Name",
                            implementation: "Visible label, or aria-label when layout=icon.",
                        },
                        {
                            concern: "Disabled",
                            implementation: "disabled + aria-disabled; data-inactive for styles.",
                        },
                        {
                            concern: "Focus",
                            implementation: "Visible focus ring via refineui.css :focus-visible.",
                        },
                        {
                            concern: "Reduced motion",
                            implementation: "prefers-reduced-motion collapses transform transitions.",
                        },
                    ]}
                />
            </DocSection>

            <DocSection id="usage" title="Usage">
                <Stack gap="sizeMedium">
                    <Text variant="bodyMd" className="m-0 text-refineui-alias-foreground-secondary">
                        Use one primary action per view. Prefer ghost or outline for secondary actions in
                        dense toolbars.
                    </Text>
                    <pre data-docs-ui="code">
                        <code>{`import { Button } from "@refineui/react";

<Button variant="primary" size="md">
  Continue
</Button>`}</code>
                    </pre>
                </Stack>
            </DocSection>

            <DocSection id="do-dont" title="Do / Don't">
                <DoDont
                    doItems={[
                        "Match size to surrounding density (sm in toolbars, md in forms).",
                        "Give icon-only buttons an accessible name.",
                        "Use primary sparingly for the main forward action.",
                    ]}
                    dontItems={[
                        "Stack multiple primary buttons in one action group.",
                        "Invent padding, radius, or transition ms outside tokens.",
                        "Replace Button with a styled <div> for click targets.",
                    ]}
                />
            </DocSection>

            <DocSection id="code" title="Code">
                <pre data-docs-ui="code">
                    <code>{`bun add @refineui/react @refineui/tokens

import { Button } from "@refineui/react";

<Button variant="primary" size="md">Save</Button>
<Button variant="ghost" layout="icon" aria-label="Add">…</Button>
<Button variant="outline" disabled>Unavailable</Button>`}</code>
                </pre>
            </DocSection>
        </Stack>
    );
}
