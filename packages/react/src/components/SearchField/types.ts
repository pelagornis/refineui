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
