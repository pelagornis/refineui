import { AVAILABILITY_STATE_CONTRACT, type AvailabilityStateContract } from "./availability";
import {
    type ComponentStateContract,
    type ComponentStateDefinition,
    type ComponentStateSchema,
    defineComponentState,
    expectedComponentStateValues,
    isAllowedComponentState,
    type ComponentStateAttribute,
} from "./component";
import { ENVIRONMENT_STATE_CONTRACT, type EnvironmentStateContract } from "./environment";
import { PSEUDO_STATE_CONTRACT, type PseudoState, type PseudoStateContract } from "./pseudo";

/** RefineUI state contract — four orthogonal state families. */
export type StateContract = Readonly<{
    pseudo: PseudoStateContract;
    component: ComponentStateContract;
    availability: AvailabilityStateContract;
    environment: EnvironmentStateContract;
}>;

export const REFINEUI_STATE_CONTRACT: StateContract = {
    pseudo: PSEUDO_STATE_CONTRACT,
    component: { definitions: [] },
    availability: AVAILABILITY_STATE_CONTRACT,
    environment: ENVIRONMENT_STATE_CONTRACT,
} as const;

export const REFINEUI_DOM_ATTRIBUTES = {
    component: "data-refineui",
    variant: "data-variant",
    size: "data-size",
    state: "data-state",
    inactive: "data-inactive",
} as const;

export type RefineUiDataAttribute =
    (typeof REFINEUI_DOM_ATTRIBUTES)[keyof typeof REFINEUI_DOM_ATTRIBUTES];

/** @deprecated Prefer component spec `states.component` per `data-refineui`. */
export type RefineUiComponentState = string;

export function refineUiStateAttr(
    state: string | undefined,
): { "data-state"?: string } {
    return state && state !== "default" ? { "data-state": state } : {};
}

export {
    AVAILABILITY_STATE_CONTRACT,
    ENVIRONMENT_STATE_CONTRACT,
    PSEUDO_STATE_CONTRACT,
    defineComponentState,
    expectedComponentStateValues,
    isAllowedComponentState,
    type AvailabilityStateContract,
    type ComponentStateAttribute,
    type ComponentStateContract,
    type ComponentStateDefinition,
    type ComponentStateSchema,
    type EnvironmentStateContract,
    type PseudoState,
    type PseudoStateContract,
};
