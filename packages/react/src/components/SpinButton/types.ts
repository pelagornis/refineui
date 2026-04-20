import type { HTMLAttributes } from "react";

export interface SpinButtonProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    /** Web Kit COMPONENT_SET `Spin Button` `561:2067` — Small / Medium / Large */
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
}

