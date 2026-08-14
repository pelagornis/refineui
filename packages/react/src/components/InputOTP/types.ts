import type { HTMLAttributes, InputHTMLAttributes } from "react";
import type { FormControlSize } from "../../formControlSizes";

export type InputOTPSize = FormControlSize;

export interface InputOTPProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    /** Controlled OTP string. */
    value?: string;
    /** Uncontrolled initial value. */
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    /** Number of slots (must match rendered `InputOTPSlot` indices). */
    maxLength: number;
    size?: InputOTPSize;
    disabled?: boolean;
    /**
     * Per-character allowlist. Default: digits only (`/\d/`).
     * Characters that fail the test are dropped.
     */
    pattern?: RegExp;
    autoFocus?: boolean;
    name?: string;
    id?: string;
    inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
    autoComplete?: InputHTMLAttributes<HTMLInputElement>["autoComplete"];
    /** Accessible name for the control. */
    "aria-label"?: string;
}

export interface InputOTPSlotProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        "size" | "value" | "defaultValue" | "maxLength" | "disabled" | "type" | "children"
    > {
    /** Zero-based slot index. */
    index: number;
}
