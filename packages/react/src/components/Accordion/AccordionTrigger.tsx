import { clsx } from "clsx";
import type { HTMLAttributes, KeyboardEvent } from "react";
import { useContext } from "react";
import { WebIcon } from "../../WebIcon";
import { AccordionContext, AccordionItemContext } from "./context";
import { accordionIconSize, accordionStyles, triggerTypo } from "./style";

export interface AccordionTriggerProps extends HTMLAttributes<HTMLButtonElement> {}

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
    const accordion = useContext(AccordionContext);
    const item = useContext(AccordionItemContext);
    if (!accordion || !item) throw new Error("AccordionTrigger must be used within AccordionItem.");

    const iconSize = accordionIconSize[accordion.size];

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
            className={clsx(accordionStyles.triggerBase, className)}
            {...props}
        >
            <span className={clsx(accordionStyles.triggerRow, triggerTypo[accordion.size])}>
                {item.icon ? <WebIcon name={item.icon} size={iconSize} color="currentColor" /> : null}
                {children}
            </span>
            <WebIcon
                name="chevron-down"
                size={iconSize}
                color="currentColor"
                fallback="▼"
                className={clsx(
                    accordionStyles.chevron,
                    item.open && accordionStyles.chevronOpen,
                    accordion.reduceMotion && "transition-none",
                )}
            />
        </button>
    );
}
