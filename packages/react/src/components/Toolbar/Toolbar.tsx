import { clsx } from "clsx";
import { forwardRef, useCallback, useContext, useRef, useState, type FocusEvent, type KeyboardEvent, type Ref } from "react";
import { Button } from "../Button";
import { useIsomorphicLayoutEffect } from "../Dropdown/positioning";
import { FieldSizeContext } from "../Field/context";
import { ToolbarOrientationContext, ToolbarSizeContext, useOptionalToolbarSize } from "./context";
import { buttonGroupStyles } from "../ButtonGroup/style";
import { toolbarStyles } from "./style";
import type { ToolbarButtonProps, ToolbarGroupProps, ToolbarProps, ToolbarDividerProps, ToolbarToggleButtonProps } from "./types";

/** Focus candidates. `a[href]` catches a Button rendered as a link. */
const ITEM_SELECTOR = 'button, input, select, textarea, a[href], [tabindex], [data-toolbar-item]';
/** Nested toolbars and popover content own their own focus. */
const BOUNDARY_SELECTOR = '[role="toolbar"], [popover], [data-refineui="popover"]';
/** Composite widgets (Tabs, SegmentedControl, …) manage their own roving tabindex; the toolbar only visits their active item. */
const COMPOSITE_SELECTOR = '[role="tablist"], [role="radiogroup"], [role="listbox"], [role="menubar"], [role="grid"], [role="tree"]';

function isFocusable(item: HTMLElement) {
    if ((item as HTMLButtonElement).disabled || item.getAttribute("aria-disabled") === "true") return false;
    if (item.hidden || item.closest("[inert]")) return false;
    if (item instanceof HTMLInputElement && item.type === "hidden") return false;
    return true;
}

function isTextField(element: HTMLElement): element is HTMLInputElement | HTMLTextAreaElement {
    if (element instanceof HTMLTextAreaElement) return true;
    return element instanceof HTMLInputElement && ["text", "search", "url", "tel", "email", "password", "number", ""].includes(element.type);
}

/** Caret guard: inside a text field the arrow keys move the caret until it reaches an edge. */
function caretBlocks(element: HTMLElement, forward: boolean) {
    if (!isTextField(element)) return false;
    try {
        const { selectionStart, selectionEnd, value } = element;
        if (selectionStart == null || selectionEnd == null) return false;
        if (selectionStart !== selectionEnd) return true;
        return forward ? selectionEnd < value.length : selectionStart > 0;
    } catch {
        return false;
    }
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
    if (typeof ref === "function") ref(value);
    else if (ref) (ref as { current: T | null }).current = value;
}

/**
 * A container for interactive controls with arrow-key navigation (WAI-ARIA toolbar pattern):
 * one Tab stop, arrow keys (mirrored in RTL) plus Home/End between items. Compose it from
 * ToolbarGroup, ToolbarButton, ToolbarToggleButton and ToolbarDivider. `size` cascades to
 * Buttons and Field controls inside; `attached` floats it on a raised surface.
 */
