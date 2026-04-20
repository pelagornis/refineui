import { createContext, useContext } from "react";
import type { AlertVariant } from "./types";

export const AlertContext = createContext<AlertVariant | null>(null);

export function useAlertVariant(): AlertVariant {
    return useContext(AlertContext) ?? "info";
}

