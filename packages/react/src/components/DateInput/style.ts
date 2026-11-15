import { clsx } from "clsx";
import { inputBorderClass, inputSizeClass, inputStyles } from "../Input/style";
import type { DateInputProps } from "./types";

export const dateInputStyles = {
    trigger: (size: NonNullable<DateInputProps["size"]>, error: boolean, success: boolean, disabled: boolean) =>
        clsx(
            inputStyles.base,
            inputStyles.text,
            "flex w-full cursor-pointer items-center justify-between gap-refineui-size-small text-start",
            inputSizeClass[size],
            disabled ? inputBorderClass.disabled : error ? inputBorderClass.error : success ? inputBorderClass.success : inputBorderClass.default,
            disabled ? inputStyles.disabledBg : inputStyles.defaultBg,
            disabled && inputStyles.disabledText,
        ),
    value: "min-w-0 flex-1 truncate",
    placeholder: "text-refineui-alias-foreground-placeholder",
    icon: "shrink-0 text-refineui-alias-foreground-secondary",
    calendar: "bg-transparent",
    calendarContent: "border-none bg-transparent",
} as const;
