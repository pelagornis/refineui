import { clsx } from "clsx";
import {
    createContext,
    forwardRef,
    useCallback,
    useContext,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { iconSizes } from "@refineui/tokens";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentSizes } from "../../componentSizes";
import { componentColorTokens } from "../../tokens/componentColorTokens";
import { WebIcon } from "../../WebIcon";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Button } from "../Button";
import { drawerStyles } from "./style";
import type {
    DrawerBodyProps,
    DrawerCloseProps,
    DrawerContentProps,
    DrawerDescriptionProps,
    DrawerFooterProps,
    DrawerHeaderProps,
    DrawerPlacement,
    DrawerProps,
    DrawerSize,
    DrawerTitleProps,
    DrawerTriggerProps,
} from "./types";

const PANEL_MS = 320;
const SCRIM_MS = 280;
const EASING = "cubic-bezier(0.32, 0.72, 0, 1)";

type DrawerContextValue = {
    open: boolean;
    setOpen: (next: boolean) => void;
    placement: DrawerPlacement;
    size: DrawerSize;
    titleId: string;
    descriptionId: string;
    panelRef: RefObject<HTMLDivElement>;
    hasTitle: boolean;
    setHasTitle: (v: boolean) => void;
    hasDescription: boolean;
    setHasDescription: (v: boolean) => void;
};

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext(component: string): DrawerContextValue {
    const ctx = useContext(DrawerContext);
    if (!ctx) throw new Error(`${component} must be used within <Drawer>`);
    return ctx;
}

function useDrawerOpenState(
    openProp: boolean | undefined,
    defaultOpen: boolean | undefined,
    onOpenChange: ((open: boolean) => void) | undefined,
): [boolean, (next: boolean) => void] {
    const [internalOpen, setInternalOpen] = useState(!!defaultOpen);
    const isControlled = openProp !== undefined;
    const open = isControlled ? !!openProp : internalOpen;
    const setOpen = useCallback(
        (next: boolean) => {
            if (!isControlled) setInternalOpen(next);
            onOpenChange?.(next);
        },
        [isControlled, onOpenChange],
    );
    return [open, setOpen];
}

function widthToken(s: DrawerSize): string {
    switch (s) {
        case "medium":
            return componentSizes.drawerWidthMd;
        case "large":
            return componentSizes.drawerWidthLg;
        default:
            return componentSizes.drawerWidthSm;
    }
}

export function Drawer({
    open: openProp,
    defaultOpen,
    onOpenChange,
    placement = "right",
    size = "small",
    children,
}: DrawerProps) {
    const [open, setOpen] = useDrawerOpenState(openProp, defaultOpen, onOpenChange);
    const titleId = useId();
    const descriptionId = useId();
    const panelRef = useRef<HTMLDivElement>(null);
    const [hasTitle, setHasTitle] = useState(false);
    const [hasDescription, setHasDescription] = useState(false);

    const value = useMemo(
        () => ({
            open,
            setOpen,
            placement,
            size,
            titleId,
            descriptionId,
            panelRef,
            hasTitle,
            setHasTitle,
            hasDescription,
            setHasDescription,
        }),
        [
            open,
            setOpen,
            placement,
            size,
            titleId,
            descriptionId,
            hasTitle,
            hasDescription,
        ],
    );

    return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>;
}

export const DrawerTrigger = forwardRef<HTMLButtonElement, DrawerTriggerProps>(function DrawerTrigger(
    { onClick, ...props },
    ref,
) {
    const { setOpen } = useDrawerContext("DrawerTrigger");
    return (
        <Button
            ref={ref}
            {...props}
            onClick={(e) => {
                onClick?.(e);
                if (!e.defaultPrevented) setOpen(true);
            }}
        />
    );
});

