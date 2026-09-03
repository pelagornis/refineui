/**
 * Availability — whether the control accepts interaction (not visual component state).
 */
export type AvailabilitySignal =
    | "disabled"
    | "readonly"
    | "aria-disabled"
    | "inert"
    | "data-inactive";

export type AvailabilityStateContract = Readonly<{
    signals: readonly AvailabilitySignal[];
    attributes: readonly ("disabled" | "readOnly" | "aria-disabled" | "inert" | "data-inactive")[];
}>;

export const AVAILABILITY_STATE_CONTRACT: AvailabilityStateContract = {
    signals: ["disabled", "readonly", "aria-disabled", "inert", "data-inactive"],
    attributes: ["disabled", "readOnly", "aria-disabled", "inert", "data-inactive"],
} as const;
