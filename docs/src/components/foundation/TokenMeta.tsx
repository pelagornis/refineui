import type { CSSProperties, ReactNode } from "react";
import { Stack, Text } from "@refineui/react";

export function TokenSwatch({
    className,
    style,
}: {
    className?: string;
    style?: CSSProperties;
}) {
    return (
        <div
            data-refineui-token-swatch
            className={className}
            style={style}
        />
    );
}

export function TokenRow({
    leading,
    name,
    value,
}: {
    leading?: ReactNode;
    name: string;
    value?: string;
}) {
    return (
        <div data-refineui-token-row>
            {leading}
            <Text variant="captionMd" className="m-0 min-w-0 truncate">
                {name}
            </Text>
            {value ? (
                <Text
                    variant="captionSm"
                    className="m-0 shrink-0 text-end text-refineui-alias-foreground-tertiary"
                >
                    {value}
                </Text>
            ) : null}
        </div>
    );
}

export function TokenTable({
    label,
    children,
}: {
    label?: string;
    children: ReactNode;
}) {
    return (
        <Stack gap="sizeSmall" data-refineui-token-table>
            {label ? (
                <Text variant="captionMd" className="m-0 text-refineui-alias-foreground-secondary">
                    {label}
                </Text>
            ) : null}
            <div>{children}</div>
        </Stack>
    );
}

export function ColorRamp({
    fills,
}: {
    fills: { key: string; fill: string }[];
}) {
    return (
        <div data-refineui-color-ramp>
            {fills.map((item) => (
                <div key={item.key} title={item.key} style={{ background: item.fill }} />
            ))}
        </div>
    );
}
