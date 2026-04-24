import { createContext, useContext } from "react";
import type { FieldProps } from "./types";

type FieldSize = NonNullable<FieldProps["size"]>;

export const FieldSizeContext = createContext<FieldSize>("md");

export function useFieldSize(): FieldSize {
    return useContext(FieldSizeContext);
}
