import type {
    ButtonHTMLAttributes,
    HTMLAttributes,
    InputHTMLAttributes,
    ReactNode,
} from "react";
import type { DialogProps } from "../Dialog";

export type CommandFilter = (value: string, search: string, keywords?: string[]) => number;

export interface CommandProps extends HTMLAttributes<HTMLDivElement> {
    /** Controlled search query */
    value?: string;
    /** Uncontrolled initial search query */
    defaultValue?: string;
    onValueChange?: (search: string) => void;
    /** When true (default), filter items by search text */
    shouldFilter?: boolean;
    /** Custom score function — return `0` to hide. Default: substring match */
    filter?: CommandFilter;
    /** Controlled highlighted item value */
    selectedValue?: string;
    /** Uncontrolled initial highlighted item value */
    defaultSelectedValue?: string;
    onSelectedValueChange?: (value: string) => void;
    /** Accessible name for the command root (`aria-label`) */
    label?: string;
}

export interface CommandDialogProps extends DialogProps {
    /** Forwarded to the inner `Command` root */
    commandProps?: Omit<CommandProps, "children">;
}

export type CommandInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "value" | "onChange"> & {
    /** Optional leading icon; defaults to search glyph */
    startIcon?: ReactNode;
};

export type CommandListProps = HTMLAttributes<HTMLDivElement>;

export type CommandEmptyProps = HTMLAttributes<HTMLDivElement>;

export type CommandGroupProps = HTMLAttributes<HTMLDivElement>;

export type CommandGroupHeadingProps = HTMLAttributes<HTMLDivElement>;

export type CommandSeparatorProps = HTMLAttributes<HTMLDivElement>;

export interface CommandItemProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onSelect"> {
    /** Unique value used for filtering, selection, and `onSelect` */
    value: string;
    /** Extra strings included in the default filter */
    keywords?: string[];
    /** Called when the item is activated (click / Enter) */
    onSelect?: (value: string) => void;
    /** Keep mounted even when filtered out */
    forceMount?: boolean;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    shortcut?: ReactNode;
}

export type CommandShortcutProps = HTMLAttributes<HTMLSpanElement>;
