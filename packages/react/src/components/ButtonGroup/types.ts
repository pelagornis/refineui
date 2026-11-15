import type { HTMLAttributes } from "react";
import type { ButtonSize, ButtonVariant } from "../Button/types";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
    /** Cascades to every Button inside unless a Button sets its own. */
    size?: ButtonSize;
    /** Cascades to every Button inside unless a Button sets its own. */
    variant?: ButtonVariant;
    orientation?: ButtonGroupOrientation;
    /** Wrap the buttons in one tube outline (default). `false` only spaces them. */
    attached?: boolean;
}