export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar(
    {
        label,
        attached = false,
        orientation = "horizontal",
        size = "sm",
        loop = true,
        className,
        children,
        "aria-label": ariaLabel,
        onKeyDown,
        onFocus,
        ...props
    },
    ref,
) {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const activeRef = useRef<HTMLElement | null>(null);

    const items = useCallback(() => {
        const row = rootRef.current;
        if (!row) return [];
        const seenComposites = new Set<Element>();
        return Array.from(row.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter((item) => {
            const boundary = item.parentElement?.closest(BOUNDARY_SELECTOR);
            if (boundary && boundary !== row && row.contains(boundary)) return false;
            if (item.getAttribute("tabindex") === "-1" && !item.closest(COMPOSITE_SELECTOR) && !item.matches("[data-toolbar-managed]")) return false;
            const composite = item.closest(COMPOSITE_SELECTOR);
            if (composite && row.contains(composite)) {
                // Visit only the composite's own tab stop (or its first item).
                if (seenComposites.has(composite)) return false;
                const own = composite.querySelector<HTMLElement>('[tabindex="0"]') ?? item;
                if (own !== item) return false;
                seenComposites.add(composite);
            }
            return isFocusable(item);
        });
    }, []);

    const isManaged = (item: HTMLElement) => {
        const composite = item.closest(COMPOSITE_SELECTOR);
        return !(composite && rootRef.current?.contains(composite));
    };

    const applyTabStops = useCallback(
        (active: HTMLElement | undefined) => {
            for (const item of items()) {
                if (!isManaged(item)) continue;
                item.setAttribute("data-toolbar-managed", "");
                item.tabIndex = item === active ? 0 : -1;
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [items],
    );

    // Roving tabindex: one item (the last focused, else the first) is the toolbar's Tab stop.
    useIsomorphicLayoutEffect(() => {
        const list = items();
        applyTabStops(activeRef.current && list.includes(activeRef.current) ? activeRef.current : list[0]);
    });

    const focusItem = (item: HTMLElement | undefined) => {
        if (!item) return;
        activeRef.current = item;
        applyTabStops(item);
        item.focus();
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
        const target = event.target as HTMLElement;
        const list = items();
        const current = list.find((item) => item === target || (item.closest(COMPOSITE_SELECTOR) && item.closest(COMPOSITE_SELECTOR) === target.closest(COMPOSITE_SELECTOR)));
        if (!current) return;
        const index = list.indexOf(current);
        const rtl = rootRef.current ? getComputedStyle(rootRef.current).direction === "rtl" : false;
        const nextKey = orientation === "vertical" ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
        const prevKey = orientation === "vertical" ? "ArrowUp" : rtl ? "ArrowRight" : "ArrowLeft";
        let next: number | undefined;
        if (event.key === nextKey) {
            if (caretBlocks(target, true)) return;
            next = index + 1 < list.length ? index + 1 : loop ? 0 : index;
        } else if (event.key === prevKey) {
            if (caretBlocks(target, false)) return;
            next = index > 0 ? index - 1 : loop ? list.length - 1 : index;
        } else if (event.key === "Home" && !isTextField(target)) next = 0;
        else if (event.key === "End" && !isTextField(target)) next = list.length - 1;
        if (next === undefined || list[next] === current) return;
        event.preventDefault();
        const destination = list[next];
        focusItem(destination);
        if (isTextField(destination)) {
            const position = event.key === prevKey || event.key === "End" ? destination.value.length : 0;
            try {
                destination.setSelectionRange(position, position);
            } catch {
                /* number inputs do not support selection */
            }
        }
    };

    const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
        onFocus?.(event);
        const target = event.target as HTMLElement;
        const item = items().find((candidate) => candidate === target || candidate.contains(target));
        if (item) {
            activeRef.current = item;
            applyTabStops(item);
        }
    };

    return (
        <ToolbarSizeContext.Provider value={size}>
            <FieldSizeContext.Provider value={size}>
                <ToolbarOrientationContext.Provider value={orientation}>
                    <div
                        ref={(node) => {
                            rootRef.current = node;
                            assignRef(ref, node);
                        }}
                        role="toolbar"
                        aria-label={label ?? ariaLabel ?? "Toolbar"}
                        aria-orientation={orientation}
                        data-refineui="toolbar"
                        data-size={size}
                        data-orientation={orientation}
                        data-attached={attached ? "true" : undefined}
                        className={clsx(
                            toolbarStyles.root,
                            orientation === "vertical" && toolbarStyles.vertical,
                            attached && [toolbarStyles.attached, toolbarStyles.attachedRadius[size]],
                            className,
                        )}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        {...props}
                    >
                        {children}
                    </div>
                </ToolbarOrientationContext.Provider>
            </FieldSizeContext.Provider>
        </ToolbarSizeContext.Provider>
    );
});

/** Groups related controls in the same tube as ButtonGroup: one track whose corners follow the Button radius. */
export function ToolbarGroup({ orientation: orientationProp, className, ...props }: ToolbarGroupProps) {
    const inherited = useContext(ToolbarOrientationContext);
    const size = useOptionalToolbarSize() ?? "sm";
    const orientation = orientationProp ?? inherited;
    const vertical = orientation === "vertical";
    return (
        <div
            data-refineui="toolbar-group"
            data-orientation={orientation}
            role="group"
            className={clsx(
                toolbarStyles.group,
                vertical && toolbarStyles.groupVertical,
                buttonGroupStyles.attached,
                buttonGroupStyles.attachedRadius[size],
                className,
            )}
            {...props}
        />
    );
}

export function ToolbarDivider({ orientation: orientationProp, className, ...props }: ToolbarDividerProps) {
    const inherited = useContext(ToolbarOrientationContext);
    const orientation = orientationProp ?? inherited;
    return (
        <div
            data-refineui="toolbar-divider"
            data-orientation={orientation}
            role="separator"
            aria-orientation={orientation === "horizontal" ? "vertical" : "horizontal"}
            className={clsx(
                toolbarStyles.divider,
                orientation === "horizontal" ? toolbarStyles.dividerHorizontal : toolbarStyles.dividerVertical,
                className,
            )}
            {...props}
        />
    );
}

/** Icon-first ghost Button for toolbars; its size follows the Toolbar. */
export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(function ToolbarButton(
    { variant = "ghost", layout = "icon", size, ...props },
    ref,
) {
    const toolbarSize = useOptionalToolbarSize();
    return <Button ref={ref} data-refineui="toolbar-button" variant={variant} layout={layout} size={size ?? toolbarSize ?? "sm"} {...props} />;
});

/** A ToolbarButton that stays pressed (`aria-pressed`), e.g. Bold / Italic. */
export const ToolbarToggleButton = forwardRef<HTMLButtonElement, ToolbarToggleButtonProps>(function ToolbarToggleButton(
    { pressed: pressedProp, defaultPressed = false, onPressedChange, onClick, variant = "ghost", ...props },
    ref,
) {
    const [uncontrolled, setUncontrolled] = useState(defaultPressed);
    const pressed = pressedProp ?? uncontrolled;
    return (
        <ToolbarButton
            ref={ref}
            data-refineui="toolbar-toggle-button"
            aria-pressed={pressed}
            data-pressed={pressed ? "true" : undefined}
            /* Pressed state is just the Button's own secondary variant; no custom colors. */
            variant={pressed ? "secondary" : variant}
            onClick={(event) => {
                onClick?.(event);
                if (event.defaultPrevented) return;
                if (pressedProp === undefined) setUncontrolled(!pressed);
                onPressedChange?.(!pressed);
            }}
            {...props}
        />
    );
});
