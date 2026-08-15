import { clsx } from "clsx";
import { layoutStyles } from "./style";
import type { SpacerProps } from "./types";

/** Flex-grow filler between Stack children. */
export function Spacer({ className, ...props }: SpacerProps) {
    return <div data-refineui="spacer" className={clsx(layoutStyles.spacer, className)} {...props} />;
}
