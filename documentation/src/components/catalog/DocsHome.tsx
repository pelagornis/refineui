import { Link, Stack, Text } from "@refineui/react";

const GATES = [
    {
        href: "/foundations/",
        title: "Foundations",
        description: "Tokens, type, space, motion — demonstrated live.",
    },
    {
        href: "/components/",
        title: "Components",
        description: "Product components with preview, controls, and specs.",
    },
    {
        href: "/development/",
        title: "Development",
        description: "Install, theme, and motion in code.",
    },
] as const;

export default function DocsHome() {
    return (
        <div data-refineui-home>
            <Stack gap="sizeXXXLarge" data-refineui-home-copy>
                <Stack gap="sizeLarge">
                    <Text as="h1" id="_top" variant="displayLg" data-refineui-home-title className="m-0">
                        RefineUI
                    </Text>
                    <Text as="p" variant="bodyLg" data-refineui-home-lead className="m-0">
                        Precise, compact documentation of the design system — rendered with the same
                        packages as product.
                    </Text>
                </Stack>
                <Stack direction="row" align="center" gap="sizeLarge" wrap>
                    <a href="/development/installation/" data-refineui-home-cta="primary">
                        <Text as="span" variant="labelMd" className="text-inherit">
                            Install
                        </Text>
                    </a>
                    <Link href="/components/button/">Browse Button</Link>
                </Stack>
            </Stack>
            <Stack gap="sizeNone" data-refineui-home-gates>
                {GATES.map((gate) => (
                    <a key={gate.href} href={gate.href} data-refineui-home-gate>
                        <Text as="span" variant="subtitleMd" className="m-0 text-refineui-alias-foreground-primary">
                            {gate.title}
                        </Text>
                        <Text
                            as="span"
                            variant="bodyMd"
                            className="m-0 text-refineui-alias-foreground-secondary"
                        >
                            {gate.description}
                        </Text>
                    </a>
                ))}
            </Stack>
        </div>
    );
}
