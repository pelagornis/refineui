import type { ReactNode } from "react";
import { Stack, Text } from "@refineui/react";

export function DoDont({
    doItems,
    dontItems,
}: {
    doItems: ReactNode[];
    dontItems: ReactNode[];
}) {
    return (
        <div data-docs-ui="do-dont">
            <Stack gap="sizeSmall" data-docs-ui="do">
                <Text variant="labelSm" className="m-0 text-refineui-alias-foreground-success">
                    Do
                </Text>
                <ul data-docs-ui="rule-list">
                    {doItems.map((item, index) => (
                        <li key={index}>
                            <Text variant="bodyMd" className="m-0 text-refineui-alias-foreground-secondary">
                                {item}
                            </Text>
                        </li>
                    ))}
                </ul>
            </Stack>
            <Stack gap="sizeSmall" data-docs-ui="dont">
                <Text variant="labelSm" className="m-0 text-refineui-alias-foreground-error">
                    Don&apos;t
                </Text>
                <ul data-docs-ui="rule-list">
                    {dontItems.map((item, index) => (
                        <li key={index}>
                            <Text variant="bodyMd" className="m-0 text-refineui-alias-foreground-secondary">
                                {item}
                            </Text>
                        </li>
                    ))}
                </ul>
            </Stack>
        </div>
    );
}
