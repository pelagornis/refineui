import type { ReactNode } from "react";
import {
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectPortal,
    SelectTrigger,
    SelectValue,
    Stack,
    Switch,
    Text,
} from "@refineui/react";

export function ControlSelect<T extends string>({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: T;
    options: readonly T[];
    onChange: (value: T) => void;
}) {
    const id = `docs-control-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
        <Stack gap="sizeXXXSmall" data-docs-ui="control-field">
            <Label htmlFor={id}>{label}</Label>
            <Select
                size="sm"
                value={value}
                onValueChange={(next) => onChange(next as T)}
            >
                <SelectTrigger id={id} aria-label={label} className="w-full min-w-0">
                    <SelectValue />
                </SelectTrigger>
                <SelectPortal>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </SelectPortal>
            </Select>
        </Stack>
    );
}

export function ControlSwitch({
    label,
    checked,
    onCheckedChange,
}: {
    label: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}) {
    return (
        <div data-docs-ui="control-switch">
            <Text as="span" variant="labelSm" className="m-0">
                {label}
            </Text>
            <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
        </div>
    );
}

export function ControlGroup({ children }: { children: ReactNode }) {
    return (
        <div data-docs-ui="control-group" className="w-full min-w-0">
            {children}
        </div>
    );
}
