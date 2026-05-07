import { clsx } from "clsx";
import {
    Children,
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
import { iconSizes, semanticInteraction } from "@refineui/tokens";
import { motionMsToNumber } from "@refineui/utilities/animation";
import { resolveColorTokenValue } from "@refineui/utilities/color";
import { componentSizes } from "../../componentSizes";
import { acquireBodyScrollLock } from "@refineui/utilities/react";
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
    DrawerFooterState,
    DrawerHeaderProps,
    DrawerPlacement,
    DrawerProps,
    DrawerSize,
    DrawerType,
    DrawerTitleProps,
    DrawerTriggerProps,
} from "./types";

const PANEL_MS = motionMsToNumber(semanticInteraction.duration.panel);
const SCRIM_MS = motionMsToNumber(semanticInteraction.duration.overlay);
const EASING = semanticInteraction.easing.panel;

type DrawerContextValue = {
    open: boolean;
    setOpen: (next: boolean) => void;
    placement: DrawerPlacement;
    size: DrawerSize;
    type: DrawerType;
    showFooter: boolean;
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
    type = "overlay",
    showFooter = true,
    placement = "right",
    size = "small",
    children,
}: DrawerProps) {
    const defaultByType = type === "inline" ? true : defaultOpen;
    const [open, setOpen] = useDrawerOpenState(openProp, defaultByType, onOpenChange);
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
            type,
            showFooter,
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
            type,
            showFooter,
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
    type: typeProp,
    showFooter: showFooterProp,
    placement: placementProp,
    size: sizeProp,
    ...props
}: DrawerContentProps) {
    const {
        open,
        setOpen,
        type: ctxType,
        showFooter: ctxShowFooter,
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

    const drawerType = typeProp ?? ctxType;
    const showFooter = showFooterProp ?? ctxShowFooter;
    const isOverlay = drawerType === "overlay";

    useFocusTrap(isOverlay && open && entered, panelRef);

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
        if (!isOverlay || !rendering) return;
        return acquireBodyScrollLock();
    }, [isOverlay, rendering]);

    useEffect(() => {
        if (!isOverlay || !rendering || !entered) return;
        const handler = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOverlay, rendering, entered, setOpen]);

    if (!rendering) return null;
    if (isOverlay && typeof document === "undefined") return null;

    const placement = placementProp ?? ctxPlacement;
    const size = sizeProp ?? ctxSize;
    const isLeft = placement === "left";
    const w = widthToken(size);
    const offX = isLeft ? "-100%" : "100%";

    const panelMotion: CSSProperties = {
        width: `min(${w}, 100vw)`,
        maxWidth: w,
        transform: isOverlay ? (entered ? "translateX(0)" : `translateX(${offX})`) : undefined,
        transition: isOverlay ? `transform ${PANEL_MS}ms ${EASING}` : undefined,
        willChange: isOverlay ? "transform" : undefined,
    };

    const target = isOverlay ? (container ?? document.body) : null;

    const panel = (
        <div
            ref={panelRef}
            tabIndex={isOverlay ? -1 : undefined}
            className={clsx(
                drawerStyles.panel,
                isOverlay ? drawerStyles.panelOverlay : drawerStyles.panelInline,
            )}
            style={{ ...panelMotion, ...style }}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );

    const root = (
        <div
            data-refineui="drawer"
            data-state={entered ? "open" : "closed"}
            role={isOverlay ? "dialog" : undefined}
            aria-modal={isOverlay ? "true" : undefined}
            aria-labelledby={hasTitle ? titleId : undefined}
            aria-describedby={hasDescription ? descriptionId : undefined}
            className={clsx(
                isOverlay ? drawerStyles.root : drawerStyles.inlineRoot,
                isLeft ? drawerStyles.rootLeft : drawerStyles.rootRight,
                className,
            )}
            {...props}
        >
            {isOverlay ? (
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
            ) : null}
            {panel}
        </div>
    );

    return isOverlay && target ? createPortal(root, target) : root;
}

export function DrawerHeader({
    className,
    children,
    showClose = true,
    actions,
    ...props
}: DrawerHeaderProps) {
    const hasActions = actions != null;
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
                <div className={drawerStyles.headerMainText}>{children}</div>
                {hasActions ? (
                    <div className={drawerStyles.headerActions}>{actions}</div>
                ) : null}
                {showClose ? <DrawerClose /> : null}
            </div>
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
    const { showFooter } = useDrawerContext("DrawerFooter");
    if (!showFooter) return null;
    const { children, state, ...rest } = props;
    const count = Children.count(children);
    const resolvedState: DrawerFooterState = state ?? (count <= 1 ? "single" : count === 2 ? "split" : "icons");
    return (
        <div
            data-name="Drawer / Footer"
            className={clsx(
                drawerStyles.footerRoot,
                className,
            )}
            {...rest}
        >
            <div
                data-state={resolvedState}
                className={clsx(
                    drawerStyles.footer,
                    resolvedState === "single" && drawerStyles.footerSingle,
                    resolvedState === "split" && drawerStyles.footerSplit,
                )}
            >
                {children}
            </div>
        </div>
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
            size={size ?? "md"}
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
