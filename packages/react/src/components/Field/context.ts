import { createContext, useContext } from "react";
import type { FieldProps } from "./types";

type FieldSize = NonNullable<FieldProps["size"]>;

export const FieldSizeContext = createContext<FieldSize | null>(null);

/** `null` outside `Field` — controls inherit only when wrapped. */
export function useOptionalFieldSize(): FieldSize | null {
    return useContext(FieldSizeContext);
}

export function useFieldSize(): FieldSize {
    return useContext(FieldSizeContext) ?? "lg";
}
