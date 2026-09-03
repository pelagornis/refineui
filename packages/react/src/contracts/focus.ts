/**
 * Focus contracts — visual (:focus-visible) and behavior (trap, initial, return).
 * Doctor validates declared structure/patterns only — not full runtime focus proof.
 */

export type FocusVisualSelector = ":focus-visible" | (string & {});

export type FocusVisualContract = Readonly<{
    required: boolean;
    selector: FocusVisualSelector;
}>;

export type FocusInitialTarget = "first-focusable" | (string & {});

export type FocusReturnTarget = "trigger" | (string & {});

export type FocusBehaviorContract = Readonly<{
    trap?: boolean;
    initial?: FocusInitialTarget;
    return?: FocusReturnTarget;
    roving?: boolean;
}>;

export type FocusContract = Readonly<{
    visual?: FocusVisualContract;
    behavior?: FocusBehaviorContract;
}>;
