import type {
    ButtonHTMLAttributes,
    HTMLAttributes,
    InputHTMLAttributes,
    ReactNode,
} from "react";

export interface SearchFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
    /** Controlled query */
    value?: string;
    /** Uncontrolled initial query */
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    /**
     * `filled` — standalone control (sunken surface).
     * `plain` — flush row for composed surfaces like Command.
     * @default "filled"
     */
    appearance?: "filled" | "plain";
    /**
     * Control size — same tiers as Input. Inherits from `Field` when omitted.
     * `plain` only takes the size's typography and icon sizes.
     * @default "md"
     */
    size?: "sm" | "md" | "lg";
    /** Forwarded to the inner input. */
    id?: string;
    /** Accessible name for the search input. */
    "aria-label"?: string;
}

export type SearchFieldIconProps = HTMLAttributes<HTMLSpanElement> & {
    /** Defaults to the search glyph */
    children?: ReactNode;
};

export type SearchFieldInputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "value" | "defaultValue" | "disabled"
>;

export type SearchFieldClearProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
    /** Defaults to the dismiss glyph */
    children?: ReactNode;
};
