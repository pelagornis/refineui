import { clsx } from "clsx";
import { kbdStyles } from "./style";
import type { KbdProps } from "./types";

/** A native keyboard-key label for shortcuts and commands. */
export function Kbd({ className, ...props }: KbdProps) {
    return <kbd data-refineui="kbd" className={clsx(kbdStyles.root, className)} {...props} />;
}