export function DrawerContent({
    className,
    style,
    container,
    children,
    placement: placementProp,
    size: sizeProp,
    ...props
}: DrawerContentProps) {
    const {
        open,
        setOpen,
        placement: ctxPlacement,
        size: ctxSize,
        titleId,
        descriptionId,
        panelRef,
        hasTitle,
        hasDescription,
    } = useDrawerContext("DrawerContent");
    const [rendering, setRendering] = useState(open);
    const [entered, setEntered] = useState(false);

    useFocusTrap(open && entered, panelRef);

    useEffect(() => {
        if (open) {
            setRendering(true);
            const id = requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
            return () => cancelAnimationFrame(id);
        }
        setEntered(false);
        const t = window.setTimeout(() => setRendering(false), PANEL_MS);
        return () => window.clearTimeout(t);
    }, [open]);

    useEffect(() => {
        if (!rendering) return;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, [rendering]);

    useEffect(() => {
        if (!rendering || !entered) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [rendering, entered, setOpen]);

    if (!rendering) return null;
    if (typeof document === "undefined") return null;

    const placement = placementProp ?? ctxPlacement;
    const size = sizeProp ?? ctxSize;
    const isLeft = placement === "left";
    const w = widthToken(size);
    const offX = isLeft ? "-100%" : "100%";

    const panelMotion: CSSProperties = {
        width: `min(${w}, 100vw)`,
        maxWidth: w,
        transform: entered ? "translateX(0)" : `translateX(${offX})`,
        transition: `transform ${PANEL_MS}ms ${EASING}`,
        willChange: "transform",
    };

    const target = container ?? document.body;

    const root = (
        <div
            data-refineui="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby={hasTitle ? titleId : undefined}
            aria-describedby={hasDescription ? descriptionId : undefined}
            className={clsx(
                drawerStyles.root,
                isLeft ? drawerStyles.rootLeft : drawerStyles.rootRight,
                className,
            )}
            {...props}
        >
            <div
                role="presentation"
                className={drawerStyles.scrim}
                style={{
                    backgroundColor: resolveColorTokenValue(componentColorTokens.drawer.overlay),
                    opacity: entered ? 1 : 0,
                    transition: `opacity ${SCRIM_MS}ms ${EASING}`,
                    pointerEvents: entered ? "auto" : "none",
                }}
                onClick={() => setOpen(false)}
                aria-hidden
            />
            <div
                ref={panelRef}
                tabIndex={-1}
                className={drawerStyles.panel}
                style={{ ...panelMotion, ...style }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );

    return createPortal(root, target);
}

export function DrawerHeader({
    className,
    children,
    showClose = true,
    actions,
    ...props
}: DrawerHeaderProps) {
    return (
        <div
            data-name="Drawer / Header"
            className={clsx(
                drawerStyles.header,
                className,
            )}
            {...props}
        >
            <div className={drawerStyles.headerMain}>
                {showClose ? <DrawerClose /> : null}
                <div className={drawerStyles.headerMainText}>{children}</div>
            </div>
            {actions ? (
                <div className={drawerStyles.headerActions}>{actions}</div>
            ) : null}
        </div>
    );
}

export function DrawerTitle({ className, id, children, ...props }: DrawerTitleProps) {
    const { titleId, setHasTitle } = useDrawerContext("DrawerTitle");
    useEffect(() => {
        setHasTitle(true);
        return () => setHasTitle(false);
    }, [setHasTitle]);
    return (
        <h2
            id={id ?? titleId}
            className={clsx(drawerStyles.title, className)}
            {...props}
        >
            {children}
        </h2>
    );
}

export function DrawerDescription({ className, id, children, ...props }: DrawerDescriptionProps) {
    const { descriptionId, setHasDescription } = useDrawerContext("DrawerDescription");
    useEffect(() => {
        setHasDescription(true);
        return () => setHasDescription(false);
    }, [setHasDescription]);
    return (
        <p
            id={id ?? descriptionId}
            className={clsx(drawerStyles.description, className)}
            {...props}
        >
            {children}
        </p>
    );
}

export function DrawerBody({ className, ...props }: DrawerBodyProps) {
    return (
        <div
            data-name="Body"
            className={clsx(
                drawerStyles.body,
                className,
            )}
            {...props}
        />
    );
}

export function DrawerFooter({ className, ...props }: DrawerFooterProps) {
    return (
        <div
            data-name="Drawer / Footer"
            className={clsx(
                drawerStyles.footer,
                className,
            )}
            {...props}
        />
    );
}

export function DrawerClose({
    children,
    onClick,
    className,
    type = "button",
    variant,
    size,
    layout,
    ...props
}: DrawerCloseProps) {
    const { setOpen } = useDrawerContext("DrawerClose");
    const iconOnly = children == null;

    return (
        <Button
            {...props}
            type={type}
            variant={variant ?? (iconOnly ? "ghost" : "outline")}
            size={size ?? (iconOnly ? "sm" : "md")}
            layout={layout ?? (iconOnly ? "icon" : "label")}
            aria-label={iconOnly ? "닫기" : undefined}
            className={className}
            onClick={(e) => {
                onClick?.(e);
                if (!e.defaultPrevented) setOpen(false);
            }}
        >
            {iconOnly ? (
                <WebIcon name="dismiss" size={iconSizes.xlarge} color="currentColor" iconStyle="regular" aria-hidden />
            ) : (
                children
            )}
        </Button>
    );
}
