import { createContext, useContext } from "react";
import type { ToolbarOrientation, ToolbarSize } from "./types";

export const ToolbarOrientationContext = createContext<ToolbarOrientation>("horizontal");

/** Size a Toolbar cascades to Buttons inside it. `null` outside a Toolbar. */
export const ToolbarSizeContext = createContext<ToolbarSize | null>(null);

export function useOptionalToolbarSize(): ToolbarSize | null {
    return useContext(ToolbarSizeContext);
}
