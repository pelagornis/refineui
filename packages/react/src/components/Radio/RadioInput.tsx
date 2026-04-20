import { clsx } from "clsx";
import { forwardRef } from "react";
import { radioStyles } from "./style";
import type { RadioInputProps } from "./types";

export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(function RadioInput(
    { className, ...props },
    ref,
) {
    return (
        <input
            ref={ref}
            type="radio"
            data-refineui="radio"
            className={clsx(radioStyles.input, className)}
            {...props}
        />
    );
});
