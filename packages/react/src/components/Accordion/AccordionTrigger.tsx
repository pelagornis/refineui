import { clsx } from "clsx";
import type { HTMLAttributes, KeyboardEvent } from "react";
import { useContext } from "react";
import { iconSizes } from "@refineui/tokens";
import { WebIcon } from "../../WebIcon";
import { AccordionContext, AccordionItemContext } from "./context";
import { accordionStyles, triggerTypo } from "./style";

export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {}

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
    const accordion = useContext(AccordionContext);
    const item = useContext(AccordionItemContext);
    if (!accordion || !item) throw new Error("AccordionTrigger must be used within AccordionItem.");

    const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                accordion.focusByDelta(item.value, 1);
                break;
            case "ArrowUp":
                e.preventDefault();
                accordion.focusByDelta(item.value, -1);
                break;
            case "Home":
                e.preventDefault();
                accordion.focusFirst();
                break;
            case "End":
                e.preventDefault();
                accordion.focusLast();
                break;
            default:
                break;
        }
    };

    return (
        <button
            ref={(el) => accordion.registerTrigger(item.value, el)}
            type="button"
            data-refineui="accordion-trigger"
            aria-expanded={item.open}
            aria-controls={item.panelId}
            id={item.triggerId}
            onClick={() => accordion.toggle(item.value)}
            onKeyDown={onTriggerKeyDown}
            className={clsx(triggerTypo[accordion.size], accordionStyles.triggerBase, className)}
            {...props}
        >
            <span className={accordionStyles.triggerRow}>
                {item.icon ? <WebIcon name={item.icon} size={iconSizes.small} color="currentColor" /> : null}
                {children}
            </span>
            <WebIcon
                name={item.open ? "chevron-up" : "chevron-down"}
                size={iconSizes.small}
                color="currentColor"
                fallback="▼"
            />
        </button>
    );
}

