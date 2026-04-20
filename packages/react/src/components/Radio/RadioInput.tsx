import { clsx } from "clsx";
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

/** `Radio` 행과 동일한 MCP(`Radio / Input`) 스타일 — `data-refineui="radio"` */
export interface RadioInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {}

export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(function RadioInput(
    { className, ...props },
    ref,
) {
    return (
        <input
            ref={ref}
            type="radio"
            data-refineui="radio"
            className={clsx("size-refineui-control-checkbox-radio shrink-0 cursor-pointer", className)}
            {...props}
        />
    );
});
