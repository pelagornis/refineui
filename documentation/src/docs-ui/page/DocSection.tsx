import type { ReactNode } from "react";
import { Stack, Text } from "@refineui/react";

/** Named documentation section — compact, data-first. */
export function DocSection({
    id,
    title,
    description,
    children,
}: {
    id?: string;
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section data-docs-ui="section" id={id} className="w-full min-w-0">
            <Stack gap="sizeLarge">
                <Stack gap="sizeXXXSmall">
                    <Text as="h2" variant="titleSm" className="m-0">
                        {title}
                    </Text>
                    {description ? (
                        <Text
                            as="p"
                            variant="bodyMd"
                            className="m-0 text-refineui-alias-foreground-secondary"
                        >
                            {description}
                        </Text>
                    ) : null}
                </Stack>
                {children}
            </Stack>
        </section>
    );
}
