import { createContext, useContext } from "react";
import type { ButtonSize, ButtonVariant } from "../Button/types";

export type ButtonGroupContextValue = { size: ButtonSize; variant: ButtonVariant };

/** Size and variant a ButtonGroup cascades to Buttons inside it. `null` outside a ButtonGroup. */
export const ButtonGroupContext = createContext<ButtonGroupContextValue | null>(null);

export function useOptionalButtonGroup(): ButtonGroupContextValue | null {
    return useContext(ButtonGroupContext);
}
